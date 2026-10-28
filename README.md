# Critic – parametrischer Helm im Browser

**Aktueller Versuch 0.5.1 „Assembly“:** beschriftete Explosionsansicht, ausblendbare Kopfhörer mit Bügel und eine
separate Hals-/Schulterstudie mit kurzem Hals, tieferem Rumpf und niedrigeren, kantigen Schulterkappen.
[Aufbau und Reproduktion](docs/HELM_AUFBAU.md) · [Exporte](assets/helmet-assembly/README.md) · [Prüfbericht](docs/versions/0.5.md).
Die bestehenden Helmformen und Materialproben bleiben erhalten. Das Video bleibt die Helmreferenz;
die Titan-Recherche aus `cubeescape-reference` ergänzt die Stilbetrachtung des Oberkörpers.

**Form- und Materialbasis 0.4 „Continuity“:** weichere Übergänge neben den Augen und zwei von der Stirn bis zum Hinterkopf
verlängerte Streifen. Auf derselben Geometrie stehen Originalmaterial, glänzendes Metall und feines dunkles Graphit
zum Vergleich; noch keine Materialauswahl durch den Nutzer. [Vergleich und Exporte](assets/helmet-continuity/README.md) ·
[Prüfbericht](docs/versions/0.4.md). Der Generator zeigt standardmäßig die neue Form mit Originalmaterial.
[Agentendokumentation: Aufbau, Entscheidungen und visueller Eindruck](docs/HELM_AGENTEN.md).

![Sechs Material- und Akzentkombinationen](docs/bilder/helm_continuity_varianten.jpg)

Zusätzliche Proben: [Metall und Graphit ohne Stirnblenden](docs/bilder/helm_continuity_ohne_blenden.jpg).
Die neun Stände 80–88 sind mit Quellstand, Parametern, Einzelteilen und Texturen im
[Variantenverzeichnis](assets/helmet-continuity/README.md) gesichert. Die alternativen Haubenmuster 89–91 wurden
auf Nutzerwunsch vollständig verworfen; sie bleiben ausschließlich als Historie dokumentiert.

Bisheriger Lieferstand **79**: durchgehend gewölbter Scheitel mit angepasstem Kopfbügel und weichem Übergang zur
Augenmaske mit weitgehend verdeckter Fugenlinie. Die Haube trägt eine sichtbare feine Lackkörnung im Graphitton der Maske; der Glanz bleibt gedämpft. Hinterkopfgehäuse und Nackenrahmen sind wieder rund; Augen und kantige Kieferplatten bleiben erhalten. Zwei separate trapezförmige Stirnblenden schließen direkt an die Augenmaske an und setzen deren Flächen nach oben fort. Funkmuschel, Kabel, Halterung und Antenne sind jetzt von Seite A nach B gespiegelt. Das Video bleibt für den übrigen Helm maßgeblich.

![Aktueller Helm](docs/bilder/helm_aktuell.jpg)

- [Stil- und Formbeschreibung](docs/HELM_STIL.md)
- [GLB, Texturen, Einzelteilverzeichnis und Prüfbelege](assets/helmet/README.md)
- [Start, Bedienung und Reproduktion](web/README.md)
- [Teilekarte H01–H21](docs/HELM_TEILE.md) · [Verlauf mit Vergleichsbildern](docs/HELM_VERLAUF.md)
- [Versionsbericht und Prüfstand](docs/versions/0.3.md)

Der Helm entsteht vollständig aus Code in `web/` (Three.js). Maße stehen in `web/src/helmetParams.json`;
kein Blender und keine Handmodellierung nötig. Der Generator ist die Quelle, die mitgelieferten Exporte sind geprüft.

## Ursprüngliches Versuchskonzept

Nebenprojekt (Versuch) neben Cube Escape. Frage: Bringt eine **Vision-Kritik per Claude API** ein parametrisches Blender-Modell
schneller und näher an ein Konzeptbild als die Arbeit ohne Kritiker? Vorschlag von Gemini (27.10.2026), Entscheidungen des Nutzers:
Name `cubeescape-critic`, öffentlich, Kritiker „Nur API wie Gemini“.

## Geplante API-Schleife (noch nicht implementiert)

1. **Rendern:** `generator/helm.py` baut das Modell headless in Blender, `tools/render_views.py` rendert dieselben Ansichten wie
   die Vorlage (Front, Seite, Rücken, Schräg).
2. **Kritiker:** `tools/critic.py` schickt Vorlage und Render über `./ce api ask --image …` (Agent Tools ≥ 0.25) mit
   `critic/prompt.md`; die Antwort muss gültiges JSON nach `critic/schema.json` sein → `runs/<lauf>/feedback_<n>.json`.
3. **Arbeiter:** die laufende Claude-Code-Sitzung liest das Feedback und ändert den Generator; höchstens 5 Runden je Lauf.
4. **Messung zur Auswertung** (nicht als Abbruchkriterium des Kritikers): Umriss-Übereinstimmung je Ansicht (IoU der Masken),
   Kosten je Runde, Zeit.

## Browser-Variante (Three.js)

`web/` baut denselben Helm prozedural in Three.js nach – ohne lokale 3D-Software, mit Playwright-Screenshots, Onion-Overlay
und Umriss-IoU je Ansicht statt Kritiker-API. Start, Bedienung, Aufbau und Parameter: `web/README.md`.

## Vorlage

`reference/helm/turnaround.mp4` – KI-Video des Nutzers (6 s, 1280×720, 360°-Drehung eines Sci-Fi-Helms) und
`reference/helm/frames/t01…t12.png` (2 Bilder/s). Siehe `reference/helm/README.md`.

Der [bestätigte Formauftrag mit zusätzlicher Drehansicht](reference/helm-request-20261028/README.md) ist separat
gesichert. Die Vorher-/Nachher-IoU verwendet weiterhin dieselben vier `web/refs/`-Bilder und Kameras wie Claudes Runde 4.

## Regeln

`AGENTS.md`. Globale Regeln: [Nexogen](https://github.com/ffunkfabian-hash/cubeescape-nexogen) (API-Ausnahme für Bilder nur hier).
