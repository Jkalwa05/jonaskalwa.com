// Screenshots für die Sichtprüfung: node scripts/lib/shoot.mjs <pfad> <breite> <datei> [scrollY|full]
import { withSite } from './harness.mjs';
const [, , route = '/', width = '1440', file = 'qa/weiss/shot.png', mode = '0'] = process.argv;
await withSite(async ({ origin, newPage }) => {
  const page = await newPage({ viewport: { width: Number(width), height: Number(width) < 700 ? 844 : 900 } });
  await page.goto(origin + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);
  if (mode === 'full') {
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 500) { await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(250); }
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(400);
    await page.screenshot({ path: file, fullPage: true });
  } else {
    await page.evaluate(v => scrollTo(0, v), Number(mode)); await page.waitForTimeout(1500);
    await page.screenshot({ path: file });
  }
  console.log(page.errors.length ? 'Konsolenfehler: ' + page.errors.join(' | ') : 'ok ' + file);
});
