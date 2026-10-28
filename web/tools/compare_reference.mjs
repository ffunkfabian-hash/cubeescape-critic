// Reproduce the supplementary Meshy comparison without modifying the generator.
// Usage: node tools/compare_reference.mjs /absolute/path/to/reference.glb [output-directory]
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256, sourceManifest } from './provenance.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.resolve(process.argv[3] || path.join(root, 'renders/reference'));
mkdirSync(out, { recursive: true });
const result = { status: 'running', startedAt: new Date().toISOString(), outputs: {}, runtime: { node: process.version, platform: process.platform, arch: process.arch } };
const record = () => writeFileSync(path.join(out, 'comparison.json'), JSON.stringify(result, null, 2) + '\n');
record();
let server, browser;
try {
  if (!process.argv[2]) throw new Error('Provide the Meshy GLB path; the video remains authoritative.');
  const bytes = readFileSync(path.resolve(process.argv[2]));
  const config = JSON.parse(readFileSync(path.join(root, 'refs/meshy-reference.json'), 'utf8'));
  if (sha256(bytes) !== config.sha256) throw new Error('Reference hash does not match the approved supplementary file');
  result.sources = sourceManifest(root);
  result.reference = config;
  const { createServer } = await import('vite');
  const { chromium } = await import('playwright');
  server = await createServer({ root, logLevel: 'error', server: { host: '127.0.0.1', port: 5199 },
  plugins: [{ name: 'local-reference', configureServer(server) {
    server.middlewares.use('/__reference.glb', (_req, res) => { res.setHeader('Content-Type', 'model/gltf-binary'); res.end(bytes); });
  } }] });
  await server.listen();
  browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  result.runtime.browser = browser.version();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.setDefaultTimeout(180000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(server.resolvedUrls.local[0] + '?ui=0&static=1');
  await page.waitForFunction(() => window.__ready === true);
  await page.evaluate(async config => {
    const { GLTFLoader } = await import('/node_modules/three/examples/jsm/loaders/GLTFLoader.js');
    const reference = (await new GLTFLoader().loadAsync('/__reference.glb')).scene;
    reference.name = 'SupplementaryReference';
    reference.scale.setScalar(config.scale);
    reference.position.fromArray(config.translation);
    reference.rotation.set(...config.rotation);
    reference.visible = false;
    window.scene.add(reference);
  }, config);
  for (const style of ['ours', 'textured', 'clay']) {
    await page.evaluate(style => {
      const reference = window.scene.getObjectByName('SupplementaryReference');
      window.scene.getObjectByName('SciFiHelmet').visible = style === 'ours';
      reference.visible = style !== 'ours';
      if (style === 'clay') {
        const material = new window.THREE.MeshStandardMaterial({ color: 0x909090, roughness: 0.7 });
        reference.traverse(o => { if (o.isMesh) o.material = material; });
      }
    }, style);
    for (const view of ['front', 'left', 'back', 'right']) {
      await page.evaluate(view => { window.setCameraView(view); window.renderFrame(); }, view);
      const name = `${style}-${view}.png`;
      await page.screenshot({ path: path.join(out, name) });
      result.outputs[name] = sha256(readFileSync(path.join(out, name)));
      console.log(`${style}: ${view}`);
    }
  }
  if (errors.length) throw new Error(errors.join('\n'));
  if (sourceManifest(root).digest !== result.sources.digest) throw new Error('Sources changed during comparison');
  result.status = 'passed';
} catch (error) {
  result.status = 'failed'; result.error = error.message; process.exitCode = 1;
} finally {
  result.finishedAt = new Date().toISOString(); record();
  await browser?.close(); await server?.close();
}
