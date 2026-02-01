---
title: "Das neue Claude Code Task System: Der Praktische Guide"
description: "Von flachen To-Do-Listen zur abhängigkeitsgesteuerten Orchestrierung: Wie das neue Task-System von Claude Code komplexe Workflows ermöglicht."
category: fundamentals
icon: Rocket
readTime: 15 Min
---

> **Hinweis**: Dieser Artikel basiert auf einem [Tweet von Numman Ali](https://x.com/nummanali/status/2014684862985175205) vom 23. Januar 2026.

![Claude Code Task System Header](/images/knowledge/claude-task-system/header.jpg)

Wir alle kennen das: Du arbeitest an etwas Großem – ein Refactoring über viele Dateien, ein Feature mit Recherche-Bedarf. Du gibst deine Anfrage ein, Claude legt los, und bei Schritt 4 geht alles schief. Es vergisst, dass Schritt 2 eine Voraussetzung war. Der Kontext geht verloren.

Flache To-Do-Listen reichen nicht mehr aus.

**Claude Code's Task Management System** ändert das Spiel. Es ist nicht nur eine Liste – es ist eine **Orchestrierungs-Ebene**, die Abhängigkeiten versteht, über Sessions hinweg persistiert und Arbeit an parallele Agenten delegieren kann.

## Was ist anders?

1.  **Volles Dependency Management:** Tasks können andere Tasks blockieren. Claude beginnt keine Arbeit, die von unfertigen Voraussetzungen abhängt.
    *   *Task #3: Auth Routes erstellen [blockiert durch #1, #2]* -> #3 kann nicht starten, bevor #1 und #2 fertig sind.
2.  **Echte Persistenz:**
    *   **In-Session:** Tasks überleben Context Compaction.
    *   **Cross-Session:** Setze `CLAUDE_CODE_TASK_LIST_ID` und deine Tasks überleben Neustarts.
3.  **Agent Assignment & Parallelism:** Tasks werden benannten Agenten zugewiesen. Mehrere Worker laufen gleichzeitig, ohne Konflikte.
4.  **Visual Progress Tracking:** Alles auf einen Blick im Terminal (`Ctrl+T` zum Umschalten).

![Visual Progress Tracking](/images/knowledge/claude-task-system/visual-progress.jpg)

## Die 4 Core Tools

Claude nutzt neue Tools, um sich selbst zu managen:

### 1. TaskCreate
Erstellt einen neuen Task mit Metadaten.

![TaskCreate JSON](/images/knowledge/claude-task-system/task-create.jpg)

### 2. TaskUpdate
Modifiziert einen existierenden Task (Status, Owner, Abhängigkeiten).

![TaskUpdate JSON](/images/knowledge/claude-task-system/task-update.jpg)

> **Wichtig:** Blockierte Tasks können *nur* gestartet werden, wenn ihre Voraussetzungen `completed` sind.

### 3. TaskGet
Holt Details zu einem spezifischen Task.

### 4. TaskList
Zeigt alle Tasks auf einmal (ID, Subject, Status, Owner, BlockedBy).

## Wie Dependencies funktionieren (Abhängigkeiten)

Das Hinzufügen von `addBlockedBy: ["1", "2"]` zu Task #3 bedeutet:
"Task #3 kann nicht starten, bevor Task #1 UND Task #2 fertig sind."

Die UI zeigt das deutlich mit einem Warn-Symbol (⚠).

![Visual Dependencies](/images/knowledge/claude-task-system/visual-dependencies.jpg)

Sobald die Voraussetzungen erfüllt sind, werden nachfolgende Tasks **automatisch** freigegeben ("unblocked").

## Wo Tasks gespeichert werden

Tasks werden als JSON-Dateien in deinem globalen Claude-Ordner gespeichert:
`~/.claude/tasks/<list-id>/`

Jeder Task ist eine eigene Datei (z.B. `1.json`, `2.json`). Das ermöglicht:
*   Backup/Restore von Task-Listen
*   Git-Tracking des Task-Status
*   Externe Tools, die Tasks lesen/schreiben

## Beispiel: Wedding Planning (Hochzeit)

Nicht alles ist Code. Hier ein anschauliches Beispiel, wie Abhängigkeiten funktionieren:

1.  **Venue buchen** (Keine Dependencies)
2.  **Datum festlegen** (Blockiert durch #1 Venue)
3.  **Gästeliste erstellen** (Parallel möglich)
4.  **Caterer buchen** (Blockiert durch #1 Venue und #2 Datum)
5.  **Einladungen senden** (Blockiert durch #2 Datum und #3 Gästeliste)

![Wedding Planning Dependencies](/images/knowledge/claude-task-system/wedding-planning.jpg)

Das System erzwingt die Logik: Du kannst keine Einladungen senden, bevor du ein Datum hast.

## Agent Assignment & Parallelität

Das `owner`-Feld dient als Label. Claude nutzt es, um Arbeit zu verteilen.

1.  **Zuweisung:** Claude weist Tasks zu (z.B. `owner: "fact-checker"`).
2.  **Spawn:** Claude spawnt einen Agenten mit der Anweisung: "Du bist der Fact-Checker. Finde deine Tasks und erledige sie."
3.  **Ausführung:** Der Agent filtert die TaskList nach seinem Namen, markiert Tasks als `in_progress`, arbeitet und setzt sie auf `completed`.

**Parallele Agenten:**
Claude kann mehrere Agenten in einer einzigen Nachricht spawnen. Sie laufen gleichzeitig und aktualisieren dieselbe Task-Liste ohne Konflikte.

## Model Selection für Agenten

Claude wählt das richtige Werkzeug für den Job:

*   **General Purpose:** Der Allrounder. Lesen, Schreiben, Editieren. (Meist `Sonnet`)
*   **Bash:** Nur Terminal. Schnell für Tests, Git, Builds. (Meist `Haiku`)
*   **Explore:** Read-only. Sicher für "Wo finde ich X?".
*   **Plan:** Read-only Architekt.

**Regel:**
*   `Haiku` -> Commands, einfache Suche.
*   `Sonnet` -> Coding, Implementierung.
*   `Opus` -> Architektur, komplexe Planung.

## Persistenz über Sessions hinweg

Standardmäßig leben Tasks nur in der aktuellen Session. Um sie dauerhaft zu speichern:

**Option 1: Pro Terminal Session**
```bash
CLAUDE_CODE_TASK_LIST_ID="my-project-tasks" claude
```

**Option 2: Projekt-Settings (`.claude/settings.json`)**
```json
{
  "env": {
    "CLAUDE_CODE_TASK_LIST_ID": "billion-dollar-saas"
  }
}
```

Jetzt sind deine Tasks auch nach einem Neustart noch da.

## Best Practices

**Wann Tasks nutzen?**
*   Multi-Step Arbeit (3+ Schritte)
*   Alles mit Abhängigkeiten
*   Arbeit über mehrere Sessions
*   Komplexe Refactorings
*   Delegation an mehrere Agenten

**Wann nicht?**
*   Schnelle One-Off Fragen
*   Einfache Single-File Edits

**Tipps:**
1.  Lass Claude die Arbeit zerlegen ("Break this down").
2.  Nutze Abhängigkeiten, um Fehler zu vermeiden.
3.  Nutze sinnvolle Owner-Namen (`backend-dev` > `agent1`).
4.  Schau in die `TaskList`, wenn du stecken bleibst.

## Fazit

Das Task-System verwandelt Claude von einem "smarten Assistenten, der manchmal den Faden verliert" in einen **Orchestrator**, der komplexe Arbeit strukturiert managt.

Du bekommst:
*   **Sichtbarkeit**
*   **Ordnung durch Abhängigkeiten**
*   **Persistenz**
*   **Parallelität**

Es ist keine Magie. Es ist Struktur. Und Struktur skaliert.
