// Export of the three.js generator (0.18 "Prefab"): builds the bodies (robotgen/index.js › buildRobotBody) and Scout
// (robotgen/scout.js › buildScout) once and writes delivery packages in the format of the Blender ones, so the viewer only loads files:
//   assets/robot-bodies-three/<body>/assembled/<body>.glb, parts.json, manifest.json   (explosion via the segment roots, as before)
//   assets/helmet-scout-three/assembled/scout.glb, exploded/scout_exploded.glb, parts.json, manifest.json
//   node tools/robotgen_export.mjs [--model waechter|paladin|mechanik|scout|all] [--check]
// --check writes nothing and fails if a delivered file differs from a fresh export. The manifest names the generator inputs (sha256
// over web/src/robotgen and this file, versions of three and the CSG libraries) and the platform: CSG can triangulate differently on
// another platform, so byte equality is only expected there (tools/robotgen_export.test.mjs). Deterministic: same inputs, same bytes.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const BODIES = ['waechter', 'paladin', 'mechanik'];
export const MODELS = [...BODIES, 'scout'];
const here = path.dirname(fileURLToPath(import.meta.url)), webRoot = path.dirname(here), repo = path.dirname(webRoot);
export const PLATFORM = `${process.platform}-${process.arch} node ${process.versions.node.split(".")[0]}`;

// Package folder and files of a model, relative to the repository.
export function packageFiles(name) {
  const dir = name === 'scout' ? 'assets/helmet-scout-three' : `assets/robot-bodies-three/${name}`;
  const glbs = name === 'scout' ? { assembled: `${dir}/assembled/scout.glb`, exploded: `${dir}/exploded/scout_exploded.glb` } : { assembled: `${dir}/assembled/${name}.glb` };
  return { dir, glbs, parts: `${dir}/parts.json`, manifest: `${dir}/manifest.json` };
}

// Generator inputs: every file below web/src/robotgen (code, tables, the Scout cast and parameters) and this exporter, plus the
// versions of the libraries that shape the geometry. A change here means: export again.
export function generatorSources() {
  const files = [];
  const walk = dir => {
    for (const f of readdirSync(dir).sort()) {
      const p = path.join(dir, f);
      if (statSync(p).isDirectory()) walk(p); else files.push(p);
    }
  };
  walk(path.join(webRoot, 'src', 'robotgen'));
  files.push(fileURLToPath(import.meta.url));
  const h = createHash('sha256');
  for (const f of files) h.update(path.relative(repo, f)).update('\0').update(readFileSync(f)).update('\0');
  const libs = Object.fromEntries(['three', 'three-bvh-csg', 'three-mesh-bvh'].map(n =>
    [n, JSON.parse(readFileSync(path.join(webRoot, 'node_modules', n, 'package.json'), 'utf8')).version]));
  h.update(JSON.stringify(libs));
  return { files: files.length, sha256: h.digest('hex'), libraries: libs };
}

// GLTFExporter reads its blobs with FileReader, which Node does not have.
globalThis.FileReader ??= class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(r => { this.result = r; this.onloadend?.(); }); }
};

// Scene → GLB bytes. The roots go into a THREE.Scene so the GLB's top nodes are the roots themselves (segment nodes, Scout meshes)
// and the group's name and userData become the glTF scene's name and extras; meshes keep their userData as extras.
export async function toGLB(group) {
  const scene = new THREE.Scene();
  scene.name = group.name;
  scene.userData = group.userData;
  scene.children = group.children;                 // shared, not re-parented: the built group stays as it is
  const out = await new GLTFExporter().parseAsync(scene, { binary: true, onlyVisible: false });
  return Buffer.from(out);
}

export async function parseGLB(bytes) {
  const buf = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  return (await new GLTFLoader().parseAsync(buf, '')).scene;
}

// Geometry digest of one mesh: index, positions and normals as stored (sha256, first 16 hex digits).
export function meshDigest(geometry) {
  const h = createHash('sha256'), bytes = a => Buffer.from(a.buffer, a.byteOffset, a.byteLength);
  if (geometry.index) h.update(bytes(Uint32Array.from(geometry.index.array)));
  h.update(bytes(geometry.attributes.position.array)).update(bytes(geometry.attributes.normal.array));
  return h.digest('hex').slice(0, 16);
}

// Box of a mesh in Blender world axes (Z up, front −Y), as the Blender manifests store it: glTF (x, y, z) → (x, −z, y).
function blenderBox(mesh) {
  const b = new THREE.Box3().setFromObject(mesh, true);
  const r = v => Math.round(v * 1e4) / 1e4;
  return [[b.min.x, -b.max.z, b.min.y].map(r), [b.max.x, -b.min.z, b.max.y].map(r)];
}
const tris = g => (g.index ? g.index.count : g.attributes.position.count) / 3;
const sizeMm = bb => [0, 1, 2].map(i => Math.round((bb[1][i] - bb[0][i]) * 1000));
const union = boxes => [[0, 1, 2].map(i => Math.min(...boxes.map(b => b[0][i]))), [0, 1, 2].map(i => Math.max(...boxes.map(b => b[1][i])))];

// Manifest rows from the loaded GLB (what the viewer sees), so verts/tris/digest describe the delivered file.
function rows(root, fields) {
  const out = [];
  root.updateMatrixWorld(true);
  root.traverse(o => { if (o.isMesh) out.push({ name: o.name, ...fields(o), verts: o.geometry.attributes.position.count, tris: tris(o.geometry), bbox: blenderBox(o), digest: meshDigest(o.geometry) }); });
  return out.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}

const json = v => JSON.stringify(v, null, 1) + '\n';

// Build one model and return its package as { path: bytes } plus the built scene (for tests).
export async function exportModel(name, sources = generatorSources()) {
  const files = packageFiles(name), out = {};
  const generator = { tool: 'web/tools/robotgen_export.mjs', source: 'web/src/robotgen', inputs: sources, platform: PLATFORM };
  if (BODIES.includes(name)) {
    const { buildRobotBody } = await import('../src/robotgen/index.js');
    const { scene, spec, parts } = buildRobotBody(name);
    const glb = await toGLB(scene);
    const objects = rows(await parseGLB(glb), o => ({ asm: o.userData.asm, part: o.userData.part, part_de: o.userData.part_de, side: o.userData.side }));
    const assemblies = Object.fromEntries(parts.assemblies.map(a => {
      const objs = objects.filter(o => o.asm === a.id);
      return [a.id, { objects: objs.length, parts: new Set(objs.map(o => o.part)).size, triangles: objs.reduce((s, o) => s + o.tris, 0), size_mm: sizeMm(union(objs.map(o => o.bbox))) }];
    }));
    const [w, d, h] = sizeMm(union(objects.map(o => o.bbox)));
    out[files.glbs.assembled] = glb;
    out[files.parts] = Buffer.from(json(parts));
    out[files.manifest] = Buffer.from(json({ study: spec.study, name, generator, pose: 'idle', materials: 'color',
      measured: { height_mm: h, width_mm: w, depth_mm: d, assemblies },
      totals: { objects: objects.length, verts: objects.reduce((s, o) => s + o.verts, 0), tris: objects.reduce((s, o) => s + o.tris, 0) }, objects }));
    return { files: out, scene };
  }
  if (name !== 'scout') throw new Error(`robotgen_export: unknown model ${name} (${MODELS.join(', ')}, all)`);
  const { buildScout, explodedScout } = await import('../src/robotgen/scout.js');
  const { readGussFile } = await import('./scoutGussNode.mjs');
  const warn = console.warn;
  console.warn = () => {};                         // BSP progress notes of the lower helmet
  let built;
  try { built = buildScout(await readGussFile()); } finally { console.warn = warn; }
  const { scene, groups } = built;
  const glb = await toGLB(scene), exploded = await toGLB(explodedScout(scene, groups));
  const objects = rows(await parseGLB(glb), o => ({ part: o.userData.part_label }));
  out[files.glbs.assembled] = glb;
  out[files.glbs.exploded] = exploded;
  out[files.parts] = Buffer.from(json({ units: 'Blender units, helmet height H = 1.0 (≈ 30 cm); glTF Y up, front = +Z',
    side_rule: 'R = +X in helmet space (right in the front view); object names are not reliable for the side',
    parts: groups.map(g => ({ id: g.id, label: g.label, side: g.side, objects: g.objects, exploded_offset: g.offset })) }));
  out[files.manifest] = Buffer.from(json({ name: 'scout', generator, objects, count: objects.length, verts: objects.reduce((s, o) => s + o.verts, 0),
    tris: objects.reduce((s, o) => s + o.tris, 0) }));
  return { files: out, scene };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2), check = a.includes('--check'), mi = a.indexOf('--model'), model = mi >= 0 ? a[mi + 1] : 'all';
  if (model !== 'all' && !MODELS.includes(model)) throw new Error(`robotgen_export: unknown model ${model} (${MODELS.join(', ')}, all)`);
  const sources = generatorSources(), warn = console.warn;
  // known notes: three-bvh-csg's BVH option, and GLTFExporter normalising the few shading normals that are not of unit length
  console.warn = (...m) => { if (!/maxLeafSize|normalized normal attribute/.test(String(m[0]))) warn(...m); };
  let stale = 0;
  for (const name of model === 'all' ? MODELS : [model]) {
    const t0 = performance.now(), { files } = await exportModel(name, sources);
    for (const [rel, bytes] of Object.entries(files)) {
      const file = path.join(repo, rel);
      let old = null;
      try { old = readFileSync(file); } catch { /* new file */ }
      const same = old && old.equals(bytes);
      if (check) { if (!same) { stale++; console.log(`differs: ${rel}`); } continue; }
      if (!same) { mkdirSync(path.dirname(file), { recursive: true }); writeFileSync(file, bytes); }
      console.log(`${same ? 'unchanged' : 'written  '} ${rel} (${(bytes.length / 1e6).toFixed(2)} MB)`);
    }
    console.log(`[robotgen_export] ${name}: ${((performance.now() - t0) / 1000).toFixed(1)} s`);
  }
  if (check && stale) { console.log(`${stale} file(s) differ from the generator: node tools/robotgen_export.mjs`); process.exit(1); }
}
