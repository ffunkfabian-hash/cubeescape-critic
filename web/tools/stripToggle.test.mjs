import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';

test('disabling forehead strips removes only their two meshes and preserves the complete crown', async () => {
  const server = await createServer({ root: fileURLToPath(new URL('../', import.meta.url)),
    logLevel: 'error', server: { middlewareMode: true, hmr: false } });
  const materials = new Map(), models = [];
  let D, enabled;
  try {
    const { buildHelmet } = await server.ssrLoadModule('/src/helmet.js');
    ({ D } = await server.ssrLoadModule('/src/params.js')); enabled = D.foreheadPlates.enabled;
    const palette = new Proxy({}, { get: (_, name) => {
      if (!materials.has(name)) materials.set(name, new THREE.MeshStandardMaterial({ name }));
      return materials.get(name);
    } });
    const meshes = setting => {
      D.foreheadPlates.enabled = setting;
      const model = buildHelmet(palette); models.push(model); model.updateMatrixWorld(true);
      const result = new Map();
      const visit = (object, path) => {
        if (object.isMesh) result.set(path, object);
        const occurrences = new Map();
        for (const child of object.children) {
          const ordinal = occurrences.get(child.name) ?? 0;
          occurrences.set(child.name, ordinal + 1);
          visit(child, `${path}/${child.name}[${ordinal}]`);
        }
      };
      visit(model, model.name); return result;
    };
    const on = meshes(true), off = meshes(false);
    assert.equal(on.size, 104); assert.equal(off.size, 102);
    assert.equal(models[1].getObjectByName('ForeheadPlates'), undefined);
    assert.ok(models[1].getObjectByName('Crown')); assert.ok(models[1].getObjectByName('HeadBand'));
    for (const [path, mesh] of off) {
      const original = on.get(path); assert.ok(original, path);
      assert.deepEqual(mesh.matrixWorld.elements, original.matrixWorld.elements, path);
      assert.equal(mesh.material, original.material, path);
      for (const [name, attribute] of Object.entries(mesh.geometry.attributes))
        assert.deepEqual(attribute.array, original.geometry.attributes[name].array, `${path}.${name}`);
      assert.deepEqual(mesh.geometry.index?.array, original.geometry.index?.array, path);
    }
  } finally {
    if (D) D.foreheadPlates.enabled = enabled;
    for (const model of models) model.traverse(object => object.geometry?.dispose());
    for (const material of materials.values()) material.dispose();
    await server.close();
  }
});
