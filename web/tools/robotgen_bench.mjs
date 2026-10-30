// Build and load times of the three.js generator (0.17): Node (warm, first build discarded, median of --runs builds) and, with
// --browser, the headless viewer (time until window.__ready, median of --runs page loads, gen=three against gen=glb).
// --no-table: bodies built without the cut stage table (search from stage 0 as before 0.17; Node only – for the browser, empty
// src/robotgen/cutStages.json › stages instead).
// Usage: node tools/robotgen_bench.mjs [--runs=3] [--browser] [--no-table] [waechter paladin mechanik scout]
import { fileURLToPath } from 'node:url';
import path from 'node:path';
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

const out = { node: {}, browser: {} };
const list = models.length ? models : ['waechter', 'paladin', 'mechanik'];
for (const name of list) {
  const build = await nodeBuild(name);
  build();
  const ms = [];
  for (let k = 0; k < runs; k++) { const t = performance.now(); build(); ms.push(performance.now() - t); }
  out.node[name] = Math.round(median(ms));
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
    for (const name of list) {
      for (const gen of ['glb', 'three']) {
        const ms = [];
        for (let k = 0; k <= runs; k++) {     // first load warms the dev server's module cache and is discarded
          const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
          const t = performance.now();
          await page.goto(`${url}?model=${name}&gen=${gen}&ui=0&static=1&helmet=study&wear=off`);
          await page.waitForFunction(() => window.__ready === true, null, { timeout: 240000 });
          if (k) ms.push(performance.now() - t);
          await page.close();
        }
        out.browser[`${name}:${gen}`] = Math.round(median(ms));
      }
    }
  } finally {
    await browser.close();
    await server.close();
  }
}
console.log(JSON.stringify(out));
