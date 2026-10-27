// Procedural canvas maps (bump / roughness / colour) and a box-projection UV helper for CSG results.
import * as THREE from 'three';
import { rng } from './geo.js';

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

// Woven fabric: fine twill plus soft noise: [bump, roughness].
export function fabricMaps(seed = 5) {
  const r = rng(seed);
  const n = valueNoise(256, 16, r);
  const S = 256;
  const bump = tex(
    grayImage(S, (i) => {
      const x = i % S, y = (i / S) | 0;
      const twill = 0.5 + 0.25 * Math.sin(((x + y) / S) * Math.PI * 2 * 48) + 0.15 * Math.sin((x / S) * Math.PI * 2 * 96);
      return 0.6 * twill + 0.3 * n[i] + 0.1 * r();
    }),
    [36, 5],
  );
  const rough = tex(grayImage(S, (i) => 0.85 + 0.15 * n[i]), [12, 2]);
  return [bump, rough];
}

// Planar UVs by dominant normal axis (CSG results carry no UVs).
export function boxProjectUV(geo, scale = 1) {
  const p = geo.attributes.position, n = geo.attributes.normal;
  const uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    const [u, v] = ax >= ay && ax >= az ? [p.getZ(i), p.getY(i)] : ay >= az ? [p.getX(i), p.getZ(i)] : [p.getX(i), p.getY(i)];
    uv[i * 2] = u * scale;
    uv[i * 2 + 1] = v * scale;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return geo;
}
