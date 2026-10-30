# Scout v3 entry point: sets the paths the generator scripts read, loads the generator and optionally builds/exports.
# Headless (repo root):
#   blender -b --factory-startup --python blender/scout/run.py -- --build --export assets/helmet-scout [--save x.blend] [--views prefix]
#   blender -b <file.blend> --python blender/scout/run.py -- --manifest out.json     (manifest of an existing scene)
# In a running Blender (MCP):  p = '<repo>/blender/scout/run.py'
#   with g = {'__file__': p}; exec(open(p).read(), g) → g['scout'] (generator: bauen_lauf6b, ansichten, …), g['scout_export'].
import os, sys, json, time
import bpy

SCOUT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(SCOUT_DIR))
os.environ['SCOUT_DIR'] = SCOUT_DIR
os.environ['SCOUT_REF'] = os.path.join(ROOT, 'reference', 'scout')
os.environ['SCOUT_RUNS'] = os.environ.get('SCOUT_RUNS') or os.path.join(ROOT, 'runs', 'scout')
os.makedirs(os.environ['SCOUT_RUNS'], exist_ok=True)

scout = {}
exec(open(os.path.join(SCOUT_DIR, 'helm_bauen.py')).read(), scout)
scout_export = {}
exec(open(os.path.join(SCOUT_DIR, 'export_scout.py')).read(), scout_export)


def _args():
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    out = {'build': '--build' in a}
    for k in ('--export', '--save', '--manifest', '--views'):
        if k in a: out[k[2:]] = a[a.index(k) + 1]
    return out


if bpy.app.background:
    args = _args(); t0 = time.time(); log = {}
    if args['build']:
        bpy.ops.wm.read_homefile(use_empty=True)
        log['build'] = {k: v for k, v in scout['bauen_lauf6b']().items() if isinstance(v, (int, float, str))}
        log['build_seconds'] = round(time.time() - t0, 1)
    if 'save' in args:
        bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath(args['save']))
    if 'manifest' in args:
        json.dump(scout_export['manifest'](), open(args['manifest'], 'w'), indent=1, ensure_ascii=False)
    if 'export' in args:
        log['export'] = scout_export['export_all'](os.path.abspath(args['export']))
    if 'views' in args:
        if not args['build']: scout['lade']()          # saved scene: register the generator helpers (H) without building
        log['views'] = scout['ansichten'](os.path.abspath(args['views']), samples=48)
    log['seconds'] = round(time.time() - t0, 1)
    print('SCOUT_RESULT ' + json.dumps(log, ensure_ascii=False, default=str))
