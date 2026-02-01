---
title: "Use Claude Code in VS Code"
description: "Installiere und konfiguriere die Claude Code Erweiterung für VS Code. Erhalte KI-Coding-Assistenz mit Inline-Diffs, @-Mentions und Plan-Reviews."
category: tools
icon: Code
readTime: 10 Min
---

> **Quelle:** Dieser Artikel basiert auf den offiziellen [Anthropic Docs](https://code.claude.com/docs/en/vs-code).

Die VS Code Erweiterung bietet eine native grafische Oberfläche für Claude Code, direkt integriert in deine IDE. Dies ist der empfohlene Weg, Claude Code in VS Code zu nutzen.

Mit der Erweiterung kannst du Claudes Pläne überprüfen und bearbeiten, bevor du sie akzeptierst, Änderungen automatisch übernehmen, Dateien mit `@`-Mentions referenzieren und auf den Gesprächsverlauf zugreifen.

## Installation

### Voraussetzungen
*   VS Code 1.98.0 oder höher.
*   Ein Anthropic Account (Anmeldung beim ersten Start).

### Installieren
Du kannst die Erweiterung direkt über den [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code) installieren oder im Extensions-Tab (`Cmd+Shift+X` / `Ctrl+Shift+X`) nach "Claude Code" suchen.

> **Hinweis:** Falls die Erweiterung nach der Installation nicht erscheint, starte VS Code neu oder führe "Developer: Reload Window" aus.

## Erste Schritte

### 1. Claude Code Panel öffnen
Das **Spark Icon** (✨) zeigt Claude Code an.
*   **Editor Toolbar:** Klicke auf das Spark-Icon oben rechts im Editor (nur sichtbar, wenn eine Datei offen ist).
*   **Status Bar:** Klicke auf "✱ Claude Code" unten rechts.
*   **Command Palette:** Suche nach "Claude Code: Open in New Tab".

### 2. Prompt senden
Bitte Claude um Hilfe bei deinem Code.
*   **Kontext:** Claude sieht automatisch deinen markierten Text.
*   **@-Mentions:** Drücke `Option+K` (Mac) / `Alt+K` (Windows), um eine Referenz auf die aktuelle Datei/Selektion einzufügen (z.B. `@file.ts#5-10`).

### 3. Änderungen reviewen
Wenn Claude eine Datei bearbeiten will, zeigt es einen **Diff-View** an. Du kannst die Änderung akzeptieren, ablehnen oder Feedback geben.

## Features der Prompt Box

*   **Permission Modes:** Klicke auf den Indikator unten, um den Modus zu wechseln:
    *   **Normal:** Fragt vor jeder Aktion.
    *   **Plan Mode:** Erstellt erst einen Plan zur Freigabe.
    *   **Auto-Accept:** Führt Edits ohne Nachfrage aus.
*   **Command Menu (`/`):** Schnellzugriff auf Befehle wie `/compact`, `/model` oder `/bug`.
*   **Dateien referenzieren:** Tippe `@` gefolgt vom Dateinamen für Fuzzy-Search.
*   **History:** Greife über das Dropdown oben auf vergangene Sessions zu (lokal und remote von claude.ai).

## Anpassung & Workflow

### Panel Position
Du kannst das Claude-Panel per Drag & Drop verschieben:
*   **Secondary Sidebar (Rechts):** Standard, hält Claude neben dem Code sichtbar.
*   **Primary Sidebar (Links):** Klassische Position.
*   **Editor Area:** Als Tab neben deinen Dateien.

### Terminal Mode
Wenn du die CLI-Oberfläche bevorzugst, kannst du in den Einstellungen (`Cmd+,`) unter **Extensions -> Claude Code** die Option **Use Terminal** aktivieren.

## VS Code Extension vs. CLI

Die Erweiterung nutzt unter der Haube die CLI, bietet aber eine grafische Oberfläche. Manche Features sind nur in der CLI verfügbar (z.B. MCP-Konfiguration), aber beide teilen sich die `settings.json` und den Verlauf.

### Checkpoints (Rewind)
In der Extension kannst du Nachrichten hovern, um den **Rewind-Button** zu sehen. Optionen:
*   **Fork conversation:** Neuer Branch ab hier (behält Code-Änderungen).
*   **Rewind code:** Setzt Code-Änderungen zurück (behält Chat).
*   **Fork & Rewind:** Beides zurücksetzen.

## Troubleshooting

*   **Spark Icon fehlt:** Stelle sicher, dass eine Datei geöffnet ist und VS Code aktuell ist.
*   **Keine Antwort:** Prüfe deine Internetverbindung oder starte eine neue Session.
*   **Drittanbieter (Bedrock/Vertex):** Deaktiviere "Login Prompt" in den Settings und konfiguriere die Authentifizierung in `~/.claude/settings.json`.
