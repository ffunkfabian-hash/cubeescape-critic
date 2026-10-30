# Durchlauf-Werkzeug (Arbeitsweise nach cubeescape-critic): feste Ansichten, Vergleichsbogen Referenz|Render, IoU, nummeriert.
# Aufruf in Blender: über run.py geladen (Pfade aus SCOUT_DIR/SCOUT_REF/SCOUT_RUNS): helm_durchlauf.py → durchlauf(nr, notiz)
import bpy, json, os, time
import numpy as np

D = os.path.join(os.environ['SCOUT_DIR'], '')  # set by run.py (blender/scout)
ANSICHTEN = ('front', 'right', 'back', 'left')

def _bild(path):
    im = bpy.data.images.load(path, check_existing=False); w, h = im.size
    px = np.empty(w * h * 4, dtype=np.float32); im.pixels.foreach_get(px); bpy.data.images.remove(im)
    return px.reshape(h, w, 4)[::-1]

def _speichern(arr, path):
    h, w = arr.shape[:2]
    im = bpy.data.images.new('tmp_bogen', w, h, alpha=True); im.pixels.foreach_set(arr[::-1].ravel())
    im.filepath_raw = path; im.file_format = 'PNG'; im.save(); bpy.data.images.remove(im)

def durchlauf(nr, notiz=''):
    H = bpy.app.driver_namespace['H']; B = H['build']; L = H['lib']
    ordner = f"{os.environ['SCOUT_RUNS']}/durchlaeufe/{nr:02d}/"; os.makedirs(ordner, exist_ok=True)
    B['SCR'] = ordner
    sc = bpy.context.scene; sc.frame_set(1)
    w, a, sp, r = L['view3d'](); alt = sp.shading.type
    t0 = time.time()
    sp.shading.type = 'SOLID'
    iou = {v: B['sil_check'](v)['iou'] for v in ANSICHTEN}
    lichter = [o for o in L['coll']('LICHT').objects]
    lz = [o.hide_get() for o in lichter]
    for o in lichter: o.hide_set(False)                      # versteckte Lichter beleuchten den Viewport nicht
    wand = bpy.data.objects.get('Studio_Hohlkehle')
    sp.shading.type = 'RENDERED'; sp.shading.use_scene_lights_render = True; sp.shading.use_scene_world_render = True
    paare = {}
    for v in ANSICHTEN:
        if wand: wand.hide_set(v == 'back')                  # Rückkamera steht hinter der Hohlkehle
        paare[v] = B['vergleich'](v)
    if wand: wand.hide_set(False)
    for o, z in zip(lichter, lz): o.hide_set(z)
    sp.shading.type = alt
    # Bogen 2×2: je Feld Referenz | Render
    bilder = [_bild(paare[v]) for v in ANSICHTEN]
    h, w2 = bilder[0].shape[:2]
    bogen = np.ones((2 * h + 6, 2 * w2 + 6, 4), dtype=np.float32) * 0.15
    for k, b in enumerate(bilder):
        y0 = (k // 2) * (h + 6); x0 = (k % 2) * (w2 + 6); bogen[y0:y0 + h, x0:x0 + w2] = b
    _speichern(bogen, ordner + 'bogen.png')
    info = {'durchlauf': nr, 'notiz': notiz, 'iou': iou, 'iou_mittel': round(sum(iou.values()) / 4, 3),
            'paare': {v: os.path.basename(p) for v, p in paare.items()}, 'sekunden': round(time.time() - t0, 1)}
    json.dump(info, open(ordner + 'messung.json', 'w'), indent=1, ensure_ascii=False)
    return info
