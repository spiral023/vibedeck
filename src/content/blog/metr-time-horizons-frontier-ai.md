---
title: 'METR Time Horizons Update 2026: TH 1.1, Coding Agents und Messchaos im Alltag'
description: >-
  Seit dem Long-Tasks-Artikel 2025 hat METR Time Horizon 1.1, direkte Claude-Code/Codex-Tests und neue Uplift-Methoden
  veröffentlicht. Die Capabilities steigen, aber Produktivitätsmessung bleibt methodisch schwierig.
type: blog
status: published
category: fundamentals
icon: BrainCircuit
readTime: '6 Min'
readTimeMin: 6
tags:
  - evaluation-benchmarks
  - agenten-engineering
  - modelle-tools
keyPoints:
  - >-
    Mit Time Horizon 1.1 hat METR die Task-Suite auf 228 Aufgaben erweitert, den Long-Task-Anteil mehr als verdoppelt
    und die Infrastruktur auf Inspect umgestellt.
  - >-
    Direkte Bench-Tests zeigen: Claude Code und Codex schlagen METRs bestehende Scaffolds bei den getesteten Setups
    nicht signifikant.
  - >-
    METR arbeitet an neuen Produktivitätsmethoden wie Transcript-Analyse, kämpft aber weiter mit Selection Bias und
    Real-World-Messproblemen.
aliases:
  - 'METR Time Horizons 2026'
  - 'Time Horizon 1.1 Update'
people:
  - '[[METR]]'
topics:
  - '[[Time Horizon 1.1]]'
  - '[[Evaluation]]'
  - '[[Long Tasks]]'
  - '[[Frontier Models]]'
  - '[[Benchmarking]]'
sourceURL: 'https://metr.org/time-horizons/'
sourceType: blog
author: METR
sourceDate: '2026-02-24'
addedDate: '2026-02-25'
slug: 'metr-time-horizons-frontier-ai'
---

Kurzkontext: [[METR]] ordnet die Entwicklung entlang von [[Time Horizon 1.1]] ein.

![Header](/images/blog/metr-time-horizons-frontier-ai/header.png)

Seit dem großen Long-Tasks-Artikel vom **19. März 2025** hat METR aus einer einzelnen Veröffentlichung ein laufendes Messprogramm gemacht. Die letzten Updates sind besonders relevant, wenn du Coding Agents wie Claude Code oder Codex einordnen willst.

Die zentrale Verschiebung: METR veröffentlicht nicht nur neue Horizon-Punkte, sondern auch methodische Nachschärfungen, Negativresultate und Designänderungen bei Produktivitätsstudien.

## 1) Time Horizon 1.1: mehr Aufgaben, mehr Long Tasks, neue Infrastruktur

Am **29. Januar 2026** hat METR **Time Horizon 1.1** vorgestellt. Das ist keine kosmetische Revision, sondern ein substanzielles Upgrade der Eval-Basis.

- Task-Suite von **170 auf 228** Aufgaben erweitert
- **+73 HCAST-Tasks**, **-15 entfernt**, **53 überarbeitet**
- Zahl der Long Tasks (>= 8h Humanzeit) von **14 auf 31** erhöht
- Infrastrukturwechsel von **Vivaria** auf **Inspect** (Open Source vom UK AI Security Institute)

> Der Ausbau des Long-Task-Anteils ist wichtig, weil genau dort die Unsicherheit bisher am größten war.

Damit werden die oberen Bereiche der Kurven statistisch belastbarer, also genau die Zone, in der viele strategische Interpretationen stattfinden.

## 2) Live-Referenz statt "Paper-Snapshot"

Parallel pflegt METR die Seite **Task-Completion Time Horizons of Frontier AI Models** als laufende Referenz (Stand: Februar 2026). Das verändert die Nutzung:

- weniger "ein Chart aus einem PDF"
- mehr kontinuierliches Monitoring über Modellgenerationen
- schnellere Integration methodischer Anpassungen

Für Teams heißt das: eher Trendbeobachtung über Zeit statt Fixierung auf einen Einzelwert.

## 3) Claude Code und Codex schlagen METR-Scaffolds nicht automatisch

Am **13. Februar 2026** hat METR explizit geprüft, ob spezialisierte Coding-Agent-Setups die Horizon-Messung verbessern:

- **Claude Code** vs. ReAct (Opus 4.5)
- **Codex** vs. Triframe (GPT-5)

Ergebnis: **kein signifikanter Vorteil** in diesem Bench-Setup.

Konkrete Kennzahlen aus METRs Notiz:

- Opus 4.5: Claude Code schlägt ReAct in **50,7 %** der Bootstrap-Samples
- GPT-5: Codex schlägt Triframe in **14,5 %** der Bootstrap-Samples

Interpretation: besseres Tooling ist nicht automatisch besseres autonomes Benchmarking. Diese Produkte sind oft auf interaktive Human-in-the-Loop-Nutzung optimiert und übertragen sich nicht 1:1 auf Vollautonomie-Evals.

## 4) Neue Uplift-Schätzung über Transcript-Analyse (17.02.2026)

METR testet zusätzlich einen günstigeren Weg, Produktivitätseffekte von Coding Agents zu schätzen: nicht nur klassische RCTs, sondern Analyse realer Agent-Transkripte.

Prototyp-Datensatz:

- **5305 Claude-Code-Transkripte** aus Januar 2026
- **7 technische METR-Mitarbeitende**

Berichtete Größenordnung:

- geschätzter "time savings factor" von etwa **1,5x bis 13x**

Wichtiger caveat: METR rahmt diese Werte eher als **weiche Obergrenze**. Der reale Uplift dürfte niedriger liegen, unter anderem weil Parallelisierungseffekte (mehrere Agenten gleichzeitig) den Faktor künstlich aufblasen können.

## 5) Produktivitäts-RCTs geraten in Selection-Bias-Probleme

Am **24. Februar 2026** hat METR offen kommuniziert, dass die seit August 2025 laufende Folgestudie zur Dev-Produktivität durch Selection Effects verzerrt wird:

- immer mehr Entwickler wollen nicht mehr ohne AI arbeiten
- dadurch sinkt die Teilnahmebereitschaft für "ohne-AI"-Bedingungen
- die Vergleichbarkeit zwischen Gruppen wird schlechter

METR hält es zwar für plausibel, dass Entwickler Anfang 2026 stärker beschleunigt werden als Anfang 2025, betont aber gleichzeitig, dass die Evidenz wegen Bias derzeit nicht sauber genug ist.

## 6) Warum das Gesamtbild gleichzeitig stark und messy ist

Im Kontext der letzten Monate ergibt sich ein konsistentes, aber unbequemes Bild:

1. **Capabilities steigen** in strukturierbaren, testbaren Aufgabenumgebungen.
2. **Produktivitätswirkung im Alltag** bleibt methodisch schwer sauber zu identifizieren.
3. **Scaffolds, Tooling und Interaktionsmodus** (autonom vs. human-in-loop) beeinflussen Messresultate massiv.

Das passt auch zur älteren METR-Linie:

- RCT von Juli 2025 mit erfahrenen OSS-Entwicklern zeigte im damaligen Tool-Setup einen durchschnittlichen Slowdown.
- Danach folgten methodische Arbeiten zur Versöhnung von "wachsenden Horizons" und "messbarer Produktivität".
- Zusätzlich wurde untersucht, wie stark Horizons je Domäne variieren.

## Was du als Builder daraus mitnehmen solltest

Wenn du Agentensysteme bewertest oder einkaufst, nimm aus den METR-Updates vor allem diese drei Punkte mit:

- **Trenne Capability-Signal von Workplace-Uplift.**  
  Ein höherer Horizon-Wert ist nicht automatisch gleichbedeutend mit höherer Team-Produktivität.

- **Teste Scaffolds gegen deine echte Arbeitsweise.**  
  Ein Setup, das in interaktiven Flows glänzt, muss nicht im autonomen Batch-Benchmark gewinnen.

- **Rechne mit Messrauschen in realen Umgebungen.**  
  Concurrency, Auswahlverzerrungen und Prozessänderungen können Effekte stark verzerren.

## Fazit

Seit März 2025 hat METR sein Time-Horizon-Programm deutlich professionalisiert: **TH 1.1**, eine laufend gepflegte Referenzseite, explizite Scaffold-Vergleiche (inklusive Nullresultate) und neue Uplift-Methodik über Transkripte.

Das Netto-Signal ist klar: Die technischen Fähigkeiten steigen, aber der Nachweis stabiler Real-World-Produktivitätsgewinne bleibt ein methodisch hartes Problem. Genau diese Kombination macht die aktuellen METR-Updates so wertvoll.

## Quellen

- [Time Horizon 1.1 (29.01.2026)](https://metr.org/blog/2026-1-29-time-horizon-1-1/)
- [Task-Completion Time Horizons of Frontier AI Models](https://metr.org/time-horizons/)
- [Measuring Time Horizon using Claude Code and Codex (13.02.2026)](https://metr.org/notes/2026-02-13-measuring-time-horizon-using-claude-code-and-codex/)
- [Exploratory transcript analysis for coding-agent time savings (17.02.2026)](https://metr.org/notes/2026-02-17-exploratory-transcript-analysis-for-estimating-time-savings-from-coding-agents/)
- [We are Changing our Developer Productivity Experiment Design (24.02.2026)](https://metr.org/blog/2026-02-24-uplift-update/)
- [Early-2025 AI and experienced OSS developer productivity (10.07.2025)](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)
- [Reconciling slowdown with time horizons (12.08.2025)](https://metr.org/blog/2025-08-12-research-update-towards-reconciling-slowdown-with-time-horizons/)
- [How time horizon varies across domains (14.07.2025)](https://metr.org/blog/2025-07-14-how-does-time-horizon-vary-across-domains/)

## Verbindungen

- [[METR]]
- [[Time Horizon 1.1]]
- [[Evaluation]]
- [[Long Tasks]]
- [[Frontier Models]]
- [[Benchmarking]]

