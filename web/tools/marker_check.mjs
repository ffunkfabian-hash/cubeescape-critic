// Headless check of the marker page from marker/dist (local mode, no artifact database): loads the page at desktop and
// phone width, sets a pin and draws a stroke, and writes screenshots to renders/marker_*.png.
// Usage: node tools/marker_check.mjs   (after tools/marker_build.mjs)
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const playwright = require('playwright');
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'marker', 'dist');
const out = path.join(root, 'renders');
const TYPES = { '.js': 'text/javascript', '.json': 'application/json', '.glb': 'model/gltf-binary', '.jpg': 'image/jpeg' };

// Same skeleton the artifact host wraps around the page.
const page = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<style>:root{color-scheme:light;padding:env(safe-area-inset-top,0) 0 env(safe-area-inset-bottom,0)}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style>
</head><body>${readFileSync(path.join(root, 'marker', 'page.html'), 'utf8')}</body></html>`;
const server = createServer((req, res) => {
  const name = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/^\/+/, '');
  if (!name) return res.writeHead(200, { 'content-type': 'text/html' }).end(page);
  const file = path.join(dist, path.basename(name));
  if (!existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' }).end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/`;

const browser = await playwright.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const errors = [];
try {
  for (const [name, viewport, scheme] of [['desktop', { width: 1280, height: 800 }, 'light'], ['phone', { width: 400, height: 860 }, 'dark']]) {
    const ctx = await browser.newContext({ viewport, colorScheme: scheme, hasTouch: name === 'phone' });
    const p = await ctx.newPage();
    p.setDefaultTimeout(120000);
    p.on('pageerror', (e) => errors.push(`${name}: ${e.message}`));
    p.on('console', (m) => m.type() === 'error' && errors.push(`${name}: ${m.text()}`));
    await p.goto(url);
    await p.waitForFunction(() => window.__markerReady === true);
    await p.waitForTimeout(800);
    await p.screenshot({ path: path.join(out, `marker_${name}_start.png`), fullPage: true });
    const box = await p.locator('#stage canvas').boundingBox();
    const cx = box.x + box.width / 2, cy = box.y + box.height * 0.5;
    // Pin: a short click on the helmet.
    await p.mouse.click(cx - box.width * 0.03, cy - box.height * 0.08);
    await p.waitForSelector('#form:not([hidden])');
    await p.fill('#f-notiz', 'Testmarker: Kante härter');
    await p.click('#f-save');
    await p.waitForSelector('#form[hidden]', { state: 'attached' });
    // Stroke: pen mode, drag across the face.
    await p.click('[data-mode="stift"]');
    await p.mouse.move(cx - box.width * 0.06, cy + box.height * 0.02);
    await p.mouse.down();
    for (let i = 1; i <= 20; i++) await p.mouse.move(cx - box.width * 0.06 + i * box.width * 0.006, cy + box.height * 0.02 + Math.sin(i / 3) * 8);
    await p.mouse.up();
    await p.waitForSelector('#form:not([hidden])');
    await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(out, `marker_${name}_draft.png`), fullPage: true });
    const info = await p.evaluate(() => ({
      pins: document.querySelectorAll('.pin').length,
      list: [...document.querySelectorAll('.satz')].map((e) => e.textContent),
      vorschlag: document.querySelector('.form-head .mono')?.textContent,
      overflow: document.documentElement.scrollWidth > innerWidth,
    }));
    console.log(name, JSON.stringify(info));
    await ctx.close();
  }
} finally {
  await browser.close();
  server.close();
}
if (errors.length) {
  console.error('Browser-Fehler:\n' + errors.join('\n'));
  process.exitCode = 1;
}
