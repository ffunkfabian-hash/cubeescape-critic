// Builds everything the marker page needs into marker/dist/: the bundled script, the model of the given stand as glTF
// JSON (the artifact host serves .json but not .glb), small reference frames and stand.json. Publishing is done by
// Claude Code with these files (docs/MARKER.md).
// Usage: node tools/marker_build.mjs "<stand>" [model.glb]   e.g. "0.7 Bastion" ../assets/helmet-bastion/assembled/scifi_helmet.glb
import { build } from 'vite';
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const [stand, glbPath = path.join(root, '..', 'assets', 'helmet-bastion', 'assembled', 'scifi_helmet.glb')] = process.argv.slice(2);
if (!stand) {
  console.error('Usage: node tools/marker_build.mjs "<stand>" [model.glb]');
  process.exit(2);
}
const dist = path.join(root, 'marker', 'dist');
mkdirSync(dist, { recursive: true });

await build({ configFile: path.join(root, 'marker', 'vite.config.js') });

// GLB -> glTF JSON with the binary chunk as an embedded data URI.
function glbToGltf(buf) {
  if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error(`${glbPath} is not a GLB file`);
  let off = 12, json = null, bin = null;
  while (off < buf.length) {
    const len = buf.readUInt32LE(off), type = buf.readUInt32LE(off + 4), chunk = buf.subarray(off + 8, off + 8 + len);
    if (type === 0x4e4f534a) json = JSON.parse(chunk.toString('utf8'));
    else if (type === 0x004e4942) bin = chunk;
    off += 8 + len;
  }
  if (bin) json.buffers[0] = { byteLength: json.buffers[0].byteLength, uri: `data:application/octet-stream;base64,${bin.toString('base64')}` };
  return json;
}
const slug = stand.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-|-$/g, '');
const modell = `modell_${slug}.json`;
writeFileSync(path.join(dist, modell), JSON.stringify(glbToGltf(readFileSync(glbPath))));

const VIEWS = [['front', 'vorn'], ['left', 'Seite B'], ['back', 'hinten'], ['right', 'Seite A']];
const r = spawnSync('python3', ['-I', '-c', `
import sys
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
for v in sys.argv[3:]:
    im = Image.open(f'{src}/ref_{v}.png').convert('RGB')
    im.thumbnail((480, 480))
    im.save(f'{dst}/ref_{v}.jpg', quality=82)
`, path.join(root, 'refs'), dist, ...VIEWS.map(([v]) => v)], { stdio: 'inherit' });
if (r.status) process.exit(r.status);

writeFileSync(path.join(dist, 'stand.json'), JSON.stringify({
  stand,
  modell,
  quelle: path.relative(path.join(root, '..'), glbPath),
  erstellt: new Date().toISOString(),
  vorlagen: VIEWS.map(([v, name]) => ({ ansicht: name, datei: `ref_${v}.jpg` })),
}, null, 2));
console.log(`marker/dist: marker.js, ${modell}, stand.json, ref_*.jpg`);
