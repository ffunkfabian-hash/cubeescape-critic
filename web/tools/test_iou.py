"""Focused tests for missing, mixed and empty render measurements."""
import importlib.util
from pathlib import Path
import tempfile
import unittest

import numpy as np
from PIL import Image

spec = importlib.util.spec_from_file_location('helmet_iou', Path(__file__).with_name('iou.py'))
iou = importlib.util.module_from_spec(spec)
spec.loader.exec_module(iou)


class MeasurementTests(unittest.TestCase):
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
