# Lieferstand 68 – gewölbter Scheitel und weicher Stirnübergang

Stand 68 rundet die Haube in beiden Richtungen und führt ihren Rand weich zur Augenmaske.
83/89 Meshes einschließlich Augen und Maske sind geometrisch unverändert gegenüber Stand 64.
Die eckigen Hauben 62/63 sind verworfen. [Stilbeschreibung](../../docs/HELM_STIL.md).

- [scifi_helmet.glb](scifi_helmet.glb): 89 Meshes, acht verwendete Materialien; getrennte Baugruppen.
- [parts.json](parts.json): Verzeichnis der tatsächlichen Exportobjekte, Hierarchie, Transformationen und Materialien.
- [textures/](textures/): fünf prozedurale PNGs und Materialzuordnung; Bump-Karten beim Import separat zuordnen.
- `render_front/left/back/right.png`: vier feste Ansichten; zugehörige Masken und Overlays sind Prüfbelege.
- [verification.json](verification.json): Quell-/Referenzhashes, Laufzeitumgebung, Kameras, Parameter und 21 Ausgabehashes.
- [code-review.txt](code-review.txt) und [tests.txt](tests.txt): unabhängige Codeprüfung einschließlich der Nachprüfung von Stand 68 und aktuelle Testbelege.
- [selection.json](selection.json): Vergleich der 89 Exportobjekte mit Stand 64 und Hashes des aktuellen Exports.

Erzeugen über [web/README.md](../../web/README.md). Nach `npm run verify` vom Repo-Hauptverzeichnis vergleichen:

```sh
python3 - <<'CHECK'
import hashlib,json,pathlib
proof=json.load(open('assets/helmet/verification.json'))
for name,expected in proof['outputs'].items():
    for folder in ['assets/helmet','web/renders']:
        assert hashlib.sha256((pathlib.Path(folder)/name).read_bytes()).hexdigest()==expected,(folder,name)
print('Alle 21 Lieferdateien und neu erzeugten Ausgaben stimmen überein.')
CHECK
```

Bytegleichheit wurde mit der dokumentierten macOS-/Chromium-/SwiftShader-Umgebung geprüft; andere Treiber können
abweichen. Das vollständige Modell ist ohne Meshy-Datei erzeugbar. Maße sind Modellparameter, keine geprüfte Druck-/Montagekonstruktion.
