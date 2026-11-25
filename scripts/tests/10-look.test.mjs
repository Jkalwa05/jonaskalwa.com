import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withSite } from '../lib/harness.mjs';

const BG = { blue: 'rgb(40, 87, 235)', white: 'rgb(255, 255, 255)', wash: 'rgb(237, 241, 251)', night: 'rgb(11, 16, 32)' };

test('Look: jeder Abschnitt trägt seine Farbfläche, benachbarte Flächen unterscheiden sich deutlich', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    const rows = await page.evaluate(() => [...document.querySelectorAll('[data-section]')].map(s => ({ id: s.id, bg: getComputedStyle(s).backgroundColor })).concat([{ id: 'footer', bg: getComputedStyle(document.querySelector('.site-footer')).backgroundColor }]));
    assert.deepEqual(rows.map(r => [r.id, r.bg]), [
      ['start', BG.white], ['leistungen', BG.white], ['praxis', BG.wash], ['objelis', BG.night], ['ueber-mich', BG.white], ['kontakt', BG.blue], ['footer', BG.night],
    ]);
    // Hero und Leistungen sind beide weiß; sie trennt der feste graue Strich.
    for (let i = 2; i < rows.length; i++) assert.notEqual(rows[i].bg, rows[i - 1].bg, `${rows[i - 1].id} / ${rows[i].id}`);
  });
});

const themeUnder = (page) => page.evaluate(() => {
  const areas = [...document.querySelectorAll('[data-theme]')];
  const at = (x, y) => { let hit = 'light'; for (const el of areas) { const r = el.getBoundingClientRect(); if (r.top <= y && y < r.bottom && r.left <= x && x <= r.right) hit = el.dataset.theme; } return hit; };
  return [...document.querySelectorAll('.cubes .cube')].map(c => { const r = c.getBoundingClientRect(); return { got: c.dataset.on, want: at(r.left + r.width / 2, r.top + r.height / 2) }; });
});

test('Look: jeder Würfel übernimmt die Farbwelt an seiner eigenen Stelle', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    for (const id of ['start', 'leistungen', 'praxis', 'objelis', 'ueber-mich', 'kontakt']) {
      await page.evaluate(i => { const r = document.getElementById(i).getBoundingClientRect(); scrollTo({ top: Math.max(0, r.top + scrollY - 160), behavior: 'instant' }); }, id);
      await page.waitForTimeout(500);
      for (const c of await themeUnder(page)) assert.equal(c.got, c.want, id);
    }
  });
});

test('Look: an Bereichsgrenzen bleiben alle Würfel sichtbar (je nach Untergrund hell oder dunkel)', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    for (const [id, above, below] of [['objelis', 'wash', 'night'], ['ueber-mich', 'night', 'light'], ['kontakt', 'light', 'blue']]) {
      await page.evaluate(i => { const r = document.getElementById(i).getBoundingClientRect(); scrollTo({ top: r.top + scrollY - 450, behavior: 'instant' }); }, id);
      await page.waitForTimeout(600);
      const cubes = await page.evaluate(() => [...document.querySelectorAll('.cubes .cube')].map(c => { const r = c.getBoundingClientRect(); return { y: r.top + r.height / 2, on: c.dataset.on, line: getComputedStyle(c).borderTopColor }; }));
      const a = cubes.filter(c => c.y < 450), b = cubes.filter(c => c.y >= 450);
      assert.ok(a.length && b.length, 'Grenze liegt nicht mitten in den Würfeln: ' + id);
      assert.ok(a.every(c => c.on === above), id + ' oben ' + a.map(c => c.on));
      assert.ok(b.every(c => c.on === below), id + ' unten ' + b.map(c => c.on));
      // Wahrnehmungshelligkeit der Linie: auf dunklem Grund hell, auf hellem Grund dunkel
      const bright = l => { const [r, g, bl] = l.match(/\d+(\.\d+)?/g).map(Number); return (299 * r + 587 * g + 114 * bl) / 1000; };
      assert.ok(a.every(c => (bright(c.line) > 128) === ['night', 'blue'].includes(above)), id + ' Linie oben ' + a.map(c => c.line));
      assert.ok(b.every(c => (bright(c.line) > 128) === ['night', 'blue'].includes(below)), id + ' Linie unten ' + b.map(c => c.line));
    }
  });
});

test('Look: die Kopfleiste ist eine abgerundete Pille und passt sich dem Bereich darunter an', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    const want = { leistungen: [BG.white, 'rgb(16, 18, 20)'], praxis: [BG.wash, 'rgb(16, 18, 20)'], objelis: [BG.night, 'rgb(255, 255, 255)'], 'ueber-mich': [BG.white, 'rgb(16, 18, 20)'], kontakt: [BG.blue, 'rgb(255, 255, 255)'] };
    for (const [id, [bg, ink]] of Object.entries(want)) {
      await page.evaluate(i => { const r = document.getElementById(i).getBoundingClientRect(); scrollTo({ top: r.top + scrollY + 120, behavior: 'instant' }); }, id);
      await page.waitForTimeout(800);
      const got = await page.evaluate(() => { const b = document.querySelector('.header-bar'); const s = getComputedStyle(b); return { bg: s.backgroundColor, ink: getComputedStyle(document.querySelector('.brand-name')).color, r: parseFloat(s.borderTopLeftRadius), line: s.borderTopColor }; });
      assert.equal(got.bg, bg, id + ' Hintergrund');
      assert.equal(got.ink, ink, id + ' Schrift');
      assert.ok(got.r >= 30, id + ' Radius ' + got.r);
      assert.notEqual(got.line, 'rgba(0, 0, 0, 0)', id + ' Rand');
    }
    const box = await page.locator('.header-bar').boundingBox();
    const contentLeft = await page.locator('#kontakt .wrap').evaluate(w => w.getBoundingClientRect().left + parseFloat(getComputedStyle(w).paddingLeft));
    assert.ok(Math.abs(box.x - contentLeft) <= 1, `Pille fluchtet mit dem Inhalt: ${box.x} vs ${contentLeft}`);
  });
});

test('Look: keine Mono-Schrift, keine Versalien-Labels, keine Maß-Chips irgendwo', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    for (const p of ['/', '/lebenslauf/', '/design-system/']) {
      await page.goto(origin + p, { waitUntil: 'networkidle' });
      const bad = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => { const s = getComputedStyle(e); return /Tabular|monospace/i.test(s.fontFamily) && e.textContent.trim() || (s.textTransform === 'uppercase' && e.children.length === 0 && e.textContent.trim().length > 3 && !e.closest('.skip-link')); }).map(e => e.tagName + '.' + e.className));
      assert.deepEqual(bad, [], p);
      assert.equal(await page.locator('.chip, .measure, .measure-chip').count(), 0, p);
    }
  });
});

test('Look: Kontakt trägt weiße Primärbuttons auf Blau, der Hero dunkle auf Weiß, Texte bleiben lesbar (axe)', async () => {
  await withSite(async ({ origin, newPage, axe }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__heroDoneAt);
    for (const [sel, want] of [['#start .button:not(.button--ghost)', ['rgb(16, 18, 20)', BG.white]], ['#kontakt .button:not(.button--ghost)', [BG.white, BG.blue]]]) {
      const c = await page.locator(sel).first().evaluate(e => [getComputedStyle(e).backgroundColor, getComputedStyle(e).color]);
      assert.deepEqual(c, want, sel);
    }
    assert.deepEqual((await axe(page)).map(v => v.id + ': ' + v.nodes.map(n => n.target).join(' ')), []);
  });
});

test('Look: Würfel sind blau auf hellen Flächen und weiß auf Blau und Nachtblau', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    for (const [id, fill] of [['leistungen', 'rgb(40, 87, 235)'], ['praxis', 'rgb(40, 87, 235)'], ['objelis', 'rgb(255, 255, 255)'], ['ueber-mich', 'rgb(40, 87, 235)'], ['kontakt', 'rgb(255, 255, 255)']]) {
      await page.evaluate(i => { const r = document.getElementById(i).getBoundingClientRect(); scrollTo({ top: r.top + scrollY - 100, behavior: 'instant' }); }, id);
      await page.waitForTimeout(600);
      const bg = await page.locator('.cubes .cube.is-active').evaluate(c => getComputedStyle(c).backgroundColor);
      assert.equal(bg, fill, id);
    }
  });
});

test('Look: Titel und Beschreibung binden die Firma nicht an einen Ort', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    assert.doesNotMatch(await page.title(), /Vechta/);
    assert.doesNotMatch(await page.locator('meta[name=description]').getAttribute('content'), /Vechta/);
  });
});

test('Look: keine Trennlinien zwischen den Bereichen, nur der feste graue Strich über den Leistungen', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('[data-section] hr').count(), 1);
    assert.equal(await page.locator('#leistungen > .wrap > hr.section-rule').count(), 1);
  });
});
