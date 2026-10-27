// Headless check: starts Vite, renders the four reference views and writes
//   renders/render_<view>.png   – shaded render
//   renders/overlay_<view>.png  – render with the reference frame in difference blend
//   renders/mask_<view>.png     – white silhouette on black (input for tools/iou.py)
// then runs tools/iou.py (silhouette IoU per view, if Python with Pillow and NumPy is available).
// Usage: node verify_renders.mjs [--no-iou]
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createServer } from 'vite';

const require = createRequire(import.meta.url);
let playwright;
try {
  playwright = require('playwright');
} catch {
  playwright = require('/opt/node-tools/node_modules/playwright');
}

const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(root, 'renders');
mkdirSync(out, { recursive: true });
const VIEWS = ['front', 'left', 'back', 'right'];

const server = await createServer({ root, logLevel: 'error', server: { port: 5199, strictPort: false, host: '127.0.0.1' } });
await server.listen();
const url = server.resolvedUrls.local[0];

const browser = await playwright.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.setDefaultTimeout(120000);
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
  else if (m.text().startsWith('model built')) console.log(m.text());
});

try {
  await page.goto(`${url}?ui=0&static=1`);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
  const settle = () => page.evaluate(() => { const t = performance.now(); window.renderFrame(); return performance.now() - t; });
  for (const v of VIEWS) {
    await page.evaluate((v) => window.setCameraView(v), v);
    console.log(`${v}: frame ${(await settle()).toFixed(0)} ms`);
    await page.screenshot({ path: path.join(out, `render_${v}.png`) });
    await page.evaluate(() => window.toggleOverlay(true, 'difference'));
    await page.waitForFunction(() => document.getElementById('overlay').complete);
    await settle();
    await page.screenshot({ path: path.join(out, `overlay_${v}.png`) });
    await page.evaluate(() => { window.toggleOverlay(false); window.setMaskMode(true); });
    await settle();
    await page.screenshot({ path: path.join(out, `mask_${v}.png`) });
    await page.evaluate(() => window.setMaskMode(false));
    
  }
} finally {
  await browser.close();
  await server.close();
}
if (errors.length) {
  console.error('Browser-Fehler:\n' + errors.join('\n'));
  process.exitCode = 1;
}
if (!process.argv.includes('--no-iou')) {
  const r = spawnSync('python3', ['-I', path.join(root, 'tools', 'iou.py'), root], { stdio: 'inherit' });
  if (r.status) process.exitCode = r.status;
}
