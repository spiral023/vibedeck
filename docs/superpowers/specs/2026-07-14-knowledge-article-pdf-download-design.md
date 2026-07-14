# PDF-Download für Wissensbasis-Artikel

## Ziel

Jeder Wissensbasis-Artikel soll über einen direkten Dateidownload als PDF verfügbar sein. Die Funktion muss mit dem statischen Cloudflare-Pages-Deployment funktionieren und darf keine fehlerhaften Diagramm- oder Screenshot-Grafiken erzeugen.

## Gewählte Lösung

Die Anwendung erzeugt die Datei vollständig im Browser mit `@react-pdf/renderer`. Ein eigener PDF-Renderer übersetzt das bestehende Markdown des Artikels in ein bewusst begrenztes, stabiles PDF-Layout. Nach der Erzeugung wird die Datei ohne Druckdialog heruntergeladen.

Diese Lösung benötigt kein Backend und vermeidet die grafischen Risiken einer Screenshot-basierten DOM-zu-PDF-Konvertierung.

## Bedienung

- Auf der Detailseite eines Wissensbasis-Artikels wird bei den vorhandenen Aktionen ein Button **„PDF herunterladen“** ergänzt.
- Während der Erzeugung zeigt der Button einen Ladezustand und verhindert Mehrfachklicks.
- Die Datei heißt `<artikel-id>.pdf`.
- Bei einem Fehler zeigt die Anwendung eine verständliche Toast-Meldung; der Artikel bleibt normal nutzbar.

## PDF-Inhalt und Layout

Die PDF-Datei enthält:

- Titel und Beschreibung des Artikels
- Metadaten: Lesezeit sowie, falls vorhanden, Quelle, Autor, Datum und Tags
- Markdown-Inhalte für Überschriften, Absätze, Hervorhebungen, Listen, Zitate, Links und Codeblöcke
- Lokale und externe Bilder, sofern sie für den Browser abrufbar sind

Die PDF-Komponente besitzt eigene, für A4 optimierte Stile. Sie ist nicht vom Tailwind- oder DOM-Layout der Artikelseite abhängig.

## Nicht unterstützte dynamische Inhalte

Mermaid-Diagramme und vergleichbare dynamische Inhalte werden bewusst nicht als Grafik eingebettet. Der Renderer ersetzt sie durch einen kurzen, neutralen Hinweis. Dadurch entstehen keine leeren, unvollständigen oder verzerrten Grafiken im PDF.

## Architektur

- Eine neue PDF-spezifische Komponente bzw. Hilfsfunktion erhält ein `KnowledgeArticle`-Objekt und erzeugt daraus ein React-PDF-Dokument.
- Eine kleine Markdown-Umwandlung grenzt sich auf die oben definierten unterstützten Elemente ein und behandelt unbekannte/dynamische Blöcke robust.
- Die bestehende Artikelansicht bleibt Client Component und löst aus dem erzeugten Blob den Browser-Download aus.
- Die vorhandene Funktion zum Markdown-Kopieren bleibt unverändert.

## Abhängigkeiten

`@react-pdf/renderer` wird als Laufzeitabhängigkeit ergänzt. Weitere Server- oder Build-Infrastruktur ist nicht erforderlich.

## Tests und Verifikation

- Unit-Tests prüfen die Transformation der wichtigsten Markdown-Elemente, die Behandlung von Mermaid-Blöcken und die PDF-Dateinamenerzeugung.
- `npm test`, `npm run lint` und `npm run build` werden nach der Umsetzung ausgeführt.

## Abgrenzung

Nicht Teil dieser Änderung sind Batch-Exports mehrerer Artikel, serverseitige PDF-Erzeugung, ein Druckdialog oder eine visuelle Konvertierung interaktiver Diagramme in Bilder.
