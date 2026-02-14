---
title: "Advanced Patterns für Agent Teams in Claude Code"
description: "Erfahre, wie du Agent Teams durch Modulgrenzen, operationalen Kontext in CLAUDE.md und automatisierte Verifizierung effizient steuerst."
category: workflows
icon: Zap
readTime: 8 Min
tags: ["claude-code", "agent-teams", "productivity", "parallel-execution", "claude-md"]
sourceURL: "https://x.com/dani_avila7/status/2020170608290549906"
sourceType: "thread"
author: "Daniel San"
sourceDate: "2026-02-07"
---

![Agent Teams Advanced Patterns Header](/images/knowledge/advanced-agent-teams-patterns/header.jpg)

Agent Teams in Claude Code sind mehr als nur "mehrere Agenten gleichzeitig". Um sie für echte produktive Arbeit zu nutzen, muss man verstehen, wie sie koordinieren und wie man Edit-Kollisionen vermeidet. Hier sind die Patterns, um den Durchsatz zu maximieren.

## Die Grundlagen der Team-Steuerung

Die Aktivierung ist simpel: Füge `"CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"` zu deiner `settings.json` hinzu. Aber die wahre Magie liegt in der Art der Aufgabenstellung.

Du musst Teams nicht manuell konfigurieren. Beschreibe einfach, was du brauchst:
> "Ich muss alle Debug-Log-Statements aus docs/js/ entfernen. Erstelle ein Agenten-Team und teile die Arbeit nach Datei-Zugehörigkeit auf, damit niemand dieselbe Datei editiert."

Claude erstellt daraufhin das Team, spaltet die Arbeit in Tasks auf, spawnt Teammates und koordiniert den gesamten Prozess. In der Statusline kannst du live verfolgen, wie die Teammates erscheinen und simultan an verschiedenen Dateien arbeiten.

![Teammates Statusline](/images/knowledge/advanced-agent-teams-patterns/statusline.png)

## Wie Agent Teams sich wirklich verhalten

Drei Dinge werden bei der Nutzung sofort klar:
1. **Eigene Context Windows:** Jeder Teammate läuft in seinem eigenen isolierten Kontext.
2. **Keine geteilte Historie:** Es gibt keinen gemeinsamen Chat-Verlauf zwischen den Teammaten.
3. **CLAUDE.md als Anker:** Alle Teammates laden automatisch die `CLAUDE.md`.

Die Koordination erfolgt also nicht durch Konversation, sondern durch **Struktur**.

![Parallel Work in Action](/images/knowledge/advanced-agent-teams-patterns/parallel-work.jpg)

## Die 3 goldenen Regeln für Agent Teams

### 1. Definiere Modulgrenzen
Damit der Team-Lead die Arbeit klug aufteilen kann, muss er die Grenzen deines Projekts kennen. Je klarer deine Modulgrenzen in der `CLAUDE.md` definiert sind, desto smarter erfolgt der Split.

```markdown
## Independent Modules
| Module  | Directory | Notes                     |
|---------|-----------|---------------------------|
| API     | api/      | Jede Datei ist unabhängig |
| CLI     | src/      | Kernlogik                 |
| Website | docs/js/  | Statischer Content        |

**Shared Files (Koordination vor Bearbeitung nötig):**
- package.json
- tsconfig.json
```

In Praxistests hat Claude Code basierend auf einer solchen Tabelle 9 Dateien ohne einen einzigen Konflikt bereinigt, weil es verstand, welche Dateien unabhängig voneinander bearbeitet werden können.

### 2. Halte den Projektkontext kurz und operational
Da jeder Teammate beim Startup die `CLAUDE.md` lädt, aber nicht die Konversation des Leads erbt, führt eine vage `CLAUDE.md` dazu, dass jeder Agent unnötig Token verbraucht, um die Codebase eigenständig zu explorieren.

**Gutes Beispiel für Quick Context:**
```markdown
## Quick Context
- **Stack**: Node.js CLI + Statische Seite + Vercel Serverless
- **Entry Point**: src/index.js
- **Tests**: Jest (`npm test`)
- **Database**: Neon
```

Drei Teammates, die gleichzeitig Kontext laden, bedeuten die dreifachen Token-Kosten. Ein kompakter, direkt lesbarer Kontext spart massiv Ressourcen.

### 3. Definiere "Verifiziert" für dein Projekt
Teammates nutzen Signale aus der `CLAUDE.md`, um ihre eigene Arbeit zu bestätigen. Wenn du dort auflistest, wie man den Erfolg prüft, können Agenten dies automatisiert tun.

```markdown
## Verification
- `npm test`
- `npm run lint`
- `npm run build`
```

Im Idealfall berichten Teammates dann selbstständig: *"27 console.log in 3 Dateien entfernt. 12 console.error beibehalten. Verifizierung mit grep erfolgreich abgeschlossen."* Kein Eingreifen des Leads nötig – klare Regeln rein, klare Reports raus.

![Tasklist Progress](/images/knowledge/advanced-agent-teams-patterns/tasklist.jpg)

## Ein Wort zum Plan Mode

Eine wichtige Erkenntnis: Der **Plan Mode** wird in Teams bei jedem Zug evaluiert, nicht nur einmal zu Beginn.

![Plan Mode Evaluation](/images/knowledge/advanced-agent-teams-patterns/plan-mode.jpg)

Dies macht ihn ideal für:
- Design-Only Rollen (z.B. ein Agent, der nur Architektur prüft).
- Die initiale Formung komplexer Aufgaben.

Für die eigentliche Ausführung ist es jedoch effizienter, Teammates im Standard-Modus zu spawnen, um den Workflow flüssig zu halten.

## Fazit

Agent Teams funktionieren am besten, wenn:
- Agenten klare Oberflächen ("surfaces") besitzen.
- Die Kommunikation strukturiert und nicht konversationell erfolgt.
- Die `CLAUDE.md` als gemeinsamer Runtime-Kontext behandelt wird.

Sobald man sich an dieses Modell der Koordination gewöhnt hat, fühlt es sich weniger nach "vielen Agenten" an, sondern nach einem einzigen, hocheffizienten, parallel laufenden System.
