// Comparison of a robot body: Blender GLB (gen=glb) against the three.js generator (gen=three), same viewer, same cameras.
// Writes to <out>/<gen>/: render_<view>.png and mask_<view>.png for front, left, back, right (assembled, flat colours, study
// helmet), close_<shot>.png (close-ups with fixed cameras, flat and aged) and exploded.png; then runs robotgen_iou.py
// (silhouette IoU per view and comparison sheets) if Python with Pillow and NumPy is available.
// Usage: node tools/robotgen_compare.mjs [--model=waechter] [--out=renders/robotgen] [--no-iou]
import { mkdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const opt = { model: 'waechter', out: 'renders/robotgen', noIou: false };
for (const a of process.argv.slice(2)) {
  const m = /^--(model|out)=(.+)$/.exec(a);
  if (m) opt[m[1]] = m[2];
  else if (a === '--no-iou') opt.noIou = true;
  else throw new Error(`Unknown argument: ${a}`);
}
const out = path.resolve(root, opt.out);
const VIEWS = ['front', 'left', 'back', 'right'];
// Close-ups (viewer world: robot frame of ROBOT_FRAME, front +Z): camera position and target.
const CLOSE = {
  chest: { pos: [2.2, -0.2, 4.6], target: [0, -0.9, 0] },
  head: { pos: [-1.3, 0.4, 2.6], target: [0, 0.05, 0] },
  hip_leg: { pos: [2.6, -3.0, 4.2], target: [0, -3.0, 0] },
  back: { pos: [-2.4, -0.6, -4.2], target: [0, -1.0, 0] },
  hand: { pos: [-3.4, -2.2, 2.6], target: [-1.3, -2.6, 0.2] },
};

const { createServer } = await import('vite');
const playwright = await import('playwright');
const server = await createServer({ root, logLevel: 'error', server: { port: 5198, strictPort: false, host: '127.0.0.1' } });
await server.listen();
const url = server.resolvedUrls.local[0];
const browser = await playwright.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const result = { model: opt.model, startedAt: new Date().toISOString(), gens: {} };
const errors = [];
try {
  for (const gen of ['glb', 'three']) {
    const dir = path.join(out, gen);
    mkdirSync(dir, { recursive: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    page.setDefaultTimeout(240000);
    page.on('pageerror', e => errors.push(`${gen}: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`${gen}: ${m.text()}`); });
    const t0 = performance.now();
    const shot = async (file) => { await page.evaluate(() => window.renderFrame()); await page.screenshot({ path: path.join(dir, file) }); };
    const open = async (extra) => {
      await page.goto(`${url}?model=${opt.model}&gen=${gen}&ui=0&static=1&helmet=study&${extra}`);
      await page.waitForFunction(() => window.__ready === true, null, { timeout: 240000 });
    };
    await open('wear=off');
    const loadMs = performance.now() - t0;
    const info = await page.evaluate(() => {
      let r = null;
      window.scene.traverse(o => { if (!r && o.userData.robot) r = o; });
      let meshes = 0, tris = 0;
      r?.traverse(o => { if (o.isMesh && o.userData.asm) { meshes++; tris += (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3; } });
      return { meshes, tris, gen: r?.userData.gen };
    });
    for (const v of VIEWS) {
      await page.evaluate(v => window.setCameraView(v), v);
      await shot(`render_${v}.png`);
      await page.evaluate(() => window.setMaskMode(true));
      await shot(`mask_${v}.png`);
      await page.evaluate(() => window.setMaskMode(false));
    }
    const close = async (suffix) => {
      for (const [k, c] of Object.entries(CLOSE)) {
        await page.evaluate(c => { window.camera.position.set(...c.pos); window.controls.target.set(...c.target); window.camera.lookAt(...c.target); window.controls.update(); }, c);
        await shot(`close_${k}${suffix}.png`);
      }
    };
    await close('');
    await open('wear=on');
    await close('_wear');
    await open('wear=off&exploded=1');
    await page.evaluate(() => window.setCameraView('front'));
    await shot('exploded.png');
    result.gens[gen] = { loadMs: Math.round(loadMs), ...info };
    await page.close();
    console.log(`${gen}: ${info.meshes} meshes, ${info.tris} triangles, load ${Math.round(loadMs)} ms`);
  }
} finally {
  await browser.close();
  await server.close();
}
result.errors = errors;
if (!opt.noIou) {
  // python3 with Pillow and NumPy, else uv with web/requirements.txt (Mac without the packages, docs/LESSONS.md)
  const plain = spawnSync('python3', ['-c', 'import numpy, PIL'], { encoding: 'utf8' }).status === 0;
  const cmd = plain ? ['python3', '-I'] : ['uv', 'run', '--no-project', '--with-requirements', path.join(root, 'requirements.txt'), 'python', '-I'];
  const py = spawnSync(cmd[0], [...cmd.slice(1), path.join(root, 'tools', 'robotgen_iou.py'), out], { encoding: 'utf8' });
  if (py.status !== 0) errors.push(`robotgen_iou.py: ${py.stderr || py.stdout}`);
  else { result.iou = JSON.parse(py.stdout); console.log('IoU', JSON.stringify(result.iou.views)); }
}
writeFileSync(path.join(out, 'compare.json'), JSON.stringify(result, null, 2) + '\n');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
