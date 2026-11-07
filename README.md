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
- **Formate:** Quer 16:9, Hoch 9:16, Quadrat 1:1, Hoch 4:5, Quer 4:3, A4 quer. Jede Folie wird für jedes Format neu gesetzt; Texte werden verkleinert statt abgeschnitten. Wird ein Text dabei sehr klein, zeigt HoneyDeck eine Warnung beim Format.
- **Farbe der Präsentation:** Rot, Grün, Petrol, Blau, Violett, Magenta, Orange, Ocker – oder die Farbe des Designprofils. Wählbar beim Anlegen, jederzeit änderbar über den Farbpunkt in der Leiste; gilt für alle Folien.
- **Designprofile:** dieselben wie in HoneyCut (Honey Balecta Standard, Hell & ruhig, Kontrast) plus eigene – Farben, Schriften, Größen, Ausrichtung, Rand, Kennung unten rechts.
- **Import:** .honeydeck, PowerPoint (.pptx), HTML-Folien, Bilder, ZIP mit Bildern, Word (.docx), Text, Markdown, Untertitel. PDF und alte .ppt/.doc nicht.
- **Export:** PNG (einzeln oder als ZIP, ein Ordner je Format), PDF, .honeydeck.

## In HoneyCut

- Der Reiter „Folien“ zeigt HoneyDeck mit dem Transkript des Projekts. Rückgängig, Speichern und „Als B-Roll einsetzen“ laufen über HoneyCut, ebenso N im Studio.
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

## Entwicklung

- `web/` – Oberfläche: `deck-engine.js` (Folienarten, Formate, Text→Folien, Zuordnung zum Transkript), `deck-icons.js` (Piktogramme), `deck-io.js` (ZIP, PDF, Importe), `deck-app.js` (Editor)
- `fonts/` – Schriften (dieselben wie in HoneyCut, Lizenzen in `fonts/LIZENZ.md`)
- `build.py ZIEL` – stellt Oberfläche und Schriften zusammen (Web, Android, Windows)
- `android/` – Android-App (WebView, Paket `de.honeybalecta.honeydeck`), `desktop/` – Windows-Programm (pywebview) und Installer
- Die Schnittstelle in HoneyCut ist `core/web/deck-host.js` im Repo honeybalecta/textschnitt (`window.HC_DECK_HOST`)
- Builds: `.github/workflows/build.yml` (Android + Windows, Releases `android-v…` und `v…`), `pages.yml` (Web)
