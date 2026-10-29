# Markierbogen-Seite aus Vorlage + Daten bauen (läuft mit normalem python3, nicht in Blender).
# Aufruf: python3 markierbogen_bauen.py <scratch-ordner> <stand> <url_vorn> <url_seite> <url_dreiviertel> <url_hinten>
# Voraussetzung in Blender: helm_explosion.py → markierbogen_daten(scratch) (schreibt bl/karte.json, bl/idgrid.json, karte_*.jpg);
# die JPEGs danach mit Artifact upload_asset hochladen und deren /_blob/-Adressen hier übergeben.
import json, sys, os
scr, stand, *urls = sys.argv[1:]
namen = ('vorn', 'seite', 'dreiviertel', 'hinten')
g = json.load(open(os.path.join(scr, 'bl/idgrid.json'))); k = json.load(open(os.path.join(scr, 'bl/karte.json')))['r']['teile']
daten = {'stand': stand, 'N': g['N'], 'labels': g['labels'],
         'ansichten': {n: {'bild': u, 'kalib': k[n]['kalib'], 'raster': g['views'][n]} for n, u in zip(namen, urls)}}
vorlage = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'markierbogen_vorlage.html')).read()
html = vorlage.replace('__DATEN__', json.dumps(daten, ensure_ascii=False)).replace('__STAND__', stand)
open(os.path.join(scr, 'markierbogen.html'), 'w').write(html)
print(len(html) // 1024, 'KB', os.path.join(scr, 'markierbogen.html'))
