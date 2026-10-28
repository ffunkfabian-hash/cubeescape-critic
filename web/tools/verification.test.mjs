import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectGLB, subprocessExitCode } from './verification.mjs';

function modelGLB() {
  const data = JSON.stringify({ asset: { version: '2.0' }, scenes: [{ nodes: [0] }], nodes: [{ mesh: 0 }],
    meshes: [{ primitives: [{ attributes: { POSITION: 0 }, material: 0 }] }],
    accessors: [{ type: 'VEC3', count: 3 }], materials: [{ name: 'armor' }] });
  const json = Buffer.from(data.padEnd(Math.ceil(data.length / 4) * 4, ' '));
  const bytes = Buffer.alloc(20 + json.length);
  bytes.writeUInt32LE(0x46546c67, 0); bytes.writeUInt32LE(2, 4); bytes.writeUInt32LE(bytes.length, 8);
  bytes.writeUInt32LE(json.length, 12); bytes.writeUInt32LE(0x4e4f534a, 16); json.copy(bytes, 20);
  return bytes;
}

test('process launch failures and signals cannot pass as exit zero', () => {
  assert.equal(subprocessExitCode({ status: 0 }), 0);
  assert.equal(subprocessExitCode({ status: 7 }), 7);
  assert.equal(subprocessExitCode({ status: null, error: new Error('ENOENT') }), 1);
  assert.equal(subprocessExitCode({ status: null, signal: 'SIGTERM' }), 1);
  assert.equal(subprocessExitCode({ status: null }), 1);
});

test('GLB smoke inspection reads the model and its materials', () => {
  const result = inspectGLB(modelGLB());
  assert.equal(result.meshes, 1);
  assert.equal(result.materials, 1);
});

test('GLB inspection rejects truncated and mislabeled downloads', () => {
  const bytes = modelGLB();
  assert.throws(() => inspectGLB(bytes.subarray(0, bytes.length - 4)), /Truncated/);
  assert.throws(() => inspectGLB(Buffer.from('<html>download error</html>')), /magic/);
  bytes.writeUInt32LE(bytes.length * 2, 12);
  assert.throws(() => inspectGLB(bytes), /chunk size/);
});
