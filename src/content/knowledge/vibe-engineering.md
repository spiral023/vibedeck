---
title: 'Vibe Engineering: Erkenntnisse aus der Arbeit mit AI Coding Agents'
description: >-
  Ein umfassender Leitfaden von Duncan Ogilvie (mrexodia) über den
  Mentalitätswandel und die Techniken für effektive Zusammenarbeit mit
  KI-Coding-Agents.
category: patterns
icon: Sparkles
readTime: 12 Min
sourceDate: '2026-01-20'
tags: ["vibe-coding", "agentic-coding", "workflows", "patterns"]
---

> Ursprünglich veröffentlicht von [Duncan Ogilvie (mrexodia) auf X](https://x.com/mrexodia/status/2010157660885176767).

![Vibe Engineering](/images/knowledge/vibe-engineering/header.jpg)

Ich habe die letzten Monate fast ausschließlich damit verbracht, mit AI Coding Agents zu arbeiten. Kein Job, nur ich und LLMs, die zusammen Dinge bauen. Das Folgende ist alles, von dem ich wünschte, jemand hätte es mir gesagt, als ich anfing: die notwendigen Änderungen in der Denkweise, die hart erarbeiteten Lektionen und die Techniken, die für mich tatsächlich funktionieren.

> Fair warning: Wenn du ChatGPT für Coding in 2023 ausprobiert hast, entschieden hast "das kann nicht programmieren", und seitdem nicht mehr zurückgeschaut hast, arbeitest du mit veralteten Informationen. Die Dinge haben sich geändert. Viel.

## Agents sind nur Schleifen (Und das ist okay)

"Agent" war das Wort des Jahres 2025. Ich fand es immer verwirrend. Was ist überhaupt ein Agent? Es fühlte sich wie Marketing-Hype an, bis ich auf [Simon Willison's Definition](https://simonwillison.net/2025/Sep/18/agents/) stieß:

> Ein Agent führt Tools in einer Schleife aus, um ein Ziel zu erreichen.

Das ist es. Sehr abstrakt, sehr einfach. Was mich überraschte, ist, dass diese Agenten aus technischer Sicht [wirklich simpel](https://ampcode.com/how-to-build-an-agent) sind. Es ist buchstäblich nur eine `for`-Schleife. User-Input geht an das LLM, Antwort kommt zurück (vielleicht mit Tool-Calls), Ergebnisse gehen zurück in die Schleife, und weiter geht's. Das ist das ganze Ding.

Aber das ist eigentlich gut, denn es bedeutet, dass diese Systeme keine Magie sind. Man nutzt einfach die Kraft von Modellen, die unglaublich fähig sind, wenn man ihnen das richtige Setup gibt.

> Der Haken: Du **brauchst** State-of-the-Art Modelle. Open Source Modelle (wie GLM/MiniMax) werden besser, aber Opus 4.5 (oder vergleichbare Spitzenmodelle) sind auf einem anderen Level.

## Dein Context Window ist eine kostbare Ressource

Das Context Window ist vielleicht das wichtigste Konzept, das man verinnerlichen muss. Es ist nur ein Array von Tokens. Das Modell hat keinen anderen Zustand; alles, was es über deine Konversation und deinen Code weiß, lebt in diesem Fenster.

Das Problem ist: Je mehr man hineinstopft, desto schlechter performt das Modell. Idealerweise solltest du unter 50-75% Kapazität bleiben. Darüber fängt das Modell an zu halluzinieren, Fehler zu machen und Tools falsch aufzurufen.

> Die Frage, die du dir ständig stellen solltest: "Was ist überhaupt in meinem Kontext?"

Aktuelle Tools sind schrecklich darin, dies zu beantworten. GitHub Copilot packt zum Beispiel standardmäßig 30.000 Tokens in den Kontext. Selbst für das einfachste Projekt sind das 15% deines Speichers, bevor du überhaupt etwas getan hast.

Geoffrey Huntley hat es kürzlich mit einem Commodore 64 verglichen. Das ist das richtige mentale Modell. Du hast vielleicht 200 bis 500 Kilobyte, mit denen du arbeiten kannst. Wenn der Kontext voll ist, bekommst du "Compaction" (Zusammenfassung/Kürzung), was im Grunde der Tod für deinen nützlichen Assistenten ist. Alles wird verwirrt und degradiert.

Das ist es, was manche Leute **"Context Engineering"** nennen. Was du in den Kontext packst, diktiert, wie effektiv du sein wirst.

## The Great Decoupling

Gemini nannte dies "the great decoupling" (die große Entkopplung), und ich denke, es ist ein nützlicher Rahmen, um zu verstehen, warum manche Leute LLMs lieben und andere sie hassen.

Man muss **Programming** (das Handwerk des physischen Code-Tippens) vom **Engineering** (der Architektur des Systems, den Zielen, dem "Warum") entkoppeln.

Wenn du dich auf Formatierung, Syntax, Implementierung von Schleifen und Algorithmen konzentrierst: LLMs werden darin bald besser sein als du. Aber LLMs können das bereits für **jede** Domain in **jeder** Programmiersprache. Der Mentalitätswandel ist, dass du plötzlich alle Programmiersprachen und Technologien nutzen kannst, anstatt nur die, mit denen du vertraut bist.

> Aber es gibt Fragen, die das LLM nicht beantworten kann: Wie passen diese Komponenten zusammen? Bietet dies den Nutzern einen Mehrwert? **Wie** bietet es einen Mehrwert?

Das ist das Denken, das du immer noch selbst machen musst.

## Du wurdest gerade befördert

Denk so darüber: Du wurdest gerade befördert. Dein neuer Titel ist **Tech Lead + QA Lead**.

Deine Aufgabe ist es, klare Spezifikationen, Pläne und Beispiele zu schreiben. Definiere, was "done" bedeutet, wie man es testet. Reviewe **Ergebnisse**, nicht Zeilen von Code.

Das Modell ist wie ein genialer Praktikant mit Amnesie. Es arbeitet mit 100-facher Geschwindigkeit, hat aber null Langzeitgedächtnis. Es vergisst Dinge vom Anfang der Konversation, wenn der Kontext vollläuft. Es braucht strikte Leitplanken, eine Art "Model CI".

> Der große Shift: Code ist jetzt extrem billig.

Früher war Code mein Baby. Mein Herzblut steckte darin. Jetzt muss ich mein Denken ändern. Ich kann ein ganzes Projekt wegwerfen, weil ich nicht auf die gleiche Weise darin investiert bin.

## Hör auf, gegen das Modell zu kämpfen

Einer der häufigsten Fehler: Leute kämpfen gegen das Modell.

Wenn du zusiehst, wie es arbeitet, neigst du dazu, Mikromanagement zu betreiben, weil du das Gefühl hast, den Code zu besitzen. Wenn du Dinge denkst wie:
*   "So würde ich das nicht machen, stopp!"
*   "Die Variablennamen folgen nicht meinen Konventionen!"
*   *Korrigiert Formatierung von Hand*
*   *Reviewt jede einzelne Zeile Code*

**Das ist Kämpfen gegen das Modell.** Es ist kontraproduktiv.

Stattdessen: **Schreibe einen besseren Harness (Rahmenbedingungen).**
Wenn du Tests hast und das Modell etwas falsch macht: Revert, schreibe einen besseren Test, lass das Modell es erneut versuchen. Es wird sehen "das schlug fehl" und implizit das tun, was du willst. Für Variablennamen und Formatierung? Mach eine Linter-Regel, die alles automatisch fixet.

Falscher Ansatz? Das bedeutet, dein Plan war schlecht. Lösche den Code, geh zurück zur Planung, artikuliere besser und lass es wieder laufen.

## Project Setup Is Everything

Dein Projekt-Setup ist wahrscheinlich das wichtigste menschliche Zeitinvestment, das du tätigen kannst.

> Hard Requirement: Dein Projekt muss mit einem **einzigen Befehl** bauen, testen und linten.

Kein README, das sagt "gib diesen Flag an" oder "setze diesen Library-Pfad manuell". Pack das einmal in eine Konfigurationsdatei.

Drucke minimale, handlungsrelevante (actionable) Fehlermeldungen. Wenn du 1000 Tests hast, drucke nicht "Test bestanden" 1000 Mal. Das verschwendet Kontext. Wenn ein Test fehlschlägt, drucke die fehlgeschlagene Assertion, vielleicht einen Call Stack – Informationen, die das Modell nutzen kann, um das Problem zu beheben.

Ein guter Heuristik: Wenn ein Mensch sich schwer tut, in deine Codebase einzusteigen, wird ein LLM definitiv verloren sein.

## Trust the Harness, Not Your Eyes

Agenten führen Tools in einer Schleife aus, bis sie ein Ziel erreichen. Das bedeutet, du musst eine Feedback-Schleife bauen und dem Output vertrauen, ohne alles beobachten zu müssen.

Modelle können nur fixen, was sie als falsch **sehen**. Wenn Dinge abstürzen, drucke einen Stack Trace. Test-Fehlschläge brauchen actionable Output. Compiler- und Linter-Fehler müssen klar und prägnant sein.

## Design for Black Boxes

Entwirf kleine, isolierte Systeme. Ich nenne sie "Black Box Microservices" (nicht unbedingt im Sinne von gRPC/Kafka). Ich meine Komponenten mit klaren Inputs und Outputs, bei denen du sicher sein kannst, dass sie funktionieren, ohne hineinschauen zu müssen.

Wenn du dies als Primitiv hast, kannst du Black Boxes zu größeren Systemen komponieren. Einzelne Boxen können leicht in anderen Sprachen neu geschrieben, entfernt oder ersetzt werden.

## CLI über IDE

IDE-Integrationen sind ein lokales Optimum. IDEs sind Interfaces für Menschen; sie ermutigen dazu, gegen das Modell zu kämpfen (durch Anzeigen von Diffs etc.).

Die CLI fungiert als "Forcing Function". Modelle wissen, wie man in Terminals arbeitet. Der Single-Command-Build ist für Modelle essenziell. Stdout kontrolliert direkt den Kontext.

> Ein Hinweis: Wenn du auf Windows bist, **lass es**. Agenten sind auf Unix-artigen Shells trainiert. Nutze WSL oder Devcontainers.

## TDD ist kein Scam mehr

Ich fand orthodoxes Test Driven Development (TDD) für Menschen immer albern. Aber für ein LLM ist TDD das Beste überhaupt, weil es eine Feedback-Schleife per Design ist:

1.  Schreibe einen fehlschlagenden Test
2.  Implementiere das Feature
3.  Test sollte jetzt bestehen

Das ist der Goldstandard für die Arbeit mit Agenten.

## Golden Master Testing

Das funktioniert unglaublich gut, wenn man Systeme in eine andere Sprache portiert oder großes Refactoring macht.

Die Idee: Erweitere dein bestehendes System mit vielen Debug-Prints. Drucke Zustand, Entscheidungen etc. Fange diesen Output in einer Datei ein. Das ist dein "Golden Master". Dann mache den Port (oder lass das LLM es tun). Die Debug-Prints im neuen System müssen Byte-für-Byte übereinstimmen.

## Spend Time on Planning

Wenn du sagst "bau mir einen interaktiven Disassembler", wird es wahrscheinlich scheitern. Es lohnt sich, einen guten Plan zu haben.

Der Plan kann so detailliert sein, wie dein Problem es erfordert. Modelle sind auch großartige Resonanzböden (Sounding Boards). Du kannst das Modell bitten, **dir** Fragen zu deinem Ansatz zu stellen.

Und denk dran: Fehlgeschlagene Versuche sind billig.

## DevDocs: Surviving Context Resets

Eine Technik, um Context Resets zu überleben: Erstelle einen Unterordner `devdocs` in deinem Projekt.

*   `devdocs/plan.md`: Ziele, Implementierungsphasen, Ansatz.
*   `devdocs/progress.md`: Aktueller Status, Checkboxen.

Wenn dein Kontext vollläuft, kannst du die Session beenden, neu starten und sagen: "Wir haben an `progress.md` und diesem Plan gearbeitet. Mach weiter."

> Das Wichtige: **Dein Plan ist permanent, Code ist vergänglich.**

## On Slop and Accumulation

Was passiert, wenn sich Dinge über die Zeit ansammeln? Wenn wir nicht vorsichtig sind, enden wir mit "Slop" (Matsch) statt gut architekturierem Code.

Wenn du von Anfang an sagst "Ich traue dem nicht", wirst du nie vertraut damit, wie diese Tools funktionieren. Du musst dich mit den Tools beschäftigen, um das Urteilsvermögen zu entwickeln, wann und wie man sie einsetzt.

## Beyond Coding: Andere Anwendungsfälle

*   **Debugging von Fehlern**: Wenn GitHub Actions kaputt sind, regelt das der Agent.
*   **Recherche in existierenden Codebases**: "Was passiert hier?" – Claude Code antwortet in drei Minuten mit einer detaillierten Erklärung und Traces.
*   **Systemadministration**: Linux-Probleme fixen, Volumes resizen.

## What's Next: Sub-Agents

Sub-Agents sind das nächste große Ding. Das Hauptmodell führt nicht den eigentlichen Fix aus, sondern spawnt einen Sub-Agent, der den Fix schreibt und zurückmeldet. Das verhindert "Context Rot" und ermöglicht viel längere Sessions.

## Just Try It

Der einzige Weg, gut darin zu werden, ist es auszuprobieren. Im ersten Monat wirst du wahrscheinlich nicht produktiv sein. Du wirst fluchen. Aber du musst damit spielen.

> Dinge ändern sich ständig. Wenn du nicht aufgepasst hast, hinkst du wahrscheinlich hinterher. Also geh und probier es aus!

---
*Quelle: [Duncan Ogilvie auf X](https://x.com/mrexodia/status/2010157660885176767)*
