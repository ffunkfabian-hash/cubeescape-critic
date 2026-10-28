import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, rmSync, realpathSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';

function fixture() {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'critic-runner-'));
  const root = path.join(directory, 'web');
  const put = (name, value) => {
    const file = path.join(root, name); mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value));
  };
  for (const file of ['verify_renders.mjs', 'src/finishPresets.js', 'tools/provenance.mjs', 'tools/verification.mjs', 'tools/compare_reference.mjs']) {
    put(file, ''); copyFileSync(new URL('../' + file, import.meta.url), path.join(root, file));
  }
  return { directory, root, put };
}

for (const failure of ['missing-source', 'server-initialization']) {
  test(`verification overwrites old passed status on ${failure}`, () => {
    const f = fixture();
    try {
      f.put('renders/verification.json', { status: 'passed', old: true });
      if (failure === 'server-initialization') {
        for (const file of ['src/model.js', 'refs/example.png', 'index.html', 'package.json', 'package-lock.json', 'requirements.txt', '.nvmrc', '../reference/helm/turnaround.mp4']) f.put(file, '{}');
        for (const name of ['three', 'three-bvh-csg', 'three-mesh-bvh', 'vite', 'playwright']) {
          f.put(`node_modules/${name}/package.json`, { name, version: '0.0.0', type: 'module', main: 'index.js' });
        }
        f.put('node_modules/vite/index.js', 'export async function createServer(){throw new Error("fixture server failure")}');
        f.put('node_modules/playwright/index.js', 'export const chromium = {};');
      }
      const run = spawnSync(process.execPath, [path.join(f.root, 'verify_renders.mjs')], { timeout: 10000 });
      assert.equal(run.status, 1, run.stderr?.toString());
      const result = JSON.parse(readFileSync(path.join(f.root, 'renders/verification.json')));
      assert.equal(result.status, 'failed'); assert.equal(result.old, undefined);
      if (failure === 'server-initialization') assert.match(result.error, /fixture server failure/);
    } finally { rmSync(f.directory, { recursive: true, force: true }); }
  });
}

for (const failure of ['missing-file', 'wrong-hash']) {
  test(`reference comparison overwrites old passed status on ${failure}`, () => {
    const f = fixture();
    try {
      f.put('renders/reference/comparison.json', { status: 'passed', old: true });
      f.put('refs/meshy-reference.json', { sha256: 'incorrect' });
      if (failure === 'wrong-hash') f.put('example.glb', 'different reference');
      const run = spawnSync(process.execPath, [path.join(f.root, 'tools/compare_reference.mjs'), path.join(f.root, 'example.glb')], { timeout: 10000 });
      assert.equal(run.status, 1, run.stderr?.toString());
      const result = JSON.parse(readFileSync(path.join(f.root, 'renders/reference/comparison.json')));
      assert.equal(result.status, 'failed'); assert.equal(result.old, undefined);
      if (failure === 'wrong-hash') assert.match(result.error, /Reference hash does not match/);
    } finally { rmSync(f.directory, { recursive: true, force: true }); }
  });
}

test('verification rejects invalid arguments before starting the renderer or writing output', () => {
  const f = fixture();
  try {
    for (const args of [['--finish=chrome'], ['--finish='], ['--finish'], ['--out='],
      ['--out', '--no-iou'], ['--unknown'], ['--finish=metal', '--finish=graphite'],
      ['--accents=white'], ['--accents=contrast'], ['--accents='], ['--accents'], ['--accents=white-strips', '--accents=original']]) {
      const run = spawnSync(process.execPath, [path.join(f.root, 'verify_renders.mjs'), ...args], { timeout: 10000 });
      assert.equal(run.status, 1, run.stderr?.toString());
      assert.match(run.stderr.toString(), /Unknown finish|Unknown accents|Missing value|Unknown argument|Duplicate argument/);
    }
    assert.equal(existsSync(path.join(f.root, 'renders')), false);
  } finally { rmSync(f.directory, { recursive: true, force: true }); }
});

test('verification records selected preset and failure in its separate output directory', () => {
  const f = fixture();
  try {
    f.put('renders/verification.json', { status: 'passed', original: true });
    const run = spawnSync(process.execPath, [path.join(f.root, 'verify_renders.mjs'), '--finish=metal', '--accents=light-fasteners', '--out=variants/metal', '--no-iou'], { timeout: 10000 });
    assert.equal(run.status, 1, run.stderr?.toString());
    const result = JSON.parse(readFileSync(path.join(f.root, 'variants/metal/verification.json')));
    assert.equal(result.status, 'failed');
    assert.equal(result.finish.name, 'metal');
    assert.equal(result.finish.metalness, 0.55);
    assert.deepEqual(result.finish.textureSeeds, { normal: 73, roughness: 11 });
    assert.deepEqual(result.accents, { name: 'light-fasteners', lightFasteners: true, whiteStrips: false });
    assert.equal(result.iouSkipped, true);
    assert.equal(result.outputDirectory, realpathSync(path.join(f.root, 'variants/metal')));
    assert.equal(JSON.parse(readFileSync(path.join(f.root, 'renders/verification.json'))).original, true);
  } finally { rmSync(f.directory, { recursive: true, force: true }); }
});
