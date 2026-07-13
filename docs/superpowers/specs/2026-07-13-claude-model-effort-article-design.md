# Design: Wissensbasis-Artikel zu Model und Effort in Claude Code

## Ziel

Eine neue deutschsprachige Source Note fasst den langen Anthropic-Artikel „Choosing a Claude model and effort level in Claude Code“ praxisnah zusammen. Der von Claude Developers veröffentlichte X-Post bleibt die Primärquelle; der dort verlinkte Anthropic-Beitrag dient als zusätzliche Fachquelle.

## Inhalt

Der Artikel erklärt den Unterschied zwischen Modellwahl und Effort Level, ordnet beide Stellschrauben nach Fähigkeit, Gründlichkeit, Tokenverbrauch und Kosten ein und gibt eine konkrete Diagnoseheuristik für fehlgeschlagene Aufgaben. Die Struktur folgt der Lernlogik und nicht der Reihenfolge des Originals. Der Text wird auf natürliches Deutsch verdichtet, während präzise Produkt- und Fachbegriffe im Englischen bleiben.

## Quellen und Bilder

`sourceURL` verweist auf den offiziellen X-Post. Der verlinkte Anthropic-Artikel wird unter `## Quellen` mit seiner Belegfunktion aufgeführt. Offizielle Grafiken werden nur lokal übernommen, wenn die Nutzungsbedingungen die Wiederverwendung eindeutig erlauben. Jede übernommene Rasterdatei wird auf Dateityp, Signatur, Lesbarkeit, Herkunft und erforderliche Attribution geprüft und unter dem artikelspezifischen Asset-Pfad gespeichert. Bei unklaren Rechten wird kein lokales Bild referenziert.

## Metadaten und Verbindungen

Die Note verwendet das aktuelle Schema aus `src/types/knowledge.ts`, bestehende Kategorien und konsistente Wikilinks. Vorgesehene Kernverbindungen sind `[[Claude Code]]`, `[[Effort Level]]`, `[[Context Engineering]]` und `[[AI Models]]`.

## Qualitätssicherung

Nach der Erstellung läuft der Knowledge-Curator-Validator mit genau einer zusätzlichen Quelle. Danach wird die relevante Projektprüfung beziehungsweise der Build ausgeführt. Fehler aus den neuen Artikel- oder Assetänderungen werden behoben; sachfremde bestehende Fehler werden dokumentiert.
