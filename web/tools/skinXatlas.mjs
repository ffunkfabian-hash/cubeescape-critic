// xatlas (WASM, xatlasjs 0.2.0) for the skin atlas (0.13 "Skins"): one shared UV atlas over many meshes, deterministic.
// Thin wrapper around the Emscripten module instead of xatlasjs's Api class: that class copies every vertex array through a
// JS spread and passes indices as 16 bit, so meshes are welded here and split into chunks below 65 536 vertices.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const createXAtlasModule = require('xatlasjs/dist/node/xatlas.js');
const CHUNK_VERTS = 65000;

// Weld coincident vertices whose shading normals agree (three.js CSG output arrives as loose triangles), so charts can span
// them; vertices split at a hard edge stay apart, so charts break there (welding them as well folds charts at CSG cuts).
// Returns the welded positions and the welded index per corner.
export function weld(position, index, normal = null, { tolerance = 1e-6, cosMax = Math.cos(Math.PI / 9) } = {}) {
  const ids = new Map(), welded = [], normals = [];
  const corner = new Uint32Array(index.length);
  const q = v => Math.round(v / tolerance);
  for (let c = 0; c < index.length; c++) {
    const v = index[c], k = `${q(position[3 * v])},${q(position[3 * v + 1])},${q(position[3 * v + 2])}`;
    const n = normal ? [normal[3 * v], normal[3 * v + 1], normal[3 * v + 2]] : null;
    let list = ids.get(k);
    if (!list) ids.set(k, list = []);
    let w = list.find(i => !n || normals[i][0] * n[0] + normals[i][1] * n[1] + normals[i][2] * n[2] >= cosMax);
    if (w === undefined) { w = normals.length; list.push(w); normals.push(n); welded.push(position[3 * v], position[3 * v + 1], position[3 * v + 2]); }
    corner[c] = w;
  }
  return { position: new Float32Array(welded), corner, count: normals.length };
}

// Split a welded triangle list into chunks with at most CHUNK_VERTS vertices each (xatlas.js takes 16-bit indices).
function chunks(corner) {
  const out = [];
  let map = new Map(), tris = [];
  const flush = () => { if (tris.length) out.push({ map, tris }); map = new Map(); tris = []; };
  for (let t = 0; t < corner.length / 3; t++) {
    const fresh = [0, 1, 2].filter(k => !map.has(corner[3 * t + k])).length;
    if (map.size + fresh > CHUNK_VERTS) flush();
    for (let k = 0; k < 3; k++) if (!map.has(corner[3 * t + k])) map.set(corner[3 * t + k], map.size);
    tris.push(t);
  }
  flush();
  return out;
}

let modulePromise = null;
const xatlasModule = () => (modulePromise ??= createXAtlasModule({ print: () => {}, printErr: () => {} }));

// meshes: [{ position: Float32Array (world metres), normal (optional, unit), index: Uint32Array|Array }]. Options: resolution (atlas size in px), padding
// (px between charts). Returns { width, height, texelsPerUnit, meshes: [{ uv: Float32Array (0..1 per output vertex),
// corner: Uint32Array (output vertex per input corner), source: Uint32Array (input vertex per output vertex) }] }.
export async function buildAtlas(meshes, { resolution = 2048, texelsPerUnit = 0, padding = 4, chart = {}, bruteForce = false, log = () => {} } = {}) {
  const X = await xatlasModule();
  X.createAtlas();
  const jobs = [];
  for (const [m, mesh] of meshes.entries()) {
    const w = weld(mesh.position, mesh.index, mesh.normal);
    for (const ch of chunks(w.corner)) {
      const verts = new Float32Array(ch.map.size * 3), idx = new Uint16Array(ch.tris.length * 3);
      for (const [wv, local] of ch.map) verts.set(w.position.subarray(3 * wv, 3 * wv + 3), 3 * local);
      ch.tris.forEach((t, i) => { for (let k = 0; k < 3; k++) idx[3 * i + k] = ch.map.get(w.corner[3 * t + k]); });
      const desc = X.createMesh(ch.map.size, idx.length, false, false);
      X.HEAPU16.set(idx, desc.indexOffset / 2);
      X.HEAPF32.set(verts, desc.positionOffset / 4);
      const err = X.addMesh();
      if (err !== 0) throw new Error(`xatlas: addMesh failed (${err}) for mesh ${m}`);
      jobs.push({ m, meshId: desc.meshId, tris: ch.tris });
    }
  }
  log(`xatlas: ${meshes.length} meshes in ${jobs.length} chunks`);
  const chartOptions = { fixWinding: false, maxBoundaryLength: 0, maxChartArea: 0, maxCost: 2, maxIterations: 1, normalDeviationWeight: 2,
    normalSeamWeight: 4, roundnessWeight: 0.01, straightnessWeight: 6, textureSeamWeight: 0.5, useInputMeshUvs: false, ...chart };
  X.computeCharts(chartOptions);
  // xatlas only estimates the density for a resolution; the packed atlas may come out larger. Charts are computed once and
  // repacked with a corrected density until the atlas fits the requested size (or with the given density as it is).
  const pack = tpu => {
    X.packCharts({ bilinear: true, blockAlign: false, bruteForce, createImage: false, maxChartSize: 0, padding,
      resolution: tpu ? 0 : resolution, rotateCharts: true, rotateChartsToAxis: true, texelsPerUnit: tpu });
    return X.getAtlas();
  };
  let atlas = pack(texelsPerUnit);
  for (let i = 0; !texelsPerUnit && i < 8; i++) {
    const side = Math.max(atlas.width, atlas.height);
    log(`xatlas: pack ${i}: ${atlas.width}×${atlas.height}, ${atlas.texelsPerUnit.toFixed(2)} texels per unit`);
    if (side <= resolution && side > resolution * 0.97) break;
    atlas = pack(Math.fround(atlas.texelsPerUnit * (resolution * 0.985) / side));
  }
  if (atlas.atlasCount !== 1) throw new Error(`xatlas: ${atlas.atlasCount} atlas pages, expected 1`);
  if (!texelsPerUnit && Math.max(atlas.width, atlas.height) > resolution) throw new Error(`xatlas: atlas ${atlas.width}×${atlas.height} exceeds ${resolution}`);
  const result = meshes.map(mesh => ({ uv: [], corner: new Uint32Array(mesh.index.length), source: [] }));
  for (const job of jobs) {
    const d = X.getMeshData(job.meshId), r = result[job.m], input = meshes[job.m].index;
    const n = d.newVertexCount;
    const newIndex = X.HEAPU32.subarray(d.indexOffset / 4, d.indexOffset / 4 + d.newIndexCount);
    if (d.newIndexCount !== job.tris.length * 3) log(`xatlas: mesh ${job.m} returned ${d.newIndexCount / 3} of ${job.tris.length} triangles`);
    const uv = X.HEAPF32.subarray(d.uvOffset / 4, d.uvOffset / 4 + 2 * n);
    // An output vertex of xatlas is a welded vertex in one chart; the mesh vertex keeps its own normal, so the final vertex is
    // the pair (xatlas vertex, source vertex) of every corner.
    const pairs = new Map();
    job.tris.forEach((t, i) => {
      for (let k = 0; k < 3; k++) {
        const xv = newIndex[3 * i + k], src = input[3 * t + k], key = xv * 4294967296 + src;
        let out = pairs.get(key);
        if (out === undefined) {
          out = r.source.length;
          pairs.set(key, out);
          r.source.push(src);
          r.uv.push(uv[2 * xv], uv[2 * xv + 1]); // the binding returns UVs normalised to the atlas
        }
        r.corner[3 * t + k] = out;
      }
    });
    X.destroyMeshData(d);
    d.subMeshes?.delete?.();
  }
  X.destroyAtlas();
  return { width: atlas.width, height: atlas.height, texelsPerUnit: atlas.texelsPerUnit,
    meshes: result.map(r => ({ uv: new Float32Array(r.uv), corner: r.corner, source: new Uint32Array(r.source) })) };
}
