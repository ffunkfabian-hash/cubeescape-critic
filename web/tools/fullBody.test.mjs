import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { resolveAssemblyOptions } from '../src/assemblyOptions.js';
import { assemblyInventory, configureHelmetAssembly, createExplodedAssembly } from '../src/assembly.js';
import { buildFullBody, FULL_BODY_PARTS, fullBodyParams } from '../src/parts/fullBody.js';
import { buildShoulderStudy, SHOULDER_STUDY_PARTS } from '../src/parts/shoulderStudy.js';

const palette = Object.fromEntries(['blackRubber', 'whiteArmor', 'darkArmor', 'darkMetal', 'whiteTextured']
  .map(name => [name, new THREE.MeshStandardMaterial({ name })]));
const build = (p = fullBodyParams) => { const body = buildFullBody(palette, p); body.updateMatrixWorld(true); return body; };
const box = (body, name) => new THREE.Box3().setFromObject(body.getObjectByName(name));

test('full body adds B32-B58 to the unchanged Bastion upper body', () => {
  const body = build(), upper = buildShoulderStudy(palette);
  const parts = { ...SHOULDER_STUDY_PARTS, ...FULL_BODY_PARTS };
  assert.equal(body.name, 'FullBodyStudy');
  assert.deepEqual(body.children.map(m => m.userData.partId).sort(), Object.keys(parts).sort());
  assert.equal(Object.keys(parts).length, 58);
  for (const mesh of body.children) {
    assert.equal(mesh.name, parts[mesh.userData.partId]);
    assert.ok(Object.values(palette).includes(mesh.material));
  }
  for (const mesh of upper.children) assert.deepEqual(body.getObjectByName(mesh.name).geometry.attributes.position.array,
    mesh.geometry.attributes.position.array, `${mesh.name} changed`);
  assert.equal(resolveAssemblyOptions({ body: 'full' }).body, 'full');
});

test('new full-body parts are closed, outward, nondegenerate solids', () => {
  const key = p => p.toArray().map(v => Math.round(v * 1e6)).join(',');
  for (const mesh of build().children.filter(m => FULL_BODY_PARTS[m.userData.partId])) {
    const p = mesh.geometry.attributes.position, edges = new Map(), directions = new Map();
    let volume = 0;
    for (let i = 0; i < p.count; i += 3) {
      const [a, b, c] = [0, 1, 2].map(k => new THREE.Vector3().fromBufferAttribute(p, i + k));
      assert.ok(b.clone().sub(a).cross(c.clone().sub(a)).length() > 1e-10, `${mesh.name}: degenerate face`);
      volume += a.dot(b.clone().cross(c)) / 6;
      for (const [u, v] of [[a, b], [b, c], [c, a]]) {
        const pair = [key(u), key(v)].sort().join('|');
        edges.set(pair, (edges.get(pair) ?? 0) + 1);
        directions.set(pair, (directions.get(pair) ?? 0) + (key(u) < key(v) ? 1 : -1));
      }
    }
    assert.ok(volume > 1e-6, `${mesh.name}: volume ${volume}`);
    for (const [edge, count] of edges) assert.equal(count, 2, `${mesh.name}: open edge ${edge}`);
    for (const [edge, direction] of directions) assert.equal(direction, 0, `${mesh.name}: winding ${edge}`);
    assert.ok(mesh.geometry.attributes.uv.array.every(Number.isFinite), `${mesh.name}: uv`);
  }
});

test('limb chains stay connected, mirrored and standing on one ground plane', () => {
  const body = build();
  const chains = [['ShoulderJoint', 'UpperArm', 'Elbow', 'Forearm', 'Hand'], ['PelvisCore', 'HipJoint', 'Thigh', 'Knee', 'Shin', 'Foot']];
  for (const suffix of ['R', 'L']) for (const chain of chains) for (let i = 0; i < chain.length - 1; i++) {
    const name = n => n === 'PelvisCore' ? n : `${n}_${suffix}`, a = box(body, name(chain[i])), b = box(body, name(chain[i + 1]));
    assert.ok(a.intersectsBox(b), `${name(chain[i])} must touch ${name(chain[i + 1])}`);
  }
  for (const id of Object.keys(FULL_BODY_PARTS).filter(id => FULL_BODY_PARTS[id].endsWith('_R'))) {
    const a = box(body, FULL_BODY_PARTS[id]), b = box(body, FULL_BODY_PARTS[id].replace(/_R$/, '_L'));
    for (const axis of ['y', 'z']) { assert.ok(Math.abs(a.min[axis] - b.min[axis]) < 1e-6); assert.ok(Math.abs(a.max[axis] - b.max[axis]) < 1e-6); }
    assert.ok(Math.abs(a.min.x + b.max.x) < 1e-6 && Math.abs(a.max.x + b.min.x) < 1e-6, `${id} mirrored`);
  }
  const all = new THREE.Box3().setFromObject(body), feet = ['Foot_R', 'Foot_L'].map(n => box(body, n));
  assert.equal(feet[0].min.y, all.min.y); assert.equal(feet[1].min.y, all.min.y);
  // Height from the helmet top (about Y=0.40) to the sole: roughly 6.5 helmet heights of 0.81.
  assert.ok(all.min.y < -4.7 && all.min.y > -5.1, `sole ${all.min.y}`);
  assert.ok(box(body, 'Thigh_R').max.x < 0 && box(body, 'Thigh_L').min.x > 0, 'legs stay apart');
});

test('proportions: hands hang at mid-thigh beside the hips, waist narrower than chest and belt', () => {
  const body = build(), hand = box(body, 'Hand_L'), thigh = box(body, 'Thigh_L'), knee = box(body, 'Knee_L');
  // Fingertips end on the lower thigh: above the knee joint (current margin about 0.11) and well below the hip joint.
  assert.ok(hand.min.y > knee.max.y + .05 && hand.min.y < thigh.max.y - .4, `hand ${hand.min.y} knee ${knee.max.y}`);
  for (const plate of ['HipPlate_L', 'Thigh_L']) assert.ok(box(body, 'Forearm_L').min.x > box(body, plate).max.x + .02, `arm clears ${plate}`);
  const width = name => box(body, name).max.x - box(body, name).min.x;
  assert.ok(width('AbdomenLame_3') < width('WaistBelt') && width('WaistBelt') < width('BreastplateCenter') + width('FlankArmor_L') * 2);
  const all = new THREE.Box3().setFromObject(body);
  assert.ok(all.max.x - all.min.x < 2.2, 'arms hang inside the shoulder width');
});

test('full-body parameters drive only their parts; exploded view keeps every part with chain offsets', () => {
  const a = build(), longer = structuredClone(fullBodyParams);
  longer.leg.shin = longer.leg.shin.map(([y, ...rest], i) => [i ? y - .1 : y, ...rest]);
  const b = build(longer), changed = a.children.filter(m => b.getObjectByName(m.name).geometry.attributes.position.array
    .some((v, i) => v !== m.geometry.attributes.position.array[i])).map(m => m.name).sort();
  assert.deepEqual(changed, ['Shin_L', 'Shin_R'], 'a shin edit changes exactly the two shins');
  assert.ok(Math.abs(box(b, 'Shin_L').min.y - box(a, 'Shin_L').min.y + .1) < 1e-6);
  assert.throws(() => build({ ...fullBodyParams, waist: { ...fullBodyParams.waist, lamellae: [...fullBodyParams.waist.lamellae, fullBodyParams.waist.lamellae[0]] } }));
  const root = new THREE.Group(); root.name = 'SciFiHelmet'; root.add(a);
  const entries = assemblyInventory(root), exploded = createExplodedAssembly(root, 1);
  assert.equal(exploded.children.length, entries.length);
  const offset = id => exploded.children.find(m => m.userData.partId === id).userData.explosionOffset;
  assert.ok(offset('B57')[1] < offset('B55')[1] && offset('B55')[1] < offset('B49')[1], 'leg parts separate downward');
  assert.ok(offset('B46')[0] > offset('B44')[0] && offset('B44')[0] > offset('B40')[0], 'arm parts separate outward');
  assert.equal(Math.sign(offset('B45')[0]), -1);
  for (const id of Object.keys(FULL_BODY_PARTS)) assert.ok(entries.some(e => e.id === id && e.label && !e.label.includes('_')), id);
});

test('the full-body presentation replaces the helmet neck core like the shoulder study', () => {
  const helmet = new THREE.Group(), neck = new THREE.Group(); neck.name = 'Neck'; helmet.add(neck);
  configureHelmetAssembly(helmet, resolveAssemblyOptions({ body: 'full' }));
  assert.equal(helmet.getObjectByName('Neck'), undefined);
  const kept = new THREE.Group(), neck2 = new THREE.Group(); neck2.name = 'Neck'; kept.add(neck2);
  configureHelmetAssembly(kept, resolveAssemblyOptions({ body: 'none' }));
  assert.ok(kept.getObjectByName('Neck'));
});
