// Shoulders as their own assembly in the viewer (0.17, robotShoulders.js): on every generated body the pauldrons, shoulder discs,
// axles, pistons and shoulder balls move to SHOULDER_R/L without changing their world position or atlas key, the parts index
// lists them under 'shoulders' (before the arms) and nowhere else, and the explosion offset lies between upper body and arms.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { buildRobotBody } from '../src/robotgen/index.js';
import { separateShoulders, shoulderSide, SHOULDERS } from '../src/robotShoulders.js';
import { skinMeshes } from '../src/skinAtlas.js';

test('shoulder side from the Ballon names, other parts none', () => {
  assert.deepEqual(['pauldron_r', 'pauldron_l_flare2_rim_a', 'shoulder_r_med_hub', 'shoulder_piston_l_rod', 'arm_R_shoulder_ball', 'arm_L_upper', 'pauldronx', 'chest'].map(shoulderSide),
    ['R', 'L', 'R', 'L', 'R', null, null, null]);
});

for (const name of ['waechter', 'paladin', 'mechanik']) {
  test(`${name}: shoulders apart from upper body and arms, same world positions and atlas keys`, () => {
    console.warn = () => {};
    const { scene, parts } = buildRobotBody(name);
    scene.updateMatrixWorld(true);
    const before = new Map(skinMeshes(scene).map(({ mesh, key }) => [mesh, { key, world: mesh.matrixWorld.clone() }]));
    const index = separateShoulders(scene, parts);
    scene.updateMatrixWorld(true);
    const moved = [];
    scene.traverse(o => { if (o.isMesh && o.userData.assembly === 'shoulders') moved.push(o); });
    assert.ok(moved.length >= 16, `${moved.length} shoulder meshes`);
    for (const o of moved) assert.equal(o.parent.name, `SHOULDER_${shoulderSide(o.name)}`, o.name);
    const after = new Map(skinMeshes(scene).map(({ mesh, key }) => [mesh, key]));
    for (const [mesh, b] of before) {
      assert.equal(after.get(mesh), b.key, `${mesh.name}: atlas key`);
      assert.ok(mesh.matrixWorld.elements.every((v, i) => Math.abs(v - b.world.elements[i]) < 1e-6), `${mesh.name}: moved`);
    }
    assert.deepEqual(index.assemblies.map(a => a.id), ['head', 'shoulders', 'arms', 'upper_body', 'lower_body', 'legs']);
    const listed = a => index.assemblies.find(x => x.id === a).parts.flatMap(p => p.objects);
    assert.deepEqual(listed('shoulders').sort(), moved.map(o => o.name).sort());
    for (const a of ['arms', 'upper_body']) assert.ok(!listed(a).some(n => shoulderSide(n)), `${a} still lists shoulder parts`);
    assert.equal(index.assemblies.flatMap(a => a.parts.flatMap(p => p.objects)).length, parts.assemblies.flatMap(a => a.parts.flatMap(p => p.objects)).length);
    const arms = parts.assemblies.find(a => a.id === 'arms').explode_mm[0];
    assert.ok(SHOULDERS.explode_mm[0] > 0 && SHOULDERS.explode_mm[0] < arms);
  });
}
