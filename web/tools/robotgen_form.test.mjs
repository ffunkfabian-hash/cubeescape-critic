// Form tests of the three.js generator (0.19 "Whetstone"): every model as built live (web/src/robotgen) against its own delivery
// package (assets/robot-bodies-three/<body>/, assets/helmet-scout-three/, tools/robotgen_export.mjs) instead of the frozen Blender
// reference, so the bodies can be reshaped in the generator: part list and ids stable, segments and assemblies complete, the box of
// every part within the rounding of the own manifest, meshes closed (known openings of the Scout cast listed), shading normals of
// unit length and on the front of each face, build deterministic and indexed. After a deliberate change of form: export again
// (robotgen_export.mjs), then these tests compare against the new package. How far the form has moved from the Blender reference:
// node tools/robotgen_reference.mjs (report, not a test).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import * as THREE from 'three';
import { robotSpec, ASSEMBLIES } from '../src/robotgen/robot.js';
import { SEGMENTS as ARM_SEGMENTS } from '../src/robotgen/arm.js';
import { buildRobotBody } from '../src/robotgen/index.js';
import { buildScout, explodedScout, BSP_PARTS, TEILE } from '../src/robotgen/scout.js';
import { readGussFile } from './scoutGussNode.mjs';
import { BODIES, packageFiles, parseGLB } from './robotgen_export.mjs';

const repo = new URL('../../', import.meta.url);
const pkg = name => {
  const f = packageFiles(name);
  return { manifest: JSON.parse(readFileSync(new URL(f.manifest, repo))), parts: JSON.parse(readFileSync(new URL(f.parts, repo))) };
};
const warn = console.warn;
const quiet = fn => { console.warn = () => {}; try { return fn(); } finally { console.warn = warn; } };

// Open spots of the Scout cast (S01–S05 as baked in run 2h): boundary loops per mesh after welding. Every other mesh is closed.
const KNOWN_OPENINGS = { Kappe: 82, Auge_L: 1, Auge_R: 1, Krempe: 6, Mund_Vertiefung: 1 };
// Rounding of the manifest boxes (robotgen_export.mjs › blenderBox: 1e-4 in metres, Scout in helmet heights) plus float noise on the
// package's platform; elsewhere (Linux CI: three-bvh-csg may triangulate a seam differently) 1e-4 as in robotgen_export.test.mjs.
const boxTol = manifest => (manifest.generator.platform.startsWith(`${process.platform}-${process.arch} `) ? 0.5e-4 + 1e-7 : 1e-4);

const soup = geo => (geo.index ? geo.toNonIndexed() : geo);

// Welded at 1 / weld of the unit: directed edges without their reverse (open or flipped), boundary loops (connected chains of
// such edges), triangles whose shading normals face the back, and the signed volume.
function topology(geo, weld) {
  const g = soup(geo), p = g.attributes.position.array, n = g.attributes.normal.array;
  const key = i => `${Math.round(p[i * 3] * weld)},${Math.round(p[i * 3 + 1] * weld)},${Math.round(p[i * 3 + 2] * weld)}`;
  const E = new Map();
  let back = 0, volume = 0;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), s = new THREE.Vector3();
  for (let t = 0; t < p.length / 9; t++) {
    const i = t * 9;
    volume += p[i] * (p[i + 4] * p[i + 8] - p[i + 5] * p[i + 7]) - p[i + 1] * (p[i + 3] * p[i + 8] - p[i + 5] * p[i + 6]) + p[i + 2] * (p[i + 3] * p[i + 7] - p[i + 4] * p[i + 6]);
    const k = [0, 1, 2].map(j => key(t * 3 + j));
    if (new Set(k).size < 3) continue;
    for (let j = 0; j < 3; j++) { const d = `${k[j]}>${k[(j + 1) % 3]}`; E.set(d, (E.get(d) ?? 0) + 1); }
    a.fromArray(p, i); b.fromArray(p, i + 3).sub(a); c.fromArray(p, i + 6).sub(a);
    s.fromArray(n, i).add(a.fromArray(n, i + 3)).add(a.fromArray(n, i + 6));
    if (b.cross(c).dot(s) <= 0) back++;
  }
  const open = [];
  for (const [d, cnt] of E) { const [u, v] = d.split('>'); if ((E.get(`${v}>${u}`) ?? 0) !== cnt) open.push([u, v]); }
  const parent = new Map(), find = x => { while (parent.get(x) !== x) x = parent.get(x); return x; };
  for (const [u, v] of open) { for (const x of [u, v]) if (!parent.has(x)) parent.set(x, x); parent.set(find(u), find(v)); }
  return { open: open.length, loops: new Set([...parent.keys()].map(find)).size, back, volume: volume / 6 };
}

// Largest deviation of a normal's length from 1, over all meshes; the meshes with any beyond tol.
function normalLengths(scene, tol = 1e-5) {
  let worst = 0;
  const bad = [];
  scene.traverse(o => {
    if (!o.isMesh) return;
    const n = o.geometry.attributes.normal.array;
    let off = 0;
    for (let i = 0; i < n.length; i += 3) {
      const d = Math.abs(Math.hypot(n[i], n[i + 1], n[i + 2]) - 1);
      if (d > tol) off++;
      worst = Math.max(worst, d);
    }
    if (off) bad.push(`${o.name} (${off})`);
  });
  return { worst, bad };
}

// Box of a mesh in Blender world axes (Z up, front −Y), as the manifests store it; largest difference to a manifest box.
const boxDiff = (mesh, bbox) => {
  assert.ok(mesh, 'object of the manifest missing in the build');
  const b = new THREE.Box3().setFromObject(mesh, true);
  const [[x0, y0, z0], [x1, y1, z1]] = bbox;
  return Math.max(...[x0, z0, -y1, x1, z1, -y0].map((v, i) => Math.abs(v - [b.min.x, b.min.y, b.min.z, b.max.x, b.max.y, b.max.z][i])));
};

const sceneHash = scene => {
  const h = createHash('sha256');
  scene.traverse(o => { if (o.isMesh) h.update(o.name).update(Buffer.from(o.geometry.index.array.buffer)).update(Buffer.from(o.geometry.attributes.position.array.buffer)).update(Buffer.from(o.geometry.attributes.normal.array.buffer)); });
  return h.digest('hex');
};

for (const name of BODIES) {
  const { manifest, parts } = pkg(name);
  const built = quiet(() => buildRobotBody(name));
  built.scene.updateMatrixWorld(true);
  const meshes = new Map();
  built.scene.traverse(o => { if (o.isMesh) meshes.set(o.name, o); });

  test(`${name}: part list and ids as in the own package (names, extras, role materials, parts.json)`, () => {
    assert.deepEqual([...meshes.keys()].sort(), manifest.objects.map(o => o.name));
    for (const o of manifest.objects) {
      const m = meshes.get(o.name);
      assert.deepEqual([m.userData.asm, m.userData.part, m.userData.side, m.userData.part_de, m.userData.study], [o.asm, o.part, o.side, o.part_de, manifest.study], o.name);
      assert.match(m.material.name, /^MT_[a-z_]+_color$/, o.name);
    }
    assert.deepEqual(built.parts, parts);
  });

  test(`${name}: segments and assemblies complete, segment roots placed as in the own GLB`, async () => {
    const spec = robotSpec(name);
    const roots = [...spec.segments.map(s => `SEG_${s[0]}`), ...['R', 'L'].flatMap(side => ARM_SEGMENTS.map(s => `ARM_${side}_${s}`))].sort();
    assert.deepEqual(built.scene.children.map(r => r.name), roots);
    const glb = await parseGLB(readFileSync(new URL(packageFiles(name).glbs.assembled, repo)));
    assert.deepEqual(glb.children.map(r => r.name), roots);
    for (const r of glb.children) {
      const m = built.scene.getObjectByName(r.name);
      assert.deepEqual([m.userData.asm, m.userData.side], [r.userData.asm, r.userData.side], r.name);
      r.matrix.elements.forEach((v, i) => assert.ok(Math.abs(v - m.matrix.elements[i]) < 1e-6, `${r.name}[${i}]`));
    }
    for (const r of built.scene.children) assert.ok(['C', 'R', 'L'].includes(r.userData.side) && r.userData.asm, r.name);
    for (const a of ASSEMBLIES) {
      const objs = [...meshes.values()].filter(m => m.userData.asm === a.id), want = manifest.measured.assemblies[a.id];
      assert.ok(objs.length > 0, `${a.id}: no objects`);
      assert.deepEqual([objs.length, new Set(objs.map(m => m.userData.part)).size], [want.objects, want.parts], a.id);
      for (const m of objs) assert.equal(m.parent.userData.asm, a.id, `${m.name}: below ${m.parent.name}`);
    }
  });

  test(`${name}: box of every part within the rounding of the own manifest`, () => {
    const tol = boxTol(manifest);
    for (const o of manifest.objects) {
      const d = boxDiff(meshes.get(o.name), o.bbox);
      assert.ok(d <= tol, `${o.name}: box differs by ${(d * 1000).toFixed(3)} mm`);
    }
  });

  test(`${name}: every mesh closed, outward, shading normals of unit length on the front of each face`, () => {
    for (const m of meshes.values()) {
      const t = topology(m.geometry, 1e5);
      assert.deepEqual([t.open, t.back], [0, 0], `${m.name}: open/flipped edges or normals facing backwards`);
      assert.ok(t.volume > 0, `${m.name}: volume ≤ 0`);
    }
    const n = normalLengths(built.scene);
    assert.deepEqual(n.bad, [], `normals not of unit length (largest deviation ${n.worst})`);
  });

  test(`${name}: build deterministic, meshes indexed with shared corners`, () => {
    assert.equal(sceneHash(quiet(() => buildRobotBody(name)).scene), sceneHash(built.scene));
    let corners = 0, verts = 0;
    for (const m of meshes.values()) {
      assert.ok(m.geometry.index, `${m.name}: not indexed`);
      corners += m.geometry.index.count; verts += m.geometry.attributes.position.count;
    }
    assert.ok(verts < 0.4 * corners, `${verts} vertices for ${corners} corners: corners of equal position and normal not shared`);
  });
}

{
  const { manifest, parts } = pkg('scout');
  const guss = await readGussFile();
  const built = quiet(() => buildScout(guss));
  built.scene.updateMatrixWorld(true);
  const meshes = new Map(built.scene.children.map(o => [o.name, o]));

  test('scout: part list and ids as in the own package (names, groups, extras, explosion offsets)', () => {
    assert.deepEqual([...meshes.keys()].sort(), manifest.objects.map(o => o.name));
    for (const o of manifest.objects) assert.equal(meshes.get(o.name).userData.part_label, o.part, o.name);
    assert.deepEqual(built.groups.map(g => ({ id: g.id, label: g.label, side: g.side, objects: g.objects, exploded_offset: g.offset })), parts.parts);
    for (const g of parts.parts) for (const n of g.objects) {
      const u = meshes.get(n).userData;
      assert.deepEqual([u.part_id, u.part_label, u.side, u.source_object], [g.id, g.label, g.side, n], n);
    }
  });

  test('scout: groups S01–S13 complete, every object in exactly one group', () => {
    assert.deepEqual([...new Set(built.groups.map(g => g.id))], TEILE.map(t => t[0]));
    for (const [id, , , , sided] of TEILE) assert.deepEqual(built.groups.filter(g => g.id === id).map(g => g.side), sided ? ['R', 'L'] : [''], id);
    const owners = built.groups.flatMap(g => g.objects);
    assert.deepEqual(owners.slice().sort(), [...meshes.keys()].sort());
  });

  test('scout: box of every part within the rounding of the own manifest', () => {
    const tol = boxTol(manifest);
    for (const o of manifest.objects) {
      const d = boxDiff(meshes.get(o.name), o.bbox);
      assert.ok(d <= tol, `${o.name}: box differs by ${d} H`);
    }
  });

  test('scout: closed except the known openings of the cast, BSP parts outward, normals of unit length', () => {
    const loops = {};
    for (const m of meshes.values()) {
      const t = topology(m.geometry, 1e6);
      if (t.loops) loops[m.name] = t.loops;
      if (BSP_PARTS.includes(m.name) && m.name !== 'Mund_Vertiefung') {
        assert.equal(t.open, 0, `${m.name}: open edges`);
        assert.ok(t.volume > 0, `${m.name}: volume ${t.volume}`);
      }
    }
    assert.deepEqual(loops, KNOWN_OPENINGS, 'boundary loops per mesh');
    const n = normalLengths(built.scene);
    assert.deepEqual(n.bad, [], `normals not of unit length (largest deviation ${n.worst})`);
  });

  test('scout: build deterministic, meshes indexed, exploded copy offset by parts.json', () => {
    for (const m of meshes.values()) assert.ok(m.geometry.index, `${m.name}: not indexed`);
    assert.equal(sceneHash(quiet(() => buildScout(guss)).scene), sceneHash(built.scene));
    const ex = explodedScout(built.scene, built.groups);
    const off = Object.fromEntries(parts.parts.flatMap(p => p.objects.map(n => [n, p.exploded_offset])));
    for (const o of ex.children) assert.deepEqual(o.position.toArray(), [off[o.name][0], off[o.name][2], -off[o.name][1]], o.name);
  });
}

test('topology: a closed box has no loop, a box without one face has one, a flipped normal faces back', () => {
  const box = () => new THREE.BoxGeometry(1, 2, 3).toNonIndexed();
  assert.deepEqual(topology(box(), 1e5).loops, 0);
  const open = box();
  for (const a of ['position', 'normal']) open.setAttribute(a, new THREE.BufferAttribute(open.attributes[a].array.slice(18), 3));
  const t = topology(open, 1e5);
  assert.deepEqual([t.open, t.loops], [4, 1]);
  const flipped = box();
  for (let i = 0; i < 9; i++) flipped.attributes.normal.array[i] *= -1;
  assert.equal(topology(flipped, 1e5).back, 1);
});
