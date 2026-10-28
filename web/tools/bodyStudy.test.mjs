import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { buildBodyStudy } from '../src/parts/bodyStudy.js';

test('body study keeps separately editable, uniquely named geometry', () => {
  const materials = new Proxy({}, { get: () => new THREE.MeshBasicMaterial() });
  const body = buildBodyStudy(materials);
  const expected = ['Torso_Core', 'Neck_Connector', 'Chest_Armor', 'Back_Armor', 'Chest_Center', 'Abdomen_Armor', 'Pelvis_Armor',
    'Shoulder_R', 'Shoulder_L', 'ShoulderJoint_R', 'ShoulderJoint_L', 'Hip_R', 'Hip_L'];
  assert.deepEqual([...body.children.map(part => part.name)].sort(), expected.sort());
  assert.equal(new Set(body.children.map(part => part.geometry)).size, expected.length);
  for (const part of body.children) {
    assert.ok(part.isMesh && part.geometry.attributes.position.array.every(Number.isFinite), part.name);
    part.geometry.dispose();
    part.material.dispose();
  }
});
