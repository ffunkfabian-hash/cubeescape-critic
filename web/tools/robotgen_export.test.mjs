// Delivered GLBs of the three.js generator (0.18 "Prefab", tools/robotgen_export.mjs) against the generator: the manifest names the
// current generator inputs, describes the delivered GLB mesh by mesh, and a fresh export gives the same bytes on the platform that
// wrote the package. Elsewhere (Linux CI: CSG may triangulate differently) the fresh build must have the same meshes, extras and boxes.
// Since 0.19 the live build itself equals the delivered meshes to the bit, normals included (the GLTFExporter has nothing left to
// normalise), on the package's platform.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { MODELS, packageFiles, generatorSources, exportModel, parseGLB, meshDigest } from './robotgen_export.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const read = rel => readFileSync(path.join(repo, rel));
const sources = generatorSources();
const warn = console.warn;
console.warn = (...m) => { if (!/maxLeafSize|normalized normal attribute/.test(String(m[0]))) warn(...m); };

const meshes = root => {
  const out = new Map();
  root.updateMatrixWorld(true);
  root.traverse(o => { if (o.isMesh) out.set(o.name, o); });
  return out;
};

for (const name of MODELS) {
  const files = packageFiles(name), manifest = JSON.parse(read(files.manifest));

  test(`${name}: package was exported from the current generator inputs`, () => {
    assert.equal(manifest.generator.inputs.sha256, sources.sha256, `generator inputs changed since the export: node tools/robotgen_export.mjs --model ${name}`);
    assert.deepEqual(manifest.generator.inputs.libraries, sources.libraries);
  });

  test(`${name}: manifest describes the delivered GLB mesh by mesh`, async () => {
    const delivered = meshes(await parseGLB(read(files.glbs.assembled)));
    assert.deepEqual(manifest.objects.map(o => o.name), [...delivered.keys()].sort());
    for (const o of manifest.objects) {
      const g = delivered.get(o.name).geometry;
      assert.deepEqual([o.verts, o.digest], [g.attributes.position.count, meshDigest(g)], o.name);
    }
  });

  test(`${name}: fresh export equals the delivered files (bytes on the package's platform, meshes and boxes elsewhere)`, async t => {
    const fresh = await exportModel(name, sources);
    if (manifest.generator.platform.startsWith(`${process.platform}-${process.arch} `)) {
      const differ = Object.entries(fresh.files).filter(([rel, bytes]) => !read(rel).equals(bytes)).map(([rel]) => rel);
      if (differ.length) {
        const now = meshes(await parseGLB(fresh.files[files.glbs.assembled]));
        const meshesDiffer = manifest.objects.filter(o => !now.has(o.name) || meshDigest(now.get(o.name).geometry) !== o.digest).map(o => o.name);
        assert.fail(`${differ.join(', ')} differ from the generator (meshes: ${meshesDiffer.slice(0, 8).join(', ') || 'none'}): node tools/robotgen_export.mjs --model ${name}`);
      }
      // live build (before the exporter) = delivered mesh: index, positions and normals
      const live = meshes(fresh.scene);
      const liveDiffer = manifest.objects.filter(o => meshDigest(live.get(o.name).geometry) !== o.digest).map(o => o.name);
      assert.deepEqual(liveDiffer, [], 'live build differs from the delivered GLB (normals the exporter changed?)');
      return;
    }
    t.diagnostic(`package written on ${manifest.generator.platform}: comparing meshes and boxes only`);
    for (const [glb, rel] of Object.entries(files.glbs)) {
      const a = meshes(await parseGLB(read(rel))), b = meshes(await parseGLB(fresh.files[rel]));
      assert.deepEqual([...b.keys()].sort(), [...a.keys()].sort(), glb);
      for (const [n, m] of a) {
        const o = b.get(n);
        assert.deepEqual(o.userData, m.userData, n);
        assert.equal(o.material.name, m.material.name, n);
        const ba = new THREE.Box3().setFromObject(m, true), bb = new THREE.Box3().setFromObject(o, true);
        const d = Math.max(ba.min.distanceTo(bb.min), ba.max.distanceTo(bb.max));
        assert.ok(d < 1e-4, `${glb} ${n}: box differs by ${d}`);
      }
    }
  });
}
