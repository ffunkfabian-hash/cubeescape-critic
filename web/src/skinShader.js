// Skin mixer as a shader (0.13 "Skins"): a recipe of skins.json (layers fill, band, wear, dirt, scratches, stripes, diamond,
// chevron, emblem, filigree; since 0.20 "Livery" carbon, circuit, sparkle) is compiled to GLSL and evaluated per fragment in model metres – live on the model (skinMaterial,
// a MeshStandardMaterial) and in UV space for the texture export (skinBakeMaterial). Only ambient occlusion and the distance to
// the nearest plate edge come from the baked maps (skinAtlas.js); patterns and noise are procedural, so they stay sharp up close.
// Noise is band-limited by the fragment's footprint (octaves finer than a pixel fade to their mean) and thresholds widen by
// their screen derivative, so patterns do not shimmer from afar. Layers `tex` and `decal` read images (recipe.textures, e.g.
// material swatches and glowing motifs cut from a painted atlas by tools/skin_swatches.py): a swatch is laid triplanar in model
// space with an offset per part, a decal is projected from the front (axis z) or the side (axis x) onto the centre of each part.
//
// Per mesh the geometry carries skinInfo (layer mask, mirror sign for side R, 1 if the mesh has maps, half height of the part
// in metres) and skinCentre (part centre in model metres): roles, parts, assembly and side are judged once per mesh on the
// CPU (skinLayerMask), the facing selector and everything else per fragment. An emblem with `anchor` (a part name) is centred on
// that part instead (skinAnchor, set per skin by robotSkins.js › applySkin): the sun on the chest plate around its medallion.
import * as THREE from 'three';
import { EDGE_RANGE_MM } from './skinAtlas.js';

export const MAX_LAYERS = 24; // layer mask in a float attribute: exact up to 2^24

const glob = pattern => new RegExp(`^${pattern.replace(/[.+^${}()|\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.')}$`);
const any = (patterns, name) => patterns.some(p => glob(p).test(name ?? ''));

// Layers of the recipe that apply to a mesh described by { role, part, asm, side, kind }, as a bit mask (bit i = layer i); kind is
// the model of the mesh's atlas (body, critic, scout), so a helmet can have layers of its own (kinds / not_kinds).
export function skinLayerMask(recipe, d) {
  if (recipe.layers.length > MAX_LAYERS) throw new Error(`skin: ${recipe.layers.length} layers, at most ${MAX_LAYERS}`);
  let mask = 0;
  recipe.layers.forEach((L, i) => {
    const ok = (!L.roles || L.roles.includes(d.role)) && (!L.not_roles || !L.not_roles.includes(d.role))
      && (!L.asm || L.asm.includes(d.asm)) && (!L.side || L.side.includes(d.side))
      && (!L.kinds || L.kinds.includes(d.kind)) && (!L.not_kinds || !L.not_kinds.includes(d.kind))
      && (!L.parts || any(L.parts, d.part)) && (!L.not_parts || !any(L.not_parts, d.part));
    if (ok) mask += 2 ** i;
  });
  return mask;
}

const f = v => { const s = Number(v).toString(); return /[.e]/.test(s) ? s : s + '.0'; };
const lin = hex => { const c = new THREE.Color(hex); return `vec3(${f(c.r)}, ${f(c.g)}, ${f(c.b)})`; }; // sRGB hex → linear
const vec = a => `vec${a.length}(${a.map(f).join(', ')})`;

const COMMON = /* glsl */`
uniform sampler2D skinMaps;
varying vec3 vSkinPos;
varying vec3 vSkinNor;
varying vec4 vSkinInfo;
varying vec3 vSkinCentre;
varying vec3 vSkinAnchor;
varying vec2 vSkinUv;
struct SkinOut { vec3 base; float rough; float metal; vec3 emit; float ao; };

float skinHash(vec3 c, float seed) {
  uvec3 u = uvec3(ivec3(c));
  uint h = (u.x * 73856093u) ^ (u.y * 19349663u) ^ (u.z * 83492791u) ^ (uint(seed) * 2654435761u);
  h = (h ^ (h >> 13u)) * 1274126177u;
  h ^= h >> 16u;
  return float(h & 0xFFFFFFu) / 16777215.0;
}
float skinValue(vec3 p, float seed) {
  vec3 i = floor(p), t = fract(p);
  t = t * t * (3.0 - 2.0 * t);
  return mix(mix(mix(skinHash(i, seed), skinHash(i + vec3(1, 0, 0), seed), t.x),
                 mix(skinHash(i + vec3(0, 1, 0), seed), skinHash(i + vec3(1, 1, 0), seed), t.x), t.y),
             mix(mix(skinHash(i + vec3(0, 0, 1), seed), skinHash(i + vec3(1, 0, 1), seed), t.x),
                 mix(skinHash(i + vec3(0, 1, 1), seed), skinHash(i + vec3(1, 1, 1), seed), t.x), t.y), t.z);
}
// fractal value noise in [0, 1]; p in metres, scale in cells per metre, fw = footprint of a pixel in metres
float skinFbm(vec3 p, float scale, int octaves, float seed, float fw) {
  float total = 0.0, amp = 1.0, norm = 0.0;
  for (int o = 0; o < 6; o++) {
    if (o >= octaves) break;
    float freq = scale * exp2(float(o));
    float n = skinValue(p * freq, seed + 101.0 * float(o));
    total += amp * mix(n, 0.5, smoothstep(0.7, 1.6, fw * freq));
    norm += amp;
    amp *= 0.5;
  }
  return total / norm;
}
float skinStep(float lo, float hi, float v) { float a = fwidth(v) * 0.75; return smoothstep(lo - a, hi + a, v); }
// planar coordinates on the model axis plane the normal faces most (triplanar without blending, for fine line patterns); id 0/1/2
vec2 skinPlane(vec3 p, vec3 n, out float id) {
  vec3 a = abs(n);
  if (a.x > a.y && a.x > a.z) { id = 0.0; return p.yz; }
  if (a.y > a.z) { id = 1.0; return p.xz; }
  id = 2.0; return p.xy;
}
vec3 skinHue(float h) { return clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0); }
// anti-aliased line of width w (mm) at distance d (mm)
float skinLine(float d, float w, float aa) { return 1.0 - smoothstep(w * 0.5 - aa, w * 0.5 + aa, abs(d)); }
bool skinOn(float mask, int i) { return ((int(mask + 0.5) >> i) & 1) == 1; }
void skinApply(inout SkinOut s, float w, bool hasColor, vec3 color, bool hasRough, float rough, bool hasMetal, float metal, bool hasEmit, vec3 emit) {
  w = clamp(w, 0.0, 1.0);
  if (hasColor) s.base = mix(s.base, color, w);
  if (hasRough) s.rough = mix(s.rough, rough, w);
  if (hasMetal) s.metal = mix(s.metal, metal, w);
  if (hasEmit) s.emit = mix(s.emit, emit, w);
}
`;

// Images a recipe reads (layer.texture → sampler skinTex_<name>).
export const skinTextureNames = recipe => [...new Set(recipe.layers.filter(L => L.texture).map(L => L.texture))];
const sampler = name => `skinTex_${name.replace(/[^A-Za-z0-9_]/g, '_')}`;

// GLSL of one layer (inside skinEvaluate, variables: pos, nor, mask, u, v, hmm, edge, ao, fw, pxmm, s).
function layerCode(L, i) {
  const seed = f(L.seed ?? 0), sel = [];
  if (L.facing) {
    const d = new THREE.Vector3(...L.facing.slice(0, 3)).normalize(), c = L.facing[3] ?? 0.3;
    sel.push(`smoothstep(${f(c - 0.03)}, ${f(c + 0.03)}, dot(nor, ${vec(d.toArray())}))`);
  }
  const line = (dist, width) => `skinLine((${dist}) * hmm, ${f(width)}, aa)`;
  let w;
  switch (L.type) {
    case 'fill': w = '1.0'; break;
    case 'band': w = `smoothstep(${f(L.from_mm)} - aa, ${f(L.from_mm)} + aa, edge) * (1.0 - smoothstep(${f(L.to_mm)} - aa, ${f(L.to_mm)} + aa, edge))`; break;
    case 'wear': {
      const [lo, hi] = L.threshold ?? [0.45, 0.52];
      w = `skinStep(${f(lo)}, ${f(hi)}, (1.0 - smoothstep(0.0, ${f(L.radius_mm)}, edge)) * ${f(L.edge_weight ?? 0.55)} + (skinFbm(pos, ${f(L.noise ?? 60)}, 5, ${seed}, fw) - 0.5) * ${f(L.contrast ?? 0.75)} + 0.075) * ${f(L.amount ?? 1)}`;
      break;
    }
    case 'dirt': {
      const [lo, hi] = L.ao ?? [0.4, 0.95];
      w = `clamp((1.0 - smoothstep(${f(lo)}, ${f(hi)}, ao)) * (0.5 + n) + ${f(L.base ?? 0)} * n, 0.0, 1.0) * ${f(L.amount ?? 0.6)}`;
      return `if (skinOn(mask, ${i})) { float n = skinFbm(pos, ${f(L.noise ?? 25)}, 4, ${seed}, fw); float w = ${w}${sel.map(x => ' * ' + x).join('')};\n    ${apply(L)} }`;
    }
    case 'scratches': {
      const st = L.stretch ?? [0.05, 1, 1], [lo, hi] = L.threshold ?? [0.68, 0.72];
      return `if (skinOn(mask, ${i})) { vec3 q = pos * ${vec(st)}; float w = skinStep(${f(lo)}, ${f(hi)}, skinFbm(q, ${f(L.scale ?? 700)}, 3, ${seed}, length(fwidth(q)))) * ${f(L.amount ?? 0.5)}${sel.map(x => ' * ' + x).join('')};\n    ${apply(L)} }`;
    }
    case 'stripes': {
      const a = THREE.MathUtils.degToRad(L.angle ?? 0), ws = L.warp_scale ?? 9, width = L.width ?? 0.3;
      return `if (skinOn(mask, ${i})) {
    float axis = v * ${f(Math.cos(a))} + u * ${f(Math.sin(a))};
    float fr = fract(axis * ${f(L.freq ?? 1.6)} + (skinFbm(pos, ${f(ws)}, 3, ${seed}, fw) - 0.5) * ${f(L.warp ?? 1.2)});
    float wd = ${f(width)} * ${L.jitter === undefined ? '' : `mix(1.0, `}(0.4 + skinFbm(pos, ${f(ws * 2.3)}, 2, ${f((L.seed ?? 0) + 7)}, fw))${L.jitter === undefined ? '' : `, ${f(L.jitter)})`};
    float e = abs(fr - 0.5) * 2.0, ea = max(fwidth(e), 0.001);
    float w = (1.0 - smoothstep(wd - 0.03 - ea, wd + 0.03 + ea, e))${region(L)}${sel.map(x => ' * ' + x).join('')};
    ${apply(L)} }`;
    }
    case 'diamond': {
      const [cu, cv] = L.center ?? [0, 0];
      w = (L.radii ?? [0.6]).map(r => line(`abs(u - ${f(cu)}) * ${f(L.aspect ?? 1)} + abs(v - ${f(cv)}) - ${f(r)}`, L.width_mm ?? 3)).join(' + ') + region(L);
      break;
    }
    case 'chevron': {
      const fq = L.freq ?? 2;
      return `if (skinOn(mask, ${i})) { float d = (v + abs(u) * ${f(L.slope ?? 0.8)}) * ${f(fq)}; float w = ${line(`(d - floor(d + 0.5)) / ${f(fq)}`, L.width_mm ?? 6)}${region(L)}${sel.map(x => ' * ' + x).join('')};\n    ${apply(L)} }`;
    }
    case 'emblem': {
      const [cu, cv] = L.center ?? [0, 0], R = L.radius ?? 0.35, rays = L.rays ?? 8, wmm = L.width_mm ?? 4;
      const [ou, ov] = L.anchor ? ['(pos.x - vSkinAnchor.x) / hy * vSkinInfo.y', '(pos.y - vSkinAnchor.y) / hy'] : ['u', 'v'];
      return `if (skinOn(mask, ${i})) {
    float ru = ${ou} - ${f(cu)}, rv = ${ov} - ${f(cv)}, r = length(vec2(ru, rv));
    float ang = atan(rv, ru) * ${f(rays / (2 * Math.PI))};
    float ring = ${line(`r - ${f(R)}`, wmm)};
    float ray = ${line(`(ang - floor(ang + 0.5)) * ${f(2 * Math.PI / rays)} * r`, wmm)} * step(${f(R * 1.15)}, r) * step(r, ${f(R * (L.ray_length ?? 1.7))});
    float w = clamp(ring + ray + step(r, ${f(R * (L.core ?? 0.45))}), 0.0, 1.0)${region(L)}${sel.map(x => ' * ' + x).join('')};
    ${apply(L)} }`;
    }
    case 'tex': {     // material swatch, triplanar in model space; offset per part so neighbouring parts do not repeat the same spot
      const T = sampler(L.texture), k = f(1000 / (L.tile_mm ?? 150)), mode = L.mode ?? 'replace';
      const col = mode === 'multiply' ? 's.base * c * 2.0' : mode === 'overlay' ? 'mix(s.base, s.base * c / max(vec3(0.05), avg), 1.0)' : 'c';
      return `if (skinOn(mask, ${i})) {
    vec3 off = vec3(skinHash(vSkinCentre * 997.0, ${seed}), skinHash(vSkinCentre * 991.0, ${f((L.seed ?? 0) + 1)}), skinHash(vSkinCentre * 983.0, ${f((L.seed ?? 0) + 2)})) * 7.0;
    vec3 tp = pos * ${k} + off, bw = pow(abs(nor), vec3(4.0)); bw /= bw.x + bw.y + bw.z;
    vec3 c = texture2D(${T}, tp.yz).rgb * bw.x + texture2D(${T}, tp.xz).rgb * bw.y + texture2D(${T}, tp.xy).rgb * bw.z;
    vec3 avg = textureLod(${T}, vec2(0.5), 20.0).rgb;
    float w = ${f(L.opacity ?? 1)}${region(L)}${sel.map(x => ' * ' + x).join('')};
    s.base = mix(s.base, ${col}, w);
    ${'rough' in L || 'metal' in L ? `skinApply(s, w, false, vec3(0), ${'rough' in L}, ${f(L.rough ?? 0)}, ${'metal' in L}, ${f(L.metal ?? 0)}, false, vec3(0));` : ''} }`;
    }
    case 'decal': {   // one motif of a sheet (grid × grid cells, count used) per part, chosen by the part centre (mirror-symmetric)
      const T = sampler(L.texture), g = L.grid ?? 4, n = L.count ?? g * g, [cu, cv] = L.center ?? [0, 0], size = L.size ?? 0.8;
      const side = (L.axis ?? 'z') === 'x';
      return `if (skinOn(mask, ${i})) {
    vec3 lc = (pos - vSkinCentre) / hy;
    float face = ${side ? 'abs(nor.x)' : 'nor.z'};
    vec2 q = vec2(${side ? 'lc.z * sign(nor.x)' : 'lc.x'} - ${f(cu)}, lc.y - ${f(cv)}) / ${f(size)} * 0.5 + 0.5;
    float inside = step(0.0, q.x) * step(q.x, 1.0) * step(0.0, q.y) * step(q.y, 1.0);
    float cell = floor(skinHash(vec3(abs(vSkinCentre.x), vSkinCentre.yz) * 1000.0, ${seed}) * ${f(n)});
    vec2 cuv = vec2((mod(cell, ${f(g)}) + clamp(q.x, 0.0, 1.0)) / ${f(g)}, 1.0 - (floor(cell / ${f(g)}) + 1.0 - clamp(q.y, 0.0, 1.0)) / ${f(g)});
    vec4 d = texture2D(${T}, cuv);
    float w = d.a * inside * smoothstep(${f((L.min_facing ?? 0.45) - 0.05)}, ${f((L.min_facing ?? 0.45) + 0.05)}, face) * ${f(L.opacity ?? 1)}${sel.map(x => ' * ' + x).join('')};
    s.base = mix(s.base, d.rgb, w);
    s.emit = mix(s.emit, d.rgb * ${f(L.glow ?? 0)}, w);
    s.rough = mix(s.rough, ${f(L.rough ?? 0.35)}, w); }`;
    }
    case 'carbon': {  // twill weave (2/2) of fibre tows, cell_mm per tow, on the facing axis plane; fades to its mean below a pixel
      const cell = L.cell_mm ?? 3, [ca, cb] = [L.color ?? '#121316', L.color2 ?? '#34373D'];
      return `if (skinOn(mask, ${i})) {
    float id; vec2 q = skinPlane(pos, nor, id) * ${f(1000 / cell)};
    vec2 c = floor(q), t = fract(q);
    float over = step(mod(c.x + c.y, 4.0), 1.5);
    float tow = sin(mix(t.x, t.y, over) * 3.14159265);
    float shade = mix(mix(0.45, 1.0, over) * (0.3 + 0.7 * tow), 0.55, smoothstep(0.3, 0.8, pxmm / ${f(cell)}));
    float w = ${f(L.opacity ?? 1)}${region(L)}${sel.map(x => ' * ' + x).join('')};
    skinApply(s, w, true, mix(${lin(ca)}, ${lin(cb)}, shade), ${'rough' in L}, ${f(L.rough ?? 0)} + 0.12 * (1.0 - shade), ${'metal' in L}, ${f(L.metal ?? 0)}, false, vec3(0)); }`;
    }
    case 'circuit': { // circuit traces on a grid of cell_mm: an edge between two cells is a trace with probability density (shared by
      // both cells, so traces connect), dead ends get a pad; colour fixed or a rainbow over the model (hue_per_m), glowing with emit
      const cell = L.cell_mm ?? 10, p = L.density ?? 0.45, pad = L.pad_mm ?? 1.5;
      const rainbow = L.hue_per_m != null;
      const col = rainbow ? `pow(skinHue(dot(pos, vec3(0.35, 1.0, 0.2)) * ${f(L.hue_per_m)} + ${f(L.hue ?? 0)}), vec3(2.2))` : lin(L.color ?? '#FFFFFF');
      return `if (skinOn(mask, ${i})) {
    float id; vec2 q = skinPlane(pos, nor, id) * ${f(1000 / cell)};
    vec2 c = floor(q), t = fract(q) - 0.5;
    float r = step(skinHash(vec3(c, id * 2.0), ${seed}), ${f(p)}), l = step(skinHash(vec3(c - vec2(1, 0), id * 2.0), ${seed}), ${f(p)});
    float up = step(skinHash(vec3(c, id * 2.0 + 1.0), ${seed}), ${f(p)}), dn = step(skinHash(vec3(c - vec2(0, 1), id * 2.0 + 1.0), ${seed}), ${f(p)});
    float big = 1e3, d = big;
    d = min(d, mix(big, t.x >= 0.0 ? abs(t.y) : length(t), r));
    d = min(d, mix(big, t.x <= 0.0 ? abs(t.y) : length(t), l));
    d = min(d, mix(big, t.y >= 0.0 ? abs(t.x) : length(t), up));
    d = min(d, mix(big, t.y <= 0.0 ? abs(t.x) : length(t), dn));
    float ends = r + l + up + dn;
    float w = skinLine(d * ${f(cell)}, ${f(L.width_mm ?? 0.8)}, aa) * step(0.5, ends);
    w = max(w, step(0.5, ends) * step(ends, 1.5) * (1.0 - smoothstep(${f(pad)} - aa, ${f(pad)} + aa, length(t) * ${f(cell)})));
    w *= (1.0 - smoothstep(0.2, 0.45, pxmm / ${f(cell)}))${region(L)}${sel.map(x => ' * ' + x).join('')} * ${f(L.opacity ?? 1)};
    vec3 col = ${col};
    skinApply(s, w, true, col, ${'rough' in L}, ${f(L.rough ?? 0)}, ${'metal' in L}, ${f(L.metal ?? 0)}, ${!!L.emit}, col * ${f(L.emit_strength ?? 1)}); }`;
    }
    case 'sparkle': { // stars: one jittered point per cell of cell_mm in 3D, a share `density` of them shines, size up to size_mm
      const cell = L.cell_mm ?? 12;
      return `if (skinOn(mask, ${i})) {
    vec3 q = pos * ${f(1000 / cell)}, c = floor(q), t = fract(q) - 0.5;
    vec3 o = vec3(skinHash(c, ${f((L.seed ?? 0) + 1)}), skinHash(c, ${f((L.seed ?? 0) + 2)}), skinHash(c, ${f((L.seed ?? 0) + 3)})) - 0.5;
    float h = skinHash(c, ${seed}), size = ${f(L.size_mm ?? 1.2)} * (0.35 + 0.65 * fract(h * 7.31));
    float w = step(${f(1 - (L.density ?? 0.25))}, h) * (1.0 - smoothstep(size * 0.25, size + aa, length(t - o * 0.6) * ${f(cell)}));
    w *= (1.0 - smoothstep(0.25, 0.6, pxmm / ${f(cell)}))${region(L)}${sel.map(x => ' * ' + x).join('')};
    ${apply(L)} }`;
    }
    case 'filigree': {
      const rings = L.rings ?? 9, scale = L.scale ?? 40, wmm = L.width_mm ?? 1.2;
      return `if (skinOn(mask, ${i})) {
    float band = smoothstep(${f(L.from_mm - 1)}, ${f(L.from_mm)}, edge) * (1.0 - smoothstep(${f(L.to_mm)}, ${f(L.to_mm + 1)}, edge));
    float n = skinFbm(pos, ${f(scale)}, 3, ${seed}, fw) * ${f(rings)};
    float iso = abs(n - floor(n + 0.5)) * ${f(1000 / (rings * scale))};
    float w = band * (1.0 - smoothstep(${f(wmm / 2)} - aa, ${f(wmm / 2)} + max(aa, pxmm), iso))${sel.map(x => ' * ' + x).join('')};
    ${apply(L)} }`;
    }
    default: throw new Error(`skin: unknown layer type ${JSON.stringify(L.type)}`);
  }
  return `if (skinOn(mask, ${i})) { float w = (${w})${sel.map(x => ' * ' + x).join('')};\n    ${apply(L)} }`;
}

function region(L) {
  if (!L.region) return '';
  const [u0, u1, v0, v1] = L.region;
  return ` * step(${f(u0)}, u) * step(u, ${f(u1)}) * step(${f(v0)}, v) * step(v, ${f(v1)})`;
}

function apply(L) {
  const emit = L.emit ? new THREE.Color(L.emit).multiplyScalar(L.emit_strength ?? 1) : null;
  return `w *= ${f(L.opacity ?? 1)}; skinApply(s, w, ${!!L.color}, ${L.color ? lin(L.color) : 'vec3(0)'}, ${'rough' in L}, ${f(L.rough ?? 0)}, ${'metal' in L}, ${f(L.metal ?? 0)}, ${!!L.emit}, ${emit ? vec(emit.toArray()) : 'vec3(0)'});`
    + (L.dark ? ` s.base *= 1.0 - ${f(L.dark)} * w;` : '');
}

// GLSL function SkinOut skinEvaluate() for a recipe (reads the varyings and skinMaps).
export function skinGLSL(recipe) {
  return `${COMMON}
${skinTextureNames(recipe).map(n => `uniform sampler2D ${sampler(n)};`).join('\n')}
SkinOut skinEvaluate() {
  SkinOut s = SkinOut(vec3(0.0), 0.6, 0.0, vec3(0.0), 1.0);
  vec3 pos = vSkinPos, nor = normalize(vSkinNor);
  float mask = vSkinInfo.x, hy = max(vSkinInfo.w, 1e-4), hmm = hy * 1000.0;
  float fw = max(length(fwidth(pos)), 1e-6), pxmm = fw * 1000.0, aa = max(pxmm * 0.75, 0.05);
  vec3 lp = (pos - vSkinCentre) / hy;
  float u = lp.x * vSkinInfo.y, v = lp.y;
  float edge = ${f(EDGE_RANGE_MM)}, ao = 1.0;
  if (vSkinInfo.z > 0.5) {
    vec3 m = texture2D(skinMaps, vSkinUv).rgb;
    ao = m.r;
    edge = m.g * m.g * ${f(EDGE_RANGE_MM)};
  }
  s.ao = ao;
  ${recipe.layers.map(layerCode).join('\n  ')}
  s.rough = clamp(s.rough, 0.02, 1.0);
  s.metal = clamp(s.metal, 0.0, 1.0);
  return s;
}
`;
}

const VERTEX_DECL = /* glsl */`
attribute vec3 skinPos;
attribute vec3 skinNor;
attribute vec4 skinInfo;
attribute vec3 skinCentre;
attribute vec3 skinAnchor;
varying vec3 vSkinPos;
varying vec3 vSkinNor;
varying vec4 vSkinInfo;
varying vec3 vSkinCentre;
varying vec3 vSkinAnchor;
varying vec2 vSkinUv;
`;
const VERTEX_SET = 'vSkinPos = skinPos; vSkinNor = skinNor; vSkinInfo = skinInfo; vSkinCentre = skinCentre; vSkinAnchor = skinAnchor; vSkinUv = uv;';

// Live material of a recipe on the meshes of one atlas (maps: texture of maps.png, linear, no flip; textures: name → image
// texture of the recipe's tex/decal layers, sRGB, repeating).
export function skinMaterial(key, recipe, maps, textures = {}) {
  const m = new THREE.MeshStandardMaterial({ name: `skin_${key}`, roughness: 1, metalness: 1 });
  const glow = { value: recipe.emissive_intensity ?? 1 };
  m.userData.skin = { key, glow };
  const fragment = skinGLSL(recipe);
  m.onBeforeCompile = shader => {
    shader.uniforms.skinMaps = { value: maps };
    shader.uniforms.skinGlow = glow;
    for (const n of skinTextureNames(recipe)) shader.uniforms[sampler(n)] = { value: textures[n] ?? null };
    shader.vertexShader = shader.vertexShader.replace('#include <common>', `#include <common>\n${VERTEX_DECL}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>\n${VERTEX_SET}`);
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>\n${fragment}\nuniform float skinGlow;`)
      .replace('#include <color_fragment>', '#include <color_fragment>\nSkinOut skin = skinEvaluate();\ndiffuseColor.rgb = skin.base;')
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = skin.rough;')
      .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor = skin.metal;')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += skin.emit * skinGlow;')
      .replace('#include <aomap_fragment>', /* glsl */`
  float ambientOcclusion = skin.ao;
  reflectedLight.indirectDiffuse *= ambientOcclusion;
  #if defined( USE_ENVMAP ) && defined( STANDARD )
    float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
    reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
  #endif`);
  };
  m.customProgramCacheKey = () => `skin_${key}_${fragment.length}`;
  return m;
}

// Texture bake of a recipe: the mesh rasterised in its atlas UVs; output 0 base colour (sRGB), 1 ORM (R ambient occlusion,
// G roughness, B metalness; glTF order), 2 emission (sRGB, before the skin's emissive intensity). Alpha = coverage.
export function skinBakeMaterial(recipe, maps, textures = {}) {
  const output = { value: 0 };
  const m = new THREE.ShaderMaterial({
    name: 'skin_bake', side: THREE.DoubleSide, depthTest: false, depthWrite: false,
    uniforms: { skinMaps: { value: maps }, skinOutput: output,
      ...Object.fromEntries(skinTextureNames(recipe).map(n => [sampler(n), { value: textures[n] ?? null }])) },
    vertexShader: `${VERTEX_DECL}\nvoid main() { ${VERTEX_SET} gl_Position = vec4(uv * 2.0 - 1.0, 0.0, 1.0); }`,
    fragmentShader: `${skinGLSL(recipe)}
uniform int skinOutput;
vec3 skinSRGB(vec3 c) { c = clamp(c, 0.0, 1.0); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
void main() {
  SkinOut s = skinEvaluate();
  gl_FragColor = vec4(skinOutput == 0 ? skinSRGB(s.base) : skinOutput == 1 ? vec3(s.ao, s.rough, s.metal) : skinSRGB(s.emit), 1.0);
}`,
  });
  m.userData.output = output;
  return m;
}
