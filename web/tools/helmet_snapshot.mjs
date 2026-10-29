// Helm H snapshot for the skin template (0.13 "Skins"): the helmet exactly as the viewer hangs it on a robot (variant, headset,
// original materials, wear off), exported in the Critic helmet frame as GLB. blender/robot/helmet_template.py unwraps it.
//   node tools/helmet_snapshot.mjs <out.glb> [variant=80] [headset=on]
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const [out, variant = '80', headset = 'on'] = process.argv.slice(2);
if (!out) throw new Error('usage: node tools/helmet_snapshot.mjs <out.glb> [variant] [headset]');
const { createServer } = await import('vite');
const playwright = await import('playwright');
const server = await createServer({ root, logLevel: 'error', server: { port: 5198, strictPort: false, host: '127.0.0.1' } });
await server.listen();
const browser = await playwright.chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
try {
  const page = await browser.newPage({ viewport: { width: 640, height: 480 } });
  page.setDefaultTimeout(180000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`${server.resolvedUrls.local[0]}?ui=0&static=1&model=waechter&helmet=critic&helmetVariant=${variant}&headset=${headset}&colors=original&wear=off`);
  await page.waitForFunction(() => window.renderFrame && window.scene);
  const b64 = await page.evaluate(async () => {
    let helmet = null;
    window.scene.traverse(o => { if (o.userData.robotHelmet === 'critic') helmet = o.children[0]; });
    if (!helmet) throw new Error('no Critic helmet on the robot');
    const glb = await new window.GLTFExporter().parseAsync(helmet, { binary: true });
    let s = '';
    const u = new Uint8Array(glb);
    for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000));
    return btoa(s);
  });
  if (errors.length) throw new Error(errors.join('\n'));
  mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  writeFileSync(out, Buffer.from(b64, 'base64'));
  console.log(`[helmet_snapshot] variant ${variant}, headset ${headset} → ${out}`);
} finally {
  await browser.close();
  await server.close();
}
