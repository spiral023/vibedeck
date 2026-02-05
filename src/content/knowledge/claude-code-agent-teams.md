---
title: "Claude Code: Agent Teams orchestrieren"
description: "Koordiniere mehrere Claude Code Instanzen als Team mit gemeinsamen Aufgaben, Inter-Agent-Messaging und zentraler Verwaltung."
category: workflows
icon: Layers
readTime: 9 Min
tags: ["claude-code", "agent-teams", "parallel-coding", "orchestration"]
sourceURL: "https://code.claude.com/docs/en/agent-teams"
sourceType: "docs"
author: "Anthropic"
sourceDate: "2026-02-06"
---

> ⚠️ **Experimentelles Feature:** Agent Teams sind experimentell und standardmäßig deaktiviert. Aktiviere sie, indem Du `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` zu Deiner `settings.json` oder Deinem Environment hinzufügst.

Mit Agent Teams kannst Du mehrere Claude Code Instanzen koordinieren, die zusammenarbeiten. Eine Session fungiert als **Team Lead**, koordiniert die Arbeit, weist Aufgaben zu und fasst Ergebnisse zusammen. Die **Teammates** arbeiten unabhängig in ihrem eigenen **Context Window** und kommunizieren direkt miteinander.

Im Gegensatz zu **Subagents**, die innerhalb einer einzelnen Session laufen und nur an den Hauptagenten berichten können, kannst Du mit einzelnen Teammates direkt interagieren, ohne über den Lead gehen zu müssen.

## Wann man Agent Teams einsetzt

Agent Teams sind am effektivsten für Aufgaben, bei denen parallele Exploration echten Mehrwert bietet:

*   **Research und Review:** Mehrere Teammates können verschiedene Aspekte eines Problems gleichzeitig untersuchen.
*   **Neue Module oder Features:** Teammates können jeweils ein separates Stück übernehmen, ohne sich gegenseitig in die Quere zu kommen.
*   **Debugging mit konkurrierenden Hypothesen:** Teammates testen verschiedene Theorien parallel.
*   **Layer-übergreifende Koordination:** Änderungen, die Frontend, Backend und Tests umspannen.

## Vergleich mit Subagents

| Feature | Subagents | Agent Teams |
| :--- | :--- | :--- |
| **Context** | Eigenes Context Window; Ergebnisse gehen an den Caller zurück | Eigenes Context Window; vollständig unabhängig |
| **Kommunikation** | Berichten Ergebnisse nur an den Hauptagenten | Teammates senden sich gegenseitig Nachrichten |
| **Koordination** | Hauptagent verwaltet alle Arbeiten | Gemeinsame Task-Liste mit Selbstkoordination |
| **Token-Kosten** | Niedriger: Ergebnisse werden für den Hauptkontext zusammengefasst | Höher: Jeder Teammate ist eine separate Claude-Instanz |

## Agent Teams aktivieren

Setze die Umgebungsvariable `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` auf `1`, entweder in Deiner Shell oder in der `settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

## Das erste Agent Team starten

Nach der Aktivierung kannst Du Claude in natürlicher Sprache anweisen, ein Team zu erstellen:

> "Ich entwerfe ein CLI-Tool, das Entwicklern hilft, TODO-Kommentare in ihrer Codebase zu tracken. Erstelle ein Agent Team, um dies aus verschiedenen Blickwinkeln zu untersuchen: ein Teammate für UX, einer für die technische Architektur und einer, der den Devil's Advocate spielt."

Claude erstellt daraufhin ein Team mit einer **Shared Task List**, spawnte Teammates für jede Perspektive und fasst die Ergebnisse am Ende zusammen.

## Steuerung und Display Modes

Es gibt zwei Anzeigemodi für Agent Teams:

1.  **In-process:** Alle Teammates laufen innerhalb Deines Hauptterminals. Nutze `Shift+Up/Down`, um einen Teammate auszuwählen.
2.  **Split Panes:** Jeder Teammate erhält sein eigenes Pane. Erfordert `tmux` oder `iTerm2`.

### Teammate Mode konfigurieren
Du kannst den Modus in der `settings.json` festlegen:

```json
{
  "teammateMode": "in-process"
}
```

Oder via Flag beim Starten:
```bash
claude --teammate-mode in-process
```

## Best Practices für parallele Arbeit

*   **Genug Kontext geben:** Teammates laden den Projektkontext (`CLAUDE.md`, MCP Server) automatisch, erben aber nicht die Historie des Leads. Gib aufgabenspezifische Details im **Spawn Prompt** mit.
*   **Aufgabengröße anpassen:** Aufgaben sollten in sich abgeschlossen sein und ein klares Ergebnis liefern (z.B. eine Funktion, ein Testfile).
*   **File Conflicts vermeiden:** Achte darauf, dass nicht zwei Teammates gleichzeitig dieselbe Datei bearbeiten.
*   **Monitor and Steer:** Prüfe regelmäßig den Fortschritt der Teammates und greife ein, wenn ein Ansatz nicht funktioniert.

## Bekannte Limitierungen

*   **Kein Session Resumption:** `/resume` und `/rewind` stellen in-process Teammates aktuell nicht wieder her.
*   **Task Status Lag:** Teammates markieren Aufgaben manchmal nicht sofort als erledigt.
*   **Ein Team pro Session:** Ein Lead kann nur ein Team gleichzeitig verwalten.
*   **Keine verschachtelten Teams:** Teammates können keine eigenen Teams oder Teammates spawnen.
