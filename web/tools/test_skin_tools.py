#!/usr/bin/env python3
"""Image sizes of the generator tools (0.16): the guide map keeps the square atlas size with the legend apart, and skin_swatches.py
drops a legend left under a returned map and refuses a non-square atlas image. Needs SciPy (tool dependency, not in CI)."""
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


if __name__ == '__main__':
    unittest.main()
