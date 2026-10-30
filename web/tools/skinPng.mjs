// Minimal deterministic PNG writer/reader for the skin maps (8-bit grey, RGB or RGBA, no colour chunks, so browsers upload the
// bytes unchanged). Rows use the Up filter; zlib at level 9.
import { deflateSync, inflateSync } from 'node:zlib';

const CRC = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc32 = buf => { let c = -1; for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ -1) >>> 0; };
const TYPES = { 1: 0, 3: 2, 4: 6 };

function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

export function encodePNG(width, height, channels, pixels) {
  if (!TYPES[channels] && TYPES[channels] !== 0) throw new Error(`encodePNG: ${channels} channels unsupported`);
  const row = width * channels, raw = Buffer.alloc((row + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (row + 1)] = y ? 2 : 0;
    for (let x = 0; x < row; x++) raw[y * (row + 1) + 1 + x] = (pixels[y * row + x] - (y ? pixels[(y - 1) * row + x] : 0)) & 0xff;
  }
  const head = Buffer.alloc(13);
  head.writeUInt32BE(width, 0); head.writeUInt32BE(height, 4); head[8] = 8; head[9] = TYPES[channels];
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', head),
    chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

export function decodePNG(buf) {
  let p = 8, width, height, channels;
  const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), type = buf.toString('ascii', p + 4, p + 8), data = buf.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0); height = data.readUInt32BE(4);
      if (data[8] !== 8 || data[12]) throw new Error('decodePNG: only 8-bit, non-interlaced');
      channels = { 0: 1, 2: 3, 6: 4 }[data[9]];
    } else if (type === 'IDAT') idat.push(data);
    p += 12 + len;
  }
  const raw = inflateSync(Buffer.concat(idat)), row = width * channels, out = new Uint8Array(row * height);
  for (let y = 0; y < height; y++) {
    const f = raw[y * (row + 1)], src = raw.subarray(y * (row + 1) + 1, (y + 1) * (row + 1));
    for (let x = 0; x < row; x++) {
      const a = x >= channels ? out[y * row + x - channels] : 0, b = y ? out[(y - 1) * row + x] : 0, c = x >= channels && y ? out[(y - 1) * row + x - channels] : 0;
      const pr = (() => { const q = a + b - c, pa = Math.abs(q - a), pb = Math.abs(q - b), pc = Math.abs(q - c); return pa <= pb && pa <= pc ? a : pb <= pc ? b : c; })();
      out[y * row + x] = (src[x] + [0, a, b, (a + b) >> 1, pr][f]) & 0xff;
    }
  }
  return { width, height, channels, pixels: out };
}
