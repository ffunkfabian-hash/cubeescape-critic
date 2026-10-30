// Reader for NumPy .npz archives (np.savez_compressed: a zip of .npy files, deflated, zip64 local headers) as used by the Scout
// generator for its baked cast (blender/scout/guss_2h.npz). inflateRaw(bytes) → bytes (or a promise of them) is supplied by the
// caller: zlib.inflateRawSync in Node, DecompressionStream('deflate-raw') in the browser.
const DTYPES = { '<f4': Float32Array, '<f8': Float64Array, '<i4': Int32Array, '<i8': BigInt64Array, '|b1': Uint8Array, '|u1': Uint8Array };

// One .npy file → { shape, data } (typed array, or an array of strings for '<U' arrays).
export function parseNpy(bytes) {
  if (bytes[0] !== 0x93 || String.fromCharCode(...bytes.subarray(1, 6)) !== 'NUMPY') throw new Error('npy: bad magic');
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const major = bytes[6], hlen = major === 1 ? dv.getUint16(8, true) : dv.getUint32(8, true), h0 = major === 1 ? 10 : 12;
  const header = new TextDecoder().decode(bytes.subarray(h0, h0 + hlen));
  const descr = /'descr':\s*'([^']+)'/.exec(header)[1];
  if (/'fortran_order':\s*True/.test(header)) throw new Error('npy: fortran order');
  const shape = /'shape':\s*\(([^)]*)\)/.exec(header)[1].split(',').map(s => s.trim()).filter(Boolean).map(Number);
  const count = shape.reduce((a, b) => a * b, 1), body = bytes.slice(h0 + hlen);
  const u = /^<U(\d+)$/.exec(descr);
  if (u) {
    const n = Number(u[1]), cps = new Uint32Array(body.buffer, 0, count * n), data = [];
    for (let i = 0; i < count; i++) data.push(String.fromCodePoint(...cps.subarray(i * n, (i + 1) * n)).replace(/\0+$/, ''));
    return { shape, data };
  }
  const T = DTYPES[descr];
  if (!T) throw new Error(`npy: dtype ${descr}`);
  return { shape, data: new T(body.buffer, 0, count) };
}

// .npz archive → { name (without .npy): { shape, data } }.
export async function readNpz(bytes, inflateRaw) {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let eocd = bytes.length - 22;
  while (eocd >= 0 && dv.getUint32(eocd, true) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error('npz: no end of central directory');
  const entries = dv.getUint16(eocd + 10, true);
  let p = dv.getUint32(eocd + 16, true);
  const out = {};
  for (let e = 0; e < entries; e++) {
    if (dv.getUint32(p, true) !== 0x02014b50) throw new Error('npz: bad central directory');
    const method = dv.getUint16(p + 10, true), nameLen = dv.getUint16(p + 28, true), extraLen = dv.getUint16(p + 30, true);
    const commentLen = dv.getUint16(p + 32, true);
    let csize = dv.getUint32(p + 20, true), local = dv.getUint32(p + 42, true);
    const name = new TextDecoder().decode(bytes.subarray(p + 46, p + 46 + nameLen));
    if (csize === 0xffffffff || local === 0xffffffff) {      // zip64 extra field: usize, csize, offset as far as needed
      let x = p + 46 + nameLen;
      while (x < p + 46 + nameLen + extraLen) {
        const id = dv.getUint16(x, true), len = dv.getUint16(x + 2, true);
        if (id === 1) {
          let q = x + 4;
          if (dv.getUint32(p + 24, true) === 0xffffffff) q += 8;
          if (csize === 0xffffffff) { csize = Number(dv.getBigUint64(q, true)); q += 8; }
          if (local === 0xffffffff) local = Number(dv.getBigUint64(q, true));
        }
        x += 4 + len;
      }
    }
    const start = local + 30 + dv.getUint16(local + 26, true) + dv.getUint16(local + 28, true);
    const raw = bytes.subarray(start, start + csize);
    const data = method === 0 ? raw : method === 8 ? await inflateRaw(raw) : null;
    if (!data) throw new Error(`npz: compression ${method}`);
    out[name.replace(/\.npy$/, '')] = parseNpy(new Uint8Array(data));
    p += 46 + nameLen + extraLen + commentLen;
  }
  return out;
}
