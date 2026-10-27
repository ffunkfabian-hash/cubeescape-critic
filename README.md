# Critic – Kritiker-Schleife Konzept → Blender

Nebenprojekt (Versuch) neben Cube Escape. Frage: Bringt eine **Vision-Kritik per Claude API** ein parametrisches Blender-Modell
schneller und näher an ein Konzeptbild als die Arbeit ohne Kritiker? Vorschlag von Gemini (27.10.2026), Entscheidungen des Nutzers:
Name `cubeescape-critic`, öffentlich, Kritiker „Nur API wie Gemini“.

## Ablauf

1. **Rendern:** `generator/helm.py` baut das Modell headless in Blender, `tools/render_views.py` rendert dieselben Ansichten wie
   die Vorlage (Front, Seite, Rücken, Schräg).
2. **Kritiker:** `tools/critic.py` schickt Vorlage und Render über `./ce api ask --image …` (Agent Tools ≥ 0.25) mit
   `critic/prompt.md`; die Antwort muss gültiges JSON nach `critic/schema.json` sein → `runs/<lauf>/feedback_<n>.json`.
3. **Arbeiter:** die laufende Claude-Code-Sitzung liest das Feedback und ändert den Generator; höchstens 5 Runden je Lauf.
4. **Messung zur Auswertung** (nicht als Abbruchkriterium des Kritikers): Umriss-Übereinstimmung je Ansicht (IoU der Masken),
   Kosten je Runde, Zeit.

## Vorlage

`reference/helm/turnaround.mp4` – KI-Video des Nutzers (6 s, 1280×720, 360°-Drehung eines Sci-Fi-Helms) und
`reference/helm/frames/t01…t12.png` (2 Bilder/s). Siehe `reference/helm/README.md`.

## Regeln

`AGENTS.md`. Globale Regeln: [Nexogen](https://github.com/ffunkfabian-hash/cubeescape-nexogen) (API-Ausnahme für Bilder nur hier).
