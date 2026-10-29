// Headless check: starts Vite, renders the four reference views and writes
//   renders/render_<view>.png   – shaded render
//   renders/overlay_<view>.png  – render with the reference frame in difference blend
//   renders/mask_<view>.png     – white silhouette on black (input for tools/iou.py)
// then runs tools/iou.py (silhouette IoU per view, if Python with Pillow and NumPy is available).
// verification.json identifies this run's status, completed views and optional IoU.
// Older files may remain after a failure or --no-iou; they are not evidence for the current run.
// Usage: node verify_renders.mjs [--no-iou] [--finish=original|metal|graphite]
//   [--headset=on|off] [--body=none|shoulders|legacy] [--exploded=0..1] (body/exploded require --no-iou)
//   [--accents=original|light-fasteners|white-strips|contrast-strips] [--strips=on|off] [--out=renders]
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { inspectGLB, subprocessExitCode } from './tools/verification.mjs';
import { sha256, sourceManifest } from './tools/provenance.mjs';
import { resolveFinish, resolveAccents } from './src/finishPresets.js';
import { resolveAssemblyOptions } from './src/assemblyOptions.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const options = { finish: 'original', accents: 'original', strips: 'on', headset: 'on', body: 'none', exploded: '0', out: 'renders', noIou: false };
const seen = new Set();
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  const match = /^(--finish|--accents|--strips|--headset|--body|--exploded|--out)(?:=(.*))?$/.exec(args[i]);
  const key = args[i] === '--no-iou' ? 'noIou' : match?.[1].slice(2);
  if (!key) throw new Error(`Unknown argument: ${args[i]}`);
  if (seen.has(key)) throw new Error(`Duplicate argument: ${args[i]}`);
  seen.add(key);
  const value = key === 'noIou' ? true : match[2] ?? args[++i];
  if (value === undefined || value === '' || typeof value === 'string' && value.startsWith('--')) {
    throw new Error(`Missing value for --${key}`);
  }
  options[key] = value;
}
const finish = resolveFinish(options.finish);
const accents = resolveAccents(options.accents);
const strips = options.strips;
if (!['on', 'off'].includes(strips)) throw new Error(`Unknown strips ${JSON.stringify(strips)}; expected on or off`);
const assembly = resolveAssemblyOptions(options);
const referenceCompatible = assembly.body === 'none' && assembly.exploded === 0;
if (!referenceCompatible && !options.noIou) throw new Error('Body and exploded views require --no-iou');
const out = path.resolve(root, options.out);
mkdirSync(out, { recursive: true });
const VIEWS = assembly.exploded > 0 ? ['assembly', 'front', 'left', 'back', 'right'] : ['front', 'left', 'back', 'right'];
const result = { startedAt: new Date().toISOString(), status: 'running', views: [],
  finish, accents, strips, assembly, referenceCompatible, outputDirectory: out, iouSkipped: options.noIou, cameras: {}, outputs: {} };
const record = () => writeFileSync(path.join(out, 'verification.json'), JSON.stringify(result, null, 2) + '\n');
record();

let server, browser;
const errors = [];

try {
  result.sources = sourceManifest(root);
  result.runtime = { node: process.version, platform: process.platform, arch: process.arch,
    python: spawnSync('python3', ['--version'], { encoding: 'utf8' }).stdout?.trim(),
    pythonPackages: spawnSync('python3', ['-c', 'import numpy,PIL;print("numpy="+numpy.__version__+", Pillow="+PIL.__version__)'], { encoding: 'utf8' }).stdout?.trim(),
    packages: Object.fromEntries(['three', 'three-bvh-csg', 'three-mesh-bvh', 'vite', 'playwright'].map(name =>
      [name, JSON.parse(readFileSync(path.join(root, 'node_modules', name, 'package.json'), 'utf8')).version])) };
  const { createServer } = await import('vite');
  const playwright = await import('playwright');
  server = await createServer({ root, logLevel: 'error', server: { port: 5199, strictPort: false, host: '127.0.0.1' } });
  await server.listen();
  const url = server.resolvedUrls.local[0];
  browser = await playwright.chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  });
  result.runtime.browser = browser.version();
  result.runtime.graphics = 'ANGLE SwiftShader';
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, acceptDownloads: true });
  page.setDefaultTimeout(120000);
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`${m.text()} (${m.location().url || 'unknown source'})`);
    else if (m.text().startsWith('model built')) console.log(m.text());
  });
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`);
  });
  await page.goto(`${url}?ui=0&static=1&finish=${encodeURIComponent(finish.name)}&accents=${encodeURIComponent(accents.name)}&strips=${strips}&headset=${assembly.headset}&body=${assembly.body}&exploded=${assembly.exploded}`);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
  result.parameters = await page.evaluate(() => window.helmetParams);
  result.finish = await page.evaluate(() => window.materialFinish);
  if (JSON.stringify(result.finish) !== JSON.stringify(finish)) throw new Error('Rendered finish does not match requested preset');
  result.accents = await page.evaluate(() => window.materialAccents);
  if (JSON.stringify(result.accents) !== JSON.stringify(accents)) throw new Error('Rendered accents do not match requested preset');
  result.strips = await page.evaluate(() => window.helmetParams.foreheadPlates.enabled !== false ? 'on' : 'off');
  if (result.strips !== strips) throw new Error('Rendered strips do not match requested state');
  result.assembly = await page.evaluate(() => window.presentationOptions);
  if (JSON.stringify(result.assembly) !== JSON.stringify(assembly)) throw new Error('Rendered assembly does not match requested options');
  result.assemblyParts = await page.evaluate(() => window.assemblyParts);
  if (assembly.body === 'shoulders') result.bodyParameters = await page.evaluate(() => window.shoulderStudyParams);
  result.renderSettings = await page.evaluate(() => window.renderSettings);
  const settle = () => page.evaluate(() => { const t = performance.now(); window.renderFrame(); return performance.now() - t; });
  for (const v of VIEWS) {
    await page.evaluate((v) => window.setCameraView(v), v);
    result.cameras[v] = await page.evaluate(() => ({ position: window.camera.position.toArray(),
      quaternion: window.camera.quaternion.toArray(), fov: window.camera.fov,
      target: window.controls.target.toArray(), viewport: [innerWidth, innerHeight] }));
    console.log(`${v}: frame ${(await settle()).toFixed(0)} ms`);
    await page.screenshot({ path: path.join(out, `render_${v}.png`) });
    if (referenceCompatible) {
    await page.evaluate(() => window.toggleOverlay(true, 'difference'));
    await page.evaluate(async () => {
      const overlay = document.getElementById('overlay');
      await overlay.decode();
      if (overlay.naturalWidth !== 1280 || overlay.naturalHeight !== 720) throw new Error('Unexpected reference dimensions');
    });
    await settle();
    await page.screenshot({ path: path.join(out, `overlay_${v}.png`) });
    }
    await page.evaluate(() => { window.toggleOverlay(false); window.setMaskMode(true); });
    await settle();
    await page.screenshot({ path: path.join(out, `mask_${v}.png`) });
    await page.evaluate(() => window.setMaskMode(false));
    result.views.push(v);
  }
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 180000 }),
    page.evaluate(() => window.exportGLB()),
  ]);
  const glbPath = path.join(out, 'scifi_helmet.glb');
  await download.saveAs(glbPath);
  const failure = await download.failure();
  if (failure) throw new Error(`GLB download failed: ${failure}`);
  result.glb = inspectGLB(readFileSync(glbPath));
  if (assembly.exploded > 0) {
    result.glbRoundtrip = await page.evaluate(async encoded => {
      const { GLTFLoader } = await import('/node_modules/three/examples/jsm/loaders/GLTFLoader.js');
      const bytes = Uint8Array.from(atob(encoded), character => character.charCodeAt(0));
      const imported = (await new GLTFLoader().parseAsync(bytes.buffer, '')).scene;
      const source = window.scene.getObjectByName('SciFiHelmet'); source.updateMatrixWorld(true); imported.updateMatrixWorld(true);
      const expected = new Map(); source.traverse(o => { if (o.isMesh) expected.set(o.userData.sourcePath, o); });
      let count = 0, maximumTransformError = 0;
      imported.traverse(mesh => {
        if (!mesh.isMesh) return;
        const original = expected.get(mesh.userData.sourcePath);
        if (!original || mesh.userData.partId !== original.userData.partId) throw new Error('GLB lost assembly part metadata');
        const a = mesh.geometry.attributes.position.array, b = original.geometry.attributes.position.array;
        if (a.length !== b.length || a.some((value,i) => value !== b[i])) throw new Error(`GLB changed geometry of ${mesh.name}`);
        mesh.matrixWorld.elements.forEach((value,i) => { maximumTransformError = Math.max(maximumTransformError, Math.abs(value-original.matrixWorld.elements[i])); });
        expected.delete(mesh.userData.sourcePath); count++;
      });
      if (expected.size || maximumTransformError > 1e-6) throw new Error('GLB lost meshes or changed explosion transforms');
      imported.traverse(object => { object.geometry?.dispose(); if (object.material) for (const material of [].concat(object.material)) material.dispose(); });
      return { meshes:count, positionsIdentical:true, maximumTransformError, metadataPreserved:true };
    }, readFileSync(glbPath).toString('base64'));
  }
  // Preserve the actual procedural source maps as PNGs as well. Core glTF
  // exports colour/roughness maps, but does not represent Three.js bumpMap.
  const textureBundle = await page.evaluate(() => {
    const root = window.scene.getObjectByName('SciFiHelmet');
    if (!root) throw new Error('Missing helmet for texture export');
    const materials = {}, files = {}, parts = [];
    root.traverse(object => {
      if (!object.isMesh) return;
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        parts.push({ part: object.name, material: material.name });
        if (materials[material.name]) continue;
        const entry = { color: material.color.getHexString(), roughness: material.roughness,
          alphaTest: material.alphaTest, transparent: material.transparent,
          metalness: material.metalness, envMapIntensity: material.envMapIntensity,
          specularIntensity: material.specularIntensity, normalScale: material.normalScale?.toArray(),
          bumpScale: material.bumpScale, maps: {} };
        for (const kind of ['map','roughnessMap','bumpMap','normalMap','metalnessMap','emissiveMap']) {
          const texture = material[kind];
          if (!texture) continue;
          if (typeof texture.image?.toDataURL !== 'function') throw new Error(`Unsupported texture image: ${material.name}.${kind}`);
          const file = `${material.name}_${kind}.png`;
          files[file] = texture.image.toDataURL('image/png').split(',')[1];
          entry.maps[kind] = { file, repeat: texture.repeat.toArray(), offset: texture.offset.toArray(),
            rotation: texture.rotation, wrapS: texture.wrapS, wrapT: texture.wrapT,
            flipY: texture.flipY, colorSpace: texture.colorSpace };
        }
        materials[material.name] = entry;
      }
    });
    return { materials, files, parts };
  });
  const textureDir = path.join(out, 'textures');
  mkdirSync(textureDir, { recursive: true });
  for (const [name, base64] of Object.entries(textureBundle.files)) {
    const bytes = Buffer.from(base64, 'base64');
    writeFileSync(path.join(textureDir, name), bytes);
    result.outputs[`textures/${name}`] = sha256(bytes);
  }
  const textureManifest = JSON.stringify({ finish: result.finish, accents: result.accents, strips: result.strips, assembly: result.assembly,
    materials: textureBundle.materials, parts: textureBundle.parts }, null, 2) + '\n';
  writeFileSync(path.join(textureDir, 'materials.json'), textureManifest);
  result.outputs['textures/materials.json'] = sha256(textureManifest);
  result.textures = { maps: Object.keys(textureBundle.files).length, manifest: 'textures/materials.json' };
  const assemblyFile = JSON.stringify({ options: result.assembly, parts: result.assemblyParts }, null, 2) + '\n';
  writeFileSync(path.join(out, 'assembly.json'), assemblyFile);
  result.outputs['assembly.json'] = sha256(assemblyFile);
  result.outputs['scifi_helmet.glb'] = sha256(readFileSync(glbPath));
  for (const view of VIEWS) for (const kind of (referenceCompatible ? ['render', 'mask', 'overlay'] : ['render', 'mask'])) {
    const name = `${kind}_${view}.png`;
    result.outputs[name] = sha256(readFileSync(path.join(out, name)));
  }
  console.log(`GLB: ${result.glb.meshes} meshes, ${result.glb.materials} materials, ${result.glb.bytes} bytes`);
  if (errors.length) throw new Error('Browser-Fehler:\n' + errors.join('\n'));
  if (!options.noIou) {
    const r = spawnSync('python3', ['-I', path.join(root, 'tools', 'iou.py'), root, out], { stdio: 'inherit' });
    const code = subprocessExitCode(r);
    if (code) {
      process.exitCode = code;
      throw new Error(`IoU check failed: ${r.error?.message || r.signal || `exit ${code}`}`);
    }
    result.iou = JSON.parse(readFileSync(path.join(out, 'iou.json'), 'utf8'));
    for (const name of ['iou.json', 'compare.png']) result.outputs[name] = sha256(readFileSync(path.join(out, name)));
  }
  if (sourceManifest(root).digest !== result.sources.digest) throw new Error('Source files changed during verification');
  result.status = 'passed';
} catch (error) {
  result.status = 'failed';
  result.error = error.message;
  process.exitCode ||= 1;
  console.error(error);
} finally {
  result.finishedAt = new Date().toISOString();
  record();
  await browser?.close();
  await server?.close();
}
