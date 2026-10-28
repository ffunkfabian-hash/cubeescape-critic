#!/usr/bin/env python3
"""Keep the evidence of one helmet pass: copies iou.json and compare.png from renders/ and a close-up pair sheet to
runs/helm/<nr>/ (outside the repo index, see .gitignore). Usage: python3 save_pass.py <web-dir> <nr> [note]"""
import json
import os
import shutil
import subprocess
import sys

web, nr = sys.argv[1], int(sys.argv[2])
note = sys.argv[3] if len(sys.argv) > 3 else ''
out = os.path.join(web, '..', 'runs', 'helm', f'{nr:02d}')
os.makedirs(out, exist_ok=True)
for f in ('iou.json', 'compare.png'):
    shutil.copy(os.path.join(web, 'renders', f), out)
subprocess.run([sys.executable, '-I', os.path.join(web, 'tools', 'pairs.py'), web, os.path.join(out, 'pairs.png')], check=True)
iou = json.load(open(os.path.join(out, 'iou.json')))
open(os.path.join(out, 'note.txt'), 'w').write(note + '\n')
print(f'Durchlauf {nr}: ' + '  '.join(f'{k}={v:.3f}' for k, v in iou.items()) + f'  → {os.path.normpath(out)}')
