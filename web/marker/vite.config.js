// Bundles the marker page script (three.js, loaders, BVH) into one file: marker/dist/marker.js.
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  logLevel: 'warn',
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: { entry: 'src/marker.js', formats: ['es'], fileName: () => 'marker.js' },
  },
});
