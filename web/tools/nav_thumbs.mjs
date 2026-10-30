// Preview images of the navigation (0.20 "Livery"): the viewer headless renders every model, helmet variant, colour scheme and skin
// once on the panel's tile colour; the navigation shows them as tiles (web/src/navThumbs/<kind>_<key>.jpg, imported by Vite).
// Render again after a change of form, variant, scheme or skin recipe:
//   node tools/nav_thumbs.mjs [--only skin_neon,model_paladin] [--gpu metal|swiftshader]
// Default GPU: Metal on macOS (seconds), SwiftShader elsewhere (minutes). Writes JPEG, quality 82.
import { mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(root, 'src', 'navThumbs');
const o = { only: '', gpu: process.platform === 'darwin' ? 'metal' : 'swiftshader' };
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const k = argv[i].replace(/^--/, '');
  if (!(k in o)) throw new Error(`nav_thumbs: unknown argument ${argv[i]}`);
  o[k] = argv[++i];
}
export const TILE_BACKGROUND = '#263035'; // .nav-tile in index.html
// Close-up of chest, shoulders and helmet on a robot (robot frame, see skin_shots.mjs)
const CHEST = { pos: [0.7, -0.35, 5.4], target: [0, -0.85, 0] };
const skins = Object.keys(JSON.parse(readFileSync(path.join(root, 'src', 'skins.json'), 'utf8')).skins);
const variants = JSON.parse(readFileSync(path.join(root, 'src', 'criticHelmetVariants.json'), 'utf8')).variants;
const shots = [
  ...['waechter', 'paladin', 'mechanik'].map(m => ({ name: `model_${m}`, size: [176, 220], query: `model=${m}` })),
  { name: 'model_critic', size: [176, 220], query: '', zoom: 1.3 },
  { name: 'model_scout', size: [176, 220], query: 'model=scout', zoom: 1.3 },
  ...Object.entries(variants).map(([k, v]) => ({ name: `variant_${k}`, size: [144, 144], query: `finish=${v.finish}&accents=${v.accents}&strips=${v.strips}&colors=original`, zoom: 1.15 })),
  ...['body', 'helmet'].map(c => ({ name: `scheme_${c}`, size: [144, 144], query: `model=waechter&colors=${c}`, camera: CHEST })),
  ...skins.map(s => ({ name: `skin_${s}`, size: [144, 144], query: `model=waechter&skin=${s}`, camera: CHEST })),
].filter(s => !o.only || o.only.split(',').includes(s.name));

mkdirSync(out, { recursive: true });
const { createServer } = await import('vite');
const playwright = await import('playwright');
const server = await createServer({ root, logLevel: 'error', server: { port: 5198, strictPort: false, host: '127.0.0.1' } });
await server.listen();
const browser = await playwright.chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  args: o.gpu === 'metal' ? ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] : ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
try {
  for (const shot of shots) {
    const page = await browser.newPage({ viewport: { width: shot.size[0], height: shot.size[1] }, deviceScaleFactor: 1 });
    page.setDefaultTimeout(300000);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(`${server.resolvedUrls.local[0]}?ui=0&static=1&labels=0${shot.query ? '&' + shot.query : ''}`);
    await page.waitForFunction(() => window.__ready === true);
    await page.evaluate(({ camera: cam, zoom, bg }) => {
      const { camera, controls, scene, THREE } = window;
      scene.background = new THREE.Color(bg);
      window.setCameraView('front');
      if (cam) {
        camera.position.set(...cam.pos);
        controls.target.set(...cam.target);
        camera.lookAt(...cam.target);
        controls.update();
      }
      if (zoom) { camera.position.sub(controls.target).multiplyScalar(zoom).add(controls.target); controls.update(); } // >1: further away
      window.renderFrame();
    }, { camera: shot.camera, zoom: shot.zoom, bg: TILE_BACKGROUND });
    if (errors.length) throw new Error(`${shot.name}: ${errors.join('\n')}`);
    await page.screenshot({ path: path.join(out, `${shot.name}.jpg`), type: 'jpeg', quality: 82 });
    console.log(`[nav_thumbs] ${shot.name}.jpg`);
    await page.close();
  }
} finally {
  await browser.close();
  await server.close();
}
