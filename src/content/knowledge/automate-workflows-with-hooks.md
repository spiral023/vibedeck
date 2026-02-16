---
title: Automate workflows with hooks
description: >-
  Führe Shell-Befehle automatisch aus, wenn Claude Code Dateien bearbeitet,
  Aufgaben beendet oder Input benötigt.
category: tools
icon: Zap
readTime: 3 Min
tags: ["claude-code", "hooks", "workflows", "docs"]
sourceURL: "https://code.claude.com/docs/en/hooks-guide"
sourceType: "docs"
author: "Anthropic Docs"
level: advanced
hot: true
---
Hooks sind benutzerdefinierte Shell-Befehle, die an bestimmten Punkten im Lebenszyklus von Claude Code ausgeführt werden. Sie bieten deterministische Kontrolle über das Verhalten von Claude Code.

## Erster Hook: Desktop-Benachrichtigung

Erstelle einen Hook, der dich benachrichtigt, wenn Claude Input benötigt.

1.  Öffne das Hooks-Menü mit `/hooks`.
2.  Wähle `Notification`.
3.  Setze Matcher auf `*`.
4.  Füge den Befehl für dein OS hinzu:
    *   **macOS:** `osascript -e 'display notification "Claude Code needs your attention" with title "Claude Code"'`
    *   **Linux:** `notify-send 'Claude Code' 'Claude Code needs your attention'`
    *   **Windows:** `powershell.exe -Command "[System.Windows.Forms.MessageBox]::Show('Claude Code needs your attention', 'Claude Code')"`
5.  Speichere in `User settings`.

## Was du automatisieren kannst

### Code nach Edits formatieren

Führe Prettier automatisch nach jedem Datei-Edit aus. Füge dies zu `.claude/settings.json` hinzu:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
          }
        ]
      }
    ]
  }
}
```

### Geschützte Dateien blockieren

Blockiere Änderungen an `.env` oder `package-lock.json`.

1.  Erstelle `.claude/hooks/protect-files.sh`:
    ```bash
    #!/bin/bash
    INPUT=$(cat)
    FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
    if [[ "$FILE_PATH" == *".env"* ]]; then
      echo "Blocked: .env is protected" >&2
      exit 2
    fi
    exit 0
    ```
2.  Mache es ausführbar: `chmod +x .claude/hooks/protect-files.sh`.
3.  Registriere den Hook in `settings.json` unter `PreToolUse`.

## Wie Hooks funktionieren

| Event | Wann es feuert |
| :--- | :--- |
| `SessionStart` | Session-Beginn |
| `PreToolUse` | Vor Tool-Ausführung (kann blockieren) |
| `PostToolUse` | Nach Tool-Ausführung |
| `Stop` | Wenn Claude fertig ist |

### Input & Output

*   **Input:** JSON via `stdin` (enthält `tool_name`, `tool_input`, etc.).
*   **Output:**
    *   Exit 0: Weitermachen.
    *   Exit 2: Blockieren (Grund nach `stderr` schreiben).
    *   JSON nach `stdout`: Strukturierte Steuerung (z.B. `permissionDecision: "deny"`).

### Matcher

Filtere Hooks nach Tool-Namen oder Event-Typ.
*   `matcher: "Bash"` -> Feuert nur bei Bash-Commands.
*   `matcher: "Edit|Write"` -> Feuert bei Datei-Änderungen.

## Prompt- & Agent-Based Hooks

*   **Prompt-Based (`type: "prompt"`):** Nutzt ein LLM für Entscheidungen (Ja/Nein).
*   **Agent-Based (`type: "agent"`):** Startet einen Subagent, der Tools nutzen kann, um Bedingungen zu prüfen (z.B. "Laufen alle Tests?").

## Troubleshooting

*   **Hook feuert nicht:** Prüfe Matcher und Event-Typ.
*   **JSON-Fehler:** Stelle sicher, dass deine Shell-Profile (`.bashrc`) keine unbedingten `echo`-Ausgaben machen.
*   **Debug:** Nutze `Ctrl+O` für Verbose-Mode.

