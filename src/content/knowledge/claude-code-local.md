---
title: "Claude Code lokal ausführen (Kostenlos & Privat)"
description: "Ein Tutorial von Alvaro Cintas, wie man Claude Code komplett lokal mit Open-Source-Modellen (Ollama) betreibt – ohne Cloud, ohne Kosten, volle Privatsphäre."
category: fundamentals
icon: Lock
readTime: 10 Min
---

> **Hinweis**: Dieser Artikel basiert auf einem [Tweet von Alvaro Cintas](https://x.com/dr_cintas/status/2014380662300533180) vom 22. Januar 2026.

![Claude Code Local Header](/images/knowledge/claude-code-local/header.jpg)

In diesem Tutorial lernst du, wie du Claude Code vollständig auf deinem eigenen Rechner ausführst, unter Verwendung lokaler Open-Source-Modelle. Dieses Setup ermöglicht es der KI, Dateien zu lesen, Code zu bearbeiten und Befehle auszuführen – ohne Daten an die Cloud zu senden, ohne API-Kosten und mit vollständiger Privatsphäre.

**Für wen ist das?**
*   Entwickler, die einen privaten, offline AI Coding Agent wollen.
*   Power User, die Claude Code Fähigkeiten nutzen möchten.
*   Open-Source-Fans, die mit lokalen LLMs experimentieren.
*   Jeden, der eine KI will, die tatsächlich Dateien bearbeiten kann.

## Schritt 1: Wähle dein lokales "Gehirn" (Ollama)

Bevor du Claude Code startest, brauchst du eine lokale Engine, die KI-Modelle hosten und Tool/Function Calling unterstützt. **Ollama** übernimmt diesen Part.

1.  Lade [Ollama](https://ollama.com/) herunter und installiere es. Es läuft leise im Hintergrund (Mac & Windows).

![Ollama Installation](/images/knowledge/claude-code-local/ollama.jpg)

2.  Lade ein Coding-fokussiertes Modell herunter.
    *   **High Performance:** `qwen3-coder:30b`
    *   **Weniger RAM:** `gemma:2b` oder `qwen2.5-coder:7b`

Führe im Terminal aus:
```bash
ollama pull qwen2.5-coder:7b
```

![Terminal Download](/images/knowledge/claude-code-local/terminal-download.jpg)

## Schritt 2: Claude Code installieren

Jetzt installieren wir den Claude Code Agent selbst.

*   **Mac/Linux:**
    ```bash
    curl -fsSL https://claude.ai/install.sh | bash
    ```
*   **Windows:**
    ```powershell
    irm https://claude.ai/install.ps1 | iex
    ```

Wenn du vorher eingeloggt warst, logge dich ggf. aus, um in den lokalen Modus zu wechseln.

## Schritt 3: Claude auf deinen lokalen Rechner umleiten

Das ist der wichtigste Schritt. Wir sagen Claude, dass es nicht mit Anthropic, sondern mit deinem lokalen Ollama sprechen soll.

Setze die Umgebungsvariablen:

```bash
# Setze die Base URL auf Ollama
export ANTHROPIC_BASE_URL="http://localhost:11434"

# Setze einen Dummy API Key (wird benötigt, aber nicht geprüft)
export ANTHROPIC_AUTH_TOKEN="ollama"

# Optional: Telemetrie deaktivieren
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1
```

![Environment Variables](/images/knowledge/claude-code-local/env-vars.jpg)

## Schritt 4: Starten und Testen

Navigiere in einen Projektordner und starte Claude mit deinem gewählten Modell:

```bash
claude --model qwen2.5-coder:7b
```

Du solltest sehen, wie dein lokales Modell anspringt.

![Local Model Running](/images/knowledge/claude-code-local/local-model.jpg)

Versuche einen Prompt wie:
> "Add a hello world website"

Du wirst sehen, wie Claude Dateien liest, Code modifiziert und Terminal-Befehle ausführt – **alles lokal auf deiner Maschine**.

Keine API-Calls. Keine Cloud. Null Kosten.
