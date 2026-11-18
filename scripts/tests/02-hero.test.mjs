import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { withSite } from '../lib/harness.mjs';

const site = JSON.parse(await fs.readFile(new URL('../../src/content/site.json', import.meta.url), 'utf8'));
const laptop = site.assets.akDetail;
const phone = site.assets.akMobile;

test('Hero: h1, zwei Buttons und das echte AK-Projekt', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('#start .label').count(), 0, 'keine Eyebrow-Zeile im Hero');
    assert.doesNotMatch(await page.locator('#start').textContent(), /Vechta/);
    assert.match((await page.locator('#start h1').innerText()).replace(/\s+/g, ' '), /^Software, die für dich arbeitet\.$/);
    const primary = page.locator('#start .button').first();
    assert.match(await primary.getAttribute('href'), /^mailto:/);
    assert.match(await primary.innerText(), /Projekt besprechen/);
    assert.equal(await page.locator('#start .button--ghost').getAttribute('href'), '#praxis');
    for (const [sel, asset] of [['.device--laptop img', laptop], ['.device--phone img', phone]]) {
      const img = page.locator('#start ' + sel);
      assert.equal(await img.getAttribute('src'), asset.src);
      assert.ok((await img.getAttribute('alt')).length > 20);
      assert.ok(await img.evaluate(i => i.naturalWidth > 0));
    }
  });
});

test('Hero: keine Maße, Maßlinien oder Chips', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('#start .measure, #start .measure-chip, #start .chip').count(), 0);
    const text = await page.locator('#start').textContent();
    assert.doesNotMatch(text, /\d+\s*(×|x)\s*\d+|\d\s*px\b/);
  });
});

test('Hero: blaue Fläche, der Kopf liegt zuerst unsichtbar darüber und wird beim Scrollen zur Pille', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('#start').evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(40, 87, 235)');
    const bar = () => page.locator('.header-bar').evaluate(e => { const s = getComputedStyle(e); return { bg: s.backgroundColor, r: parseFloat(s.borderTopLeftRadius) }; });
    assert.equal((await bar()).bg, 'rgba(0, 0, 0, 0)');
    const line0 = await page.locator('.header-bar').evaluate(e => getComputedStyle(e).borderTopColor);
    assert.match(line0, /^rgba\(255, 255, 255, 0\.[3-9]/, 'weiße Umrandung der Pille von Anfang an: ' + line0);
    assert.equal(await page.locator('.site-header .brand-name').evaluate(e => getComputedStyle(e).color), 'rgb(255, 255, 255)');
    await page.evaluate(() => scrollTo({ top: 300, behavior: 'instant' }));
    await page.waitForTimeout(700);
    const b = await bar();
    assert.equal(b.bg, 'rgb(40, 87, 235)');
    assert.ok(b.r >= 30, 'abgerundet: ' + b.r);
  });
});

test('Hero: mobil steht der Kontakt-Button vor dem Bild', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    const b = await page.locator('#start .button').first().boundingBox();
    const i = await page.locator('#start .device--phone img').boundingBox();
    assert.ok(b.y < i.y, `Button ${b.y} liegt nicht vor Bild ${i.y}`);
    assert.ok(b.y + b.height < 844 + 200, 'Button sollte ohne langes Scrollen erreichbar sein');
  });
});

test('Hero: Auftritt endet nach höchstens 1,4 s mit vollständig sichtbaren Elementen', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__heroDoneAt, null, { timeout: 4000 });
    const took = await page.evaluate(() => window.__heroDoneAt - window.__heroStartAt);
    assert.ok(took <= 1400, `Hero-Auftritt dauerte ${Math.round(took)} ms`);
    const state = await page.evaluate(() => [...document.querySelectorAll('#start [data-hero]')].map(el => {
      const s = getComputedStyle(el);
      return { cls: el.className, opacity: s.opacity, transform: s.transform };
    }));
    assert.ok(state.length >= 5, 'zu wenige Hero-Elemente gefunden');
    for (const s of state) {
      assert.equal(s.opacity, '1', s.cls);
      // fertig = Skalierung 1 (Verschiebungen gehören zur Positionierung der Chips)
      const m = s.transform === 'none' ? [1, 0, 0, 1] : s.transform.match(/matrix\(([^)]+)\)/)[1].split(',').map(Number);
      assert.ok(Math.abs(m[0] - 1) < 0.001 && Math.abs(m[3] - 1) < 0.001 && m[1] === 0 && m[2] === 0, `${s.cls}: ${s.transform}`);
    }
  });
});

test('Hero: bei reduzierter Bewegung sofort fertig und ohne laufende Animation', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage({ reducedMotion: 'reduce' });
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    assert.equal(await page.evaluate(() => document.documentElement.classList.contains('motion')), false);
    assert.ok(await page.locator('#start [data-hero]').count() >= 5, 'Hero-Elemente fehlen');
    const hidden = await page.evaluate(() => [...document.querySelectorAll('#start [data-hero]')].filter(e => getComputedStyle(e).opacity !== '1').length);
    assert.equal(hidden, 0);
    assert.equal(await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length), 0);
  });
});

test('Hero: ohne JavaScript ist alles sichtbar', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage({ javaScriptEnabled: false });
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    assert.ok(await page.locator('#start [data-hero]').count() >= 5, 'Hero-Elemente fehlen');
    const hidden = await page.evaluate(() => [...document.querySelectorAll('#start [data-hero]')].filter(e => getComputedStyle(e).opacity !== '1' || /matrix\(0/.test(getComputedStyle(e).transform)).length);
    assert.equal(hidden, 0);
    assert.ok(await page.locator('#start h1').isVisible());
  });
});
