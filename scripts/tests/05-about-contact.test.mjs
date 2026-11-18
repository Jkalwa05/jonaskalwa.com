import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { withSite } from '../lib/harness.mjs';

const site = JSON.parse(await fs.readFile(new URL('../../src/content/site.json', import.meta.url), 'utf8'));
const norm = t => t.replace(/\s+/g, ' ').trim();

test('Über mich: Porträt, Text und Eckdaten sichtbar als Tabelle mit sicheren externen Links', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    assert.match(norm(await page.locator('#ueber-mich h2').innerText()), /^Ich baue Software, weil ich es gerne tue\.$/);
    const portrait = page.locator('#ueber-mich img');
    assert.equal(await portrait.getAttribute('src'), site.assets.portrait.src);
    assert.ok((await portrait.getAttribute('alt')).length > 10);
    const labels = (await page.locator('#ueber-mich .about-facts dt').allInnerTexts()).map(norm);
    for (const l of ['Ausbildung', 'Studium', 'Zertifikat', 'LinkedIn', 'GitHub']) assert.ok(labels.some(x => x.toLowerCase().includes(l.toLowerCase())), `${l} fehlt in ${labels.join('|')}`);
    const text = await page.locator('#ueber-mich .about-facts').innerText();
    for (const t of ['Industriekaufmann', 'Wirtschaftsinformatik', 'Universität Osnabrück', 'IBM AI Developer']) assert.ok(text.includes(t), t);
    for (const url of [site.links.linkedin, site.links.github]) {
      const a = page.locator(`#ueber-mich a[href="${url}"]`);
      assert.equal(await a.getAttribute('target'), '_blank');
      assert.match(await a.getAttribute('rel'), /noopener noreferrer/);
      assert.match(await a.textContent(), /öffnet in neuem Tab/);
    }
    assert.equal(await page.locator('#ueber-mich a[href="/lebenslauf/"]').count(), 1);
    assert.equal(await page.locator('#ueber-mich .steps li').count(), 3);
  });
});

test('Kontakt: Headline, E-Mail-Entwurf als Hauptaktion, kein Formular', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    assert.equal(norm(await page.locator('#kontakt h2').innerText()), 'Was möchtest du leichter machen?');
    const main = page.locator('#kontakt a.button').first();
    assert.match(await main.innerText(), /E-Mail vorbereiten/);
    const href = await main.getAttribute('href');
    assert.ok(href.startsWith('mailto:' + site.email + '?'), 'Adresse im mailto');
    const q = new URLSearchParams(href.split('?')[1]);
    assert.equal(q.get('subject'), 'Projektanfrage');
    assert.match(q.get('body'), /Hallo Jonas/);
    assert.equal(await page.locator('main form, main input, main textarea, main select').count(), 0);
  });
});

test('Kontakt: Adresse kopieren schreibt in die Zwischenablage und meldet Erfolg', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage({ permissions: ['clipboard-read', 'clipboard-write'] });
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    const btn = page.getByRole('button', { name: 'Adresse kopieren' });
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), site.email);
    assert.match(await page.locator('#kontakt [role=status]').innerText(), /kopiert/i);
  });
});

test('Kontakt: verweigerte Zwischenablage zeigt eine Meldung, der Link bleibt nutzbar', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('denied')) } }));
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    const btn = page.getByRole('button', { name: 'Adresse kopieren' });
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await page.waitForTimeout(200);
    const status = await page.locator('#kontakt [role=status]').innerText();
    assert.match(status, /nicht möglich/i);
    assert.ok(status.includes(site.email));
    assert.equal(await page.locator('#kontakt a[href^="mailto:"]').count() >= 2, true);
  });
});

test('Kontakt: ohne Zwischenablage-Unterstützung gibt es keinen toten Knopf', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: undefined }));
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    assert.equal(await page.getByRole('button', { name: 'Adresse kopieren' }).isVisible(), false);
    assert.ok(await page.locator('#kontakt a[href^="mailto:"]').first().isVisible());
  });
});

test('Über mich und Kontakt: kein Überlauf, keine Verstöße (390, 1440), ohne JS vollständig', async () => {
  await withSite(async ({ origin, newPage, axe }) => {
    for (const width of [390, 1440]) {
      const page = await newPage({ viewport: { width, height: 900 } });
      await page.goto(origin + '/', { waitUntil: 'networkidle' });
      await page.waitForFunction(() => window.__heroDoneAt);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.deepEqual((await axe(page)).map(v => v.id + ': ' + v.nodes.map(n => n.target).join(' ')), []);
      await page.close();
    }
    const nojs = await newPage({ javaScriptEnabled: false });
    await nojs.goto(origin + '/', { waitUntil: 'networkidle' });
    assert.equal(await nojs.getByRole('button', { name: 'Adresse kopieren' }).isVisible(), false);
    assert.ok(await nojs.locator('#kontakt h2').isVisible());
    assert.ok(await nojs.locator('#ueber-mich .about-facts').isVisible());
  });
});
