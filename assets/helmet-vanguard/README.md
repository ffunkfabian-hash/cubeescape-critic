# Vanguard 0.9 – Lieferstand

> **Archiv (seit 0.12):** Diese Körperstudie ist aus dem Viewer und dem Code entfernt („wir bauen dann auf ballon auf“). Die hier
> genannten Quellen, Schalter (`body=…`, `--body`) und Reproduktionsbefehle gelten für Commit `4e63f05`
> (`git checkout 4e63f05`); Lieferpakete und Belege bleiben unverändert.

Einfacher Gesamtkörper mit Graphit, hellen Befestigungen, ohne Headset und Stirnstreifen (`body=full`).
58 separate Körpermeshes (B01–B31 Bastion, B32–B58 neu), insgesamt 114 Meshes und 80 beschriftete Gruppen.

`assembled/` enthält die vier Ansichten, `exploded/` fünf Ansichten einschließlich beschrifteter Übersicht. Beide
enthalten GLB, Originaltexturen, Teilelisten (`parts.json`) und Prüfmanifeste. `comparison.json` belegt gegen die
0.7-Lieferung: 56 Helm- und 31 Oberkörpermeshes unverändert. **Quellenpin:** `833d2872889d2885751a7352568c631729468684`. Beide Quellmanifeste und
sämtliche Ausgabedateien sind gegen diesen Commit geprüft.

- `regression.txt`: `body=shoulders` am Quellenpin neu gerendert, GLB und vier Renderbilder bytegleich zu `../helmet-bastion/`.
- `labels.json`: 80 Beschriftungen der Explosionsansicht ohne Überlappung oder Anschnitt, alle Meshpunkte im Bild.
- `tests.txt` (66 Tests), `build.txt`, `check.txt`.

Für den Markierbogen (`docs/MARKER.md`), im Ordner `web/`: `node tools/marker_build.mjs "0.9 Vanguard" ../assets/helmet-vanguard/assembled/scifi_helmet.glb`
– die Teile B32–B58 werden über dieselbe Teiletabelle erkannt.

[Aufbau und Stil](../../docs/HELM_VANGUARD.md) · [Prüfbericht](../../docs/versions/0.9.md)

![Explosionsansicht](../../docs/bilder/vanguard_explosion.jpg)
