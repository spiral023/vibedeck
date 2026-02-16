---
title: "Wie Claude Code Skills funktionieren"
description: "Ein tiefer Einblick in die Funktionsweise von Claude Code Skills, von der Anatomie eines Skills bis hin zum dreistufigen Ladesystem."
category: tooling
icon: Code2
readTime: 4 Min
tags: ["claude-code", "skills", "agent-coding", "workflow"]
sourceURL: "https://x.com/pdrmnvd/status/2020967757706297797"
sourceType: "thread"
author: "pedram.md"
sourceDate: "2026-02-09"
level: advanced
hot: true
---

![Header Image](/images/knowledge/how-claude-code-skills-work/header.jpg)

Um Skills zu verstehen, hilft es, zuerst das Problem zu verstehen, das sie lösen sollen. Immer wieder hat sich gezeigt, dass **Context Management** stark mit der Effektivität eines Modells korreliert. Das mag sich ändern, wenn Modelle intelligenter werden, aber aktuell führt ein effizientes Context Management zu besseren Ergebnissen.

## Das Problem: Fachwissen vs. Context Window

Selbst wenn wir annehmen, dass Claude intelligent ist, kann er nicht alles über Deine spezifische Domain im Voraus wissen. Erstellst Du ein Investmentbanking-Pitchdeck? Baust Du ein DCF-Modell? Generierst Du eine gebrandete PowerPoint-Präsentation? Hast Du spezielle Anforderungen an einen PR-Review oder einen Styleguide für Deine Dokumentation?

Jeder dieser Anwendungsfälle kann hunderte Zeilen spezialisierter Anweisungen, Formatierungsregeln, Referenzdokumente und Skripte erfordern.

> Du könntest all das in jede Konversation kopieren. Aber Context Windows sind endlich und teuer. Du könntest es in eine `CLAUDE.md` werfen, aber es wird vielleicht nicht in jeder Konversation benötigt.

**Skills lösen dieses Problem.** Sie sind in sich geschlossene Wissenspakete, die Claude nur dann lädt, wenn er sie tatsächlich braucht. So verwandelt er sich mitten im Gespräch vom Generalisten zum Spezialisten.

## Anatomie eines Skills

Ein Skill ist im Grunde ein Verzeichnis mit einer `SKILL.md`-Datei an der Basis. Diese Markdown-Datei besteht aus zwei Teilen: **YAML-Frontmatter** für Metadaten und einem **Body** mit den eigentlichen Anweisungen.

```yaml
---
name: ai-explainer
description: >
  Erstellt teilbare KI-Konzept-Erklärungen
  als eigenständige HTML-Seiten. Nutze dies, wenn
  der Nutzer ein KI-Konzept visuell erklären möchte.
---

# AI Concept Explainer
Du erstellst eine polierte, eigenständige HTML-Erklärung – die Art von Inhalten, die auf einem persönlichen technischen Blog leben...
```

Über die `SKILL.md` hinaus kann ein Skill-Verzeichnis weitere unterstützende Dateien enthalten, die in einer sauberen Hierarchie organisiert sind:

![Struktur eines Skills](/images/knowledge/how-claude-code-skills-work/structure.png)

## Das dreistufige Ladesystem

Skills nutzen **Progressive Disclosure**, um das Context Window schlank zu halten. Nicht alles wird auf einmal geladen, da die meisten Skills ihre vollen Anweisungen erst benötigen, wenn sie tatsächlich aufgerufen werden.

![Ladesystem](/images/knowledge/how-claude-code-skills-work/loading-system.png)

Dieses dreistufige System ist der Grund, warum Skills so mächtig sein können. Ein Design-System könnte Unmengen an Referenzmaterial, Skripten und Spezifikationen enthalten, die jedoch nur **on-demand** genutzt werden.

## Wie Skills ausgelöst werden

Es gibt zwei Wege, wie ein Skill aktiviert wird:
1. **Explizit:** Der Nutzer ruft einen Skill direkt über einen Slash-Command auf.
2. **Automatisch:** Claude gleicht die Anfrage des Nutzers mit den Skill-Beschreibungen ab und aktiviert einen passenden Skill automatisch.

![Trigger-System](/images/knowledge/how-claude-code-skills-work/triggering.png)

Das `description`-Feld im YAML-Frontmatter ist der Schlüssel zum automatischen Triggering. Es teilt Claude mit, **was** der Skill tut und **wann** er ihn nutzen sollte (inklusive Trigger-Phrasen wie "erkläre X", "erstelle einen Post über X" oder "prüfe dieses NDA"). Die Beschreibung befindet sich immer im Kontext (Layer 1), sodass Claude sie in jedem Turn abgleichen kann.

## Innerhalb einer Skill-Ausführung

Wenn ein Skill ausgelöst wird, wird der Body der `SKILL.md` als System-Nachricht in die Konversation injiziert. Von diesem Punkt an folgt Claude diesen Anweisungen wie jedem anderen Prompt.

Ein gut gestalteter Skill führt Claude durch einen Workflow. Er könnte Claude anweisen:
1. Eine Referenzdatei für Design-Specs zu lesen (`Read`).
2. Ein Python-Skript auszuführen, um ein Template zu erstellen (`Bash`).
3. Sub-Agents für parallele Aufgaben zu starten.

Die Anweisungen können so einfach wie ein Formatierungsleitfaden oder so komplex wie eine mehrphasige Pipeline sein.

## Der Design-Tradeoff

Die Kunst des Skill-Designs besteht darin, die Spannung zwischen **Spezifität** und **Kontext-Kosten** zu managen. Jedes Wort in der `SKILL.md` verbraucht Platz im geteilten Context Window. Zu vage Anweisungen führen jedoch zu inkonsistenten Ergebnissen.

![Tradeoff](/images/knowledge/how-claude-code-skills-work/tradeoff.png)

> Eine gute Faustregel: Erkläre das **Warum**, nicht nur das **Was**.

Wenn Claude die Logik hinter einer Anweisung versteht, kann er auch auf Grenzfälle generalisieren, die der Autor des Skills nie vorhergesehen hat. Starre "Tue IMMER X"-Regeln sind ein Warnsignal. Die Motivation hinter X zu erklären, ist fast immer effektiver.

## Fazit

Gut geschriebene Skills sind ein Force Multiplier. Domain-Experten sind oft die besten Skill-Ersteller, da sie Details und Präzision liefern können, die anderen entgehen. Letztendlich baust Du eine universelle Reasoning-Engine, die bei Bedarf durch injizierten Kontext spezialisiert wird.
