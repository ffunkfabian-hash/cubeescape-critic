#!/usr/bin/env python3
"""Model sheet -> part silhouettes and projection maps for the procedural robot.

Input: reference/robot/sheet/model_sheet.svg, rendered at 2x by render_svg.mjs to runs/robot/sheet2x.png.
All six drawings are orthographic and share one scale (2036 px at 2x = robot height 1.85 units, feet at Y = 0).
For every part in PARTS the robot silhouette inside the part's box is traced in the front, side and (optionally) top
view and stored as polygons in model units; the shader projects the sheet drawing onto each part only from views in
which the label map assigns those pixels to that part.
Writes web/src/robot/sheet.json, web/public/robot/sheet.png and web/public/robot/sheet_label.png.
Usage: python3 sheet.py [repo-root]
"""
import json
import os
import subprocess
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from skimage.measure import approximate_polygon, find_contours

S = 2036 / 1.85  # px (at 2x) per unit
G = 2132  # ground line (feet) in px
# View -> (origin x, origin y, U, V, view direction); px = ox + S*dot(P, U), py = oy - S*dot(P, V).
VIEWS = {
    'front': dict(ox=688, oy=G, U=(1, 0, 0), V=(0, 1, 0), D=(0, 0, 1), box=(146, 1230)),
    'back': dict(ox=2022, oy=G, U=(-1, 0, 0), V=(0, 1, 0), D=(0, 0, -1), box=(1480, 2564)),
    'right': dict(ox=3220, oy=G, U=(0, 0, 1), V=(0, 1, 0), D=(-1, 0, 0), box=(3009, 3442)),  # robot's right side (-X)
    'left': dict(ox=3891.5, oy=G, U=(0, 0, -1), V=(0, 1, 0), D=(1, 0, 0), box=(3683, 4116)),
    'top': dict(ox=4830, oy=650, U=(1, 0, 0), V=(0, 0, -1), D=(0, 1, 0), box=(4300, 5380)),
}

# Parts: boxes in model units. 'front' = (x0, x1, y0, y1); 'side' = (z0, z1, y0, y1); 'top' = (x0, x1, z0, z1).
# Right-side parts (-X) are given; '_L' twins are mirrored automatically. 'round' = super-ellipsoid exponents.
# List order is label priority (later wins): parts nearer to the side camera (arms before legs) come later.
PARTS = [
    dict(name='Torso', front=(-0.2, 0.2, 1.19, 1.6), side=(-0.21, 0.15, 1.19, 1.6), top=(-0.2, 0.2, -0.21, 0.18), round=(0.55, 0.45)),
    dict(name='Pelvis', front=(-0.21, 0.21, 0.9, 1.06), side=(-0.16, 0.13, 0.9, 1.06), round=(0.5, 0.5)),
    dict(name='Belt', front=(-0.22, 0.22, 1.04, 1.21), side=(-0.19, 0.16, 1.04, 1.21), round=(0.4, 0.3)),
    dict(name='Scarf', front=(-0.17, 0.17, 1.51, 1.67), side=(-0.15, 0.13, 1.51, 1.67), round=(0.8, 0.6)),
    dict(name='Head', front=(-0.12, 0.12, 1.63, 1.9), side=(-0.13, 0.13, 1.63, 1.9), round=(0.75, 0.7)),
    dict(name='Thigh_R', front=(-0.26, -0.03, 0.66, 0.99), side=(-0.11, 0.1, 0.66, 0.99), round=(0.65, 0.4)),
    dict(name='Knee_R', front=(-0.25, -0.09, 0.53, 0.69), side=(-0.09, 0.11, 0.53, 0.69), round=(0.6, 0.5)),
    dict(name='Shin_R', front=(-0.28, -0.07, 0.17, 0.55), side=(-0.13, 0.07, 0.17, 0.55), round=(0.6, 0.35)),
    dict(name='Boot_R', front=(-0.33, -0.09, 0.0, 0.19), side=(-0.13, 0.21, 0.0, 0.19), round=(0.45, 0.4)),
    dict(name='UpperArm_R', front=(-0.4, -0.22, 1.24, 1.42), side=(-0.15, 0.05, 1.24, 1.42), round=(0.7, 0.4)),
    dict(name='Elbow_R', front=(-0.41, -0.26, 1.16, 1.27), side=(-0.14, 0.02, 1.16, 1.27), round=(0.8, 0.7)),
    dict(name='Forearm_R', front=(-0.48, -0.28, 0.95, 1.2), side=(-0.15, 0.05, 0.95, 1.2), round=(0.6, 0.4)),
    dict(name='Hand_R', front=(-0.53, -0.36, 0.77, 0.97), side=(-0.08, 0.11, 0.77, 0.97), round=(0.7, 0.6)),
    dict(name='Pauldron_R', front=(-0.41, -0.16, 1.34, 1.63), side=(-0.19, 0.1, 1.34, 1.63), round=(0.6, 0.6)),
]


def mirror(p):
    q = dict(p, name=p['name'][:-2] + '_L')
    x0, x1, y0, y1 = p['front']
    q['front'] = (-x1, -x0, y0, y1)
    if 'top' in p:
        x0, x1, z0, z1 = p['top']
        q['top'] = (-x1, -x0, z0, z1)
    return q


def to_px(view, a0, a1, b0, b1):
    """Box in view coordinates (u along U, v along V) -> pixel rectangle."""
    v = VIEWS[view]
    xs = sorted([v['ox'] + S * a0 * sum(v['U']), v['ox'] + S * a1 * sum(v['U'])])
    ys = sorted([v['oy'] - S * b0 * sum(v['V']), v['oy'] - S * b1 * sum(v['V'])])
    return int(xs[0]), int(np.ceil(xs[1])), int(ys[0]), int(np.ceil(ys[1]))


def silhouette(fg, view, box):
    x0, x1, y0, y1 = to_px(view, *box)
    m = np.zeros_like(fg)
    m[y0:y1, x0:x1] = fg[y0:y1, x0:x1]
    lab, n = ndi.label(m)
    if n > 1:
        m = lab == (1 + int(np.argmax(ndi.sum(m, lab, range(1, n + 1)))))
    return m


def polygon(mask, view):
    c = max(find_contours(np.pad(mask, 1).astype(float), 0.5), key=len) - 1
    c = approximate_polygon(c, tolerance=1.2)
    v = VIEWS[view]
    su, sv = sum(v['U']), sum(v['V'])
    # contour rows/cols -> (u, v) in units along the view axes, with signs folded back to model axes
    return [[round((x - v['ox']) / S * su, 5), round((v['oy'] - y) / S * sv, 5)] for y, x in c]


def main():
    root = sys.argv[1] if len(sys.argv) > 1 else os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
    png = os.path.join(root, 'runs', 'robot', 'sheet2x.png')
    if not os.path.exists(png):
        os.makedirs(os.path.dirname(png), exist_ok=True)
        svg = os.path.join(root, 'reference', 'robot', 'sheet', 'model_sheet.svg')
        subprocess.run(['node', os.path.join(os.path.dirname(__file__), 'render_svg.mjs'), svg, png, '2'], check=True)
    img = Image.open(png).convert('RGB')
    a = np.asarray(img).astype(np.int16)
    near_white = a.min(2) > 235
    lab, _ = ndi.label(near_white)
    border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    fg = ~np.isin(lab, border[border > 0])

    parts = []
    for p in PARTS:
        parts.append(p)
        if p['name'].endswith('_R'):
            parts.append(mirror(p))
    label = np.zeros(fg.shape, np.uint8)
    out = dict(scale=S, ground=G, size=[img.width, img.height], views=VIEWS, parts=[])
    for pid, p in enumerate(parts, start=1):
        side_view = 'left' if p['name'].endswith('_L') else 'right'
        entry = dict(name=p['name'], id=pid, round=p['round'])
        fm = silhouette(fg, 'front', p['front'])
        entry['front'] = polygon(fm, 'front')
        sm = silhouette(fg, side_view, p['side'])
        entry['side'] = polygon(sm, side_view)
        if 'top' in p:
            tm = silhouette(fg, 'top', p['top'])
            entry['top'] = polygon(tm, 'top')
            label[tm] = pid
        bm = silhouette(fg, 'back', p['front'])
        # Labels: later parts win where boxes overlap (list order = priority); centre parts label both side views.
        label[fm] = pid
        label[bm] = pid
        label[sm] = pid
        if not (p['name'].endswith('_R') or p['name'].endswith('_L')):
            label[silhouette(fg, 'left', p['side'])] = pid
        entry['box'] = dict(front=p['front'], side=p['side'])
        out['parts'].append(entry)
        print(f"{p['name']:12s} id {pid}: Front {len(entry['front'])} Punkte, Seite {len(entry['side'])}" + (f", oben {len(entry['top'])}" if 'top' in entry else ''))

    pub = os.path.join(root, 'web', 'public', 'robot')
    os.makedirs(pub, exist_ok=True)
    img.save(os.path.join(pub, 'sheet.png'))
    Image.fromarray(np.stack([label, label, label], 2)).save(os.path.join(pub, 'sheet_label.png'))
    os.makedirs(os.path.join(root, 'web', 'src', 'robot'), exist_ok=True)
    json.dump(out, open(os.path.join(root, 'web', 'src', 'robot', 'sheet.json'), 'w'), separators=(',', ':'))


if __name__ == '__main__':
    main()
