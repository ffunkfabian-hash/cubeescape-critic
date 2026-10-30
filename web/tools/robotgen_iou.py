#!/usr/bin/env python3
"""Silhouette IoU of a robot body or Scout, Blender GLB against the three.js generator, and comparison sheets.

Input: <dir>/blender/ and <dir>/export/ from robotgen_compare.mjs (mask_<view>.png white on black, render_<view>.png, close_*.png).
Writes <dir>/silhouette_<view>.png (grey = both, amber = only GLB, blue = only three.js), <dir>/views.jpg (per view GLB render,
three.js render, silhouette difference) and <dir>/close.jpg (close-ups with the same camera, GLB left, three.js right);
prints {"views": {view: IoU}, "mean": …} as JSON. Usage: python3 robotgen_iou.py <dir>
"""
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw

VIEWS = ['front', 'left', 'back', 'right']


def mask(path):
    return np.asarray(Image.open(path).convert('L'), dtype=np.uint8) > 127


def silhouette(a, b):
    img = np.full(a.shape + (3,), 24, np.uint8)
    img[a & b] = (170, 170, 170)
    img[a & ~b] = (255, 176, 31)
    img[~a & b] = (64, 150, 255)
    return Image.fromarray(img)


def crop_box(paths):
    """Common bounding box (with margin) of the non-background content of the masks."""
    m = np.zeros_like(mask(paths[0]))
    for p in paths:
        m |= mask(p)
    ys, xs = np.nonzero(m)
    pad = 16
    return max(0, xs.min() - pad), max(0, ys.min() - pad), min(m.shape[1], xs.max() + pad), min(m.shape[0], ys.max() + pad)


def label(img, text):
    d = ImageDraw.Draw(img)
    d.rectangle((0, 0, 8 + 7 * len(text), 18), fill=(20, 22, 26))
    d.text((4, 3), text, fill=(240, 240, 236))
    return img


def main(d):
    res = {}
    rows = []
    for v in VIEWS:
        a, b = mask(os.path.join(d, 'blender', f'mask_{v}.png')), mask(os.path.join(d, 'export', f'mask_{v}.png'))
        res[v] = round(float((a & b).sum() / max(1, (a | b).sum())), 4)
        sil = silhouette(a, b)
        sil.save(os.path.join(d, f'silhouette_{v}.png'))
        box = crop_box([os.path.join(d, g, f'mask_{v}.png') for g in ('blender', 'export')])
        tiles = [label(Image.open(os.path.join(d, 'blender', f'render_{v}.png')).convert('RGB').crop(box), f'{v} · Blender-GLB'),
                 label(Image.open(os.path.join(d, 'export', f'render_{v}.png')).convert('RGB').crop(box), f'{v} · three.js'),
                 label(sil.crop(box), f'{v} · IoU {res[v]:.4f}')]
        rows.append(tiles)
    w, h = rows[0][0].size
    sheet = Image.new('RGB', (3 * w, len(rows) * h), (36, 39, 43))
    for r, tiles in enumerate(rows):
        for c, t in enumerate(tiles):
            sheet.paste(t.resize((w, h)), (c * w, r * h))
    sheet.save(os.path.join(d, 'views.jpg'), quality=88)
    pairs = []
    close = sorted({f[6:-4] for f in os.listdir(os.path.join(d, 'blender')) if f.startswith('close_') and f.endswith('.png') and not f.endswith('_wear.png')})
    for k in close:
        for suffix, name in (('', 'flach'), ('_wear', 'gealtert')):
            ga, th = (os.path.join(d, g, f'close_{k}{suffix}.png') for g in ('blender', 'export'))
            if os.path.exists(ga) and os.path.exists(th):
                pairs.append((label(Image.open(ga).convert('RGB'), f'{k} {name} · Blender-GLB'), label(Image.open(th).convert('RGB'), f'{k} {name} · three.js')))
    if pairs:
        tw, thh = 640, 360
        sheet = Image.new('RGB', (2 * tw, len(pairs) * thh), (36, 39, 43))
        for r, (x, y) in enumerate(pairs):
            sheet.paste(x.resize((tw, thh)), (0, r * thh))
            sheet.paste(y.resize((tw, thh)), (tw, r * thh))
        sheet.save(os.path.join(d, 'close.jpg'), quality=88)
    print(json.dumps({'views': res, 'mean': round(sum(res.values()) / len(res), 4)}))


if __name__ == '__main__':
    main(sys.argv[1])
