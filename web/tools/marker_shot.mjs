// Renders each marker of an export from its saved camera with the marker page itself (local mode, marker/dist):
// overview and close-up per marker, as the "before" picture for the change. After a change, rebuild marker/dist for the
// new stand and run again into another folder for the "after" picture.
// Usage: node tools/marker_shot.mjs <export dir with <id>.json> <out dir> [--all]   (default: only open markers)
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { mkdirSync, readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const playwright = require('playwright');
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'marker', 'dist');
const [exportDir, outDir] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!exportDir || !outDir) {
  console.error('Usage: node tools/marker_shot.mjs <export dir> <out dir> [--all]');
  process.exit(2);
}
mkdirSync(outDir, { recursive: true });
const markers = readdirSync(exportDir).filter((f) => f.endsWith('.json')).map((f) => {
  const doc = JSON.parse(readFileSync(path.join(exportDir, f), 'utf8'));
  return { id: path.basename(f, '.json'), ...(doc.data ?? doc) };
}).filter((m) => process.argv.includes('--all') || m.status !== 'umgesetzt');

const page = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0}[hidden]{display:none!important}</style></head><body>${readFileSync(path.join(root, 'marker', 'page.html'), 'utf8')}</body></html>`;
const TYPES = { '.js': 'text/javascript', '.json': 'application/json', '.jpg': 'image/jpeg' };
const server = createServer((req, res) => {
  const name = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/^\/+/, '');
  if (!name) return res.writeHead(200, { 'content-type': 'text/html' }).end(page);
  const file = path.join(dist, path.basename(name));
  if (!existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' }).end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));

const browser = await playwright.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
try {
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  await ctx.addInitScript((list) => localStorage.setItem('critic-marker', JSON.stringify(list)), markers);
  const p = await ctx.newPage();
  p.setDefaultTimeout(120000);
  await p.goto(`http://127.0.0.1:${server.address().port}/`);
  await p.waitForFunction(() => window.__markerReady === true);
  const stand = await p.evaluate(() => document.getElementById('stand').textContent);
  for (const m of markers) {
    for (const [suffix, closer] of [['', 0], ['_nah', 0.55]]) {
      if (!(await p.evaluate(([id, c]) => window.markerApi.show(id, c), [m.id, closer]))) continue;
      await p.waitForTimeout(300);
      const file = path.join(outDir, `marker_${String(m.nr).padStart(2, '0')}${suffix}.png`);
      await p.locator('#stage').screenshot({ path: file });
    }
    console.log(`#${m.nr} ${m.satz} -> ${outDir} (${stand})`);
  }
} finally {
  await browser.close();
  server.close();
}
