import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';

test('complete headsets mirror in world space with outward surfaces and one rear box', async () => {
  const server = await createServer({ root: fileURLToPath(new URL('../', import.meta.url)), logLevel: 'error', server: { middlewareMode: true, hmr: false } });
  const materials = new Map(); let model;
  try {
    const { buildHelmet } = await server.ssrLoadModule('/src/helmet.js');
    const palette = new Proxy({}, { get: (_, name) => {
      if (!materials.has(name)) materials.set(name, new THREE.MeshStandardMaterial());
      return materials.get(name);
    } });
    model = buildHelmet(palette); model.updateMatrixWorld(true);
    assert.ok(model.getObjectByName('HeadBand'));
    assert.equal(model.getObjectByName('EarCap'), undefined);
    let boxes = 0; model.traverse(o => { if (o.name.startsWith('BackBox_Group')) boxes++; });
    assert.equal(boxes, 1, 'The central rear box must not be duplicated');
    const source = [], target = [];
    for (const child of model.getObjectByName('RightComms_And_Tube').children)
      if (child.name !== 'BackBox_Group') child.traverse(o => { if (o.isMesh) source.push(o); });
    model.getObjectByName('MirroredComms_B').traverse(o => { if (o.isMesh) target.push(o); });
    assert.equal(target.length, source.length); assert.equal(source.length, 18);
    const worldPoints = mesh => Array.from({ length: mesh.geometry.attributes.position.count }, (_, i) =>
      new THREE.Vector3().fromBufferAttribute(mesh.geometry.attributes.position, i).applyMatrix4(mesh.matrixWorld));
    const volume = (mesh, points) => {
      const ids = mesh.geometry.index?.array ?? points.map((_, i) => i); let sum = 0;
      for (let i = 0; i < ids.length; i += 3) sum += points[ids[i]].dot(new THREE.Vector3().crossVectors(points[ids[i + 1]], points[ids[i + 2]])) / 6;
      return sum;
    };
    for (let i = 0; i < source.length; i++) {
      const a = source[i], b = target[i], ap = worldPoints(a), bp = worldPoints(b);
      assert.equal(a.material, b.material); assert.equal(ap.length, bp.length);
      assert.ok(b.matrixWorld.determinant() > 0, 'Export must not depend on a negative scale');
      for (let j = 0; j < ap.length; j++) {
        assert.ok(Math.hypot(ap[j].x + bp[j].x, ap[j].y - bp[j].y, ap[j].z - bp[j].z) < 1e-6, `Asymmetric headset ${b.name}`);
      }
      assert.ok(Math.abs(volume(a, ap) - volume(b, bp)) < 1e-7, `Inverted mirrored surface ${b.name}`);
    }
  } finally {
    model?.traverse(o => o.geometry?.dispose());
    for (const material of materials.values()) material.dispose();
    await server.close();
  }
});
