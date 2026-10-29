#!/usr/bin/env python3
"""Side-by-side close-ups of the helmet: reference frame (left) and render (right) per view, cropped to the helmet.
Usage: python3 pairs.py <web-dir> <out.png>"""
import os
import sys

from PIL import Image, ImageDraw
import argparse

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('root')
parser.add_argument('out')
mode = parser.add_mutually_exclusive_group()
mode.add_argument('--baseline', help='Directory containing render_<view>.png from the previous source snapshot')
mode.add_argument('--reference', help='Output directory of compare_reference.mjs')
args = parser.parse_args()
root, out = args.root, args.out
if args.baseline or args.reference:
    sheet = Image.new('RGB', (1500, 1944), (36, 39, 43))
    draw = ImageDraw.Draw(sheet)
    for row, view in enumerate(['front', 'left', 'back', 'right']):
        if args.baseline:
            columns = [('Video', os.path.join(root, 'refs', f'ref_{view}.png')),
                       ('Vorher', os.path.join(args.baseline, f'render_{view}.png')),
                       ('Nachher', os.path.join(root, 'renders', f'render_{view}.png'))]
        else:
            columns = [('Unser Helm', os.path.join(args.reference, f'ours-{view}.png')),
                       ('Meshy mit Textur', os.path.join(args.reference, f'textured-{view}.png')),
                       ('Meshy Geometrie', os.path.join(args.reference, f'clay-{view}.png'))]
        for column, (label, filename) in enumerate(columns):
            # Meshy crops are display framing only, never used for IoU.
            crop = (355, 25, 925, 545) if args.reference and column > 0 else (300, 0, 980, 620)
            tile = Image.open(filename).convert('RGB').crop(crop).resize((500, 456))
            sheet.paste(tile, (column * 500, row * 486 + 30))
            draw.text((column * 500 + 12, row * 486 + 8), f'{view} | {label}', fill='white')
    sheet.save(out)
    sys.exit(0)
rows = []
for v in ['front', 'left', 'back', 'right']:
    ref = Image.open(os.path.join(root, 'refs', f'ref_{v}.png')).convert('RGB').crop((300, 0, 980, 620))
    ren = Image.open(os.path.join(root, 'renders', f'render_{v}.png')).convert('RGB').crop((300, 0, 980, 620))
    row = Image.new('RGB', (1360, 620))
    row.paste(ref, (0, 0))
    row.paste(ren, (680, 0))
    rows.append(row)
sheet = Image.new('RGB', (2720, 1240))
for i, r in enumerate(rows):
    sheet.paste(r, ((i % 2) * 1360, (i // 2) * 620))
sheet.resize((1360, 620)).save(out)
