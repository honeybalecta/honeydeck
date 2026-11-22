# HoneyDeck

Folien für B-Roll und Präsentationen – immer im eigenen Design, in jedem Format, ohne dass etwas abgeschnitten wird.
HoneyDeck läuft eigenständig (Windows, Android, Browser) und, wenn es installiert ist, direkt in HoneyCut im Reiter „Folien“.

## Wo es läuft

| Plattform | eigenständig | in HoneyCut |
|---|---|---|
| Windows | `HoneyDeck-Setup-x.y.z.exe` (Release `v…`) | HoneyCut findet HoneyDeck über den Registry-Eintrag, den der Installer setzt |
| Android | `HoneyDeck-Android-x.y.z.apk` (Release `android-v…`) | HoneyCut lädt die Oberfläche aus der installierten HoneyDeck-App |
| Web | `honeybalecta.github.io/honeydeck/` | HoneyCut im Browser lädt es von dort |

Ohne HoneyDeck bleibt der eingebaute Folien-Reiter von HoneyCut unverändert.

## Was es kann

- **Folien aus Text:** fertigen Text, Skript (Word, Markdown) oder Transkript (.srt, .vtt, HoneyCut) einfügen. „Folien je Satz“ oder „je Absatz“ legt einen Entwurf an; Überschriften (`#`, `##`), Listen (`-`), Zitate (`>`) und `**Begriff**: Erklärung` werden erkannt.
- **Markieren und übernehmen** wie bisher in HoneyCut: → Neue Folie, → Titel, → Text, → Stichpunkt, ⛓ Nur verknüpfen, ✨ Grundlage aus dem Text.
- **27 Folienarten:** Titel, Stichpunkte, Zitat, Zahl, Begriff, Bild + Text, Vollbild, Zwei Seiten (die bisherigen acht, unverändert) sowie Kernsatz, Frage, Piktogramme, Ablauf, Zeitstrahl, Richtig/Falsch, Kennzahlen, Menschen.
- **Diagramme:** Säulen (auch gruppiert), Balken, Linie, Fläche, Kreis, Ring, Gestapelt (100 %), Anteil, Raster (10 × 10) und Skala. Die Werte trägt man in eine Tabelle ein (Zeilen, Reihen, ★ zum Hervorheben) oder schreibt sie als Text.
- **Rund 500 Piktogramme** in 25 Kategorien (Protest & Bewegung, Politik & Wahlen, Recht & Justiz, Staat & Sicherheit, Krieg & Frieden, Migration & Grenzen, Arbeit & Gewerkschaft, Wirtschaft & Geld, Wohnen & Stadt, Medien & Kommunikation, Digital & Technik, Menschen & Gesellschaft, Bildung & Wissen, Gesundheit & Pflege, Umwelt & Klima, Energie, Verkehr, Essen & Landwirtschaft, Natur & Tiere, Alltag & Dinge, Zeit & Orte, Diagramme & Zahlen, Zeichen, Pfeile, Formen). Ohne Suche zeigt die Bibliothek alles nach Kategorien gegliedert. Antippen setzt das Symbol automatisch an die passende Stelle der Folie. Passende Symbole werden zum Text vorgeschlagen.
- **Hervorheben:** `*so*` im Text färbt den Teil in der Akzentfarbe.
- **Aufbau Schritt für Schritt:** Stichpunkte, Zwei Seiten, Piktogramme, Ablauf, Zeitstrahl, Richtig/Falsch, Kennzahlen und Balken können nach und nach erscheinen. Der Schalter liegt unter den Textfeldern; die Zahlen daneben zeigen jeden Schritt auf der Folie. Beim Export entsteht je Schritt ein Bild (`folie-03-schritt-1.png` …) oder eine PDF-Seite, in HoneyCut erscheinen die Schritte passend zum gesprochenen Text.
- **Formate:** Quer 16:9, Hoch 9:16, Quadrat 1:1, Hoch 4:5, Quer 4:3, A4 quer. Jede Folie wird für jedes Format neu gesetzt; Texte werden verkleinert statt abgeschnitten. Wird ein Text dabei sehr klein, zeigt HoneyDeck eine Warnung beim Format.
- **Farbe der Präsentation:** Rot, Grün, Petrol, Blau, Violett, Magenta, Orange, Ocker – oder die Farbe des Designprofils. Wählbar beim Anlegen, jederzeit änderbar über den Farbpunkt in der Leiste; gilt für alle Folien.
- **Designprofile:** dieselben wie in HoneyCut (Honey Balecta Standard, Hell & ruhig, Kontrast) plus eigene – Farben, Schriften, Größen, Ausrichtung, Rand, Kennung unten rechts.
- **Import:** .honeydeck, PowerPoint (.pptx), HTML-Folien, Bilder, ZIP mit Bildern, Word (.docx), Text, Markdown, Untertitel. PDF und alte .ppt/.doc nicht.
- **Export:** PNG (einzeln oder als ZIP, ein Ordner je Format), PDF, .honeydeck.

## Auf dem Handy

Eine eigene, aufgeräumte Ansicht für Touch und schmale Fenster:

- **Oben eine Zeile:** zurück, Name, Rückgängig/Wiederholen und „⋯“ – dort liegen Format, Design, Farbe, Import und Export.
- **Die Folie bleibt sichtbar** (hochkant oben, quer links), mit ‹ › zum Blättern und einem Formate-Knopf, der warnt, wenn ein Format zu eng wird.
- **Vier Reiter unten:** Folien (Raster mit großen Vorschauen, „⋯“ je Folie zum Verschieben, Duplizieren, Löschen), Folie (Inhalt, Folienart als Auswahlblatt), Symbole, Text.
- **Text markieren:** erstes und letztes Wort antippen oder ein Wort und „Ganzer Satz“; die Aktionen erscheinen unten, sobald etwas markiert ist.
- **Auswahlen als Blatt von unten**, Eingaben und Knöpfe in Fingergröße.
- In HoneyCut liegen die Reiter oben, weil unten schon die HoneyCut-Reiter sind.

## In HoneyCut

- Der Reiter „Folien“ zeigt HoneyDeck mit dem Transkript des Projekts. Rückgängig, Speichern und „Als B-Roll einsetzen“ laufen über HoneyCut, ebenso N im Studio.
- **Aufbau im Video (ab HoneyCut 2.35):** Eine Folie mit „Schritt für Schritt aufbauen“ liegt als ein Element in der Zeitleiste. HoneyCut sucht die Einträge im gesprochenen Text und lässt jeden Schritt mit seinem Satz erscheinen; die Zeiten lassen sich im Studio verschieben.
- **Folien importieren:** Importierte Folien (z. B. eine .honeydeck-Datei oder eine PowerPoint) suchen sich ihre Stelle im Transkript selbst – über das Feld `cue` oder, wenn es fehlt, über ihren Text. Danach lassen sie sich gleich als B-Roll einsetzen.

## Das Format .honeydeck

JSON, UTF-8. Alles außer `app` und `slides` ist optional.

```json
{
  "app": "honeydeck", "v": 1,
  "name": "Die bestellte Distanz",
  "format": "16:9",
  "profile": { "id": "hb", "accent": "gruen" },
  "slides": [
    {"layout": "titel", "kicker": "Gen Z regelt", "title": "Wer genau hat das gesagt?", "text": "Eine Spurensuche.", "source": "Eigene Recherche", "icons": ["megafon"], "cue": "Wer genau hat das eigentlich gesagt"},
    {"layout": "liste", "title": "Was wir wollen", "text": "Mietendeckel jetzt\nVermögen besteuern"},
    {"layout": "aussage", "title": "Solidarität ist eine *Einbahnstraße*."},
    {"layout": "icons", "title": "Machtressourcen", "text": "Strukturelle Macht\nOrganisationsmacht", "icons": ["fabrik", "gruppe"]},
    {"layout": "balken", "title": "Wahlergebnis", "text": "CDU: 31 %\n*AfD: 34 %\nLinke: 11 %"},
    {"layout": "saeulen", "title": "Mieten je m²", "text": "2020: 9,8 €; 7,1\n2022: 11,2; 7,6\n*2024: 12,9; 8,0", "text2": "Großstädte, Land"},
    {"layout": "bild", "title": "Paris", "img": "data:image/jpeg;base64,…", "imgFit": "cover", "imgPos": {"x": 0.5, "y": 0.3}}
  ]
}
```

| Feld | Bedeutung |
|---|---|
| `layout` | `titel`, `liste`, `zitat`, `zahl`, `begriff`, `bild`, `vollbild`, `zwei`, `aussage`, `frage`, `icons`, `prozess`, `zeitstrahl`, `checkliste`, `zahlen`, `balken`, `anteil`, `menschen`, `saeulen`, `linie`, `flaeche`, `kreis`, `ring`, `gestapelt`, `waffel`, `tacho` |
| `kicker` | Rubrik, klein über dem Titel |
| `title`, `text`, `text2` | Inhalt; bei Listen-Arten eine Zeile je Eintrag. `zeitstrahl`: `Datum: Text`, `zahlen`: `Zahl: Bedeutung`, `balken`: `Bezeichnung: Wert` (`*` vorn hebt hervor), `checkliste`: Zeilen mit `+` oder `-`, `zwei`: erste Zeile je Spalte = Überschrift, `anteil`/`waffel`/`tacho`: Titel z. B. `37 %` oder `3 von 10`, `menschen`: Titel z. B. `3 von 10`. Diagramme (`balken`, `kreis`, `ring`): `Bezeichnung: Wert`; mit mehreren Reihen (`saeulen`, `linie`, `flaeche`, `gestapelt`): `Bezeichnung: Wert; Wert; …`, dazu in `text2` die Reihennamen mit Komma getrennt. Die Einheit hängt am ersten Wert (`30 %`, `12 Mio.`), Dezimalkomma geht (`3,5`) |
| `profile.accent` | Farbe der Präsentation: `rot`, `gruen`, `petrol`, `blau`, `violett`, `magenta`, `orange`, `ocker`; fehlt sie, gilt der Akzent des Profils |
| `source` | Quellenzeile („Quelle: …“ wird ergänzt) |
| `icons` | Piktogramme: eins für Titel/Stichpunkte/Zitat/Zahl/Begriff/Kernsatz, eins je Zeile für Piktogramme/Ablauf |
| `dark` | `true`/`false` erzwingt dunkel/hell, sonst abwechselnd |
| `img`, `imgFit`, `imgPos` | Bild als data-URL; `cover` (füllen) oder `contain` (ganz zeigen); Ausschnitt 0…1 |
| `cue` | gesprochener Satz, bei dem die Folie erscheinen soll – damit findet HoneyCut die Stelle im Transkript |
| `build` | `true`: Die Folie baut sich Schritt für Schritt auf (`liste`, `zwei`, `icons`, `prozess`, `zeitstrahl`, `checkliste`, `zahlen`, `balken`) |

## Entwicklung

- `web/` – Oberfläche: `deck-engine.js` (Folienarten, Formate, Text→Folien, Zuordnung zum Transkript), `deck-icons.js` (Piktogramme), `deck-io.js` (ZIP, PDF, Importe), `deck-app.js` (Editor)
- Aufbau Schritt für Schritt in der Engine: `HoneyDeck.steps(folie)` nennt die Zahl der Schritte, `HoneyDeck.stepTexts(folie)` ihre Texte, `HoneyDeck.render(folie, W, H, {step: j})` zeichnet die ersten `j` Einträge (ohne `step` die ganze Folie)
- `fonts/` – Schriften (dieselben wie in HoneyCut, Lizenzen in `fonts/LIZENZ.md`)
- `build.py ZIEL` – stellt Oberfläche und Schriften zusammen (Web, Android, Windows)
- `android/` – Android-App (WebView, Paket `de.honeybalecta.honeydeck`), `desktop/` – Windows-Programm (pywebview) und Installer
- Die Schnittstelle in HoneyCut ist `core/web/deck-host.js` im Repo honeybalecta/textschnitt (`window.HC_DECK_HOST`)
- Builds: `.github/workflows/build.yml` (Android + Windows, Releases `android-v…` und `v…`), `pages.yml` (Web)

## Windows: Speicher und Start (seit 1.3.1)

- Die Oberfläche spricht das Programm nur über dessen Server an (`/__store/get|set|del|keys|save|opened`, nur 127.0.0.1, Kopfzeile `X-HoneyDeck` mit dem Schlüssel `k` aus der Adresse).
- **Kein `js_api` für pywebview:** pywebview durchsucht ein solches Objekt beim Laden der Seite samt allen öffentlichen Eigenschaften; stand dort das Fenster (`api.window`), lief die Suche durch das ganze native Fenster. Bei HoneyThumb hielt das den Start an („Keine Rückmeldung“, Nov. 2026). Für Megabytes ist die Brücke ohnehin zu langsam.
- Selbstheilung beim Start: frühere Fenster ohne Rückmeldung werden beendet; nach einem nicht durchgekommenen Start wird das WebView2-Profil verworfen. Protokoll: `%APPDATA%\HoneyDeck\start.log`.
- Startanzeige in `index.html`: „HoneyDeck startet …“, nach sieben Sekunden ohne Übersicht der Grund.

