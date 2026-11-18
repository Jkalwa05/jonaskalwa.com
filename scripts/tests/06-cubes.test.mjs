import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withSite } from '../lib/harness.mjs';

const LABELS = ['Start', 'Leistungen', 'Praxis', 'objelis', 'Über mich', 'Kontakt'];
const IDS = ['start', 'leistungen', 'praxis', 'objelis', 'ueber-mich', 'kontakt'];
const state = page => page.evaluate(() => [...document.querySelectorAll('.cubes .cube')].map(c => c.classList.contains('is-active') ? 'active' : c.classList.contains('is-passed') ? 'passed' : 'open'));

async function scrollToSection(page, id) {
  await page.evaluate(i => { const r = document.getElementById(i).getBoundingClientRect(); scrollTo({ top: r.top + scrollY - 160, behavior: 'instant' }); }, id);
  await page.waitForTimeout(400);
}

test('Würfel: genau ein Würfel pro Abschnitt, gleiche Reihenfolge, Labels und Anker', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('[data-section]').count(), 6);
    assert.deepEqual(await page.locator('.cubes .cube').evaluateAll(a => a.map(c => c.getAttribute('href'))), IDS.map(i => '#' + i));
    assert.deepEqual((await page.locator('.cubes .cube__label').allTextContents()).map(t => t.trim()), LABELS);
    assert.deepEqual(await page.locator('[data-section]').evaluateAll(a => a.map(s => s.dataset.label)), LABELS);
    assert.equal(await page.locator('nav.cubes').getAttribute('aria-label'), 'Abschnitte');
  });
});

test('Würfel: ab 960 px fest am rechten Rand und mittig, darunter ausgeblendet', async () => {
  await withSite(async ({ origin, newPage }) => {
    const wide = await newPage({ viewport: { width: 1440, height: 900 } });
    await wide.goto(origin + '/', { waitUntil: 'networkidle' });
    const nav = await wide.locator('nav.cubes').evaluate(n => { const r = n.getBoundingClientRect(); return { pos: getComputedStyle(n).position, right: innerWidth - r.right, mid: r.top + r.height / 2 }; });
    assert.equal(nav.pos, 'fixed');
    assert.ok(nav.right < 60 && nav.right >= 0, 'am rechten Rand: ' + nav.right);
    assert.ok(Math.abs(nav.mid - 450) < 12, 'vertikal mittig: ' + nav.mid);
    for (const width of [390, 800, 959]) {
      const p = await newPage({ viewport: { width, height: 800 } });
      await p.goto(origin + '/', { waitUntil: 'networkidle' });
      assert.equal(await p.locator('nav.cubes').isVisible(), false, 'bei ' + width);
      await p.close();
    }
  });
});

test('Würfel: Zustand folgt dem Scrollen (passiert, aktiv, offen) und markiert aria-current', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    assert.deepEqual(await state(page), ['active', 'open', 'open', 'open', 'open', 'open']);
    await scrollToSection(page, 'leistungen');
    assert.deepEqual(await state(page), ['passed', 'active', 'open', 'open', 'open', 'open']);
    assert.deepEqual(await page.locator('.cubes .cube').evaluateAll(a => a.map(c => c.getAttribute('aria-current'))), [null, 'true', null, null, null, null]);
    await scrollToSection(page, 'objelis');
    assert.deepEqual(await state(page), ['passed', 'passed', 'passed', 'active', 'open', 'open']);
    await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(400);
    assert.deepEqual(await state(page), ['passed', 'passed', 'passed', 'passed', 'passed', 'active']);
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(400);
    assert.deepEqual(await state(page), ['active', 'open', 'open', 'open', 'open', 'open']);
  });
});

test('Würfel: Klick springt zum Abschnitt und setzt ihn aktiv', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    await page.locator('.cubes .cube').nth(3).click();
    await page.waitForFunction(() => document.querySelectorAll('.cubes .cube')[3].getAttribute('aria-current') === 'true', null, { timeout: 5000 });
    assert.equal(new URL(page.url()).hash, '#objelis');
    const top = await page.evaluate(() => document.getElementById('objelis').getBoundingClientRect().top);
    const header = await page.evaluate(() => document.querySelector('.site-header').getBoundingClientRect().height);
    assert.ok(top >= header - 2, `Abschnitt liegt unter dem Kopf: ${top} vs ${header}`);
  });
});

test('Würfel: Deep Link /#kontakt und Zurück-Taste', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/#kontakt', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    assert.deepEqual(await state(page), ['passed', 'passed', 'passed', 'passed', 'passed', 'active']);
    const top = await page.evaluate(() => document.getElementById('kontakt').getBoundingClientRect().top);
    const header = await page.evaluate(() => document.querySelector('.site-header').getBoundingClientRect().height);
    assert.ok(top >= header - 2, `Kontakt liegt unter dem festen Kopf: ${top}`);
    await page.locator('.cubes .cube').nth(1).click();
    await page.waitForFunction(() => document.querySelectorAll('.cubes .cube')[1].getAttribute('aria-current') === 'true');
    await page.goBack();
    await page.waitForFunction(() => document.querySelectorAll('.cubes .cube')[5].getAttribute('aria-current') === 'true', null, { timeout: 5000 });
  });
});

test('Würfel: Tastatur erreicht jeden Würfel mit sichtbarem Fokus, Enter springt', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    await page.locator('.cubes .cube').first().focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    const seen = [];
    for (let i = 0; i < 6; i++) {
      await page.waitForTimeout(280);
      seen.push(await page.evaluate(() => { const a = document.activeElement; return [a.classList.contains('cube') ? a.getAttribute('href') : a.tagName, getComputedStyle(a).outlineStyle !== 'none', getComputedStyle(a.querySelector('.cube__label') || a).opacity]; }));
      await page.keyboard.press('Tab');
    }
    assert.deepEqual(seen.map(s => s[0]), IDS.map(i => '#' + i));
    assert.ok(seen.every(s => s[1]), 'Fokusring sichtbar');
    assert.ok(seen.every(s => s[2] === '1'), 'Label sichtbar bei Fokus');
    await page.locator('.cubes .cube').nth(2).focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => location.hash === '#praxis');
  });
});

test('Würfel: Label erscheint kurz beim Wechsel und verschwindet wieder', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    await scrollToSection(page, 'leistungen');
    await page.waitForTimeout(400);
    const op = () => page.locator('.cubes .cube.is-active .cube__label').evaluate(l => getComputedStyle(l).opacity);
    assert.equal(await op(), '1');
    await page.waitForTimeout(2600);
    assert.equal(await op(), '0');
  });
});

test('Würfel: überlappen bei 960, 1280 und 1440 px keinen Inhalt', async () => {
  await withSite(async ({ origin, newPage }) => {
    for (const width of [960, 1280, 1440, 1920]) {
      const page = await newPage({ viewport: { width, height: 900 } });
      await page.goto(origin + '/', { waitUntil: 'networkidle' });
      const r = await page.evaluate(() => {
        const contentRight = Math.max(...[...document.querySelectorAll('.wrap')].map(w => { const cs = getComputedStyle(w); return w.getBoundingClientRect().right - parseFloat(cs.paddingRight); }));
        const cubeLeft = Math.min(...[...document.querySelectorAll('.cubes .cube')].map(c => c.getBoundingClientRect().left));
        return { contentRight, cubeLeft };
      });
      assert.ok(r.cubeLeft >= r.contentRight + 4, `bei ${width}: Würfel ${r.cubeLeft} vs Inhalt ${r.contentRight}`);
      await page.close();
    }
  });
});

test('Würfel: nur auf der Startseite', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    for (const p of ['/lebenslauf/', '/impressum/', '/datenschutz/', '/404.html']) {
      await page.goto(origin + p, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('.cubes').count(), 0, p);
    }
  });
});

test('Würfel: reduzierte Bewegung ohne Übergang, ohne JS bleiben es Ankerlinks, axe sauber', async () => {
  await withSite(async ({ origin, newPage, axe }) => {
    const rm = await newPage({ reducedMotion: 'reduce' });
    await rm.goto(origin + '/', { waitUntil: 'networkidle' });
    assert.equal(await rm.locator('.cubes .cube').first().evaluate(c => getComputedStyle(c).transitionDuration), '0s');
    const nojs = await newPage({ javaScriptEnabled: false });
    await nojs.goto(origin + '/', { waitUntil: 'networkidle' });
    assert.equal(await nojs.locator('.cubes .cube').count(), 6);
    assert.ok(await nojs.locator('nav.cubes').isVisible());
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__heroDoneAt);
    assert.deepEqual((await axe(page)).map(v => v.id + ': ' + v.nodes.map(n => n.target).join(' ')), []);
  });
});
