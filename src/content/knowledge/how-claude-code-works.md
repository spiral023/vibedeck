---
title: How Claude Code works
description: >-
  Verstehe den agentischen Loop, die eingebauten Tools und wie Claude Code mit
  deinem Projekt interagiert.
category: fundamentals
icon: Cpu
readTime: 4 Min
tags: ["claude-code", "agents", "tooling", "docs"]
sourceURL: "https://code.claude.com/docs/en/how-claude-code-works"
sourceType: "docs"
author: "Anthropic Docs"
---

Claude Code ist ein agentischer Assistent, der in deinem Terminal läuft. Er kann nicht nur Code schreiben, sondern auch bei allem helfen, was du von der Kommandozeile aus tun kannst: Dokumentation schreiben, Builds ausführen, Dateien suchen, recherchieren und mehr.

## Der agentische Loop

Wenn du Claude eine Aufgabe gibst, durchläuft es drei Phasen: **Kontext sammeln**, **Aktion ausführen** und **Ergebnisse verifizieren**.

![The agentic loop](https://mintcdn.com/claude-code/ELkJZG54dIaeldDC/images/agentic-loop.svg)

1.  **Gather Context:** Claude liest Dateien, sucht nach Code oder führt Befehle aus, um die Situation zu verstehen.
2.  **Take Action:** Claude bearbeitet Dateien, führt Tests aus oder recherchiert im Web.
3.  **Verify Results:** Claude prüft, ob die Aktion erfolgreich war (z.B. durch Ausführen von Tests).

Dieser Loop wiederholt sich, bis die Aufgabe erledigt ist. Du kannst jederzeit eingreifen ("Interrupt"), um Claude in eine andere Richtung zu lenken.

### Modelle & Tools

*   **Modelle:** Claude Code nutzt Claude-Modelle (Sonnet für die meisten Aufgaben, Opus für komplexe Architektur), um Code zu verstehen und Aufgaben zu planen.
*   **Tools:** Tools machen Claude agentisch. Ohne sie könnte es nur Text antworten.
    *   **File operations:** Lesen, Schreiben, Erstellen von Dateien.
    *   **Search:** Suchen nach Dateien und Inhalten (grep).
    *   **Execution:** Ausführen von Shell-Befehlen, Tests, Git.
    *   **Web:** Websuche, Dokumentation abrufen.
    *   **Code Intelligence:** Typfehler sehen, "Go to Definition" (mit Plugins).

## Worauf Claude zugreifen kann

Wenn du `claude` in einem Verzeichnis ausführst, hat es Zugriff auf:

*   **Dein Projekt:** Alle Dateien im Verzeichnis (und Unterverzeichnissen).
*   **Dein Terminal:** Jeder Befehl, den du ausführen kannst (`npm`, `git`, `docker`, etc.).
*   **Deinen Git-Status:** Aktueller Branch, uncommitted Changes.
*   **Deine [CLAUDE.md](/knowledge/writing-a-good-claude-md):** Projekt-Konventionen und Kontext.
*   **Erweiterungen:** MCP-Server, Skills, Subagents.

Da Claude dein gesamtes Projekt "sieht", kann es dateiübergreifende Änderungen vornehmen und komplexe Refactorings durchführen.

## Mit Sessions arbeiten

Claude Code speichert deine Konversation lokal.

*   **Sessions sind ephemer:** Jede neue Session startet frisch (außer Kontext aus `CLAUDE.md`).
*   **Branch-übergreifend:** Eine Session ist an das Verzeichnis gebunden. Wenn du den Branch wechselst, sieht Claude die neuen Dateien, behält aber den Verlauf.
*   **Resume:** Mit `claude --continue` oder `claude --resume` kannst du alte Sessions fortsetzen.
*   **Fork:** Mit `claude --fork-session` kannst du einen neuen Zweig einer Unterhaltung starten, ohne das Original zu ändern.

### Das Kontext-Fenster

Claudes Kontext-Fenster enthält den Verlauf, Dateiinhalte, Befehlsausgaben und geladene Skills.

*   **Compaction:** Wenn der Kontext voll wird, fasst Claude ältere Teile zusammen.
*   **Kosten:** MCP-Tools und Skills verbrauchen Kontext. Nutze `/context`, um den Verbrauch zu sehen.

## Sicherheit: Checkpoints & Permissions

*   **Checkpoints:** Jede Dateiänderung wird gesichert. Mit `Esc` (doppelt) oder `/rewind` kannst du Änderungen rückgängig machen.
*   **Permissions:** Du kontrollierst, was Claude darf.
    *   **Default:** Fragt vor Edits und Shell-Befehlen.
    *   **Auto-accept (`Shift+Tab`):** Edits ohne Fragen, Befehle mit Fragen.
    *   **Plan mode:** Nur Read-Only, erstellt einen Plan vor der Ausführung.

## Effektiv arbeiten

*   **Frag Claude:** "how do I set up hooks?"
*   **Interagiere:** Es ist ein Gespräch. Korrigiere Claude, wenn es falsch liegt.
*   **Sei spezifisch:** Nenne Dateien und Pfade.
*   **Verifikation:** Gib Testfälle oder Screenshots an.
*   **Explore first:** Nutze den Plan Mode für komplexe Aufgaben.
