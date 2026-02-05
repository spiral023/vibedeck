---
title: Agent Skills vs. Rules vs. Commands
description: >-
  Ein Deep Dive von Alice Alexandra Moore in das mentale Modell für AI-Kontext:
  Wann nutzt man Skills, Rules, Commands oder Subagents?
category: fundamentals
icon: Layers
readTime: 5 Min
tags: ["agents", "claude-skills", "context-engineering", "patterns"]
sourceURL: 'https://x.com/tempoimmaterial/status/2014054104658526645'
sourceType: tweet
author: Alice Alexandra Moore (@tempoimmaterial)
sourceDate: '2026-01-21'
---

![Agent Skills vs Rules Header](/images/knowledge/agent-skills-vs-rules/header.jpg)

Wenn es sich so anfühlt, als würden deine AI-Coding-Tools zu einem Ordner voller magischer Markdown-Dateien werden: Du bildest es dir nicht ein.

Die Labels variieren, aber die Verwirrung ist konstant. Das neueste Markdown-File, über das alle sprechen, sind **Skills**: Kontext, den ein Agent entdecken und laden kann, wenn er relevant ist.

Schauen wir uns an, was sie sind, wann man sie nutzt und wie man eine nützliche Library aufbaut.

## Was sind Agent Skills?

Skills nutzen oft den [Agent Skills Standard](https://agentskills.io/home). Denk an sie als standardisierte Container für Instruktionen.

Ein Skill ist im Grunde ein Ordner mit zwei Dingen:
1.  Ein `SKILL.md` Definitions-File mit Metadaten und Instruktionen.
2.  Optionale Extras (Skripte, Templates, Docs).

Der clevere Teil ist **Progressive Disclosure** (schrittweise Offenlegung).

![Progressive Disclosure Diagram](/images/knowledge/agent-skills-vs-rules/progressive-disclosure.png)

Der Agent liest nicht alle Skills beim Start. Er scannt nur Namen und Beschreibung. Erst wenn er entscheidet, dass ein Skill relevant ist, lädt er den vollen Inhalt. Das hält den Kontext sauber ("Lazy Loading für Kontext").

## Das mentale Modell: Rules vs. Commands vs. Skills

Wann nutzt du was? Hier ist die Entscheidungs-Matrix:

*   **Rules (Regeln):** Unveränderlich. Gelten immer. Keine Ausnahmen.
*   **Commands (Befehle):** Dein expliziter Wille. Du tippst `/command`, weil du das Steuer übernehmen willst.
*   **Skills (Fähigkeiten):** Optionale Expertise. Der Agent holt sie aus dem Regal, wenn der Task es erfordert.

![Decision Tree Flowchart](/images/knowledge/agent-skills-vs-rules/decision-tree.png)

## Skills vs. Rules: Halte Regeln kurz

Skills ersetzen keine Regeln. Aber sie ändern, wie du Regeln schreibst.

*   **Rules:** Repo-Anforderungen, Sicherheits-Constraints, Naming Conventions.
*   **Skills:** Playbooks für spezifische Workflows, Tooling, Reviews.

> **Litmus-Test:** Willst du, dass diese Instruktion gilt, auch wenn du nicht daran denkst?
> Ja? -> **Rule**.
> Nein? -> **Skill**.

Ein gutes Pattern ist, Regeln als **Routing-Logik** zu nutzen:
*"Wenn du UI-Komponenten änderst, lade den `ui-change` Skill."*

## Hierarchische Regeln vs. Komposition

Viele Tools erlauben vererbte Regeln (Global -> Repo -> Folder). Das kann schnell unübersichtlich werden. Skills bieten eine bessere, komponierbare Alternative.

![Inheritance vs Composition](/images/knowledge/agent-skills-vs-rules/inheritance-vs-composition.jpg)

## Skills vs. Commands

*   **Command:** Deterministisch. "Tu das jetzt."
*   **Skill:** Vorschlag. "Hier ist Wissen, falls du es brauchst."

**Best Practice:** Kombiniere sie.
Nutze Commands als Shortcuts (`/release`), die im Hintergrund Skills laden und Checklisten abarbeiten. Commands sind für Ergonomie, Skills für Struktur.

## Bonus: Skills vs. Agents (Subagents)

Ein Skill ändert, **was** der Agent weiß. Ein Agent ändert, **wer** die Arbeit macht (System Prompt, Tools, Modell).

![Subagents Diagram](/images/knowledge/agent-skills-vs-rules/subagents.png)

Nutze einen Skill, wenn du willst, dass dein *aktueller* Assistent einem besseren Prozess folgt. Nutze einen separaten Agenten, wenn du Isolation oder einen Spezialisten brauchst (z.B. einen "Plan"-Agenten, der nur liest und denkt, oder einen "Research"-Agenten).

## Wie man einen guten Skill schreibt

1.  **Beschreibung ist Routing:** Wenn der Agent den Skill nicht findet, ist der Code darin wertlos. Nutze Keywords.
2.  **Minimales Definitions-File:** Behandle `SKILL.md` wie einen Quick-Start-Guide, nicht wie ein Wiki.
3.  **Verlinke Artefakte:** Lagere lange Templates in separate Dateien aus.
4.  **Definiere "Done":** Reduziere Ambiguität.

## Starter Skill Library

Hier sind Basics, die jedes Projekt braucht:
*   **Repo Orientation:** Wo ist was?
*   **UI Changes:** Design Tokens, Accessibility.
*   **Debugging:** Wie reproduziert man Issues?
*   **Verification:** Wie beweist man, dass es funktioniert?
*   **PR Hygiene:** Commit Messages, Changelogs.
*   **Safety:** Was darf man nicht löschen?

---

**Fazit:**
Nutze Regeln für Invarianten, Commands für Workflows und Skills für optionales Expertenwissen. Wenn du diesen Split einhältst, fühlt sich dein Agent weniger wie ein brüchiges Skript an und mehr wie ein echter Kollaborateur.
