---
title: "OpenAI Codex Multi-Agents: Parallelle Agenten-Workflows"
description: "Nutze experimentelle Multi-Agenten-Kollaboration in der Codex CLI für komplexe, parallele Aufgaben und Codebase-Exploration."
category: workflows
icon: Layers
readTime: 12 Min
tags: ["codex", "openai", "multi-agents", "parallel-computing", "cli"]
sourceURL: "https://developers.openai.com/codex/multi-agent/"
sourceType: "blog"
author: "OpenAI"
sourceDate: "2026-02-28"
addedDate: "2026-02-28"
---

> **Quelle:** Dieser Artikel basiert auf der offiziellen [OpenAI Codex Dokumentation](https://developers.openai.com/codex/multi-agent/).

Codex unterstützt experimentelle **Multi-Agenten-Workflows**, bei denen spezialisierte Agenten parallel gestartet werden, um komplexe Aufgaben effizienter zu lösen. Die Ergebnisse werden am Ende in einer einzigen Antwort konsolidiert. Dies ist besonders hilfreich für Aufgaben, die sich gut parallelisieren lassen, wie die Exploration großer Codebasen oder die Implementierung mehrstufiger Feature-Pläne.

---

## 1. Aktivierung der Multi-Agenten-Funktion

Da das Feature aktuell experimentell ist, muss es explizit aktiviert werden.

### Über die CLI:
Gib den Befehl `/experimental` ein, aktiviere **Multi-agents** und starte Codex neu.

### Über die Konfigurationsdatei (`~/.codex/config.toml`):
Füge den folgenden Flag direkt in deine Konfiguration ein:

```toml
[features]
multi_agent = true
```

Aktuell ist die Multi-Agenten-Aktivität primär in der CLI sichtbar; die Unterstützung für die Codex App und IDE-Extensions folgt in Kürze.

---

## 2. Der typische Workflow

Codex übernimmt die gesamte **Orchestrierung** zwischen den Agenten:
- Erstellen von Sub-Agenten.
- Routing von Follow-up Instruktionen.
- Warten auf Ergebnisse und Schließen der Threads.

Codex entscheidet automatisch, wann ein neuer Agent gestartet werden muss, oder du kannst es explizit anfordern. Für langlaufende Befehle oder Polling-Workflows nutzt Codex die eingebaute **Monitor-Rolle**, die für Wartezeiten und wiederholte Statusprüfungen optimiert ist.

### Praxis-Beispiel für einen Prompt:
Du kannst Codex anweisen, ein PR-Review parallel durchzuführen:

> "Ich möchte folgende Punkte zum aktuellen PR (dieser Branch vs. Main) prüfen. Starte einen Agenten pro Punkt, warte auf alle und fasse das Ergebnis für jeden Punkt zusammen:
> 1. Security Issues
> 2. Code Quality
> 3. Bugs
> 4. Race Conditions
> 5. Test Flakiness
> 6. Maintainability"

---

## 3. Verwaltung von Sub-Agenten

Um die Kontrolle über die parallelen Prozesse zu behalten, bietet die CLI spezialisierte Werkzeuge:

- **`/agent`**: Wechselt zwischen aktiven Agenten-Threads und erlaubt die Inspektion laufender Prozesse.
- **Steuerung**: Du kannst Codex direkt anweisen, einen Sub-Agenten zu steuern, zu stoppen oder abgeschlossene Threads zu schließen.
- **Polling**: Das `wait` Tool unterstützt Polling-Fenster von bis zu einer Stunde für Monitoring-Workflows.

### Sandbox & Approvals
Sub-Agenten erben die aktuelle **Sandbox-Policy**, laufen aber mit **non-interaktiven Approvals**. Wenn ein Sub-Agent eine Aktion versucht, die eine manuelle Freigabe erfordern würde, schlägt diese fehl und der Fehler wird im Parent-Workflow gemeldet. Du kannst für einzelne Rollen auch einen **Read-only Modus** erzwingen.

---

## 4. Konfiguration von Agenten-Rollen (Roles)

Rollen werden in der `[agents]` Sektion der `config.toml` definiert (entweder global in `~/.codex/config.toml` oder projektspezifisch).

### Built-in Rollen:
- **`default`**: Allzweck-Fallback-Rolle.
- **`worker`**: Ausführungsfokussiert für Implementierungen und Fixes.
- **`explorer`**: Lese-intensive Rolle für die Codebase-Exploration.
- **`monitor`**: Optimiert für das Warten auf langlaufende Tasks (Polling).

### Schema der Konfiguration:
| Feld | Typ | Zweck |
| :--- | :--- | :--- |
| `agents.max_threads` | Number | Maximale Anzahl gleichzeitig offener Threads. |
| `agents.max_depth` | Number | Maximale Schachtelungstiefe (Standard: 1). |
| `agents.<name>.description` | String | Anleitung für Codex, wann diese Rolle zu wählen ist. |
| `agents.<name>.config_file` | Path | Pfad zu einer rollenspezifischen TOML-Konfiguration. |

---

## 5. Fortgeschrittene Patterns

Die besten Rollendefinitionen sind eng gefasst und spezialisiert ("narrow and opinionated").

### Beispiel A: Das PR-Review Team
Dieses Pattern teilt das Review in drei fokussierte Rollen auf:
1. **`explorer`**: Sammelt Evidenz in der Codebase (Read-only).
2. **`reviewer`**: Prüft Korrektheit, Security und Tests.
3. **`docs_researcher`**: Verifiziert APIs gegen externe Dokumentation via MCP-Server.

**Projekt-Konfiguration (`.codex/config.toml`):**
```toml
[agents]
max_threads = 6
max_depth = 1

[agents.explorer]
description = "Read-only Explorer zum Sammeln von Evidenz vor Änderungsvorschlägen."
config_file = "agents/explorer.toml"

[agents.reviewer]
description = "Reviewer mit Fokus auf Korrektheit, Security und fehlende Tests."
config_file = "agents/reviewer.toml"
```

**Rollen-Konfiguration (`agents/explorer.toml`):**
```toml
model = "gpt-5.3-codex-spark"
sandbox_mode = "read-only"
developer_instructions = """
Bleibe im Explorations-Modus.
Zitiere Dateien und Symbole. Schlage keine Fixes vor, außer es wird explizit gefragt.
Nutze gezielte Suchen statt breiter Scans.
"""
```

### Beispiel B: Frontend-Debugging Team
Hier arbeiten Agenten zusammen, um UI-Regressionen oder Flaky-Tests zu beheben:
- **`explorer`**: Findet die relevanten Code-Pfade.
- **`browser_debugger`**: Nutzt Browser-Tooling (Chrome DevTools MCP), um den Fehler zu reproduzieren.
- **`worker`**: Implementiert den minimalen Fix, sobald die Ursache klar ist.

**Prompt-Strategie:**
> "Untersuche, warum das Settings-Modal nicht speichert. Lass den `browser_debugger` den Fehler reproduzieren, den `explorer` den Code-Pfad finden und den `worker` den kleinstmöglichen Fix implementieren."

---

## Fazit: State statt Context

Das Multi-Agenten-System in Codex löst eines der größten Probleme beim Agentic Coding: **Context Pollution** (oder "Context Rot"). Durch das Auslagern spezialisierter Aufgaben in frische Threads bleibt der Haupt-Kontext sauber und die Performance hoch. Deine Rolle verschiebt sich vom "Code-Schreiber" zum "Architekten und Reviewer", der spezialisierte Teams für dedizierte Aufgaben delegiert.
