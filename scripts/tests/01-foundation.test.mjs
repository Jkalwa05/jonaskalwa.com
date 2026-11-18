import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { withSite } from '../lib/harness.mjs';

const dist = new URL('../../dist/', import.meta.url);
const site = JSON.parse(await fs.readFile(new URL('../../src/content/site.json', import.meta.url), 'utf8'));
const read = p => fs.readFile(new URL(p, dist), 'utf8');

test('build erzeugt Startseite, Lebenslauf, Impressum, Datenschutz und 404', async () => {
  for (const p of ['index.html', 'lebenslauf/index.html', 'impressum/index.html', 'datenschutz/index.html', '404.html', 'styles.css', 'app.js', 'tokens.css'])
    await fs.access(new URL(p, dist));
});

test('Startseite hat genau ein h1, lang=de und kein details', async () => {
  const html = await read('index.html');
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(html, /<html[^>]*lang="de"/);
  assert.doesNotMatch(html, /<details/);
});

test('Seite lädt ohne Konsolenfehler, ohne externe Requests und ohne horizontales Scrollen (320/768/1440)', async () => {
  await withSite(async ({ origin, newPage }) => {
    for (const width of [320, 768, 1440]) {
      const page = await newPage({ viewport: { width, height: 900 } });
      await page.goto(origin + '/', { waitUntil: 'networkidle' });
      const scroll = await page.evaluate(() => document.documentElement.scrollWidth);
      assert.ok(scroll <= width, `Überlauf bei ${width}: ${scroll}`);
      assert.deepEqual(page.errors, []);
      assert.deepEqual(page.outside, []);
      await page.close();
    }
  });
});

test('alle Assets aus site.json existieren und ihre echte Pixelgröße stimmt mit width/height überein', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'domcontentloaded' });
    const result = await page.evaluate(async assets => Promise.all(Object.entries(assets).map(([name, a]) => new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve({ name, w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = () => resolve({ name, w: 0, h: 0 });
      img.src = a.src;
    }))), site.assets);
    for (const r of result) assert.deepEqual([r.w, r.h], [site.assets[r.name].width, site.assets[r.name].height], r.name);
  });
});
