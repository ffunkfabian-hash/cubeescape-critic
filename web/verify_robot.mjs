// Headless check of the robot against EVERY video frame:
//   runs/robot/render_masks/fNNN.png – white silhouette of the reconstruction from the camera of frame NNN
//   renders/robot_render_<view>.png  – coloured render of the four main views
// then runs tools/robot/frame_iou.py (IoU per frame, chart, comparison sheet).
// Needs the generated assets: python3 tools/robot/segment.py && python3 tools/robot/hull.py && python3 tools/robot/mesh.py
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createServer } from 'vite';

const require = createRequire(import.meta.url);
const playwright = require('playwright');
const root = path.dirname(fileURLToPath(import.meta.url));
const repo = path.join(root, '..');
const maskDir = path.join(repo, 'runs', 'robot', 'render_masks');
const out = path.join(root, 'renders');
mkdirSync(maskDir, { recursive: true });
mkdirSync(out, { recursive: true });

const server = await createServer({ root, logLevel: 'error', server: { port: 5196, host: '127.0.0.1' } });
await server.listen();
const browser = await playwright.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.setDefaultTimeout(180000);
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
try {
  await page.goto(`${server.resolvedUrls.local[0]}robot.html?ui=0&static=1`);
  await page.waitForFunction(() => window.__ready === true);
  for (const v of ['front', 'left', 'back', 'right']) {
    await page.evaluate((v) => { window.setCameraView(v); window.renderFrame(); }, v);
    await page.screenshot({ path: path.join(out, `robot_render_${v}.png`) });
  }
  const n = await page.evaluate(() => window.robotCamera.phis.length);
  await page.evaluate(() => window.setMaskMode(true));
  for (let i = 0; i < n; i++) {
    await page.evaluate((i) => { window.setFrameView(i); window.renderFrame(); }, i);
    await page.screenshot({ path: path.join(maskDir, `f${String(i + 1).padStart(3, '0')}.png`) });
  }
  console.log(`${n} Frames gerendert`);
} finally {
  await browser.close();
  await server.close();
}
if (errors.length) {
  console.error('Browser-Fehler:\n' + errors.join('\n'));
  process.exitCode = 1;
}
const r = spawnSync('python3', ['-I', path.join(root, 'tools', 'robot', 'frame_iou.py'), repo], { stdio: 'inherit' });
if (r.status) process.exitCode = r.status;
