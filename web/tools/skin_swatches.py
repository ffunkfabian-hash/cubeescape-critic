#!/usr/bin/env python3
"""Material swatches and glowing decals from a painted atlas texture, for the skin mixer (layers `tex` and `decal`).

A generated texture in the layout of a body's skin atlas (e.g. from an exported basecolor) paints every UV island on its own, so
on the model the material jumps from part to part. This takes only the materials: per role (shell, graphite, trim, …) the
largest calm square inside that role's islands whose colour is typical for the role, made seamless (offset and cross-fade), and
the glowing motifs (runes, circuit traces) as a decal sheet with alpha. The skin recipe then puts them on the model by role and part.

  python3 tools/skin_swatches.py <texture> <debug dir of skin_bake (role.png, edge.png, legend.json)> <out dir> <prefix>

Writes <prefix>_<role>.jpg (seamless, native resolution of the crop) for every role with enough area, <prefix>_decals.png (4×4 cells of 256², RGBA) and
<prefix>_swatches.json (source crops, mean colours, decal count).
"""
import colorsys
import json
import os
import sys

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

CELL, GRID = 256, 4


def imul(a, b):
    return (a * b) & 0xFFFFFFFF


def role_colour(i):
    """Colour of role i in role.png (skin_bake.mjs › hash, colour(1000 + i), HSL 0.55/0.55)."""
    x = ((1000 + i) * 7919 + 13) & 0xFFFFFFFF
    h = imul(x ^ 0x9e3779b9, 0x85ebca6b)
    h = imul(h ^ (h >> 13), 0xc2b2ae35)
    hue = ((h ^ (h >> 16)) & 0xFFFFFFFF) / 4294967296
    return np.array([round(c * 255) for c in colorsys.hls_to_rgb(hue, 0.55, 0.55)])


def seamless(img):
    """Offset by half and cross-fade towards the centre: the borders come from the continuous middle of the crop."""
    a = img.astype(np.float32)
    n = a.shape[0]
    b = np.roll(a, (n // 2, n // 2), (0, 1))
    t = np.abs(np.linspace(-1, 1, n))
    w = np.clip(1.6 * (1 - np.maximum.outer(t, t)), 0, 1)[..., None]   # 1 in the middle, 0 at the border
    return (w * a + (1 - w) * b).astype(np.uint8)


def glow_mask(rgb):
    """Glowing pixels: bright and saturated; warm hues (gold, rust) only as near-white hot cores."""
    hsv = np.asarray(Image.fromarray(rgb).convert('HSV')).astype(np.float32) / 255
    h, s, v = hsv[..., 0] * 360, hsv[..., 1], hsv[..., 2]
    warm = (h < 70) | (h > 340)
    m = np.clip((v - np.where(warm, 0.93, 0.62)) / np.where(warm, 0.05, 0.2), 0, 1) * np.clip((s - np.where(warm, 0.25, 0.35)) / 0.2, 0, 1)
    return m


def main(texture, debug, out, prefix):
    os.makedirs(out, exist_ok=True)
    legend = json.load(open(os.path.join(debug, 'legend.json')))
    rmap = np.asarray(Image.open(os.path.join(debug, 'role.png')).convert('RGB')).astype(int)
    edge = np.asarray(Image.open(os.path.join(debug, 'edge.png')).convert('L')).astype(np.float32) / 255 * 32   # mm, clipped at 32
    S = rmap.shape[0]
    src = Image.open(texture).convert('RGB')
    w, h = src.size
    if h > w:                                                          # a legend left under the map (skin_guide.py): drop it
        print(f'{texture}: {w}×{h}, keeping the top {w}×{w} (atlas square)', file=sys.stderr)
        src = src.crop((0, 0, w, w))
    elif w != h:
        raise SystemExit(f'{texture}: {w}×{h} is not square – an atlas image must keep the square layout of the atlas')
    img = np.asarray(src.resize((S, S), Image.LANCZOS))
    big = np.asarray(src)
    k = big.shape[0] / S                                               # texture pixels per atlas pixel
    glow = glow_mask(img)
    report = {'texture': os.path.basename(texture), 'roles': {}}
    for i, role in enumerate(legend['roles']):
        inside = (np.abs(rmap - role_colour(i)).sum(-1) < 6)
        calm = inside & (edge > 2.5) & (glow < 0.1)
        if calm.sum() < 2000:
            continue
        dist = ndimage.distance_transform_edt(calm)
        med = np.median(img[calm], 0)
        best = None
        for half in (64, 48, 40, 32, 24, 16):                          # largest square that fits
            ys, xs = np.nonzero(dist >= half * 1.42)
            if len(ys):
                pick = np.random.default_rng(i).choice(len(ys), min(len(ys), 400), replace=False)
                scored = []
                for j in pick:
                    y, x = ys[j], xs[j]
                    crop = img[y - half:y + half, x - half:x + half]
                    scored.append((np.abs(np.median(crop.reshape(-1, 3), 0) - med).sum() + 0.15 * crop.std(), y, x))
                best = (min(scored), half)
                break
        if not best:
            continue
        (_, y, x), half = best
        y0, x0, n = int((y - half) * k), int((x - half) * k), int(2 * half * k)
        crop = big[y0:y0 + n, x0:x0 + n]
        tile = seamless(crop[:n // 2 * 2, :n // 2 * 2])                  # native resolution, no upscaling
        Image.fromarray(tile).save(os.path.join(out, f'{prefix}_{role}.jpg'), quality=90)
        report['roles'][role] = {'crop_px': [x0, y0, n], 'tile_px': int(tile.shape[0]), 'mean': [int(c) for c in tile.reshape(-1, 3).mean(0)], 'area_px': int(inside.sum())}
    # decals: connected glowing motifs drawn as lines, the largest 16, each centred in a cell with alpha from its glow (soft)
    gb = glow_mask(big)
    lab, count = ndimage.label(ndimage.binary_dilation(gb > 0.35, iterations=int(6 * k)))
    boxes = [b for b in ndimage.find_objects(lab) if b is not None]
    boxes = [b for b in boxes if 24 * k <= max(b[0].stop - b[0].start, b[1].stop - b[1].start) <= 140 * k]
    boxes = [b for b in boxes if (gb[b] > 0.35).mean() < 0.22]      # line motifs (runes, traces), not glowing blotches
    boxes.sort(key=lambda b: -(b[0].stop - b[0].start) * (b[1].stop - b[1].start))
    sheet = np.zeros((GRID * CELL, GRID * CELL, 4), np.uint8)
    for c, b in enumerate(boxes[:GRID * GRID]):
        rgb, a = big[b], np.clip(gb[b] * 1.6, 0, 1)
        a = np.asarray(Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(k))).astype(np.float32) / 255
        h, w = a.shape
        s = (CELL - 24) / max(h, w)
        rgba = np.dstack([rgb, (a * 255).astype(np.uint8)])
        cell = np.asarray(Image.fromarray(rgba).resize((max(1, int(w * s)), max(1, int(h * s))), Image.LANCZOS))
        oy, ox = (c // GRID) * CELL + (CELL - cell.shape[0]) // 2, (c % GRID) * CELL + (CELL - cell.shape[1]) // 2
        sheet[oy:oy + cell.shape[0], ox:ox + cell.shape[1]] = cell
    Image.fromarray(sheet).save(os.path.join(out, f'{prefix}_decals.png'), optimize=True)
    report['decals'] = min(len(boxes), GRID * GRID)
    json.dump(report, open(os.path.join(out, f'{prefix}_swatches.json'), 'w'), indent=1)
    print(json.dumps(report))


if __name__ == '__main__':
    main(*sys.argv[1:5])
