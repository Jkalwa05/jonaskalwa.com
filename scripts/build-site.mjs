// Erzeugt dist/ aus src/: Seiten, styles.css, app.js. Fasst dist/assets nie an.
import fs from 'node:fs/promises';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { document } from '../src/layout.mjs';
import { home, SECTIONS } from '../src/pages/home.mjs';
import { impressum, datenschutz } from '../src/pages/legal.mjs';
import { notFound } from '../src/pages/not-found.mjs';
import { lebenslauf } from '../src/pages/lebenslauf.mjs';
import { cubes } from '../src/sections/cubes.mjs';
import { designSystem } from '../src/pages/design-system.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const site = JSON.parse(await fs.readFile(path.join(root, 'src/content/site.json'), 'utf8'));
const cv = JSON.parse(await fs.readFile(path.join(root, 'src/content/cv.json'), 'utf8'));

async function write(rel, content) {
  const file = path.join(dist, rel);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content);
}

const pages = [
  ['index.html', { title: 'Kalwa Software | Software, Websites und Automatisierungen', description: 'Jonas Kalwa entwickelt Websites, individuelle Anwendungen und Automatisierungen für Menschen und Betriebe in ganz Deutschland.', path: '/', body: home(site), bodyClass: 'has-cubes', cubes: cubes(SECTIONS) }],
  ['lebenslauf/index.html', { title: 'Lebenslauf | Kalwa Software', description: 'Werdegang von Jonas Kalwa: Beruf, Studium, Hackathons und Schwerpunkte.', path: '/lebenslauf/', body: lebenslauf(site, cv) }],
  ['impressum/index.html', { title: 'Impressum | Kalwa Software', description: 'Impressum von Jonas Kalwa, Kalwa Software.', path: '/impressum/', body: impressum(site) }],
  ['datenschutz/index.html', { title: 'Datenschutz | Kalwa Software', description: 'Datenschutzhinweise von Kalwa Software.', path: '/datenschutz/', body: datenschutz(site) }],
  ['design-system/index.html', { title: 'Design-System | Kalwa Software', description: 'Interne Komponentenreferenz.', path: '/design-system/', body: designSystem(), noindex: true }],
  ['404.html', { title: 'Seite nicht gefunden | Kalwa Software', description: 'Diese Seite gibt es nicht.', path: '/404.html', body: notFound(site), noindex: true }],
];
for (const [rel, p] of pages) await write(rel, document({ site, ...p }));
await write('robots.txt', 'User-agent: *\nAllow: /\nDisallow: /design-system/\n');

// Alter Lebenslauf-Link bleibt erreichbar.
await write('cv.html', `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=/lebenslauf/"><title>Lebenslauf | Kalwa Software</title><meta name="robots" content="noindex,nofollow"></head><body><h1>Lebenslauf</h1><p><a href="/lebenslauf/">Zum Lebenslauf</a></p></body></html>\n`);

await build({ absWorkingDir: root, entryPoints: { styles: 'src/css/main.css' }, outdir: 'dist', bundle: true, minify: true, loader: { '.woff2': 'file' }, external: ['/assets/*'], logLevel: 'warning' });
await build({ absWorkingDir: root, entryPoints: { app: 'src/js/main.js' }, outdir: 'dist', bundle: true, format: 'esm', minify: true, target: ['es2022'], legalComments: 'eof', logLevel: 'warning' });
console.log(`Site gebaut: ${pages.length} Seiten, ${SECTIONS.length} Abschnitte, styles.css, app.js.`);
