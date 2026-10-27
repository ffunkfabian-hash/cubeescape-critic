// Render an SVG to PNG with Chromium: node render_svg.mjs <in.svg> <out.png> <scale> (viewBox 2723x1155).
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const [src, out, scale] = process.argv.slice(2);
const html = out + '.html';
writeFileSync(html, `<html><body style="margin:0;background:#fff"><img src="file://${src}" style="width:100vw;height:100vh;display:block"></body></html>`);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: Math.round(2723 * scale), height: Math.round(1155 * scale) } });
await p.goto('file://' + html);
await p.waitForFunction(() => document.images[0].complete);
await p.screenshot({ path: out });
await b.close();
