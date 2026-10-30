// Skin comparison shots (0.13 "Skins"): the viewer headless with fixed cameras, one PNG per skin and view, so two versions of
// the skins (Blender bake 0.13 interim, three.js mixer) can be compared with the same camera.
//   node tools/skin_shots.mjs --out <dir> [--model waechter] [--skins rost,glut,ornat] [--helmet study] [--views front,back,chest,shoulder]
//     [--size 1100x1100] [--extra "&key=value"] (--helmet '' for a helmet alone, views v_front … keep the viewer's camera)
//     [--textures 2048] also writes the exported skin textures <atlas>_<skin>_<basecolor|orm|emissive>.png
// Writes <dir>/<model>_<skin>_<view>.png and <dir>/shots.json (URLs and cameras).
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const o = { out: null, model: 'waechter', skins: 'rost,glut,ornat', helmet: 'study', views: 'front,back,chest,shoulder', size: '1100x1100', extra: '', textures: '0' };
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const k = argv[i].replace(/^--/, '');
  if (!(k in o)) throw new Error(`skin_shots: unknown argument ${argv[i]}`);
  o[k] = argv[++i];
}
if (!o.out) throw new Error('skin_shots: --out required');
// Cameras in the robot frame (ROBOT_FRAME: feet at y = −4.85, height 5.44): position and target.
export const SHOT_CAMERAS = {
// light: viewer view whose light rig and environment turn are used (lights turn with the camera azimuth).
  front: { pos: [0, -1.6, 11.8], target: [0, -2.2, 0], light: 'front' },
  back: { pos: [0, -1.6, -11.8], target: [0, -2.2, 0], light: 'back' },
  chest: { pos: [0.9, -0.2, 4.2], target: [0, -0.75, 0], light: 'front' },
  shoulder: { pos: [3.2, 0.2, 2.6], target: [0.75, -0.6, 0], light: 'left' },
  head: { pos: [0.5, 0.6, 2.4], target: [0, 0.05, 0], light: 'front' },
  legs: { pos: [1.2, -3.2, 5.0], target: [0, -3.4, 0], light: 'front' },
  // viewer views as they are (helmet alone: the reference views of the helmet frame)
  v_front: { light: 'front' }, v_left: { light: 'left' }, v_back: { light: 'back' }, v_right: { light: 'right' },
};
const [w, h] = o.size.split('x').map(Number);
const out = path.resolve(o.out);
mkdirSync(out, { recursive: true });
const { createServer } = await import('vite');
const playwright = await import('playwright');
const server = await createServer({ root, logLevel: 'error', server: { port: 5197, strictPort: false, host: '127.0.0.1' } });
await server.listen();
const browser = await playwright.chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const record = { model: o.model, helmet: o.helmet, size: [w, h], shots: [] };
try {
  for (const skin of o.skins.split(',')) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    page.setDefaultTimeout(Number(process.env.SHOT_TIMEOUT ?? 300000));
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    const url = `${server.resolvedUrls.local[0]}?ui=0&static=1&labels=0&model=${o.model}${o.helmet ? `&helmet=${o.helmet}` : ''}&skin=${skin}${o.extra}`;
    await page.goto(url);
    await page.waitForFunction(() => window.__ready === true).catch(e => { throw new Error(`${e.message}\n${errors.join('\n')}`); });
    for (const view of o.views.split(',')) {
      const cam = SHOT_CAMERAS[view];
      if (!cam) throw new Error(`skin_shots: unknown view ${view}`);
      await page.evaluate(({ pos, target, light }) => {
        const { camera, controls } = window;
        window.setCameraView(light);
        if (pos) {
          camera.position.set(...pos);
          controls.target.set(...target);
          camera.lookAt(...target);
          controls.update();
        }
        window.renderFrame();
      }, cam);
      const file = path.join(out, `${o.model}_${skin}_${view}.png`);
      await page.screenshot({ path: file });
      record.shots.push({ skin, view, url, camera: cam, file: path.basename(file) });
      console.log(`[skin_shots] ${path.basename(file)}`);
    }
    if (Number(o.textures)) {
      const files = await page.evaluate(async size => {
        const out = {};
        for (const st of window.activeSkinStates()) for (const [kind, img] of Object.entries(window.bakeSkinTextures(window.renderer, st, size))) {
          const c = document.createElement('canvas');
          c.width = img.width; c.height = img.height;
          c.getContext('2d').putImageData(img, 0, 0);
          out[`${st.atlas.model}_${st.active}_${kind}.png`] = c.toDataURL('image/png').split(',')[1];
        }
        return out;
      }, Number(o.textures));
      for (const [name, b64] of Object.entries(files)) { writeFileSync(path.join(out, name), Buffer.from(b64, 'base64')); console.log(`[skin_shots] ${name}`); }
    }
    if (errors.length) throw new Error(errors.join('\n'));
    await page.close();
  }
} finally {
  writeFileSync(path.join(out, 'shots.json'), JSON.stringify(record, null, 1) + '\n');
  await browser.close();
  await server.close();
}
