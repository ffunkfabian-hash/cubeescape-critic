#!/usr/bin/env python3
"""Step 1: extract every frame of reference/robot/turnaround.mp4 and cut out the robot.

Background is a near-white studio sweep (~250); the toon render has dark outlines, so a flood fill of
background-like pixels from the frame border stops at the silhouette and closes the holes inside it.
The faint floor shadow under the feet is excluded by a stricter threshold below the ankles.
Writes runs/robot/frames/fNNN.png and runs/robot/masks/fNNN.png. Usage: python3 segment.py [repo-root]
"""
import os
import subprocess
import sys

import numpy as np
from PIL import Image
from scipy import ndimage as ndi


def mask_of(rgb):
    a = rgb.astype(np.int16)
    lum = a.mean(2)
    chroma = a.max(2) - a.min(2)
    bg_level = np.median(np.concatenate([lum[:8].ravel(), lum[:, :8].ravel(), lum[:, -8:].ravel()]))
    near_bg = (np.abs(lum - bg_level) < 9) & (chroma < 8)
    # Floor shadow: light grey, no chroma, in the lowest band of the frame.
    h = lum.shape[0]
    band = np.zeros_like(near_bg)
    band[int(h * 0.86):] = True
    near_bg |= band & (lum > bg_level - 22) & (chroma < 6)
    lab, _ = ndi.label(near_bg)
    border = np.unique(np.concatenate([lab[0], lab[:, 0], lab[:, -1], lab[-1]]))
    background = np.isin(lab, border[border > 0])
    fg = ~background
    fg = ndi.binary_opening(fg, iterations=1)
    # Keep the largest component (the robot).
    lab, n = ndi.label(fg)
    if n > 1:
        sizes = ndi.sum(fg, lab, range(1, n + 1))
        fg = lab == (1 + int(np.argmax(sizes)))
    return fg


def main():
    root = sys.argv[1] if len(sys.argv) > 1 else os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
    video = os.path.join(root, 'reference', 'robot', 'turnaround.mp4')
    frames = os.path.join(root, 'runs', 'robot', 'frames')
    masks = os.path.join(root, 'runs', 'robot', 'masks')
    os.makedirs(frames, exist_ok=True)
    os.makedirs(masks, exist_ok=True)
    if not os.listdir(frames):
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', video, os.path.join(frames, 'f%03d.png')], check=True)
    names = sorted(f for f in os.listdir(frames) if f.endswith('.png'))
    areas = []
    for f in names:
        m = mask_of(np.asarray(Image.open(os.path.join(frames, f)).convert('RGB')))
        Image.fromarray((m * 255).astype(np.uint8)).save(os.path.join(masks, f))
        areas.append(int(m.sum()))
    print(f'{len(names)} Masken, Fläche min {min(areas)} max {max(areas)} px')


if __name__ == '__main__':
    main()
