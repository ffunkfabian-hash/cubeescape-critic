// Cut stage table of the three.js body generator (0.17): builds every body with the stage search from 0 (mesh.js › firstClosed) and
// writes src/robotgen/cutStages.json with the first closed stage of every part that needs grown cutters (stage 0 parts are left
// out). buildRobotBody then cuts those parts once; robotgen.test.mjs checks the table on the platform that wrote it.
// Usage: node tools/robotgen_cut_stages.mjs [--check]   (--check: compare with the stored table instead of writing it)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { buildRobotBody } from '../src/robotgen/index.js';
const GENERATED = ['waechter', 'paladin', 'mechanik'];   // the bodies of robotBodies.js › ROBOT_MODELS (that module imports GLB urls, Vite only)

const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/robotgen/cutStages.json');
const warn = console.warn;
console.warn = () => {};                 // three-bvh-csg: deprecated BVH option on every evaluation
const stages = {};
for (const name of GENERATED) {
  const used = buildRobotBody(name, { stages: {} }).stages;
  stages[name] = Object.fromEntries(Object.entries(used).filter(([, k]) => k > 0).sort());
}
console.warn = warn;
const table = {
  note: 'First closed cut stage (cutters grown by stage × mesh.js › CUT_JITTER) of every body part that three-bvh-csg leaves open at stage 0; written by web/tools/robotgen_cut_stages.mjs, keys: segment node/mesh name.',
  platform: `${process.platform}-${process.arch} node ${process.versions.node}`,
  stages,
};
if (process.argv.includes('--check')) {
  const old = JSON.parse(readFileSync(file, 'utf8'));
  const same = JSON.stringify(old.stages) === JSON.stringify(stages);
  console.log(same ? `cut stages unchanged (${table.platform})` : `cut stages differ on ${table.platform}: ${JSON.stringify(stages)} (stored ${old.platform}: ${JSON.stringify(old.stages)})`);
  process.exit(same ? 0 : 1);
}
writeFileSync(file, JSON.stringify(table, null, 1) + '\n');
console.log(JSON.stringify(table));
