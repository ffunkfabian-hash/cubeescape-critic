# Lieferstand 69 – abgestimmte Haubenoberfläche

Stand 69 verwendet auf der Haube dieselbe Graphitfarbe und dieselben Texturkarten wie auf der Maske, mit gedämpftem Glanz.
Alle 89 Geometrien, UVs und Transformationen sind gegenüber Stand 68 unverändert; die bisherigen Materialien ebenfalls.
Die eckigen Hauben 62/63 sind verworfen. [Stilbeschreibung](../../docs/HELM_STIL.md).

- [scifi_helmet.glb](scifi_helmet.glb): 89 Meshes, neun verwendete Materialien; getrennte Baugruppen.
- [parts.json](parts.json): Verzeichnis der tatsächlichen Exportobjekte, Hierarchie, Transformationen und Materialien.
- [textures/](textures/): sieben prozedurale PNGs (fünf unterschiedliche Bilder) und Materialzuordnung; Bump-Karten beim Import separat zuordnen.
- `render_front/left/back/right.png`: vier feste Ansichten; zugehörige Masken und Overlays sind Prüfbelege.
- [verification.json](verification.json): Quell-/Referenzhashes, Laufzeitumgebung, Kameras, Parameter und 23 Ausgabehashes.
- [code-review.txt](code-review.txt) und [tests.txt](tests.txt): unabhängige Codeprüfung einschließlich der Nachprüfung von Stand 68 und aktuelle Testbelege.
- [selection.json](selection.json): Vergleich der 89 Exportobjekte mit Stand 68 einschließlich Material-/Texturprüfung und Hashes des aktuellen Exports.

Erzeugen über [web/README.md](../../web/README.md). Nach `npm run verify` vom Repo-Hauptverzeichnis vergleichen:

```sh
python3 - <<'CHECK'
import hashlib,json,pathlib
proof=json.load(open('assets/helmet/verification.json'))
for name,expected in proof['outputs'].items():
    for folder in ['assets/helmet','web/renders']:
        assert hashlib.sha256((pathlib.Path(folder)/name).read_bytes()).hexdigest()==expected,(folder,name)
print('Alle 23 Lieferdateien und neu erzeugten Ausgaben stimmen überein.')
CHECK
```

Die Ausgaben sind mit Quellhashes und der dokumentierten macOS-/Chromium-/SwiftShader-Umgebung gesichert; andere Treiber können
abweichen. Das vollständige Modell ist ohne Meshy-Datei erzeugbar. Maße sind Modellparameter, keine geprüfte Druck-/Montagekonstruktion.
