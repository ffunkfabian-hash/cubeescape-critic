#!/usr/bin/env python3
"""Build a self-contained, printable part map from the four verified helmet renders."""
from __future__ import annotations

import argparse
import base64
import html
from pathlib import Path
import struct
import subprocess


PARTS = [
    ("H01", "Schädelhaube", "Gewölbte obere Hauptschale."),
    ("H02", "Brauenkante", "Übergang von Stirn zu Augenmaske."),
    ("H03", "Augenmaske", "Obere Gesichtsplatte mit Mittelsteg."),
    ("H04", "Augenöffnungen", "Beide Sehschlitze mit Rahmen und Tiefe."),
    ("H05", "Wangenplatten", "Untere dunkle Platten links und rechts."),
    ("H06", "Mitteleinsatz", "Trapezförmige Vertiefung und Seitenleisten."),
    ("H07", "Kinnblock", "Breiter vorderer Abschluss mit oberer Stufe."),
    ("H08", "Kieferstücke", "Seitliche Verbindungen vom Kinn zum Rahmen."),
    ("H09", "Seiten-/Heckgehäuse", "Helle Wand hinter Maske und Ohrmodulen."),
    ("H10", "Nacken-/Seitenrahmen", "Unterer Rahmen mit vorderem Anschluss."),
    ("H11", "Seitliche Vertiefungen", "Längsfeld, kleine Tasche und schmaler Schlitz."),
    ("H12", "Funkmuschel A", "Großes ovales Modul auf Seite A."),
    ("H13", "Seitenmodul B", "Flaches kantiges Modul auf Seite B."),
    ("H14", "Maskenhalterungen", "Kleine dunkle Halter vor den Ohrmodulen."),
    ("H15", "Bügel und Scheitelband", "Halter und Band über dem Hinterkopf."),
    ("H16", "Hinterkopfmodul", "Rückwärtiger Kasten mit Montageplatte."),
    ("H17", "Antenne", "Langer Stab auf Seite A, mit Fuß und Spitze."),
    ("H18", "Spiralkabel", "Gerippte Verbindung um Seite A."),
    ("H19", "Halsanschluss", "Zurückgesetzter Ring unter dem Rahmen."),
    ("H20", "Stirnblende A", "Separate trapezförmige Blende oberhalb von Auge A."),
    ("H21", "Stirnblende B", "Separate trapezförmige Blende oberhalb von Auge B."),
]

# Every point is in the original 1280×720 render coordinate system.
# A = front-left, -X, radio; B = front-right, +X, angular ear module.
VIEWS = [
    ("front", "01 / Front", "Seite A links · Seite B rechts", [
        ("H01", (640, 155), (240, 55)),
        ("H20", (550, 165), (240, 150)),
        ("H21", (730, 165), (1020, 55)),
        ("H02", (675, 237), (1020, 155)),
        ("H03", (650, 330), (1020, 350)),
        ("H04", (520, 281), (240, 275)),
        ("H05", (735, 440), (1020, 465)),
        ("H06", (640, 439), (240, 455)),
        ("H07", (640, 549), (240, 625)),
    ]),
    ("left", "02 / Seite B", "Kantiges Ohrmodul · +X", [
        ("H08", (570, 516), (245, 620)),
        ("H09", (752, 205), (1050, 130)),
        ("H10", (745, 437), (1050, 535)),
        ("H11", (815, 383), (1050, 410)),
        ("H13", (853, 275), (1050, 280)),
        ("H14", (710, 293), (245, 215)),
    ]),
    ("back", "03 / Heck", "Hinterkopfmodul und Rahmen", [
        ("H09", (485, 240), (235, 160)),
        ("H10", (680, 405), (1050, 430)),
        ("H15", (640, 47), (235, 65)),
        ("H16", (640, 240), (235, 280)),
        ("H19", (640, 495), (1050, 585)),
    ]),
    ("right", "04 / Seite A", "Funkmuschel, Antenne, Kabel · −X", [
        ("H12", (450, 275), (200, 245)),
        ("H15", (585, 55), (1020, 70)),
        ("H17", (489, 95), (200, 90)),
        ("H18", (440, 412), (200, 465)),
        ("H08", (750, 525), (1050, 620)),
    ]),
]


CAPTURE_JS = r"""
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import path from 'node:path';
const [root, source, png, pdf, docImage] = process.argv.slice(1);
const require = createRequire(path.join(root, 'package.json'));
const { chromium } = require('playwright');
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
});
try {
  const page = await browser.newPage({ viewport: { width: 1587, height: 1122 }, deviceScaleFactor: 2 });
  await page.setContent(readFileSync(source, 'utf8'), { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(img => img.decode()));
  });
  const overflow = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  }));
  if (overflow.width > 1587 || overflow.height > 1122) throw new Error(`Part sheet overflow: ${JSON.stringify(overflow)}`);
  await page.screenshot({ path: png, fullPage: true });
  if (docImage) await page.screenshot({ path: docImage, type: 'jpeg', quality: 88, fullPage: true });
  await page.pdf({ path: pdf, format: 'A3', landscape: true, printBackground: true, preferCSSPageSize: true });
} finally {
  await browser.close();
}
"""


def png_uri(path: Path) -> str:
    data = path.read_bytes()
    if len(data) < 24 or data[:8] != b"\x89PNG\r\n\x1a\n" or struct.unpack(">II", data[16:24]) != (1280, 720):
        raise ValueError(f"Expected a 1280×720 PNG render: {path}")
    return "data:image/png;base64," + base64.b64encode(data).decode("ascii")


def callouts(items: list) -> str:
    markup = []
    for identifier, (x, y), (lx, ly) in items:
        anchor = lx + 48 if lx < x else lx - 48
        markup.append(f'<path d="M {x} {y} L {anchor} {ly}"/>')
        markup.append(f'<circle cx="{x}" cy="{y}" r="5"/>')
        markup.append(f'<a href="#{identifier}"><rect x="{lx-48}" y="{ly-21}" width="96" height="42" rx="7"/>')
        markup.append(f'<text x="{lx}" y="{ly+9}">{identifier}</text></a>')
    return '<svg viewBox="0 0 1280 720" aria-label="Teilemarkierungen">' + "".join(markup) + "</svg>"


def create_sheet(renders: Path, output: Path, label: str) -> None:
    panels = []
    known = {row[0] for row in PARTS}
    marked = set()
    for name, title, subtitle, points in VIEWS:
        marked.update(point[0] for point in points)
        source = png_uri(renders / f"render_{name}.png")
        panels.append(
            f'<section class="panel"><h2>{html.escape(title)}</h2><p>{html.escape(subtitle)}</p>'
            f'<div class="image"><img src="{source}" alt="{html.escape(title)}"/>{callouts(points)}</div></section>'
        )
    if marked != known:
        raise ValueError("Every stable part ID must occur in the sheet")
    legend = "".join(
        f'<li id="{identifier}"><b>{identifier}</b><div><strong>{html.escape(name)}</strong>'
        f'<span>{html.escape(description)}</span></div></li>'
        for identifier, name, description in PARTS
    )
    document = """<!doctype html>
<html lang="de"><head><meta charset="utf-8"><title>Helm · Teilekarte</title>
<style>
* { box-sizing: border-box; }
@page { size: A3 landscape; margin: 0; }
html, body { margin: 0; padding: 0; width: 1587px; height: 1122px; }
body { color: #182c38; background: #fff; font-family: Arial, Helvetica, sans-serif; }
.sheet { padding: 30px 42px 20px; width: 1587px; height: 1122px; }
header { display: flex; justify-content: space-between; align-items: end; padding-bottom: 16px; border-bottom: 3px solid #163e52; }
h1 { font-size: 38px; font-weight: 700; margin: 0; letter-spacing: -1px; }
header p { font-size: 15px; margin: 8px 0 0; color: #586b75; }
.stamp { text-align: right; font-size: 14px; max-width: 400px; line-height: 1.5; }
.layout { display: grid; grid-template-columns: 1fr 308px; gap: 24px; margin-top: 18px; }
.views { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; align-content: start; }
.panel { border: 1px solid #d4dce1; border-radius: 10px; overflow: hidden; background: #f6f8f9; }
h2 { margin: 14px 16px 2px; font-size: 19px; font-weight: 700; }
.panel p { margin: 0 16px 12px; font-size: 12px; color: #53656e; }
.image { position: relative; width: 100%; aspect-ratio: 16/9; }
img, svg { display: block; width: 100%; height: 100%; }
svg { position: absolute; inset: 0; overflow: hidden; }
svg path { stroke: #093e59; stroke-width: 3.4; fill: none; }
svg circle { stroke: #fff; stroke-width: 2; fill: #093e59; }
svg rect { fill: #fff; stroke: #093e59; stroke-width: 2; }
svg text { fill: #093e59; text-anchor: middle; font: bold 26px Arial,sans-serif; }
.legend h2 { margin: 0 0 12px; font-size: 19px; }
ol { list-style: none; margin: 0; padding: 0; }
li { display: grid; grid-template-columns: 42px 1fr; gap: 8px; padding: 5px 0; border-bottom: 1px solid #e4e9ec; break-inside: avoid; }
li > b { font-size: 13px; color: #0d4864; align-self: start; padding: 3px 0; }
li strong { display: block; font-size: 13px; line-height: 1.2; }
li span { display: block; font-size: 11px; line-height: 1.3; color: #556873; margin-top: 2px; }
.usage { margin-top: 16px; border-left: 4px solid #176280; padding: 10px 16px; background: #eef4f6; font-size: 14px; line-height: 1.4; }
.usage strong { display: block; font-size: 17px; }
footer { margin-top: 16px; padding-top: 12px; border-top: 1px solid #cdd7dd; color: #5b6b74; font-size: 11px; line-height: 1.4; }
@media print { html, body { width: 420mm; height: 297mm; } .sheet { width: 420mm; height: 297mm; } }
</style></head><body><main class="sheet"><header><div><h1>Helm · Teilekarte</h1>
<p>Stabile Abschnittsnummern für konkrete Änderungswünsche</p></div>
<div class="stamp">__LABEL__<br>__COUNT__ Abschnitte · vier Ansichten · A3 quer</div></header>
<div class="layout"><div><div class="views">__PANELS__</div>
<div class="usage"><strong>So sprechen wir über Änderungen</strong>
„H07 schmaler.“ &nbsp; „H11 auf Seite B tiefer.“ &nbsp; „H10 vorne flacher anschließen.“<br>
Immer Abschnitt, Seite und Richtung nennen. Beispiel: „H05 auf Seite A unten weiter nach innen.“</div>
<footer><strong>Seite A:</strong> in der Frontansicht links, mit Funkmuschel und Antenne (−X).<br>
<strong>Seite B:</strong> in der Frontansicht rechts, mit kantigem Ohrmodul (+X).<br>
Die Nummern benennen sichtbare Bereiche; mehrere Bereiche können im Generator dasselbe Bauteil bilden.
Standbilder dokumentieren den aktuellen Modellstand, keine Abnahme der Vorlagentreue.</footer>
</div><aside class="legend"><h2>Teile und Abschnitte</h2><ol>__LEGEND__</ol></aside></div>
</main></body></html>
"""
    document = document.replace("__COUNT__", str(len(PARTS))).replace("__LABEL__", html.escape(label)).replace("__PANELS__", "".join(panels)).replace("__LEGEND__", legend)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(document, encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", nargs="?", type=Path, default=Path(__file__).resolve().parents[1], help="Web project directory")
    parser.add_argument("--renders", type=Path, help="Input folder containing render_front/left/back/right.png")
    parser.add_argument("--output", type=Path, help="Self-contained HTML output path")
    parser.add_argument("--label", default="cubeescape-critic · parametrischer Helm", help="Model revision label")
    parser.add_argument("--capture", action="store_true", help="Also create PNG and A3 PDF using Playwright")
    parser.add_argument("--doc-image", type=Path, help="Optional documentation JPEG (requires --capture)")
    args = parser.parse_args()
    root = args.root.resolve()
    renders = (args.renders or root / "renders").resolve()
    output = (args.output or renders / "parts_sheet.html").resolve()
    if args.doc_image and not args.capture:
        parser.error("--doc-image requires --capture")
    try:
        create_sheet(renders, output, args.label)
        if args.capture:
            doc_image = args.doc_image.resolve() if args.doc_image else None
            if doc_image:
                doc_image.parent.mkdir(parents=True, exist_ok=True)
            subprocess.run([
                "node", "--input-type=module", "-e", CAPTURE_JS, str(root), str(output),
                str(output.with_suffix(".png")), str(output.with_suffix(".pdf")),
                str(doc_image) if doc_image else "",
            ], check=True)
    except (OSError, ValueError, subprocess.CalledProcessError) as error:
        parser.exit(1, f"parts_sheet: {error}\n")
    print(f"Teilekarte: {output}")
    if args.capture:
        print(f"PNG: {output.with_suffix('.png')}\nPDF A3: {output.with_suffix('.pdf')}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
