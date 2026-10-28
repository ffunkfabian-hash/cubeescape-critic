# Lieferstand 79 – symmetrische Funkmuscheln und Kabel

Die komplette seitliche Einheit von A ist an X=0 nach B gespiegelt: Funkmuschel, Knöpfe, Kabel, Halterung und Antenne.
18 separate Meshes ersetzen dort das frühere Ohrmodul mit fünf Meshes. Das mittige Heckmodul bleibt einmal erhalten.
86 bisherige Geometrien einschließlich UVs und Transformationen sind unverändert; insgesamt 104 Meshes.
Materialien und Texturbilder bleiben erhalten. Ein Geometrietest prüft alle Spiegelpunkte, positive Exportskalierung,
Flächenorientierung und das einmalige Heckmodul. [Stilbeschreibung](../../docs/HELM_STIL.md).

- [scifi_helmet.glb](scifi_helmet.glb): 104 Meshes, neun verwendete Materialien; getrennte Baugruppen.
- [parts.json](parts.json): Verzeichnis der tatsächlichen Exportobjekte, Hierarchie, Transformationen und Materialien.
- [textures/](textures/): acht prozedurale PNGs und Materialzuordnung; Haubennormalenkarte im GLB enthalten, sonstige Bump-Karten bei Bedarf separat zuordnen.
- `render_front/left/back/right.png`: vier feste Ansichten; zugehörige Masken und Overlays sind Prüfbelege.
- [verification.json](verification.json): Quell-/Referenzhashes, Laufzeitumgebung, Kameras, Parameter und 24 Ausgabehashes.
- [code-review.txt](code-review.txt) und [tests.txt](tests.txt): unabhängige Codeprüfung einschließlich der Nachprüfung von Stand 68 und aktuelle Testbelege.
- [selection.json](selection.json): Vergleich der 104 Exportobjekte mit Stand 78 einschließlich Material-/Texturprüfung und Hashes des aktuellen Exports.

Erzeugen über [web/README.md](../../web/README.md). Nach `npm run verify` vom Repo-Hauptverzeichnis vergleichen:

```sh
python3 - <<'CHECK'
import hashlib,json,pathlib
proof=json.load(open('assets/helmet/verification.json'))
for name,expected in proof['outputs'].items():
    for folder in ['assets/helmet','web/renders']:
        assert hashlib.sha256((pathlib.Path(folder)/name).read_bytes()).hexdigest()==expected,(folder,name)
print('Alle 24 Lieferdateien und neu erzeugten Ausgaben stimmen überein.')
CHECK
```

Die Ausgaben sind mit Quellhashes und der dokumentierten macOS-/Chromium-/SwiftShader-Umgebung gesichert; andere Treiber können
abweichen. Das vollständige Modell ist ohne Meshy-Datei erzeugbar. Maße sind Modellparameter, keine geprüfte Druck-/Montagekonstruktion.
