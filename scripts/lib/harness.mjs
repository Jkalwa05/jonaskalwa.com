// Startet den lokalen Server (nur 127.0.0.1) und einen Browser für die Tests.
import { spawn } from 'node:child_process';
import http from 'node:http';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';
const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('../../', import.meta.url));
const PORT = 4181;
export const origin = `http://127.0.0.1:${PORT}`;
const fallbackChrome = path.join(homedir(), 'Library/Caches/ms-playwright/chromium_headless_shell-1254/chrome-headless-shell-mac-arm64/chrome-headless-shell');

/** Einfacher GET über node:http (fetch meldet auf manchen Macs setTypeOfService EINVAL). */
export function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => { let text = ''; res.setEncoding('utf8'); res.on('data', c => { text += c; }); res.on('end', () => resolve({ status: res.statusCode, text })); }).on('error', reject);
  });
}

async function waitForServer() {
  for (let i = 0; i < 50; i++) {
    try { const r = await httpGet(origin + '/'); if (r.status) return; } catch {}
    await new Promise(r => setTimeout(r, 100));
  }
  throw new Error('Testserver startet nicht');
}

export async function withSite(fn) {
  const { chromium } = require('playwright');
  const server = spawn(process.execPath, ['scripts/serve.mjs'], { cwd: root, env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
  let browser;
  try {
    await waitForServer();
    let executablePath = process.env.CHROME_PATH;
    if (!executablePath) { try { await fs.access(fallbackChrome); executablePath = fallbackChrome; } catch {} }
    browser = await chromium.launch({ executablePath, headless: true });
    const axePath = require.resolve('axe-core/axe.min.js');
    await fn({
      origin, browser,
      newPage: async (opts = {}) => {
        const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, ...opts });
        page.setDefaultTimeout(6000);
        page.errors = [];
        page.outside = [];
        page.on('pageerror', e => page.errors.push(e.message));
        page.on('console', m => { if (m.type() === 'error') page.errors.push(m.text()); });
        page.on('request', r => { const u = r.url(); if (!u.startsWith(origin) && !u.startsWith('data:') && !u.startsWith('blob:')) page.outside.push(u); });
        return page;
      },
      axe: async page => {
        await page.addScriptTag({ path: axePath });
        return page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } })).violations);
      },
    });
  } finally {
    await browser?.close();
    server.kill();
  }
}
