import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withSite } from '../lib/harness.mjs';

const TITLES = ['Websites & Sichtbarkeit', 'Individuelle Software', 'Automatisierungen & KI'];

test('Leistungen: drei Blöcke, vollständig sichtbar ohne Klick, keine Aufklapper', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    assert.deepEqual((await page.locator('#leistungen .service h3').allInnerTexts()).map(t => t.trim()), TITLES);
    assert.equal(await page.locator('#leistungen details, #leistungen summary').count(), 0);
    for (const s of await page.locator('#leistungen .service__body').all()) {
      assert.ok((await s.innerText()).length > 120, 'Text zu kurz');
      assert.equal(await s.locator('.ziel').count(), 1, 'Zeile „Ziel“ fehlt');
    }
  });
});

test('Leistungen: breit und hoch bleibt die aktive Zeichnung sticky und überlappt den Text nicht', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('#leistungen .schema').first().evaluate(el => getComputedStyle(el).position), 'sticky');
    const top = await page.evaluate(() => document.querySelector('#leistungen .service-list').getBoundingClientRect().top + scrollY);
    const measure = async y => {
      await page.evaluate(v => scrollTo(0, v), y);
      await page.waitForTimeout(700);
      return page.evaluate(() => {
        const f = document.querySelector('#leistungen .schema.is-active');
        const b = document.querySelector('#leistungen .service__body.is-current') || document.querySelector('#leistungen .service__body');
        return { y: Math.round(f.getBoundingClientRect().top), right: f.getBoundingClientRect().right, bodyLeft: b.getBoundingClientRect().left };
      });
    };
    const a = await measure(top + 120);
    const b = await measure(top + 420);
    assert.equal(a.y, b.y, 'Zeichnung bewegt sich beim Scrollen mit');
    assert.ok(a.right <= a.bodyLeft, 'Zeichnung überlappt den Text');
    // Der Wechsel folgt dem Text: weiter unten ist eine andere Zeichnung aktiv.
    const first = await page.evaluate(() => document.querySelector('#leistungen .schema.is-active').dataset.index);
    await page.evaluate(v => scrollTo(0, v), top + 1500);
    await page.waitForTimeout(900);
    const later = await page.evaluate(() => document.querySelector('#leistungen .schema.is-active').dataset.index);
    assert.notEqual(first, later);
  });
});

test('Leistungen: niedrige und schmale Fenster nutzen den normalen Fluss ohne Sticky', async () => {
  await withSite(async ({ origin, newPage }) => {
    for (const vp of [{ width: 1024, height: 600 }, { width: 390, height: 844 }]) {
      const page = await newPage({ viewport: vp });
      await page.goto(origin + '/', { waitUntil: 'networkidle' });
      const pos = await page.locator('#leistungen .schema').evaluateAll(els => els.map(e => getComputedStyle(e).position));
      assert.ok(pos.every(p => p !== 'sticky'), JSON.stringify(pos));
      const hidden = await page.locator('#leistungen .schema').evaluateAll(els => els.filter(e => getComputedStyle(e).visibility === 'hidden' || getComputedStyle(e).display === 'none').length);
      assert.equal(hidden, 0);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.close();
    }
  });
});

test('Leistungen: ohne JavaScript sind alle Zeichnungen sichtbar und vollständig gezeichnet', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage({ javaScriptEnabled: false });
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('#leistungen .schema').count(), 3);
    const state = await page.locator('#leistungen .schema .draw').evaluateAll(els => els.map(e => getComputedStyle(e).strokeDashoffset));
    assert.ok(state.length > 30, 'zu wenige Zeichenpfade');
    assert.ok(state.every(v => v === '0px' || v === 'none' || v === '0'), [...new Set(state)].join());
    const visible = await page.locator('#leistungen .schema').evaluateAll(els => els.every(e => getComputedStyle(e).opacity === '1' && getComputedStyle(e).visibility === 'visible'));
    assert.equal(visible, true);
  });
});

test('Leistungen: Zeichnungen werden gezeichnet, sobald sie aktiv sind, und enden vollständig', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    // schrittweise wie ein Mensch von oberhalb der Liste bis ans Ende scrollen
    const total = await page.evaluate(() => { const l = document.querySelector('#leistungen .service-list'); return { top: l.getBoundingClientRect().top + scrollY, h: l.offsetHeight }; });
    for (let y = total.top - 300; y < total.top + total.h; y += 140) { await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(120); }
    await page.waitForTimeout(2200);
    const drawn = await page.locator('#leistungen .schema').evaluateAll(els => els.map(e => [e.hasAttribute('data-drawn'), [...e.querySelectorAll('.draw')].every(p => parseFloat(getComputedStyle(p).strokeDashoffset) === 0)]));
    assert.deepEqual(drawn, [[true, true], [true, true], [true, true]]);
  });
});

test('Leistungen: reduzierte Bewegung blendet ohne Übergang um', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage({ reducedMotion: 'reduce' });
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    const dur = await page.locator('#leistungen .schema').first().evaluate(e => getComputedStyle(e).transitionDuration);
    assert.equal(dur, '0s');
    const dashes = await page.locator('#leistungen .schema .draw').evaluateAll(els => els.every(p => parseFloat(getComputedStyle(p).strokeDashoffset) === 0));
    assert.equal(dashes, true);
  });
});

test('Leistungen: keine Barrierefreiheitsverstöße (390 und 1440)', async () => {
  await withSite(async ({ origin, newPage, axe }) => {
    for (const width of [390, 1440]) {
      const page = await newPage({ viewport: { width, height: 900 } });
      await page.goto(origin + '/', { waitUntil: 'networkidle' });
      await page.waitForFunction(() => window.__heroDoneAt);
      const v = await axe(page);
      assert.deepEqual(v.map(x => x.id + ': ' + x.nodes.map(n => n.target).join(' ')), []);
      await page.close();
    }
  });
});

test('Leistungen: leitende Achse zwischen Zeichnung und Text, füllt sich beim Scrollen und hat einen Punkt je Leistung', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    const geo = await page.evaluate(() => {
      const nodes = [...document.querySelectorAll('#leistungen .service__node')];
      const fig = document.querySelector('#leistungen .schema.is-active').getBoundingClientRect();
      const body = document.querySelector('#leistungen .service__body').getBoundingClientRect();
      return { n: nodes.length, display: nodes.map(n => getComputedStyle(n).display), x: nodes.map(n => { const r = n.getBoundingClientRect(); return r.left + r.width / 2; }), w: nodes.map(n => n.getBoundingClientRect().width), figRight: fig.right, bodyLeft: body.left };
    });
    assert.equal(geo.n, 3);
    assert.ok(geo.display.every(d => d === 'block'));
    assert.ok(geo.w.every(w => w === 1), 'Linie ist 1 px stark: ' + geo.w);
    for (const x of geo.x) assert.ok(x > geo.figRight && x < geo.bodyLeft, `Achse ${x} liegt zwischen Zeichnung ${geo.figRight} und Text ${geo.bodyLeft}`);
    const state = () => page.evaluate(() => [...document.querySelectorAll('#leistungen .service__node')].map(n => [parseFloat(n.style.getPropertyValue('--p') || '0'), n.classList.contains('is-passed')]));
    const top = await page.evaluate(() => document.querySelector('#leistungen .service-list').getBoundingClientRect().top + scrollY);
    const h = await page.evaluate(() => document.querySelector('#leistungen .service-list').offsetHeight);
    await page.evaluate(v => scrollTo({ top: v, behavior: 'instant' }), top - 500);
    await page.waitForTimeout(500);
    assert.deepEqual((await state()).map(s => s[1]), [false, false, false]);
    await page.evaluate(v => scrollTo({ top: v, behavior: 'instant' }), top + h * 0.5 - 450);
    await page.waitForTimeout(500);
    const mid = await state();
    assert.ok(mid[0][0] > 0.9 && mid[0][1], 'erste Leistung durchlaufen');
    assert.ok(mid[1][0] > 0 && mid[1][0] < 1, 'zweite Leistung läuft gerade');
    assert.equal(mid[2][1], false);
    await page.evaluate(v => scrollTo({ top: v, behavior: 'instant' }), top + h - 300);
    await page.waitForTimeout(500);
    const end = await state();
    assert.ok(end.every(s => s[1]), 'alle Punkte blau am Ende');
    assert.ok(end[0][0] > 0.99 && end[1][0] > 0.99);
  });
});

test('Leistungen: ohne Bühne (niedrig, schmal, ohne JS) gibt es keine Achse', async () => {
  await withSite(async ({ origin, newPage }) => {
    for (const opts of [{ viewport: { width: 1024, height: 600 } }, { viewport: { width: 390, height: 844 } }, { javaScriptEnabled: false }]) {
      const page = await newPage(opts);
      await page.goto(origin + '/', { waitUntil: 'networkidle' });
      const shown = await page.locator('#leistungen .service__node').evaluateAll(a => a.filter(n => getComputedStyle(n).display !== 'none').length);
      assert.equal(shown, 0, JSON.stringify(opts));
      await page.close();
    }
  });
});

test('Leistungen: nur ein fester hellgrauer Strich über der Überschrift, ohne Animation; die senkrechte Achse beginnt unter der Überschrift', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('#leistungen .axis-bar, #leistungen .service__top').count(), 0, 'kein Balken, kein T-Strich');
    assert.equal(await page.locator('#leistungen hr').count(), 1);
    const rule = page.locator('#leistungen .section-rule');
    const attrs = await rule.evaluate(e => ({ draw: e.classList.contains('hairline-draw'), reveal: e.hasAttribute('data-reveal'), anim: e.getAnimations().length }));
    assert.deepEqual(attrs, { draw: false, reveal: false, anim: 0 });
    // sofort voll da, auch mitten im Seitenaufbau: keine Skalierung, keine Deckkraftänderung
    const style = await rule.evaluate(e => { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); const w = e.closest('.wrap'); const pad = parseFloat(getComputedStyle(w).paddingLeft); return { h: r.height, w: Math.round(r.width), content: Math.round(w.getBoundingClientRect().width - 2 * pad), bg: s.backgroundColor, transform: s.transform, opacity: s.opacity }; });
    assert.equal(style.h, 1); assert.ok(Math.abs(style.w - style.content) <= 1);
    assert.match(style.bg, /^rgba\(16, 18, 20, 0\.1/);
    assert.equal(style.transform, 'none'); assert.equal(style.opacity, '1');
    const g = await page.evaluate(() => ({ rule: document.querySelector('#leistungen .section-rule').getBoundingClientRect().bottom, head: document.querySelector('#leistungen .services-head').getBoundingClientRect().top, node: document.querySelector('#leistungen .service__node').getBoundingClientRect().top, headBottom: document.querySelector('#leistungen .services-head').getBoundingClientRect().bottom }));
    assert.ok(g.rule <= g.head, 'Strich liegt über der Überschrift');
    assert.ok(g.node > g.headBottom, 'die Achse beginnt unter der Überschrift');
  });
});
