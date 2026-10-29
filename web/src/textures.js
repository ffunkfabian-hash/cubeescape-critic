// Procedural canvas maps (bump / roughness / colour) and a box-projection UV helper for CSG results.
import * as THREE from 'three';
import { rng } from './geo.js';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';

export const DENOISE_SEED = 47;

// GTAOPass otherwise creates a fresh random denoising pattern on every page load.
export function denoiseTexture(seed = DENOISE_SEED, size = 64) {
  const simplex = new SimplexNoise({ random: rng(seed) });
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    for (let channel = 0; channel < 4; channel++) {
      data[(y * size + x) * 4 + channel] = (simplex.noise(y + (channel % 2) * size,
        x + Math.floor(channel / 2) * size) * 0.5 + 0.5) * 255;
    }
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.UnsignedByteType);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

function canvas(w, h = w) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')];
}

function tex(c, repeat = [1, 1], color = false) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(...repeat);
  t.anisotropy = 8;
  if (color) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Tileable two-octave value noise, 0..1.
function valueNoise(size, cells, r) {
  const grid = Array.from({ length: cells * cells }, r);
  const out = new Float32Array(size * size);
  const s = (t) => t * t * (3 - 2 * t);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const gx = (x / size) * cells, gy = (y / size) * cells;
      const x0 = Math.floor(gx), y0 = Math.floor(gy), fx = s(gx - x0), fy = s(gy - y0);
      const v = (i, j) => grid[((y0 + j) % cells) * cells + ((x0 + i) % cells)];
      out[y * size + x] = (v(0, 0) * (1 - fx) + v(1, 0) * fx) * (1 - fy) + (v(0, 1) * (1 - fx) + v(1, 1) * fx) * fy;
    }
  }
  return out;
}

function grayImage(size, fn) {
  const [c, ctx] = canvas(size);
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const v = Math.max(0, Math.min(255, Math.round(255 * fn(i))));
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

// Leathery stipple for textured white inserts.
export function stippleMap(seed = 3) {
  const r = rng(seed);
  const a = valueNoise(256, 48, r), b = valueNoise(256, 12, r);
  return tex(grayImage(256, (i) => 0.55 * a[i] + 0.3 * b[i] + 0.15 * r()), [1, 1]);
}

// Subtle grain and smudges for the matte dark shell: [bump, roughness].
export function shellMaps(seed = 11) {
  const r = rng(seed);
  const fine = valueNoise(512, 128, r), smudge = valueNoise(512, 6, r);
  const bump = tex(grayImage(512, (i) => 0.5 + 0.5 * (fine[i] - 0.5) + 0.15 * (r() - 0.5)));
  const rough = tex(grayImage(512, (i) => 0.78 + 0.22 * (smudge[i] - 0.5)));
  return [bump, rough];
}

// Readable powder-coat grain on the curved crown, without changing its silhouette.
// The normal map is exported in core glTF, so the relief also survives in viewers.
export function crownMaps(seed = 73) {
  const size = 512, random = rng(seed);
  const coat = valueNoise(size, 56, random), fine = valueNoise(size, 144, random);
  const wear = valueNoise(size, 10, random);
  const height = Float32Array.from(coat, (v, i) => 0.66 * v + 0.24 * fine[i] + 0.1 * wear[i]);
  const color = grayImage(size, i => 0.90 + 0.07 * coat[i] + 0.03 * fine[i]);
  const [normal, ctx] = canvas(size), pixels = ctx.createImageData(size, size);
  const sample = (x, y) => height[((y + size) % size) * size + (x + size) % size];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const nx = (sample(x - 1, y) - sample(x + 1, y)) * 0.45;
    // Canvas rows run downwards; tangent-space +Y runs upwards after flipY.
    const ny = (sample(x, y + 1) - sample(x, y - 1)) * 0.45;
    const length = Math.hypot(nx, ny, 1), i = (y * size + x) * 4;
    pixels.data[i] = Math.round((nx / length * 0.5 + 0.5) * 255);
    pixels.data[i + 1] = Math.round((ny / length * 0.5 + 0.5) * 255);
    pixels.data[i + 2] = Math.round((1 / length * 0.5 + 0.5) * 255);
    pixels.data[i + 3] = 255;
  }
  ctx.putImageData(pixels, 0, 0);
  const roughness = grayImage(size, i => 0.68 + 0.16 * coat[i] + 0.08 * wear[i]);
  return [tex(color, [1, 1], true), tex(normal), tex(roughness)];
}

// Worn paint for the white armour: soft dirt clouds, fine grain and short scratches: [colour, roughness].
export function grimeMaps(seed = 21) {
  const r = rng(seed);
  const S = 512;
  const cloud = valueNoise(S, 8, r), mid = valueNoise(S, 32, r), fine = valueNoise(S, 160, r);
  const [c, ctx] = canvas(S);
  const img = ctx.createImageData(S, S);
  for (let i = 0; i < S * S; i++) {
    const v = 0.93 + 0.05 * (cloud[i] - 0.5) * 2 + 0.025 * (mid[i] - 0.5) * 2 + 0.02 * (fine[i] - 0.5) * 2;
    const g = Math.round(255 * Math.min(1, v));
    img.data[i * 4] = g;
    img.data[i * 4 + 1] = g;
    img.data[i * 4 + 2] = Math.round(g * 0.985);
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  ctx.lineCap = 'round';
  for (let k = 0; k < 140; k++) {
    const x = r() * S, y = r() * S, a = r() * Math.PI, l = 4 + r() * 22;
    ctx.strokeStyle = r() < 0.6 ? 'rgba(90,90,88,0.35)' : 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 0.6 + r() * 0.8;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
    ctx.stroke();
  }
  const rough = tex(grayImage(S, (i) => 0.75 + 0.25 * cloud[i]), [1, 1]);
  return [tex(c, [1, 1], true), rough];
}

// Honeycomb perforation tile: [colour map (dark holes), bump map]. UVs in model units; `cell` = hole spacing.
export function honeycombMaps(cell = 0.013) {
  const W = 64, H = Math.round(W * Math.sqrt(3));
  const draw = (ctx, bg, hole) => {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = hole;
    const rr = W * 0.34;
    const centres = [[0, 0], [W, 0], [0, H], [W, H], [W / 2, H / 2]];
    for (const [cx, cy] of centres) {
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = Math.PI / 6 + (k * Math.PI) / 3;
        ctx[k ? 'lineTo' : 'moveTo'](cx + rr * Math.cos(a), cy + rr * Math.sin(a));
      }
      ctx.fill();
    }
  };
  const [c1, x1] = canvas(W, H);
  draw(x1, '#b9b9b5', '#151515');
  const [c2, x2] = canvas(W, H);
  draw(x2, '#ffffff', '#000000');
  const rep = [1 / cell, 1 / (cell * Math.sqrt(3))];
  return [tex(c1, rep, true), tex(c2, rep)];
}

// Pick one projection per triangle. Choosing per vertex lets interpolated normals
// switch axes inside a triangle, stretching scratches into large triangular patches.
export function boxProjectUV(geo, scale = 1) {
  if (geo.index) {
    const expanded = geo.toNonIndexed();
    geo.copy(expanded);
    expanded.dispose();
  }
  const p = geo.attributes.position;
  const uv = new Float32Array(p.count * 2);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  for (let i = 0; i < p.count; i += 3) {
    a.fromBufferAttribute(p, i); b.fromBufferAttribute(p, i + 1); c.fromBufferAttribute(p, i + 2);
    const n = b.sub(a).cross(c.sub(a));
    const ax = Math.abs(n.x), ay = Math.abs(n.y), az = Math.abs(n.z);
    for (let j = i; j < i + 3; j++) {
      const [u, v] = ax >= ay && ax >= az ? [p.getZ(j), p.getY(j)]
        : ay >= az ? [p.getX(j), p.getZ(j)] : [p.getX(j), p.getY(j)];
      uv[j * 2] = u * scale;
      uv[j * 2 + 1] = v * scale;
    }
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return geo;
}
