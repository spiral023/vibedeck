---
title: Using MiniMax M2.1 with Claude Code
description: >-
  So nutzt du MiniMax M2.1 als kostengünstige Alternative zu Claude Opus 4.5,
  wenn du an Rate Limits stößt oder Kosten sparen möchtest.
category: performance
icon: Cpu
readTime: 4 Min
tags: ["claude-code", "performance", "tooling", "workflows"]
sourceURL: "https://x.com/rudrank/status/2018272804966449209"
sourceType: "thread"
author: "@rudrank"
---

![Header Image](/images/knowledge/using-minimax-with-claude-code/header.jpg)

Wenn du regelmäßig an die stündlichen oder wöchentlichen Limits des Claude Code $20 Pro Plans oder $100 Max Plans stößt, kannst du andere Provider nutzen, die eine Anthropic-kompatible API anbieten.

Es erfordert nur ein einmaliges Setup einiger Umgebungsvariablen. Sobald das erledigt ist, kannst du deinen Terminal-Workflow beibehalten und die Modelle wechseln, sobald du die Opus 4.5 Limits erreichst.

## Wie Claude Code ein Modell auswählt

Claude Code liest das Modell und den Endpunkt aus Umgebungsvariablen (und aus `~/.claude/settings.json`, falls vorhanden):

*   `ANTHROPIC_BASE_URL`: Wohin Anthropic-kompatible Anfragen gesendet werden.
*   `ANTHROPIC_API_KEY` oder `ANTHROPIC_AUTH_TOKEN`: Auth Token für den Provider.
*   `ANTHROPIC_MODEL`: Das Hauptmodell für Reasoning, Coding und Planning.

Wenn ein Provider einen Anthropic-kompatiblen Endpunkt implementiert, musst du normalerweise nur diese Variablen setzen.

Du solltest diese zu deiner Shell RC Datei hinzufügen, damit sie über Sessions hinweg bestehen bleiben (`~/.zshrc`, `~/.bashrc`, `~/.config/fish/config.fish` oder `~/.profile`).

## MiniMax-M2.1 mit Claude Code

MiniMax-M2.1 ist ein schnelles Modell, das sich auf Code Reasoning, Multi-Turn-Dialoge und langen Kontext spezialisiert hat.

### 1. API Key erhalten

Es gibt zwei Arten von Schlüsseln:

*   **Coding Plan Key**: Besuche die Account-Seite und kopiere den "Coding Plan API Key". Nutze diesen, wenn du für den Coding Plan bezahlst. (Günstigster Plan für ca. $8.8/Monat).
*   **Platform Key**: Besuche die [MiniMax Developer Platform](https://platform.minimax.io/user-center/basic-information/interface-key), klicke auf "Create new secret key". Dies ist eine Pay-per-Usage API (nicht empfohlen, da der Coding Plan günstiger ist).

### 2. Umgebung konfigurieren

**Wichtig**: Lösche alle Anthropic Overrides, bevor du MiniMax verbindest, sonst sendet Claude Code Anfragen möglicherweise an den falschen Provider.

Füge die persistenten Exports zu deiner Shell-Konfiguration hinzu:

```bash
export ANTHROPIC_BASE_URL=https://api.minimax.chat/v1
export ANTHROPIC_API_KEY=YOUR_MINIMAX_API_KEY
export ANTHROPIC_MODEL=minimax-m2.1
```

Wenn du die Claude Code Einstellungsdatei bevorzugst, pinne jedes Standardmodell auf MiniMax-M2.1, damit CLI, VS Code Extension und Hintergrund-Helfer konsistent bleiben.

Passe den Timeout an, wenn du oft sehr große Kontext-Fenster streamst.

### 3. Claude Code starten

Starte Claude Code wie gewohnt:

```bash
claude
```

Bestätige den Ordnerzugriff, wenn du gefragt wirst. Führe sofort `/status` aus und prüfe, ob der Banner den MiniMax Endpunkt anzeigt. Stelle eine kurze Frage wie "What model are you?", bevor du schwerere Tasks startest.

## Claude Code Extension für VS Code

Setze `Claude Code: Selected Model` auf `MiniMax-M2.1` in den VS Code Settings, oder editiere die `settings.json` manuell:

```json
"claude-code.selectedModel": "MiniMax-M2.1"
```

Starte VS Code neu, damit die Extension die Umgebungsvariablen neu lädt. Führe erneut `/status` in der Sidebar-Session aus, um das Routing zu verifizieren.

## CC-MIRROR

Es ist umständlich, ständig Modelle zu wechseln. Rudrank nutzt **CC-MIRROR**, um eine isolierte Instanz von Claude Code zu erstellen, in der MiniMax M2.1 läuft.

Das macht es so einfach wie einen einzigen Befehl.

Mit dieser Konfiguration kannst du den Alias `minimax` nutzen, um es direkt zu verwenden, oder weiterhin `claude` nutzen, um mit Opus 4.5 zu arbeiten.

Das gleiche Muster kann für Modelle wie **Kimi K2.5** oder **GLM 4.7** verwendet werden.
