---
title: Connect Claude Code to tools via MCP
description: >-
  Lerne, wie du Claude Code über das Model Context Protocol (MCP) mit deinen
  Tools, Datenbanken und APIs verbindest.
category: tools
icon: Plug
readTime: 3 Min
tags: ["claude-code", "mcp", "tooling", "docs"]
sourceURL: "https://code.claude.com/docs/en/mcp"
sourceType: "docs"
author: "Anthropic Docs"
---

Claude Code kann über das **Model Context Protocol (MCP)** mit hunderten externen Tools und Datenquellen verbunden werden. MCP ist ein offener Standard, der es KI-Assistenten ermöglicht, sicher auf deine Datenbanken, APIs und lokalen Tools zuzugreifen.

## Was du mit MCP tun kannst

*   **Issue Tracker nutzen**: "Implementiere das Feature aus JIRA-Issue ENG-4521 und erstelle einen PR."
*   **Monitoring analysieren**: "Prüfe Sentry-Fehler der letzten 24 Stunden."
*   **Datenbanken abfragen**: "Finde die E-Mails der letzten 10 registrierten User in unserer PostgreSQL-DB."
*   **Designs integrieren**: "Aktualisiere das CSS basierend auf dem Figma-Design aus Slack."
*   **Workflows automatisieren**: "Erstelle Gmail-Entwürfe für Feedback-Anfragen."

## MCP-Server installieren

Es gibt drei primäre Wege, MCP-Server zu verbinden:

### 1. Remote HTTP Server (Empfohlen)
Die beste Option für Cloud-Dienste.
```bash
claude mcp add notion --transport http https://mcp.notion.com/mcp
```

### 2. Lokale Stdio-Server
Ideal für Tools mit direktem Systemzugriff oder eigene Skripte.
```bash
claude mcp add airtable --transport stdio --env API_KEY=YOUR_KEY -- npx -y airtable-mcp-server
```
> **Wichtig für Windows:** Nutze `cmd /c` für npx-Befehle:
> `claude mcp add my-server --transport stdio -- cmd /c npx -y @package/name`

### 3. Remote SSE Server (Veraltet)
Sollte nur verwendet werden, wenn HTTP nicht verfügbar ist.

## Management-Befehle

*   **Liste anzeigen**: `claude mcp list`
*   **Server-Details**: `claude mcp get <name>`
*   **Server entfernen**: `claude mcp remove <name>`
*   **Status prüfen (interaktiv)**: `/mcp`

## Installations-Scopes

| Scope | Speicherort | Sichtbarkeit |
| :--- | :--- | :--- |
| **Local** | `~/.claude.json` | Nur für dich im aktuellen Projekt. |
| **Project** | `.mcp.json` | Für das ganze Team (wird in Git committet). |
| **User** | `~/.claude.json` | Global für alle deine Projekte. |

## Authentifizierung
Viele Server erfordern OAuth 2.0. Nutze den Befehl `/mcp` innerhalb von Claude Code, um den Login-Prozess im Browser zu starten.

## MCP-Ressourcen und Prompts

### Ressourcen mit `@` referenzieren
Du kannst MCP-Ressourcen wie Dateien einbinden:
`> Analysiere @github:issue://123 und schlage einen Fix vor.`

### Prompts als Befehle nutzen
Server können vordefinierte Prompts bereitstellen, die als Slash-Commands erscheinen:
`> /mcp__github__pr_review 456`

## Skalierung mit Tool Search
Wenn du viele MCP-Server hast, lädt Claude Code Tools dynamisch ("Tool Search"), sobald die Definitionen mehr als 10% des Kontextfensters einnehmen würden. Dies spart wertvolle Token.

## Managed MCP (Enterprise)
Unternehmen können MCP-Server zentral über eine `managed-mcp.json` steuern oder Policies (Allow-/Denylists) definieren, um den Zugriff auf bestimmte Tools zu beschränken oder zu erzwingen.
