---
title: Best Practices für Claude Code
description: >-
  Tipps und Muster, um das Beste aus Claude Code herauszuholen – von der
  Konfiguration der Umgebung bis hin zur Skalierung über parallele Sessions.
type: source
status: seed
category: fundamentals
icon: Rocket
readTime: 6
tags:
  - tooling/claude-code
  - best-practices
  - workflows
  - docs
aliases:
  - "Claude Code Best Practices"
topics:
  - "[[Context Window]]"
  - "[[Plan Mode]]"
  - "[[CLAUDE.md]]"
  - "[[Verification Criteria]]"
up: "[[Claude Code]]"
sourceURL: "https://code.claude.com/docs/en/best-practices"
sourceType: "docs"
author: "Anthropic Docs"
level: intermediate
addedDate: "2026-02-01"
---

Claude Code ist eine agentenbasierte Coding-Umgebung. Im Gegensatz zu einem Chatbot, der Fragen beantwortet und wartet, kann Claude Code deine Dateien lesen, Befehle ausführen, Änderungen vornehmen und autonom an Problemen arbeiten, während du zuschaust, korrigierst oder dich ganz zurückziehst.

Dies ändert deine Arbeitsweise: Anstatt Code selbst zu schreiben und Claude um Review zu bitten, beschreibst du, was du willst, und Claude findet heraus, wie es gebaut wird.

## Das Kontext-Fenster: Deine wichtigste Ressource

Die meisten Best Practices basieren auf einer Einschränkung: Claudes Kontext-Fenster füllt sich schnell, und die Performance sinkt, wenn es voll ist. Es enthält die gesamte Konversation, alle gelesenen Dateien und Befehlsausgaben. Ein voller Kontext führt dazu, dass Claude Anweisungen "vergisst" oder mehr Fehler macht.

## Gib Claude Möglichkeiten, seine Arbeit zu prüfen

> **Tipp:** Integriere Tests, Screenshots oder erwartete Ausgaben, damit Claude sich selbst prüfen kann. Dies ist der effektivste Hebel für gute Ergebnisse.

Claude arbeitet drastisch besser, wenn er seinen eigenen Erfolg validieren kann.

| Strategie | Schlechtes Beispiel | Gutes Beispiel |
| :--- | :--- | :--- |
| **Verifikationskriterien angeben** | "implementiere eine Funktion zur E-Mail-Validierung" | "schreibe eine `validateEmail` Funktion. Testfälle: `user@example.com` ist true, `invalid` ist false. Führe die Tests nach der Implementierung aus." |
| **UI-Änderungen visuell prüfen** | "mache das Dashboard schöner" | "[Screenshot einfügen] implementiere dieses Design. Erstelle einen Screenshot des Ergebnisses und vergleiche ihn mit dem Original. Liste Unterschiede auf und behebe sie." |
| **Ursachen statt Symptome beheben** | "der Build schlägt fehl" | "der Build schlägt mit diesem Fehler fehl: [Error einfügen]. Behebe ihn und verifiziere den Erfolg. Behandle die Ursache, unterdrücke nicht den Fehler." |

## Erst erkunden, dann planen, dann coden

Lasse Claude nicht sofort loslegen. Nutze den **Plan Mode**, um Recherche von der Ausführung zu trennen.

1.  **Erkunden (Explore):** Claude liest Dateien und versteht den Kontext (z.B. "verstehe, wie wir Sessions handhaben").
2.  **Planen (Plan):** Fordere einen detaillierten Implementierungsplan an. (Nutze `Ctrl+G`, um den Plan im Editor zu verfeinern).
3.  **Implementieren (Implement):** Wechsle in den Normal Mode und lass Claude den Plan abarbeiten.
4.  **Commit:** Lass Claude eine aussagekräftige Commit-Nachricht schreiben und eine PR erstellen.

## Spezifischen Kontext in Prompts liefern

Je präziser deine Anweisungen, desto weniger Korrekturen sind nötig. Referenziere Dateien mit `@`, erwähne Constraints und zeige Beispiel-Patterns.

*   **Scope definieren:** "schreibe einen Test für `foo.py` für den Logout-Fall. Vermeide Mocks."
*   **Quellen angeben:** "nutze die Git-Historie von `ExecutionFactory`, um zu verstehen, warum die API so aufgebaut ist."
*   **Patterns referenzieren:** "schau dir `HotDogWidget.php` als Vorlage für das neue Widget an."

## Erstelle eine effektive CLAUDE.md

Nutze `/init`, um eine Starter-Datei zu erstellen. **CLAUDE.md** wird bei jeder Session geladen und sollte Projektkonventionen enthalten, die Claude nicht allein aus dem Code ableiten kann.

*   **Beinhaltet:** Spezielle Bash-Befehle, Coding-Styles (z.B. ES-Module statt CommonJS), Test-Setups.
*   **Ausschließen:** Dinge, die Claude selbst lesen kann, Standard-Konventionen der Sprache, lange Tutorials.
*   **Pruning:** Halte die Datei kurz. Wenn sie zu lang wird, gehen Regeln verloren.

## Nutze CLI-Tools und MCP-Server

*   **CLI-Tools:** Installiere Tools wie `gh` (GitHub), `aws` oder `gcloud`. Claude kann diese nutzen, um PRs zu erstellen, Issues zu lesen oder Infrastruktur zu verwalten.
*   **MCP-Server:** Nutze `claude mcp add`, um Tools wie Notion, Figma oder Datenbanken direkt anzubinden.

## Session-Management

*   **Früh korrigieren:** Nutze `Esc`, um Claude zu stoppen, wenn er in die falsche Richtung läuft.
*   **Rewind:** Nutze `/rewind` oder `Esc + Esc`, um zu Checkpoints zurückzukehren.
*   **Clear:** Nutze `/clear`, um den Kontext zwischen völlig unzusammenhängenden Aufgaben zu leeren.
*   **Fortsetzen:** Nutze `claude --continue` oder `--resume`, um an alten Konversationen weiterzuarbeiten.

## Automatisieren und Skalieren

*   **Headless Mode:** Nutze `claude -p "prompt"` in CI-Pipelines oder Scripts.
*   **Parallele Sessions:** Nutze mehrere Sessions für Writer/Reviewer Patterns (eine Session schreibt Code, die andere prüft ihn unvoreingenommen).
*   **Fan-out:** Verteile große Migrationen über Schleifen auf viele parallele Claude-Invocations.

## Häufige Fehler vermeiden

*   **Die "Kitchen Sink" Session:** Zu viele verschiedene Aufgaben in einer Session -> Kontextmüll. **Fix:** `/clear`.
*   **Endlose Korrekturen:** Claude macht denselben Fehler immer wieder. **Fix:** `/clear` und einen besseren Initial-Prompt schreiben.
*   **Die überladene CLAUDE.md:** Wichtige Regeln gehen im Rauschen unter. **Fix:** Radikal kürzen.
*   **Infinite Exploration:** Claude liest hunderte Dateien ohne Ziel. **Fix:** Scope eng fassen oder Subagents für die Recherche nutzen.

## Verbindungen
- [[Context Window]]
- [[Plan Mode]]
- [[CLAUDE.md]]
- [[Verification Criteria]]
- [[MCP]]
- [[Parallele Sessions]]
- [[Claude Code]]
- [[Session Management]]
