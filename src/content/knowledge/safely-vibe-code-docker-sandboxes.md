---
title: "AI Agents sicher im YOLO-Modus ausführen mit Docker Sandboxes"
description: "Lerne, wie Du Claude Code, Codex oder Gemini CLI sicher mit vollen Berechtigungen ausführst, ohne Dein System zu gefährden."
category: security
icon: Shield
readTime: 7 Min
tags: ["docker", "sandbox", "security", "claude-code", "automation", "vibe-coding"]
sourceURL: "https://x.com/d4m1n/status/2019366063226355930"
sourceType: "tweet"
author: "Dan ⚡️"
sourceDate: "2026-02-05"
addedDate: "2026-02-06"
level: advanced
---

![Safe Vibe Coding](/images/knowledge/safely-vibe-code-docker-sandboxes/header.jpg)

YOLO-Modus (Auto-Approval / Skip-Permissions) macht AI-Agenten deutlich schneller und ermöglicht es ihnen, über lange Zeiträume autonom zu arbeiten. Das Problem: Das Risiko, dass ungesehene, destruktive oder unbeabsichtigte Befehle auf Deinem Hauptsystem ausgeführt werden, ist hoch.

## Das Problem mit ständigen Bestätigungen

Wir alle kennen das: Man schickt den AI-Agenten los, kommt nach 10 Minuten zurück und sieht, dass er bei einem einfachen `ls ./src` hängengeblieben ist, weil er auf eine Bestätigung wartet.

![Stuck Command Example](/images/knowledge/safely-vibe-code-docker-sandboxes/example-stop.jpg)

Der wahre Durchbruch für AI-Agenten ist es, sie einfach "machen zu lassen" – besonders bei Workflows wie dem **Ralph Wiggum Loop**, bei dem die AI codet, während Du schläfst. Aber ohne Sicherheitsebene ist das eine schlechte Idee.

## Die Lösung: Docker Sandboxes

Docker hat vor kurzem ein neues Feature namens **Sandboxes** eingeführt. Damit lassen sich AI-Agenten über CLIs extrem einfach und sicher isolieren. Du musst Dich nicht einmal mit Containern oder komplexen Konfigurationen herumschlagen – es ist ein Einzeiler.

### So startest Du Agent-CLIs sicher:

**Claude Code:**
```bash
docker sandbox run claude .
```

**Codex CLI:**
```bash
docker sandbox run codex .
```

**Gemini CLI:**
```bash
docker sandbox run gemini .
```

Nach dem Start musst Du Dich einmalig in Deinen Account (Anthropic/OpenAI/Google) einloggen. Im Hintergrund erstellt Docker eine leichtgewichtige Micro-VM mit einem privaten Docker-Daemon und startet den Agenten darin. Dein Host-System bleibt komplett unangetastet.

## Den Ralph Loop sicher ausführen

Ein Ralph Loop bedeutet, dem Agenten eine riesige Liste an Aufgaben zu geben und ihn in einer Schleife arbeiten zu lassen, bis alles erledigt ist. Mit Docker Sandboxes kannst Du das ohne Angst über Nacht laufen lassen.

Hier ist ein einfaches Bash-Script für einen Ralph Loop in der Sandbox:

```bash
#!/bin/bash

MAX_ITERATIONS=${1:-20} # Standardmäßig 20 Iterationen
PROMPT_CONTENT="Build a profitable SaaS. Make no mistakes."

for i in $(seq 1 $MAX_ITERATIONS); do
  docker sandbox run claude . -- -p "$PROMPT_CONTENT"
done
```

## Debugging und Inspektion

Du fragst Dich vielleicht: "Wenn das keine normalen Container sind, wie sehe ich, was darin passiert?"

Du kannst alle aktiven Sandboxes auflisten:
```bash
docker sandbox list
```

![Docker Sandbox List](/images/knowledge/safely-vibe-code-docker-sandboxes/sandbox-list.jpg)

Und Dich per Bash direkt in eine laufende Sandbox einklinken (z.B. um Logs zu prüfen oder Tools zu installieren):
```bash
docker sandbox exec -it <sandbox-name> bash
```

Du hast die volle Kontrolle über die Sandbox, genau wie bei einem regulären Container, aber mit der Sicherheit einer isolierten Micro-VM.
