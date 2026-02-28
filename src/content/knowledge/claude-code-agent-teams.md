---
title: "Claude Code Agent Teams: Der Guide zur Installation und Nutzung"
description: "Ein tiefer Einblick in das neue Agenten-Modell von Claude Code: Wie Agent Teams funktionieren, wie man sie installiert und warum sie herkömmliche Sub-Agenten übertreffen."
type: source
status: seed
category: tooling
icon: Users
readTime: 12
tags:
  - tooling/claude-code
  - workflows/agent-teams
  - automation
  - parallel-execution
  - reverse-engineering
aliases:
  - "Claude Code Agent Teams Guide"
topics:
  - "[[Agent Teams]]"
  - "[[Teammate Mode]]"
  - "[[Task System]]"
  - "[[Parallel Execution]]"
up: "[[Agent Teams]]"
sourceURL: "https://x.com/jasonzhou1993/status/2020086991740891526"
sourceType: thread
author: "Jason Zhou"
sourceDate: "2026-02-07"
addedDate: "2026-02-06"
level: advanced
---

![Claude Code Agent Teams Header](/images/knowledge/claude-code-agent-teams/header.jpg)

Claude Code hat mit **Agent Teams** ein massives Upgrade seines Agenten-Systems veröffentlicht. Dies ist keine kleine Iteration des alten Task + Sub-Agenten-Modells, sondern ein grundlegend neues Ausführungsmodell. Es ermöglicht 3 bis 5 unabhängigen Claude Code Instanzen, an demselben Projekt zusammenzuarbeiten, Kontext zu teilen und sich über ein gemeinsames Task-System zu koordinieren.

## Installation und Aktivierung

Agent Teams befinden sich aktuell noch hinter einem Feature-Flag. Um sie zu nutzen, musst du deine Konfiguration anpassen.

### 1. Claude Code aktualisieren
Stelle sicher, dass du die neueste Version von Claude Code installiert hast.

### 2. Experimental Flag aktivieren
Öffne deine `settings.json` (meist unter `~/.claude/settings.json`) und füge folgenden Eintrag hinzu:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

Starte danach dein Terminal neu.

### 3. Agent Teams triggern
Die Teams werden aktiviert, wenn dein Prompt explizit die Erstellung eines Teams fordert.
> **Beispiel:** *"Ich entwerfe ein CLI-Tool. Erstelle ein Agenten-Team, um dies aus verschiedenen Blickwinkeln zu untersuchen: ein Teammitglied für UX, eines für die technische Architektur und eines, das den Advocatus Diaboli spielt."*

![Setup Agent Teams](/images/knowledge/claude-code-agent-teams/setup.jpg)

## Live-Ansicht mit iTerm2 oder tmux

Agent Teams entfalten ihre volle Stärke, wenn man ihnen parallel bei der Arbeit zusehen kann.

**Der beste Setup:**
Nutze den "Teammate-Modus" mit tmux oder iTerm2 (macOS):
```bash
claude --teammate-mode tmux
```
Dies öffnet separate Panes für den **Team Lead** und jedes einzelne **Teammitglied**. Du kannst live beobachten, wie die Agenten kommunizieren und Aufgaben abarbeiten.

## Sub-Agenten vs. Agent Teams: Was ist neu?

Das alte Modell der Sub-Agenten war linear und isoliert. Ein Agent rief ein Task-Tool auf, ein Sub-Agent erledigte die Arbeit isoliert und lieferte am Ende nur eine Zusammenfassung zurück.

![Teams vs Subagents](/images/knowledge/claude-code-agent-teams/teams-vs-subagents.jpg)

**Agent Teams führen ein:**
- Gemeinsame Task-Listen
- Direkte Nachrichten und Broadcasts zwischen Agenten
- Explizite Lifecycle-Kontrolle (Startup, Shutdown)

## Die internen Tools im Detail

Die Zusammenarbeit wird durch neue interne Tools ermöglicht, die im Dateisystem unter `.claude/` operieren.

### Tool 1: TeamCreate
Erstellt einen neuen Team-Ordner unter `.claude/teams/`. Dies ist das Grundgerüst für die Zusammenarbeit.
![TeamCreate Tool](/images/knowledge/claude-code-agent-teams/tool-teamcreate.jpg)

### Tool 2: TaskCreate
Erstellt konkrete Aufgaben (To-Dos) als JSON-Dateien unter `.claude/tasks/<team-id>`. Hier werden Task-IDs, Status, Besitzer und Abhängigkeiten (`blocks`, `blocked_by`) getrackt.
![TaskCreate Tool](/images/knowledge/claude-code-agent-teams/tool-taskcreate.jpg)

### Tool 3: Task Tool (Upgrade)
Agenten werden weiterhin über das Task-Tool aktiviert, erhalten aber neue Parameter wie `name` und `team_name`, um sie als Teil eines Teams zu identifizieren.
![Task Tool](/images/knowledge/claude-code-agent-teams/tool-task.jpg)

### Tool 4: TaskUpdate
Teammitglieder nutzen dieses Tool, um Aufgaben zu beanspruchen ("claim") oder den Status zu aktualisieren.
![TaskUpdate Tool](/images/knowledge/claude-code-agent-teams/tool-taskupdate.jpg)

### Tool 5: SendMessage
Ermöglicht direkte Nachrichten (`agent -> agent`) oder Broadcasts (`agent -> all teammates`). Die Nachrichten landen in einem `inbox/` Ordner und werden als neue User-Messages in die Historie des Ziel-Agenten injiziert.
![SendMessage Tool](/images/knowledge/claude-code-agent-teams/tool-sendmessage.jpg)

## Wann sind Agent Teams sinnvoll?

Agent Teams verbrauchen deutlich mehr Token und sind langsamer als einfache Sub-Agenten. Sie lohnen sich vor allem für **Deep Debugging** oder komplexe Architektur-Entscheidungen.

**Beispiel für Deep Debugging:**
Statt einen Agenten suchen zu lassen, spawnst du 5 Teammitglieder, die unterschiedliche Hypothesen untersuchen. Sie debattieren miteinander, versuchen die Theorien der anderen zu widerlegen und halten den Konsens in einem Dokument fest.

Agent Teams ist ein mächtiges Werkzeug für extrem lang laufende, komplexe Aufgaben. Es bleibt spannend zu sehen, ob sie Sub-Agenten langfristig komplett ersetzen werden.

## Verbindungen
- [[Agent Teams]]
- [[Teammate Mode]]
- [[Task System]]
- [[Parallel Execution]]
- [[SendMessage Tool]]
- [[Deep Debugging]]
- [[Claude Code]]
- [[Autonomous Agents]]
