#!/usr/bin/env python3
"""Image sizes of the generator tools (0.16): the guide map keeps the square atlas size with the legend apart, and skin_swatches.py
drops a legend left under a returned map and refuses a non-square atlas image; a motif sheet on black becomes a decal sheet with
alpha from the brightness (0.17). Needs SciPy (web/requirements.txt since 0.17, so it runs in CI)."""
import importlib.util
import json
import os
import sys
import tempfile
import unittest

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
HAS_SCIPY = importlib.util.find_spec('scipy') is not None


def debug_dir(tmp, n=64):
    import skin_guide as G
    role = np.zeros((n, n, 3), np.uint8)
    role[8:40, 8:40] = G.debug_colour(1000)          # role 0: shell
    role[44:60, 8:56] = G.debug_colour(1001)         # role 1: graphite
    part = np.zeros((n, n, 3), np.uint8)
    part[8:40, 8:40] = G.debug_colour(0)             # part 0: chest (motif zone)
    Image.fromarray(role).save(os.path.join(tmp, 'role.png'))
    Image.fromarray(part).save(os.path.join(tmp, 'part.png'))
    Image.fromarray(np.full((n, n), 0, np.uint8)).save(os.path.join(tmp, 'edge.png'))
    json.dump({'roles': ['shell', 'graphite'], 'parts': ['chest']}, open(os.path.join(tmp, 'legend.json'), 'w'))
    maps = np.zeros((n, n, 3), np.uint8)
    maps[..., 2] = ((role.sum(-1) > 0) * 255).astype(np.uint8)
    Image.fromarray(maps).save(os.path.join(tmp, 'maps.png'))
    return tmp


@unittest.skipUnless(HAS_SCIPY, 'SciPy not installed (tool dependency)')
class SkinTools(unittest.TestCase):
    def test_guide_is_square_with_separate_legend(self):
        import skin_guide as G
        with tempfile.TemporaryDirectory() as tmp:
            d = debug_dir(tmp)
            out = os.path.join(tmp, 'guide.png')
            G.main(d, os.path.join(d, 'maps.png'), out)
            self.assertEqual(Image.open(out).size, (64, 64))
            self.assertTrue(os.path.exists(os.path.join(tmp, 'guide_legende.png')))
            px = np.asarray(Image.open(out).convert('RGB'))
            self.assertEqual(tuple(px[24, 24]), tuple(G.hexrgb(G.PALETTE['shell'][0])))   # island in its role colour
            self.assertTrue(((px == (255, 0, 255)).all(-1)).any())                          # motif zone outlined

    def test_swatches_drop_legend_and_refuse_wide_images(self):
        import skin_swatches as W
        with tempfile.TemporaryDirectory() as tmp:
            d = debug_dir(tmp)
            tall = os.path.join(tmp, 'tall.png')
            Image.fromarray(np.full((128 + 40, 128, 3), 90, np.uint8)).save(tall)   # map 2× plus a legend strip
            W.main(tall, d, tmp, 't')
            self.assertTrue(os.path.exists(os.path.join(tmp, 't_swatches.json')))
            wide = os.path.join(tmp, 'wide.png')
            Image.fromarray(np.full((128, 160, 3), 90, np.uint8)).save(wide)
            with self.assertRaises(SystemExit):
                W.main(wide, d, tmp, 'w')

    def test_motif_sheet_on_black_becomes_decals_with_alpha(self):
        import skin_swatches as W
        with tempfile.TemporaryDirectory() as tmp:
            n = 512                                                   # 4 × 4 cells of 128 px
            img = np.zeros((n, n, 3), np.uint8)
            for r in range(4):
                for c in range(4):
                    if (r, c) != (3, 3):                              # one empty cell
                        y, x = r * 128 + 64, c * 128 + 64
                        img[y - 2:y + 2, x - 40:x + 40] = (60, 220, 255)     # bright cyan bar
                        img[y - 30:y + 30, x - 1:x + 1] = (20, 70, 80)      # faint stroke (about a third as bright)
            sheet = os.path.join(tmp, 'motifs.png')
            Image.fromarray(img).save(sheet)
            rep = W.decal_sheet(sheet, tmp, 'm')
            out = np.asarray(Image.open(os.path.join(tmp, 'm_decals.png')))
            self.assertEqual(out.shape, (1024, 1024, 4))
            self.assertEqual(rep['decals'], 15)
            self.assertEqual(rep['empty_cells'], [15])
            self.assertEqual(out[10, 10, 3], 0)                       # black background transparent
            bar = out[128, 128 + 40]                                  # bar of cell 0, away from the stroke
            self.assertEqual(bar[3], 255)
            self.assertTrue(int(bar[2]) > 230 and 190 < int(bar[1]) < 230, bar)       # cyan, softened by the resize
            faint = out[128 - 40, 128]                                # faint stroke: half transparent, colour un-premultiplied
            self.assertTrue(0 < faint[3] < 200, faint)
            self.assertGreater(int(faint[2]), 120)                     # brighter than the premultiplied 80
            wide = os.path.join(tmp, 'wide.png')
            Image.fromarray(np.zeros((128, 160, 3), np.uint8)).save(wide)
            with self.assertRaises(SystemExit):
                W.decal_sheet(wide, tmp, 'w')


if __name__ == '__main__':
    unittest.main()
