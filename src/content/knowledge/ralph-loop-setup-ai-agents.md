---
title: "Ralph Loop: Das ultimative Setup für langlaufende AI-Coding-Agents"
description: "Ein detaillierter Guide zum Einrichten des Ralph Loops, um AI-Agents über Stunden hinweg autonom arbeiten zu lassen, ohne dass das Context Window gesättigt wird."
category: workflows
icon: Repeat
readTime: 12 Min
tags: ["ai-agents", "ralph-loop", "claude-code", "automation", "workflow"]
sourceURL: "https://x.com/d4m1n/status/2026032801322356903"
sourceType: "thread"
author: "Dan ⚡️"
sourceDate: "2026-02-23"
addedDate: "2026-02-28"
---

![Ralph Loop Setup Header](/images/knowledge/ralph-loop-setup-ai-agents/header.jpg)

> **Quelle:** Dieser Artikel basiert auf einem Thread von [Dan ⚡️ (@d4m1n)](https://x.com/d4m1n/status/2026032801322356903).

In der Welt der AI-gestützten Softwareentwicklung ist das größte Problem meist nicht die Qualität des Codes, sondern die Sättigung des **Context Windows**. Nach einiger Zeit verliert die KI den Faden, vergisst frühere Anweisungen und die Qualität der Ergebnisse sinkt drastisch. Der **Ralph Loop** ist ein Workflow, der dieses Problem löst, indem er Aufgaben in diskrete Iterationen zerlegt, die jeweils in einem frischen Kontext ausgeführt werden.

Dan (@d4m1n) hat dieses System genutzt, um vier Projekte erfolgreich zu "shippen" – ein Lauf dauerte **37 Stunden am Stück** und erledigte **250 Aufgaben** aus einem 2.000-zeiligen Anforderungsdokument, während er AFK (Away From Keyboard) war.

---

## Warum der Ralph Loop funktioniert

Die meisten AI-Coding-Sessions sterben, wenn das Context Window voll wird. Das Modell gerät in die "Dumb Zone".

Ralph umgeht dies vollständig:
- **Frischer Kontext:** Jede Iteration startet mit einem leeren Context Window.
- **Zustand (State):** Der Fortschritt wird in Textdateien und Git-Commits gespeichert, nicht im Gedächtnis der KI.
- **Iteration:** Die KI liest die Aufgabenliste, wählt die nächste aus, implementiert sie, verifiziert sie durch Tests, committet die Änderungen und beendet die Session. Die nächste Iteration beginnt sauber von vorn.

---

## Was du benötigst

Für dieses Setup brauchst du lediglich zwei Dinge:
1.  **Docker:** Der Loop läuft in einem isolierten Sandbox-Container.
2.  **Claude Code:** Anthropic's CLI für agentenbasiertes Coding (Alternativ: Gemini CLI, Codex, Copilot CLI).

---

## Schritt 1: Das Projekt vorbereiten (Bootstrapping)

Dieser Schritt ist nicht zwingend erforderlich, spart aber Token und gibt dir ein stabileres Fundament. Erstelle dein Projekt mit deinem bevorzugten Stack:

```bash
npx @tanstack/cli@v0.59.0 create lib --add-ons shadcn,eslint,form,tanstack-query --no-git
```

**Wichtig:** Installiere **Playwright** und **Vitest**. Der Ralph Loop nutzt Tests, um seine eigene Arbeit zu verifizieren. Ohne Tests "halluziniert" der Agent Fortschritte, ohne zu prüfen, ob die Funktionen tatsächlich laufen.

Bereite deine API-Keys (Datenbank, Payment, LLM) in einer `.env` Datei vor (füge sie unbedingt zur `.gitignore` hinzu).

---

## Schritt 2: Ralph Loop installieren

Führe diesen Befehl in deinem Projektverzeichnis aus:

```bash
npx @pageai/ralph-loop
```

Dies erstellt ein `.agent/` Verzeichnis mit der notwendigen Struktur:

- `PROMPT.md`: Die Hauptanweisungen für die Iterationen.
- `SUMMARY.md`: Zusammenfassung des Projekts für den Kontext.
- `STEERING.md`: Erlaubt es dir, den Agenten während des Laufs zu steuern.
- `tasks.json`: Die Tabelle aller Aufgaben.
- `tasks/`: Verzeichnis für individuelle Aufgabenspezifikationen.
- `prd/`: Hier liegen deine Product Requirements Documents.
- `logs/`: Tracking des Fortschritts.

---

## Schritt 3: Das PRD und die Aufgaben erstellen

Das Erstellen guter Anforderungen ist der schwierigste Teil. Ralph bringt jedoch ein Skill mit, der dies automatisiert. Öffne Claude Code und nutze den `prd-creator`:

```markdown
Use the prd-creator skill to help me create a PRD and task list for these requirements:
You are building an app that does X.
- Support sign up via email and Google.
- Dashboard with a sidebar.
- Integrate with [API] — see @docs/API_DOCS.md.
- Use Next.js, TailwindCSS, shadcn/ui.
```

**Tipps für bessere Anforderungen:**
- **Dokumentation:** Speichere Drittanbieter-Docs als Markdown in deinem Projekt und referenziere sie mit `@docs/FILE.md`. Das verhindert, dass der Agent raten muss.
- **API-Keys:** Bereite sie in der `.env` vor, damit Integrationstests real durchgeführt werden können.
- **Interviews:** Wenn du dir unsicher bist, sage: *"Interview me about the payment integration."* Der Agent wird dir die richtigen Fragen stellen.

**Review:** Lies jede generierte Aufgabe sorgfältig durch. Es ist viel günstiger, eine Aufgabenspezifikation zu korrigieren, als 10 schlechte Commits rückgängig zu machen.

---

## Schritt 4: Docker Sandbox vorbereiten

Da der Loop in einer Sandbox läuft, muss Claude Code einmalig autorisiert werden:

```bash
docker sandbox run claude .
```

Bestätige mit "Yes", um den Berechtigungsmodus zu umgehen, und beende die Session wieder.

---

## Schritt 5: Den Loop starten

Fange klein an, um das Verhalten zu beobachten:

```bash
./ralph.sh -n 2
```

Wenn alles gut aussieht, skaliere hoch:

```bash
./ralph.sh -n 10
```

Und wenn du Vertrauen in das Setup hast, lass es über Nacht laufen:

```bash
./ralph.sh -n 30
```

Ralph wählt die Aufgabe mit der höchsten Priorität, implementiert sie, führt Tests aus, committet und macht weiter. Wenn alle Aufgaben erfüllt sind (oder die Iterationsanzahl erreicht ist), stoppt der Loop.

---

## Während des Laufs steuern (Steering)

Du musst den Prozess nicht unterbrechen, um Prioritäten zu ändern. Editiere einfach die Datei `.agent/STEERING.md`. Der Agent liest diese Datei zu Beginn jeder Iteration. Wenn du einen kritischen Bug findest, schreibe ihn dort hinein, und der Agent wird ihn vor der nächsten Aufgabe bearbeiten.

---

## Überprüfung der Ergebnisse

Ralph hinterlässt eine klare Spur seiner Arbeit:
- `.agent/logs/LOG.md`: Chronologisches Protokoll der erledigten Arbeit.
- `.agent/history/`: Der vollständige Output jeder Iteration.
- `git log`: Jede abgeschlossene Aufgabe ist ein eigener Commit.

Sollte etwas schiefgelaufen sein, nutze einfach `git revert` für den fehlerhaften Commit. Die Tests für diese Aufgabe werden beim nächsten Lauf fehlschlagen, und Ralph wird versuchen, sie erneut korrekt zu lösen.

---

## Wo Ralph glänzt – und wo nicht

### Stärken:
- **Prototyping & MVPs:** Von der Idee zur funktionierenden App in Rekordzeit.
- **Automatisierte Tests:** Schreiben von E2E- und Unit-Tests, die manuell Stunden kosten würden.
- **Migrationen:** Verschieben einer gesamten Codebasis auf eine neue Framework-Version.
- **Repetitive Aufgaben:** Massen-Refactoring, Boilerplate oder Umstrukturierung von Dateien.

### Schwächen:
- **Pixel-Perfect Design:** Nuancierte UX und komplexe Interaktions-Flows benötigen menschliches Auge.
- **Neuartige Architekturen:** Einzigartige Systeme ohne bestehende Muster.
- **Sicherheitskritischer Code:** Überall dort, wo Edge-Cases absolut ausgeschlossen sein müssen.

---

## Fazit: Deine neue Rolle

Mit dem Ralph Loop ändert sich deine Rolle als Entwickler. Du bist nicht mehr derjenige, der jede Zeile tippt, sondern derjenige, der **plant, delegiert und reviewt**.

Die wichtigste Fähigkeit im Jahr 2026 ist nicht schnelles Tippen, sondern das präzise **Beschreiben von Anforderungen**: UI-Specs, Flows, Constraints und Integrationen. Ralph ist nur der Motor – das Lenkrad und die Route liegen in deiner Hand.
