#!/usr/bin/env python3
"""Keep the evidence of one helmet pass: copies iou.json and compare.png from renders/ and a close-up pair sheet to
runs/helm/<nr>/ (not in the repo), plus the pair sheet as JPEG to docs/belege/helm/<nr>.jpg (in the repo).
Usage: python3 save_pass.py <web-dir> <nr> [note]"""
import json
import hashlib
import math
from pathlib import Path
import shutil
import subprocess
import sys

VIEWS = ['front', 'left', 'back', 'right']


def validate_run(web):
    """Reject stale/mixed evidence before creating any pass output."""
    web = Path(web).resolve()
    renders = web / 'renders'
    result = json.loads((renders / 'verification.json').read_text())
    if result.get('status') != 'passed':
        raise ValueError('A successful render verification is required')
    if result.get('iouSkipped') is not False or not isinstance(result.get('iou'), dict):
        raise ValueError('Completed IoU is required; --no-iou cannot be saved as a pass')
    if result.get('views') != VIEWS:
        raise ValueError('All four completed views are required')
    outputs = result.get('outputs', {})
    required = {'iou.json', 'compare.png', 'scifi_helmet.glb'} | {
        f'{kind}_{view}.png' for kind in ['render', 'mask', 'overlay'] for view in VIEWS}
    if not required.issubset(outputs):
        raise ValueError('Missing evidence hashes; rerun verification with IoU')
    for name, expected in outputs.items():
        target = (renders / name).resolve()
        target.relative_to(renders)
        if hashlib.sha256(target.read_bytes()).hexdigest() != expected:
            raise ValueError(f'Output hash mismatch: {name}')
    sources = result.get('sources', {}).get('files', {})
    if not sources:
        raise ValueError('Missing source hashes')
    for name, expected in sources.items():
        if hashlib.sha256((web / name).read_bytes()).hexdigest() != expected:
            raise ValueError(f'Source changed since verification: {name}')
    iou = json.loads((renders / 'iou.json').read_text())
    if (iou != result['iou'] or set(iou) != set(VIEWS + ['mean'])
            or any(not isinstance(v, (int, float)) or not math.isfinite(v) or not 0 <= v <= 1 for v in iou.values())):
        raise ValueError('IoU values do not match the completed verification')
    return iou


def main():
    web, nr = Path(sys.argv[1]).resolve(), int(sys.argv[2])
    note = sys.argv[3] if len(sys.argv) > 3 else ''
    iou = validate_run(web)
    out = web.parent / 'runs' / 'helm' / f'{nr:02d}'
    out.mkdir(parents=True, exist_ok=True)
    for name in ('iou.json', 'compare.png', 'verification.json'):
        shutil.copy(web / 'renders' / name, out)
    subprocess.run([sys.executable, '-I', str(web / 'tools/pairs.py'), str(web), str(out / 'pairs.png')], check=True)
    from PIL import Image
    belege = web.parent / 'docs/belege/helm'
    belege.mkdir(parents=True, exist_ok=True)
    Image.open(out / 'pairs.png').convert('RGB').save(belege / f'{nr:02d}.jpg', quality=82)
    (out / 'note.txt').write_text(note + '\n')
    print(f'Durchlauf {nr}: ' + '  '.join(f'{k}={v:.3f}' for k, v in iou.items()) + f'  → {out}')


if __name__ == '__main__':
    main()
