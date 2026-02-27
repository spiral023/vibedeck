---
title: "Karpathy: Seit Dezember ist Softwareentwicklung nicht mehr Business as Usual"
description: "Andrej Karpathy beschreibt im Februar 2026 einen abrupten Shift: Seit Dezember funktionieren Coding-Agenten für lange Aufgaben zuverlässig. Sein Praxisbeispiel zeigt, wie ein früheres Wochenendprojekt heute in rund 30 Minuten läuft."
category: workflows
icon: BrainCircuit
readTime: 4 Min
tags: ["andrej-karpathy", "agentic-engineering", "coding-agents", "orchestration", "developer-workflow"]
keyPoints:
  - "Karpathy sieht keinen langsamen Trend, sondern einen harten Kipppunkt seit Dezember 2025: Coding-Agenten sind plötzlich für lange Aufgaben verlässlich genug."
  - "In seinem DGX-Spark-Beispiel erledigte ein Agent Setup, Benchmarking, API, UI, Debugging und Service-Betrieb in etwa 30 Minuten ohne manuelle Eingriffe."
  - "Die zentrale Kompetenz verschiebt sich vom Tippen im Editor hin zu Task-Decomposition, Agent-Orchestrierung, Review und Verifikation."
sourceURL: "https://x.com/karpathy/status/2026731645169185220"
sourceType: tweet
author: "Andrej Karpathy"
sourceDate: "2026-02-25"
---

Andrej Karpathy beschreibt in seinem Post vom 25. Februar 2026 einen Bruch, nicht bloß eine graduelle Verbesserung: Programmieren habe sich in den letzten zwei Monaten drastisch verändert, mit einem klaren Kipppunkt im Dezember.

Seine These ist deutlich: Vor Dezember funktionierten Coding-Agenten in der Praxis oft nicht robust genug. Seitdem liefern sie bei vielen größeren Aufgaben spürbar stabiler, kohärenter und ausdauernder.

> „programming is becoming unrecognizable“

## Der konkrete Praxisfall: 30 Minuten statt Wochenendprojekt

Karpathy nennt ein sehr praktisches Beispiel aus dem Wochenende: Er wollte ein lokales Video-Analyse-Dashboard für seine Heimkameras aufsetzen und gab dem Agenten eine lange End-to-End-Aufgabe.

Der Auftrag umfasste unter anderem:

- Login auf einer DGX Spark über lokale IP mit Credentials,
- SSH-Keys einrichten,
- vLLM installieren,
- Qwen3-VL herunterladen und benchmarken,
- Server-Endpoint für Video-Inference bauen,
- eine einfache Web-UI bereitstellen,
- Tests und Debugging durchführen,
- alles per `systemd` als Service stabil betreiben,
- Memory-Notes und einen Markdown-Report erzeugen.

Laut Karpathy arbeitete der Agent rund 30 Minuten autonom, löste mehrere Probleme selbstständig durch Recherche, korrigierte Fehler und lieferte am Ende ein funktionsfähiges Ergebnis mit Dokumentation zurück.

Für ihn ist genau das der Punkt: Was vor drei Monaten noch ein ganzes Wochenendprojekt gewesen wäre, wird nun zu einem delegierbaren Lauf, den man startet und später überprüft.

## Was sich an der Entwicklerrolle verschiebt

Karpathy beschreibt damit keinen „No-Engineer“-Zustand, sondern einen Interface-Wechsel:

- weniger Code manuell in den Editor tippen,
- mehr Aufgaben in natürlicher Sprache formulieren,
- mehrere Agentenläufe parallel steuern,
- Ergebnisse reviewen, validieren und nachschärfen.

Der höchste Hebel liegt aus seiner Sicht in einer besseren Abstraktionsschicht: langfristig laufende Orchestrator-Setups mit passenden Tools, Memory und Instruktionen, die mehrere Code-Instanzen produktiv koordinieren.

> Der Engpass wandert vom Tippen zur intelligenten Orchestrierung.

## Grenzen: Es ist stark, aber nicht autopilot-fähig

Karpathy betont klar, dass das System nicht perfekt ist. Es braucht weiterhin:

- High-Level-Entscheidungen,
- Urteilskraft und Geschmack,
- Aufsicht und Iteration,
- gutes Zerlegen von Aufgaben in delegierbare Teile.

Besonders gut funktioniert der Ansatz dort, wo Anforderungen klar spezifiziert sind und Ergebnisse zuverlässig verifiziert oder getestet werden können.

Das ist ein wichtiger Punkt für Teams: Der Erfolg hängt nicht nur am Modell, sondern stark an präziser Task-Decomposition und an belastbaren Verifikationsschritten.

## Warum das kein „Business as usual“ mehr ist

Karpathys Einordnung ist eindeutig: Softwareentwicklung befindet sich bereits in einer neuen Betriebslogik.

Nicht weil jeder Task vollautomatisch gelöst wird, sondern weil sich der Default-Workflow verschiebt:

1. Zielzustand definieren,
2. Agentenläufe orchestrieren,
3. Outputs parallel überprüfen,
4. kritische Entscheidungen weiter menschlich treffen.

Für produktive Teams heißt das konkret: Wer Orchestrierung, Verifikation und saubere Übergaben beherrscht, gewinnt aktuell deutlich mehr Hebel als durch reine Tippgeschwindigkeit.

## Fazit

Der Post markiert einen zeitlichen Marker für viele Engineering-Teams: Dezember 2025 als operativer Kipppunkt, an dem Coding-Agenten von „interessant, aber unzuverlässig“ zu „disruptiv nützlich im Alltag“ gewechselt sind.

Die Arbeit verschwindet nicht, sie verlagert sich. Weniger manuelle Ausführung, mehr Steuerung von agentischen Systemen. Genau darin liegt laut Karpathy der neue Produktivitätsgewinn.

