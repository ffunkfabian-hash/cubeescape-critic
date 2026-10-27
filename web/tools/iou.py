#!/usr/bin/env python3
"""Silhouette IoU per view and a comparison sheet.

Reference mask: background modelled as a smooth quadratic luminance surface fitted on the frame border (top rows and
side columns), object = pixels deviating from it, then everything not connected to the border background.
Render mask: renders/mask_<view>.png (white silhouette on black from verify_renders.mjs).
Writes renders/iou.json, renders/compare.png and renders/silhouette_<view>.png (green = both, red = only reference,
blue = only render). Usage: python3 tools/iou.py [web-dir]
"""
import json
import os
import sys
from collections import deque

import numpy as np
from PIL import Image

VIEWS = ['front', 'left', 'back', 'right']


def luminance(img):
    a = np.asarray(img.convert('RGB'), dtype=np.float32)
    return a @ np.array([0.299, 0.587, 0.114], dtype=np.float32), a


def reference_mask(path):
    lum, rgb = luminance(Image.open(path))
    h, w = lum.shape
    ys, xs = np.mgrid[0:h, 0:w]
    border = np.zeros((h, w), bool)
    border[:24, :] = True
    border[:, :90] = True
    border[:, -90:] = True
    # Robust fit: drop border samples that belong to the object (antenna, scarf at the bottom corners).
    sel = border.copy()
    for _ in range(3):
        x, y = xs[sel] / w, ys[sel] / h
        A = np.stack([np.ones_like(x), x, y, x * x, y * y, x * y], 1)
        coef, *_ = np.linalg.lstsq(A, lum[sel], rcond=None)
        X, Y = xs / w, ys / h
        bg = coef[0] + coef[1] * X + coef[2] * Y + coef[3] * X * X + coef[4] * Y * Y + coef[5] * X * Y
        sel = border & (np.abs(lum - bg) < 6)
    chroma = rgb.max(2) - rgb.min(2)
    fg = (np.abs(lum - bg) > 9) | (chroma > 14)
    # Background = non-foreground pixels connected to the top/left/right border.
    seen = np.zeros_like(fg)
    q = deque()
    for x in range(w):
        if not fg[0, x]:
            q.append((0, x))
    for y in range(h):
        for x in (0, w - 1):
            if not fg[y, x]:
                q.append((y, x))
    while q:
        y, x = q.popleft()
        if seen[y, x]:
            continue
        seen[y, x] = True
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not fg[ny, nx] and not seen[ny, nx]:
                q.append((ny, nx))
    return ~seen


def render_mask(path):
    lum, _ = luminance(Image.open(path))
    return lum > 128


def main():
    root = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    refs, renders = os.path.join(root, 'refs'), os.path.join(root, 'renders')
    result, rows = {}, []
    for v in VIEWS:
        ref_p, mask_p = os.path.join(refs, f'ref_{v}.png'), os.path.join(renders, f'mask_{v}.png')
        if not (os.path.exists(ref_p) and os.path.exists(mask_p)):
            continue
        a, b = reference_mask(ref_p), render_mask(mask_p)
        if a.shape != b.shape:
            b = np.asarray(Image.fromarray(b).resize(a.shape[::-1]))
        inter, union = (a & b).sum(), (a | b).sum()
        result[v] = round(float(inter / union), 4) if union else 0.0
        sil = np.zeros(a.shape + (3,), np.uint8)
        sil[a & b] = (60, 170, 90)
        sil[a & ~b] = (220, 60, 60)
        sil[~a & b] = (60, 110, 230)
        Image.fromarray(sil).save(os.path.join(renders, f'silhouette_{v}.png'))
        tiles = [Image.open(ref_p).convert('RGB'), Image.open(os.path.join(renders, f'render_{v}.png')).convert('RGB'),
                 Image.fromarray(sil)]
        rows.append([t.resize((640, 360)) for t in tiles])
    if rows:
        sheet = Image.new('RGB', (640 * 3, 360 * len(rows)), (40, 40, 40))
        for r, row in enumerate(rows):
            for c, t in enumerate(row):
                sheet.paste(t, (c * 640, r * 360))
        sheet.save(os.path.join(renders, 'compare.png'))
    result['mean'] = round(sum(result[v] for v in result) / max(len(result), 1), 4)
    json.dump(result, open(os.path.join(renders, 'iou.json'), 'w'), indent=2)
    print('IoU ' + '  '.join(f'{k}={v:.3f}' for k, v in result.items()))


if __name__ == '__main__':
    main()
