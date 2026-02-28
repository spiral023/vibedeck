---
title: The Shorthand Guide to Everything Claude Code
description: "Hier ist mein komplettes Setup nach 10 Monaten täglicher Nutzung: Skills, Hooks, Subagents, MCPs, Plugins und was wirklich funktioniert."
type: source
status: seed
category: fundamentals
icon: Zap
readTime: 13
tags:
  - tooling/claude-code
  - workflows/general
  - tooling/general
  - patterns/best-practices
aliases:
  - The Shorthand Guide to Everything Claude Code
topics:
  - "[[Claude Code]]"
  - "[[Prompt Engineering]]"
  - "[[Workflow Design]]"
up: "[[Claude Code]]"
sourceURL: https://x.com/affaanmustafa/status/2012378465664745795
sourceType: thread
author: "@affaanmustafa"
addedDate: "2026-02-04"
level: advanced
hot: true
---

![Header Image](/images/knowledge/shorthand-guide-everything-claude-code/header.jpg)

Ich bin seit dem experimentellen Rollout im Februar ein begeisterter Claude Code Nutzer und habe den Anthropic x Forum Ventures Hackathon mit [Zenith](https://zenith.chat/) gewonnen – komplett entwickelt mit Claude Code zusammen mit [@DRodriguezFX](https://x.com/@DRodriguezFX).

Hier ist mein umfassender Guide zu allem, was Claude Code zu bieten hat.

## Skills und Commands

Skills funktionieren wie Regeln, sind aber auf bestimmte Bereiche und Workflows beschränkt. Sie sind eine Kurzform für Prompts, wenn du einen bestimmten Workflow ausführen möchtest.

Nach einer langen Coding-Session mit Opus 4.5 möchtest du toten Code und lose `.md` Dateien bereinigen?
Führe `/refactor-clean` aus.

Brauchst du Tests?
`/tdd`, `/e2e`, `/test-coverage`.

Skills und Commands können in einem einzigen Prompt verkettet werden.

![Chaining Commands](/images/knowledge/shorthand-guide-everything-claude-code/chaining-commands.jpg)

Ich kann einen Skill erstellen, der Codemaps an Checkpoints aktualisiert – ein Weg für Claude, schnell durch deine Codebasis zu navigieren, ohne Kontext für die Erkundung zu verschwenden (`~/.claude/skills/codemap-updater.md`).

Commands sind Skills, die über Slash-Befehle ausgeführt werden. Sie überschneiden sich, werden aber unterschiedlich gespeichert:
*   **Skills**: `~/.claude/skills` – breitere Workflow-Definitionen
*   **Commands**: `~/.claude/commands` – schnelle ausführbare Prompts

```bash
# Beispiel Skill-Struktur
~/.claude/skills/
  pmx-guidelines.md      # Projektspezifische Patterns
  coding-standards.md    # Best Practices der Sprache
  tdd-workflow/          # Multi-File Skill mit README.md
  security-review/       # Checklisten-basierter Skill
```

## Hooks

Hooks sind trigger-basierte Automatisierungen, die bei bestimmten Ereignissen feuern. Im Gegensatz zu Skills sind sie auf Tool-Calls und Lifecycle-Events beschränkt.

**Hook-Typen:**
1.  **PreToolUse** – Bevor ein Tool ausgeführt wird (Validierung, Erinnerungen)
2.  **PostToolUse** – Nachdem ein Tool fertig ist (Formatierung, Feedback-Schleifen)
3.  **UserPromptSubmit** – Wenn du eine Nachricht sendest
4.  **Stop** – Wenn Claude die Antwort beendet
5.  **PreCompact** – Vor der Kontext-Kompaktierung
6.  **Notification** – Erlaubnisanfragen

Beispiel: `tmux` Erinnerung vor lang laufenden Befehlen.

```json
{
  "PreToolUse": [
    {
      "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm|pnpm|yarn|cargo|pytest)\"",
      "hooks": [
        {
          "type": "command",
          "command": "if [ -z \"$TMUX\" ]; then echo '[Hook] Consider tmux for session persistence' >&2; fi"
        }
      ]
    }
  ]
}
```

![Feedback Loop](/images/knowledge/shorthand-guide-everything-claude-code/feedback-loop.png)
*Beispiel für Feedback in Claude Code während eines PostToolUse Hooks.*

**Pro-Tipp:** Nutze das `hookify` Plugin, um Hooks im Gespräch zu erstellen, statt JSON manuell zu schreiben. Führe `/hookify` aus und beschreibe, was du möchtest.

## Subagents

Subagents sind Prozesse, an die dein Orchestrator (Haupt-Claude) Aufgaben mit begrenztem Umfang delegieren kann. Sie können im Hintergrund oder Vordergrund laufen und halten den Kontext für den Hauptagenten frei.

Subagents funktionieren gut mit Skills – ein Subagent, der fähig ist, eine Teilmenge deiner Skills auszuführen, kann Aufgaben delegiert bekommen und diese Skills autonom nutzen. Sie können auch mit spezifischen Tool-Berechtigungen in einer Sandbox laufen.

```bash
# Beispiel Subagent-Struktur
~/.claude/agents/
  planner.md           # Planung von Feature-Implementierungen
  architect.md         # System-Design-Entscheidungen
  tdd-guide.md         # Test-Driven Development
  code-reviewer.md     # Qualitäts-/Sicherheits-Review
  security-reviewer.md # Schwachstellen-Analyse
  build-error-resolver.md
  e2e-runner.md
  refactor-cleaner.md
```

Konfiguriere erlaubte Tools, MCPs und Berechtigungen pro Subagent für korrektes Scoping.

## Rules und Memory

Dein `.rules` Ordner enthält `.md` Dateien mit Best Practices, die Claude IMMER befolgen sollte. Zwei Ansätze:
1.  **Single CLAUDE.md**: Alles in einer Datei (User- oder Projekt-Level).
2.  **Rules Ordner**: Modulare `.md` Dateien, gruppiert nach Belangen.

```bash
~/.claude/rules/
  security.md      # Keine hardcodierten Secrets, Input-Validierung
  coding-style.md  # Immutability, Datei-Organisation
  testing.md       # TDD Workflow, 80% Coverage
  git-workflow.md  # Commit-Format, PR-Prozess
  agents.md        # Wann an Subagents delegiert wird
  performance.md   # Modellauswahl, Kontext-Management
```

Beispiel-Regeln:
*   Keine Emojis in der Codebasis
*   Verzichte auf Lila-Töne im Frontend
*   Teste Code immer vor dem Deployment
*   Priorisiere modularen Code über Mega-Files
*   Niemals `console.log` committen

## MCPs (Model Context Protocol)

MCPs verbinden Claude direkt mit externen Diensten. Kein Ersatz für APIs – es ist ein Prompt-gesteuerter Wrapper um sie herum, der mehr Flexibilität beim Navigieren durch Informationen erlaubt.

**Beispiel**: Supabase MCP lässt Claude spezifische Daten ziehen und SQL direkt upstream ausführen, ohne Copy-Paste. Das Gleiche gilt für Datenbanken, Deployment-Plattformen usw.

![Supabase MCP](/images/knowledge/shorthand-guide-everything-claude-code/supabase-mcp.jpg)
*Beispiel: Supabase MCP listet Tabellen im Public Schema.*

**Chrome in Claude** ist ein eingebautes Plugin MCP, das Claude erlaubt, deinen Browser autonom zu steuern – herumklicken, um zu sehen, wie Dinge funktionieren.

**WICHTIG: Context Window Management**
Sei wählerisch mit MCPs. Ich habe alle MCPs in der User-Config, aber **deaktiviere alle ungenutzten**. Navigiere zu `/plugins` und scrolle runter oder führe `/mcp` aus.

Dein 200k Kontext-Fenster vor der Kompaktierung könnte mit zu vielen aktiven Tools nur noch 70k groß sein. Die Performance leidet erheblich.

![Plugins List](/images/knowledge/shorthand-guide-everything-claude-code/plugins-list.jpg)

**Faustregel**: Habe 20-30 MCPs in der Config, aber halte unter 10 aktiviert / unter 80 Tools aktiv.

## Plugins

Plugins bündeln Tools für eine einfache Installation statt mühsamer manueller Einrichtung. Ein Plugin kann eine Kombination aus Skill + MCP sein, oder Hooks/Tools zusammen.

**Installation von Plugins:**

```bash
# Einen Marktplatz hinzufügen
claude plugin marketplace add https://github.com/mixedbread-ai/mgrep

# Öffne Claude, führe /plugins aus, finde den neuen Marktplatz, installiere von dort
```

![Mixedbread Grep](/images/knowledge/shorthand-guide-everything-claude-code/mixedbread-grep.jpg)

**LSP Plugins** sind besonders nützlich, wenn du Claude Code häufig außerhalb von Editoren nutzt. Das Language Server Protocol gibt Claude Echtzeit-Type-Checking, Go-to-Definition und intelligente Vervollständigungen, ohne dass eine IDE offen sein muss.

```bash
# Beispiel aktivierte Plugins
typescript-lsp@claude-plugins-official   # TypeScript Intelligenz
pyright-lsp@claude-plugins-official      # Python Type Checking
hookify@claude-plugins-official          # Hooks im Gespräch erstellen
mgrep@Mixedbread-Grep                    # Bessere Suche als ripgrep
```
Gleiche Warnung wie bei MCPs – achte auf dein Kontext-Fenster.

## Tipps und Tricks

**Tastaturkürzel:**
*   `Ctrl+U` – Ganze Zeile löschen (schneller als Backspace)
*   `!` – Schneller Bash-Befehl Präfix
*   `@` – Suche nach Dateien
*   `/` – Slash-Befehle starten
*   `Shift+Enter` – Mehrzeilige Eingabe
*   `Tab` – "Thinking"-Display umschalten
*   `Esc Esc` – Claude unterbrechen / Code wiederherstellen

**Parallele Workflows:**
*   `/fork` – Konversationen aufspalten, um nicht überlappende Aufgaben parallel zu erledigen.
*   **Git Worktrees** – Für überlappende parallele Claudes ohne Konflikte. Jeder Worktree ist ein unabhängiger Checkout.

```bash
git worktree add ../feature-branch feature-branch
# Jetzt separate Claude Instanzen in jedem Worktree ausführen
```

**tmux für lang laufende Befehle:**
Streame und beobachte Logs/Bash-Prozesse, die Claude ausführt.

```bash
tmux new -s dev
# Claude führt hier Befehle aus, du kannst detachen und reattachen
tmux attach -t dev
```

**mgrep > grep:**
`mgrep` ist eine signifikante Verbesserung gegenüber ripgrep/grep. Installiere es über den Plugin-Marketplace und nutze dann den `/mgrep` Skill. Funktioniert sowohl lokal als auch für Web-Suche.

```bash
mgrep "function handleSubmit"   # Lokale Suche
mgrep --web "Next.js 15 app router changes"   # Web Suche
```

**Andere nützliche Befehle:**
*   `/rewind` – Zurück zu einem vorherigen Status
*   `/statusline` – Anpassen mit Branch, Kontext %, Todos
*   `/checkpoints` – Datei-Level Undo-Punkte
*   `/compact` – Manuell Kontext-Kompaktierung auslösen

## GitHub Actions CI/CD

Richte Code-Review für deine PRs mit GitHub Actions ein. Claude kann PRs automatisch reviewen, wenn es konfiguriert ist.

![GitHub Actions](/images/knowledge/shorthand-guide-everything-claude-code/github-actions.jpg)

## Sandboxing

Nutze den Sandbox-Modus für riskante Operationen – Claude läuft in einer eingeschränkten Umgebung, ohne dein eigentliches System zu beeinflussen. (Nutze `--dangerously-skip-permissions`, um das Gegenteil zu tun und Claude freien Lauf zu lassen – dies kann destruktiv sein, wenn man nicht vorsichtig ist.)

## Über Editoren

Während ein Editor nicht notwendig ist, kann er deinen Claude Code Workflow positiv oder negativ beeinflussen. Während Claude Code in jedem Terminal funktioniert, schaltet die Paarung mit einem fähigen Editor Echtzeit-Dateiverfolgung, schnelle Navigation und integrierte Befehlsausführung frei.

**Zed (Meine Präferenz)**
Ich nutze [Zed](https://zed.dev/) – einen Rust-basierten Editor, der leichtgewichtig, schnell und hochgradig anpassbar ist.

Warum Zed gut mit Claude Code funktioniert:
*   **Agent Panel Integration**: Zed's Claude Integration lässt dich Dateiänderungen in Echtzeit verfolgen, während Claude editiert. Springe zwischen Dateien, die Claude referenziert, ohne den Editor zu verlassen.
*   **Performance**: In Rust geschrieben, öffnet sofort und handhabt große Codebases ohne Lag.
*   **CMD+Shift+R Command Palette**: Schneller Zugriff auf alle deine Custom Slash Commands, Debugger und Tools in einer durchsuchbaren UI.
*   **Minimale Ressourcennutzung**: Konkurriert nicht mit Claude um Systemressourcen.
*   **Vim Mode**: Volle Vim-Keybindings, falls das dein Ding ist.

![Zed Editor](/images/knowledge/shorthand-guide-everything-claude-code/zed-editor.jpg)

1.  **Split Screen**: Terminal mit Claude Code auf einer Seite, Editor auf der anderen.
2.  **Ctrl + G**: Öffne schnell die Datei, an der Claude gerade arbeitet, in Zed.
3.  **Auto-save**: Aktiviere Autosave, damit Claudes Lesezugriffe immer aktuell sind.
4.  **Git Integration**: Nutze die Git-Features des Editors, um Claudes Änderungen vor dem Committen zu prüfen.
5.  **File Watchers**: Die meisten Editoren laden geänderte Dateien neu – stelle sicher, dass dies aktiviert ist.

**VSCode / Cursor**
Dies ist auch eine valide Wahl und funktioniert gut mit Claude Code. Du kannst es im Terminal-Format nutzen oder die Extension für tiefere Integration und passendes UI.

![VSCode](/images/knowledge/shorthand-guide-everything-claude-code/vscode.jpg)

## Mein Setup

**Installierte Plugins** (ich habe meist nur 4-5 gleichzeitig aktiv):
```bash
ralph-wiggum@claude-code-plugins       # Loop automation
frontend-design@claude-code-plugins    # UI/UX patterns
commit-commands@claude-code-plugins    # Git workflow
security-guidance@claude-code-plugins  # Security checks
pr-review-toolkit@claude-code-plugins  # PR automation
typescript-lsp@claude-plugins-official # TS intelligence
hookify@claude-plugins-official        # Hook creation
code-simplifier@claude-plugins-official
feature-dev@claude-code-plugins
explanatory-output-style@claude-code-plugins
code-review@claude-code-plugins
context7@claude-plugins-official       # Live documentation
pyright-lsp@claude-plugins-official    # Python types
mgrep@Mixedbread-Grep                  # Better search
```

**MCP Server (User Level Config):**

```json
{
  "github": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-github"] },
  "firecrawl": { "command": "npx", "args": ["-y", "firecrawl-mcp"] },
  "supabase": {
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref=YOUR_REF"]
  },
  "memory": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-memory"] },
  "sequential-thinking": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"] },
  "vercel": { "type": "http", "url": "https://mcp.vercel.com" },
  "railway": { "command": "npx", "args": ["-y", "@railway/mcp-server"] },
  "cloudflare-docs": { "type": "http", "url": "https://docs.mcp.cloudflare.com/mcp" },
  "cloudflare-workers-bindings": { "type": "http", "url": "https://bindings.mcp.cloudflare.com/mcp" },
  "cloudflare-workers-builds": { "type": "http", "url": "https://builds.mcp.cloudflare.com/mcp" },
  "cloudflare-observability": { "type": "http", "url": "https://observability.mcp.cloudflare.com/mcp" },
  "clickhouse": { "type": "http", "url": "https://mcp.clickhouse.cloud/mcp" },
  "AbletonMCP": { "command": "uvx", "args": ["ableton-mcp"] },
  "magic": { "command": "npx", "args": ["-y", "@magicuidesign/mcp@latest"] }
}
```

**Deaktiviert pro Projekt** (in `~/.claude.json` unter `projects.[path].disabledMcpServers`):
```json
disabledMcpServers: [
  "playwright", "cloudflare-workers-builds", "cloudflare-workers-bindings",
  "cloudflare-observability", "cloudflare-docs", "clickhouse",
  "AbletonMCP", "context7", "magic"
]
```

**Key Hooks:**

```json
{
  "PreToolUse": [
    {
      "matcher": "npm|pnpm|yarn|cargo|pytest",
      "hooks": ["tmux reminder"]
    },
    {
      "matcher": "Write && .md file",
      "hooks": ["block unless README/CLAUDE"]
    },
    {
      "matcher": "git push",
      "hooks": ["open editor for review"]
    }
  ],
  "PostToolUse": [
    {
      "matcher": "Edit && .ts/.tsx/.js/.jsx",
      "hooks": ["prettier --write"]
    },
    {
      "matcher": "Edit && .ts/.tsx",
      "hooks": ["tsc --noEmit"]
    },
    {
      "matcher": "Edit",
      "hooks": ["grep console.log warning"]
    }
  ],
  "Stop": [
    {
      "matcher": "*",
      "hooks": ["check modified files for console.log"]
    }
  ]
}
```

**Custom Status Line:**
Zeigt User, Verzeichnis, Git Branch mit Dirty-Indikator, Kontext verbleibend %, Modell, Zeit und Todo-Anzahl.

![Statusline](/images/knowledge/shorthand-guide-everything-claude-code/statusline.jpg)

**Rules Struktur:**
```bash
~/.claude/rules/
  security.md      # Obligatorische Sicherheitschecks
  coding-style.md  # Immutability, Limits für Dateigröße
  testing.md       # TDD, 80% Coverage
  git-workflow.md  # Conventional Commits
  agents.md        # Subagent Delegations-Regeln
  patterns.md      # API Antwort-Formate
  performance.md   # Modellauswahl (Haiku vs Sonnet vs Opus)
  hooks.md         # Hook Dokumentation
```

## Key Takeaways

1.  **Nicht verkomplizieren**: Behandle Konfiguration wie Fine-Tuning, nicht wie Architektur.
2.  **Kontext-Fenster ist kostbar**: Deaktiviere ungenutzte MCPs und Plugins.
3.  **Parallele Ausführung**: Forke Konversationen, nutze Git Worktrees.
4.  **Automatisiere das Repetitive**: Hooks für Formatierung, Linting, Erinnerungen.
5.  **Scope deine Subagents**: Limitierte Tools = Fokussierte Ausführung.

```

## Verbindungen
- [[Claude Code]]
- [[Prompt Engineering]]
- [[Workflow Design]]
- [[Context Engineering]]
- [[Hooks]]
- [[Subagents]]
- [[Tool Calling]]
- [[Agent Workflows]]
