// Headless check of the procedural robot against the model sheet: orthographic renders of the five sheet views
// (renders/parts_<view>.png), silhouettes (renders/parts_mask_<view>.png), then tools/robot/parts_iou.py.
// Needs: python3 tools/robot/sheet.py
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createServer } from 'vite';

const require = createRequire(import.meta.url);
const playwright = require('playwright');
const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(root, 'renders');
mkdirSync(out, { recursive: true });
const VIEWS = ['front', 'back', 'right', 'left', 'top'];

const server = await createServer({ root, logLevel: 'error', server: { port: 5195, host: '127.0.0.1' } });
await server.listen();
const browser = await playwright.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 800, height: 1100 } });
page.setDefaultTimeout(240000);
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => (m.type() === 'error' ? errors.push(m.text()) : m.text().startsWith('model built') && console.log(m.text())));
try {
  await page.goto(`${server.resolvedUrls.local[0]}robot_parts.html?ui=0&static=1`);
  await page.waitForFunction(() => window.__ready === true);
  for (const v of VIEWS) {
    await page.evaluate((v) => { window.setCameraView(v); window.renderFrame(); }, v);
    await page.screenshot({ path: path.join(out, `parts_${v}.png`) });
    await page.evaluate(() => { window.setMaskMode(true); window.renderFrame(); });
    await page.screenshot({ path: path.join(out, `parts_mask_${v}.png`) });
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
const r = spawnSync('python3', ['-I', path.join(root, 'tools', 'robot', 'parts_iou.py'), path.join(root, '..')], { stdio: 'inherit' });
if (r.status) process.exitCode = r.status;
