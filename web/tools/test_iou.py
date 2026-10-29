"""Focused tests for missing, mixed and empty render measurements."""
import importlib.util
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import json
import sys

import numpy as np
from PIL import Image

spec = importlib.util.spec_from_file_location('helmet_iou', Path(__file__).with_name('iou.py'))
iou = importlib.util.module_from_spec(spec)
spec.loader.exec_module(iou)


class MeasurementTests(unittest.TestCase):
    def test_alternate_output_reads_and_writes_its_own_complete_set(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            refs, default, variant = root / 'refs', root / 'renders', root / 'metal'
            for folder in (refs, default, variant):
                folder.mkdir()
            (default / 'iou.json').write_text('{"untouched": true}')
            reference = np.full((720, 1280, 3), 140, dtype=np.uint8)
            reference[120:400, 450:800] = 35
            mask = np.zeros_like(reference)
            mask[120:400, 450:800] = 255
            for view in iou.VIEWS:
                Image.fromarray(reference).save(refs / f'ref_{view}.png')
                Image.fromarray(reference).save(variant / f'render_{view}.png')
                Image.fromarray(mask).save(variant / f'mask_{view}.png')
            with patch.object(sys, 'argv', ['iou.py', str(root), str(variant)]):
                iou.main()
            self.assertEqual(json.loads((variant / 'iou.json').read_text())['mean'], 1)
            self.assertTrue((variant / 'compare.png').is_file())
            self.assertEqual(json.loads((default / 'iou.json').read_text()), {'untouched': True})

    def test_missing_views_cannot_produce_a_successful_mean(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'refs').mkdir()
            (root / 'renders').mkdir()
            with self.assertRaisesRegex(ValueError, 'Missing input'):
                iou.validate_inputs(root / 'refs', root / 'renders')

    def test_mismatched_image_size_is_rejected_instead_of_rescaled(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            Image.new('RGB', (640, 360)).save(root / 'ref_front.png')
            with self.assertRaisesRegex(ValueError, '1280x720'):
                iou.validate_inputs(root, root)

    def test_empty_render_is_a_failed_measurement(self):
        with self.assertRaisesRegex(ValueError, 'both contain'):
            iou.measure_iou(np.ones((4, 4), bool), np.zeros((4, 4), bool), 4)

    def test_crop_and_intersection_preserve_inputs(self):
        a = np.array([[1, 1, 0], [0, 0, 1], [1, 1, 1]], bool)
        b = np.array([[0, 1, 1], [0, 0, 1], [0, 0, 0]], bool)
        originals = a.copy(), b.copy()
        score, cropped_a, cropped_b = iou.measure_iou(a, b, 2)
        self.assertEqual(score, 0.5)
        self.assertFalse(cropped_a[2].any())
        self.assertFalse(cropped_b[2].any())
        np.testing.assert_array_equal(a, originals[0])
        np.testing.assert_array_equal(b, originals[1])


if __name__ == '__main__':
    unittest.main()
