---
title: "OpenClaw + Codex/ClaudeCode Agent Swarm: Das Ein-Personen-Entwicklerteam [Full Setup]"
description: "Ein tiefer Einblick in das autonome Agenten-System von Elvis: Orchestrierung mit OpenClaw, parallele Agenten-Flotten und der Weg zum Ein-Personen-Millionen-Dollar-Unternehmen."
category: tooling
icon: Zap
readTime: 18 Min
tags: ["openclaw", "codex", "claude-code", "agent-swarm", "automation", "devops", "software-engineering"]
sourceURL: "https://x.com/elvissun/status/2025920521871716562"
sourceType: "article"
author: "Elvis"
sourceDate: "2026-02-23"
---

![OpenClaw Agent Swarm Header](/images/knowledge/openclaw-codex-agent-swarm/header.jpg)

> "Ich nutze Codex oder Claude Code nicht mehr direkt. Ich nutze OpenClaw als Orchestrierungsschicht. Meine Orchestratorin 'Zoe' spawnt die Agenten, schreibt ihre Prompts, wählt das richtige Modell für jede Aufgabe, überwacht den Fortschritt und benachrichtigt mich via Telegram, wenn PRs bereit zum Merge sind." — Elvis

In den letzten vier Wochen hat dieses System 94 Commits an einem einzigen Tag geliefert, während der Entwickler in Kundengesprächen war. Der Durchschnitt liegt bei 50 Commits pro Tag. Hier ist das komplette Setup, wie man von der Verwaltung von einzelnen KI-Tools zur Steuerung einer ganzen Agenten-Flotte übergeht.

## Die Philosophie: Warum ein Orchestrator notwendig ist

Das Hauptproblem aktueller KI-Coding-Tools wie Codex oder Claude Code ist der begrenzte Kontext. Context Windows sind ein **Nullsummenspiel**:
- Füllst du es mit Code, bleibt kein Platz für den Geschäftskontext.
- Füllst du es mit Kundenhistorie und Meeting-Notizen, bleibt kein Platz für die Codebase.

OpenClaw löst dies durch eine Zwei-Tier-Architektur. Der Orchestrator (Zoe) hält den gesamten Business-Kontext in einem Obsidian-Vault (Meeting-Notizen, Kundenfeedback, vergangene Entscheidungen). Er übersetzt diesen strategischen Kontext in präzise, isolierte Prompts für die Coding-Agents, die sich dann rein auf die technische Umsetzung konzentrieren.

![Architecture Overview](/images/knowledge/openclaw-codex-agent-swarm/architecture.jpg)

---

## Der vollständige 8-Schritte-Workflow

### Schritt 1: Scoping mit Zoe
Nach einem Kundengespräch werden die automatisch synchronisierten Notizen im Obsidian-Vault von Zoe analysiert. Zoe erledigt dabei proaktiv drei Dinge:
1. **Admin-API-Zugriff**: Sie prüft Credits oder Kontostände, um Kunden ggf. sofort freizuschalten.
2. **Datenbank-Zugriff**: Sie hat Read-only Zugriff auf die Produktionsdatenbank (etwas, das die Coding-Agents niemals erhalten), um Konfigurationen für den Prompt zu extrahieren.
3. **Agent-Spawning**: Sie erstellt einen detaillierten Prompt für einen Codex- oder Claude-Agenten.

### Schritt 2: Agenten-Spawn via Git Worktree & tmux
Jeder Agent arbeitet in einer isolierten Umgebung. Dies verhindert Konflikte und ermöglicht parallele Ausführung.

```bash
# Worktree erstellen und Agenten in tmux-Session starten
git worktree add ../feat-custom-templates -b feat/custom-templates origin/main
cd ../feat-custom-templates && pnpm install

# Start in einer tmux-Session für volle Kontrolle
tmux new-session -d -s "codex-templates" \
  -c "/Users/elvis/Documents/GitHub/medialyst-worktrees/feat-custom-templates" \
  "$HOME/.codex-agent/run-agent.sh templates gpt-5.3-codex high"
```

**Warum tmux?** Es ermöglicht "Mid-task Redirection". Wenn ein Agent in die falsche Richtung läuft, kannst du ihm via `tmux send-keys` Korrekturen schicken, ohne den Prozess neu zu starten:
`tmux send-keys -t codex-templates "Stopp. Konzentriere dich erst auf den API-Layer, nicht auf das UI." Enter`

### Schritt 3: Monitoring & JSON-Registry
Alle aktiven Aufgaben werden in einer `.clawdbot/active-tasks.json` getrackt:

```json
{
  "id": "feat-custom-templates",
  "tmuxSession": "codex-templates",
  "agent": "codex",
  "status": "running",
  "notifyOnComplete": true
}
```

Ein Cronjob (`check-agents.sh`) prüft alle 10 Minuten den Status der tmux-Sessions, offene PRs und den CI-Status. Er belebt fehlgeschlagene Agenten automatisch wieder (max. 3 Versuche).

### Schritt 4: PR-Erstellung & "Definition of Done"
Ein PR allein gilt im System nicht als "fertig". Die Agenten wissen, dass folgende Bedingungen erfüllt sein müssen:
- PR erstellt via `gh pr create --fill`.
- Branch ist synchron mit `main` (keine Merge-Konflikte).
- CI-Checks (Lint, Types, Unit-Tests, E2E) sind grün.
- **Wichtig**: Bei UI-Änderungen muss zwingend ein Screenshot in der PR-Beschreibung enthalten sein.

### Schritt 5: Triple-AI Code Review
Jeder PR wird von drei Modellen unabhängig kommentiert:
1. **Codex Reviewer**: Findet Logikfehler, Race Conditions und fehlendes Error-Handling. Sehr geringe False-Positive-Rate.
2. **Gemini Reviewer**: Exzellent für Security-Audits und Skalierbarkeitshinweise.
3. **Claude Code Reviewer**: Oft übervorsichtig, dient eher der Validierung der anderen beiden.

### Schritt 6 & 7: Automatisierte Tests & Human Review
Erst wenn alle automatisierten Hürden genommen sind, erfolgt die Telegram-Benachrichtigung: `"PR #341 ready for review."`
Der menschliche Review dauert meist nur 5-10 Minuten, da die KI-Reviewer die Vorarbeit geleistet haben und Screenshots die visuelle Kontrolle erleichtern.

### Schritt 8: Merge & Cleanup
Nach dem Merge löscht ein Cronjob verwaiste Worktrees und bereinigt die Task-Registry.

---

## Der Ralph Loop V2: Proaktive Agenten

Dieses System ist eine Weiterentwicklung des klassischen Ralph Loops. Zoe wartet nicht auf Befehle, sondern sucht proaktiv nach Arbeit:
- **Morgens**: Scannt Sentry nach Fehlern → spawnt Agenten für Fixes.
- **Nach Meetings**: Scannt Notizen → spawnt Agenten für Feature-Requests.
- **Abends**: Scannt das Git-Log → lässt Claude Code Changelogs und Dokumentationen schreiben.

Wenn ein Agent scheitert, schaut Zoe auf den Grund und passt den Prompt für den nächsten Versuch an (z.B. "Nutze nur diese spezifischen Dateien").

![Context Split](/images/knowledge/openclaw-codex-agent-swarm/context-split.jpg)

---

## Agenten-Auswahl: Wer macht was?

- **Codex 5.3**: Das "Workhorse" für 90% der Aufgaben. Backend, komplexe Refactorings, Reasoning über mehrere Dateien hinweg.
- **Claude Code**: Spezialist für Frontend-Arbeit und schnelle Git-Operationen.
- **Gemini**: Der "Designer". Erstellt HTML/CSS-Spezifikationen, die dann von Claude Code im Komponentensystem implementiert werden.

---

## Die Hardware-Hürde
Der größte Flaschenhals ist das RAM. Da jeder Agent eigene Node-Module, TypeScript-Compiler und Test-Runner lädt, verbraucht paralleles Arbeiten massiv Ressourcen.
- 16GB RAM: Max. 4-5 Agenten parallel.
- Ziel: 128GB RAM (Mac Studio M4 Max), um eine Flotte von 20+ Agenten gleichzeitig zu steuern.

---

## Fazit: Die Ära des "One-Person Team"
Wir bewegen uns auf eine Zeit zu, in der Einzelpersonen millionenschwere Unternehmen führen können. Der Schlüssel ist nicht das Schreiben besserer Prompts, sondern der Aufbau rekursiv selbstverbessernder Systeme.

![Swarm UI](/images/knowledge/openclaw-codex-agent-swarm/swarm-ui.png)

*Quelle: Basierend auf einem Thread von [Elvis](https://x.com/elvissun) auf X.*
