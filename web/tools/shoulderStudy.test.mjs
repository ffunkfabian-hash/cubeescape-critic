import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { buildShoulderStudy, SHOULDER_STUDY_PARTS, shoulderStudyParams } from '../src/parts/shoulderStudy.js';

const palette = Object.fromEntries(['blackRubber', 'whiteArmor', 'darkArmor', 'darkMetal', 'whiteTextured']
  .map(name => [name, new THREE.MeshStandardMaterial({ name })]));

function triangles(geometry) {
  const p = geometry.attributes.position;
  const indices = geometry.index ? Array.from(geometry.index.array) : Array.from({ length: p.count }, (_, i) => i);
  return Array.from({ length: indices.length / 3 }, (_, i) => indices.slice(i * 3, i * 3 + 3)
    .map(j => new THREE.Vector3().fromBufferAttribute(p, j)));
}

test('upper-body proposal stays a short independently editable bust and reuses the accepted palette', () => {
  const body = buildShoulderStudy(palette);
  assert.equal(body.name, 'ShoulderStudy');
  assert.equal(body.children.length, Object.keys(SHOULDER_STUDY_PARTS).length);
  assert.equal(new Set(body.children.map(part => part.geometry)).size, body.children.length);
  assert.equal(new Set(body.children.map(part => part.userData.partId)).size, body.children.length);
  for (const part of body.children) {
    assert.equal(part.name, SHOULDER_STUDY_PARTS[part.userData.partId]);
    assert.ok(Object.values(palette).includes(part.material));
    assert.equal(part.material.emissiveIntensity, 1);
    assert.equal(part.material.emissive.getHex(), 0);
  }
  const bounds = new THREE.Box3().setFromObject(body);
  assert.ok(bounds.min.y >= -1.53 + shoulderStudyParams.placement.upperBodyRise && bounds.max.y <= -0.33,
    `${bounds.min.y}..${bounds.max.y}`);
  assert.ok(bounds.max.x < 1.18 && bounds.min.x > -1.18);
  assert.ok(bounds.max.x - bounds.min.x >= 2.25, 'the revised shoulders must keep the requested sturdy width');
  assert.ok(bounds.max.z < 0.38 && bounds.min.z > -0.38);
});

test('all new solids have finite UVs, nondegenerate faces, outward volume and closed triangle edges', () => {
  const body = buildShoulderStudy(palette);
  const key = p => p.toArray().map(value => Math.round(value * 1e6)).join(',');
  for (const part of body.children) {
    for (const attribute of ['position', 'normal', 'uv']) {
      assert.ok(part.geometry.attributes[attribute]?.array.every(Number.isFinite), `${part.name}.${attribute}`);
    }
    let volume = 0;
    const edges = new Map(), directions = new Map();
    for (const [a, b, c] of triangles(part.geometry)) {
      const area = b.clone().sub(a).cross(c.clone().sub(a)).length();
      assert.ok(area > 1e-10, `${part.name}: degenerate face`);
      volume += a.dot(b.clone().cross(c)) / 6;
      for (const [u, v] of [[a, b], [b, c], [c, a]]) {
        const pair = [key(u), key(v)].sort().join('|');
        edges.set(pair, (edges.get(pair) ?? 0) + 1);
        directions.set(pair, (directions.get(pair) ?? 0) + (key(u) < key(v) ? 1 : -1));
      }
    }
    assert.ok(volume > 1e-7, `${part.name}: nonpositive volume ${volume}`);
    for (const [edge, count] of edges) assert.equal(count, 2, `${part.name}: edge ${edge}`);
    for (const [edge, direction] of directions) assert.equal(direction, 0, `${part.name}: inconsistent winding ${edge}`);
  }
});

test('body parameters reproduce geometry and isolated edits leave the opposite shoulder intact', () => {
  const first = buildShoulderStudy(palette), second = buildShoulderStudy(palette);
  for (const part of first.children) assert.deepEqual(part.geometry.attributes.position.array,
    second.getObjectByName(part.name).geometry.attributes.position.array, part.name);
  const params = structuredClone(shoulderStudyParams);
  params.neck.top -= 0.03;
  const changed = buildShoulderStudy(palette, params);
  assert.notDeepEqual(first.getObjectByName('NeckFlex').geometry.attributes.position.array,
    changed.getObjectByName('NeckFlex').geometry.attributes.position.array);
  assert.deepEqual(first.getObjectByName('ShoulderFront_L').geometry.attributes.position.array,
    changed.getObjectByName('ShoulderFront_L').geometry.attributes.position.array);
});

test('front and rear armor remain outside the support rather than disappearing inside it', () => {
  const body = buildShoulderStudy(palette);
  body.updateMatrixWorld(true);
  for (const [x, y, z, name] of [[0.15, -1.25, 2, 'ChestInsert_L'],
    [-0.12, -1.4, 2, 'ChestInsert_R'], [0.3, -1, 2, 'ClavicleArmor_L'],
    [0.15, -1, -2, 'ScapulaArmor_L'], [0, -1.35, -2, 'BackSpineInsert']]) {
    const ray = new THREE.Raycaster(new THREE.Vector3(x, y + shoulderStudyParams.placement.upperBodyRise, z),
      new THREE.Vector3(0, 0, -Math.sign(z)));
    const hits = ray.intersectObject(body, true);
    assert.equal(hits[0]?.object.name, name, `${x},${y},${z}`);
    const backing = hits.find(hit => hit.object.name === 'UpperTorsoCore');
    assert.ok(backing && backing.distance - hits[0].distance > 0.01, `${name}: armor has no clear outer face`);
  }
});

test('raised sturdy shoulders shorten the neck without moving its helmet anchor and retain a real front notch', () => {
  const body = buildShoulderStudy(palette);
  const neck = new THREE.Box3().setFromObject(body.getObjectByName('NeckFlex'));
  assert.ok(Math.abs(neck.max.y - shoulderStudyParams.neck.top) < 1e-6);
  assert.ok(neck.max.y - neck.min.y <= 0.32, 'neck must be shorter than the original 0.49-unit proposal');
  const shoulder = body.getObjectByName('ShoulderFront_L');
  const position = shoulder.geometry.attributes.position;
  const inner = [], outer = [];
  for (let i = 0; i < position.count; i++) {
    if (position.getX(i) < 0.5) inner.push(position.getY(i));
    if (position.getX(i) > 1.1) outer.push(position.getY(i));
  }
  assert.ok(Math.max(...inner) - Math.max(...outer) > 0.23, 'outer shoulder cap must turn down substantially');
  const plain = structuredClone(shoulderStudyParams);
  plain.collar.frontNotchDepth = 0;
  const unnotched = buildShoulderStudy(palette, plain);
  const topAtCenter = root => {
    root.updateMatrixWorld(true);
    const ray = new THREE.Raycaster(new THREE.Vector3(0, 0, 0.32), new THREE.Vector3(0, -1, 0));
    return ray.intersectObject(root.getObjectByName('CollarFront'))[0].point.y;
  };
  assert.ok(topAtCenter(unnotched) - topAtCenter(body) > 0.03, 'the front V must lower the physical rim');
});

test('the extra pauldron arch raises the upper silhouette while preserving width, neck and outside downturn', () => {
  const body = buildShoulderStudy(palette);
  const previous = structuredClone(shoulderStudyParams);
  previous.shoulder.archHeight = 0;
  previous.shoulder.thickness = 0.078;
  previous.shoulder.baseDrop = 0.07;
  previous.shoulder.baseThickness = 0.19;
  const flatter = buildShoulderStudy(palette, previous);
  for (const name of ['ShoulderFront_R', 'ShoulderRear_R', 'ShoulderFront_L', 'ShoulderRear_L']) {
    const raised = new THREE.Box3().setFromObject(body.getObjectByName(name));
    const before = new THREE.Box3().setFromObject(flatter.getObjectByName(name));
    assert.ok(raised.max.y - before.max.y > 0.14, `${name}: upper silhouette must rise clearly`);
    assert.ok(raised.max.y < -0.45, `${name}: leave vertical space below the helmet`);
    assert.equal(raised.min.x, before.min.x);
    assert.equal(raised.max.x, before.max.x);
    assert.ok(raised.min.y < -1.01, `${name}: keep the downward outer cap`);
  }
  for (const name of ['NeckFlex', 'NeckRibs', 'CollarFront', 'CollarRear', 'UpperTorsoCore']) {
    assert.deepEqual(body.getObjectByName(name).geometry.attributes.position.array,
      flatter.getObjectByName(name).geometry.attributes.position.array, `${name}: shoulder arch moved an unrelated part`);
  }
});
