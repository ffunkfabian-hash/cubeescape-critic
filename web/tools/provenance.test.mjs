import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { sourceManifest } from './provenance.mjs';

test('manifest detects source and authoritative reference changes, excluding generated output', () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'critic-manifest-'));
  const root = path.join(directory, 'web');
  try {
    for (const folder of ['src', 'refs', 'tools', 'renders', '../reference/helm']) mkdirSync(path.join(root, folder), { recursive: true });
    for (const file of ['index.html', 'package.json', 'package-lock.json', 'requirements.txt', 'verify_renders.mjs', '.nvmrc', '../reference/helm/turnaround.mp4', 'src/model.js']) writeFileSync(path.join(root, file), file);
    const initial = sourceManifest(root);
    assert.deepEqual(sourceManifest(root), initial);
    writeFileSync(path.join(root, 'renders/output.png'), 'output');
    assert.deepEqual(sourceManifest(root), initial);
    writeFileSync(path.join(root, 'src/model.js'), 'changed model');
    const changed = sourceManifest(root);
    assert.notEqual(changed.digest, initial.digest);
    writeFileSync(path.join(root, '../reference/helm/turnaround.mp4'), 'different video');
    assert.notEqual(sourceManifest(root).digest, changed.digest);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
