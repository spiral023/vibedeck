# Tabellen in Wissensbasis-PDFs

## Ziel

Markdown-Tabellen in Wissensbasis-Artikeln sollen im direkten PDF-Download als lesbare Tabellen erscheinen statt als zusammengezogener Text mit Pipe-Zeichen.

## Gewählte Lösung

Der bestehende PDF-Markdown-Parser erkennt GFM-Tabellen als eigenen Block mit Kopfzeile, Ausrichtungstrenner und Datenzeilen. Der React-PDF-Renderer gibt diesen Block als echte Tabelle mit Kopfzeile, Zellen und automatischem Zeilenumbruch aus.

## Darstellung

- Kopfzeilen haben eine dezente graue Fläche und fette Schrift.
- Datenzeilen haben dünne Ränder und ausreichend Innenabstand.
- Spalten erhalten standardmäßig die gleiche Breite innerhalb der nutzbaren A4-Seite.
- Lange Inhalte umbrechen innerhalb ihrer Zelle.
- Tabellen mit mehr als vier Spalten oder sehr langen Zellen verwenden eine kleinere Schrift und eine eigene A4-Querformat-Seite, damit der Inhalt lesbar bleibt.
- Tabellen bleiben im Dokumentfluss; eine kurze Tabelle wird nicht unnötig auf eine neue Seite verschoben.

## Robustes Parsing

- Unterstützt werden Standard-GFM-Tabellen mit einer Kopfzeile, einer Trennzeile mit Bindestrichen und mindestens einer Datenzeile.
- Führende und abschließende Pipe-Zeichen sind optional.
- Ausrichtungshinweise wie `:---` und `---:` werden beim Rendering ignoriert; die Inhalte bleiben linksbündig, um das Layout stabil zu halten.
- Zellen mit weniger Spalten werden bis zur Kopfzeilenbreite leer aufgefüllt; zusätzliche Zellen werden verworfen.
- Unvollständige oder ungültige Tabellen bleiben normale Absätze und lösen keinen PDF-Fehler aus.

## Test und Verifikation

- Unit-Tests prüfen das Erkennen normaler Tabellen, optionaler Rand-Pipes, Auffüllen kurzer Zeilen und den Fallback für ungültige Tabellen.
- Ein echter React-PDF-Render-Test enthält eine Tabelle mit langen Zellwerten und bestätigt einen nichtleeren PDF-Blob.
- Danach laufen die komplette Test-Suite und der statische Produktions-Build.

## Abgrenzung

Nicht Teil der Änderung sind verschachtelte Tabellen, HTML-Tabellen, pro-Spalte frei definierbare Breiten oder eine automatische Umschreibung in Karten.
