// Skins 0.13: the baked atlases (assets/skins/<model>) fit their mesh sources, the remap rebuilds every triangle, charts do not
// overlap, the maps match the atlas; recipe selection, PNG and xatlas helpers behave. 0.18: bodies and Scout have one atlas each,
// baked from the exported GLB of the three.js generator, that also covers the generator built live.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { readAtlas, skinMeshes, geometrySignature, sameSignature, closeSignature, skinGeometry, transferGeometry, encodeEdge, decodeEdge, ATLAS_FORMAT } from '../src/skinAtlas.js';
import { buildRobotBody } from '../src/robotgen/index.js';
import { robotSpec } from '../src/robotgen/robot.js';
import { buildScout, BSP_PARTS } from '../src/robotgen/scout.js';
import { packageFiles } from './robotgen_export.mjs';
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

// every mesh has an entry of its signature; the remapped geometry has the same triangles (positions per corner). With
// transfer (Helm H, built at runtime): a mesh whose CSG came out slightly different on this machine takes its UVs from the
// nearest baked triangles instead – all inside the atlas – and is counted in stats.transferred.
function checkRemap(root, a, stats = null) {
  let corners = 0;
  for (const { mesh, key } of skinMeshes(root)) {
    const sig = geometrySignature(mesh.geometry), entry = a.entries.get(key)?.find(e => sameSignature(e.sig, sig));
    const near = !entry && stats ? a.entries.get(key)?.find(e => e.pos && closeSignature(e.sig, sig)) : null;
    if (near) {
      const uv = transferGeometry(mesh.geometry, near).attributes.uv.array;
      assert.ok(uv.every(v => v > -0.01 && v < 1.01), `${key}: transferred UVs outside the atlas`);
      stats.transferred.push(key);
      corners += uv.length / 2;
      continue;
    }
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

// Bodies and Scout (0.18): one atlas each, baked from the GLB exported from the three.js generator (robotgen_export.mjs). It covers
// every mesh of that GLB exactly and every mesh of the generator built live (&gen=three); only parts made by CSG keep their baked
// positions, so a cut that comes out a few triangles different on another platform (Linux CI) takes the UVs of the nearest one.
const live = {
  waechter: () => buildRobotBody('waechter').scene, paladin: () => buildRobotBody('paladin').scene, mechanik: () => buildRobotBody('mechanik').scene,
  scout: async () => { const { readGussFile } = await import('./scoutGussNode.mjs'); return buildScout(await readGussFile()).scene; },
};
const csgParts = name => (name === 'scout' ? m => BSP_PARTS.includes(m.userData.source_object)
  : (cut => m => cut.has(`${m.userData.asm}:${m.userData.part}`))(new Set(robotSpec(name).parts.filter(([, p]) => p[5].cuts?.length).map(([a, p]) => `${a}:${p[0]}`))));
for (const name of Object.keys(live)) {
  const file = path.join(repo, packageFiles(name).glbs.assembled);
  test(`${name}: atlas covers every mesh of the exported GLB and of the live generator, baked positions only for CSG parts`, async () => {
    assert.ok(existsSync(path.join(repo, 'assets', 'skins', name, 'atlas.json')), `no atlas for ${name}: node tools/skin_bake.mjs --model ${name}`);
    const a = atlas(name);
    assert.equal(a.format, ATLAS_FORMAT);
    assert.equal(a.model, name);
    assert.equal(a.source, path.relative(repo, file));
    const glb = await glbScene(file);
    const corners = checkRemap(glb, a);
    assert.ok(corners > 1e5, `${corners} corners`);
    assert.equal(skinMeshes(glb).length, a.entries.size);
    const isCsg = csgParts(name), withPos = [...a.entries.values()].flat().filter(e => e.pos);
    assert.ok(withPos.length > 0, 'no baked positions');
    assert.deepEqual(withPos.map(e => e.key).sort(), skinMeshes(glb).filter(({ mesh }) => isCsg(mesh)).map(({ key }) => key).sort(), 'baked positions');
    const root = await live[name](), stats = { transferred: [] };
    assert.ok(checkRemap(root, a, stats) > 1e5);
    assert.ok(stats.transferred.every(k => withPos.some(e => e.key === k)), `transferred: ${stats.transferred.join(', ')}`);
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
  const stats = { transferred: [] };
  try {
    for (const [strips, neck] of [['on', true], ['off', false], ['on', false]]) {
      const keep = D.foreheadPlates.enabled;
      D.foreheadPlates.enabled = strips === 'on';
      let root;
      try { root = buildHelmet(M); } finally { D.foreheadPlates.enabled = keep; }
      configureHelmetAssembly(root, { headset: 'on', ...(neck ? {} : { neck: false }) });
      assert.ok(checkRemap(root, a, stats) > 1e5);
    }
  } finally { console.warn = warn; }
  // the bake machine reproduces every mesh; elsewhere (Linux CI, Chrome) single CSG parts may differ by a few triangles
  assert.ok(stats.transferred.length <= 3, `transferred: ${stats.transferred.join(', ')}`);
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

test('emblem anchor: the chest suns of Glut and Ornat are centred on the medallion part, not on the plate box', () => {
  for (const key of ['glut', 'ornat']) {
    const L = RECIPES.skins[key].layers.find(l => l.type === 'emblem');
    assert.equal(L.anchor, 'emblem_disc', key);
    assert.deepEqual(L.center, [0, 0], key);
    assert.match(skinGLSL(RECIPES.skins[key]), /pos\.x - vSkinAnchor\.x/, key);
  }
  assert.doesNotMatch(skinGLSL(RECIPES.skins.rost), /vSkinAnchor\.x/);
});

test('texture layers: every swatch and decal sheet of a recipe exists and has its sampler in the GLSL', () => {
  const dir = path.join(repo, 'assets', 'skins', 'textures');
  let used = 0;
  for (const [key, recipe] of Object.entries(RECIPES.skins)) {
    const glsl = skinGLSL(recipe);
    for (const L of recipe.layers.filter(l => l.type === 'tex' || l.type === 'decal')) {
      used++;
      assert.ok(['jpg', 'png'].some(e => existsSync(path.join(dir, `${L.texture}.${e}`))), `${key}: no texture ${L.texture}`);
      assert.match(glsl, new RegExp(`uniform sampler2D skinTex_${L.texture};`), key);
      if (L.type === 'decal') assert.equal(decodePNG(readFileSync(path.join(dir, `${L.texture}.png`))).channels, 4, `${L.texture}: decal sheet without alpha`);
    }
  }
  assert.ok(used >= 4, `${used} texture layers`);
});

test('kinds: helmet layers apply to Helm H and Scout only, body motifs not to helmets', () => {
  const r = RECIPES.skins.schrott, bit = (d, i) => Math.floor(skinLayerMask(r, d) / 2 ** i) % 2;
  const helm = r.layers.findIndex(l => l.type === 'tex' && l.kinds), body = r.layers.findIndex(l => l.type === 'decal' && l.not_kinds);
  const cap = { role: 'anodized', part: 'cap', asm: 'head', side: null }, chest = { role: 'shell', part: 'chest', asm: 'upper_body', side: 'C', kind: 'body' };
  assert.equal(bit({ ...cap, kind: 'critic' }, helm), 1);
  assert.equal(bit({ ...cap, kind: 'scout' }, helm), 1);
  assert.equal(bit({ ...cap, kind: 'body' }, helm), 0);
  assert.equal(bit({ ...cap, part: 'mask', kind: 'critic' }, helm), 0);
  assert.equal(bit(chest, body), 1);
  assert.equal(bit({ ...chest, kind: 'critic' }, body), 0);
});

test('emblem anchor: applySkin centres the chest sun on the medallion, other meshes keep their own centre', async () => {
  const { applySkin } = await vite.ssrLoadModule('/src/robotSkins.js');
  const mesh = (part, role, centre) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(9), 3));
    g.setAttribute('skinInfo', new THREE.BufferAttribute(new Float32Array(12), 4));
    g.setAttribute('skinAnchor', new THREE.BufferAttribute(new Float32Array(9), 3));
    return { mesh: new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshStandardMaterial()), geometry: g, entry: {}, mirror: 1, half: 0.09,
      centre: new THREE.Vector3(...centre), desc: { role, part, asm: 'upper_body', side: 'C', kind: 'body' } };
  };
  const chest = mesh('chest', 'shell', [0.021, 1.327, 0.084]), disc = mesh('emblem_disc', 'graphite', [0.034, 1.311, 0.135]);
  const thigh = mesh('thigh_shell', 'shell', [0.1, 0.6, 0.05]);
  const state = { atlas: { texture: null }, meshes: [chest, disc, thigh], materials: new Map(), active: null };
  const anchor = m => [0, 1, 2].map(k => +m.geometry.attributes.skinAnchor.getComponent(0, k).toFixed(4));
  for (const key of ['glut', 'ornat']) {
    applySkin(state, key);
    assert.deepEqual(anchor(chest), [0.034, 1.311, 0.135], key);   // the sun of the chest plate: around the medallion
    assert.deepEqual(anchor(thigh), [0.1, 0.6, 0.05], key);         // no anchored layer: its own centre
  }
  applySkin(state, 'rost');
  assert.deepEqual(anchor(chest), [0.021, 1.327, 0.084]);           // skins without an anchor: own centre again
});
