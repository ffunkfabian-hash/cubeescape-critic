"""Evidence saving must fail closed on stale or incomplete render results."""
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).with_name('save_pass.py')
spec = importlib.util.spec_from_file_location('save_pass', SCRIPT)
save_pass = importlib.util.module_from_spec(spec)
spec.loader.exec_module(save_pass)


class EvidenceTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.web = Path(self.temp.name) / 'web'
        self.renders = self.web / 'renders'
        self.renders.mkdir(parents=True)
        self.iou = {name: 0.9 for name in ['front', 'left', 'back', 'right', 'mean']}
        outputs = {}
        names = ['iou.json', 'compare.png', 'scifi_helmet.glb'] + [
            f'{kind}_{view}.png' for kind in ['render', 'mask', 'overlay'] for view in save_pass.VIEWS]
        for name in names:
            data = json.dumps(self.iou).encode() if name == 'iou.json' else name.encode()
            (self.renders / name).write_bytes(data)
            outputs[name] = hashlib.sha256(data).hexdigest()
        (self.web / 'source.js').write_text('original source')
        self.result = {'status': 'passed', 'iouSkipped': False, 'views': save_pass.VIEWS.copy(),
                       'iou': self.iou.copy(), 'outputs': outputs,
                       'sources': {'files': {'source.js': hashlib.sha256(b'original source').hexdigest()}}}
        self.record()

    def record(self):
        (self.renders / 'verification.json').write_text(json.dumps(self.result))

    def test_complete_matching_run_is_accepted(self):
        self.assertEqual(save_pass.validate_run(self.web), self.iou)

    def test_failed_or_running_render_creates_no_pass_directory(self):
        for status in ['failed', 'running']:
            self.result['status'] = status
            self.record()
            result = subprocess.run([sys.executable, str(SCRIPT), str(self.web), '999'], capture_output=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertFalse((self.web.parent / 'runs').exists())
            self.assertFalse((self.web.parent / 'docs').exists())

    def test_no_iou_cannot_reuse_an_existing_measurement(self):
        self.result['iouSkipped'] = True
        self.record()
        with self.assertRaisesRegex(ValueError, 'Completed IoU'):
            save_pass.validate_run(self.web)

    def test_mixed_images_or_measurements_are_rejected(self):
        for name in ['render_right.png', 'compare.png', 'iou.json']:
            with self.subTest(name=name):
                file = self.renders / name
                old = file.read_bytes()
                file.write_bytes(b'stale or changed output')
                with self.assertRaisesRegex(ValueError, 'Output hash mismatch'):
                    save_pass.validate_run(self.web)
                file.write_bytes(old)

    def test_missing_measurement_hash_is_rejected(self):
        del self.result['outputs']['iou.json']
        self.record()
        with self.assertRaisesRegex(ValueError, 'Missing evidence hashes'):
            save_pass.validate_run(self.web)

    def test_changed_source_is_rejected(self):
        (self.web / 'source.js').write_text('new unrendered source')
        with self.assertRaisesRegex(ValueError, 'Source changed'):
            save_pass.validate_run(self.web)

    def test_iou_record_must_agree_with_the_hashed_measurement(self):
        self.result['iou']['mean'] = 0.2
        self.record()
        with self.assertRaisesRegex(ValueError, 'IoU values'):
            save_pass.validate_run(self.web)

    def test_incomplete_view_set_is_rejected(self):
        self.result['views'] = ['front']
        self.record()
        with self.assertRaisesRegex(ValueError, 'All four'):
            save_pass.validate_run(self.web)


if __name__ == '__main__':
    unittest.main()
