---
title: "Claude Code: Session-Management mit 1M Context"
description: "Warum das 1M-Token-Context-Window von Claude Code zugleich Hebel und Risiko ist, und wie du mit `rewind`, `/compact`, `/clear` und Subagents gezielt gegen Context Pollution arbeitest."
type: source
status: seed
category: workflows
icon: BrainCircuit
readTime: 8
tags:
  - tooling/claude-code
  - workflows/session-management
  - patterns/context-management
  - patterns/compaction
  - patterns/subagents
aliases:
  - "Using Claude Code: Session Management & 1M Context"
  - "Claude Code Session Management"
topics:
  - "[[Claude Code]]"
  - "[[Session Management]]"
  - "[[Context Window]]"
  - "[[/compact Command]]"
  - "[[Subagents]]"
up: "[[Claude Code]]"
sourceURL: "https://x.com/trq212/status/2044548257058328723"
sourceType: "tweet"
author: "Thariq (@trq212)"
sourceDate: "2026-04-15"
addedDate: "2026-04-17"
---

![Claude Code Session Management Header](/images/knowledge/claude-code-session-management-1m-context/header.jpg)

> Veröffentlicht von [Thariq auf X](https://x.com/trq212/status/2044548257058328723) als verlinkter X-Artikel mit dem Titel "Using Claude Code: Session Management & 1M Context".

Das 1M-Token-Context-Window in Claude Code ist laut Thariq kein pauschaler Qualitätsgewinn. Es erlaubt längere, autonomere Arbeitsphasen und robustere Ausführung über viele Tool-Calls hinweg. Gleichzeitig wächst damit aber das Risiko von **Context Pollution**: zu viele irrelevante Tool-Ausgaben, alte Hypothesen und nicht mehr benötigte Dateiinhalte konkurrieren um Aufmerksamkeit im selben Kontext.

Der Kernpunkt des Artikels ist deshalb nicht "Wie fülle ich 1M Token aus?", sondern: **Wie entscheide ich nach jedem Turn, was im Kontext bleiben darf und was nicht?**

![Überblick über Session Management und Context Window](/images/knowledge/claude-code-session-management-1m-context/image-1.jpg)

## Warum 1M Context ein zweischneidiges Schwert ist

Der Context Window umfasst alles, was das Modell für die nächste Antwort "sieht": System Prompt, Gesprächsverlauf, Tool-Calls, Tool-Outputs und eingelesene Dateien. Mit einem sehr großen Fenster kann Claude Code länger in derselben Session arbeiten, ohne sofort kompaktieren zu müssen.

Das Problem ist jedoch **Context Rot**. Gemeint ist die schleichende Qualitätsverschlechterung, wenn der Kontext immer größer wird und die Aufmerksamkeit des Modells über zu viele Token verteilt wird. Thariq nennt für das 1M-Modell grob einen Bereich von etwa `300k-400k` Tokens, ab dem sich dieser Effekt oft bemerkbar macht. Das ist keine harte Grenze, aber eine brauchbare Heuristik.

> Mehr Kontext bedeutet nicht automatisch besseren Output. Ab einem gewissen Punkt kostet alter Kontext mehr, als er hilft.

![Compaction als Antwort auf volle Context Windows](/images/knowledge/claude-code-session-management-1m-context/image-2.jpg)

## Die eigentliche Entscheidung nach jedem abgeschlossenen Turn

Sobald Claude eine Aufgabe beendet hat, gibt es laut Artikel fünf sinnvolle Anschlussoptionen:

1. `Continue`: im selben Thread weitermachen.
2. `rewind`: zu einem früheren Punkt zurückspringen und von dort neu ansetzen.
3. `/clear`: eine neue Session mit bewusst verdichtetem Briefing starten.
4. `/compact`: die bisherige Session von Claude zusammenfassen lassen.
5. `Subagents`: den nächsten Aufgabenblock in einen frischen Kontext auslagern.

Die natürliche Standardreaktion ist fast immer `Continue`. Genau das ist aber oft die falsche Default-Entscheidung. Der Artikel verschiebt den Fokus weg von "Wie promptet man besser?" hin zu "Welcher Kontext soll die nächste Antwort überhaupt noch beeinflussen?"

![Entscheidungspfad nach einem abgeschlossenen Turn](/images/knowledge/claude-code-session-management-1m-context/image-3.jpg)

## Neue Aufgabe = neue Session

Eine der klarsten Regeln im Text lautet: **Wenn du eine neue Aufgabe startest, solltest du in der Regel auch eine neue Session starten.**

Das heißt nicht, dass jede kleine Anschlussfrage einen neuen Thread braucht. Es gibt Grauzonen, in denen verwandte Folgeaufgaben bewusst vom bestehenden Kontext profitieren. Das Beispiel im Artikel: Du hast gerade ein Feature implementiert und möchtest direkt danach die Dokumentation dafür schreiben. In so einem Fall kann dieselbe Session sinnvoll sein, weil Claude die relevanten Dateien nicht erneut lesen muss.

Die Heuristik ist pragmatisch:

- Ist es wirklich dieselbe Aufgabe oder nur thematisch verwandt?
- Brauche ich den bisherigen Detailkontext noch?
- Ist die nächste Aufgabe stark intelligence-sensitiv oder eher Fleißarbeit?

Für hochsensitive Architektur-, Debugging- oder Design-Entscheidungen ist ein sauberer Neustart oft die bessere Wahl.

![Wann eine neue Session sinnvoller ist als Fortsetzen](/images/knowledge/claude-code-session-management-1m-context/image-4.jpg)

## Warum `rewind` oft besser ist als "try again"

Wenn Claude bereits mehrere Dateien gelesen und dann einen falschen Lösungsweg eingeschlagen hat, ist die intuitive Reaktion oft: "Das hat nicht funktioniert, probier stattdessen X."

Thariq argumentiert, dass `rewind` in vielen Fällen deutlich besser ist. Du springst damit zu einem Punkt zurück, an dem die nützlichen Erkenntnisse noch vorhanden sind, aber die falsche Umsetzungsrichtung noch nicht Teil des aktiven Kontexts geworden ist. Danach promptest du gezielter neu, zum Beispiel mit einer klaren Einschränkung auf den korrekten Pfad.

Das verhindert, dass Fehlversuche, unnötige Tool-Outputs und widersprüchliche Korrekturanweisungen den nächsten Anlauf belasten.

> Gute Korrekturen passieren möglichst nah an der Stelle, an der Claude noch nicht in die falsche Richtung abgebogen ist.

![Rewind und Handoff ab einem früheren Punkt](/images/knowledge/claude-code-session-management-1m-context/image-5.jpg)

## `/compact` vs `/clear`

Beide Optionen reduzieren Kontext, funktionieren aber grundverschieden.

`/compact` lässt Claude die bisherige Session zusammenfassen und ersetzt den langen Verlauf durch diese Verdichtung. Das ist bequem und oft erstaunlich brauchbar, bleibt aber **verlustbehaftet**. Du delegierst an Claude die Entscheidung, was wichtig war. Positiv daran ist, dass Claude oft auch Learnings, Dateipfade und implizite Zusammenhänge mitschreibt, die du selbst leicht vergessen würdest.

![Compact verdichtet die Session auf eine Zusammenfassung](/images/knowledge/claude-code-session-management-1m-context/image-6.jpg)

`/clear` ist die strengere Variante. Du formulierst selbst, was relevant ist, und startest mit einem expliziten Handoff neu. Das kostet mehr Arbeit, gibt dir aber maximale Kontrolle über den nächsten Kontext.

![Clear startet mit einem bewusst geschriebenen Briefing neu](/images/knowledge/claude-code-session-management-1m-context/image-7.jpg)

Praktisch lässt sich die Trennlinie so lesen:

- Nutze `/compact`, wenn du im selben Problemraum bleibst und nur Gewicht abwerfen willst.
- Nutze `/clear`, wenn du die nächste Phase bewusst neu rahmen willst.

## Warum schlechte Compacts entstehen

Ein besonders wichtiger Punkt im Artikel ist, dass schlechte Compacts oft dann auftreten, wenn Claude die zukünftige Richtung der Arbeit nicht gut vorhersagen kann. Wenn eine lange Debugging-Session automatisch kompakt wird, kann ein Nebenaspekt, den du später wieder aufgreifen willst, aus der Zusammenfassung herausfallen.

Das verschärft sich dadurch, dass Compaction häufig genau dann passiert, wenn der Kontext ohnehin schon stark gefüllt ist. Das Modell arbeitet also beim Zusammenfassen nicht in seinem besten Zustand.

Die praktische Konsequenz: **Nicht erst auf das automatische Compact warten.** Wenn du absehen kannst, wohin die Session als Nächstes gehen soll, ist ein früheres, aktiv gesteuertes `/compact` meist robuster.

![Warum schlechte Compacts oft zu spät passieren](/images/knowledge/claude-code-session-management-1m-context/image-8.jpg)

## Subagents als Werkzeug für saubere Kontextgrenzen

Subagents beschreibt Thariq explizit als Form von Context Management. Sie sind besonders dann sinnvoll, wenn ein Arbeitsblock viel Zwischenoutput erzeugt, du am Ende aber nur das Ergebnis brauchst.

Der mentale Test aus dem Artikel ist stark:

> Werde ich diesen Tool-Output später noch brauchen oder nur die Schlussfolgerung?

Wenn die Antwort "nur die Schlussfolgerung" lautet, ist ein Subagent oft die sauberere Wahl. Beispiele:

- ein Subagent validiert ein Ergebnis gegen eine Spec-Datei,
- ein Subagent analysiert eine andere Codebase und fasst ein Pattern zusammen,
- ein Subagent schreibt Dokumentation auf Basis vorhandener Änderungen.

So bleibt der Parent-Kontext auf Entscheidungen und Resultate fokussiert, statt sich mit Recherche- oder Prüfpfaden zu füllen.

![Subagents isolieren Recherche und Zwischenoutput](/images/knowledge/claude-code-session-management-1m-context/image-9.jpg)

## Praktische Takeaways

Der Artikel liefert kein starres Regelwerk, sondern eine belastbare Entscheidungslogik für den Alltag mit Claude Code:

- große Context Windows erhöhen Reichweite, aber nicht automatisch Präzision,
- neue Tasks sollten meist neue Sessions bekommen,
- `rewind` ist oft das beste Korrekturwerkzeug,
- `/compact` spart Arbeit, `/clear` gibt Kontrolle,
- Subagents sind nicht nur Organisationshilfe, sondern echte Kontext-Isolation.

Für fortgeschrittene Claude-Code-Workflows ist das ein wichtiger Perspektivwechsel: Session-Management ist kein Nebenthema, sondern ein direkter Hebel für Qualität, Kosten und Zuverlässigkeit.

## Verbindungen
- [[Claude Code]]
- [[Session Management]]
- [[Context Window]]
- [[Context Pollution]]
- [[Context Rot]]
- [[/compact Command]]
- [[/clear Command]]
- [[/rewind Command]]
- [[Subagents]]
- [[Workflow Design]]
