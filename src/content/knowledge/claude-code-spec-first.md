---
title: How I Use Claude Code (Full Guide)
description: >-
  Der vollständige, ungekürzte Guide von Ashpreet Bedi zur Nutzung von Claude
  Code für komplexe Software-Features mittels Spec-First Development.
category: fundamentals
icon: Code2
readTime: 7 Min
tags: ["claude-code", "workflows", "agentic-coding", "testing"]
sourceURL: 'https://x.com/ashpreetbedi/status/2011220028453241218'
sourceType: thread
author: Ashpreet Bedi
sourceDate: '2026-01-14'
addedDate: "2026-02-01"
level: advanced
---

![How I Use Claude Code Header](/images/knowledge/claude-code-spec-first/header.png)

Ich habe eines unserer komplexesten Features – **Learning Machines** – in 5 Tagen gebaut. 100% des Codes wurden von Claude Code geschrieben. Das hätte früher Monate gedauert.

**Kontext:**
Ich baue [Agno](https://agno.link/gh), eine Open-Source Multi-Agent Runtime. Agno ist eine performance-kritische Anwendung mit vielen beweglichen Teilen: Agent Loop, Datenbank-Integrationen, Vector Store Integrationen, Toolkits, Runtime mit Per-Request-Isolation, Multi-Agent Orchestrierung (autonom: Teams und programmatisch: Workflows).

Bis November 2025 konnten Coding Agents die Codebase nicht bewältigen. Dann änderten Opus 4.5 und Claude Code das.

Jetzt baue ich Agno v3 vollständig mit Claude Code.

## Der Wandel (The Shift)

Wenn du Coding Agents nutzt, musst du deine Arbeitsweise komplett ändern. Claude übernimmt Feature-Design, Implementierung, Testing und Dokumentation. Ich orchestriere nur noch.

**Mein neuer Workflow:**
*   Designs in Notion → Designs in Markdown
*   Menschen schreiben Code → Claude schreibt Code
*   Menschen schreiben Tests → Claude schreibt Tests + Cookbooks
*   Menschen reviewen Code → Claude reviewt, Mensch gibt frei (approves)
*   Kontext verstreut → Kontext lebt im Code

Ich definiere **was** gebaut wird und **warum**. Claude kümmert sich um das **wie**.

## Spec-First Development

Um Coding Agents gut zu nutzen, musst du ihnen den richtigen Kontext geben. Ich befolge das, was ich "Spec-First Development" nenne.

Ich habe ein privates `specs/` Repository, das in Agno symlinked (verknüpft) ist:
Der Symlink ist in `.gitignore`. Unsichtbar für Git, sichtbar für Claude.

Darin folgt jedes Feature derselben Struktur:

## Warum das funktioniert (Why This Works)

*   **`design.md`** ist die "Source of Truth" (Wahrheitsquelle). Claude und ich stimmen die Details ab, bevor die Entwicklung beginnt. Keine Spec, keine Implementierung.
*   **`implementation.md`** verfolgt den Fortschritt – was ist erledigt, was ist blockiert. Claude aktualisiert dies, während wir vorankommen. Das ist entscheidend für die **Session-Kontinuität**: Wenn wir an Kontext-Limits stoßen und neu starten müssen, macht Claude dort weiter, wo es aufgehört hat.
*   **`decisions.md`** erfasst das "Warum". Ich glaube, die Leute nennen das jetzt "Decision Traces" – so weiß der Agent (und mein zukünftiges Ich), warum wir einen Ansatz einem anderen vorgezogen haben. Hier bringe ich mich auch bei wichtigen Entscheidungen ein.
*   **`prompts.md`** speichert wiederverwendbare Prompts, um Design-Docs mit der Codebase neu zu synchronisieren (Re-sync). Verfeinern und Reviewen. Testen nach einer neuen Implementierung. Häufige Aufgaben werden zu Copy-Paste.
*   **`future-work.md`** erfasst, was aufgeschoben wurde. Ideen, die es wert sind, später wieder aufgegriffen zu werden.

Ich weiß, du denkst vielleicht, das sei viel Arbeit, um einen Coding Agent zu nutzen, aber **Claude Code schreibt das**. Ich schreibe nichts davon. Ich schreibe kaum Code, denkst du, ich schreibe Docs?

## Geschichtete Anweisungen (Layered Instructions)

Hier wird es interessant.

Ich habe eine **`CLAUDE.md`** auf **Repo-Ebene**:
Und eine **`CLAUDE.md`** auf **Feature-Ebene**.

Die Root-`CLAUDE.md` sagt Claude, wie es in der Codebase navigieren soll. Die Feature-`CLAUDE.md` sagt Claude, wie es an diesem spezifischen Ding arbeiten soll. Die Root-Datei bleibt stabil. Die Feature-Datei entwickelt sich mit der Arbeit.

Wenn ich Claude Code im Agno-Repo öffne und anfange, an der Learning Machine zu arbeiten, hat Claude beide Sätze von Anweisungen.

## Der eigentliche Workflow (The Actual Workflow)

Hier ist, wie ein Feature gebaut wird:

1.  Ich transkribiere ein Feature schlecht mit Whisper Flow.
2.  Claude überprüft die Codebase, das `specs/` Repo und schreibt dann ein Design-Dokument aus meiner lose definierten Idee.
3.  Ich überprüfe alles. Hier fließt der Großteil meiner Gehirnleistung hin.
4.  Ich bitte Claude, ein spezifisches Stück zu implementieren.
5.  Ich bitte Claude, Cookbooks und Tests zu schreiben.
6.  Ich überprüfe, was Claude produziert, bitte es zu testen und zu verbessern.
7.  Iterieren bis es korrekt ist.
8.  Claude aktualisiert `implementation.md`.
9.  Weiter zum nächsten Stück.

Es ist sehr wichtig, dass Claude immer nur an **einem kleinen Stück** gleichzeitig arbeitet. Faustregel: Jeder PR sollte weniger als 10 Minuten zum Reviewen brauchen. Ich erzwinge das in der `CLAUDE.md`.

## Cookbooks oder es ist nicht passiert (Cookbooks or It Didn't Happen)

Jedes Pattern braucht ein ausführbares Beispiel. Keine Ausnahmen.

Wenn Claude etwas implementiert, schreibt es auch ein Cookbook:
Wenn das Cookbook nicht läuft, ist die Implementierung nicht fertig. Es ist mir egal, wie sauber der Code aussieht.

Die Learning Machine hat 26 Cookbook-Dateien über 8 Ordner. Jede testet ein spezifisches Pattern. Jede einzelne läuft. So weiß ich, dass es funktioniert.

Der spaßige Teil ist, dass Claude die Cookbooks ausführt und die Ergebnisse in `TESTING.md` speichert. Du denkst, ich scherze? Schau dir [das hier an](https://github.com/agno-agi/agno/blob/main/cookbook/15_learning/testing.md).

## Modell-Wahl (Model Choice)

Opus 4.5. iykyk (if you know you know).

## Plan Mode. Nutze ihn.

`Shift + Tab`. Plan Mode.

Die Agno-Codebase ist ziemlich komplex und jedes Mal, wenn ich direkt in die Implementierung gesprungen bin, war der Output Mist.

Ich bevorzuge es, Informationen vorzuladen (Front-loading). Architektur-Entscheidungen, Edge Cases, Constraints. Alles davon. Fünf Minuten Planung haben mir Stunden gespart. Wenn du besorgt bist, das alles tippen zu müssen: Transkribiere es einfach. Ich tippe kaum noch.

## TLDR

*   **Nutze Spec-Files.** Symlinke deinen Specs-Ordner in deine Codebase. `design.md`, `implementation.md`, `decisions.md`, `prompts.md`. Claude schreibt sie.
*   **`CLAUDE.md` auf zwei Ebenen.** Root-Level für die Codebase, Feature-Level für spezifische Arbeit.
*   **Speichere deine Prompts.** Häufige Aufgaben werden zu Copy-Paste. Zu viel Tippen? Du hast es erraten, Claude schreibt auch die Prompts. Bleib dran.
*   **Cookbooks für alles.** Wenn es nicht läuft, ist es nicht fertig.
*   **Kontext degradiert bei 30%.** Eine Konversation pro Feature. Externes Gedächtnis via Spec-Files. `Clear` wenn nötig.
*   **Opus 4.5 ist AGI.**

Wenn ich sage, Claude schreibt 100% meines Codes, meine ich das ernst. Ich reviewe immer noch jede Zeile. Ich bin nur nicht derjenige, der tippt.
