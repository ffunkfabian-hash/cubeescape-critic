import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { boxProjectUV, denoiseTexture } from '../src/textures.js';

test('ambient-occlusion denoising is reproducible without altering global random state', () => {
  const random = Math.random;
  const first = denoiseTexture(47), repeated = denoiseTexture(47), other = denoiseTexture(48);
  assert.deepEqual(first.image.data, repeated.image.data);
  assert.notDeepEqual(first.image.data, other.image.data);
  assert.equal(Math.random, random);
  for (const texture of [first, repeated, other]) texture.dispose();
});

test('UV projection stays consistent within triangles despite varying vertex normals', () => {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([1,0,0, 1,1,0, 1,0,1], 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute([1,0,0, 0,1,0, 0,0,1], 3));
  geometry.setIndex([0,1,2]);
  const positions = [...geometry.attributes.position.array];
  assert.equal(boxProjectUV(geometry, 2), geometry);
  assert.equal(geometry.index, null);
  assert.deepEqual([...geometry.attributes.uv.array], [0,0, 0,2, 2,0]);
  assert.deepEqual([...geometry.attributes.position.array], positions);
  assert.deepEqual([...geometry.attributes.normal.array], [1,0,0, 0,1,0, 0,0,1]);
  geometry.dispose();
});
