// Dev-server dependency scan only for the main page: marker/page.html is an artifact page whose script exists only
// after `node tools/marker_build.mjs` (marker/dist), and would otherwise be reported as a missing import.
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: { entries: ['index.html'] },
});
