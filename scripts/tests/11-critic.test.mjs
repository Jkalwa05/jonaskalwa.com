import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withSite } from '../lib/harness.mjs';

test('Kritik 2: Würfel über dem weißen Laptop-Bild sind blau und damit sichtbar', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__heroDoneAt);
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => {
      const lap = document.querySelector('#start .device--laptop').getBoundingClientRect();
      return [...document.querySelectorAll('.cubes .cube')].map(c => { const b = c.getBoundingClientRect(); const y = b.top + b.height / 2, x = b.left + b.width / 2; return { over: x >= lap.left && x <= lap.right && y >= lap.top && y <= lap.bottom, on: c.dataset.on }; });
    });
    const over = r.filter(c => c.over);
    assert.ok(over.length >= 1, 'kein Würfel liegt über dem Laptop: Layout geändert?');
    assert.ok(over.every(c => c.on === 'light'), 'über dem Laptop: ' + over.map(c => c.on));
    assert.ok(r.filter(c => !c.over).every(c => c.on === 'blue'), 'neben dem Laptop bleibt es weiß auf Blau');
  });
});

test('Kritik 9: mobil zeigt der Hero nur das Smartphone, groß und mittig', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('#start .device--laptop').isVisible(), false);
    const b = await page.locator('#start .device--phone').boundingBox();
    assert.ok(b.width >= 200, 'Smartphone groß genug: ' + b.width);
    assert.ok(Math.abs(b.x + b.width / 2 - 195) <= 6, 'mittig: ' + (b.x + b.width / 2));
  });
});

test('Kritik 5: die Zeichnung wechselt erst, wenn die Überschrift des nächsten Blocks die Fenstermitte erreicht', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    const place = async delta => {
      await page.evaluate(d => { const b = document.querySelectorAll('#leistungen .service__body')[1].getBoundingClientRect(); const headY = b.top + innerHeight * 0.1; scrollTo({ top: scrollY + headY - innerHeight * 0.5 + d, behavior: 'instant' }); }, delta);
      await page.waitForTimeout(500);
      return page.evaluate(() => document.querySelector('#leistungen .schema.is-active').dataset.index);
    };
    assert.equal(await place(-60), '0', 'noch Zeichnung 1, solange die Überschrift unter der Mitte liegt');
    assert.equal(await place(60), '1', 'Zeichnung 2, sobald die Überschrift die Mitte erreicht hat');
  });
});

test('Kritik 3/4: Laptop und Foto sitzen bündig im Raster', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    const g = await page.evaluate(() => {
      const wrap = document.querySelector('#praxis .wrap'); const wr = wrap.getBoundingClientRect(); const pad = parseFloat(getComputedStyle(wrap).paddingLeft);
      const left = wr.left + pad, right = wr.right - pad;
      const lap = document.querySelector('#praxis .proof__device').getBoundingClientRect();
      const photo = document.querySelector('#praxis .proof--photo').getBoundingClientRect();
      const bodyLeft = document.querySelector('#praxis .split__body').getBoundingClientRect().left;
      return { left, right, lapL: lap.left, lapR: lap.right, photoL: photo.left, photoR: photo.right, bodyLeft };
    });
    assert.ok(Math.abs(g.lapL - g.left) <= 1 && Math.abs(g.lapR - g.right) <= 1, `Laptop volle Rasterbreite: ${g.lapL}-${g.lapR} vs ${g.left}-${g.right}`);
    assert.ok(Math.abs(g.photoR - g.right) <= 1, 'Foto endet an der rechten Inhaltskante');
    assert.ok(Math.abs(g.photoL - g.bodyLeft) <= 1, `Foto beginnt an der Textspalte: ${g.photoL} vs ${g.bodyLeft}`);
  });
});

test('Kritik 7: objelis zeigt das Drahtgittermodell ohne fremde Oberfläche', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    const src = await page.locator('#objelis img').getAttribute('src');
    assert.match(src, /objelis-modell/);
    const b = await page.locator('#objelis .objelis-visual').boundingBox();
    assert.ok(b.width > 500 && Math.abs(b.width - b.height) < 4, 'groß und quadratisch: ' + b.width + 'x' + b.height);
  });
});

test('Kritik 8, 10, 11: Pille deckt schnell, Porträt ist rund, Arbeitsschritte haben Text', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    const t = await page.locator('.header-bar').evaluate(e => getComputedStyle(e).transitionDuration.split(',').map(parseFloat));
    assert.ok(t.every(x => x <= 0.2), 'Pille wechselt in höchstens 200 ms: ' + t);
    const p = await page.locator('.portrait__img').evaluate(e => { const r = e.getBoundingClientRect(); return { ratio: r.width / r.height, radius: getComputedStyle(e).borderTopLeftRadius }; });
    assert.ok(Math.abs(p.ratio - 1) < 0.01); assert.equal(p.radius, '50%');
    const steps = await page.locator('#ueber-mich .steps li').evaluateAll(a => a.map(li => li.querySelector('p')?.textContent.trim().length || 0));
    assert.equal(steps.length, 3);
    assert.ok(steps.every(n => n > 30), 'jeder Schritt hat einen Satz: ' + steps);
    assert.equal(await page.locator('#ueber-mich .steps-block > .label').innerText(), 'So arbeite ich mit dir');
  });
});

test('Kritik 12: Überschrift der Leistungen passt zu allen drei Feldern', async () => {
  await withSite(async ({ origin, newPage }) => {
    const page = await newPage();
    await page.goto(origin + '/', { waitUntil: 'networkidle' });
    assert.equal((await page.locator('#leistungen h2').innerText()).replace(/\s+/g, ' '), 'Was ich für dich baue.');
  });
});
