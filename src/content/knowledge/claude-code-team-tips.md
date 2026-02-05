---
title: "10 Profi-Tipps vom Claude Code Team"
description: "Boris Cherny, der Schöpfer von Claude Code, teilt 10 exklusive Tipps und Best Practices direkt aus dem internen Anthropic-Team."
category: workflows
icon: Code2
readTime: 6 Min
tags: ["claude-code", "anthropic", "workflows", "ai-coding", "productivity"]
sourceURL: "https://x.com/bcherny/status/2017742741636321619"
sourceType: "thread"
author: "Boris Cherny"
sourceDate: "2026-01-31"
---

> **Hinweis**: Dieser Artikel basiert auf einem [Tweet-Thread von Boris Cherny](https://x.com/bcherny/status/2017742741636321619), dem Schöpfer von Claude Code, vom 31. Januar 2026.

![Claude Code Team Tips](/images/knowledge/claude-code-team-tips/header.webp)

Boris Cherny hat kürzlich 10 Tipps geteilt, die direkt aus der täglichen Arbeit des Claude Code Teams bei Anthropic stammen. Da das Team Claude Code anders nutzt als Boris selbst, zeigt dies, dass es nicht den *einen* richtigen Weg gibt – Experimentieren ist der Schlüssel.

## 1. Parallelisierung ist der größte Hebel
Der wichtigste Tipp des Teams: Nutze 3-5 `git worktrees` gleichzeitig, wobei jeder seine eigene Claude-Sitzung ausführt. 
- Einige nutzen Shell-Aliase (z.B. `za`, `zb`, `zc`), um mit einem Tastendruck zwischen den Sitzungen zu springen.
- Andere haben einen dedizierten "Analyse"-Worktree, der nur zum Lesen von Logs und Ausführen von BigQuery-Abfragen dient.
- **Vorteil:** Getrennte Arbeitsverzeichnisse bedeuten getrennte Kontexte für Claude. Keine "Kontamination" zwischen verschiedenen Aufgaben.

## 2. Neu planen, wenn es stockt
Obwohl alle im Team den `Plan Mode` nutzen, variiert die Disziplin. Ein cleveres Pattern: Lasse Claude einen Plan schreiben und starte dann eine zweite Claude-Instanz, um diesen Plan "als Staff Engineer" zu reviewen, bevor die Ausführung beginnt.
- **Wichtig:** Wenn eine Aufgabe mittendrin schiefgeht, wechsle zurück in den `Plan Mode` und erstelle einen neuen Plan. Versuche nicht, den fehlerhaften Pfad mit Gewalt zu erzwingen.

## 3. Claude schreibt seine eigenen Regeln
Nach jeder Korrektur solltest Du Deinen Prompt mit folgendem Satz beenden:
> "Aktualisiere Deine `CLAUDE.md`, damit Du diesen Fehler nicht noch einmal machst."

Das Team bearbeitet die `CLAUDE.md` unermüdlich und iteriert so lange, bis Claudes Fehlerrate messbar sinkt. Claude ist erstaunlich gut darin, Regeln für sich selbst zu verfassen.

## 4. Skills als institutionelles Wissen
Alles, was Du mehr als einmal am Tag tust, sollte ein `Skill` werden. Beispiele aus dem Team:
- `/techdebt`: Findet und eliminiert duplizierten Code am Ende jeder Sitzung.
- `Context dump`: Ein Slash-Command, der Slack, Google Drive, Asana und GitHub der letzten 7 Tage in einen Kontext synchronisiert.
- `Analytics agents`: Schreiben dbt-Modelle, reviewen Code und testen Änderungen in der Dev-Umgebung.
- Skills, die in Git eingecheckt sind, werden zu institutionellem Wissen für das gesamte Team.

## 5. Claude behebt seine eigenen Bugs
Das Team nutzt das Slack-MCP, kopiert einen Bug-Thread in Claude und sagt einfach "fix". 
- Es ist kein Kontextwechsel erforderlich. 
- Du kannst auch sagen: "Geh und behebe die fehlschlagenden CI-Tests." Mikromanagement ist hier kontraproduktiv – vertraue darauf, dass Claude den Pfad findet.

## 6. Prompting als Herausforderung
Nutze diese drei Muster, um Claudes Output zu verbessern:
- "Hinterfrage diese Änderungen kritisch und erstelle keinen PR, bis ich Deinen Test bestanden habe." (Claude als Reviewer, nicht nur als Umsetzer).
- "Beweise mir, dass das funktioniert." (Lasse Claude das Verhalten zwischen `main` und Deinem Feature-Branch vergleichen).
- Nach mittelmäßigen Fixes: "Mit allem, was Du jetzt weißt – verwirf das und implementiere die elegante Lösung."

## 7. Das Terminal-Setup ist entscheidend
Das Team bevorzugt **Ghostty** aufgrund des synchronisierten Renderings, der 24-Bit-Farben und der korrekten Unicode-Unterstützung.
- Nutze `/statusline`, um Kontext-Auslastung und Git-Branch jederzeit im Blick zu behalten.
- Nutze **Sprachdiktat** (z.B. Fn x2 auf macOS). Man spricht 3x schneller als man tippt, was zu detaillierteren und nuancierteren Prompts führt.

## 8. Subagents für Kontext-Hygiene
Drei Subagent-Patterns aus dem Team:
- "Nutze Subagents": Hänge dies an jede Anfrage an, bei der Claude mehr "Rechenpower" auf das Problem werfen soll.
- **Auslagern zur Kontextschonung:** Schicke einzelne Aufgaben an Subagents, um das Kontextfenster Deines Hauptagenten sauber und fokussiert zu halten.
- **Permission Routing:** Leite Berechtigungsanfragen an ein mächtigeres Modell (wie Opus 4.5) weiter, um sie auf Angriffe zu scannen und sichere Anfragen automatisch zu genehmigen.

## 9. Claude ersetzt SQL
Das Team nutzt einen in die Codebase eingecheckten BigQuery-Skill für Analytics-Abfragen direkt in Claude Code. 
- Boris berichtet, dass er seit über 6 Monaten keine Zeile SQL mehr selbst geschrieben hat.
- Der entscheidende Vorteil ist nicht, dass Claude SQL beherrscht, sondern dass Du in Deinem Kontext bleiben kannst, während Claude die Übersetzungsschicht übernimmt.

## 10. Lernen mit Claude
Claude Code eignet sich hervorragend, um unbekannten Code zu verstehen:
- Aktiviere den "Explanatory"- oder "Learning"-Stil in der `/config`.
- Lasse Claude HTML-Präsentationen oder ASCII-Diagramme erstellen, um komplexe Protokolle oder Code-Strukturen zu erklären.
- Erstelle einen "Spaced-Repetition"-Skill, bei dem Claude Dein Verständnis abfragt und Wissenslücken schließt.

## Das Meta-Pattern
Hinter den unterschiedlichen Workflows steht eine gemeinsame Philosophie:
1. **Parallelisierung schlägt Optimierung:** Führe mehr Sitzungen aus, nicht unbedingt "klügere" Sitzungen.
2. **Plan Mode ist zur Rettung da:** Plane neu, wenn Du feststeckst.
3. **Claude verbessert sich selbst:** Lass ihn seine eigenen Regeln schreiben.
4. **Skills kumulieren:** Automatisiere, was Du wiederholst.
5. **Herausfordern statt Instruieren:** Behandle Claude wie einen Kollegen, den Du überzeugen musst.
