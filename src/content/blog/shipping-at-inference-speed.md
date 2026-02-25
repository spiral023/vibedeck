---
title: "Shipping at Inference-Speed: Warum Peter Steinberger Code heute anders baut"
description: "Peter Steinberger beschreibt, wie sich sein Agentic-Coding-Workflow 2025 verändert hat: weniger manuelles Lesen, mehr Systemdenken, schnellere Iteration und Delivery, die primär durch Inference-Latenz begrenzt ist."
category: workflows
icon: Zap
readTime: 18 Min
tags: ["agentic-coding", "codex", "gpt-5.2", "workflow", "developer-productivity"]
keyPoints:
  - "Der zentrale Engpass ist laut Steinberger nicht mehr Tippen, sondern Inference-Zeit plus Architektur- und Produktentscheidungen."
  - "Er sieht bei größeren Aufgaben klare Qualitätsvorteile von Codex durch längeres Kontextlesen, auch wenn einzelne Runs länger dauern."
  - "Sein Output-Boost kommt vor allem aus einem iterativen CLI-first-Workflow, starkem Kontext-Engineering und konsequenter Automatisierung über Skills."
sourceURL: "https://steipete.me/posts/2025/shipping-at-inference-speed"
sourceType: blog
author: "Peter Steinberger"
sourceDate: "2025-12-28"
---

![Header](/images/blog/shipping-at-inference-speed/header.png)

Peter Steinberger beschreibt in „Shipping at Inference-Speed“ einen spürbaren Shift im praktischen Softwarebau mit Agenten: Von „Prompt schreiben und hoffen“ hin zu einem Produktionsmodus, bei dem Modelle große Teile der Implementierung zuverlässig liefern und der Mensch stärker als Architekt, Reviewer und Systemdesigner agiert.

Der Text ist bewusst praxisnah. Es geht weniger um Benchmarks und mehr um reale Arbeitsmuster: Wie man mehrere Projekte parallel fährt, warum CLI-first so gut mit Agenten harmoniert, welche Modellunterschiede im Alltag zählen und welche Entscheidungen trotz allem weiterhin menschlich schwer bleiben.

> „I can ship code now at a speed that seems unreal.“

## Was sich seit Mai verändert hat

Steinberger beginnt mit einem einfachen, aber starken Vergleich: Im Frühjahr war er überrascht, wenn ein Prompt sofort funktionierenden Code erzeugte. Ende 2025 ist genau das seine Basiserwartung.

Daraus folgt ein neues Gefühl für Taktung und Qualität:

- Wenn eine Aufgabe „eigentlich einfach“ ist, erwartet er einen One-Shot.
- Wenn der Agent länger kämpft, wird er misstrauisch gegenüber Lösungsweg oder Scope.
- Die Frage verschiebt sich von „Kann das Modell das?“ zu „Wie designe ich Aufgabe und Kontext so, dass das Modell schnell korrekt landet?“

Diese Perspektive ist wichtig: Produktivität steigt nicht nur durch stärkere Modelle, sondern auch durch bessere Aufgabenformulierung, robuste Feedback-Loops und passende Tooling-Entscheidungen.

## Der eigentliche Engpass: Inference-Zeit und harte Entscheidungen

Eine Kernthese des Artikels lautet: Für viele App-Klassen ist nicht mehr die reine Implementierung der Bottleneck.

> Der neue Grenzfaktor ist oft Inference-Latenz plus „hard thinking“ bei Architektur, Abhängigkeiten und Produktentscheidungen.

Steinberger formuliert das sehr nüchtern. Viele Anwendungen bestehen aus bekannten Mustern:

- Daten reinholen
- Daten transformieren
- Daten speichern
- Daten darstellen

Dafür eignen sich heutige Agenten sehr gut. Was schwieriger bleibt:

- Systemgrenzen sauber schneiden
- Langfristige Wartbarkeit sichern
- Unsichere Produktentscheidungen unter Zeitdruck treffen

## Warum er standardmäßig mit CLI beginnt

Ein wiederkehrendes Muster im Beitrag ist **CLI-first**. Das ist kein Stilfetisch, sondern ein operativer Vorteil.

CLI-Interfaces sind für Agenten ideal, weil sie:

- klar testbar sind
- deterministischere Rückgaben liefern
- schnelle Ausführungsschleifen erlauben
- sich leicht in Skripte und Automationen integrieren lassen

Für Steinberger ist das eine Art „Default-Form“ von Software. Selbst wenn später UI, Extension oder App dazukommt, startet die Kernlogik als textbasiertes Interface.

Das reduziert Ambiguität in frühen Iterationen massiv und beschleunigt die Lernschleife zwischen Prompt, Ausführung und Korrektur.

## Der Model-Shift: GPT-5, dann GPT-5.2

Steinberger beschreibt GPT-5 als Wendepunkt, sieht den größeren Alltagssprung aber von 5/5.1 zu 5.2.

Seine Beobachtung: Mit besseren Modellen muss er weniger „Prompt-Charaden“ spielen. Statt künstlicher Modi und Umwege arbeitet er häufiger direkt im Dialog:

1. Frage formulieren
2. Recherche/Code-Exploration durch den Agenten
3. Plan gemeinsam schärfen
4. „build“ bzw. „write plan … and build this“

Dabei fällt auf: Seine Prompts werden kürzer, oft bildgestützt, und stärker auf Zielzustand statt Mikromanagement ausgerichtet.

## Codex vs. Opus: Benchmarks reichen nicht

Ein zentraler Abschnitt dreht sich um Modellvergleich in der Praxis. Steinberger betont, dass ähnliche Benchmarkwerte reale Unterschiede im Arbeitsfluss verdecken können.

Seine Einschätzung (konkret auf seine Workloads):

- Codex liest oft länger und breiter im Code, bevor es schreibt.
- Das wirkt anfangs langsamer, reduziert aber spätere Reparaturschleifen.
- Opus ist bei kleinen Edits oft sehr schnell und angenehm.
- Bei großen Refactors steigt bei ihm das Risiko für Lücken und ineffiziente Outcomes.

Die entscheidende Metrik ist für ihn daher nicht „Sekunden bis erster Output“, sondern **Zeit bis stabile, integrierte Lösung**.

> Viermal längerer Lauf kann netto schneller sein, wenn der „Fix vom Fix“ entfällt.

## Oracle als Loop-Extension

Ein spannender Teil des Artikels ist „Oracle“: ein eigenes CLI, mit dem Agenten GPT-5 Pro für schwere Recherche- oder Analysefälle aufrufen konnten.

Ausgangsproblem:

- Agenten laufen fest
- Kontext muss manuell exportiert werden
- externer Deep-Research-Call kostet Zeit und Fokus

Lösung:

- Prompt + Dateien automatisiert an Pro geben
- Session-Management für späteres Abholen
- Rückführung ins laufende Agentensystem

Mit GPT-5.2 sinkt der Bedarf an Oracle laut Steinberger deutlich, aber das Muster bleibt relevant: **Fehlende Fähigkeiten durch gezielte Side-Tools einkapseln und orchestrieren.**

## Konkretes Beispiel: VibeTunnel-Refactor in Zig

Besonders eindrücklich ist sein Rückblick auf VibeTunnel. Ein früherer Versuch, ein Kernsystem in eine andere Sprache zu migrieren, scheiterte mit älteren Modellen trotz vieler Anläufe.

Beim späteren Versuch mit Codex:

- kurzer Prompt
- mehrstündiger Run
- mehrere Compactions
- am Ende eine funktionierende One-Shot-Konvertierung

Unabhängig vom Einzelfall zeigt das, was viele Teams inzwischen sehen: Die Grenze verschiebt sich von „geht gar nicht“ zu „geht, wenn man Laufzeit, Kontext und Verifikation richtig setzt“.

## Sein Workflow: iterativ, parallel, pragmatisch

### 1. Mehrere Projekte gleichzeitig

Steinberger arbeitet oft parallel an mehreren Codebasen (typisch 3–8). Das funktioniert, weil er ein Gefühl dafür entwickelt hat, welche Aufgaben „agentenfreundlich“ sind und wo enges Steering nötig ist.

Einfache, klare Tasks laufen im Hintergrund, während er in einem Hauptprojekt schwierige Entscheidungen trifft.

### 2. Queue statt starrem Orchestrierungsapparat

Neue Ideen landen in einer Pipeline. Statt komplexer Multi-Agent-Steuerung sieht er häufig den Menschen als eigentlichen Bottleneck.

Sein Muster ist stark iterativ:

- bauen
- anfassen
- Verhalten fühlen
- nachschärfen

Nicht ein großer Masterplan, sondern schnelle Zyklen mit engem Feedback.

### 3. Kaum Reverts, selten Checkpointing

Er beschreibt Softwareentwicklung als Weg auf einen Berg: nicht linear, aber stetig. Statt hartem Zurücksetzen korrigiert er laufend über neue Prompts.

Das reduziert Kontextwechsel, verlangt aber Vertrauen in den Agenten-Loop und sauberes Monitoring.

### 4. Commit-to-main als Default (mit Kontext)

Für Solo- oder sehr kleine Setups bevorzugt er lineare Evolution statt komplexer Branch-Strukturen. Er nennt ausdrücklich den Teamkontext als Grenze: In größeren Teams funktioniert das nicht 1:1.

Der interessante Punkt ist weniger „main oder nicht“, sondern: **kognitive Last minimieren**, damit Fokus auf Produkt und Architektur bleibt.

## Kontext-Engineering statt Session-Archiv-Religion

Ein wichtiger Gegenakzent zu vielen „perfect memory“-Ansätzen: Steinberger setzt stark auf projektinterne Doku (`docs/`) und klare Instruktionen in einer globalen AGENTS-Datei.

Konsequenzen:

- Wiederverwendbares Wissen bleibt am Projekt
- Der Agent kann gezielt dazu navigieren
- Alte Chat-Historien werden weniger kritisch

Zusätzlich nutzt er Cross-Project-Referenzen (`../project-folder`) als effizienten Transfermechanismus für bewährte Muster.

## Prompting heute: kürzer, visueller, direkter

Er beschreibt einen klaren Stilwechsel:

- weg von sehr langen, erklärenden Monolog-Prompts
- hin zu kurzen, zielorientierten Anweisungen
- plus Screenshots für UI- und Layoutfragen

Das passt gut zur aktuellen Modelltendenz: Wenn Kontext stimmt und Ziel klar ist, bringen knappe Prompts oft bessere Ergebnisse als textliche Over-Specification.

## Was trotz allem schwer bleibt

Gerade weil vieles leichter wird, treten die wirklich teuren Entscheidungen stärker hervor:

- Welche Abhängigkeit ist robust und zukunftssicher?
- Wie sehen Schnittstellen zwischen Client/Server aus?
- Welche Architektur trägt unter realen Lasten?
- Wo zahlt sich zusätzliche Komplexität wirklich aus?

Steinberger investiert hier bewusst mehr Zeit. Das deckt sich mit einem generellen Trend: Implementierung wird günstiger, Fehlentscheidungen im Design werden relativ teurer.

## Infrastruktur und Arbeitsumgebung

Der Beitrag enthält auch konkrete Setup-Muster:

- zwei Macs parallel (lokal + remote)
- UI/Browser-lastige Tasks auslagern
- lange Agentenläufe im Hintergrund weiterlaufen lassen
- bei Reisen nahtlos auf Remote-Workstation umschalten

Er bevorzugt dabei Terminal-Workflows wegen direkter Steuerbarkeit und geringerer Prozesskomplexität gegenüber stark PR-zentrierten Async-Agent-Setups.

## Konfiguration als Hebel (nicht als Selbstzweck)

Steinberger teilt eine konkrete Codex-Konfiguration mit erhöhten Token-Limits und aktivierten Features wie Websuche, Skills und Compaction-Tuning.

Wichtig ist seine Begründung:

- größere Sichtfenster reduzieren „stille“ Kontextverluste
- verlässliche Compaction ermöglicht lange Aufgabenketten
- konservative Reasoning-Einstellungen können Speed und Qualität besser balancieren als „immer maximal“

Die Meta-Lektion: Gute Defaults sind selten optimal für individuelle Workloads. Konfiguration ist ein Produktivitätsfaktor, wenn sie bewusst am tatsächlichen Arbeitsprofil ausgerichtet wird.

### Einordnung seiner Config-Philosophie

Steinberger argumentiert nicht, dass jeder dieselben Werte übernehmen sollte. Der Punkt ist eher: Wenn ein Agent regelmäßig in Grenzsituationen läuft, dann ist nicht nur der Prompt schuld. Häufig sind es versteckte Limits, die unauffällig Qualität kosten.

Typische Symptome dafür:

- Der Agent liefert „halb richtige“ Änderungen in großen Dateien.
- Offensichtliche Abhängigkeiten werden nicht berücksichtigt.
- Korrekturen werden inkonsistent, obwohl die Anweisung klar war.

Für ihn ist das oft ein Signal, dass das Modell nicht genug Kontext am Stück sehen konnte oder dass Compaction zu spät/zu aggressiv greift.

### Der geteilte Config-Block (vereinfacht)

```toml
model = "gpt-5.2-codex"
model_reasoning_effort = "high"
tool_output_token_limit = 25000
model_auto_compact_token_limit = 233000

[features]
ghost_commit = false
unified_exec = true
apply_patch_freeform = true
web_search_request = true
skills = true
shell_snapshot = true
```

Die Botschaft dahinter: Kontextfenster und Tool-Ausgaben sind kein abstraktes Tuning-Thema, sondern direkter Hebel auf Erstlösungsqualität.

## Warum „Plan Mode“ für ihn an Bedeutung verlor

Ein interessanter Teil des Originaltexts ist seine Kritik an starren Plan-Workflows. Er beschreibt Plan Mode als historisch hilfreiches Werkzeug für ältere Modellgenerationen, aber nicht als notwendige Standardphase für jede Aufgabe.

Sein heutiger Ablauf ist flexibler:

1. Kurz Problemrahmen klären
2. Agent recherchieren und Code lesen lassen
3. Plan gemeinsam validieren
4. Unmittelbar umsetzen lassen

Der Vorteil dieses Musters ist, dass Planung nicht als separate Zeremonie, sondern als laufender Dialog stattfindet. Das spart Reibung, solange das Modell robust im Kontext arbeitet.

## Wissens-Cutoff als unterschätzter Produktivitätsfaktor

Steinberger betont explizit den Wissensstand der Modelle als Alltagsfaktor. In schnell drehenden Ökosystemen sind wenige Monate Unterschied bei Tooling, APIs und Best Practices operativ relevant.

Das zeigt sich besonders bei:

- neuen Bibliotheksversionen
- frischen Framework-Konventionen
- aktuellen Build- und Deploy-Patterns
- modernen Agentic-Toolchains

Hier entsteht sonst leicht ein verdeckter Kostenblock: Der Agent implementiert formal korrekt, aber auf veralteten Annahmen. Das Ergebnis funktioniert, muss aber nachträglich modernisiert werden.

## Was seine Arbeitsweise von klassischen Team-Workflows unterscheidet

Viele seiner Entscheidungen sind stark auf Solo- oder kleine Teamkontexte optimiert. Das macht den Bericht wertvoll, aber man muss die Übertragbarkeit sauber trennen.

Gut übertragbar sind:

- iteratives Task-Slicing
- klare Verifikationsschritte
- Doku als Kontextsystem
- CLI-first für Kernlogik

Nur eingeschränkt übertragbar sind:

- commit-to-main als Standard
- minimale Prozessformalität
- spontane Priorisierung ohne Backlog-Disziplin

Gerade in größeren Teams steigen die Kosten für fehlende Synchronisation, unklare Ownership und nachträgliche Konsolidierung.

## Was er bewusst nicht priorisiert

Der Originaltext ist auffällig darin, was er **nicht** zentral setzt:

- kein ausgefeiltes Session-Archiv-System
- kein komplexer Issue-Tracker-Workflow für eigene Ideen
- keine starke Abhängigkeit von Slash-Commands

Das ist keine generelle Empfehlung, sondern Ausdruck seiner Optimierungsfunktion: Er priorisiert Flow, kurze Entscheidungswege und direkte Umsetzung über Prozessvollständigkeit.

Für manche Teams ist das unpassend. Für explorative Produktarbeit kann es hingegen genau richtig sein, solange technische Schulden aktiv beobachtet werden.

## Kontextwechsel und Parallelität als Kernkompetenz

Ein roter Faden im Beitrag ist mentale Parallelisierung. Steinberger nutzt Agenten nicht nur für einzelne Tasks, sondern als laufende Arbeitspipelines über mehrere Projekte.

Damit das funktioniert, braucht es drei Dinge:

- klare Trennung der aktiven Problemräume
- schnelle Rückkehr in den jeweiligen Kontext
- robuste „Resume“-Fähigkeit über Doku und Konventionen

Ohne diese Grundlagen wird Parallelität schnell zum Overhead. Mit ihnen wird sie zum Multiplikator.

## Das „Summarize“-Beispiel: Vom CLI zur Extension

Sehr instruktiv ist sein Beispiel rund um ein YouTube-Summarization-Tool. Der Ablauf zeigt sein generelles Build-Muster:

1. Kernfunktionalität als CLI stabilisieren
2. Datenfluss und Qualitätskriterien absichern
3. erst danach UI/Extension aufsetzen

Das Ergebnis ist nicht nur schnelleres Shipping, sondern auch geringeres Risiko: Die kritische Logik ist bereits validiert, bevor die Oberflächenkomplexität dazukommt.

Dieser Ansatz passt besonders gut zu Agenten, weil die frühe CLI-Phase deterministischere Tests erlaubt und UI-Probleme zeitlich nach hinten verschiebt.

## Cross-Project-Transfer als Produktivitätshebel

Ein weiterer Punkt aus dem Original: Steinberger referenziert bewusst Nachbarprojekte, wenn dort ein Pattern schon gelöst ist. Statt Features neu zu „erfinden“, lässt er den Agenten vorhandene Lösungen übertragen und anpassen.

Das funktioniert gut, wenn:

- Projektstrukturen konsistent sind
- changelog/docs gepflegt werden
- Namens- und Modulkonventionen stabil bleiben

Dann wird jeder gelöste Task zur Vorlage für die nächste Umsetzung. Über Zeit entsteht so ein internes Pattern-Netzwerk, das den Prompt-Aufwand senkt.

## Was man aus „Inference-Speed“ strategisch lernen kann

Der Text ist mehr als ein Toolvergleich. Er beschreibt einen Übergang in der Rolle von Entwickler:innen:

- weniger Zeit für Boilerplate-Produktion
- mehr Zeit für Systementscheidungen
- stärkerer Fokus auf Kontextqualität
- höhere Bedeutung von Review-Urteil statt Tippgeschwindigkeit

Damit ändert sich auch die Kompetenzhierarchie im Alltag. Wer gute Agentenführung, präzise Problemzerlegung und Architekturdenken kombiniert, skaliert überproportional.

## Grenzen und Risiken, die man mitdenken sollte

Trotz aller Produktivitätsgewinne bleiben Risiken real:

- „Silent Wrongness“ bei unvollständigem Kontext
- schleichende Architekturdrift durch zu viel lokale Optimierung
- übermäßige Tool-Abhängigkeit ohne Fallback-Kompetenz
- Qualitätsillusion durch schnelles sichtbares Shipping

Steinbergers eigener Text enthält dafür implizit Gegenmaßnahmen: frühes Refactoring, kontinuierliches Gegensteuern und starke persönliche Qualitätsstandards.

## Praktische Takeaways für deinen eigenen Workflow

Wenn du den Artikel in handhabbare Regeln übersetzt, ergeben sich fünf robuste Leitlinien:

1. **CLI-first denken**  
   Starte Systeme als testbare Kernlogik, bevor du dich in UI-Details verlierst.

2. **Aufgaben agentengerecht schneiden**  
   Kleine, klar verifizierbare Schritte erhöhen One-Shot-Rate und senken Korrekturkosten.

3. **Dokumentation als Kontext-API behandeln**  
   Gute `docs/` + klare Instruktionen schlagen nostalgisches Chat-Historie-Suchen.

4. **Modellvergleich am End-to-End-Output messen**  
   Nicht „wer schreibt schneller los“, sondern „wer liefert stabil fertig“.

5. **Architekturzeit bewusst verteidigen**  
   Je günstiger Codeproduktion wird, desto wertvoller wird sauberes Systemdesign.

## Fazit

„Shipping at Inference-Speed“ ist kein Hype-Text über magische Vollautomatisierung. Es ist eher ein Erfahrungsbericht aus der Werkstatt: Modelle sind deutlich besser geworden, aber der echte Produktivitätsgewinn entsteht durch Workflow-Design, Kontextdisziplin und pragmatische Tool-Entscheidungen.

Die stärkste Aussage ist vielleicht diese: Wir bewegen uns in eine Phase, in der „Code schreiben“ zunehmend commoditized wird, während Produkturteil, Architekturfähigkeit und Systemorchestrierung den größten Hebel liefern.

Wer das früh akzeptiert, arbeitet nicht nur schneller, sondern vor allem mit weniger Reibung.
