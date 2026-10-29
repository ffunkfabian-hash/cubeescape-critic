// Dev server: may read the Scout GLBs in ../assets/helmet-scout (web/src/scout.js); dependency scan only for the main
// page, because marker/page.html is an artifact page whose script exists only after `node tools/marker_build.mjs`.
import { defineConfig } from 'vite';

export default defineConfig({
  server: { fs: { allow: ['..'] } },
  optimizeDeps: { entries: ['index.html'] },
});
