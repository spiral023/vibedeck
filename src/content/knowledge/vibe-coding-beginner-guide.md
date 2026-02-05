---
title: 'Vibe Coding Guide: Von Null auf Product in 6 Monaten'
description: >-
  Elena Kovacs teilt ihre Reise von null Programmierkenntnissen hin zum Bauen
  eigener Tools und Automatisierungen mit Claude Code.
category: fundamentals
icon: Rocket
readTime: 7 Min
tags: ["vibe-coding", "agentic-coding", "workflows", "best-practices"]
---

> Ursprünglich veröffentlicht von [elena ₊ ⊹ auf X](https://x.com/elenakvcs/status/2008228601980985550).

![Vibe Coding Beginner Guide](/images/knowledge/vibe-coding-beginner-guide/header.jpg)

Vor 6 Monaten habe ich meine erste Zeile Code geschrieben. Nicht "geschrieben" im Sinne eines Tutorials oder von Stack Overflow kopiert. Ich meine: Ich habe Claude etwas beschrieben, es gab mir Code, ich habe ihn ausgeführt, und er funktionierte. Ich hatte keine Ahnung, was das alles bedeutete.

Mein eigentlicher Job ist KI-Forschung. Ich lese Paper, teste Modelle, schreibe Berichte. Ich verstand KI konzeptionell, hatte aber nie selbst etwas gebaut. Es fühlte sich immer so an, als gäbe es eine Mauer zwischen Leuten, die coden können, und denen, die es nicht können. Und ich war permanent auf der falschen Seite.

Dann sah ich Leute auf Twitter und Reddit, die echte Produkte veröffentlichten.

![Vibe Coding Trend](/images/knowledge/vibe-coding-beginner-guide/levelsio.jpg)

Buchstäblich zufällige Leute ohne technischen Hintergrund bauten Tools, automatisierten Workflows, starteten Startups. Und sie erwähnten immer wieder dieses Ding namens **Vibe Coding**.

Ich dachte zuerst, es sei ein Meme. Aber die Sachen, die sie bauten, waren real. Funktionierende Produkte. Echte Unternehmen.

## Der Aha-Moment

Eines Nachts hatte ich dieses Problem: 4000 Zeilen unordentlicher Daten in einer Tabelle für ein Forschungsprojekt. Ich musste sie bereinigen, Duplikate finden, konsistent formatieren. Eine Aufgabe, die mich manuell 6 Stunden kosten würde.

Ich öffnete Claude und beschrieb einfach, was ich brauchte. Nicht in technischer Sprache, sondern: *"Ich habe diese CSV mit unordentlichen Daten, einige E-Mails sind falsch formatiert, einige sind Duplikate, ich brauche eine saubere Version mit nur gültigen, eindeutigen E-Mails und einer Anzahl am Ende."*

45 Sekunden später hatte ich ein Python-Skript. Ausgeführt. Es funktionierte. 6 Stunden Arbeit in unter einer Minute erledigt. Ich verstand nichts davon, wie der Code funktionierte.

Seitdem hat sich in meinem Kopf etwas umgeschaltet. Jetzt baue ich nebenbei mehr, als ich jemals mit null Engineering-Hintergrund für möglich gehalten hätte.

## Warum die meisten beim Vibe Coding scheitern

Der Fehler, den ich anfangs machte: Zu denken, beim Vibe Coding ginge es darum, Programmieren zu lernen.

**Es geht nicht darum! Es geht darum, Kommunikation zu lernen.**
Die Fähigkeit ist nicht Python oder JavaScript, die Fähigkeit ist **Klarheit**. Du musst beschreiben können, was du willst, ohne Raum für Verwirrung zu lassen.

Die meisten Leute sagen einfach: "Bau mir eine App, die X macht" und wundern sich, warum sie "Garbage" zurückbekommen.

![Clarity in Prompting](/images/knowledge/vibe-coding-beginner-guide/gaut.jpg)

Ich habe das auf die harte Tour gelernt. Stunden an Projekten verschwendet, weil meine Prompts faul waren. "Mach das besser" oder "Es funktioniert nicht" – das funktioniert nicht.

*   **Schlechter Prompt:** "Bau mir ein E-Mail-Tool."
*   **Guter Prompt:** "Schreibe ein Python-Skript, das eine CSV-Datei einliest, jede Zeile mittels Regex auf ein gültiges E-Mail-Format prüft, Duplikate entfernt, eine neue CSV mit den sauberen Daten ausgibt und eine Zusammenfassung druckt (verarbeitete Zeilen, ungültige Zeilen, Duplikate)."

Das ist kein Coden. Das ist Präzision. Je spezifischer du bist, desto weniger muss Claude raten.

## Der Fehler, der mich Wochen kostete

Hör auf, das ganze Ding auf einmal bauen zu wollen!

Mein erstes Projekt war ein Desaster: Ein Twitter-Bookmark-Analyzer.
Mein Prompt: *"Bau mir einen Twitter Bookmark Analyzer."* -> Totaler Fehlschlag. Claude gab mir ein massiv kompliziertes System mit APIs, die ich nicht verstand, und Abhängigkeiten, die ich nicht installieren konnte.

Eine Woche später versuchte ich es erneut, aber in kleinen Schritten:
1.  *"Schreibe ein Skript, das sich mit der Twitter API verbindet und meine letzten 100 Bookmarks zieht."* -> Funktioniert (10 Min).
2.  *"Extrahiere jetzt den Text aus jedem Bookmark."* -> Funktioniert (10 Min).
3.  *"Kategorisiere sie nach Themen basierend auf Keywords."* -> Funktioniert.
4.  *"Speichere die Ergebnisse in einer JSON-Datei."* -> Funktioniert.

In einer Stunde hatte ich etwas Besseres als das, woran ich zuvor 4 Stunden gescheitert war. **Der Unterschied war der Scope.** Kleine Schritte. Jeder muss funktionieren, bevor du den nächsten hinzufügst.

## Warum Claude?

Ich habe alles probiert: ChatGPT, Cursor, Copilot, Gemini.

Claude ist der Einzige, den ich jetzt zum Bauen nutze. Nicht unbedingt, weil der Code besser ist, sondern weil **Claude nachfragt, anstatt Annahmen zu treffen.**

ChatGPT macht es oft einfach, auch wenn der Prompt unklar ist. Claude stellt klärende Fragen: *"Nur zur Sicherheit, willst du X oder Y?"*

![Claude asks for clarity](/images/knowledge/vibe-coding-beginner-guide/claude-ask.jpg)

Diese Fragen haben mir Stunden an Debugging gespart. Außerdem erklärt Claude, was es tut. Ich lerne Programmierkonzepte durch diese Erklärungen besser als durch jedes Tutorial.

## Der Workflow, der funktioniert

1.  **Starte mit dem Ergebnis, nicht der Technologie.** Sag nicht "Ich will Python nutzen", sag "Ich will meine Bookmarks sortiert haben". Claude wählt die Tools.
2.  **Brich es in kleinste Schritte herunter.** Finde die absolut basisste Version, die eine Sache tut. Baue die zuerst.
3.  **Teste sofort.** Schreibe keine 200 Zeilen, ohne sie auszuführen. Teste alle 20-30 Zeilen.
4.  **Gib Claude bei Fehlern alles.** Nicht "Es geht nicht", sondern paste den vollen Fehler, den Code und was du erwartet hast.
5.  **Speichere funktionierende Versionen ständig.** Bevor du eine große Änderung machst, kopiere den funktionierenden Code weg.
6.  **Build in Public.** Feedback beschleunigt das Lernen.

## Was du tatsächlich bauen kannst

In den letzten 6 Monaten habe ich gebaut:
*   Ein Skript, das Bookmarks sortiert (spart 30 Min/Tag).
*   Einen Telegram Bot, der AI-Forscher überwacht.
*   Eine Daten-Pipeline, die hunderte PDFs verarbeitet und durchsuchbare Summaries erstellt.
*   Einen Chrome Extension für Keyword-Highlighting.
*   Interne Tools für die Arbeit, die 4-Stunden-Aufgaben in 10-Minuten-Tasks verwandeln.

Nichts davon wird die Welt verändern. Aber alles funktioniert und spart mir Zeit oder Geld. Vor einem Jahr hätte ich dafür Entwickler für tausende Dollar angeheuert. Jetzt baue ich es an einem Nachmittag selbst.

## Wie du anfängst

Pick dir **eine** Sache heraus, die dich regelmäßig nervt und repetitiv ist. Keine Startup-Idee. Nur eine dumme, manuelle Aufgabe, die Zeit verschwendet.

Beschreibe sie Claude, als würdest du es einem intelligenten Menschen erklären, der nichts über deine Situation weiß. Iteriere, bis es läuft. Speicher die funktionierende Version. Füge das nächste Feature hinzu.

Die Lücke zwischen "Ich habe eine Idee" und "Ich habe es gebaut" war nie kleiner. **Hör auf zuzuschauen. Fang an zu prompten.**

---
*Quelle: [elena ₊ ⊹ auf X](https://x.com/elenakvcs/status/2008228601980985550)*
