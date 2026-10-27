// Debug helper: render the model from an arbitrary camera position.
// Usage: node tools/probe.mjs <out.png> <camX> <camY> <camZ> [tx ty tz] [js-expression]
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createServer } from 'vite';

const require = createRequire(import.meta.url);
const playwright = require('playwright');
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const [out, cx, cy, cz, tx = 0, ty = -0.06, tz = 0, expr = ''] = process.argv.slice(2);
const server = await createServer({ root, logLevel: 'error', server: { port: 5198, host: '127.0.0.1' } });
await server.listen();
const browser = await playwright.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.setDefaultTimeout(120000);
page.on('pageerror', (e) => console.error(e.message));
page.on('console', (m) => console.log(m.text()));
try {
  await page.goto(`${server.resolvedUrls.local[0]}?ui=0&static=1`);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 180000 });
  const log = await page.evaluate(([c, t, expr]) => {
    window.camera.position.set(...c);
    window.controls.target.set(...t);
    window.camera.lookAt(...t);
    const r = expr ? eval(expr) : '';
    window.renderFrame();
    return r;
  }, [[+cx, +cy, +cz], [+tx, +ty, +tz], expr]);
  if (log) console.log(log);
  await page.screenshot({ path: out });
} finally {
  await browser.close();
  await server.close();
}
