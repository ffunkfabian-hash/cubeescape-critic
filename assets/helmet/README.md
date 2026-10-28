# Lieferstand 78 – Stirnblenden an die Maske angeschlossen

H20/H21 reichen bis an die Augenmaske und setzen deren Flächen nach oben fort. Ihr Überlappungsrand läuft flach aus.
89/91 Geometrien, UVs und Transformationen sind gegenüber Stand 76 unverändert; nur beide Blenden sind angepasst.
Alle Materialien und Texturbilder bleiben erhalten. Beide Blenden bleiben separat exportierbar.
18 Auflage-, drei Mittelstreifen- und zwölf Anschlussproben prüfen den Sitz. [Stilbeschreibung](../../docs/HELM_STIL.md).

- [scifi_helmet.glb](scifi_helmet.glb): 91 Meshes, neun verwendete Materialien; getrennte Baugruppen.
- [parts.json](parts.json): Verzeichnis der tatsächlichen Exportobjekte, Hierarchie, Transformationen und Materialien.
- [textures/](textures/): acht prozedurale PNGs und Materialzuordnung; Haubennormalenkarte im GLB enthalten, sonstige Bump-Karten bei Bedarf separat zuordnen.
- `render_front/left/back/right.png`: vier feste Ansichten; zugehörige Masken und Overlays sind Prüfbelege.
- [verification.json](verification.json): Quell-/Referenzhashes, Laufzeitumgebung, Kameras, Parameter und 24 Ausgabehashes.
- [code-review.txt](code-review.txt) und [tests.txt](tests.txt): unabhängige Codeprüfung einschließlich der Nachprüfung von Stand 68 und aktuelle Testbelege.
- [selection.json](selection.json): Vergleich der 91 Exportobjekte mit Stand 76 einschließlich Material-/Texturprüfung und Hashes des aktuellen Exports.

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
