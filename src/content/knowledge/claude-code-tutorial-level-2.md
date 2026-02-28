---
title: "Claude Code Tutorial Level 2: Fortgeschrittene Systeme"
description: "Gehe über die Grundlagen hinaus: Meistere Skills, Subagents und MCP-Connectors, um Claude Code in ein autonomes Entwicklungssystem zu verwandeln."
category: tooling
icon: Zap
readTime: 12 Min
tags: ["claude-code", "ai-coding", "skills", "subagents", "mcp", "workflow"]
sourceURL: "https://x.com/eyad_khrais/status/2010810802023141688"
sourceType: "thread"
author: "Eyad"
sourceDate: "2026-01-12"
addedDate: "2026-02-26"
---

![Claude Code Level 2 Header](/images/knowledge/claude-code-tutorial-level-2/header.jpg)

Nachdem Teil 1 der Grundlagen viral ging, tauchen wir nun tiefer in die Systeme unter der Haube von Claude Code ein. In 7 Jahren als Software Engineer bei Firmen wie Amazon und Disney habe ich gelernt, dass der Unterschied zwischen kompetenter und exzellenter KI-Nutzung in der Beherrschung von drei Kern-Fähigkeiten liegt: **Skills**, **Subagents** und **MCP Connectors**.

## Das Context Window Problem

Bevor wir zu den Features kommen, ein wichtiger Punkt: Nicht alle Tools behandeln Kontext gleich. Während Cursor laut Analysen von Qodo oft intern kürzt (Truncation) für Performance-Gründe, liefert Claude Code konstant und explizit das volle **200K-Token Context Window**. Bei großen, vernetzten Codebasen ist diese Vorhersehbarkeit entscheidend für komplexe Aufgaben.

---

## 1. Skills: Claude deine Workflows beibringen

Ein **Skill** ist eine Markdown-Datei, die Claude beibringt, wie er spezifische Aufgaben nach deinen Standards erledigt. Claude wendet diese Skills automatisch an, wenn die Anfrage zum Skill passt.

**Struktur:**
Erstelle einen Ordner unter `~/.claude/skills/dein-skill/` mit einer `SKILL.md`.

```markdown
---
name: commit-messages
description: Generiere Commit-Messages nach unseren Team-Konventionen.
---
# Commit Message Format
Nutze Conventional Commits:
- feat: neue Funktion
- fix: Bugfix
- refactor: Code-Änderung ohne Bugfix/Funktion
Format: `type(scope): description`
```

**Der Clou:** Claude lädt beim Start nur Namen und Beschreibungen. Die vollen Instruktionen werden erst "nachgeladen" (progressive disclosure), wenn der Skill relevant ist. Das schont dein Context Window.

---

## 2. Subagents: Parallele Verarbeitung mit isoliertem Kontext

Ein **Subagent** ist eine separate Claude-Instanz mit eigenem Context Window und eigenen Berechtigungen. Das ist extrem mächtig, weil Kontext-Degradierung oft ab ca. 45% Auslastung beginnt. Subagents halten deine Hauptkonversation sauber.

**Eingebaute Subagents:**
- **Explore**: Ein schneller Read-only Agent zum Durchsuchen der Codebase.
- **Plan**: Ein Recherche-Agent für die Vorbereitung von Architektur-Entscheidungen.
- **General-purpose**: Für komplexe, mehrstufige Aufgaben.

**Eigene Subagents erstellen:**
Du kannst eigene Agenten in `~/.claude/agents/` definieren. Ein Beispiel für einen `security-reviewer`:

```yaml
---
name: security-reviewer
description: Prüft Code auf Sicherheitslücken.
tools: Read, Grep, Glob
---
Du bist ein sicherheitsfokussierter Reviewer. Prüfe auf:
1. Auth-Lücken
2. Injection-Risiken
3. Daten-Exponierung
```

**Kommunikationsmuster:** Subagents teilen keinen Kontext direkt. Die Kommunikation erfolgt über Delegation und Zusammenfassung (Summary). Der Hauptagent erhält nur die gefilterten Ergebnisse.

---

## 3. MCP Connectors: Verlasse niemals das Interface

**MCP (Model Context Protocol)** ist ein Standard, mit dem KI-Modelle externe Tools wie Slack, GitHub oder Datenbanken über ein einheitliches Interface anrufen können.

**Wichtige Befehle:**
```bash
# GitHub verbinden
claude mcp add --transport http github https://api.github.com/mcp
```

**Was MCP ermöglicht:**
- Features direkt aus JIRA-Issues implementieren.
- Datenbankabfragen (PostgreSQL) direkt in Claude ausführen.
- Designs aus Figma integrieren.
- Slack-Threads zusammenfassen lassen.

Workflows, die früher fünf Tab-Wechsel erforderten, passieren jetzt in einer einzigen Session.

---

## Der Compound-Effekt

Die wahre Magie entsteht, wenn diese Systeme zusammenwirken:
1. Ein **Skill** kodiert die Muster deines Teams.
2. Ein **Subagent** übernimmt das Testing oder Security-Reviews.
3. **MCP** verbindet alles mit deinem Issue-Tracker.

Investiere Zeit in das Konfigurieren dieser Systeme – es zahlt sich bei jeder nachfolgenden Aufgabe doppelt aus.

*Quelle: Basierend auf einem Thread von [Eyad](https://x.com/eyad_khrais) auf X.*
