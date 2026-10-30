// Headless check: starts Vite, renders the four reference views and writes
//   renders/render_<view>.png   – shaded render
//   renders/overlay_<view>.png  – render with the reference frame in difference blend
//   renders/mask_<view>.png     – white silhouette on black (input for tools/iou.py)
// then runs tools/iou.py (silhouette IoU per view, if Python with Pillow and NumPy is available).
// verification.json identifies this run's status, completed views and optional IoU.
// Older files may remain after a failure or --no-iou; they are not evidence for the current run.
// Usage: node verify_renders.mjs [--no-iou] [--finish=original|metal|graphite]
//   [--headset=on|off] [--exploded=0..1] (exploded requires --no-iou) [--colors=original|body|helmet] (default original: the
//   delivered materials; a colour scheme requires --no-iou)
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
const options = { finish: 'original', accents: 'original', strips: 'on', headset: 'on', exploded: '0', colors: 'original', out: 'renders', noIou: false };
const seen = new Set();
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  const match = /^(--finish|--accents|--strips|--headset|--exploded|--colors|--out)(?:=(.*))?$/.exec(args[i]);
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
if (!['original', 'body', 'helmet'].includes(options.colors)) throw new Error(`Unknown colors ${JSON.stringify(options.colors)}`);
const referenceCompatible = assembly.exploded === 0 && options.colors === 'original';
if (!referenceCompatible && !options.noIou) throw new Error('Exploded views and colour schemes require --no-iou');
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
  await page.goto(`${url}?ui=0&static=1&colors=${options.colors}&finish=${encodeURIComponent(finish.name)}&accents=${encodeURIComponent(accents.name)}&strips=${strips}&headset=${assembly.headset}&exploded=${assembly.exploded}`);
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
  // Skins (0.13): the mixer compiles in Chromium on a robot with Helm H, every mesh finds its atlas entry, and the texture bake
  // fills the atlas (share of covered texels, mean colour per output).
  const skinPage = await browser.newPage({ viewport: { width: 640, height: 640 }, acceptDownloads: true });
  skinPage.setDefaultTimeout(180000);
  skinPage.on('pageerror', e => errors.push(`skin: ${e.message}`));
  skinPage.on('console', m => { if (m.type() === 'error' || /without atlas entry/.test(m.text())) errors.push(`skin: ${m.text()}`); });
  await skinPage.goto(`${url}?ui=0&static=1&model=waechter&helmet=critic&skin=rost`);
  await skinPage.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
  await skinPage.screenshot({ path: path.join(out, 'skin_waechter_rost.png') });
  result.skins = await skinPage.evaluate(() => window.activeSkinStates().map(st => {
    const t = window.bakeSkinTextures(window.renderer, st, 512), px = t.basecolor.data;
    let lit = 0; const mean = [0, 0, 0];
    for (let i = 0; i < px.length; i += 4) { if (px[i] + px[i + 1] + px[i + 2] > 0) lit++; for (let c = 0; c < 3; c++) mean[c] += px[i + c] / (px.length / 4); }
    return { model: st.atlas.model, skin: st.active, meshes: st.meshes.length, mapped: st.mapped, filled: lit / (px.length / 4), meanBasecolor: mean.map(Math.round) };
  }));
  // GLB export with a skin: every material is a baked skin texture set (or a flat stand-in), none is the live shader
  result.skinGlb = await skinPage.evaluate(async () => {
    const mod = await import('/src/robotSkins.js');
    const states = window.activeSkinStates(), restore = states.map(st => mod.useBakedMaterial(st, window.bakeSkinTextures(window.renderer, st, 256)));
    let robot = null;
    window.scene.traverse(o => { if (!robot && /^robot_/.test(o.name)) robot = o; });
    const glb = await new window.GLTFExporter().parseAsync(robot, { binary: true }).finally(() => restore.forEach(r => r()));
    const json = JSON.parse(new TextDecoder().decode(new Uint8Array(glb, 20, new DataView(glb).getUint32(12, true))));
    return { materials: json.materials.map(m => m.name), images: json.images?.length ?? 0,
      skinAttributes: json.meshes.flatMap(m => m.primitives.flatMap(p => Object.keys(p.attributes))).filter(a => /SKIN/i.test(a)).length };
  });
  const live = result.skinGlb.materials.filter(n => /^skin_[a-z]+$/.test(n));
  if (live.length || result.skinGlb.images < 6 || result.skinGlb.skinAttributes) throw new Error(`skin GLB: live materials ${live}, ${result.skinGlb.images} images`);
  // the real export, twice at once, with a skin change while it runs: both downloads arrive, the new skin stays on the model
  const downloads = [];
  skinPage.on('download', d => downloads.push(d));
  result.skinExportRace = await skinPage.evaluate(async () => {
    const runs = [window.exportGLB(), window.exportGLB()];
    // wait until the first export has put its baked materials on (GLTFExporter is still running), then change the skin
    const baked = () => window.activeSkinStates().some(st => st.meshes.some(m => /_(waechter|critic)$/.test(m.mesh.material.name)));
    for (let t = 0; !baked(); t++) { if (t > 2000) throw new Error('export never swapped materials'); await new Promise(r => setTimeout(r, 0)); }
    window.robotLook.skin = 'glut';
    window.rebuild();
    await Promise.all(runs);
    const names = new Set(window.activeSkinStates().flatMap(st => st.meshes.map(m => m.mesh.material.name)));
    window.robotLook.skin = 'rost';
    window.rebuild();
    return [...names];
  });
  for (let t = 0; downloads.length < 2 && t < 100; t++) await new Promise(r => setTimeout(r, 100));
  if (downloads.length !== 2 || result.skinExportRace.join() !== 'skin_glut') throw new Error(`skin export race: ${downloads.length} downloads, materials ${result.skinExportRace}`);
  // texture export: names and images are fixed before the first PNG is encoded, a skin change meanwhile does not mix them
  result.skinTextureExport = await skinPage.evaluate(async () => {
    const run = window.exportSkinTextures();
    window.robotLook.skin = 'glut';
    window.rebuild();
    const names = await run;
    window.robotLook.skin = 'rost';
    window.rebuild();
    return names;
  });
  if (result.skinTextureExport.length !== 6 || !result.skinTextureExport.every(n => n.includes('_rost_'))) throw new Error(`skin texture export: ${result.skinTextureExport}`);
  await skinPage.close();
  // A skin chosen in the navigation loads its atlases first; a rebuild while they load (e.g. the explosion slider) keeps the old paint.
  const navPage = await browser.newPage({ viewport: { width: 1100, height: 800 } });
  navPage.setDefaultTimeout(180000);
  navPage.on('pageerror', e => errors.push(`skin nav: ${e.message}`));
  await navPage.route('**/assets/skins/**', async route => { await new Promise(r => setTimeout(r, 1500)); await route.continue(); });
  await navPage.goto(`${url}?static=1&model=paladin&helmet=scout`);
  await navPage.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
  await navPage.click('button[title^="Skin Glut"]');
  await navPage.evaluate(() => { window.rebuild(); window.renderFrame(); });
  await navPage.waitForFunction(() => location.search.includes('skin=glut'), null, { timeout: 60000 });
  result.skinNavigation = await navPage.evaluate(() => window.activeSkinStates().map(st => `${st.atlas.model}:${st.active}:${st.mapped}/${st.meshes.length}`));
  if (result.skinNavigation.length !== 2) throw new Error(`skin nav: ${result.skinNavigation}`);
  await navPage.close();
  // Generated bodies (&gen=three, 0.15): every mesh of each body finds an entry in its own atlas (<body>-three).
  result.skinsGenerated = [];
  for (const body of ['waechter', 'paladin', 'mechanik']) {
    const page = await browser.newPage({ viewport: { width: 480, height: 480 } });
    page.setDefaultTimeout(180000);
    page.on('pageerror', e => errors.push(`skin gen=three ${body}: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error' || /without atlas entry/.test(m.text())) errors.push(`skin gen=three ${body}: ${m.text()}`); });
    await page.goto(`${url}?ui=0&static=1&model=${body}&gen=three&helmet=critic&skin=rost`);
    await page.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
    result.skinsGenerated.push(...await page.evaluate(() => window.activeSkinStates().map(st => ({ model: st.atlas.model, meshes: st.meshes.length, mapped: st.mapped, transferred: st.transferred }))));
    await page.close();
  }
  for (const s of result.skinsGenerated) {
    console.log(`skin rost on ${s.model} (gen=three): ${s.mapped}/${s.meshes} meshes mapped${s.transferred ? `, ${s.transferred} transferred` : ''}`);
    if (s.mapped !== s.meshes) throw new Error(`skin on ${s.model} (gen=three): ${s.mapped}/${s.meshes} mapped`);
  }
  if (result.skinsGenerated.filter(s => s.model.endsWith('-three')).length !== 3) throw new Error(`skin gen=three: ${JSON.stringify(result.skinsGenerated)}`);
  console.log(`skin GLB: ${result.skinGlb.materials.join(', ')}; navigation: ${result.skinNavigation.join(', ')}`);
  for (const s of result.skins) {
    console.log(`skin ${s.skin} on ${s.model}: ${s.mapped}/${s.meshes} meshes mapped, bake fills ${(s.filled * 100).toFixed(1)} %`);
    if (s.mapped !== s.meshes || s.filled < 0.9) throw new Error(`skin ${s.skin} on ${s.model}: ${s.mapped}/${s.meshes} mapped, ${s.filled} filled`);
  }
  result.outputs['skin_waechter_rost.png'] = sha256(readFileSync(path.join(out, 'skin_waechter_rost.png')));
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
