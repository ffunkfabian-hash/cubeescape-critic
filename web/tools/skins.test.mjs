// Skins 0.13: the baked atlases (assets/skins/<model>) fit their mesh sources, the remap rebuilds every triangle, charts do not
// overlap, the maps match the atlas; recipe selection, PNG and xatlas helpers behave.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { readAtlas, skinMeshes, geometrySignature, sameSignature, skinGeometry, transferGeometry, encodeEdge, decodeEdge, ATLAS_FORMAT } from '../src/skinAtlas.js';
import { skinLayerMask, skinGLSL } from '../src/skinShader.js';
import { encodePNG, decodePNG } from './skinPng.mjs';
import { buildAtlas, weld } from './skinXatlas.mjs';

const web = path.dirname(path.dirname(fileURLToPath(import.meta.url))), repo = path.dirname(web);
const RECIPES = JSON.parse(readFileSync(path.join(web, 'src', 'skins.json'), 'utf8'));
const atlas = name => {
  const dir = path.join(repo, 'assets', 'skins', name), json = JSON.parse(readFileSync(path.join(dir, 'atlas.json'), 'utf8'));
  const bin = readFileSync(path.join(dir, json.bin));
  return { dir, ...readAtlas(json, bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength)) };
};
async function glbScene(file) {
  const buf = readFileSync(file);
  return (await new GLTFLoader().parseAsync(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), '')).scene;
}

// every mesh has an entry of its signature; the remapped geometry has the same triangles (positions per corner)
function checkRemap(root, a) {
  let corners = 0;
  for (const { mesh, key } of skinMeshes(root)) {
    const entry = a.entries.get(key)?.find(e => sameSignature(e.sig, geometrySignature(mesh.geometry)));
    assert.ok(entry, `${a.model}: no atlas entry for ${key}`);
    const g = skinGeometry(mesh.geometry, entry), P = mesh.geometry.attributes.position, Q = g.attributes.position;
    const I = mesh.geometry.index?.array ?? [...Array(P.count).keys()], J = g.index.array;
    assert.equal(J.length, I.length, key);
    for (let c = 0; c < I.length; c++) for (let k = 0; k < 3; k++) assert.equal(Q.getComponent(J[c], k), P.getComponent(I[c], k), `${key} corner ${c}`);
    corners += I.length;
  }
  return corners;
}

// charts of one atlas must not overlap: rasterised UV area ≈ number of covered texel centres
function overlap(a, R = 1024) {
  const cov = new Uint8Array(R * R);
  let area = 0;
  for (const list of a.entries.values()) for (const e of list) {
    for (let t = 0; t < e.index.length; t += 3) {
      const c = [e.index[t], e.index[t + 1], e.index[t + 2]], x = c.map(i => e.uv[2 * i] / 65535 * R), y = c.map(i => e.uv[2 * i + 1] / 65535 * R);
      const d = (x[1] - x[0]) * (y[2] - y[0]) - (x[2] - x[0]) * (y[1] - y[0]);
      area += Math.abs(d) / 2;
      if (Math.abs(d) < 1e-12) continue;
      for (let py = Math.max(0, Math.floor(Math.min(...y))); py <= Math.min(R - 1, Math.ceil(Math.max(...y))); py++)
        for (let px = Math.max(0, Math.floor(Math.min(...x))); px <= Math.min(R - 1, Math.ceil(Math.max(...x))); px++) {
          const cx = px + 0.5, cy = py + 0.5, w1 = ((cx - x[0]) * (y[2] - y[0]) - (x[2] - x[0]) * (cy - y[0])) / d, w2 = ((x[1] - x[0]) * (cy - y[0]) - (cx - x[0]) * (y[1] - y[0])) / d;
          if (w1 >= 0 && w2 >= 0 && w1 + w2 <= 1) cov[py * R + px] = 1;
        }
    }
  }
  return 1 - cov.reduce((s, v) => s + v, 0) / area;
}

for (const name of ['waechter', 'paladin', 'mechanik', 'scout']) {
  const file = name === 'scout' ? path.join(repo, 'assets', 'helmet-scout', 'assembled', 'scout.glb') : path.join(repo, 'assets', 'robot-bodies', name, 'assembled', `${name}.glb`);
  test(`${name}: atlas covers every GLB mesh and rebuilds its triangles`, async () => {
    assert.ok(existsSync(path.join(repo, 'assets', 'skins', name, 'atlas.json')), `no atlas for ${name}: node tools/skin_bake.mjs --model ${name}`);
    const a = atlas(name);
    assert.equal(a.format, ATLAS_FORMAT);
    assert.equal(a.source, path.relative(repo, file));
    const corners = checkRemap(await glbScene(file), a);
    assert.ok(corners > 1e5, `${corners} corners`);
    assert.ok(a.coverage > 0.4, `coverage ${a.coverage}`);
    assert.deepEqual(a.edges, RECIPES.edges, 'edge parameters changed in skins.json: bake again');
    assert.equal(a.ao.distanceMm, RECIPES.ao.distanceMm, 'AO distance changed in skins.json: bake again');
    const png = decodePNG(readFileSync(path.join(a.dir, a.maps)));
    assert.deepEqual([png.width, png.height, png.channels], [a.size, a.size, 3]);
    assert.ok(overlap(a) < 0.01, 'charts overlap');
  });
}

let vite;
before(async () => {
  const { createServer } = await import('vite');
  vite = await createServer({ root: web, logLevel: 'error', server: { middlewareMode: true, hmr: false } });
});
after(() => vite?.close());

test('critic: atlas covers Helm H with and without forehead strips, on a robot and alone', async () => {
  const a = atlas('critic');
  const { buildHelmet } = await vite.ssrLoadModule('/src/helmet.js');
  const { configureHelmetAssembly } = await vite.ssrLoadModule('/src/assembly.js');
  const { D } = await vite.ssrLoadModule('/src/params.js');
  const M = new Proxy({}, { get: (_, n) => typeof n === 'string' ? new THREE.MeshStandardMaterial({ name: n }) : undefined });
  const warn = console.warn;
  console.warn = (...x) => { if (!String(x[0]).includes('deprecated')) warn(...x); };
  try {
    for (const [strips, neck] of [['on', true], ['off', false], ['on', false]]) {
      const keep = D.foreheadPlates.enabled;
      D.foreheadPlates.enabled = strips === 'on';
      let root;
      try { root = buildHelmet(M); } finally { D.foreheadPlates.enabled = keep; }
      configureHelmetAssembly(root, { headset: 'on', ...(neck ? {} : { neck: false }) });
      assert.ok(checkRemap(root, a) > 1e5);
    }
  } finally { console.warn = warn; }
  assert.ok(overlap(a) < 0.01, 'charts overlap');
});

test('critic: a slightly different triangulation takes the baked UVs (transferGeometry)', async () => {
  const a = atlas('critic');
  const entry = [...a.entries.values()].flat().find(e => e.pos && e.corners > 900);
  assert.ok(entry, 'Helm H entries keep their baked positions');
  // the baked mesh itself, non-indexed, with its last triangle dropped (as another engine's CSG might)
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(entry.pos, 3));
  g.setIndex(new THREE.BufferAttribute(entry.index, 1));
  const cut = g.toNonIndexed();
  cut.setAttribute('position', new THREE.BufferAttribute(cut.attributes.position.array.slice(0, -9), 3));
  const t = transferGeometry(cut, entry), uv = t.attributes.uv.array;
  let worst = 0;
  const tri = new THREE.Triangle(), v = k => new THREE.Vector3().fromArray(entry.pos, 3 * entry.index[k]);
  for (let c = 0; c < entry.index.length - 3; c++) {
    if (tri.set(v(c - c % 3), v(c - c % 3 + 1), v(c - c % 3 + 2)).getArea() < 1e-10) continue; // zero-area triangles carry no UV
    for (let d = 0; d < 2; d++) worst = Math.max(worst, Math.abs(uv[2 * c + d] - entry.uv[2 * entry.index[c] + d] / 65535));
  }
  assert.ok(worst < 1e-4, `UV error ${worst}`);
  assert.ok(t.attributes.skinPos && t.attributes.skinNor);
});

test('GLB stand-in of a mesh without atlas: the fill layers that select it', async () => {
  const { flatSkinMaterial } = await vite.ssrLoadModule('/src/robotSkins.js');
  const hex = m => '#' + m.color.getHexString(THREE.SRGBColorSpace).toUpperCase();
  assert.equal(hex(flatSkinMaterial('rost', { role: 'rubber', part: 'sole', asm: 'legs', side: 'L' })), '#141619');
  assert.equal(hex(flatSkinMaterial('ornat', { role: 'shell', part: 'cap', asm: 'head', side: 'C' })), '#D9AE4C');
  const lamp = flatSkinMaterial('glut', { role: 'energy', part: 'chest_light_l_lamp', asm: 'upper_body', side: 'L' });
  assert.ok(lamp.emissiveIntensity >= 1 && lamp.emissive.r > 0.5, 'energy glows');
});

test('recipes: layer masks follow roles, parts (glob) and assembly; GLSL for every recipe', () => {
  const r = RECIPES.skins.rost;
  const mask = d => skinLayerMask(r, d).toString(2).padStart(r.layers.length, '0').split('').reverse().join('');
  const shell = mask({ role: 'shell', part: 'pauldron_l', asm: 'upper_body', side: 'L' });
  const rubber = mask({ role: 'rubber', part: 'sole', asm: 'legs', side: 'L' });
  const edge = mask({ role: 'shell', part: 'pauldron_l_edge', asm: 'upper_body', side: 'L' });
  r.layers.forEach((L, i) => {
    if (L.type === 'stripes') { assert.equal(shell[i], '1'); assert.equal(edge[i], '0', 'not_parts *_edge'); }
    if (L.roles?.includes('rubber')) assert.equal(rubber[i], '1');
    if (L.not_roles?.includes('rubber')) assert.equal(rubber[i], '0');
  });
  for (const [key, recipe] of Object.entries(RECIPES.skins)) {
    const glsl = skinGLSL(recipe);
    assert.equal((glsl.match(/if \(skinOn\(mask, \d+\)\)/g) ?? []).length, recipe.layers.length, key);
    assert.doesNotMatch(glsl, /NaN|undefined/, key);
  }
});

test('edge code: sqrt steps, fine near the edge', () => {
  for (const mm of [0, 0.5, 5, 16, 28, 63]) assert.ok(Math.abs(decodeEdge(encodeEdge(mm)) - mm) < Math.max(0.1, mm * 0.03), `${mm} mm`);
  assert.ok(decodeEdge(encodeEdge(5) + 1) - decodeEdge(encodeEdge(5)) < 0.2);
});

test('PNG writer: round trip and same bytes for the same pixels', () => {
  const px = Uint8Array.from({ length: 37 * 23 * 3 }, (_, i) => (i * 7919) & 255);
  const a = encodePNG(37, 23, 3, px), b = encodePNG(37, 23, 3, px);
  assert.deepEqual(a, b);
  assert.deepEqual(decodePNG(a).pixels, px);
});

test('xatlas: welding keeps hard edges apart, atlas is deterministic and covers a box', async () => {
  const box = new THREE.BoxGeometry(0.2, 0.1, 0.05, 2, 2, 2);
  const w = weld(box.attributes.position.array, box.index.array, box.attributes.normal.array);
  const loose = weld(box.attributes.position.array, box.index.array);
  assert.equal(w.count, box.attributes.position.count, 'faces of a box keep their own vertices');
  assert.ok(loose.count < w.count, 'positions alone weld the corners');
  const run = () => buildAtlas([{ position: box.attributes.position.array, normal: box.attributes.normal.array, index: box.index.array }], { resolution: 256, padding: 2 });
  const [x, y] = [await run(), await run()];
  assert.deepEqual(x.meshes[0].uv, y.meshes[0].uv);
  assert.equal(x.meshes[0].corner.length, box.index.count);
  assert.ok(Math.max(x.width, x.height) <= 256);
});
