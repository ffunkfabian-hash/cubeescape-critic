// Build and load times of the three.js generator (0.17): Node (warm, first build discarded, median of --runs builds) and, with
// --browser, the headless viewer (time until window.__ready, median of --runs page loads): the exported GLB (gen=export, default
// since 0.18), the generator live (gen=three) and the frozen Blender GLB (gen=blender), taken in turn per load so a changing load on
// the machine hits all three alike.
// --no-table: bodies built without the cut stage table (search from stage 0 as before 0.17; Node only – for the browser, empty
// src/robotgen/cutStages.json › stages instead).
// Node output per model (0.19): median, min and max in ms over the runs, plus the machine's load average before and after, so a
// measurement under foreign load can be told apart.
// Usage: node tools/robotgen_bench.mjs [--runs=3] [--browser] [--no-table] [waechter paladin mechanik scout]
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import { buildRobotBody } from '../src/robotgen/index.js';

const args = process.argv.slice(2);
const runs = Number(args.find(a => a.startsWith('--runs='))?.slice(7) ?? 3);
const browserToo = args.includes('--browser'), noTable = args.includes('--no-table');
const models = args.filter(a => !a.startsWith('--'));
const median = ms => ms.sort((a, b) => a - b)[Math.floor(ms.length / 2)];
const quiet = console.warn;
console.warn = () => {};                 // three-bvh-csg warns about a deprecated BVH option on every evaluation

async function nodeBuild(name) {
  if (name === 'scout') {
    const { buildScout } = await import('../src/robotgen/scout.js');
    const { readGussFile } = await import('./scoutGussNode.mjs');
    const guss = await readGussFile();
    return () => buildScout(guss);
  }
  return () => buildRobotBody(name, noTable ? { stages: {} } : undefined);
}

const out = { node: {}, browser: {}, load: { before: os.loadavg().map(x => Math.round(x * 10) / 10) } };
const list = models.length ? models : ['waechter', 'paladin', 'mechanik', 'scout'];
for (const name of list) {
  const build = await nodeBuild(name);
  build();
  const ms = [];
  for (let k = 0; k < runs; k++) { const t = performance.now(); build(); ms.push(performance.now() - t); }
  out.node[name] = { median: Math.round(median(ms)), min: Math.round(Math.min(...ms)), max: Math.round(Math.max(...ms)), runs };
}
console.warn = quiet;

if (browserToo) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const { createServer } = await import('vite');
  const playwright = await import('playwright');
  const server = await createServer({ root, logLevel: 'error', server: { port: 5199, strictPort: false, host: '127.0.0.1' } });
  await server.listen();
  const url = server.resolvedUrls.local[0];
  const browser = await playwright.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  try {
    const GENS = ['export', 'three', 'blender'];
    for (const name of list) {
      const ms = Object.fromEntries(GENS.map(g => [g, []]));
      for (let k = 0; k <= runs; k++) {       // first round warms the dev server's module cache and is discarded
        for (const gen of GENS) {
          const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
          const t = performance.now();
          await page.goto(`${url}?model=${name}&gen=${gen}&ui=0&static=1&helmet=study&wear=off`);
          await page.waitForFunction(() => window.__ready === true, null, { timeout: 240000 });
          if (k) ms[gen].push(performance.now() - t);
          await page.close();
        }
      }
      for (const gen of GENS) out.browser[`${name}:${gen}`] = Math.round(median(ms[gen]));
    }
  } finally {
    await browser.close();
    await server.close();
  }
}
out.load.after = os.loadavg().map(x => Math.round(x * 10) / 10);
console.log(JSON.stringify(out));
