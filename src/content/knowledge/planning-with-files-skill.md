---
title: "Planning with files: Der 'Cheat Code' für Claude Code"
description: "Ein Deep Dive in den Planning-with-files Skill, der durch persistente Dateien für eine präzisere Planung und Ausführung sorgt."
category: tooling
icon: FileText
readTime: 2 Min
tags: ["claude-code", "skills", "planning", "workflow"]
sourceURL: "https://x.com/anthonyriera/status/2018221220160827828"
sourceType: "tweet"
author: "Anthony Riera"
sourceDate: "2026-02-02"
level: advanced
---

![Planning with files GitHub Preview](/images/knowledge/planning-with-files-skill/header.jpg)

In der Welt der Claude Code Skills gibt es einen Skill, der laut Experten alle anderen in den Schatten stellt: **"Planning with files"**. Dieser Skill wird oft als "Cheat Code" bezeichnet, da er selbst komplizierte Features in 99% der Fälle beim ersten Versuch korrekt umsetzt.

## Was ist "Planning with files"?

Normalerweise nutzt Claude den Plan-Modus, um Aufgaben zu strukturieren. Der Skill "Planning with files" geht jedoch einen Schritt weiter, indem er den Planungsprozess in drei dedizierten Dateien protokolliert und während der gesamten Ausführung darauf zurückgreift:

1.  `task_plan.md`: Der detaillierte Schlachtplan für die Aufgabe.
2.  `findings.md`: Erkenntnisse und wichtige Informationen, die während der Analyse gesammelt wurden.
3.  `progress.md`: Ein Tracker für den aktuellen Fortschritt der Umsetzung.

## Warum ist dieser Skill so effektiv?

Im Gegensatz zum Standard-Plan-Modus kehrt Claude bei diesem Workflow **kontinuierlich** zu diesen Dateien zurück. Dadurch erhält die KI eine ständige Erinnerung daran, was getan werden muss und wie es umgesetzt werden soll.

> Der sogenannte "Drift" (das Abweichen vom ursprünglichen Ziel während langer Sessions) wird fast vollständig eliminiert. Der Plan wird perfekt befolgt.

Zwar verbraucht dieser Ansatz mehr Tokens, da die Dateien immer wieder gelesen werden müssen, aber die Zuverlässigkeit und Präzision beim ersten Versuch machen diesen Nachteil mehr als wett.

## Installation und Nutzung

Du kannst den Skill ganz einfach zu Deiner Claude Code Umgebung hinzufügen:

```bash
npx skills add https://github.com/othmanadi/planning-with-files --skill planning-with-files
```

Sobald der Skill installiert ist, reicht es aus, in einem Prompt einfach **"Plan with files"** zu erwähnen. Claude erkennt den Skill automatisch und beginnt mit der Erstellung der drei Dateien, um Deine Aufgabe strukturiert abzuarbeiten.

## Fazit

Wenn Du komplexe Refactorings oder Feature-Implementierungen mit Claude Code durchführst, ist "Planning with files" ein unverzichtbares Werkzeug. Es verwandelt Claude von einem fähigen Assistenten in einen methodischen Ingenieur, der den Überblick behält.
