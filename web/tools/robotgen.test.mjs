// Building blocks of the three.js body generator (web/src/robotgen, 0.14–0.19): bevels as geometry, mesh defect count, cut
// retries and the cut stage table, closed helmet masks. Since 0.19 the built bodies are checked against their own delivery package
// (robotgen_form.test.mjs: part list, segments, boxes, closure, normals, determinism); the frozen Blender reference and the Python
// dump of the pinned Ballon commit are an optional report (node tools/robotgen_reference.mjs), so the bodies can be reshaped.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { robotSpec } from '../src/robotgen/robot.js';
import { buildRobotBody } from '../src/robotgen/index.js';
import { partGeometry, meshDefects, firstClosed, CUT_RETRIES } from '../src/robotgen/mesh.js';
import CUT_STAGES from '../src/robotgen/cutStages.json' with { type: 'json' };

const NAMES = ['waechter', 'paladin', 'mechanik'];

function near(a, b, path, tol = 1e-6) {
  if (typeof a === 'number') return assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(a)), `${path}: ${a} ≠ ${b}`);
  if (Array.isArray(a)) { assert.equal(a.length, b.length, `${path}: length`); return a.forEach((v, i) => near(v, b[i], `${path}/${i}`, tol)); }
  assert.equal(a, b, path);
}

for (const name of NAMES) {
  test(`${name}: cut stage table – listed parts close at their stage at once, all others at stage 0 (on the table's platform)`, t => {
    const warn = console.warn;
    console.warn = () => {};
    const built = buildRobotBody(name);
    console.warn = warn;
    const table = CUT_STAGES.stages[name] ?? {}, used = Object.fromEntries(Object.entries(built.stages).filter(([, k]) => k > 0));
    for (const key of Object.keys(table)) assert.ok(key in built.stages, `${key}: listed in cutStages.json but not a part with cuts`);
    if (CUT_STAGES.platform.startsWith(`${process.platform}-${process.arch} `)) assert.deepEqual(used, table, 'cut stages differ: node tools/robotgen_cut_stages.mjs');
    else t.diagnostic(`table written on ${CUT_STAGES.platform}; here ${JSON.stringify(used)}, table ${JSON.stringify(table)}`);
  });
}

test('bevel is geometry: a bevelled box has more triangles than a cube and keeps its size', () => {
  const g = partGeometry('box', { d: [40, 20, 10], c: [0, 0, 0], bevel: 2 });
  assert.ok(g.attributes.position.count / 3 > 12);
  g.computeBoundingBox();
  near(g.boundingBox.max.toArray(), [0.02, 0.01, 0.005], 'box', 1e-6);
});

test('mesh defects: a closed box has none, a missing triangle opens it, a flipped normal faces backwards', () => {
  const box = () => new THREE.BoxGeometry(0.04, 0.02, 0.01).toNonIndexed();
  assert.equal(meshDefects(box()), 0);
  const open = box();
  open.setAttribute('position', new THREE.BufferAttribute(open.attributes.position.array.slice(9), 3));
  open.setAttribute('normal', new THREE.BufferAttribute(open.attributes.normal.array.slice(9), 3));
  assert.equal(meshDefects(open), 3);
  const flipped = box();
  for (let i = 0; i < 9; i++) flipped.attributes.normal.array[i] *= -1;
  assert.equal(meshDefects(flipped), 1);
});

test('cut retry: the stage from the table first, then the search without it', () => {
  const calls = [], build = k => (calls.push(k), k);
  assert.equal(firstClosed(build, k => (k === 5 ? 0 : 1), CUT_RETRIES, 5), 5);
  assert.deepEqual(calls, [5]);                                 // table stage closes: cut once
  calls.length = 0;
  assert.equal(firstClosed(build, k => (k < 3 || k === 5 ? 1 : 0), CUT_RETRIES, 5), 3);
  assert.deepEqual(calls, [5, 0, 1, 2, 3]);                     // table stage open (other platform): search from 0, skipping it
  calls.length = 0;
  assert.equal(firstClosed(build, () => 1, 4, 2), 4);
  assert.deepEqual(calls, [2, 0, 1, 3, 4]);                     // never closed: each stage once, up to the limit
});

test('cut retry: builds with growing cutters until one is closed, at most CUT_RETRIES repeats', () => {
  const calls = [], build = k => (calls.push(k), k);
  assert.equal(firstClosed(build, k => (k < 3 ? 1 : 0), CUT_RETRIES), 3);
  assert.deepEqual(calls, [0, 1, 2, 3]);
  calls.length = 0;
  assert.equal(firstClosed(build, () => 1, 4), 4);              // never closed: stops after the limit
  assert.deepEqual(calls, [0, 1, 2, 3, 4]);
  calls.length = 0;
  assert.equal(firstClosed(build, () => 0, CUT_RETRIES), 0);    // closed at once: no repeat
  assert.deepEqual(calls, [0]);
});

test('cut slivers: every helmet mask ends closed (CSG noise opens some first cuts, platform-dependent)', () => {
  let retried = 0;
  for (const name of NAMES) {
    const [, , , kind, , p] = robotSpec(name).parts.find(([, q]) => q[0] === 'mask')[1];
    if (meshDefects(partGeometry(kind, p, 1, 0))) retried++;
    assert.equal(meshDefects(partGeometry(kind, p, 1)), 0, `${name} mask`);
  }
  console.log(`masks with a repeated cut on this platform: ${retried} of ${NAMES.length}`);
});
