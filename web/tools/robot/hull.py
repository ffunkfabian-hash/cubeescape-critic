#!/usr/bin/env python3
"""Step 2: fit the turntable camera to all 241 silhouettes and carve the visual hull.

Camera model: the robot turns about a vertical axis; frame i is seen from azimuth phi_i, elevation e, distance D
(perspective; D = 0 means orthographic) with scale s (px per unit) and image position (cx, cy) of the origin.
1. Global fit with a constant turn rate, phi_i = sign * 2*pi * i / T + phi0, by coordinate search maximising the mean
   silhouette IoU between the carved hull and every frame's mask.
2. The AI video does not turn evenly, so every frame then gets its own azimuth: search around phi_i for the best IoU
   of the current hull, smooth the sequence, carve again (several rounds).
The final hull keeps a voxel when it projects into the (slightly dilated) mask in at least `keep` of all frames, so a
few inconsistent frames cannot erase thin parts.
Writes runs/robot/camera.json and runs/robot/hull.npz. Usage: python3 hull.py [repo-root]
"""
import json
import os
import sys
import time

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

BOX = np.array([[-0.62, 0.62], [-1.0, 1.0], [-0.62, 0.62]])  # x, y, z in units (robot height ~1.85)


def load_masks(folder, step):
    names = sorted(f for f in os.listdir(folder) if f.endswith('.png'))
    ms = []
    for f in names:
        m = np.asarray(Image.open(os.path.join(folder, f))) > 127
        if step > 1:
            h, w = m.shape
            m = m[: h - h % step, : w - w % step].reshape(h // step, step, w // step, step).mean((1, 3)) > 0.5
        ms.append(m)
    return np.stack(ms)


def grid(n):
    axes = [np.linspace(lo, hi, k) for (lo, hi), k in zip(BOX, n)]
    X, Y, Z = np.meshgrid(*axes, indexing='ij')
    return np.stack([X.ravel(), Y.ravel(), Z.ravel()], 1).astype(np.float32), axes


def azimuth(cam, i):
    if 'phis' in cam:
        return cam['phis'][i]
    return cam['sign'] * 2 * np.pi * i / cam['T'] + cam['phi0']


def project(P, cam, i, scale=1.0, phi=None):
    """World points (N, 3) -> pixel coords (u, v) in frame i at image scale `scale` (1 = full resolution)."""
    phi = azimuth(cam, i) if phi is None else phi
    e = cam['e']
    r = np.array([np.cos(phi), 0, -np.sin(phi)], np.float32)
    d = np.array([np.sin(phi) * np.cos(e), np.sin(e), np.cos(phi) * np.cos(e)], np.float32)
    up = np.array([-np.sin(phi) * np.sin(e), np.cos(e), -np.cos(phi) * np.sin(e)], np.float32)
    x, y = P @ r, P @ up
    if cam['D'] > 0:
        k = cam['D'] / (cam['D'] - P @ d)
        x, y = x * k, y * k
    s = cam['s'] * scale
    return cam['cx'] * scale + s * x, cam['cy'] * scale - s * y


def votes(P, masks, cam, scale, frames=None):
    n, h, w = masks.shape
    frames = range(n) if frames is None else frames
    cnt = np.zeros(len(P), np.int32)
    for i in frames:
        u, v = project(P, cam, i, scale)
        ui, vi = np.round(u).astype(np.int32), np.round(v).astype(np.int32)
        ok = (ui >= 0) & (ui < w) & (vi >= 0) & (vi < h)
        hit = np.zeros(len(P), bool)
        hit[ok] = masks[i, vi[ok], ui[ok]]
        cnt += hit
    return cnt


def frame_iou(P, vox, mask, cam, i, scale, phi=None):
    h, w = mask.shape
    rad = max(1, int(np.ceil(cam['s'] * scale * vox * 0.75)))
    u, v = project(P, cam, i, scale, phi)
    ui, vi = np.round(u).astype(np.int32), np.round(v).astype(np.int32)
    ok = (ui >= 0) & (ui < w) & (vi >= 0) & (vi < h)
    img = np.zeros((h, w), bool)
    img[vi[ok], ui[ok]] = True
    img = ndi.binary_dilation(img, iterations=rad)
    return (img & mask).sum() / max((img | mask).sum(), 1)


def reproject_iou(P, vox, masks, cam, scale, frames, per_frame=False):
    ious = [frame_iou(P, vox, masks[i], cam, i, scale) for i in frames]
    return ious if per_frame else float(np.mean(ious))


def refine_azimuths(masks_lo, cam, rounds=3):
    """Per-frame azimuth search against the current hull; returns cam with 'phis'."""
    n = masks_lo.shape[0]
    cam = dict(cam, phis=[float(azimuth(cam, i)) for i in range(n)])
    P, axes = grid((64, 104, 64))
    vox = axes[0][1] - axes[0][0]
    for rnd in range(rounds):
        c = votes(P, masks_lo, cam, 1.0)
        hull = P[c >= 0.95 * n]
        span = np.radians(12 if rnd == 0 else 4)
        new = []
        for i in range(n):
            base = cam['phis'][i]
            cands = base + np.linspace(-span, span, 25)
            sc = [frame_iou(hull, vox, masks_lo[i], cam, i, 1.0, ph) for ph in cands]
            new.append(float(cands[int(np.argmax(sc))]))
        # Unwrap and smooth: the turn is continuous, single-frame outliers are search noise.
        new = np.unwrap(np.array(new))
        new = ndi.median_filter(new, size=5, mode='nearest')
        new = ndi.gaussian_filter1d(new, 1.0, mode='nearest')
        cam['phis'] = new.tolist()
        c = votes(P, masks_lo, cam, 1.0)
        hull = P[c >= 0.95 * n]
        print(f'Azimut-Runde {rnd + 1}: IoU {reproject_iou(hull, vox, masks_lo, cam, 1.0, range(n)):.4f}')
    return cam


def score(cam, masks, scale, P, vox, keep, sub):
    frames = range(0, masks.shape[0], sub)
    c = votes(P, masks, cam, scale, frames)
    kept = P[c >= keep * len(frames)]
    if len(kept) == 0:
        return 0.0
    return reproject_iou(kept, vox, masks, cam, scale, frames)


def initial_camera(masks):
    n, h, w = masks.shape
    m0 = masks[0]
    ys, xs = np.nonzero(m0)
    top, bot = ys.min(), ys.max()
    cx = float(np.mean([np.nonzero(m)[1].mean() for m in masks]))
    s = (bot - top) / 1.85
    return dict(T=float(n - 1), sign=-1.0, phi0=0.0, e=0.05, D=0.0, s=float(s), cx=cx, cy=float((top + bot) / 2))


def fit(masks_lo, scale):
    P, axes = grid((40, 64, 40))
    vox = axes[0][1] - axes[0][0]
    cam = initial_camera(masks_lo)
    for k in ('s', 'cx', 'cy'):
        cam[k] /= scale
    best = score(cam, masks_lo, scale, P, vox, 0.95, 3)
    for sign in (1.0,):
        trial = dict(cam, sign=sign)
        sc = score(trial, masks_lo, scale, P, vox, 0.95, 3)
        if sc > best:
            cam, best = trial, sc
    print(f'start IoU {best:.4f}  sign {cam["sign"]:+.0f}')
    steps = dict(T=4.0, phi0=0.06, e=0.04, s=8.0, cx=4.0, cy=4.0)
    D_options = [0.0, 12.0, 8.0, 6.0, 4.5]
    for rnd in range(4):
        for D in D_options:
            trial = dict(cam, D=D)
            sc = score(trial, masks_lo, scale, P, vox, 0.95, 3)
            if sc > best + 1e-4:
                cam, best = trial, sc
        for k, st in steps.items():
            improved = True
            while improved:
                improved = False
                for sgn in (1, -1):
                    trial = dict(cam)
                    trial[k] += sgn * st
                    sc = score(trial, masks_lo, scale, P, vox, 0.95, 3)
                    if sc > best + 1e-4:
                        cam, best, improved = trial, sc, True
                        break
        steps = {k: v / 2 for k, v in steps.items()}
        print(f'Runde {rnd + 1}: IoU {best:.4f}  ' + ' '.join(f'{k}={v:.3f}' for k, v in cam.items()))
    return cam, best


def carve(masks, cam, n, keep, dilate):
    """Fine carving with pruning: a voxel is dropped as soon as it misses more than (1 - keep) of all frames."""
    P, axes = grid(n)
    vox = axes[0][1] - axes[0][0]
    if dilate:
        masks = np.stack([ndi.binary_dilation(m, iterations=dilate) for m in masks])
    frames, h, w = masks.shape
    allowed = int((1 - keep) * frames)
    active = np.arange(len(P))
    miss = np.zeros(len(P), np.int16)
    for i in range(frames):
        u, v = project(P[active], cam, i, 1.0)
        ui, vi = np.round(u).astype(np.int32), np.round(v).astype(np.int32)
        ok = (ui >= 0) & (ui < w) & (vi >= 0) & (vi < h)
        hit = np.zeros(len(active), bool)
        hit[ok] = masks[i, vi[ok], ui[ok]]
        miss[active[~hit]] += 1
        active = active[miss[active] <= allowed]
    occ = np.zeros(len(P), bool)
    occ[active] = True
    return occ.reshape(n), axes, vox


def main():
    root = sys.argv[1] if len(sys.argv) > 1 else os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
    run = os.path.join(root, 'runs', 'robot')
    t0 = time.time()
    lo = 4
    cam_lo, best = fit(load_masks(os.path.join(run, 'masks'), lo), 1.0)
    cam = dict(cam_lo)
    for k in ('s', 'cx', 'cy'):
        cam[k] = cam_lo[k] * lo
    print(f'Kamera nach {time.time() - t0:.0f} s: IoU (1/{lo} Auflösung) {best:.4f}')
    cam_lo = refine_azimuths(load_masks(os.path.join(run, 'masks'), lo), cam_lo)
    cam['phis'] = cam_lo['phis']
    masks = load_masks(os.path.join(run, 'masks'), 1)
    occ, axes, vox = carve(masks, cam, (230, 370, 230), 0.95, 2)
    P = np.stack(np.meshgrid(*axes, indexing='ij'), -1).reshape(-1, 3)[occ.ravel()]
    ious = reproject_iou(P.astype(np.float32), vox, masks[:, ::2, ::2], cam, 0.5, range(masks.shape[0]), per_frame=True)
    iou = float(np.mean(ious))
    print(f'Hülle: {occ.sum()} Voxel, Rückprojektion IoU über alle {masks.shape[0]} Frames {iou:.4f} '
          f'(min {min(ious):.3f} in Frame {int(np.argmin(ious))})  ({time.time() - t0:.0f} s)')
    out = dict(cam, hull_iou_all_frames=round(iou, 4), hull_iou_per_frame=[round(float(x), 4) for x in ious], frames=int(masks.shape[0]))
    json.dump(out, open(os.path.join(run, 'camera.json'), 'w'), indent=1)
    np.savez_compressed(os.path.join(run, 'hull.npz'), occ=occ, x=axes[0], y=axes[1], z=axes[2])


if __name__ == '__main__':
    main()
