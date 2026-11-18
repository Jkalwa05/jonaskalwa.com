import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { withSite, httpGet } from '../lib/harness.mjs';

const cv = JSON.parse(await fs.readFile(new URL('../../src/content/cv.json', import.meta.url), 'utf8'));
const site = JSON.parse(await fs.readFile(new URL('../../src/content/site.json', import.meta.url), 'utf8'));
const norm = t => t.replace(/\s+/g, ' ').trim();

test('Lebenslauf: alle Einträge sichtbar ohne Klick, ein h1, keine Aufklapper', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/lebenslauf/', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('details, summary').count(), 0);
    const text = norm(await page.locator('main').textContent());
    for (const g of cv.groups) {
      assert.ok(text.includes(g.title), g.title);
      for (const e of g.entries) { assert.ok(text.includes(e.title), e.title); assert.ok(text.includes(e.period), e.period); if (e.text) assert.ok(text.includes(norm(e.text)), e.text.slice(0, 40)); }
    }
    for (const x of cv.extras) { assert.ok(text.includes(x.title)); assert.ok(text.includes(norm(x.text))); }
    assert.ok(text.includes('IBM AI Developer') && text.includes('Seit November 2026'));
    const hidden = await page.locator('main *').evaluateAll(els => els.filter(e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return e.textContent.trim() && (s.display === 'none' || s.visibility === 'hidden'); }).length);
    assert.equal(hidden, 0);
  });
});

test('Lebenslauf: Navigation markiert die aktuelle Seite, alter Link /cv.html leitet weiter', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/lebenslauf/', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.main-nav a[aria-current="page"]').innerText(), 'Lebenslauf');
    await page.goto(origin + '/cv.html');
    await page.waitForURL(origin + '/lebenslauf/', { timeout: 5000 });
  });
});

test('Unterseiten: Indexierung, kein Überlauf, keine Verstöße bei 390 px, Inhalt der Rechtstexte', async () => {
  await withSite(async ({ origin, newPage, axe }) => {
    for (const p of ['/lebenslauf/', '/impressum/', '/datenschutz/', '/404.html', '/design-system/']) {
      const page = await newPage({ viewport: { width: 390, height: 844 } });
      const res = await page.goto(origin + p, { waitUntil: 'networkidle' });
      assert.equal(res.status(), 200, 'Status ' + p);
      const robots = await page.locator('meta[name=robots]').count();
      const internal = p === '/design-system/' || p === '/404.html';
      assert.equal(robots, internal ? 1 : 0, 'noindex nur intern: ' + p);
      if (internal) assert.match(await page.locator('meta[name=robots]').getAttribute('content'), /noindex/, p);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Überlauf ' + p);
      assert.equal(await page.locator('h1').count(), 1, p);
      assert.deepEqual((await axe(page)).map(v => v.id + ': ' + v.nodes.map(n => n.target).join(' ')), [], p);
      await page.close();
    }
    const imp = await newPage();
    await imp.goto(origin + '/impressum/');
    const t = norm(await imp.locator('main').innerText());
    for (const s of [site.address.street, site.address.city, site.email, '§ 5 Digitale-Dienste-Gesetz']) assert.ok(t.includes(s), s);
    await imp.goto(origin + '/datenschutz/');
    const d = norm(await imp.locator('main').innerText());
    assert.ok(d.includes('DSGVO') && d.includes('Projektanfrage per E-Mail'));
    assert.doesNotMatch(d, /Formular(?!server)/);
  });
});

test('404: unbekannte Adresse liefert Status 404 mit der Fehlerseite', async () => {
  await withSite(async ({ origin }) => {
    const r = await httpGet(origin + '/gibt-es-nicht/');
    assert.equal(r.status, 404);
    assert.match(r.text, /Diese Seite/);
  });
});

test('Design-System: existiert, ist von keiner Seite verlinkt und zeigt Farben, Schrift, Buttons, Flächen, Würfel', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    for (const p of ['/', '/lebenslauf/', '/impressum/', '/datenschutz/', '/404.html']) {
      await page.goto(origin + p);
      assert.equal(await page.locator('a[href*="design-system"]').count(), 0, p);
    }
    await page.goto(origin + '/design-system/', { waitUntil: 'networkidle' });
    const t = norm(await page.locator('main').innerText());
    for (const s of ['Farben', 'Typografie', 'Buttons', 'Flächen', 'Würfel', '#2857EB', '#101214']) assert.ok(t.includes(s), s);
    assert.equal(await page.locator('main .cube').count(), 3);
  });
});
