// Skin atlas (0.13 "Skins"): one UV atlas per model (robot body, Helm H, Scout), built offline by tools/skin_bake.mjs with
// xatlas, and the geometry maps baked into it (ambient occlusion, distance to the nearest plate edge in mm). The skin mixer
// (skinShader.js) paints every mesh procedurally in model space and reads only these two maps through the atlas UVs.
//
// The atlas does not replace the model's geometry: it is stored per mesh as a remap of the mesh's own vertices (source vertex
// per output vertex, atlas UV per output vertex, triangle list), so any mesh source works – a GLB, a helmet built at runtime –
// as long as it rebuilds the same vertices. Every entry keeps a signature (vertex/corner count, bounding box) and the matrix of
// the mesh in model metres at bake time. Meshes built at runtime (Helm H) also keep the baked positions: CSG in another
// JavaScript engine can come out a few triangles different, and such a mesh takes its UVs from the nearest baked triangle
// (transferGeometry). A mesh without any entry gets no maps and is painted without edge wear and cavity dirt.
import * as THREE from 'three';
import { MeshBVH } from 'three-mesh-bvh';

export const ATLAS_FORMAT = 'critic-skin-atlas/1';
// Edge distances are stored in 8 bits as sqrt(d / EDGE_RANGE_MM): fine steps near the edge (0.14 mm at 5 mm), coarse far away.
export const EDGE_RANGE_MM = 64;
export const encodeEdge = mm => Math.round(Math.sqrt(Math.min(Math.max(mm, 0), EDGE_RANGE_MM) / EDGE_RANGE_MM) * 255);
export const decodeEdge = v => (v / 255) ** 2 * EDGE_RANGE_MM;

// Meshes below root with a stable key: the names from root to the mesh, each with its index among equally named siblings
// (as assembly.js › assemblyInventory, without the root's own name). Meshes of an exploded Helm H carry the key of their
// assembled source in userData.sourcePath.
export function skinMeshes(root, keep = () => true) {
  const out = [];
  const visit = (o, path) => {
    if (o.isMesh && keep(o)) out.push({ mesh: o, key: o.userData.sourcePath ? o.userData.sourcePath.split('/').slice(1).join('/') : path });
    const seen = new Map();
    for (const c of o.children) {
      const name = c.name || 'Detail', n = seen.get(name) ?? 0;
      seen.set(name, n + 1);
      visit(c, `${path ? path + '/' : ''}${name}[${n}]`);
    }
  };
  visit(root, '');
  return out;
}

export function geometrySignature(geometry) {
  if (!geometry.boundingBox) geometry.computeBoundingBox();
  const b = geometry.boundingBox;
  return { verts: geometry.attributes.position.count, corners: geometry.index ? geometry.index.count : geometry.attributes.position.count,
    box: [...b.min.toArray(), ...b.max.toArray()].map(v => Math.round(v * 1e4) / 1e4) };
}

export const sameSignature = (a, b) => a.verts === b.verts && a.corners === b.corners && a.box.every((v, i) => Math.abs(v - b.box[i]) <= 2e-4);

// Corner list of a geometry (indexed or not).
export function cornerIndex(geometry) {
  if (geometry.index) return geometry.index.array;
  const n = geometry.attributes.position.count, out = new Uint32Array(n);
  for (let i = 0; i < n; i++) out[i] = i;
  return out;
}

// atlas.json + atlas.bin → { ...json, entries: Map key → [entry, …] } with typed arrays per entry (a key may hold one entry per
// geometry variant, told apart by the signature).
export function readAtlas(json, buffer) {
  if (json.format !== ATLAS_FORMAT) throw new Error(`skin atlas: format ${json.format}, expected ${ATLAS_FORMAT}`);
  const entries = new Map();
  for (const e of json.entries) {
    const at = (Type, offset, count) => new Type(buffer, offset, count);
    const entry = { ...e, source: at(Uint32Array, e.offset, e.n), uv: at(Uint16Array, e.offset + 4 * e.n, 2 * e.n),
      index: at(e.n > 65535 ? Uint32Array : Uint16Array, e.offset + 8 * e.n, e.corners), matrix: new THREE.Matrix4().fromArray(e.matrix),
      pos: e.pos ? at(Float32Array, e.offset + 8 * e.n + indexBytes(e.n, e.corners), 3 * e.n) : null };
    if (!entries.has(e.key)) entries.set(e.key, []);
    entries.get(e.key).push(entry);
  }
  return { ...json, entries };
}

const indexBytes = (n, corners) => Math.ceil(corners * (n > 65535 ? 4 : 2) / 4) * 4;

// Pack bake results into atlas.json (entries) and the binary: per entry source (Uint32 × n), uv (Uint16 × 2n, 0..1 normalised),
// index (Uint16 or Uint32 × corners, 4-byte aligned) and, if given, the baked positions (Float32 × 3n, mesh-local).
export function writeAtlas(meta, entries) {
  let size = 0;
  const blocks = entries.map(e => {
    const n = e.source.length, offset = size;
    size += 8 * n + indexBytes(n, e.corner.length) + (e.pos ? 12 * n : 0);
    return { e, n, offset };
  });
  const buffer = new ArrayBuffer(size);
  const json = { format: ATLAS_FORMAT, ...meta, entries: [] };
  for (const { e, n, offset } of blocks) {
    new Uint32Array(buffer, offset, n).set(e.source);
    const uv = new Uint16Array(buffer, offset + 4 * n, 2 * n);
    for (let i = 0; i < 2 * n; i++) uv[i] = Math.round(Math.min(Math.max(e.uv[i], 0), 1) * 65535);
    new (n > 65535 ? Uint32Array : Uint16Array)(buffer, offset + 8 * n, e.corner.length).set(e.corner);
    if (e.pos) new Float32Array(buffer, offset + 8 * n + indexBytes(n, e.corner.length), 3 * n).set(e.pos);
    json.entries.push({ key: e.key, name: e.name, sig: e.sig, matrix: e.matrix.map(v => +v.toPrecision(9)), n, corners: e.corner.length, offset,
      ...(e.pos ? { pos: true } : {}) });
  }
  return { json, buffer };
}

// Geometry of a mesh in its atlas: the source attributes gathered per output vertex, atlas UVs as uv, the triangle list of the
// entry, and the vertex in model metres (skinPos, skinNor) through the entry's bake matrix, so patterns stay on the part when
// it moves (explosion) and match the baked maps.
export function skinGeometry(source, entry) {
  const g = new THREE.BufferGeometry(), src = entry.source, n = src.length;
  for (const [name, attr] of Object.entries(source.attributes)) {
    if (name === 'uv') continue;
    const k = attr.itemSize, out = new attr.array.constructor(n * k);
    for (let i = 0; i < n; i++) for (let c = 0; c < k; c++) out[i * k + c] = attr.getComponent(src[i], c);
    g.setAttribute(name, new THREE.BufferAttribute(out, k, attr.normalized));
  }
  if (!g.attributes.normal) g.computeVertexNormals();
  g.setAttribute('uv', new THREE.BufferAttribute(entry.uv, 2, true));
  g.setIndex(new THREE.BufferAttribute(entry.index, 1));
  g.setAttribute('skinPos', g.attributes.position.clone().applyMatrix4(entry.matrix));
  g.setAttribute('skinNor', g.attributes.normal.clone().applyNormalMatrix(new THREE.Matrix3().getNormalMatrix(entry.matrix)));
  for (const group of source.groups) g.addGroup(group.start, group.count, group.materialIndex);
  return g;
}

// Geometry of a mesh whose vertices differ a little from its baked entry (pos required): non-indexed, every triangle takes the
// UVs of the baked triangle nearest to its centre, with its own corners expressed in that triangle's barycentric frame (exact
// for an unchanged triangle; one chart per triangle, so no triangle spans two charts).
export function transferGeometry(source, entry) {
  if (!entry.pos) throw new Error(`transferGeometry: entry ${entry.key} has no baked positions`);
  const baked = new THREE.BufferGeometry();
  baked.setAttribute('position', new THREE.BufferAttribute(entry.pos, 3));
  baked.setIndex(new THREE.BufferAttribute(entry.index.slice(), 1)); // copy: MeshBVH reorders the index in place
  const bvh = new MeshBVH(baked), g = source.index ? source.toNonIndexed() : source.clone();
  if (!g.attributes.normal) g.computeVertexNormals();
  const P = g.attributes.position, n = P.count, uv = new Float32Array(2 * n), I = baked.index.array, U = entry.uv;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), p = new THREE.Vector3(), centre = new THREE.Vector3();
  const tri = new THREE.Triangle(), bary = new THREE.Vector3(), hit = {};
  for (let t = 0; t < n; t += 3) {
    centre.set(0, 0, 0);
    for (let k = 0; k < 3; k++) centre.add(p.fromBufferAttribute(P, t + k));
    const f = bvh.closestPointToPoint(centre.multiplyScalar(1 / 3), hit)?.faceIndex ?? 0;
    const [i, j, k] = [I[3 * f], I[3 * f + 1], I[3 * f + 2]];
    tri.set(a.fromArray(entry.pos, 3 * i), b.fromArray(entry.pos, 3 * j), c.fromArray(entry.pos, 3 * k));
    for (let q = 0; q < 3; q++) {
      tri.getBarycoord(p.fromBufferAttribute(P, t + q), bary);
      for (let d = 0; d < 2; d++) uv[2 * (t + q) + d] = (bary.x * U[2 * i + d] + bary.y * U[2 * j + d] + bary.z * U[2 * k + d]) / 65535;
    }
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setAttribute('skinPos', P.clone().applyMatrix4(entry.matrix));
  g.setAttribute('skinNor', g.attributes.normal.clone().applyNormalMatrix(new THREE.Matrix3().getNormalMatrix(entry.matrix)));
  return g;
}

// Geometry without atlas entry: own vertices, skinPos/skinNor through the given matrix (mesh → model metres), no maps (uv 0).
export function unmappedGeometry(source, matrix) {
  const g = source.clone();
  if (!g.attributes.normal) g.computeVertexNormals();
  g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
  g.setAttribute('skinPos', g.attributes.position.clone().applyMatrix4(matrix));
  g.setAttribute('skinNor', g.attributes.normal.clone().applyNormalMatrix(new THREE.Matrix3().getNormalMatrix(matrix)));
  return g;
}
