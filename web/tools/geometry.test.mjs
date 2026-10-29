import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import * as THREE from 'three';

let server, model, D, surfaces;
const materials = new Map();

before(async () => {
  const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  server = await createServer({ root, logLevel: 'error', server: { middlewareMode: true, hmr: false } });
  const { buildLowerArmor } = await server.ssrLoadModule('/src/parts/lowerArmor.js');
  ({ D } = await server.ssrLoadModule('/src/params.js'));
  const palette = new Proxy({}, { get: (_, name) => {
    if (!materials.has(name)) materials.set(name, new THREE.MeshStandardMaterial({ name }));
    return materials.get(name);
  } });
  // CSG's pinned dependency emits the same deprecation for every boolean operation.
  // Preserve the first warning and all unrelated diagnostics.
  const warn = console.warn;
  let warned = false;
  console.warn = (...args) => {
    if (String(args[0]).includes('"maxLeafSize" option has been deprecated')) {
      if (warned) return;
      warned = true;
    }
    warn(...args);
  };
  try { model = buildLowerArmor(palette); } finally { console.warn = warn; }
  model.updateMatrixWorld(true);
  surfaces = model.children.filter((o) => o.name === 'Collar' || /^Collar(Panel|Socket|Slot)Floor_/.test(o.name));
});

after(async () => {
  model?.traverse((o) => o.geometry?.dispose());
  for (const material of materials.values()) material.dispose();
  await server?.close();
});

function ray(side, y, z) {
  const caster = new THREE.Raycaster(new THREE.Vector3(side * 2, y, z), new THREE.Vector3(-side, 0, 0));
  const hit = caster.intersectObjects(surfaces, true)[0];
  assert.ok(hit, `Missing collar at side=${side}, y=${y}, z=${z}`);
  return hit;
}

function wallX(y, z, inset = 0) {
  const k = D.collar;
  const localZ = -Math.sin(k.tilt) * y + Math.cos(k.tilt) * z;
  // Intersect the horizontal ray with the declared polygon, independently of CSG.
  const step = 2 * Math.PI / D.lowerArmorEdges.radialSegments, xs = [];
  for (let angle = 0; angle < 2 * Math.PI - 1e-8; angle += step) {
    const az = k.cz + (k.rz - inset) * Math.cos(angle);
    const bz = k.cz + (k.rz - inset) * Math.cos(angle + step);
    if ((localZ - az) * (localZ - bz) > 0 || Math.abs(bz - az) < 1e-9) continue;
    const t = (localZ - az) / (bz - az);
    xs.push((k.rx - inset) * ((1-t) * Math.sin(angle) + t * Math.sin(angle + step)));
  }
  return Math.max(...xs);
}

test('separate jaw inserts follow their supporting plates', () => {
  for (const s of [-1, 1]) {
    const suffix = s > 0 ? 'L' : 'R';
    const jaw = model.getObjectByName(`Jaw_${suffix}`);
    const insert = model.getObjectByName(`Jaw_Insert_${suffix}`);
    assert.ok(jaw?.isMesh && insert?.isMesh);
    const ray = new THREE.Raycaster(new THREE.Vector3(s * 2, -0.375, 0.28), new THREE.Vector3(-s, 0, 0));
    const support = ray.intersectObject(jaw)[0], surface = ray.intersectObject(insert)[0];
    assert.ok(support && surface);
    const offset = support.distance - surface.distance;
    assert.ok(offset > 0 && offset < 0.008, `Floating jaw insert: ${offset}`);
  }
});

test('collar surface attributes remain finite after boolean pocket cuts', () => {
  assert.equal(surfaces.length, 7, 'Collar and all six separate pocket floors must exist');
  for (const mesh of surfaces) {
    assert.ok(mesh.geometry.attributes.position.count > 0, mesh.name);
    for (const [name, attribute] of Object.entries(mesh.geometry.attributes)) {
      assert.ok(attribute.array.every(Number.isFinite), `${mesh.name}: invalid ${name}`);
    }
  }
});

test('rear core and collar follow a round elliptical outline', () => {
  for (const [name, dims, localY, tilt] of [
    ['Core', D.core, 0.12, 0], ['Collar', D.collar, -0.17, D.collar.tilt],
  ]) {
    const mesh = model.getObjectByName(name);
    for (const x of [-0.28, -0.22, -0.1, 0.1, 0.22, 0.28]) {
      const origin = new THREE.Vector3(x, localY, -2).applyAxisAngle(new THREE.Vector3(1, 0, 0), tilt);
      const direction = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(1, 0, 0), tilt);
      const hit = new THREE.Raycaster(origin, direction).intersectObject(mesh)[0];
      assert.ok(hit, `Missing rear wall on ${name}`);
      const local = hit.point.clone().applyAxisAngle(new THREE.Vector3(1, 0, 0), -tilt);
      const expectedZ = dims.cz - dims.rz * Math.sqrt(1 - (x / dims.rx) ** 2);
      assert.ok(Math.abs(local.z - expectedZ) < 0.0008, `Faceted rear wall remains on ${name}`);
    }
  }
});

test('panel interiors expose recessed floors, with no residual original wall facets', () => {
  const p = D.collarPanel;
  for (const side of [-1, 1]) {
    const suffix = side > 0 ? 'L' : 'R';
    for (const dy of [-0.02, 0, 0.02]) for (const dz of [-0.05, 0, 0.05]) {
      const y = p.y + dy, z = p.z + dz;
      const hit = ray(side, y, z);
      assert.equal(hit.object.name, `CollarPanelFloor_${suffix}`, `Residual wall at ${side},${y},${z}`);
      const inset = wallX(y, z) - Math.abs(hit.point.x);
      assert.ok(inset > p.depth * 0.7 && inset < p.depth * 1.8, `Unexpected panel depth ${inset}`);
    }
  }
});

test('slot is deeper than the panel, socket is recessed, and surrounding wall is retained', () => {
  const p = D.collarPanel;
  for (const side of [-1, 1]) {
    const suffix = side > 0 ? 'L' : 'R';
    const slot = model.getObjectByName(`CollarSlotFloor_${suffix}`);
    // Aim at the intended opening along its normal. The bounding-box midpoint of
    // a curved CSG floor is not necessarily on the narrow opening's centreline.
    const k = D.collar;
    const anchor = new THREE.Vector3(side * wallX(p.y, p.z), p.y, p.z);
    const local = anchor.clone().applyAxisAngle(new THREE.Vector3(1, 0, 0), -k.tilt);
    const normal = new THREE.Vector3(local.x / k.rx ** 2, 0, (local.z - k.cz) / k.rz ** 2)
      .applyAxisAngle(new THREE.Vector3(1, 0, 0), k.tilt).normalize();
    const tangent = new THREE.Vector3(0, 0.06, 1);
    tangent.addScaledVector(normal, -tangent.dot(normal)).normalize();
    anchor.addScaledVector(tangent, -p.width * 0.32);
    const caster = new THREE.Raycaster(anchor.addScaledVector(normal, 1), normal.clone().negate());
    const slotHit = caster.intersectObjects(surfaces, true)[0];
    assert.ok(slotHit, 'The slot opening must retain a floor');
    assert.equal(slotHit.object.name, slot.name);
    assert.ok(wallX(slotHit.point.y, slotHit.point.z, p.depth) - Math.abs(slotHit.point.x) > p.slotDepth * 0.6);

    const socket = ray(side, p.y + 0.01, p.socketZ);
    assert.equal(socket.object.name, `CollarSocketFloor_${suffix}`);
    assert.ok(wallX(p.y + 0.01, p.socketZ) - Math.abs(socket.point.x) > p.depth * 0.7);

    const outside = ray(side, p.y - 0.07, p.z);
    assert.equal(outside.object.name, 'Collar');
    assert.ok(Math.abs(wallX(p.y - 0.07, p.z) - Math.abs(outside.point.x)) < 0.001);
  }
});
