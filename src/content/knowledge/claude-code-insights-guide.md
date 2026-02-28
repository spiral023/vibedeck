---
title: "Claude Code /insights: Der Befehl, der deinen KI-Workflow spiegelt"
description: "Erfahre, wie der Befehl /insights tausende deiner Nachrichten analysiert, blinde Flecken in deinem Workflow aufdeckt und maßgeschneiderte autonome Agenten für dich entwirft."
type: source
status: seed
category: workflows
icon: BrainCircuit
readTime: 12
tags:
  - tooling/claude-code
  - insights
  - workflow-optimization
  - ai-agents
  - automation
aliases:
  - "Claude Code /insights Guide"
topics:
  - "[[/insights Command]]"
  - "[[Workflow Diagnosis]]"
  - "[[Autonomous Agents]]"
  - "[[Self-Improving Skills]]"
up: "[[Claude Code]]"
sourceURL: "https://x.com/tomcrawshaw01/status/2020866308230009189"
sourceType: "thread"
author: "Tom Crawshaw"
sourceDate: "2026-02-09"
addedDate: "2026-02-26"
---

![Claude Code Insights Header](/images/knowledge/claude-code-insights-guide/header.jpg)

> "Ich habe einen Befehl getippt und eine vollständige Performance-Review meines KI-Workflows erhalten. Claude Code hat mir alles gesagt, was ich falsch mache – und dann drei Agenten gebaut, um es zu beheben." — Tom Crawshaw

Die meisten Menschen nutzen KI-Tools ohne Feedback-Schleife. Du öffnest das Fenster, tippst Prompts, bekommst Ergebnisse und schließt es wieder. Aber wo verlierst du Zeit? Was sind deine häufigsten Muster? Ohne Daten raten wir nur. Der Befehl `/insights` in Claude Code ändert das radikal.

## Was passiert bei /insights?

Als Tom Crawshaw `/insights` tippte, analysierte das Tool **2.555 Nachrichten aus 318 Sessions** der letzten 30 Tage. Das Ergebnis war kein einfaches Dashboard, sondern ein tiefgehender Diagnosebericht über seine Arbeitsweise.

Der Bericht gliedert sich in mehrere Phasen:
- **At A Glance**: Ein Schnappschuss dessen, was funktioniert und wo Reibung entsteht.
- **What You Work On**: Kategorisierung der Sessions (z.B. Content Creation vs. API-Integration).
- **How You Use Claude Code**: Analyse des Kommunikationsstils, der Delegationsmuster und ob man zum Micro-Management neigt.

---

## Blinde Flecken aufdecken: Wo Zeit verloren geht

Oft merken wir nicht, wie wir uns selbst im Weg stehen. Der Bericht deckte drei kritische Reibungspunkte auf:

### 1. Ambivalente Projekt-Referenzen
Ein klassischer Fehler: *"Füge das zum Skill hinzu."* Claude rennt los, aber zum falschen Projekt. Solche ungenauen Anweisungen waren die häufigste Quelle für unnötiges Hin-und-Her.

### 2. Das "Fast Fertig" Muster
Von 90 analysierten Sessions endeten **91% im Status "größtenteils erreicht"**, aber nur wenige im Status "vollständig abgeschlossen". Der Grund: Mangelnde Präzision bei der Definition von "Done". Claude erledigte den technischen Teil, übersah aber den finalen Schliff.

### 3. Hoher Exploration-Overhead
Mit über 7.700 Bash-Befehlen in einem Monat war die Bash-Nutzung 4x höher als die Dateibearbeitung. Das signalisierte, dass Claude zu viel Zeit damit verbrachte, die Codebase zu erkunden (`ls`, `grep`, `cat`), anstatt Änderungen vorzunehmen. Es fehlte an anfänglichem Kontext.

---

## Die Lösung: Quick Wins in Minuten

Der Bericht lieferte direkt kopierbare Fixes:

- **CLAUDE.md Ergänzungen**: Drei Zeilen Kontext für die Projektdatei, damit Claude sofort weiß, wo welche Skills und Templates liegen.
- **Custom Slash Commands**: Häufige Workflows (wie Voice-Analyse) wurden in eigene `/commands` umgewandelt, die den nötigen Kontext bereits fest integriert haben.
- **MCP Server**: Vorschlag, einen Twitter-MCP zu nutzen, um das manuelle Jonglieren mit API-Keys zu beenden.

---

## Die Zukunft: Maßgeschneiderte autonome Agenten

Besonders beeindruckend: Basierend auf den individuellen Nutzungsmustern entwarf der Bericht drei spezifische autonome Agenten:

### Agent 1: Autonomous Content Voice Research
Dieser Agent aktualisiert wöchentlich das Brand-Voice-Profil, indem er die neuesten Top-Performer-Posts analysiert und linguistische Muster extrahiert – völlig ohne manuellen Anstoß.

### Agent 2: Self-Improving Skills
Ein Agent, der bestehende Skills nimmt, Test-Szenarien generiert, Schwachstellen identifiziert und die Prompts im Skill-File so lange optimiert, bis alle Tests bestehen. Deine Tools werden besser, während du schläfst.

### Agent 3: Parallel Documentation Workers
Ein Koordinator-Agent, der mehrere Claude-Instanzen spawnt, um gleichzeitig verschiedene API-Endpunkte oder Skills zu dokumentieren, inklusive Beispielen und Edge Cases.

---

## Fazit: Feedback ist der entscheidende Vorteil

Der Unterschied zwischen dem bloßen Benutzen eines KI-Tools und dem Betreiben eines KI-Systems ist **Feedback**. In einer Welt voller KI-Tools werden diejenigen gewinnen, die wissen, wie ihre Systeme performen und wo die Reibungspunkte liegen.

Ein Befehl genügt: `/insights`.

*Quelle: Basierend auf einem Thread von [Tom Crawshaw](https://x.com/tomcrawshaw01) auf X.*

## Verbindungen
- [[/insights Command]]
- [[Workflow Diagnosis]]
- [[Autonomous Agents]]
- [[Self-Improving Skills]]
- [[CLAUDE.md]]
- [[Slash Commands]]
- [[MCP]]
- [[Claude Code]]
- [[Token Efficiency]]
- [[Workflow Optimization]]
