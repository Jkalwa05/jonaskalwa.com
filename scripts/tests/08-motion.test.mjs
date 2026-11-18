import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withSite } from '../lib/harness.mjs';

async function scrollThrough(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= h; y += 450) { await page.evaluate(v => scrollTo({ top: v, behavior: 'instant' }), y); await page.waitForTimeout(110); }
  await page.waitForTimeout(1600);
}

test('Bewegung: nach dem Laden endet jede Animation, nichts läuft endlos', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__heroDoneAt);
    await page.waitForTimeout(3000);
    const running = await page.evaluate(() => ({ css: document.getAnimations().filter(a => a.playState === 'running').length, gsap: window.gsap?.globalTimeline?.getChildren?.(true, true, false).filter(t => t.isActive()).length ?? 0 }));
    assert.equal(running.css, 0);
    assert.equal(running.gsap, 0);
  });
});

test('Bewegung: jedes [data-reveal] ist nach dem Durchscrollen sichtbar und fertig', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    await scrollThrough(page);
    const bad = await page.evaluate(() => [...document.querySelectorAll('[data-reveal]')].filter(e => !e.hasAttribute('data-revealed') || getComputedStyle(e).opacity !== '1' || /matrix\(0/.test(getComputedStyle(e).transform)).map(e => e.tagName + '.' + e.className + ' ' + e.getAttribute('data-reveal')));
    assert.deepEqual(bad, []);
    assert.ok(await page.locator('[data-reveal]').count() >= 20, 'zu wenige Einblend-Elemente');
  });
});

test('Bewegung: ein Sprung ans Seitenende lässt keine Inhalte unsichtbar zurück', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(1800);
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(1800);
    const hidden = await page.evaluate(() => [...document.querySelectorAll('main [data-reveal]')].filter(e => { const r = e.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0 && getComputedStyle(e).opacity !== '1'; }).length);
    assert.equal(hidden, 0);
    await page.evaluate(() => scrollTo({ top: 3000, behavior: 'instant' }));
    await page.waitForTimeout(1800);
    const hidden2 = await page.evaluate(() => [...document.querySelectorAll('main [data-reveal]')].filter(e => { const r = e.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0 && getComputedStyle(e).opacity !== '1'; }).length);
    assert.equal(hidden2, 0);
  });
});

test('Bewegung: reduzierte Bewegung zeigt sofort alles und startet nichts', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage({ reducedMotion: 'reduce' });
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    assert.equal(await page.evaluate(() => document.documentElement.classList.contains('motion')), false);
    const hidden = await page.evaluate(() => [...document.querySelectorAll('[data-reveal], [data-hero], .measure')].filter(e => getComputedStyle(e).opacity === '0' || /matrix\(0/.test(getComputedStyle(e).transform)).length);
    assert.equal(hidden, 0);
    // Bühne: genau eine Zeichnung ist sichtbar (der Rest wechselt mit dem Text), Pfade sind fertig gezeichnet
    assert.equal(await page.evaluate(() => [...document.querySelectorAll('.schema')].filter(e => getComputedStyle(e).visibility === 'visible').length), 1);
    assert.equal(await page.evaluate(() => [...document.querySelectorAll('.schema .draw')].filter(p => parseFloat(getComputedStyle(p).strokeDashoffset) !== 0).length), 0);
    assert.equal(await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length), 0);
    const smooth = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
    assert.equal(smooth, 'auto');
  });
});

test('Bewegung: ohne JavaScript steht jeder Inhalt sichtbar da', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage({ javaScriptEnabled: false });
    for (const p of ['/', '/lebenslauf/']) {
      await page.goto(origin + p, { waitUntil: 'networkidle' });
      const hidden = await page.evaluate(() => [...document.querySelectorAll('main *')].filter(e => e.textContent.trim() && getComputedStyle(e).opacity === '0').length);
      assert.equal(hidden, 0, p);
    }
  });
});

test('Bewegung: fällt app.js aus, werden Inhalte nach dem Schutzzeitraum trotzdem sichtbar', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.route('**/app.js', r => r.abort());
    await page.goto(origin + '/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4600);
    const hidden = await page.evaluate(() => [...document.querySelectorAll('#start [data-hero], main [data-reveal]')].filter(e => getComputedStyle(e).opacity === '0').length);
    assert.equal(hidden, 0);
    assert.equal(await page.evaluate(() => document.documentElement.classList.contains('motion')), false);
  });
});

test('Bewegung: nur transform und opacity werden animiert, Scrollen bleibt nativ', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.addInitScript(() => {
      window.__props = new Set();
      const orig = CSSStyleDeclaration.prototype.setProperty;
      const obs = new MutationObserver(ms => ms.forEach(m => { if (m.attributeName === 'style') { const t = m.target; for (const p of ['top', 'left', 'width', 'height', 'margin', 'padding']) if (t.style[p] && !t.dataset.allowed) window.__props.add(p + ':' + (t.className || t.tagName)); } }));
      addEventListener('DOMContentLoaded', () => obs.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['style'] }));
    });
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    await scrollThrough(page);
    const props = await page.evaluate(() => [...window.__props].filter(p => !/schema__chip|cube__label|hero-tag|measure-chip/.test(p)));
    assert.deepEqual(props, []);
    const overflow = await page.evaluate(() => [getComputedStyle(document.documentElement).overflowY, getComputedStyle(document.body).overflowY]);
    assert.ok(!overflow.includes('hidden'), overflow.join());
    await page.evaluate(() => scrollTo({ top: 2000, behavior: 'instant' }));
    await page.waitForTimeout(300);
    const y0 = await page.evaluate(() => scrollY);
    await page.mouse.move(600, 400);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(700);
    const y1 = await page.evaluate(() => scrollY);
    assert.ok(Math.abs(Math.abs(y1 - y0) - 300) <= 8 || y1 === 0, `Mausrad ${y0} -> ${y1}`);
  });
});

test('Bewegung: Seitenübergang ist aktiviert und bei reduzierter Bewegung abgeschaltet', async () => {
  const css = await (await import('node:fs/promises')).readFile(new URL('../../dist/styles.css', import.meta.url), 'utf8');
  assert.match(css, /@view-transition\{navigation:auto\}/);
  assert.match(css, /prefers-reduced-motion:reduce\)\{@view-transition\{navigation:none\}\}/);
});
