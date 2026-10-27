#!/usr/bin/env python3
"""Compare the orthographic renders of the procedural robot with the matching drawings of the model sheet.

The viewer shows 2.0 units over 1100 px (550 px/unit); the sheet is rendered at 2x (S px/unit), so the matching sheet
crop is centred on the view target and 800*S/550 px wide. Writes web/renders/parts_iou.json and parts_compare.png
(per view: sheet | render | deviations, amber = only sheet, blue = only render). Usage: python3 parts_iou.py [repo-root]
"""
import json
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

VIEWS = ['front', 'back', 'right', 'left', 'top']
W, H, SPAN = 800, 1100, 2.0
AMBER, SKY = (232, 150, 40), (50, 140, 235)


def main():
    root = sys.argv[1] if len(sys.argv) > 1 else os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
    meta = json.load(open(os.path.join(root, 'web', 'src', 'robot', 'sheet.json')))
    S = meta['scale']
    sheet = Image.open(os.path.join(root, 'runs', 'robot', 'sheet2x.png')).convert('RGB')
    a = np.asarray(sheet).astype(np.int16)
    lab, _ = ndi.label(a.min(2) > 235)
    border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    fg_sheet = ~np.isin(lab, border[border > 0])
    out = os.path.join(root, 'web', 'renders')
    k = S / (H / SPAN)  # sheet px per render px
    res, tiles = {}, []
    for v in VIEWS:
        vw = meta['views'][v]
        t = (0, 1.2, 0) if v == 'top' else (0, 0.95, 0)
        sx = vw['ox'] + S * sum(p * u for p, u in zip(t, vw['U']))
        sy = vw['oy'] - S * sum(p * u for p, u in zip(t, vw['V']))
        box = (int(sx - k * W / 2), int(sy - k * H / 2), int(sx + k * W / 2), int(sy + k * H / 2))
        ref_rgb = sheet.crop(box).resize((W, H))
        # Only the drawing of this view: blank out neighbouring drawings outside the view's column range.
        m = Image.fromarray((fg_sheet * 255).astype(np.uint8)).crop(box).resize((W, H))
        ref = np.asarray(m) > 127
        x0, x1 = vw['box']
        cols = (np.arange(W) * k + box[0])
        ref[:, (cols < x0) | (cols > x1)] = False
        ren = np.asarray(Image.open(os.path.join(out, f'parts_mask_{v}.png')).convert('L')) > 127
        res[v] = round(float((ref & ren).sum() / max((ref | ren).sum(), 1)), 4)
        if ref.any() and ren.any():
            shift = (np.nonzero(ren)[1].mean() - np.nonzero(ref)[1].mean()) / (H / SPAN)
            print(f'{v}: Versatz Render gegen Sheet {shift:+.3f} Einheiten (Bildachse)')
        lum = np.asarray(ref_rgb.convert('L'), np.float32)
        dev = (120 + lum * 0.5)[..., None].repeat(3, 2)
        dev[ref & ~ren] = AMBER
        dev[~ref & ren] = SKY
        tiles.append([ref_rgb, Image.open(os.path.join(out, f'parts_{v}.png')).convert('RGB'), Image.fromarray(dev.clip(0, 255).astype(np.uint8))])
    res['mean'] = round(float(np.mean([res[v] for v in VIEWS])), 4)
    json.dump(res, open(os.path.join(out, 'parts_iou.json'), 'w'), indent=2)
    tw, th = 240, 330
    sheet_img = Image.new('RGB', (tw * 3, th * len(tiles)), (40, 40, 40))
    for r, row in enumerate(tiles):
        for c, t in enumerate(row):
            sheet_img.paste(t.resize((tw, th)), (c * tw, r * th))
    sheet_img.save(os.path.join(out, 'parts_compare.png'))
    print('IoU ' + '  '.join(f'{k}={v:.3f}' for k, v in res.items()))


if __name__ == '__main__':
    main()
