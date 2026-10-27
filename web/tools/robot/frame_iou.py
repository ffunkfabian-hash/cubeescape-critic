#!/usr/bin/env python3
"""Step 4: silhouette IoU of the browser render against every video frame.

Inputs: runs/robot/masks (video), runs/robot/render_masks (verify_robot.mjs), runs/robot/camera.json.
Outputs: web/renders/robot_iou.json (per frame + mean), robot_iou_chart.png (IoU over all frames) and
robot_compare.png (front/left/back/right: video frame | render | deviations, amber = only video, blue = only render).
Usage: python3 frame_iou.py [repo-root]
"""
import json
import math
import os
import sys

import numpy as np
from PIL import Image, ImageDraw

AMBER = (232, 150, 40)
SKY = (50, 140, 235)


def load(p):
    return np.asarray(Image.open(p).convert('L')) > 127


def view_frames(phis):
    want = dict(front=0.0, left=math.pi / 2, back=math.pi, right=-math.pi / 2)
    wrap = lambda a: math.atan2(math.sin(a), math.cos(a))  # noqa: E731
    return {k: min(range(len(phis)), key=lambda i: abs(wrap(phis[i] - a))) for k, a in want.items()}


def deviation_view(frame_rgb, a, b):
    lum = np.asarray(frame_rgb.convert('L'), np.float32)
    out = (120 + lum * 0.5)[..., None].repeat(3, 2)
    out[a & ~b] = AMBER
    out[~a & b] = SKY
    return Image.fromarray(out.clip(0, 255).astype(np.uint8))


def chart(ious, path, mean):
    w, h, pad = 960, 260, 40
    img = Image.new('RGB', (w, h), (250, 250, 250))
    d = ImageDraw.Draw(img)
    lo = 0.7
    y = lambda v: h - pad - (v - lo) / (1 - lo) * (h - 2 * pad)  # noqa: E731
    for g in (0.7, 0.8, 0.9, 1.0):
        d.line([(pad, y(g)), (w - 10, y(g))], fill=(225, 225, 225))
        d.text((6, y(g) - 6), f'{g:.1f}', fill=(110, 110, 110))
    pts = [(pad + i / (len(ious) - 1) * (w - pad - 10), y(max(v, lo))) for i, v in enumerate(ious)]
    d.line(pts, fill=(50, 120, 210), width=2)
    d.line([(pad, y(mean)), (w - 10, y(mean))], fill=AMBER, width=1)
    d.text((pad, 8), f'Umriss-IoU je Videoframe (0-{len(ious) - 1}), Mittel {mean:.3f}', fill=(40, 40, 40))
    img.save(path)


def main():
    root = sys.argv[1] if len(sys.argv) > 1 else os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
    run, out = os.path.join(root, 'runs', 'robot'), os.path.join(root, 'web', 'renders')
    os.makedirs(out, exist_ok=True)
    names = sorted(f for f in os.listdir(os.path.join(run, 'render_masks')) if f.endswith('.png'))
    ious = []
    for f in names:
        a, b = load(os.path.join(run, 'masks', f)), load(os.path.join(run, 'render_masks', f))
        ious.append(float((a & b).sum() / max((a | b).sum(), 1)))
    mean = float(np.mean(ious))
    worst = int(np.argmin(ious))
    json.dump(dict(mean=round(mean, 4), min=round(min(ious), 4), worst_frame=worst, per_frame=[round(v, 4) for v in ious]),
              open(os.path.join(out, 'robot_iou.json'), 'w'), indent=1)
    chart(ious, os.path.join(out, 'robot_iou_chart.png'), mean)

    cam = json.load(open(os.path.join(run, 'camera.json')))
    rows = []
    for v, i in view_frames(cam['phis']).items():
        f = f'f{i + 1:03d}.png'
        ref = Image.open(os.path.join(run, 'frames', f)).convert('RGB')
        ren = Image.open(os.path.join(out, f'robot_render_{v}.png')).convert('RGB')
        dev = deviation_view(ref, load(os.path.join(run, 'masks', f)), load(os.path.join(run, 'render_masks', f)))
        rows.append([t.crop((340, 0, 940, 720)).resize((300, 360)) for t in (ref, ren, dev)])
    sheet = Image.new('RGB', (300 * 3 * 2, 360 * 2), (40, 40, 40))
    for k, row in enumerate(rows):
        for c, t in enumerate(row):
            sheet.paste(t, ((k % 2) * 900 + c * 300, (k // 2) * 360))
    sheet.save(os.path.join(out, 'robot_compare.png'))
    print(f'Umriss-IoU über {len(ious)} Frames: Mittel {mean:.4f}, min {min(ious):.3f} (Frame {worst})')


if __name__ == '__main__':
    main()
