// guss_2h.npz of the Scout generator in Node (tests, skin bake, benchmarks): read with npz.js and zlib.
import { readFileSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readNpz } from '../src/robotgen/npz.js';

export const GUSS_FILE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/robotgen/data/guss_2h.npz');
export const readGussFile = (file = GUSS_FILE) => readNpz(new Uint8Array(readFileSync(file)), b => inflateRawSync(b));
