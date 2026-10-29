// Patina 0.11: sharp-edge detection for the robot wear shader and the role parameters taken from Ballon's aaa_nodes().
import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { prepareWearGeometry, roleOf, wearMaterial, setRobotWear, robotWearOn, WEAR_PARAMS } from '../src/robotWear.js';

const triangles = g => {
  const bary = g.attributes.wearBary, edge = g.attributes.wearEdge, out = [];
  for (let t = 0; t < g.attributes.position.count / 3; t++) out.push({ edge: [0, 1, 2].map(k => edge.array[t * 9 + k]),
    bary: [0, 1, 2].map(c => [0, 1, 2].map(k => bary.array[t * 9 + c * 3 + k])) });
  return out;
};

test('cube: the 12 cube edges are sharp, face diagonals are not', () => {
  const tris = triangles(prepareWearGeometry(new THREE.BoxGeometry(1, 1, 1)));
  assert.equal(tris.length, 12);
  for (const t of tris) {
    assert.deepEqual(t.bary, [[255, 0, 0], [0, 255, 0], [0, 0, 255]]);
    const sharp = t.edge.filter(h => h >= 0);
    assert.equal(sharp.length, 2, 'two cube edges and one diagonal per triangle');
    for (const h of sharp) assert.ok(Math.abs(h - 1) < 1e-6, `height above a cube edge is the side length, got ${h}`);
  }
});

test('subdivided plane: inner edges smooth, open boundary sharp', () => {
  const tris = triangles(prepareWearGeometry(new THREE.PlaneGeometry(1, 1, 4, 4)));
  const sharpEdges = tris.reduce((n, t) => n + t.edge.filter(h => h >= 0).length, 0);
  assert.equal(sharpEdges, 16, 'four boundary edges per side');
});

const sharpCount = g => triangles(g).reduce((n, t) => n + t.edge.filter(h => h >= 0).length, 0);

test('smooth-shaded coarse sphere (facets 15–30°) stays clean; the same facets flat-shaded wear', () => {
  const sphere = new THREE.SphereGeometry(1, 12, 6);
  assert.equal(sharpCount(prepareWearGeometry(sphere)), 0, 'smooth shading: no normal jump');
  const flat = sphere.toNonIndexed(); flat.computeVertexNormals(); // non-indexed → per-face normals
  assert.ok(sharpCount(prepareWearGeometry(flat)) > 0);
});

test('a tight rounded strip (bevel) wears entirely, a large gentle curve does not', () => {
  const strip = r => new THREE.CylinderGeometry(r, r, 0.1, 2, 1, true, 0, Math.PI / 2); // quarter round in two segments like Ballon's bevel, smooth normals
  const tight = triangles(prepareWearGeometry(strip(0.002))), wide = triangles(prepareWearGeometry(strip(1)));
  assert.ok(tight.every(t => t.edge.every(h => h >= 0)), 'bevel strip: all edges wear');
  assert.ok(wide.every(t => t.edge.filter(h => h >= 0).length <= 2), 'gentle curve: only its open boundary (top/bottom and the quarter ends)');
});

test('roles: GLB material names map to Ballon roles, every role in the parameters is known to Ballon', () => {
  assert.equal(roleOf({ name: 'MT_dark_metal_color' }), 'dark_metal');
  assert.equal(roleOf({ name: 'Material' }), null);
  assert.deepEqual(Object.keys(WEAR_PARAMS.roles).sort(), ['accent', 'anodized', 'dark_metal', 'graphite', 'metal', 'rubber', 'shell', 'trim']);
  assert.equal(WEAR_PARAMS.roles.shell.wear, 1.0);
  assert.equal(WEAR_PARAMS.wear.radius, 0.004);
});

test('wearMaterial: clone with Ballon aaa colour and specular, untouched source; unknown roles pass through', () => {
  const src = new THREE.MeshStandardMaterial({ name: 'MT_graphite_color', color: '#2C2E33', roughness: 0.75 });
  const m = wearMaterial(src, 'graphite', 3);
  assert.notEqual(m, src);
  assert.ok(m.isMeshPhysicalMaterial);
  assert.equal(m.specularIntensity, 0.5);
  assert.equal(m.color.getHexString(), new THREE.Color('#141518').getHexString());
  assert.equal(src.color.getHexString(), new THREE.Color('#2C2E33').getHexString());
  assert.equal(m.roughness, 0.75);
  const energy = new THREE.MeshStandardMaterial({ name: 'MT_energy_color' });
  assert.equal(wearMaterial(energy, 'energy', 3), energy);
});

test('wearMaterial with specular keeps the PHYSICAL define, otherwise specularIntensity has no effect', () => {
  const m = wearMaterial(new THREE.MeshStandardMaterial({ name: 'MT_rubber_color' }), 'rubber', 3);
  assert.ok('PHYSICAL' in m.defines && 'STANDARD' in m.defines);
  assert.equal(m.specularIntensity, 0.4);
});

test('setRobotWear toggles geometry and materials, shares materials per role, keeps userData exportable', () => {
  const shell = new THREE.MeshStandardMaterial({ name: 'MT_shell_color' }), energy = new THREE.MeshStandardMaterial({ name: 'MT_energy_color' });
  const boxes = [shell, shell, energy].map(mat => new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), mat));
  const inner = new THREE.Group(); inner.scale.setScalar(3); inner.add(...boxes);
  const model = new THREE.Group(); model.add(inner);
  const flat = boxes.map(b => b.geometry);
  setRobotWear(model, true);
  assert.ok(robotWearOn(model));
  assert.ok(boxes[0].geometry.attributes.wearEdge && boxes[0].geometry !== flat[0]);
  assert.equal(boxes[0].material, boxes[1].material, 'one aged material per role');
  assert.notEqual(boxes[0].material, shell);
  assert.equal(boxes[2].material, energy, 'roles without parameters stay flat');
  assert.equal(boxes[2].geometry, flat[2]);
  for (const o of [model, ...boxes]) assert.ok(JSON.stringify(o.userData).length < 50, 'no geometry in userData (glTF extras)');
  const aged = boxes[0].geometry;
  setRobotWear(model, false);
  assert.ok(!robotWearOn(model));
  assert.deepEqual(boxes.map(b => b.geometry), flat);
  assert.equal(boxes[0].material, shell);
  setRobotWear(model, true);
  assert.equal(boxes[0].geometry, aged, 'prepared once, reused');
});
