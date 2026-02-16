---
title: 'Claude Code lernen: Der 7-Schritte-Plan'
description: >-
  Hoeem teilt die wichtigsten Erkenntnisse aus einem Anthropic-Kurs zu Claude
  Code: Von Core Mechanics über Context Engineering bis hin zur Skalierung.
category: fundamentals
icon: Terminal
readTime: 7 Min
tags: ["claude-code", "workflows", "tooling", "best-practices"]
level: intermediate
---

> Ursprünglich veröffentlicht von [hoeem auf X](https://x.com/hooeem/status/2007914329748668472).

![Claude Code Guide](/images/knowledge/claude-code-guide/header.jpg)

Ich habe mich für einen 2-stündigen Anthropic-Kurs über Claude Code angemeldet. Die meisten Leute tippen einfach einen Prompt und hoffen auf das Beste. **Hoffnung ist keine Strategie.**

Wenn du mir 10 Minuten gibst, bringe ich dir alles bei, was ich aus diesem Kurs gelernt habe.

**Inhalt:**
1.  Die Kernmechaniken (Core Mechanics)
2.  Context Engineering
3.  Zwei-Gehirne-Strategie (Two Brains Strategy)
4.  Die Panik-Knöpfe (Panic Buttons)
5.  Hooks nutzen (Guardrails)
6.  God Mode
7.  Skalierung

## 1. Die Kernmechaniken

Um die Maschine zu kontrollieren, musst du die Maschine verstehen. Claude arbeitet in einer strikten 4-Schritte-Schleife:

1.  **Erhält Aufgabe:** (z.B. "Fix den Bug")
2.  **Sammelt Kontext:** Es liest Dateien, um die Codebase zu verstehen.
3.  **Formuliert Plan:** Es entscheidet sich für eine Strategie.
4.  **Ergreift Maßnahmen:** Es aktualisiert Dateien und führt Tests aus.

> **Die Lektion:** Claudes Superkraft ist nicht der IQ, sondern die Fähigkeit, Tools zu verketten. Das Modell kann deinen Computer nicht "sehen"; es verlässt sich darauf, dass der Assistent Anweisungen anhängt und formatierte Antworten ausführt. Wenn du die Tools nicht kontrollierst, fliegst du blind.

## 2. Context Engineering

Wenn du eine riesige Codebase in den Chat wirfst, degradiert das Modell. Du brauchst Context Management.

*   **Die Karte (`/init`):** Führe das einmal aus. Es analysiert deine Architektur und baut eine `CLAUDE.md` Datei – eine Karte der Seele deines Projekts.
    *   *Kritisches Detail:* Der Inhalt dieser Datei wird in **jede einzelne Anfrage** aufgenommen. Halte sie schlank.

*   **Das 3-Schichten-Gedächtnis:**
    1.  **Project Level:** Geteilte Anweisungen, die ins Repo committed werden.
    2.  **Local Level:** Deine persönlichen Anweisungen (von git ignoriert).
    3.  **Machine Level:** Globale Anweisungen für dich über alle Projekte hinweg.

*   **Der Laser (`@`):** Lass es nicht raten. Nutze `@database_schema`, um es zu zwingen, genau die Datei anzuschauen, die du brauchst. Das spart Tokens und erhöht die Genauigkeit.

## 3. Zwei-Gehirne-Strategie

Claude hat zwei unterschiedliche Hochleistungs-Modi. Zu wissen, wann man welchen nutzt, ist der Unterschied zwischen einem Bugfix und einer Systemarchitektur. (Beide verbrauchen zusätzliche Token, also nutze sie weise.)

**Modus A: Planung (Shift + Tab x2)**
*   **Wann:** Du brauchst Breite (z.B. "Refactor dieses Modul über 10 Dateien hinweg").
*   **Was es tut:** Es stoppt die Ausführung, um die Codebase zu recherchieren und einen detaillierten Implementierungsplan zu schreiben, bevor es eine einzige Zeile Code anfasst.

**Modus B: Denken ("Ultra think")**
*   **Wann:** Du brauchst Tiefe (z.B. "Warum passiert diese Race Condition?").
*   **Was es tut:** Es gibt Claude ein erweitertes "Reasoning Budget", um harte Logikrätsel zu lösen oder spezifische Probleme zu debuggen.

> **Pro Tipp:** Füge Screenshots ein, um visuellen Kontext zu UI-Bugs zu geben. (Nutze Control-V, nicht Command-V, auch auf macOS).

## 4. Die Panik-Knöpfe nutzen

Wenn die KI anfängt zu halluzinieren, diskutiere nicht mit ihr. Kontrolliere die Timeline.

*   **Der Stop (Escape):** Unterbricht den Output sofort.
*   **Die Korrektur (Escape + Memory):** Stopp es nicht nur, lehre es. Drücke dies, um eine Erinnerung (mit `#`) über den Fehler hinzuzufügen, damit es ihn beim nächsten Mal nicht wiederholt.
*   **Der Rewind (Double Escape):** Das ist deine Zeitmaschine. Springe zurück, bevor der Fehler passierte, und lösche den schlechten Kontext komplett.
*   **Der Compact (`/compact`):** Wenn die Konversation zu lang wird, fasst dies die Historie zusammen, behält aber die gelernten Lektionen bei und entfernt den Ballast.

## 5. Hooks nutzen (Guardrails)

Hör auf, Claudes Fehler manuell zu beheben. Automatisiere den Feedback-Loop mit Hooks in deiner `.claude/settings.local.json`.

**Der "Security Guard" (Pre-Hook):**
*   **Problem:** Claude versucht, deine sensitive `.env` Datei zu lesen.
*   **Fix:** Ein Pre-Hook, der `read` oder `grep` Tools überwacht. Wenn der Pfad `.env` enthält, beendet sich dein Skript mit Code 2.
*   **Das Feedback:** Du musst den Fehler in `stderr` drucken. Das ist nicht nur ein Log; es wird an Claude zurückgefüttert und zwingt es, den Block zu erkennen und seine Strategie zu ändern.

**Der "Type-Safety" Loop (Post-Hook):**
*   **Problem:** Claude editiert eine Datei, bricht aber den Build.
*   **Fix:** Ein Post-Hook, der `tsc --no-emit` nach jedem Edit ausführt. Wenn Fehler gefunden werden, werden sie Claude sofort zurückgefüttert, damit es sich selbst korrigieren kann.

**Das "Anti-Bloat" System:**
*   **Problem:** Claude erstellt doppelten Code.
*   **Fix:** Ein Hook, der spezifische Ordner überwacht und eine sekundäre Claude-Instanz hochfährt, um auf Duplikate zu prüfen, bevor committed wird.

## 6. Going God Mode

Hier lässt du 99% der Entwickler hinter dir.

*   **Custom Commands:** Hör auf, repetitive Prompts zu tippen. Erstelle eine Markdown-Datei in `.claude/commands/` (z.B. `audit.md`). Jetzt führt `/audit` diesen komplexen Dependency-Check sofort aus.
*   **Gib ihm Hände (MCP):** Binde externe Tools über das Model Context Protocol ein. `claude mcp add [name]` um Server wie Playwright zu installieren. Jetzt kann Claude einen echten Browser öffnen, Buttons klicken und CSS fixen, basierend auf dem, was es sieht.
    *   *Security Note:* Du kannst Tools in deinen Settings automatisch genehmigen (Auto-Approve), um den Workflow zu beschleunigen.

## 7. Skalierung

Hör auf, auf Menschen zu warten, die deinen Code reviewen.

*   **GitHub Integration:** Installiere die Claude App. Sie wird nun jeden Pull Request automatisch auf Bugs und Sicherheitsrisiken prüfen.
*   **Architektur:** Es läuft in GitHub Actions. Du kannst sogar Custom Instructions in `.github/workflows` hinzufügen, um ihm die spezifischen Coding-Standards deines Teams beizubringen.
*   **Das SDK:** Willst du Pipelines bauen? Importiere das Claude Code SDK in deine Python- oder TypeScript-Skripte, um diese Intelligenz direkt in deinen CI/CD-Workflow einzubetten.

---

Wir sind keine kompletten Anfänger mehr in Claude Code.

![Skill Tree](/images/knowledge/claude-code-guide/footer.jpg)

---
*Quelle: [hoeem auf X](https://x.com/hooeem/status/2007914329748668472)*
