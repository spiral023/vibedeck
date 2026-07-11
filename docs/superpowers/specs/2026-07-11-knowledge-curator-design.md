# Knowledge Curator – Design

## Ziel

Den installierten Codex-Skill `knowledge-curator` so erweitern, dass er Informationen aus X/Twitter-Posts und Threads, Websites, Blogs, Dokumentationen, GitHub-Repositories und vorhandenen Markdown-Artikeln zuverlässig erfassen, mit Bildern sichern und als hochwertige VibeDeck-Wissensartikel erstellen, aktualisieren, verbessern oder zusammenführen kann.

Die Aufbereitung erfolgt adaptiv: Kurze Quellen werden mit notwendigem Kontext verständlich gemacht, lange Quellen fachlich verdichtet und mehrere Quellen zu einer nachvollziehbaren Synthese kombiniert. Die lokale Gemini-Kopie dient als Input und wird nach erfolgreicher Validierung des Codex-Skills aus dem Repository entfernt.

## Gewählter Ansatz

Der Skill wird modular aufgebaut:

- Eine kompakte `SKILL.md` steuert Moduswahl, Kernworkflow und Qualitäts-Gates.
- Separate Referenzen enthalten quellentypische Extraktionsstrategien und das VibeDeck-Artikelformat.
- Ein deterministisches Prüfskript kontrolliert Artikel und Assets.

Eine einzelne, umfangreiche `SKILL.md` wäre schwer wartbar. Eine vollständig eigene Scraping-Pipeline wäre insbesondere für X und dynamische Websites zu brüchig. Der modulare Ansatz nutzt verfügbare Browser-, Web- und Repository-Werkzeuge, hält projektspezifische Regeln aber explizit und testbar.

## Arbeitsmodi

Der Skill unterstützt vier Modi. Eine ausdrückliche Nutzerangabe hat Vorrang; andernfalls wird der Modus aus Auftrag und Zielbestand abgeleitet.

### `create`

- Einen neuen Artikel, Slug und Asset-Ordner anlegen.
- Vorher exakte URL-Dubletten und thematische Überschneidungen prüfen.
- Bei exakter Dublette den vorhandenen Artikel melden, statt eine zweite Datei zu erzeugen.

### `update`

- Einen bestehenden Artikel mit neuen, belegbaren Informationen ergänzen.
- Veraltete Aussagen korrigieren und Quellenmetadaten aktualisieren.
- Bestehende, weiterhin richtige Inhalte und manuelle Ergänzungen erhalten.

### `improve`

- Den fachlichen Kern grundsätzlich bewahren.
- Sprache, Struktur, Frontmatter, Verbindungen, Quellen, Bilder und Lesbarkeit verbessern.
- Keine neuen Tatsachen ohne Quelle hinzufügen.

### `merge`

- Einen Zielartikel bestimmen und mehrere Artikel oder Quellen darin konsolidieren.
- Redundanzen entfernen, Ergänzungen einordnen und Widersprüche sichtbar machen.
- Quelldateien und verwaiste Assets erst nach erfolgreicher Validierung des Zielartikels löschen.

## Quellenaufnahme

### Gemeinsamer Ablauf

1. Eingaben und gewünschten Modus bestimmen.
2. Bestehende Knowledge-Artikel anhand von URL, Titel, Aliases, Topics und Verbindungen prüfen.
3. Quellentyp erkennen und passende Strategie laden.
4. Text, Metadaten, Veröffentlichungsdatum, Autor, Code, Medien und relevante ausgehende Quellen erfassen.
5. Boilerplate, Navigation, Werbung, Tracking und irrelevante UI-Inhalte entfernen.
6. Aussagen in einer internen Evidenzliste mit Quelle, Datum, Vertrauensgrad und möglichen Konflikten ordnen.
7. Erst danach Artikelstruktur und Synthese erstellen.

Nicht verifizierbare Informationen werden gekennzeichnet oder ausgelassen. Erklärender Kontext ist erlaubt, darf jedoch nicht als quellenbelegte Tatsache erscheinen.

### X/Twitter

- Einzelposts und vollständige Threads unterstützen.
- Lazy Loading durch Scrollen auslösen und mehrere Snapshots erfassen.
- Posts des Thread-Autors von Antworten Dritter unterscheiden.
- Medien in Originalreihenfolge erfassen.
- Bei Login-Wall oder Blockaden über Websuche, ThreadReader, Reposts oder gleichwertige Primär-/Spiegelquellen arbeiten.
- Eine alternative Quelle nur verwenden, wenn Inhalt und Zuordnung ausreichend verifiziert werden können.

### Websites, Blogs und Dokumentationen

- Hauptinhalt, Überschriftenhierarchie, Autor, Datum, Codeblöcke, Tabellen und relevante Bilder extrahieren.
- Bei mehrseitigen Inhalten notwendige Unterseiten gezielt einbeziehen.
- Canonical URL bevorzugen und Tracking-Parameter bei Dublettenvergleichen normalisieren.

### GitHub-Repositories

- Repository-Metadaten, README, Docs, Releases und gezielt relevante Quell- oder Konfigurationsdateien prüfen.
- Nicht blind das gesamte Repository zusammenfassen.
- Je nach Thema Architektur, Installation, zentrale APIs, typische Anwendung, Grenzen, Lizenz und Projektstatus behandeln, soweit die Quellen dies tragen.
- Konkrete Dateien, Tags, Releases oder Commits nennen, wenn Aussagen davon abhängen.

### Vorhandene Markdown-Artikel

- Frontmatter, Body, Wikilinks, Quellen, Bilder und lokale Änderungen erfassen.
- Bei `update`, `improve` und `merge` bestehende Inhalte als schützenswerte Ausgangsbasis behandeln.

## Evidenz und Quellen

- Direkte Zitate sparsam und präzise verwenden; übrige Inhalte paraphrasieren.
- Bei mehreren Quellen Übereinstimmungen zusammenführen, ergänzende Perspektiven einordnen und Konflikte benennen.
- `sourceURL` enthält die Primärquelle.
- Weitere verwendete Quellen werden im Body unter `## Quellen` nachvollziehbar aufgeführt.
- Quellenangaben müssen die jeweiligen Aussagen tatsächlich stützen.
- Aktuelle oder zeitabhängige Angaben werden bei der Verarbeitung verifiziert.

## Artikelaufbau

- Professionelles, natürliches Deutsch mit Du-Ansprache verwenden.
- Englische technische Fachbegriffe, Code, Prompts und präzisionskritische Formulierungen im Original belassen.
- Mit einem kurzen Einstieg Thema, Nutzen und Kontext erklären.
- Den Hauptteil nach Konzepten und Lernlogik strukturieren, nicht mechanisch nach Quellenreihenfolge.
- `##` und `###` für eine klare Hierarchie verwenden.
- Blockquotes nur für zentrale Aussagen oder kurze Originalzitate einsetzen.
- `## Quellen` bei mehreren Quellen oder zusätzlichen Belegen ergänzen.
- Immer eine fachlich relevante Sektion `## Verbindungen` erzeugen.

Für GitHub-Inhalte werden Architektur, Installation, APIs, Anwendung und Grenzen nur aufgenommen, wenn sie für den Wissenswert des Artikels relevant sind.

## Optionale Visualisierungen

Mermaid-Diagramme und Markdown-Tabellen sind Erklärwerkzeuge, keine Pflichtbestandteile.

Mermaid einsetzen, wenn Abläufe, Architektur, Abhängigkeiten, Zustände oder Entscheidungswege dadurch deutlich verständlicher werden. Tabellen nur für echte Vergleiche, Zuordnungen oder strukturierte Referenzdaten verwenden.

Dabei gilt:

- Keine dekorativen Diagramme oder Tabellen.
- Keine Wiederholung bereits klarer Prosa.
- Nur aus den Quellen ableitbare Beziehungen darstellen.
- Diagramme kompakt und mit dem VibeDeck-Renderer kompatibel halten.
- Der Artikel muss auch ohne Visualisierung verständlich bleiben.

## Bilder und Assets

- Alle redaktionell relevanten Bilder erfassen, nicht nur ein Headerbild.
- Avatare, Logos ohne Erklärwert, Tracking-Pixel, Emojis und UI-Dekoration verwerfen.
- Bilder unter `public/images/knowledge/{slug}/` mit stabilen, beschreibenden Namen und korrekter Dateiendung speichern.
- Originalreihenfolge und fachlich sinnvolle Platzierung erhalten.
- Aussagekräftigen Alt-Text schreiben.
- Downloadstatus, MIME-Typ, Dateigröße und lokale Referenz prüfen.
- Die Herkunft des Bildes über die Artikelquelle oder eine explizite Quellenangabe nachvollziehbar halten.
- Fehlgeschlagene Downloads nicht im Markdown referenzieren.
- Einen Asset-Ordner nur behalten, wenn mindestens ein Asset erfolgreich gespeichert wurde.

## VibeDeck-Metadaten

Das Frontmatter muss dem tatsächlich unterstützten Schema in `src/types/knowledge.ts` entsprechen.

Pflichtfelder für neue Source Notes:

- `title`
- `description`
- `type: source`
- `status`
- `category`
- `icon`
- `readTime` als aufgerundete Ganzzahl auf Basis von 140 Wörtern pro Minute
- `tags`
- `aliases`
- `topics`
- `sourceURL`
- `sourceType`
- `author`, soweit feststellbar
- `sourceDate`, soweit feststellbar
- `addedDate`
- `level`, wenn sinnvoll bestimmbar

Regeln:

- Nur unterstützte `sourceType`-Werte verwenden: `tweet`, `thread`, `blog`, `docs`.
- GitHub-Repositories und technische Dokumentationen als `docs` klassifizieren.
- Datumswerte als `YYYY-MM-DD` schreiben.
- Wikilinks in YAML quoten.
- Bestehende Kategorien, Tags, Topics und Icons bevorzugen.
- `## Verbindungen` aus realen Entitäten und Konzepten bilden und vorhandene Wissensknoten bevorzugen.

## Fehler- und Sicherheitsverhalten

- Bei blockierter Primärquelle alternative Zugriffswege dokumentieren und inhaltliche Gleichwertigkeit prüfen.
- Unvollständige Threads, fehlende Repo-Dateien und Quellenkonflikte nicht stillschweigend vervollständigen.
- Keine kaputten Bildreferenzen oder leeren Asset-Ordner hinterlassen.
- Bei Dateiänderungen bestehende, nicht zum Auftrag gehörende Nutzeränderungen erhalten.
- Destruktive Merge-Schritte erst nach erfolgreicher Zielvalidierung ausführen.
- Wenn eine wesentliche Unsicherheit nicht auflösbar ist, den Artikel als unvollständig kennzeichnen oder vor dem Speichern Rücksprache halten.

## Skill-Struktur

Vorgesehene Dateien:

```text
knowledge-curator/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
│   ├── source-playbooks.md
│   └── vibedeck-article-format.md
└── scripts/
    └── validate-knowledge-article.mjs
```

`SKILL.md` bleibt die kompakte Steuerung. `source-playbooks.md` wird nur für die betroffenen Quellentypen gelesen. `vibedeck-article-format.md` enthält Schema, Stil- und Assetregeln. Das Skript übernimmt deterministisch prüfbare Regeln.

## Validierung

Das Prüfskript kontrolliert mindestens:

- erforderliche Frontmatter-Felder
- unterstützte Enum-Werte
- Datumsformat
- Wortzahl und plausible `readTime`
- doppelte oder bereits verwendete Primär-URLs
- lokale Markdown-Bildpfade und vorhandene Assets
- nicht referenzierte Dateien im Artikel-Assetordner
- Vorhandensein und Inhalt von `## Verbindungen`
- `## Quellen`, wenn mehrere Quellen verarbeitet wurden
- grundlegende Mermaid-Codeblock-Konsistenz

Nach der Artikelvalidierung wird die relevante VibeDeck-Projektprüfung beziehungsweise ein Build ausgeführt.

## Skill-Tests

Die Überarbeitung folgt RED–GREEN–REFACTOR:

1. Den unveränderten Skill mit realistischen Szenarien prüfen und Lücken dokumentieren.
2. Minimal notwendige Skill-Regeln und Ressourcen implementieren.
3. Dieselben Szenarien erneut ausführen und neue Fehlinterpretationen schließen.

Mindestens folgende Szenarien abdecken:

- langer X-Thread mit mehreren Bildern
- normale Website mit Boilerplate und eingebetteten Medien
- GitHub-Repository mit README, Docs und Releases
- Multi-Source-Artikel mit ergänzenden oder widersprüchlichen Aussagen
- Verbesserung eines bestehenden Artikels mit lokalen Assets
- Merge zweier vorhandener Artikel ohne vorschnellen Datenverlust

Zusätzlich werden Skill-Frontmatter, `agents/openai.yaml`, Referenzverweise und das Prüfskript validiert.

## Abschlusskriterien

- Der installierte Codex-Skill unterstützt alle vier Modi und genannten Quellentypen.
- Quellen, Aussagen und Bilder bleiben nachvollziehbar.
- Der adaptive Aufbereitungsstandard ist umgesetzt.
- Mermaid und Tabellen werden nur bei echtem Erklärwert eingesetzt.
- Der Validator und realistische Forward-Tests bestehen.
- Die Gemini-Skill-Kopie ist aus dem Repository entfernt.
- Andere Nutzeränderungen wurden nicht überschrieben.
