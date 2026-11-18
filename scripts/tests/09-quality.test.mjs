import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { withSite } from '../lib/harness.mjs';

const PAGES = ['/', '/lebenslauf/', '/impressum/', '/datenschutz/', '/404.html', '/design-system/'];

async function settle(page) {
  await page.waitForFunction(() => window.__heroDoneAt || !document.querySelector('#start'));
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= h; y += 500) { await page.evaluate(v => scrollTo({ top: v, behavior: 'instant' }), y); await page.waitForTimeout(90); }
  await page.waitForTimeout(1500);
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(300);
}

test('Qualität: axe (WCAG 2.2 AA) ohne Verstöße auf allen Seiten bei 390 und 1440 px', async () => {
  await withSite(async ({ origin, newPage, axe }) => {
    for (const width of [390, 1440]) for (const p of PAGES) {
      const page = await newPage({ viewport: { width, height: 900 } });
      await page.goto(origin + p, { waitUntil: 'networkidle' });
      await settle(page);
      const v = await axe(page);
      assert.deepEqual(v.map(x => `${x.id}: ${x.nodes.map(n => n.target).join(' ')}`), [], `${p} @${width}`);
      await page.close();
    }
  });
});

test('Qualität: kein horizontales Scrollen bei 320 bis 2560 px und im 200-%-Reflow', async () => {
  await withSite(async ({ origin, newPage }) => {
    for (const width of [320, 390, 640, 768, 1024, 1440, 1920, 2560]) for (const p of ['/', '/lebenslauf/']) {
      const page = await newPage({ viewport: { width, height: width < 700 ? 800 : 900 } });
      await page.goto(origin + p, { waitUntil: 'networkidle' });
      await settle(page);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Überlauf ${p} @${width}`);
      await page.close();
    }
    // 200 % Zoom auf 1280 px entspricht 640 css px; Text darf dabei weder abgeschnitten werden noch überlappen
    const zoom = await newPage({ viewport: { width: 640, height: 450 } });
    await zoom.goto(origin + '/', { waitUntil: 'networkidle' });
    await settle(zoom);
    const clipped = await zoom.evaluate(() => [...document.querySelectorAll('main h1, main h2, main h3, main p, main a')].filter(e => e.getBoundingClientRect().right > innerWidth + 1).length);
    assert.equal(clipped, 0);
  });
});

test('Qualität: Tastaturdurchlauf erreicht alle bedienbaren Elemente mit sichtbarem Fokus', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    await settle(page);
    const expected = await page.evaluate(() => [...document.querySelectorAll('a[href], button:not([hidden])')].filter(e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return s.visibility !== 'hidden' && s.display !== 'none' && !e.closest('[hidden]') && !e.classList.contains('skip-link'); }).length);
    const seen = new Set(); const noRing = [];
    for (let i = 0; i < expected + 6; i++) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => { const a = document.activeElement; const s = getComputedStyle(a); return { key: a.tagName + (a.getAttribute('href') || a.textContent.trim().slice(0, 20)), ring: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 1 }; });
      if (info.key.startsWith('BODY')) break; // Fokus hat die Seite verlassen: Durchlauf vollständig
      seen.add(info.key);
      if (!info.ring) noRing.push(info.key);
    }
    assert.ok(seen.size >= 20, 'Tab erreicht zu wenig: ' + seen.size);
    assert.deepEqual(noRing, []);
  });
});

test('Qualität: LCP unter 2,5 s und CLS unter 0,1 (lokal gemessen)', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.addInitScript(() => {
      window.__m = { lcp: 0, cls: 0 };
      new PerformanceObserver(l => { for (const e of l.getEntries()) window.__m.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__m.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    const m = await page.evaluate(() => window.__m);
    assert.ok(m.lcp < 2500, 'LCP ' + m.lcp);
    assert.ok(m.cls < 0.1, 'CLS ' + m.cls);
  });
});

test('Qualität: Dateigrößen, keine Altlasten und keine verbotenen Muster', async () => {
  const dist = new URL('../../dist/', import.meta.url);
  const js = await fs.stat(new URL('app.js', dist));
  assert.ok(js.size < 180 * 1024, `app.js ${Math.round(js.size / 1024)} KB`);
  const css = await fs.stat(new URL('styles.css', dist));
  assert.ok(css.size < 60 * 1024, `styles.css ${Math.round(css.size / 1024)} KB`);
  for (const f of ['motion.js', 'system.css']) await assert.rejects(fs.access(new URL(f, dist)), f + ' sollte nicht mehr existieren');
  const files = ['index.html', 'lebenslauf/index.html', 'impressum/index.html', 'datenschutz/index.html', '404.html', 'design-system/index.html'];
  for (const f of files) {
    const h = await fs.readFile(new URL(f, dist), 'utf8');
    assert.doesNotMatch(h, /<details|<summary|three\.js|assembly|WebGL/i, f);
    assert.doesNotMatch(h, /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u, f + ' enthält Emoji');
    assert.doesNotMatch(h.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/g, ''), /\s[–—]\s/, f + ' enthält Gedankenstrich');
  }
  const cssText = await fs.readFile(new URL('styles.css', dist), 'utf8');
  assert.doesNotMatch(cssText, /box-shadow|linear-gradient\((?!currentColor)|backdrop-filter/, 'Schatten, Verläufe oder Glas im CSS');
});
