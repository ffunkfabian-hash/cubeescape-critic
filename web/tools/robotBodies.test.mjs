// Robot bodies 0.10: each Ballon study's GLB carries every manifest object with its assembly extras, every mesh hangs below a
// segment root with asm/side (the viewer's explosion moves only those roots), parts.json covers the manifest, anchors are closed.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ASSEMBLIES = ['head', 'arms', 'upper_body', 'lower_body', 'legs'];
const source = JSON.parse(readFileSync(new URL('../src/robotgen/data/SOURCE.json', import.meta.url)));

function glb(url) {
  const buf = readFileSync(url);
  assert.equal(buf.toString('ascii', 0, 4), 'glTF');
  const len = buf.readUInt32LE(12);
  assert.equal(buf.toString('ascii', 16, 20), 'JSON');
  return JSON.parse(buf.toString('utf8', 20, 20 + len));
}

for (const [name, study] of [['waechter', 'a_waechter'], ['paladin', 'b_paladin'], ['mechanik', 'c_mechanik']]) {
  const root = new URL(`../../assets/robot-bodies/${name}/`, import.meta.url);
  const manifest = JSON.parse(readFileSync(new URL('manifest.json', root)));
  const parts = JSON.parse(readFileSync(new URL('parts.json', root)));

  test(`${name}: manifest from the pinned Ballon commit, five assemblies, anchors closed`, () => {
    assert.equal(manifest.study, study);
    assert.equal(manifest.source.commit, source.commit);
    assert.deepEqual(parts.assemblies.map(a => a.id), ASSEMBLIES);
    for (const a of parts.assemblies) assert.equal(a.explode_mm.length, 3, a.id);
    assert.equal(Object.keys(manifest.anchor_gap_mm).length, 6);
    for (const [k, gap] of Object.entries(manifest.anchor_gap_mm)) assert.equal(gap, 0, k);
    assert.ok(manifest.measured.height_mm > 1600 && manifest.measured.height_mm < 1800, 'height ≈ 1.7 m');
  });

  test(`${name}: parts.json lists every manifest object once`, () => {
    const objects = parts.assemblies.flatMap(a => a.parts.flatMap(p => p.objects)).sort();
    assert.deepEqual(objects, manifest.objects.map(o => o.name).sort());
    assert.equal(objects.length, manifest.totals.objects);
  });

  test(`${name}.glb: one mesh node per object with extras, all below a segment root with asm/side`, () => {
    const g = glb(new URL(`assembled/${name}.glb`, root));
    const byName = Object.fromEntries(manifest.objects.map(o => [o.name, o]));
    const meshNodes = g.nodes.filter(n => n.mesh !== undefined);
    assert.deepEqual(meshNodes.map(n => n.name).sort(), Object.keys(byName).sort());
    for (const n of meshNodes) {
      const o = byName[n.name];
      assert.deepEqual([n.extras.asm, n.extras.part, n.extras.side, n.extras.part_de, n.extras.study], [o.asm, o.part, o.side, o.part_de, study]);
    }
    const parent = new Map();
    g.nodes.forEach((n, i) => (n.children ?? []).forEach(c => parent.set(c, i)));
    const roots = g.scenes[0].nodes;
    for (const r of roots) assert.ok(ASSEMBLIES.includes(g.nodes[r].extras?.asm), `root ${g.nodes[r].name} without asm`);
    g.nodes.forEach((n, i) => {
      if (n.mesh === undefined) return;
      let top = i;
      while (parent.has(top)) top = parent.get(top);
      assert.ok(roots.includes(top), `${n.name} not in the scene`);
      assert.equal(g.nodes[top].extras.asm, n.extras.asm, `${n.name} below a root of another assembly`);
    });
    // The viewer mirrors the explosion's x for side R (robot_build.explode): R roots must lie at −X, L roots at +X.
    for (const r of roots) {
      const { side } = g.nodes[r].extras, x = g.nodes[r].translation?.[0] ?? 0;
      if (side === 'R') assert.ok(x < 0, `${g.nodes[r].name} x ${x}`);
      if (side === 'L') assert.ok(x > 0, `${g.nodes[r].name} x ${x}`);
    }
  });
}
