---
title: Writing a good CLAUDE.md
description: >-
  Best Practices für das Erstellen einer effektiven CLAUDE.md Datei für Claude
  Code und andere Agenten.
category: fundamentals
icon: FileText
readTime: 6 Min
tags: ["claude-code", "prompt-engineering", "best-practices", "docs"]
sourceURL: 'https://www.humanlayer.dev/blog/writing-a-good-claude-md'
sourceType: blog
author: Kyle (HumanLayer)
level: advanced
hot: true
addedDate: "2026-02-01"
---

## Prinzip: LLMs sind (meistens) zustandslos

LLMs sind zustandslose Funktionen. Ihre Gewichte sind zum Zeitpunkt der Inferenz eingefroren, sie lernen also nicht im Laufe der Zeit dazu. Das Einzige, was das Modell über deine Codebase weiß, sind die Token, die du ihm gibst.

Coding Agents wie Claude Code erfordern normalerweise, dass du das Gedächtnis des Agenten explizit verwaltest. `CLAUDE.md` (oder `AGENTS.md`) ist die einzige Datei, die standardmäßig in **jede einzelne Konversation** mit dem Agenten einfließt.

Das hat drei wichtige Auswirkungen:
1. Coding Agents wissen zu Beginn einer Session absolut nichts über deine Codebase.
2. Dem Agenten muss jedes Mal alles Wichtige über deine Codebase mitgeteilt werden.
3. `CLAUDE.md` ist der bevorzugte Weg, dies zu tun.

## CLAUDE.md onboardet Claude in deine Codebase

Da Claude zu Beginn nichts weiß, solltest du `CLAUDE.md` nutzen, um Claude in deine Codebase einzuführen. Auf einer hohen Ebene sollte es folgendes abdecken:

*   **WHAT**: Erzähle Claude von der Technologie, dem Stack, der Projektstruktur. Gib Claude eine Karte der Codebase. Das ist besonders wichtig in Monorepos! Was sind die Apps, die Shared Packages, und wofür ist alles da?
*   **WHY**: Erzähle Claude den **Zweck** des Projekts. Was ist die Funktion der verschiedenen Teile?
*   **HOW**: Erzähle Claude, wie es am Projekt arbeiten soll. Nutzt du `bun` statt `node`? Wie kann Claude seine Änderungen verifizieren? Wie führt man Tests, Typechecks und Kompilierungsschritte aus?

**Wichtig:** Versuche nicht, jeden möglichen Befehl in deine `CLAUDE.md` zu stopfen – das führt zu suboptimalen Ergebnissen.

## Claude ignoriert CLAUDE.md oft

Unabhängig vom Modell wirst du feststellen, dass Claude den Inhalt deiner `CLAUDE.md` häufig ignoriert.

Claude Code injiziert einen System-Reminder, der besagt, dass der Kontext (deine `CLAUDE.md`) möglicherweise nicht relevant für die aktuelle Aufgabe ist und ignoriert werden soll, wenn er nicht "hochgradig relevant" ist.

```xml
<system-reminder>
      IMPORTANT: this context may or may not be relevant to your tasks. 
      You should not respond to this context unless it is highly relevant to your task.
</system-reminder>
```

Je mehr Informationen in der Datei stehen, die nicht **universell anwendbar** auf deine Aufgaben sind, desto wahrscheinlicher ist es, dass Claude deine Anweisungen ignoriert.

## Eine gute CLAUDE.md erstellen

Hier sind Empfehlungen basierend auf Context Engineering Best Practices.

### Weniger (Anweisungen) ist mehr

Es ist verlockend, jeden Befehl und alle Style-Guides in die `CLAUDE.md` zu packen. Wir raten davon ab.

Forschungen deuten auf Folgendes hin:
*   Frontier Thinking LLMs können etwa 150-200 Anweisungen mit vernünftiger Konsistenz befolgen.
*   Kleinere Modelle werden **sehr viel schneller, sehr viel schlechter**, wenn die Anzahl der Anweisungen steigt (exponentieller Abfall).
*   LLMs bevorzugen Anweisungen am Anfang und am Ende des Prompts.
*   Mit steigender Anzahl der Anweisungen sinkt die Qualität der Befolgung **gleichmäßig** für alle Anweisungen.

![Instruction following](/images/knowledge/writing-a-good-claude-md/instructionfollowing.png)

Da der System-Prompt von Claude Code bereits ca. 50 Anweisungen enthält, sollte deine `CLAUDE.md` so wenige Anweisungen wie möglich enthalten – idealerweise nur solche, die universell anwendbar sind.

### CLAUDE.md Länge & Anwendbarkeit

Ein LLM performt besser, wenn sein Context Window voll mit fokussiertem, relevantem Kontext ist. Da `CLAUDE.md` in **jede Session** geladen wird, sollte der Inhalt so universell wie möglich sein.

Vermeide Anweisungen, die nur für spezifische Aufgaben relevant sind (z.B. Datenbankschema-Struktur, wenn du gerade am Frontend arbeitest).

Genereller Konsens: **< 300 Zeilen** ist am besten, kürzer ist besser. HumanLayer nutzt eine Datei mit weniger als 60 Zeilen.

### Progressive Disclosure

Um alles abzudecken, ohne die `CLAUDE.md` aufzublähen, nutze das Prinzip der **Progressive Disclosure**.

Lagere aufgabenspezifische Anweisungen in separate Markdown-Dateien aus, z.B. in einem `agent_docs/` Ordner:

```
agent_docs/
  |- building_the_project.md
  |- running_tests.md
  |- code_conventions.md
  |- database_schema.md
```

In deiner `CLAUDE.md` listest du diese Dateien mit einer kurzen Beschreibung auf und instruierst Claude, zu entscheiden, welche (wenn überhaupt) relevant sind und diese zu lesen.

> **Tipp:** Nutze Referenzen (`file:line`) statt Kopien von Code-Snippets, damit diese nicht veralten.

### Claude ist (k)ein teurer Linter

Packe keine Code-Style-Guidelines in deine `CLAUDE.md`.

> **Schicke niemals ein LLM, um den Job eines Linters zu erledigen.**

LLMs sind teuer und langsam im Vergleich zu Lintern. Nutze deterministische Tools (Prettier, Biome, ESLint). Style-Guides blähen den Kontext auf und verschlechtern die Performance.

Wenn nötig, nutze einen **Stop Hook**, der Linter/Formatter ausführt und Fehler an Claude zurückgibt, oder einen Slash Command.

### Nutze kein /init oder auto-generierte CLAUDE.md

Da `CLAUDE.md` den **höchsten Hebel** im Harness hat (es beeinflusst jede Phase), solltest du es nicht automatisch generieren lassen.

Eine schlechte Zeile in der `CLAUDE.md` kann zu vielen schlechten Zeilen Code führen. Denke über jede Zeile sorgfältig nach.

![Leverage](/images/knowledge/writing-a-good-claude-md/leverage.png)

## Fazit

*   `CLAUDE.md` definiert **WHY**, **WHAT** und **HOW**.
*   Halte es **kurz und universell** (< 300 Zeilen).
*   Nutze **Progressive Disclosure** (Verweise auf andere Docs).
*   Claude ist kein Linter.
*   Schreibe die Datei von Hand, generiere sie nicht automatisch.
