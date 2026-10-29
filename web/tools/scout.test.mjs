// Scout 0.8 delivery: both GLBs carry every manifest object with its part ID, and the parts cover S01–S13.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../../assets/helmet-scout/', import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('manifest.json', root)));
const parts = JSON.parse(readFileSync(new URL('parts.json', root))).parts;

function glbNodes(file) {
  const buf = readFileSync(new URL(file, root));
  assert.equal(buf.toString('ascii', 0, 4), 'glTF');
  const len = buf.readUInt32LE(12);
  assert.equal(buf.toString('ascii', 16, 20), 'JSON');
  return JSON.parse(buf.toString('utf8', 20, 20 + len)).nodes;
}

test('parts cover S01–S13 and every manifest object once', () => {
  const ids = new Set(parts.map(p => p.id));
  for (let i = 1; i <= 13; i++) assert.ok(ids.has(`S${String(i).padStart(2, '0')}`), `S${i} missing`);
  const objects = parts.flatMap(p => p.objects).sort();
  assert.deepEqual(objects, manifest.objects.map(o => o.name).sort());
  assert.equal(manifest.count, 44);
});

for (const file of ['assembled/scout.glb', 'exploded/scout_exploded.glb']) {
  test(`${file}: one node per object with part extras`, () => {
    const nodes = glbNodes(file).filter(n => n.extras?.source_object);
    assert.deepEqual(nodes.map(n => n.extras.source_object).sort(), manifest.objects.map(o => o.name).sort());
    const byObject = Object.fromEntries(manifest.objects.map(o => [o.name, o.part]));
    for (const n of nodes) assert.equal(n.extras.part_label, byObject[n.extras.source_object]);
  });
}
