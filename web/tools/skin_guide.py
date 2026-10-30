#!/usr/bin/env python3
"""Guide map of a skin atlas for an image generator (docs/SKINS.md › Prompts für Nano Banana Pro).

Every UV island flat in the colour of its role (legend below the map), white island outlines, a magenta outline around the
islands where glowing motifs may go, everything else black. Input: the debug maps of tools/skin_bake.mjs (role.png, part.png,
legend.json) and the atlas maps.png (coverage).

  python3 tools/skin_guide.py <debug dir, e.g. ../runs/skins/critic> <maps.png> <out.png>
"""
import colorsys
import fnmatch
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

PALETTE = {'shell': ('#D8D8D8', 'shell = Panzerplatten (Hauptmaterial)'), 'graphite': ('#2E4A6B', 'graphite = Grundkoerper dunkel'),
           'dark_metal': ('#6B4A2E', 'dark_metal = Gelenke, Kolben'), 'anodized': ('#2F6B4F', 'anodized = eloxierte Einlagen'),
           'trim': ('#E0B030', 'trim = Zierkanten, Bolzen'), 'accent': ('#E05020', 'accent = Akzentstreifen'),
           'rubber': ('#6B2F6B', 'rubber = Gummi, Leitungen'), 'energy': ('#00FFFF', 'energy = Lichter (leuchtend)'),
           'reticle_cyan': ('#00A0FF', 'reticle = Visier (leuchtend)')}
MOTIF = ['chest', 'chest_*', 'abs_*', 'solar', 'tasset', 'thigh_shell', 'shin_shell', 'boot_cuff', 'back', 'blade_*', 'backpack_shell',
         'butt', 'calf', 'pauldron_l', 'pauldron_r', 'pauldron_*_flare*', 'fore_shell', 'upper_shell_r', 'tasset_side_*', 'cap',
         'forehead_plate_*', 'cheek_*', 'rear_field_*', 'shell']
NOT_MOTIF = ['*_edge', '*_rim_*', '*_stripe_*']


def imul(a, b):
    return (a * b) & 0xFFFFFFFF


def debug_colour(s):
    """Colour of id s in the debug maps (skin_bake.mjs › hash, HSL 0.55/0.55)."""
    x = (s * 7919 + 13) & 0xFFFFFFFF
    h = imul(x ^ 0x9e3779b9, 0x85ebca6b)
    h = imul(h ^ (h >> 13), 0xc2b2ae35)
    return np.array([round(c * 255) for c in colorsys.hls_to_rgb(((h ^ (h >> 16)) & 0xFFFFFFFF) / 4294967296, 0.55, 0.55)])


def hexrgb(c):
    return [int(c[k:k + 2], 16) for k in (1, 3, 5)]


def main(debug, maps, out):
    legend = json.load(open(os.path.join(debug, 'legend.json')))
    rm = np.asarray(Image.open(os.path.join(debug, 'role.png')).convert('RGB')).astype(int)
    pm = np.asarray(Image.open(os.path.join(debug, 'part.png')).convert('RGB')).astype(int)
    cov = np.asarray(Image.open(maps).convert('RGB'))[..., 2] > 127
    img = np.zeros(rm.shape, np.uint8)
    roles = {}
    for i, r in enumerate(legend['roles']):
        roles[r] = np.abs(rm - debug_colour(1000 + i)).sum(-1) < 6
        img[roles[r]] = hexrgb(PALETTE.get(r, ('#808080', ''))[0])
    motif = np.zeros(cov.shape, bool)
    for i, p in enumerate(legend['parts']):
        if any(fnmatch.fnmatch(p, g) for g in MOTIF) and not any(fnmatch.fnmatch(p, g) for g in NOT_MOTIF):
            motif |= np.abs(pm - debug_colour(i)).sum(-1) < 6
    motif &= roles.get('shell', motif) | roles.get('anodized', np.zeros_like(motif)) | roles.get('graphite', np.zeros_like(motif))
    zone = ndimage.binary_opening(ndimage.binary_fill_holes(ndimage.binary_closing(motif, iterations=3)), iterations=3)
    img[cov ^ ndimage.binary_erosion(cov)] = 255
    img[zone & ~ndimage.binary_erosion(zone, iterations=3)] = (255, 0, 255)
    S = img.shape[0]
    legend_img = Image.new('RGB', (S, 180)); d = ImageDraw.Draw(legend_img)
    shown = [r for r in PALETTE if r in roles]
    for j, r in enumerate(shown):
        x, y = 20 + (j % 3) * (S // 3), 20 + (j // 3) * 44
        d.rectangle([x, y, x + 32, y + 32], fill=PALETTE[r][0]); d.text((x + 44, y + 9), PALETTE[r][1], fill=(230, 230, 230))
    d.rectangle([20, 150, 52, 170], outline=(255, 0, 255), width=3)
    d.text((64, 154), 'magenta Rand = hier duerfen Motive hin; weisse Linie = Inselrand; schwarz = leer lassen', fill=(230, 230, 230))
    full = Image.new('RGB', (S, S + 180)); full.paste(Image.fromarray(img), (0, 0)); full.paste(legend_img, (0, S))
    full.save(out)
    print(f'{out}: {len(shown)} roles, {int(zone.sum())} motif px')


if __name__ == '__main__':
    main(*sys.argv[1:4])
