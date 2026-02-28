---
title: "Extend Claude with skills"
description: "Erstelle, verwalte und teile Skills, um Claudes Fähigkeiten in Claude Code zu erweitern. Inklusive benutzerdefinierter Slash-Commands."
type: source
status: seed
category: tooling
icon: Brain
readTime: 4
tags:
  - tooling/claude-skills
  - tooling/claude-code
  - workflows/automation
aliases:
  - "Claude Skills Guide"
topics:
  - "[[Skills]]"
  - "[[Claude Code]]"
  - "[[Custom Commands]]"
  - "[[Workflow Automation]]"
up: "[[Claude Code]]"
sourceURL: "https://code.claude.com/docs/en/skills"
sourceType: "docs"
author: "Anthropic Docs"
sourceDate: "2026-02-01"
addedDate: "2026-02-28"
---

Skills erweitern das, was Claude tun kann. Erstelle eine `SKILL.md`-Datei mit Anweisungen, und Claude fügt sie seinem Werkzeugkasten hinzu. Claude nutzt Skills, wenn sie relevant sind, oder du rufst sie direkt mit `/skill-name` auf.

> **Hinweis:** Custom Slash-Commands wurden in Skills integriert. Eine Datei unter `.claude/commands/review.md` und ein Skill unter `.claude/skills/review/SKILL.md` erzeugen beide `/review`. Skills bieten jedoch zusätzliche Features wie unterstützende Dateien und Konfigurationsoptionen.

## Erste Schritte

### Erstelle deinen ersten Skill

Dieses Beispiel erstellt einen Skill, der Claude beibringt, Code mit visuellen Diagrammen und Analogien zu erklären.

1.  **Verzeichnis erstellen:**
    ```bash
    mkdir -p ~/.claude/skills/explain-code
    ```
2.  **SKILL.md schreiben:**
    Erstelle `~/.claude/skills/explain-code/SKILL.md`:
    ```yaml
    ---
    name: explain-code
    description: Explains code with visual diagrams and analogies. Use when explaining how code works.
    ---

    When explaining code, always include:
    1. **Analogy**: Compare code to everyday life.
    2. **Diagram**: Use ASCII art.
    3. **Walkthrough**: Step-by-step explanation.
    4. **Gotcha**: Common mistakes.
    ```
3.  **Testen:**
    *   Automatisch: "How does this code work?"
    *   Manuell: `/explain-code src/auth/login.ts`

### Wo Skills leben

| Ort | Pfad | Gilt für |
| :--- | :--- | :--- |
| **Personal** | `~/.claude/skills/<name>/SKILL.md` | Alle deine Projekte |
| **Project** | `.claude/skills/<name>/SKILL.md` | Nur dieses Projekt |
| **Plugin** | `<plugin>/skills/<name>/SKILL.md` | Wo Plugin aktiv ist |

Priorität: Enterprise > Personal > Project.

## Skills konfigurieren

Skills werden über YAML Frontmatter konfiguriert.

### Frontmatter Referenz

```yaml
---
name: my-skill
description: Was der Skill tut (für Claudes Entscheidung).
disable-model-invocation: true  # Nur manuell aufrufbar
user-invocable: false           # Nur von Claude aufrufbar
allowed-tools: Read, Grep       # Erlaubte Tools ohne Nachfrage
context: fork                   # In isoliertem Kontext (Subagent) ausführen
---
```

### Argumente übergeben

Du kannst Argumente an Skills übergeben (`/skill arg1 arg2`).
*   `$ARGUMENTS`: Alle Argumente.
*   `$1`, `$2`: Spezifische Argumente.

Beispiel:
```yaml
---
name: fix-issue
description: Fix a GitHub issue
---
Fix GitHub issue $1 following our standards.
```
Aufruf: `/fix-issue 123`

## Fortgeschrittene Patterns

### Dynamischer Kontext (`!command`)

Du kannst Shell-Befehle ausführen, bevor der Skill startet. Der Output wird in den Prompt eingefügt.

```yaml
---
name: pr-summary
---
## PR Context
Diff: !`gh pr diff`
Comments: !`gh pr view --comments`

Summarize this PR...
```

### Skills in Subagents ausführen

Füge `context: fork` hinzu, um den Skill in einem isolierten Kontext (Subagent) auszuführen. Das hält deinen Haupt-Chat sauber.

```yaml
---
name: deep-research
description: Research a topic thoroughly
context: fork
agent: Explore
---
Research $ARGUMENTS thoroughly...
```

### Visuellen Output generieren

Skills können Skripte bündeln (z.B. Python), um HTML-Dateien zu generieren und im Browser zu öffnen (z.B. für Visualisierungen).

## Troubleshooting

*   **Skill triggert nicht:** Prüfe die `description`. Enthält sie relevante Keywords?
*   **Triggert zu oft:** Mach die `description` spezifischer oder setze `disable-model-invocation: true`.
*   **Claude sieht Skills nicht:** Prüfe mit `/context`, ob du das Limit für Skill-Beschreibungen erreicht hast. 

## Verbindungen
- [[Skills]]
- [[Claude Code]]
- [[Custom Commands]]
- [[Workflow Automation]]
- [[Subagents]]
- [[CLAUDE.md]]
- [[Model Context Protocol]]
