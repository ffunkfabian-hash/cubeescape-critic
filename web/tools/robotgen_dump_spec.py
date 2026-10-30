#!/usr/bin/env python3
"""Reference of the three.js robot generator: part list of a Ballon body study as JSON, without Blender.

basic/robot (cubeescape-ballon, commit pinned in blender/robot/SOURCE.json) is pure Python up to the meshes; this dumps
segments(), SHOULDER and parts() after use(<study>) for web/tools/robotgen.test.mjs (fixtures/robotgen_<name>_spec.json).

  mkdir -p runs/robot/src && git -C ~/Claude/cubeescape-ballon archive <commit> basic tools data | tar -x -C runs/robot/src
  python3 -I web/tools/robotgen_dump_spec.py runs/robot/src a_waechter web/tools/fixtures/robotgen_waechter_spec.json
"""
import json
import os
import sys

src, study, out = sys.argv[1:4]
sys.path.insert(0, src)
import basic.robot as RB  # noqa: E402

RB.use(study)
commit = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'blender', 'robot', 'SOURCE.json')))['commit']
data = dict(source=f'cubeescape-ballon {commit}: basic.robot.use("{study}"); segments(), SHOULDER, parts() (pure Python, no Blender) '
                   '– reference of web/src/robotgen/robot.js',
            segments=RB.segments(), shoulder=RB.SHOULDER, parts=[[a, list(p)] for a, p in RB.parts()])
open(out, 'w').write(json.dumps(data, separators=(',', ':'), default=list) + '\n')
print(f'{study}: {len(data["parts"])} parts → {out}')
