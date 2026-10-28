# Continuity 0.4 – Form- und Materialvergleich

Diese fünf Varianten sind ein Versuch zur Auswahl durch den Nutzer. Der bisherige [Stand 79](../helmet/README.md)
bleibt separat erhalten. Alle Varianten haben dieselbe neue Geometrie: breitere Rundungen neben den Augen und zwei
separate trapezförmige Streifen von der Stirn über den Scheitel bis an die hintere Haubenkante. Augen erhalten.

| Stand | Ordner / GLB | Finish | Akzente |
|---|---|---|---|
| 80 | [original](original/scifi_helmet.glb) | bisherige Materialien | bisherige dunkle Schrauben |
| 81 | [metal](metal/scifi_helmet.glb) | kontrolliert glänzendes Metall | helle Schrauben auf dunkler Rüstung |
| 82 | [graphite](graphite/scifi_helmet.glb) | feine dunkle Haubenstruktur | helle Schrauben auf dunkler Rüstung |
| 83 | [white-strips](white-strips/scifi_helmet.glb) | Graphit | zusätzlich weiße Stirn-/Scheitelstreifen |
| 84 | [metal-white-strips](metal-white-strips/scifi_helmet.glb) | Metall | zusätzlich weiße Stirn-/Scheitelstreifen |

Die hellen Punkte sind ausschließlich `Screws_Upper`. Schrauben auf hellem Rahmen, Funkmodulen und anderen Anbauten
behalten ihre Materialien. Weiße Streifen verwenden dasselbe gebrochene Weiß und dieselben Texturen wie der Rahmen.
Jeder Ordner enthält vier gerenderte Ansichten, GLB, Texturen, IoU und ein Prüfmanifest mit Quellen, Parametern,
Finish, Akzenten, Kameras und Ausgabehashes. [Exportvergleich](export-comparison.json) prüft identische Geometrien,
Transformationen, Kameras und Silhouetten der Varianten sowie die tatsächlichen Abweichungen von Stand 79.

![Material- und Akzentvergleich](../../docs/bilder/helm_continuity_varianten.jpg)

[Alle vier Ansichten](../../docs/bilder/helm_continuity_vier_ansichten.jpg) ·
[Formänderung 79/80](../../docs/bilder/helm_continuity_form.jpg) · [Stilbeschreibung](../../docs/HELM_STIL.md)
· [Technische Agentenübergabe und visueller Eindruck](../../docs/HELM_AGENTEN.md)

## Reproduktion

Node/Python und gepinnte Abhängigkeiten gemäß [web/README.md](../../web/README.md) einrichten. Im Repo-Hauptverzeichnis:

```sh
./ce lock status
./ce lock gpu -- node web/verify_renders.mjs --finish=original --accents=original --out=renders-original
./ce lock gpu -- node web/verify_renders.mjs --finish=metal --accents=light-fasteners --out=renders-metal
./ce lock gpu -- node web/verify_renders.mjs --finish=graphite --accents=light-fasteners --out=renders-graphite
./ce lock gpu -- node web/verify_renders.mjs --finish=graphite --accents=white-strips --out=renders-white-strips
./ce lock gpu -- node web/verify_renders.mjs --finish=metal --accents=white-strips --out=renders-metal-white-strips
```

Relative Ausgabepfade beziehen sich auf `web/`; absolute Pfade sind möglich. Im Browser dieselben Optionen über
`?finish=graphite&accents=white-strips`. Ohne Optionen: neue Form mit Originalmaterial und dunklen Schrauben.
Die normale GUI-Geometrieänderung und der GLB-Export behalten die gewählten Materialien. Keine feste Auswahl vorweggenommen.

Der Kopfbügel überdeckt die Streifen äußerlich; innen besteht lokal eine Überlappung von etwa 0,002 Modelleinheiten.
Das Modell ist in separate Teile gegliedert, aber noch keine geprüfte Druck-/Montagekonstruktion.
Silhouetten-IoU misst den Umriss, nicht Materialähnlichkeit. Ein anderer Grafiktreiber kann Renderpixel verändern.
