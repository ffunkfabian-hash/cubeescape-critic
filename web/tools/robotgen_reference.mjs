// How far the three.js generator has moved from its origins (0.19 "Whetstone") – a report, no longer a test: until 0.18,
// robotgen.test.mjs and scoutgen.test.mjs required equality with the frozen Blender export (assets/robot-bodies/<body>/,
// assets/helmet-scout/) and with the Python dump of the pinned Ballon commit (tools/fixtures/robotgen_<body>_spec.json). Now the
// form tests check the generator against its own package (robotgen_form.test.mjs), and this report shows the distance per model:
// objects missing or added, extras that differ, the box deviation of every object (largest, mean, those beyond 1 mm), segment root
// matrices, role materials; for the bodies the part list against the Ballon dump, for Scout the n-gon counts of the cast parts.
// --iou also renders Blender GLB and export in the viewer and measures the silhouette IoU in four views (robotgen_compare.mjs).
// Usage: node tools/robotgen_reference.mjs [--model=waechter|paladin|mechanik|scout|all] [--iou] [--json=<file>]
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as THREE from 'three';
import { parseGLB, MODELS, BODIES } from './robotgen_export.mjs';

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), repo = path.dirname(webRoot);
const opt = { model: 'all', iou: false, json: null };
for (const a of process.argv.slice(2)) {
  const m = /^--(model|json)=(.+)$/.exec(a);
  if (m) opt[m[1]] = m[2];
  else if (a === '--iou') opt.iou = true;
  else throw new Error(`Unknown argument: ${a}`);
}
const models = opt.model === 'all' ? MODELS : [opt.model];
if (!models.every(m => MODELS.includes(m))) throw new Error(`robotgen_reference: unknown model ${opt.model} (${MODELS.join(', ')}, all)`);
const readJson = rel => JSON.parse(readFileSync(path.join(repo, rel), 'utf8'));
const r4 = v => Math.round(v * 1e4) / 1e4;

// Largest deviation of a mesh's box from a manifest box in Blender world axes (Z up, front −Y).
const boxDiff = (mesh, bbox) => {
  const b = new THREE.Box3().setFromObject(mesh, true);
  const [[x0, y0, z0], [x1, y1, z1]] = bbox;
  return Math.max(...[x0, z0, -y1, x1, z1, -y0].map((v, i) => Math.abs(v - [b.min.x, b.min.y, b.min.z, b.max.x, b.max.y, b.max.z][i])));
};

// Objects of the Blender manifest against the built meshes; boxes in mm (unit: metres for the bodies, H = 300 mm for Scout).
function objectsReport(manifest, meshes, mm, extras) {
  const names = manifest.objects.map(o => o.name), built = [...meshes.keys()];
  const missing = names.filter(n => !meshes.has(n)), added = built.filter(n => !names.includes(n)).sort();
  const boxes = [], extrasDiffer = [];
  for (const o of manifest.objects) {
    const m = meshes.get(o.name);
    if (!m) continue;
    boxes.push([o.name, boxDiff(m, o.bbox) * mm]);
    if (extras && JSON.stringify(extras(o)) !== JSON.stringify(extras(m.userData))) extrasDiffer.push(o.name);
  }
  boxes.sort((a, b) => b[1] - a[1]);
  const mean = boxes.reduce((s, b) => s + b[1], 0) / Math.max(1, boxes.length);
  return {
    objects: { reference: names.length, built: built.length, missing, added, extras_differ: extrasDiffer },
    box_mm: { largest: r4(boxes[0]?.[1] ?? 0), mean: r4(mean), beyond_1mm: boxes.filter(b => b[1] > 1).length, top: boxes.slice(0, 5).map(([n, d]) => [n, r4(d)]) },
  };
}

// Materials by name: property differences against the reference GLB.
function materialsReport(glb, meshes) {
  const ref = new Map();
  glb.traverse(o => { if (o.isMesh) ref.set(o.material.name, o.material); });
  const differ = new Set(), unknown = new Set();
  for (const m of meshes.values()) {
    const a = ref.get(m.material.name), b = m.material;
    if (!a) { unknown.add(b.name); continue; }
    const pa = [...a.color.toArray(), a.roughness, a.metalness, ...a.emissive.toArray(), a.emissiveIntensity];
    const pb = [...b.color.toArray(), b.roughness, b.metalness, ...b.emissive.toArray(), b.emissiveIntensity];
    if (pa.some((v, i) => Math.abs(v - pb[i]) > 1e-3)) differ.add(b.name);
  }
  return { differ: [...differ].sort(), not_in_reference: [...unknown].sort() };
}

// Parameters of the generator's part list that differ from the Python dump of the Ballon commit (relative 1e-6).
function specReport(name, spec) {
  const ref = JSON.parse(readFileSync(path.join(webRoot, 'tools', 'fixtures', `robotgen_${name}_spec.json`), 'utf8'));
  const same = (a, b) => {
    if (typeof a === 'number') return typeof b === 'number' && Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(a));
    if (Array.isArray(a)) return Array.isArray(b) && a.length === b.length && a.every((v, i) => same(v, b[i]));
    if (a && typeof a === 'object') return b && typeof b === 'object' && Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(k => same(a[k], b[k]));
    return a === b;
  };
  const key = ([a, p]) => `${a}:${p[0]}`, refParts = new Map(ref.parts.map(p => [key(p), p[1]])), ours = new Map(spec.parts.map(p => [key(p), p[1]]));
  return {
    segments_equal: same(ref.segments, spec.segments), shoulder_equal: same(ref.shoulder, spec.shoulder),
    parts_missing: [...refParts.keys()].filter(k => !ours.has(k)), parts_added: [...ours.keys()].filter(k => !refParts.has(k)),
    parts_changed: [...ours.keys()].filter(k => refParts.has(k) && !same(refParts.get(k), ours.get(k))),
  };
}

const quiet = fn => { const w = console.warn; console.warn = () => {}; try { return fn(); } finally { console.warn = w; } };
const report = {};
for (const name of models) {
  const t0 = performance.now();
  if (BODIES.includes(name)) {
    const { buildRobotBody } = await import('../src/robotgen/index.js');
    const dir = `assets/robot-bodies/${name}`, manifest = readJson(`${dir}/manifest.json`);
    const built = quiet(() => buildRobotBody(name));
    built.scene.updateMatrixWorld(true);
    const meshes = new Map();
    built.scene.traverse(o => { if (o.isMesh) meshes.set(o.name, o); });
    const glb = await parseGLB(readFileSync(path.join(repo, dir, 'assembled', `${name}.glb`)));
    let rootDiff = 0;
    const roots = glb.children.map(n => n.name), ours = built.scene.children.map(n => n.name);
    for (const n of glb.children) {
      const m = built.scene.getObjectByName(n.name);
      if (m) n.matrix.elements.forEach((v, i) => { rootDiff = Math.max(rootDiff, Math.abs(v - m.matrix.elements[i])); });
    }
    report[name] = {
      reference: dir,
      ...objectsReport(manifest, meshes, 1000, o => [o.asm, o.part, o.side, o.part_de]),
      roots: { missing: roots.filter(n => !ours.includes(n)), added: ours.filter(n => !roots.includes(n)), largest_matrix_difference: r4(rootDiff) },
      parts_json_equal: JSON.stringify(built.parts) === JSON.stringify(readJson(`${dir}/parts.json`)),
      materials: materialsReport(glb, meshes),
      ballon_spec: specReport(name, built.spec),
    };
  } else {
    const { buildScout } = await import('../src/robotgen/scout.js');
    const { readGussFile } = await import('./scoutGussNode.mjs');
    const { scoutParts } = await import('../src/robotgen/scout.js');
    const dir = 'assets/helmet-scout', manifest = readJson(`${dir}/manifest.json`), guss = await readGussFile();
    const parts = quiet(() => scoutParts(guss)), built = quiet(() => buildScout(null, { parts }));
    built.scene.updateMatrixWorld(true);
    const meshes = new Map(built.scene.children.map(o => [o.name, o]));
    const glb = await parseGLB(readFileSync(path.join(repo, dir, 'assembled', 'scout.glb')));
    const refGroups = readJson(`${dir}/parts.json`).parts.map(p => ({ id: p.id, label: p.label, side: p.side, objects: p.objects, exploded_offset: p.exploded_offset }));
    const groups = built.groups.map(g => ({ id: g.id, label: g.label, side: g.side, objects: g.objects, exploded_offset: g.offset }));
    // n-gon counts of the cast parts (the BSP parts are triangulated, so only the mouth tub among them)
    const { BSP_PARTS } = await import('../src/robotgen/scout.js');
    const topology = manifest.objects.filter(o => parts[o.name] && (!BSP_PARTS.includes(o.name) || o.name === 'Mund_Vertiefung'))
      .filter(o => parts[o.name].V.length !== o.verts || parts[o.name].F.length !== o.faces)
      .map(o => [o.name, `${parts[o.name].V.length}/${parts[o.name].F.length} for ${o.verts}/${o.faces}`]);
    const glbMeshes = new Map();
    glb.traverse(o => { if (o.isMesh) glbMeshes.set(o.userData.source_object, o); });
    const materialDiffer = [...meshes].filter(([n, m]) => glbMeshes.get(n)?.material.name !== m.material.name).map(([n]) => n);
    report.scout = {
      reference: dir,
      ...objectsReport(manifest, meshes, 300, null),
      groups_equal: JSON.stringify(groups) === JSON.stringify(refGroups),
      ngon_counts_differ: topology,
      materials: { name_differs: materialDiffer, ...materialsReport(glb, meshes) },
    };
  }
  report[name].seconds = Math.round(performance.now() - t0) / 1000;
  if (opt.iou) {
    const out = `renders/robotgen-reference/${name}`;
    const run = spawnSync(process.execPath, [path.join(webRoot, 'tools', 'robotgen_compare.mjs'), `--model=${name}`, `--out=${out}`], { cwd: webRoot, encoding: 'utf8' });
    try { report[name].iou = JSON.parse(readFileSync(path.join(webRoot, out, 'compare.json'), 'utf8')).iou ?? null; } catch { report[name].iou = null; }
    if (run.status !== 0) report[name].iou_error = (run.stderr || run.stdout).slice(-400);
  }
  const r = report[name];
  console.log(`${name}: ${r.objects.built}/${r.objects.reference} objects (missing ${r.objects.missing.length}, added ${r.objects.added.length}), box deviation largest ${r.box_mm.largest} mm, mean ${r.box_mm.mean} mm, ${r.box_mm.beyond_1mm} beyond 1 mm`
    + (r.ballon_spec ? `; Ballon part list: ${r.ballon_spec.parts_changed.length} changed, ${r.ballon_spec.parts_missing.length} missing, ${r.ballon_spec.parts_added.length} added` : '')
    + (r.iou ? `; IoU ${Object.values(r.iou.views).map(v => v.toFixed(4)).join('/')}` : ''));
}
if (opt.json) writeFileSync(path.resolve(opt.json), JSON.stringify(report, null, 1) + '\n');
else console.log(JSON.stringify(report, null, 1));
