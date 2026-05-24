---
title: Custom Subagents erstellen
description: Erstelle spezialisierte Subagents in Claude Code mit eigenem Prompt, Tools und Permissions.
type: source
status: seed
category: patterns
icon: Bot
readTime: 7
tags:
  - tooling/claude-code
  - patterns/subagents
  - tooling/general
  - tooling/docs
aliases:
  - Custom Subagents erstellen
topics:
  - "[[Claude Code]]"
  - "[[Subagents]]"
  - "[[Workflow Design]]"
up: "[[Claude Code]]"
sourceURL: https://code.claude.com/docs/en/sub-agents
sourceType: docs
author: Anthropic Docs
addedDate: "2026-02-01"
level: advanced
hot: true
---

Subagents sind spezialisierte KI-Assistenten, die in einem eigenen Kontextfenster laufen. Jeder Subagent hat einen eigenen System-Prompt, eigene Tool-Rechte und eigene Permissions. Claude delegiert Aufgaben automatisch, wenn die Subagent-Description zum Task passt.

**Warum Subagents?**

* Kontext bewahren: Exploration und laute Outputs bleiben aus dem Haupt-Thread.
* Regeln erzwingen: Tools und Permissions lassen sich fein begrenzen.
* Wiederverwenden: User-Level-Agents gelten projektübergreifend.
* Spezialisieren: Fokus-Prompts für klare Verantwortungen.
* Kosten steuern: Leichtere Tasks an Haiku auslagern.

## Built-in Subagents

Claude Code bringt mehrere Subagents mit, die automatisch verwendet werden:

* **Explore** (Haiku, read-only): für Code-Suche, Discovery, Analyse ohne Änderungen.
* **Plan** (inherits, read-only): Recherche im Plan-Mode, keine Edits.
* **General-purpose** (inherits, alle Tools): komplexe Aufgaben mit mehreren Schritten und Edits.
* **Weitere**: z.B. `Bash`, `statusline-setup`, `Claude Code Guide`.

## Quickstart: ersten Subagent erstellen

1. Starte das Interface:
   ```
   /agents
   ```
2. **Create new agent** -> **User-level** (speichert in `~/.claude/agents/`).
3. **Generate with Claude** und beschreibe den Agent kurz und klar.
4. Tools auswählen (z.B. nur Read-only Tools für Reviews).
5. Modell wählen (z.B. Sonnet für Analyse).
6. Farbe setzen, speichern.
7. Verwenden:
   ```
   Use the code-improver agent to suggest improvements in this project
   ```

## Subagents konfigurieren

### /agents Command

Mit `/agents` kannst du:

* alle Subagents ansehen (built-in, user, project, plugin)
* neue Subagents erstellen oder generieren
* Tools/Permissions editieren
* Subagents löschen
* aktive Agenten bei Namens-Konflikten sehen

### Scope und Priorität

| Ort | Scope | Priorität |
| --- | --- | --- |
| `--agents` CLI Flag | aktuelle Session | 1 (hoch) |
| `.claude/agents/` | Projekt | 2 |
| `~/.claude/agents/` | Benutzer | 3 |
| Plugin `agents/` | Plugin-Scope | 4 (niedrig) |

### Subagent-Datei (Frontmatter)

```markdown
---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Glob, Grep
model: sonnet
---

You are a code reviewer. Provide actionable feedback on quality and security.
```

### Wichtige Frontmatter-Felder

* `name` (required): eindeutiger Identifier (lowercase + hyphen)
* `description` (required): wann delegiert werden soll
* `tools`: Allowlist der Tools
* `disallowedTools`: Denylist der Tools
* `model`: `sonnet`, `opus`, `haiku`, `inherit`
* `permissionMode`: `default`, `acceptEdits`, `dontAsk`, `bypassPermissions`, `plan`
* `skills`: Skills, die beim Start geladen werden
* `hooks`: Lifecycle Hooks für den Subagent

### CLI-Variante

```bash
claude --agents '{
  "code-reviewer": {
    "description": "Expert code reviewer. Use proactively after code changes.",
    "prompt": "You are a senior code reviewer.",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  }
}'
```

### Modellwahl

* `inherit`: übernimmt das Modell der Haupt-Session (Default)
* `sonnet`, `opus`, `haiku`: explizites Modell pro Subagent

### Tools und Permissions steuern

**Allowlist/Denylist**

```yaml
---
name: safe-researcher
description: Research agent with restricted capabilities
tools: Read, Grep, Glob, Bash
disallowedTools: Write, Edit
---
```

**Permission Modes**

| Mode | Verhalten |
| --- | --- |
| `default` | normale Prompts |
| `acceptEdits` | Edits auto-accept |
| `dontAsk` | Prompts auto-deny |
| `bypassPermissions` | keine Prompts, volle Ausführung |
| `plan` | read-only Exploration |

> **Hinweis:** `bypassPermissions` ist riskant und kann nicht überschrieben werden, wenn der Parent es nutzt.

### Skills vorladen

```yaml
---
name: api-developer
description: Implement API endpoints following team conventions
skills:
  - api-conventions
  - error-handling-patterns
---
```

Skills werden als Inhalt injiziert. Subagents erben keine Skills vom Parent.

### Hooks für Subagents

Hooks können direkt im Frontmatter definiert werden:

```yaml
---
name: db-reader
description: Execute read-only database queries
tools: Bash
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-readonly-query.sh"
---
```

Project-Level Hooks für Subagent-Events (in `settings.json`):

```json
{
  "hooks": {
    "SubagentStart": [
      {
        "matcher": "db-agent",
        "hooks": [
          { "type": "command", "command": "./scripts/setup-db-connection.sh" }
        ]
      }
    ],
    "SubagentStop": [
      {
        "hooks": [
          { "type": "command", "command": "./scripts/cleanup-db-connection.sh" }
        ]
      }
    ]
  }
}
```

### Subagents deaktivieren

```json
{
  "permissions": {
    "deny": ["Task(Explore)", "Task(my-custom-agent)"]
  }
}
```

## Arbeiten mit Subagents

### Delegation bewusst steuern

Claude nutzt die `description`, um zu delegieren. Du kannst explizit anweisen:

```
Use the test-runner subagent to fix failing tests
```

### Foreground vs Background

* **Foreground**: blockiert, Fragen und Permissions kommen zu dir durch.
* **Background**: läuft parallel, braucht vorher genehmigte Permissions. MCP Tools sind hier nicht verfügbar.

Background komplett deaktivieren:

```bash
setx CLAUDE_CODE_DISABLE_BACKGROUND_TASKS 1
```

### Bewaehrte Patterns

* **Lautes Output isolieren:** Tests, Logs, Docs in Subagent auslagern.
* **Parallel research:** getrennte Subagents für unabhängige Module.
* **Chain:** Subagents nacheinander in Workflows.

> **Achtung:** Viele Subagents mit großen Ergebnissen können Kontext kosten.

### Subagents vs Haupt-Thread

**Haupt-Thread, wenn:**

* viel Hin-und-Her nötig ist
* mehrere Phasen eng verbunden sind
* du schnelle Änderungen brauchst

**Subagent, wenn:**

* Output sehr verbose ist
* harte Tool- oder Permission-Regeln gelten
* die Aufgabe isoliert ist

### Kontext und Resume

Subagents haben eigene Transkripte und können resumed werden. Pfad:

```
~/.claude/projects/{project}/{sessionId}/subagents/
```

Auto-Compaction greift wie im Haupt-Thread. Optional:

```
setx CLAUDE_AUTOCOMPACT_PCT_OVERRIDE 50
```

## Beispiel-Subagents

### Code Reviewer (read-only)

```markdown
---
name: code-reviewer
description: Expert code review specialist. Use after code changes.
tools: Read, Grep, Glob, Bash
model: inherit
---

You are a senior reviewer. Focus on security, readability, and tests.
Provide issues ordered by priority and suggest fixes.
```

### Debugger (read + edit)

```markdown
---
name: debugger
description: Debugging specialist for errors and test failures.
tools: Read, Edit, Bash, Grep, Glob
---

Find root cause, implement minimal fix, verify with tests.
Explain reasoning and prevention steps.
```

## Verbindungen
- [[Claude Code]]
- [[Subagents]]
- [[Workflow Design]]
- [[Context Engineering]]
- [[Hooks]]
- [[Tool Calling]]
- [[Agent Workflows]]
- [[Prompt Engineering]]
