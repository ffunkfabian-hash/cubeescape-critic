#!/usr/bin/env python3
"""Side-by-side close-ups of the helmet: reference frame (left) and render (right) per view, cropped to the helmet.
Usage: python3 pairs.py <web-dir> <out.png>"""
import os
import sys

from PIL import Image

root, out = sys.argv[1], sys.argv[2]
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
