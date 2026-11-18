import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { withSite } from '../lib/harness.mjs';

const site = JSON.parse(await fs.readFile(new URL('../../src/content/site.json', import.meta.url), 'utf8'));
const proof = ['akDesktop', 'akCardDesign'].map(k => site.assets[k]);

async function scrollThrough(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 600) { await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(80); }
  await page.waitForTimeout(600);
}

test('Praxis: zwei echte Belege mit Alt-Text, ohne Bildunterschriften und ohne Maße', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    await scrollThrough(page);
    const imgs = await page.locator('#praxis .proof img, #praxis .proof__device img').evaluateAll(els => els.map(i => ({ src: i.getAttribute('src'), alt: i.alt, ok: i.naturalWidth > 0 })));
    assert.deepEqual(imgs.map(i => i.src), proof.map(a => a.src));
    for (const i of imgs) { assert.ok(i.alt.length > 20, i.src); assert.ok(i.ok, i.src + ' geladen'); }
    assert.equal(await page.locator('#praxis figcaption, #objelis figcaption').count(), 0, 'keine Bildunterschriften');
    assert.equal(await page.locator('#praxis .chip, #objelis .chip').count(), 0);
    assert.doesNotMatch(await page.locator('#praxis, #objelis').evaluateAll(a => a.map(e => e.textContent).join(' ')), /\d+\s*×\s*\d+|\d\s*px\b/);
  });
});

test('Praxis: externer AK-Link ist sicher und kündigt den neuen Tab an', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    const link = page.locator(`#praxis a[href="${site.links.ak}"]`).first();
    assert.equal(await link.getAttribute('target'), '_blank');
    assert.match(await link.getAttribute('rel'), /noopener/);
    assert.match(await link.getAttribute('rel'), /noreferrer/);
    assert.match(await link.textContent(), /öffnet in neuem Tab/);
  });
});

test('Praxis und objelis: sachlich, ohne Garantien und ohne unbelegte Behauptungen', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    const praxis = await page.locator('#praxis').textContent();
    const objelis = await page.locator('#objelis').textContent();
    assert.match(objelis, /in Entwicklung/i);
    assert.doesNotMatch(objelis, /Genauigkeit|Kunde|Pöppelmann|garantiert/i);
    assert.doesNotMatch(praxis, /garantiert|Ranking-Garantie|Platz 1|Top-Ranking|Pöppelmann/i);
    assert.equal(await page.locator('#objelis img').count(), 1);
    assert.equal(await page.locator('#objelis img').getAttribute('src'), site.assets.objelisModel.src);
    assert.ok((await page.locator('#objelis img').getAttribute('alt')).length > 20);
    assert.match(await page.locator('#objelis a[href^="mailto:"]').first().innerText(), /objelis/i);
  });
});

test('Praxis und objelis: kein horizontales Scrollen und keine Verstöße (390, 1440)', async () => {
  await withSite(async ({ origin, newPage, axe }) => {
    for (const width of [390, 1440]) {
      const page = await newPage({ viewport: { width, height: 900 } });
      await page.goto(origin + '/', { waitUntil: 'networkidle' });
      await scrollThrough(page);
      await page.waitForFunction(() => window.__heroDoneAt);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Überlauf bei ${width}`);
      const wide = await page.locator('#praxis img, #objelis img').evaluateAll(els => els.filter(i => i.getBoundingClientRect().right > innerWidth + 1).length);
      assert.equal(wide, 0);
      assert.deepEqual((await axe(page)).map(v => v.id + ': ' + v.nodes.map(n => n.target).join(' ')), []);
      await page.close();
    }
  });
});

test('objelis: das Drahtgittermodell trägt die Maßwerte als schlichten Text neben den Linien', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    const dims = await page.locator('#objelis .model-dim').evaluateAll(els => els.map(e => ({ t: e.textContent.trim(), font: getComputedStyle(e).fontFamily, bg: getComputedStyle(e).backgroundColor, border: getComputedStyle(e).borderTopWidth })));
    assert.deepEqual(dims.map(d => d.t), ['146,7 mm', '71,5 mm', '7,8 mm']);
    for (const d of dims) { assert.doesNotMatch(d.font, /Tabular|monospace/i); assert.equal(d.bg, 'rgba(0, 0, 0, 0)'); assert.equal(d.border, '0px'); }
    const inside = await page.evaluate(() => { const f = document.querySelector('#objelis .objelis-visual').getBoundingClientRect(); return [...document.querySelectorAll('#objelis .model-dim')].every(e => { const r = e.getBoundingClientRect(); return r.left >= f.left && r.right <= f.right && r.top >= f.top && r.bottom <= f.bottom; }); });
    assert.equal(inside, true, 'Werte liegen innerhalb des Bildes');
  });
});
