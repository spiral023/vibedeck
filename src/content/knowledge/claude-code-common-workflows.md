---
title: Claude Code Common Workflows
description: >-
  Praktische Workflows für Claude Code: Codebasen erkunden, Bugs fixen,
  Refactoring, Testing, PRs erstellen und Session-Management.
category: patterns
icon: GitGraph
readTime: 7 Min
tags: ["claude-code", "workflows", "tooling", "docs"]
sourceURL: "https://code.claude.com/docs/en/common-workflows"
sourceType: "docs"
author: "Anthropic Docs"
level: intermediate
---

Diese Seite behandelt praktische Workflows für die tägliche Entwicklung: Erkunden von fremdem Code, Debugging, Refactoring, Schreiben von Tests, Erstellen von PRs und Verwalten von Sitzungen.

## Neue Codebasen verstehen

### Einen schnellen Überblick verschaffen

Angenommen, du bist neu in einem Projekt und musst die Struktur schnell verstehen.

1.  Navigiere zum Projektordner:
    ```bash
    cd /path/to/project
    ```
2.  Starte Claude Code:
    ```bash
    claude
    ```
3.  Frage nach einem High-Level-Überblick:
    ```
    > give me an overview of this codebase
    ```
4.  Tauche tiefer in spezifische Komponenten ein:
    ```
    > explain the main architecture patterns used here
    > what are the key data models?
    > how is authentication handled?
    ```

> **Tipps:** Beginne mit breiten Fragen und werde dann spezifischer. Frage nach Coding-Conventions und Mustern.

### Relevanten Code finden

1.  Bitte Claude, relevante Dateien zu finden:
    ```
    > find the files that handle user authentication
    ```
2.  Erhalte Kontext zur Interaktion der Komponenten:
    ```
    > how do these authentication files work together?
    ```
3.  Verstehe den Ausführungsfluss:
    ```
    > trace the login process from front-end to database
    ```

## Bugs effizient fixen

1.  Teile die Fehlermeldung mit Claude:
    ```
    > I'm seeing an error when I run npm test
    ```
2.  Bitte um Fix-Empfehlungen:
    ```
    > suggest a few ways to fix the @ts-ignore in user.ts
    ```
3.  Wende den Fix an:
    ```
    > update user.ts to add the null check you suggested
    ```

> **Tipps:** Nenne den Befehl zur Reproduktion, Schritte zum Nachstellen und ob der Fehler sporadisch oder konsistent auftritt.

## Code refactorn

1.  Identifiziere veralteten Code:
    ```
    > find deprecated API usage in our codebase
    ```
2.  Erhalte Refactoring-Empfehlungen:
    ```
    > suggest how to refactor utils.js to use modern JavaScript features
    ```
3.  Wende Änderungen sicher an:
    ```
    > refactor utils.js to use ES2024 features while maintaining the same behavior
    ```
4.  Verifiziere das Refactoring:
    ```
    > run tests for the refactored code
    ```

## Spezialisierte Subagents nutzen

1.  **Verfügbare Subagents anzeigen:**
    ```
    > /agents
    ```
2.  **Automatische Nutzung:** Claude delegiert passende Aufgaben automatisch.
    ```
    > review my recent code changes for security issues
    ```
3.  **Explizite Anfrage:**
    ```
    > use the code-reviewer subagent to check the auth module
    ```
4.  **Eigene Subagents erstellen:** Nutze `/agents` und wähle "Create New subagent". Definiere Identifier, Auslöser, Tools und System-Prompt.

## Plan Mode für sichere Analyse

Der **Plan Mode** weist Claude an, einen Plan zu erstellen, indem es die Codebase nur lesend analysiert. Perfekt für komplexe Änderungen oder Code-Reviews.

*   **Aktivieren:** Drücke `Shift+Tab` während einer Session oder starte mit `claude --permission-mode plan`.
*   **Headless:** `claude --permission-mode plan -p "Analyze authentication..."`

**Beispiel:**
```
> I need to refactor our authentication system to use OAuth2. Create a detailed migration plan.
```
Drücke `Ctrl+G`, um den Plan direkt in deinem Editor zu bearbeiten.

## Mit Tests arbeiten

1.  Identifiziere ungetesteten Code:
    ```
    > find functions in NotificationsService.swift that are not covered by tests
    ```
2.  Generiere Test-Gerüst:
    ```
    > add tests for the notification service
    ```
3.  Füge sinnvolle Testfälle hinzu:
    ```
    > add test cases for edge conditions in the notification service
    ```
4.  Führe Tests aus und fixe Fehler:
    ```
    > run the new tests and fix any failures
    ```

## Pull Requests erstellen

Du kannst PRs direkt anfragen ("create a pr") oder den `/commit-push-pr` Skill nutzen.

1.  Fasse deine Änderungen zusammen:
    ```
    > summarize the changes I've made to the authentication module
    ```
2.  Erstelle den PR:
    ```
    > create a pr
    ```
3.  Review und Verfeinerung:
    ```
    > enhance the PR description with more context about the security improvements
    ```

## Dokumentation handhaben

1.  Identifiziere fehlende Docs:
    ```
    > find functions without proper JSDoc comments in the auth module
    ```
2.  Generiere Dokumentation:
    ```
    > add JSDoc comments to the undocumented functions in auth.js
    ```
3.  Review:
    ```
    > improve the generated documentation with more context and examples
    ```

## Mit Bildern arbeiten

Füge Bilder per Drag & Drop, Copy & Paste (Ctrl+V) oder Pfad hinzu.

*   **Analyse:** `> Describe the UI elements in this screenshot`
*   **Kontext:** `> Here's a screenshot of the error. What's causing it?`
*   **Code-Generierung:** `> Generate CSS to match this design mockup`

## Dateien und Verzeichnisse referenzieren

Nutze `@`, um Dateien schnell einzubinden, ohne dass Claude sie erst suchen muss.

*   **Einzelne Datei:** `> Explain the logic in @src/utils/auth.js`
*   **Verzeichnis:** `> What's the structure of @src\components\**?`
*   **MCP Ressourcen:** `> Show me the data from @github:repos/owner/repo/issues`

## Extended Thinking (Thinking Mode)

Extended Thinking reserviert einen Teil des Token-Budgets (bis zu 32k) für interne Überlegungen bei komplexen Problemen.

*   **Anzeigen:** Drücke `Ctrl+O` für den Verbose-Mode.
*   **Toggle:** `Option+T` (macOS) / `Alt+T` (Windows/Linux) oder global via `/config`.
*   **Konfigurieren:** Setze `MAX_THINKING_TOKENS` als Umgebungsvariable.

## Sessions fortsetzen und verwalten

*   **Fortsetzen:** `claude --continue` (letzte Session) oder `claude --resume` (Picker).
*   **Benennen:** Nutze `/rename`, um Sessions wiederauffindbar zu machen (z.B. "auth-refactor").
*   **Session Picker:** Bietet Suche, Vorschau (`P`) und Filterung nach Branch (`B`).

## Parallele Sessions mit Git Worktrees

Arbeite an mehreren Tasks gleichzeitig mit isolierten Worktrees.

1.  Erstelle einen Worktree:
    ```bash
    git worktree add ../project-feature-a -b feature-a
    ```
2.  Starte Claude im Worktree:
    ```bash
    cd ../project-feature-a
    claude
    ```
3.  Entferne den Worktree nach Abschluss:
    ```bash
    git worktree remove ../project-feature-a
    ```

## Claude als Unix-Utility

Nutze Claude in Scripts oder Pipes.

**Linter im Build-Script:**
```json
"lint:claude": "claude -p 'you are a linter... report issues...' --output-format text"
```

**Pipe In/Out:**
```bash
cat build-error.txt | claude -p 'concisely explain the root cause' > output.txt
```

Nutze `--output-format json` oder `stream-json` für maschinenlesbaren Output.

## Claude über sich selbst befragen

Claude kennt seine eigene Dokumentation.

*   `> can Claude Code create pull requests?`
*   `> how do I use MCP with Claude Code?`
*   `> what are the limitations of Claude Code?`
