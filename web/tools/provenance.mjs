import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

// Include the generator, references, runner and exact dependency resolution.
export function sourceManifest(root) {
  const files = {};
  const visit = relative => {
    for (const entry of readdirSync(path.join(root, relative), { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const child = path.join(relative, entry.name);
      if (entry.name === '__pycache__') continue;
      if (entry.isDirectory()) visit(child);
      else if (entry.isFile()) files[child.replaceAll(path.sep, '/')] = sha256(readFileSync(path.join(root, child)));
    }
  };
  for (const directory of ['src', 'refs', 'tools']) visit(directory);
  for (const file of ['index.html', 'package.json', 'package-lock.json', 'requirements.txt', 'verify_renders.mjs', '.nvmrc', '../reference/helm/turnaround.mp4']) {
    files[file] = sha256(readFileSync(path.join(root, file)));
  }
  return { files, digest: sha256(JSON.stringify(files)) };
}
