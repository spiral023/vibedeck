---
title: "Claude Code Best Practices"
description: "Tipps und Muster, um das Beste aus Claude Code herauszuholen – von der Umgebungskonfiguration bis zur Skalierung paralleler Sitzungen."
category: fundamentals
icon: Sparkles
readTime: 15 Min
---

> **Quelle:** Dieser Artikel basiert auf den offiziellen [Anthropic Docs](https://code.claude.com/docs/en/best-practices).

Claude Code ist eine agentische Coding-Umgebung. Anders als ein Chatbot, der nur Fragen beantwortet, kann Claude Code Dateien lesen, Befehle ausführen und Änderungen vornehmen.

Die meisten Best Practices basieren auf einer Einschränkung: **Claudes Kontextfenster füllt sich schnell**, und die Leistung nimmt ab, wenn es voll ist.

## 1. Gib Claude eine Möglichkeit zur Verifizierung

Claude arbeitet deutlich besser, wenn es seine eigene Arbeit überprüfen kann (Tests ausführen, Screenshots vergleichen, Outputs validieren). Ohne klare Erfolgskriterien bist du der einzige Feedback-Loop.

*   **Verifikationskriterien:** Statt "fixe den Bug", sage: "Der Build schlägt mit Fehler X fehl. Fixe ihn und verifiziere, dass der Build erfolgreich durchläuft."
*   **Visuelle Verifizierung:** Nutze die Chrome-Extension, um UI-Änderungen zu prüfen.
*   **Tests:** "Schreibe eine `validateEmail` Funktion. Testfälle: `user@example.com` ist true, `invalid` ist false. Führe die Tests nach der Implementierung aus."

## 2. Erst erforschen, dann planen, dann coden

Lasse Claude nicht sofort loscoden. Nutze den **Plan Mode**, um Recherche und Ausführung zu trennen.

1.  **Explore (Plan Mode):** Claude liest Dateien und beantwortet Fragen.
2.  **Plan (Plan Mode):** Claude erstellt einen detaillierten Implementierungsplan.
3.  **Implement (Normal Mode):** Claude schreibt Code basierend auf dem Plan.
4.  **Commit:** Claude erstellt einen Commit und PR.

> **Tipp:** Bei kleinen Änderungen (Typo, Log-Line) überspringe den Plan.

## 3. Spezifischer Kontext in Prompts

Je präziser deine Anweisungen, desto weniger Korrekturen sind nötig.

*   **Scope:** Nenne spezifische Dateien und Szenarien.
*   **Quellen:** "Durchsuche die Git-History von `Factory.ts`, um zu verstehen, warum die API so ist."
*   **Muster:** "Schau dir `Widget.ts` an und implementiere das neue Widget nach demselben Muster."
*   **Symptome:** Beschreibe das Symptom, die wahrscheinliche Ursache und wie "gefixt" aussieht.

Nutze `@`, um Dateien zu referenzieren, pipe Daten (`cat error.log | claude`) oder paste Bilder.

## 4. Umgebung konfigurieren

### Effektive CLAUDE.md

`CLAUDE.md` gibt Claude persistenten Kontext, den es nicht aus dem Code allein ableiten kann.

*   **Inhalt:** Bash-Befehle, Code-Style-Regeln (die nicht offensichtlich sind), Workflow-Regeln.
*   **Kürze:** Halte sie kurz (< 300 Zeilen). Bloated `CLAUDE.md` führt dazu, dass Claude Anweisungen ignoriert.
*   **Import:** Nutze `@pfad/zu/datei`, um andere Markdown-Dateien einzubinden.

### Permissions & CLI Tools

*   **Permissions:** Nutze `/permissions` für Allow-Lists oder `/sandbox` für Sicherheit ohne nervige Bestätigungen.
*   **CLI Tools:** Installiere Tools wie `gh` (GitHub CLI), damit Claude effizient mit externen Diensten interagieren kann.

### MCP, Hooks & Skills

*   **MCP:** Verbinde Datenbanken, Issue-Tracker etc. via `claude mcp add`.
*   **Hooks:** Garantiere Aktionen (z.B. "Führe ESLint nach jedem Edit aus") via `/hooks`.
*   **Skills:** Erstelle wiederverwendbare Workflows in `.claude/skills/SKILL.md`.

## 5. Effektiv kommunizieren

*   **Stelle Fragen:** Nutze Claude zum Onboarding ("Wie funktioniert das Logging?", "Was macht diese Zeile?").
*   **Interview-Modus:** Lass Claude DICH interviewen, um Specs für neue Features zu erstellen. ("Interviewe mich mit dem `AskUserQuestion` Tool, um eine Spec für Feature X zu erstellen.")

## 6. Session Management

*   **Früh korrigieren:** Nutze `Esc`, um Claude zu stoppen.
*   **Rewind:** `Esc` doppelt drücken oder `/rewind` nutzen, um Fehler rückgängig zu machen.
*   **Kontext managen:** Nutze `/clear` zwischen Aufgaben.
*   **Subagents:** "Nutze Subagents, um X zu untersuchen", um den Hauptkontext sauber zu halten.
*   **Resume:** `claude --resume` um alte Sessions fortzusetzen.

## 7. Automatisieren und Skalieren

*   **Headless Mode:** `claude -p "prompt"` für Scripts und CI.
*   **Parallele Sessions:** Lasse eine Session Tests schreiben, eine andere den Code.
*   **Fan-out:** Iteriere mit einem Script über viele Dateien und starte für jede eine Claude-Instanz.

## Häufige Fehler (Anti-Patterns)

*   **Kitchen Sink Session:** Alles in einer Session -> Kontext voll -> Performance sinkt. **Fix:** `/clear` nutzen.
*   **Over-specified CLAUDE.md:** Zu viele Regeln -> werden ignoriert. **Fix:** Kürzen.
*   **Trust-then-verify Gap:** Code sieht gut aus, funktioniert aber nicht. **Fix:** Immer Tests/Verifikation fordern.
*   **Infinite Exploration:** Claude liest hunderte Dateien. **Fix:** Subagents nutzen oder Scope einschränken.