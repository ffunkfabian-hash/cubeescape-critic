// Aged look for the Ballon robot bodies (0.11 "Patina"): a real-time approximation of the Cycles material aaa_nodes() of
// cubeescape-ballon (basic/kit.py, skin 'standard'). The GLB keeps flat colours per role (MT_<role>_color); this module adds per
// role roughness variation, micro relief, edge wear and fine scratches in the shader (parameters: robotWearParams.json).
// Cycles finds edges with the raytraced Bevel node; here every mesh is split into triangles once and each triangle carries its
// barycentric corner and, per edge, its height above that edge if the edge wears (see prepareWearGeometry). The fragment's
// distance to the nearest wear edge of its own triangle is then min(bary_i · h_i) in object metres, as in Cycles' radius.
// Cavity dirt (Cycles AO) is left to the viewer's GTAO pass.
import * as THREE from 'three';
import P from './robotWearParams.json' with { type: 'json' };

export const WEAR_PARAMS = P;

// Non-indexed copy of geometry with attributes wearBary (corner 0/1/2) and wearEdge (per triangle: height above the edge
// opposite corner i, or −1 when that edge is not a wear edge). Like Cycles' Bevel node, edges are judged by the shading normals,
// not by the facets: an edge wears when the normals jump across it (> sharpAngleDeg, hard or flat-shaded edge), when it borders a
// rounded triangle (normals turning by ≥ sharpAngleDeg faster than roundDegPerMm, i.e. a bevel strip that wears entirely), or when it
// is an open boundary. Smooth-shaded facets of a curved shell stay clean. Positions are matched across split vertices.
export function prepareWearGeometry(geometry, sharpAngleDeg = P.sharpAngleDeg, roundDegPerMm = P.roundDegPerMm) {
  const g = geometry.index ? geometry.toNonIndexed() : geometry.clone();
  if (!g.attributes.normal) g.computeVertexNormals();
  const pos = g.attributes.position.array, nor = g.attributes.normal.array, tris = pos.length / 9;
  const key = i => `${Math.round(pos[i * 3] * 1e5)},${Math.round(pos[i * 3 + 1] * 1e5)},${Math.round(pos[i * 3 + 2] * 1e5)}`;
  const ids = new Map(), vid = new Int32Array(tris * 3);
  for (let i = 0; i < tris * 3; i++) { const k = key(i); if (!ids.has(k)) ids.set(k, ids.size); vid[i] = ids.get(k); }
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), n = new THREE.Vector3();
  const N = i => new THREE.Vector3(nor[i * 3], nor[i * 3 + 1], nor[i * 3 + 2]).normalize();
  const area2 = new Float32Array(tris), rounded = new Uint8Array(tris);
  for (let t = 0; t < tris; t++) {
    a.fromArray(pos, t * 9); b.fromArray(pos, t * 9 + 3); c.fromArray(pos, t * 9 + 6);
    area2[t] = n.subVectors(c, b).cross(a.clone().sub(b)).length();
    // fastest turn of the shading normal between two corners, in degrees per mm of their distance (long thin strips too)
    // only turns of at least sharpAngleDeg count: tiny bevels on shallow creases and slivers stay clean
    const P3 = [a, b, c], rate = [[0, 1], [1, 2], [0, 2]].map(([i, j]) => {
      const deg = THREE.MathUtils.radToDeg(N(t * 3 + i).angleTo(N(t * 3 + j)));
      return deg < sharpAngleDeg ? 0 : deg / Math.max(P3[i].distanceTo(P3[j]) * 1000, 1e-6);
    });
    rounded[t] = area2[t] > 0 && Math.max(...rate) > roundDegPerMm ? 1 : 0;
  }
  // edge opposite corner i → [triangle, corner] pairs sharing it
  const edges = new Map(), ends = (t, i) => [t * 3 + (i + 1) % 3, t * 3 + (i + 2) % 3], edgeKey = (t, i) => {
    const [p, q] = ends(t, i).map(j => vid[j]);
    return p < q ? `${p}_${q}` : `${q}_${p}`;
  };
  for (let t = 0; t < tris; t++) for (let i = 0; i < 3; i++) {
    const k = edgeKey(t, i);
    if (!edges.has(k)) edges.set(k, []);
    edges.get(k).push([t, i]);
  }
  const cosSharp = Math.cos(THREE.MathUtils.degToRad(sharpAngleDeg));
  const jump = (t, i, u, j) => { // shading normals at the shared end points differ across the edge
    const mine = ends(t, i), theirs = ends(u, j);
    return mine.some(m => { const o = theirs.find(x => vid[x] === vid[m]); return N(m).dot(N(o)) < cosSharp; });
  };
  const bary = new Uint8Array(tris * 9), edge = new Float32Array(tris * 9);
  for (let t = 0; t < tris; t++) {
    const h = [-1, -1, -1];
    for (let i = 0; i < 3; i++) {
      if (!area2[t]) break;
      const share = edges.get(edgeKey(t, i)).filter(([u]) => u !== t && area2[u] > 0);
      const wears = rounded[t] || share.length === 0 || share.some(([u, j]) => rounded[u] || jump(t, i, u, j));
      if (!wears) continue;
      b.fromArray(pos, t * 9 + ((i + 1) % 3) * 3); c.fromArray(pos, t * 9 + ((i + 2) % 3) * 3);
      h[i] = area2[t] / Math.max(b.distanceTo(c), 1e-9);
    }
    for (let k = 0; k < 3; k++) { bary[t * 9 + k * 3 + k] = 255; edge.set(h, t * 9 + k * 3); }
  }
  g.setAttribute('wearBary', new THREE.BufferAttribute(bary, 3, true));
  g.setAttribute('wearEdge', new THREE.BufferAttribute(edge, 3));
  return g;
}

export const roleOf = material => /^MT_(.+)_color$/.exec(material?.name ?? '')?.[1] ?? null;

const NOISE = /* glsl */`
varying vec3 vWearPos;
varying vec3 vWearBary;
varying vec3 vWearEdge;
uniform float wearUnit;
float wHash(vec3 p) { p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yxz + 33.33); return fract((p.x + p.y) * p.z); }
float wValue(vec3 p) {
  vec3 i = floor(p), f = fract(p), u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(mix(wHash(i), wHash(i + vec3(1,0,0)), u.x), mix(wHash(i + vec3(0,1,0)), wHash(i + vec3(1,1,0)), u.x), u.y),
             mix(mix(wHash(i + vec3(0,0,1)), wHash(i + vec3(1,0,1)), u.x), mix(wHash(i + vec3(0,1,1)), wHash(i + vec3(1,1,1)), u.x), u.y), u.z);
}
// Blender Map Range (linear, clamped)
float wRange(float x, float a, float b) { return clamp((x - a) / (b - a), 0.0, 1.0); }
// fBm in [0,1] like Blender's Noise Fac; octaves finer than a pixel fade to their mean (no sparkle at a distance)
float wNoise(vec3 p, float scale) {
  float px = length(fwidth(p)) * scale, sum = 0.0, amp = 0.5, norm = 0.0, f = scale;
  for (int o = 0; o < 4; o++) {
    float fade = clamp(1.5 - px * f / scale, 0.0, 1.0);
    sum += amp * mix(0.5, wValue(p * f + float(o) * 17.13), fade); norm += amp; amp *= 0.5; f *= 2.0;
  }
  return sum / norm;
}`;

// Per-role shader patch on a clone of the GLB material.
export function wearMaterial(source, role, unit) {
  const r = P.roles[role];
  if (!r) return source;
  const m = r.specular !== undefined ? THREE.MeshStandardMaterial.prototype.copy.call(new THREE.MeshPhysicalMaterial(), source) : source.clone();
  if (r.specular !== undefined) {
    m.defines = { STANDARD: '', PHYSICAL: '' }; // the standard copy() sets STANDARD only; without PHYSICAL specular is ignored
    m.specularIntensity = r.specular;
  }
  if (r.color) m.color.set(r.color);
  m.name = `${source.name}_aged`;
  m.userData.wearRole = role;
  const u = { wearUnit: { value: unit }, wearColor: { value: new THREE.Color(P.wear.color) }, scratchColor: { value: new THREE.Color(P.scratch.color) } };
  m.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, u);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\nattribute vec3 wearBary;\nattribute vec3 wearEdge;\nvarying vec3 vWearPos;\nvarying vec3 vWearBary;\nvarying vec3 vWearEdge;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>\nvWearPos = position; vWearBary = wearBary; vWearEdge = wearEdge;`);
    const f = (x) => x.toFixed(5);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${NOISE}\nuniform vec3 wearColor;\nuniform vec3 scratchColor;`)
      .replace('#include <map_fragment>', `#include <map_fragment>
        float wearMask = 0.0;
        ${r.wear ? `{
          // bary clamped: with MSAA a pixel centre may lie just outside its triangle; edges without wear carry −1
          vec3 dist = mix(vec3(1e3), max(vWearBary, 0.0) * vWearEdge, step(0.0, vWearEdge));
          float d = min(min(dist.x, dist.y), dist.z);
          float edge = 1.0 - smoothstep(0.0, ${f(P.wear.radius)}, d);
          wearMask = ${f(r.wear)} * wRange(edge * wNoise(vWearPos, ${f(P.wear.breakupScale)}), ${f(P.wear.threshold[0])}, ${f(P.wear.threshold[1])});
        }` : ''}
        diffuseColor.rgb = mix(diffuseColor.rgb, wearColor, wearMask);
        ${r.scratch ? `{
          float s = wRange(wNoise(vWearPos * vec3(${f(P.scratch.stretchX)}, 1.0, 1.0), ${f(P.scratch.scale)}),
            ${f(P.scratch.threshold[0])}, ${f(P.scratch.threshold[1])});
          diffuseColor.rgb = mix(diffuseColor.rgb, scratchColor, ${f(P.scratch.amount)} * s);
        }` : ''}`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        roughnessFactor *= mix(${f(P.roughness.min)}, ${f(P.roughness.max)}, wNoise(vWearPos, ${f(P.roughness.scale)}));
        roughnessFactor = mix(roughnessFactor, ${f(P.wear.roughness)}, wearMask);`)
      .replace('#include <metalnessmap_fragment>', `#include <metalnessmap_fragment>\nmetalnessFactor = mix(metalnessFactor, ${f(P.wear.metalness)}, wearMask);`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        ${r.bump ? `{
          // Blender Bump node: height = Fac · distance, strength blends towards the bumped normal (heights in view units)
          float hgt = wNoise(vWearPos, ${f(r.bump[0])}) * ${f(P.bumpDistance)} * wearUnit;
          vec3 sx = dFdx(-vViewPosition), sy = dFdy(-vViewPosition);
          vec3 r1 = cross(sy, normal), r2 = cross(normal, sx);
          float det = dot(sx, r1) * faceDirection;
          vec3 grad = sign(det) * (dFdx(hgt) * r1 + dFdy(hgt) * r2);
          vec3 bumped = normalize(abs(det) * normal - grad);
          normal = normalize(mix(normal, bumped, ${f(r.bump[1])}));
        }` : ''}`);
  };
  m.customProgramCacheKey = () => `robotWear_${role}_${unit.toFixed(4)}`;
  return m;
}

// Switch a loaded robot (robotBodies.loadRobot) between the flat GLB look and the aged look. Geometry and materials are
// prepared once per mesh and kept (also while flat), so toggling is cheap; unit = world units per object metre (the viewer's
// fit scale). The state lives in a WeakMap, not in userData: GLTFExporter writes userData as extras.
const state = new WeakMap();
export function setRobotWear(model, on) {
  const unit = model.children[0].scale.x;
  const shared = new Map();
  model.traverse(o => {
    if (!o.isMesh) return;
    if (!state.has(o)) state.set(o, { flat: { geometry: o.geometry, material: o.material } });
    const d = state.get(o);
    const role = roleOf(d.flat.material);
    if (on && role && P.roles[role]) {
      if (!d.aged) {
        if (!shared.has(d.flat.material)) shared.set(d.flat.material, wearMaterial(d.flat.material, role, unit));
        d.aged = { geometry: prepareWearGeometry(d.flat.geometry), material: shared.get(d.flat.material) };
      }
      o.geometry = d.aged.geometry; o.material = d.aged.material;
    } else {
      o.geometry = d.flat.geometry; o.material = d.flat.material;
    }
  });
  state.set(model, on);
}

export const robotWearOn = model => state.get(model) === true;
