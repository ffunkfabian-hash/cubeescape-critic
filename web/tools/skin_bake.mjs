// Skin bake (0.13 "Skins"): UV atlas and geometry maps of a model for the skin mixer (src/skinShader.js), in Node, no Blender.
//   node tools/skin_bake.mjs [--model waechter|paladin|mechanik|critic|scout|all] [--gen glb|three] [--size 2048] [--ao-samples 32]
//     [--workers 8] [--debug <dir>] (default ../runs/skins)
// Steps: mesh sources (body GLB, or with --gen three the body or Scout built by the three.js generator robotgen; Helm H built by its
// generator for every stored variant, Scout GLB) → model metres → one UV atlas
// with xatlas (tools/skinXatlas.mjs) → texel maps by rasterising every triangle in UV space (position, shading normal, mesh;
// written as images to the debug folder together with part and role ids) → per texel the distance to the nearest plate edge of its
// mesh in 3D (three-mesh-bvh closest point on the mesh's feature edges and rounded strips) and ambient occlusion from rays
// (three-mesh-bvh, the whole model) → gutters filled with the nearest texel.
// Output assets/skins/<model>/ (generated bodies: assets/skins/<body>-three/, skinAtlas.js › atlasName): atlas.json + atlas.bin (skinAtlas.js › readAtlas) and maps.png (R ambient occlusion, G edge
// distance in the sqrt code of skinAtlas.js, B coverage). Deterministic: same sources, same bytes.
import { isMainThread, Worker, workerData, parentPort } from 'node:worker_threads';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { availableParallelism } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { MeshBVH } from 'three-mesh-bvh';
import { encodePNG } from './skinPng.mjs';

const FAR_MM = 64; // = skinAtlas.EDGE_RANGE_MM

// ------------------------------------------------------------------ worker: edge distance and ambient occlusion per texel

function hash(i) {
  let h = Math.imul(i ^ 0x9e3779b9, 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function work({ range, pos, nor, mesh, geo, features, ao }) {
  const [a, b] = range, P = new Float32Array(pos), N = new Float32Array(nor), M = new Int32Array(mesh);
  const model = new THREE.BufferGeometry();
  model.setAttribute('position', new THREE.BufferAttribute(new Float32Array(geo.position), 3));
  model.setIndex(new THREE.BufferAttribute(new Uint32Array(geo.index).slice(), 1)); // own copy: MeshBVH reorders the index in place
  const bvh = new MeshBVH(model, { targetLeafSize: 8 });
  const featurePos = new Float32Array(features.position), featureOffsets = features.offsets, featureBvh = new Map();
  const featuresOf = m => {
    if (!featureBvh.has(m)) {
      const [f0, f1] = [featureOffsets[m], featureOffsets[m + 1]];
      let entry = null;
      if (f1 > f0) {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(featurePos.slice(f0 * 9, f1 * 9), 3));
        entry = new MeshBVH(g, { targetLeafSize: 4 });
      }
      featureBvh.set(m, entry);
    }
    return featureBvh.get(m);
  };
  // cosine-weighted hemisphere directions (Hammersley), turned per texel by a hashed angle
  const S = ao.samples, dirs = [];
  for (let i = 0; i < S; i++) {
    let r = 0, f = 0.5;
    for (let k = i; k; k >>= 1, f *= 0.5) if (k & 1) r += f;
    const u = (i + 0.5) / S, phi = 2 * Math.PI * r, s = Math.sqrt(u);
    dirs.push([s * Math.cos(phi), s * Math.sin(phi), Math.sqrt(1 - u)]);
  }
  const edge = new Float32Array(b - a), occ = new Float32Array(b - a);
  const p = new THREE.Vector3(), n = new THREE.Vector3(), t = new THREE.Vector3(), bt = new THREE.Vector3(), ray = new THREE.Ray();
  const hit = {}, far = FAR_MM / 1000, dist = ao.distanceMm / 1000, eps = 1e-4;
  for (let i = a; i < b; i++) {
    p.fromArray(P, 3 * i); n.fromArray(N, 3 * i).normalize();
    const fb = featuresOf(M[i]);
    const c = fb ? fb.closestPointToPoint(p, hit, 0, far) : null;
    edge[i - a] = c ? c.distance * 1000 : FAR_MM;
    // tangent frame, rotated by a per-texel angle (noise instead of banding; fixed seed)
    t.set(Math.abs(n.x) < 0.9 ? 1 : 0, Math.abs(n.x) < 0.9 ? 0 : 1, 0).cross(n).normalize();
    bt.crossVectors(n, t);
    const rot = hash(i) * 2 * Math.PI, cr = Math.cos(rot), sr = Math.sin(rot);
    let blocked = 0;
    ray.origin.copy(p).addScaledVector(n, eps);
    for (const [x, y, z] of dirs) {
      const xr = x * cr - y * sr, yr = x * sr + y * cr;
      ray.direction.set(0, 0, 0).addScaledVector(t, xr).addScaledVector(bt, yr).addScaledVector(n, z).normalize();
      if (bvh.raycastFirst(ray, THREE.DoubleSide, eps, dist)) blocked++;
    }
    occ[i - a] = 1 - blocked / S;
  }
  return { edge, occ };
}

if (!isMainThread) {
  const r = work(workerData);
  parentPort.postMessage(r, [r.edge.buffer, r.occ.buffer]);
}

// ------------------------------------------------------------------ main

const BODIES = ['waechter', 'paladin', 'mechanik'];
const MODELS = [...BODIES, 'critic', 'scout'];
const here = path.dirname(fileURLToPath(import.meta.url)), webRoot = path.dirname(here), repo = path.dirname(webRoot);
const log = (msg, t0 = log.t0 ??= performance.now()) => console.log(`[skin_bake ${((performance.now() - t0) / 1000).toFixed(1).padStart(6)}s] ${msg}`);

function args() {
  const o = { model: 'all', gen: 'glb', size: '2048', 'ao-samples': null, workers: String(Math.max(1, Math.min(availableParallelism() - 1, 10))), debug: path.join(repo, 'runs', 'skins'), out: path.join(repo, 'assets', 'skins') };
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    const k = a[i].replace(/^--/, '');
    if (!(k in o)) throw new Error(`skin_bake: unknown argument ${a[i]}`);
    o[k] = a[++i];
  }
  if (o.model !== 'all' && !MODELS.includes(o.model)) throw new Error(`skin_bake: unknown model ${o.model} (${MODELS.join(', ')}, all)`);
  if (!['glb', 'three'].includes(o.gen)) throw new Error(`skin_bake: unknown gen ${o.gen} (glb, three)`);
  return o;
}

async function parseGLB(file) {
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
  const buf = readFileSync(file);
  return (await new GLTFLoader().parseAsync(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), '')).scene;
}

// Sources of a model: one or more variants (root, metres per root unit, kind for roles/parts). A body or Scout has one; Helm H one
// per stored variant (criticHelmetVariants.json) – variants share every mesh whose geometry is equal.
async function loadSources(name, vite, gen) {
  if (BODIES.includes(name) && gen === 'three') {   // built at runtime: parts with CSG grooves keep their baked positions (see bake)
    const { buildRobotBody } = await import('../src/robotgen/index.js');
    const { scene, spec } = buildRobotBody(name), cut = new Set(spec.parts.filter(([, p]) => p[5].cuts?.length).map(([a, p]) => `${a}:${p[0]}`));
    return { kind: 'body', metresPerUnit: 1, variants: [{ label: 'assembled', root: scene }], keepPositions: m => cut.has(`${m.userData.asm}:${m.userData.part}`),
      source: `web/src/robotgen (buildRobotBody("${name}"))` };
  }
  if (BODIES.includes(name)) {
    const root = await parseGLB(path.join(repo, 'assets', 'robot-bodies', name, 'assembled', `${name}.glb`));
    return { kind: 'body', metresPerUnit: 1, variants: [{ label: 'assembled', root }], source: `assets/robot-bodies/${name}/assembled/${name}.glb` };
  }
  if (name === 'scout' && gen === 'three') {   // Scout from the three.js generator (0.17); BSP parts keep their baked positions
    const { buildScout, BSP_PARTS } = await import('../src/robotgen/scout.js');
    const { readGussFile } = await import('./scoutGussNode.mjs');
    const { scene: root } = buildScout(await readGussFile());
    const { scoutFit } = await vite.ssrLoadModule('/src/scout.js');
    const { HELMET_FRAME_METERS } = await vite.ssrLoadModule('/src/robotHelmet.js');
    return { kind: 'scout', metresPerUnit: scoutFit(root).scale * HELMET_FRAME_METERS, variants: [{ label: 'assembled', root }],
      keepPositions: m => BSP_PARTS.includes(m.userData.source_object), source: 'web/src/robotgen/scout.js (buildScout)' };
  }
  if (name === 'scout') {
    const root = await parseGLB(path.join(repo, 'assets', 'helmet-scout', 'assembled', 'scout.glb'));
    const { scoutFit } = await vite.ssrLoadModule('/src/scout.js');
    const { HELMET_FRAME_METERS } = await vite.ssrLoadModule('/src/robotHelmet.js');
    return { kind: 'scout', metresPerUnit: scoutFit(root).scale * HELMET_FRAME_METERS, variants: [{ label: 'assembled', root }], source: 'assets/helmet-scout/assembled/scout.glb' };
  }
  const { buildHelmet } = await vite.ssrLoadModule('/src/helmet.js');
  const { configureHelmetAssembly } = await vite.ssrLoadModule('/src/assembly.js');
  const { D } = await vite.ssrLoadModule('/src/params.js');
  const { HELMET_FRAME_METERS } = await vite.ssrLoadModule('/src/robotHelmet.js');
  // Finish and accents only swap materials (materials.js); the geometry differs by the forehead strips (variants 80–86 on,
  // 87/88 off). Materials are stand-ins named like the palette entries (createMaterials needs a canvas).
  const palette = new Map(), M = new Proxy({}, { get: (_, name) => {
    if (typeof name !== 'string') return undefined;
    if (!palette.has(name)) palette.set(name, new THREE.MeshStandardMaterial({ name }));
    return palette.get(name);
  } });
  const variants = [];
  for (const strips of ['on', 'off']) {
    const keep = D.foreheadPlates.enabled;
    D.foreheadPlates.enabled = strips === 'on';
    let root;
    try { root = buildHelmet(M); } finally { D.foreheadPlates.enabled = keep; }
    configureHelmetAssembly(root, { headset: 'on' }); // presentation neck stays: the helmet alone shows it, the robot removes it
    variants.push({ label: `strips ${strips}`, root });
  }
  return { kind: 'critic', metresPerUnit: HELMET_FRAME_METERS, variants, keepPositions: true, source: 'web/src/helmet.js (forehead strips on and off)' };
}

// Feature primitives of one mesh in model metres (as triangles; an edge becomes a sliver): open borders, edges where the shading
// normals jump by more than jumpDeg, and rounded triangles whose normals turn faster than roundDegPerMm (at least minTurnDeg).
function features(position, normal, corner, { jumpDeg, roundDegPerMm, minTurnDeg }) {
  const q = i => `${Math.round(position[3 * i] * 1e5)},${Math.round(position[3 * i + 1] * 1e5)},${Math.round(position[3 * i + 2] * 1e5)}`;
  const ids = new Map(), wid = new Int32Array(position.length / 3);
  for (let i = 0; i < wid.length; i++) { const k = q(i); if (!ids.has(k)) ids.set(k, ids.size); wid[i] = ids.get(k); }
  const tris = corner.length / 3, cosJump = Math.cos(THREE.MathUtils.degToRad(jumpDeg));
  const P = i => new THREE.Vector3().fromArray(position, 3 * i), Nn = i => new THREE.Vector3().fromArray(normal, 3 * i).normalize();
  const area = new Float32Array(tris), rounded = new Uint8Array(tris), out = [];
  const tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3();
  for (let t = 0; t < tris; t++) {
    const [i, j, k] = [corner[3 * t], corner[3 * t + 1], corner[3 * t + 2]];
    area[t] = tmp.subVectors(P(j), P(i)).cross(tmp2.subVectors(P(k), P(i))).length();
    let rate = 0;
    for (const [u, v] of [[i, j], [j, k], [i, k]]) {
      const deg = THREE.MathUtils.radToDeg(Nn(u).angleTo(Nn(v)));
      if (deg >= minTurnDeg) rate = Math.max(rate, deg / Math.max(P(u).distanceTo(P(v)) * 1000, 1e-6));
    }
    if (area[t] > 0 && rate > roundDegPerMm) { rounded[t] = 1; out.push(...P(i).toArray(), ...P(j).toArray(), ...P(k).toArray()); }
  }
  const edges = new Map();
  for (let t = 0; t < tris; t++) {
    if (!area[t]) continue;
    for (let e = 0; e < 3; e++) {
      const u = corner[3 * t + e], v = corner[3 * t + (e + 1) % 3], key = wid[u] < wid[v] ? `${wid[u]}_${wid[v]}` : `${wid[v]}_${wid[u]}`;
      if (!edges.has(key)) edges.set(key, []);
      edges.get(key).push([t, u, v]);
    }
  }
  for (const list of edges.values()) {
    const [t, u, v] = list[0];
    let feature = list.length === 1 || list.some(([s]) => rounded[s]);
    if (!feature) for (const [, u2, v2] of list.slice(1)) {
      const at = w => (wid[u2] === wid[w] ? u2 : v2);
      if (Nn(u).dot(Nn(at(u))) < cosJump || Nn(v).dot(Nn(at(v))) < cosJump) { feature = true; break; }
    }
    if (!feature) continue;
    const a = P(u), b = P(v), m = a.clone().add(b).multiplyScalar(0.5);
    const side = tmp.subVectors(b, a).cross(Math.abs(b.x - a.x) < 0.9 * a.distanceTo(b) ? tmp2.set(1, 0, 0) : tmp2.set(0, 1, 0)).normalize().multiplyScalar(1e-5);
    out.push(...a.toArray(), ...b.toArray(), ...m.add(side).toArray());
  }
  return out;
}

async function bake(name, o, vite) {
  const recipes = JSON.parse(readFileSync(path.join(webRoot, 'src', 'skins.json'), 'utf8'));
  const { skinMeshes, geometrySignature, sameSignature, cornerIndex, writeAtlas, encodeEdge, atlasName } = await import('../src/skinAtlas.js');
  const { describeSkinMeshes } = await vite.ssrLoadModule('/src/skinParts.js');
  const { buildAtlas } = await import('./skinXatlas.mjs');
  const S = Number(o.size), aoSamples = Number(o['ao-samples'] ?? recipes.ao.samples);
  const src = await loadSources(name, vite, o.gen), model = atlasName(name, o.gen);
  // union of the variants' meshes: one entry per key and geometry signature
  const entries = [];
  for (const [vi, v] of src.variants.entries()) {
    v.root.updateMatrixWorld(true);
    const inv = v.root.matrixWorld.clone().invert(), scale = new THREE.Matrix4().makeScale(src.metresPerUnit, src.metresPerUnit, src.metresPerUnit);
    const list = skinMeshes(v.root), desc = describeSkinMeshes(list, src.kind, v.root);
    list.forEach(({ mesh, key }, i) => {
      const sig = geometrySignature(mesh.geometry);
      if (entries.some(e => e.key === key && sameSignature(e.sig, sig))) return;
      const matrix = scale.clone().multiply(inv).multiply(mesh.matrixWorld);
      const g = mesh.geometry, corner = cornerIndex(g);
      const position = g.attributes.position.clone().applyMatrix4(matrix).array;
      if (!g.attributes.normal) g.computeVertexNormals();
      const normal = g.attributes.normal.clone().applyNormalMatrix(new THREE.Matrix3().getNormalMatrix(matrix)).array;
      const keepPos = src.keepPositions === true || !!src.keepPositions?.(mesh);
      entries.push({ key, name: mesh.name, sig, matrix: matrix.toArray(), local: g.attributes.position.array, position, normal, corner, variant: vi, desc: desc[i], keepPos });
    });
  }
  log(`${name}: ${entries.length} meshes from ${src.variants.length} variant(s), ${entries.reduce((s, e) => s + e.corner.length / 3, 0)} triangles`);
  const atlas = await buildAtlas(entries.map(e => ({ position: e.position, normal: e.normal, index: e.corner })), { resolution: S, padding: 2, log });
  atlas.meshes.forEach((m, i) => Object.assign(entries[i], { source: m.source, uv: m.uv, out: m.corner }));
  // runtime-built meshes (Helm H; of a generated body the parts with CSG grooves) keep their baked positions for transferGeometry:
  // another engine or platform may triangulate a CSG cut differently (Linux CI), the rest of the generator is plain arithmetic
  for (const e of entries.filter(x => x.keepPos)) {
    e.pos = new Float32Array(3 * e.source.length);
    e.source.forEach((v, i) => e.pos.set(e.local.subarray(3 * v, 3 * v + 3), 3 * i));
  }
  log(`${name}: atlas ${atlas.width}×${atlas.height}`);

  // ---- raster in UV space: texel → mesh, position, shading normal
  const T = S * S, meshOf = new Int32Array(T).fill(-1), pos = new Float32Array(T * 3), nor = new Float32Array(T * 3);
  let area3d = 0;
  for (const [m, e] of entries.entries()) {
    const { uv, out, source, position, normal } = e;
    for (let t = 0; t < out.length; t += 3) {
      const v = [out[t], out[t + 1], out[t + 2]], s = v.map(i => source[i]);
      const x = v.map(i => uv[2 * i] * S), y = v.map(i => uv[2 * i + 1] * S);
      const d = (x[1] - x[0]) * (y[2] - y[0]) - (x[2] - x[0]) * (y[1] - y[0]);
      const pa = s.map(i => [position[3 * i], position[3 * i + 1], position[3 * i + 2]]);
      area3d += new THREE.Vector3(...pa[1]).sub(new THREE.Vector3(...pa[0])).cross(new THREE.Vector3(...pa[2]).sub(new THREE.Vector3(...pa[0]))).length() / 2;
      if (Math.abs(d) < 1e-12) continue;
      const x0 = Math.max(0, Math.floor(Math.min(...x) - 0.5)), x1 = Math.min(S - 1, Math.ceil(Math.max(...x) - 0.5));
      const y0 = Math.max(0, Math.floor(Math.min(...y) - 0.5)), y1 = Math.min(S - 1, Math.ceil(Math.max(...y) - 0.5));
      for (let py = y0; py <= y1; py++) for (let px = x0; px <= x1; px++) {
        const cx = px + 0.5, cy = py + 0.5;
        const w1 = ((cx - x[0]) * (y[2] - y[0]) - (x[2] - x[0]) * (cy - y[0])) / d;
        const w2 = ((x[1] - x[0]) * (cy - y[0]) - (cx - x[0]) * (y[1] - y[0])) / d, w0 = 1 - w1 - w2;
        if (w0 < -1e-6 || w1 < -1e-6 || w2 < -1e-6) continue;
        const k = py * S + px;
        meshOf[k] = m;
        for (let c = 0; c < 3; c++) {
          pos[3 * k + c] = w0 * pa[0][c] + w1 * pa[1][c] + w2 * pa[2][c];
          nor[3 * k + c] = w0 * normal[3 * s[0] + c] + w1 * normal[3 * s[1] + c] + w2 * normal[3 * s[2] + c];
        }
      }
    }
  }
  const covered = []; for (let k = 0; k < T; k++) if (meshOf[k] >= 0) covered.push(k);
  const coverage = covered.length / T, mmPerPx = Math.sqrt(area3d / covered.length) * 1000;
  log(`${name}: raster ${covered.length} texels (${(coverage * 100).toFixed(1)} %), ${mmPerPx.toFixed(3)} mm per px, surface ${area3d.toFixed(3)} m²`);

  // ---- compact texel arrays and feature primitives for the workers
  const C = covered.length, share = n => new SharedArrayBuffer(n * 4);
  const cPos = new Float32Array(share(3 * C)), cNor = new Float32Array(share(3 * C)), cMesh = new Int32Array(share(C));
  covered.forEach((k, i) => { cPos.set(pos.subarray(3 * k, 3 * k + 3), 3 * i); cNor.set(nor.subarray(3 * k, 3 * k + 3), 3 * i); cMesh[i] = meshOf[k]; });
  const occluders = entries.filter(e => e.variant === 0);
  const nPos = occluders.reduce((s, e) => s + e.position.length, 0), nIdx = occluders.reduce((s, e) => s + e.corner.length, 0);
  const gPos = new Float32Array(share(nPos)), gIdx = new Uint32Array(share(nIdx));
  let vp = 0, ip = 0;
  for (const e of occluders) { gPos.set(e.position, vp); for (let i = 0; i < e.corner.length; i++) gIdx[ip + i] = e.corner[i] + vp / 3; vp += e.position.length; ip += e.corner.length; }
  const featureLists = entries.map(e => features(e.position, e.normal, e.corner, recipes.edges));
  const offsets = [0]; for (const f of featureLists) offsets.push(offsets.at(-1) + f.length / 9);
  const fPos = new Float32Array(share(offsets.at(-1) * 9));
  featureLists.forEach((f, i) => fPos.set(f, offsets[i] * 9));
  log(`${name}: ${offsets.at(-1)} feature primitives, ${nIdx / 3} occluder triangles; edge distance and AO (${aoSamples} rays) in ${o.workers} workers`);

  const W = Number(o.workers), parts = [];
  for (let w = 0; w < W; w++) {
    const range = [Math.floor(C * w / W), Math.floor(C * (w + 1) / W)];
    parts.push(new Promise((resolve, reject) => {
      const worker = new Worker(fileURLToPath(import.meta.url), { workerData: { range, pos: cPos.buffer, nor: cNor.buffer, mesh: cMesh.buffer,
        geo: { position: gPos.buffer, index: gIdx.buffer }, features: { position: fPos.buffer, offsets }, ao: { samples: aoSamples, distanceMm: recipes.ao.distanceMm } } });
      worker.once('message', r => resolve({ range, ...r }));
      worker.once('error', reject);
    }));
  }
  const edge = new Float32Array(C), occ = new Float32Array(C);
  for (const r of await Promise.all(parts)) { edge.set(r.edge, r.range[0]); occ.set(r.occ, r.range[0]); }
  log(`${name}: maps done`);

  // ---- AO denoise: 3×3 mean over texels of the same mesh; then images with gutters filled from the nearest texel
  const index = new Int32Array(T).fill(-1); covered.forEach((k, i) => { index[k] = i; });
  const occS = new Float32Array(C);
  covered.forEach((k, i) => {
    const x = k % S, y = (k - x) / S;
    let s = 0, n = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const xx = x + dx, yy = y + dy, j = xx >= 0 && yy >= 0 && xx < S && yy < S ? index[yy * S + xx] : -1;
      if (j >= 0 && cMesh[j] === cMesh[i]) { s += occ[j]; n++; }
    }
    occS[i] = s / n;
  });
  const near = nearestCovered(index, S, 8);
  const maps = new Uint8Array(T * 3);
  for (let k = 0; k < T; k++) {
    const i = near[k];
    if (i < 0) continue;
    maps[3 * k] = Math.round(occS[i] * 255);
    maps[3 * k + 1] = encodeEdge(edge[i]);
    maps[3 * k + 2] = index[k] >= 0 ? 255 : 0;
  }
  const outDir = path.join(o.out, model);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, 'maps.png'), encodePNG(S, S, 3, maps));
  const { json, buffer } = writeAtlas({ model, kind: src.kind, source: src.source, variants: src.variants.map(v => v.label),
    size: S, padding: 2, metresPerUnit: +src.metresPerUnit.toPrecision(9), mmPerPx: +mmPerPx.toFixed(3), coverage: +coverage.toFixed(4),
    surfaceM2: +area3d.toFixed(4), edges: recipes.edges, ao: { ...recipes.ao, samples: aoSamples }, maps: 'maps.png', bin: 'atlas.bin' }, entries.map(e => ({ ...e, corner: e.out })));
  writeFileSync(path.join(outDir, 'atlas.bin'), Buffer.from(buffer));
  writeFileSync(path.join(outDir, 'atlas.json'), JSON.stringify(json) + '\n');
  log(`${name}: wrote ${path.relative(repo, outDir)} (atlas.bin ${(buffer.byteLength / 1e6).toFixed(1)} MB)`);

  // ---- debug maps: position, normal, part, role, edge, AO
  const dbg = path.join(o.debug, model);
  mkdirSync(dbg, { recursive: true });
  const box = new THREE.Box3(); for (let i = 0; i < C; i++) box.expandByPoint(new THREE.Vector3().fromArray(cPos, 3 * i));
  const size = box.getSize(new THREE.Vector3());
  const color = s => { const h = hash(s * 7919 + 13); return new THREE.Color().setHSL(h, 0.55, 0.55); };
  const roles = [...new Set(entries.map(e => e.desc.role ?? 'none'))].sort();
  const parts2 = [...new Set(entries.map(e => e.desc.part))];
  const img = fn => { const a = new Uint8Array(T * 3); for (let k = 0; k < T; k++) { const i = index[k]; if (i >= 0) a.set(fn(i), 3 * k); } return a; };
  const debugMaps = {
    position: i => [0, 1, 2].map(c => Math.round((cPos[3 * i + c] - box.min.getComponent(c)) / size.getComponent(c) * 255)),
    normal: i => [0, 1, 2].map(c => Math.round((cNor[3 * i + c] * 0.5 + 0.5) * 255)),
    part: i => color(parts2.indexOf(entries[cMesh[i]].desc.part)).toArray().map(v => Math.round(v * 255)),
    role: i => color(1000 + roles.indexOf(entries[cMesh[i]].desc.role ?? 'none')).toArray().map(v => Math.round(v * 255)),
    edge: i => { const v = Math.round(Math.min(edge[i], 32) / 32 * 255); return [v, v, v]; },
    ao: i => { const v = Math.round(occS[i] * 255); return [v, v, v]; },
  };
  for (const [key, fn] of Object.entries(debugMaps)) writeFileSync(path.join(dbg, `${key}.png`), encodePNG(S, S, 3, img(fn)));
  writeFileSync(path.join(dbg, 'legend.json'), JSON.stringify({ roles, parts: parts2, box: [box.min.toArray(), box.max.toArray()] }, null, 1));
  log(`${name}: debug maps in ${dbg}`);
}

// For every texel the compact index of the nearest covered texel within `radius` px (grassfire over 8 neighbours), else −1.
function nearestCovered(index, S, radius) {
  const near = Int32Array.from(index);
  let front = []; for (let k = 0; k < S * S; k++) if (index[k] >= 0) front.push(k);
  for (let r = 0; r < radius && front.length; r++) {
    const next = [];
    for (const k of front) {
      const x = k % S, y = (k - x) / S;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= S || yy >= S) continue;
        const j = yy * S + xx;
        if (near[j] < 0) { near[j] = near[k]; next.push(j); }
      }
    }
    front = next;
  }
  return near;
}

if (isMainThread) {
  const o = args();
  const { createServer } = await import('vite');
  const vite = await createServer({ root: webRoot, logLevel: 'error', server: { middlewareMode: true, hmr: false } });
  const warn = console.warn;
  console.warn = (...a) => { if (!String(a[0]).includes('"maxLeafSize" option has been deprecated')) warn(...a); };
  try {
    for (const name of o.model === 'all' ? (o.gen === 'three' ? [...BODIES, 'scout'] : MODELS) : [o.model]) {
      if (o.gen === 'three' && name === 'critic') throw new Error('skin_bake: --gen three only for the bodies and Scout (Helm H is built by three.js anyway)');
      await bake(name, o, vite);
    }
  } finally {
    await vite.close();
  }
}
