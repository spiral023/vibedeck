---
title: "Was ich aus 500k+ Zeilen Claude Code gelernt habe"
description: "Erkenntnisse und Best Practices eines Power-Users, der innerhalb von 90 Tagen über eine halbe Million Zeilen Code mit Claude Code geschrieben hat."
category: workflows
icon: Layers
readTime: 4 Min
tags: ["claude-code", "monorepo", "tdd", "mcp", "context-management"]
sourceURL: "https://www.reddit.com/r/ClaudeCode/comments/1id7vzv/what_i_learned_from_writing_500k_lines_with/"
sourceType: "thread"
author: "dhruv1103"
sourceDate: "2026-01-12"
addedDate: "2026-02-05"
level: advanced
---

> **Hinweis**: Dieser Artikel basiert auf einem [Reddit-Thread von dhruv1103](https://www.reddit.com/r/ClaudeCode/comments/1id7vzv/what_i_learned_from_writing_500k_lines_with/) aus dem Subreddit r/ClaudeCode.

Der Autor hat in den letzten 90 Tagen über 500.000 Zeilen Code mit Claude Code geschrieben. Hier sind die wichtigsten Lektionen für effizientes AI-gestütztes Engineering auf Skala.

## Architektur & Kontext-Management

### Nutze ein Monorepo
Ein Monorepo ist entscheidend für das Context Management. Es erlaubt Claude, die Zusammenhänge zwischen verschiedenen Teilen des Systems besser zu verstehen.

### Modulares Routing
Ordne Frontend-Features explizit Deinen Backend-Funktionen zu. Kategorisiere API-Routes nach Funktionalität und lege sie in separaten Dateien ab. Dies minimiert die "Context Pollution" (Verschmutzung des Kontextfensters).

### Bewährte Stacks verwenden
Nutze populäre Stacks und Bibliotheken (z.B. React, FastAPI, Python) in stabilen, etwas älteren Versionen. LLMs machen deutlich weniger Fehler, wenn sie auf Code basieren, der massenhaft in ihren Trainingsdaten vorkommt.

## Automatisierung & Skills

### SKILL-Dateien für Architektur-Module
Sobald Dein Code ausreichend modularisiert ist, erstelle `SKILL`-Dateien. Diese sollten erklären, wie jedes "Modul" Deiner Architektur implementiert wird (z.B. ein Skill für das Erstellen einer neuen modularen API-Route).

### Datei-Header für die Navigation
Instruiere Claude in Deiner `CLAUDE.md`, am Anfang jeder neuen Datei einen prägnanten Kommentar einzufügen, der den Zweck der Datei erklärt. Das hilft Claude enorm dabei, sich in frischen Sitzungen autonom in Deiner Codebase zurechtzufinden.

## Debugging & Tests

### Datenbank-Zugriff via MCP
Nutze eine MCP-Verbindung, die Claude Read-Only-Zugriff auf Deine Datenbank gewährt. Dies ermöglicht es dem Agenten, Fehler autonom zu diagnostizieren.

### Test Driven Development (TDD)
Nutze TDD, wo immer es möglich ist. Füge für jedes neue Feature Unit-Tests hinzu und lasse diese via GitHub Actions bei jedem Pull Request laufen. Der Autor empfiehlt **Testcontainers**, um Tests gegen einen echten (Dummy-)Postgres-Container zu validieren.

## Workflow-Optimierung

### Log-Analyse mit tmux
Lasse Dein Frontend und Backend in einem **tmux**-Session laufen. So kann Claude bei Bedarf einfach die Logs mit `tail` verfolgen (konfiguriere dies ebenfalls in Deiner `CLAUDE.md`).

### Parallelisierung via Worktrees
Wenn Du mit den obigen Schritten vertraut bist, nutze mehrere `git worktrees` und lasse Agenten parallel arbeiten (oft 3-4 Sitzungen gleichzeitig).

## Fazit: "Vibe Reviewing" statt "Vibe Coding"
Der wichtigste Punkt: Vergiss niemals, den generierten Code gründlich zu reviewen. 

> "Vibe Reviewing beschreibt den Prozess besser als Vibe Coding. Es ist kritisch, die gesamte Codebase auf der Abstraktionsebene von Funktionen zu kennen. Du solltest zumindest wissen, wo jede Funktion lebt und in welcher Datei sie sich befindet."
