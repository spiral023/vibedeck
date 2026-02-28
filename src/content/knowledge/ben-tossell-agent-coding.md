---
title: 'Wie ich mit Agents code, ohne ''technisch'' zu sein'
description: >-
  Ben Tossell teilt seine Erfahrungen, wie er 3 Milliarden Tokens verbraucht
  hat, um Tools, CLIs und Produkte zu bauen, ohne selbst Code zu schreiben.
category: fundamentals
icon: Bot
readTime: 11 Min
tags: ["agentic-coding", "claude-code", "workflows", "agents"]
level: beginner
addedDate: "2026-02-01"
---

> Ursprünglich veröffentlicht von [Ben Tossell auf X](https://x.com/bentossell/status/2006352820140749073).

![Ben Tossell Agent Coding](/images/knowledge/ben-tossell-agent-coding/header.jpg)

Ich habe in vier Monaten 3 Milliarden Token verbraucht. Jeden einzelnen davon durch ein Terminal, während ich einem Agenten dabei zusah, wie er Code schrieb, den ich selbst nicht schreiben könnte.

Du magst mich als 'Vibe-Coder' bezeichnen. Aber ich denke, dieser Begriff übersieht die Fähigkeiten, die in der Arbeit selbst stecken. Ähnlich wie es 'No-Code' um 2019 tat.

Ich lese den Code nicht. Aber ich lese den Agenten-Output religiös. Und dabei nehme ich eine Menge Wissen darüber auf, wie Code funktioniert, wie Projekte funktionieren, wo Dinge scheitern und wo sie erfolgreich sind.

Das ist meine Version vom Programmieren lernen. Die neue technische Klasse.

## Was ich tatsächlich geshippt habe

Ein paar Dinge, die ich in diesen letzten Monaten tatsächlich geshippt habe:

*   **Persönliche Seite:** Ich habe meine persönliche Seite überarbeitet und sie wie ein Terminal-CLI-Tool aussehen lassen.
*   **Feed:** Ich habe einen einfachen Social Tracker für Erwähnungen von Factory auf Twitter, Posts von unserem Subreddit und GitHub Issues gebaut. Es ist Open Source und ich habe 100+ Sterne dafür bekommen.
*   **Factory Wrapped:** Ich habe die erste Version unseres 'Wrapped'-Produkts gebaut. Dem Team gezeigt, sie liebten es, also wollten sie es in das eigentliche Produkt einbauen.
*   **Custom CLIs:** Ich habe einige CLIs erstellt – wie eine Pylon CLI, die dann vom Team für Customer Support Queries übernommen wurde. Plus eine Linear und Gmail CLI.
*   **Ein Crypto Tracker:** Ich habe einen Tracker gebaut, der automatisch Short/Long-Positionen basierend auf Vorhersagen öffnet und schließt – wie ein Mini-Hedgefonds.
*   **Droidmas:** Zwölf Tage, zwölf Experimente oder Spiele zu Themen wie Memory, Context Management, Vibe Coding.
*   **Ein KI-gesteuertes Video-Demo-System:** Ich gebe ihm einen Prompt, um ein Video zu erstellen. Es öffnet Ghostty, führt Befehle aus, kann andere Fenster öffnen, nimmt den Bildschirm auf. Agiert als eigener Regisseur, Produzent und Editor.
*   **Ein Telegram Bot powered by Droid Exec:** Damit ich meine lokalen Repos auf einem VPS synchronisiert haben und einfach mit meinen Repos als Chatbot chatten kann.

Und etwa 50 andere Dinge, die ich nicht erwähne oder die ich sterben ließ.

## Wie ich tatsächlich arbeite

Ich nutze **ausschließlich eine CLI**. Terminal über Web-Interfaces, immer. Es ist einfach fähiger als allgemeiner Agent, und ich sehe es arbeiten.

1.  **Idee/Pain:** Ich habe eine Idee oder ein Problem, das mit Code gelöst werden könnte. Also starte ich ein neues Projekt in Droid (Factory's CLI).
2.  **Kontext:** Ich spreche ein paar Mal mit dem Modell, um Kontext zu füttern.
3.  **Spec Mode:** Ich wechsle in den Spec Mode, um einen Plan zu erstellen. Ich hinterfrage Dinge: "Ich verstehe nicht, was das ist", "Warum brauchen wir das?", "Können wir es nicht so machen?".
4.  **Docs & Repos:** Ich verlinke Dokumentationen und GitHub Repos, die der Agent erkunden soll.
5.  **Opus 4.5:** Dann lasse ich Opus 4.5 mit hoher Autonomie laufen ("rip"). Ich beobachte den Stream, sehe Fehler, springe ein, um zu hinterfragen oder zu lenken.
6.  **Test & Iterate:** Server starten, testen, Feedback geben, iterieren.

Ich baue quasi "voraus". Ich versuche einfach, das Ding zu bauen. Alle Lücken und Probleme sind Lernmöglichkeiten. Ist das etwas, das in ein `agents.md` gehört?

## Mein agents.md Setup

Ich verbringe viel Zeit damit, das beste `agents.md` Setup für mich zu finden, denn das ist effektiv das Handbuch.

Ich habe einen lokalen `repos` Ordner. Darin liegt eine `agents.md`, die explizit sagt, wie jedes neue Repo eingerichtet werden soll:
*   Was zu tun ist und was nicht.
*   Wie man Dinge mit GitHub macht.
*   Wie man committet.
*   Welchen GitHub Account es nutzen soll (Arbeit vs. Privat).
*   **End-to-End Tests:** Früher nie beachtet, jetzt bin ich sehr daran interessiert, E2E-Tests für alles zu haben.

Ich schaue mir oft die `agents.md` Dateien von anderen an, um zu sehen, was ich mir borgen kann.

## Coding on the go

Ich stelle sicher, dass ich die Droid GitHub App auf jedem Repo installiere. Wenn ich deploye, mache ich Pull Requests, damit Droid sie reviewen kann – und ich kann Droid taggen, um Fixes selbst zu machen.

Das lässt mich von meinem Handy aus coden. Das in Kombination mit meinem Telegram Bot macht es sehr einfach, Dinge zu tun, wenn ich nicht am Schreibtisch bin.

Ich nutze auch Slack mit meinem Agenten. Ein neuer Channel für jedes Repo. Slack ist ein großartiges 1-Personen-Produkt (+ Agenten).

## Was ich gelernt habe

*   **Bash Commands:** Es hat "Klick" gemacht, als ich den Changelog-Prozess eine Weile manuell gemacht hatte. Ich habe Droid den Slash-Command-Flow erstellen lassen.
*   **CLIs über MCPs:** Ich habe aufgehört, MCPs zu nutzen. Ich nutze die CLI-Versionen von den meisten Dingen (Supabase, Vercel, Github). MCPs verbrauchen zu viel Kontext und oft brauche ich nur wenige Tools.
*   **VPS:** Ich wusste abstrakt, was es war. Jetzt nutze ich es für den Crypto Tracker (der immer laufen muss) und um meine Repos via SyncThing zu synchronisieren.
*   **Skills:** Ich nutze sie mehr mit Bash Commands + CLIs. Ich habe eine portable Gmail CLI, die ich in jedes Projekt ziehen kann.

## The new programmable layer of abstraction

Es gibt eine **neue programmierbare Abstraktionsschicht zu meistern.**

Früher (No-Code) waren es Drag-and-Drop-Tools wie Webflow und Zapier.
Heute muss ich nicht lernen, Code von Grund auf zu schreiben. Ich muss lernen, **wie man mit einem KI-Agenten arbeitet.**
*   Wie prompte ich gut?
*   Wie stelle ich den richtigen Kontext sicher?
*   Wie kann er mir helfen, das System zu verstehen?

## Learning from others

Ich lese Leute wie **Peter Steinberger**, der ein *echter* Programmierer ist und wie verrückt shippt. Die Einfachheit seines Systems (einfach mit dem Modell reden) gibt mir die Erlaubnis und das Vertrauen, dass ich kein ultra-komplexes System brauche.

Ich sehe mir Open Source Software von anderen an, clone sie, nutze sie, verbessere sie.

## The learning process

Ich baue keine Dinge für zehntausende Nutzer in Production. Also wird es Bugs geben. Das ist eine Erinnerung an eine Wissenslücke.

Meine Rolle ist es, diese Lücken zu finden und zu denken: "Wie stelle ich sicher, dass das nie wieder passiert?"

> "Das Modell weiß alles, was du nicht weißt. Du kannst es einfach fragen. Es ist dein immer geduldiger, dir über die Schulter schauender Experten-Programmierer."

Du kannst in deine `agents.md` schreiben: *"Ich bin kein Programmierer, du musst mir Dinge sehr einfach erklären."*

## Warum das anders ist

Ich habe oft versucht, Coden zu lernen ("Tippe diese Zeichen...").
Um das zu bauen, was ich jetzt gebaut habe, hätte ich Jahre gebraucht.

Stattdessen komme ich aus der Perspektive des **Systemdenkens**. Ich verstehe die Komponenten (Frontend, API, Datenbank) aus meiner No-Code-Zeit.

> **Kein Stück Software fühlt sich unerreichbar an.** Ich kann es einfach git clonen und sagen: "Was zur Hölle macht dieses Ding?"

## Die "dummen" Fragen stellen

Ich habe die Erlaubnis, "dumme" Fragen zu stellen, weil mir niemand zusieht.
*   "Warum nutzen wir all diese Frameworks?"
*   "Warum kann es nicht einfach simplerer Code mit weniger Dependencies sein?"

Manchmal lerne ich, dass es keine dumme Frage war. Manchmal lerne ich, warum Dinge so sind, wie sie sind.

## Beyond "vibe coding"

Ich denke, der Begriff "Vibe Coding" verfehlt den Punkt. Ich versuche, die Systeme zu lernen. Ich bin Teil dieser neuen technischen Klasse und ich weiß nicht, wie sie heißt. Aber "Vibe Coding" gibt dem Ganzen eine negative Konnotation, ähnlich wie "No-Code".

## Es fühlt sich an wie ein Spiel

Das ganze Paradigma fühlt sich für mich an wie ein echtes Spiel. Der Output ist: Ich baue Zeug, das ich bauen will.

> **Jede Idee, die du jemals hattest, kann ausgeübt werden, kann erkundet werden, und es muss nicht gut sein.**

## Erlaubnis, Dinge wegzuwerfen

Früher wäre ich zu emotional investiert gewesen, um schlechten Code wegzuwerfen, nachdem ich Wochen damit verbracht hätte.
Heute: Wenn es Müll ist, werfe ich es weg. Es war nicht viel Zeit oder Energie.

Wir werden eine Explosion von Software sehen. Vieles davon wird nicht gut sein, aber wir werden eine Fülle von Projekten haben, die man nutzen, clonen und remixen kann.

## Fail forward

Der Weg, Code zu lernen, ist, **über deine Fähigkeiten hinaus zu bauen und vorwärts zu scheitern (fail forward).**

Melde dich bei einem CLI-Agenten wie Droid an. Sag, du willst eine persönliche Webseite bauen. Fang einfach an. Jeden kleinen Schluckauf: Hinterfrage ihn. Warum ist dieser Fehler aufgetreten?

## Just pick one

Es gibt so viele Tools. **Wähle einfach eines und bleib dabei.** Lerne das System.
Ich will von einem Tool: **Hilft es mir, in kürzester Zeit mit dem geringsten Ärger am weitesten zu kommen?**

Je mehr ich mit den Tools selbst zu tun habe, desto härter ist es. Ich will einfach mit einem Modell reden und Code geschrieben bekommen.

> Bauen, vorwärts scheitern und weiter shippen.

---
*Quelle: [Ben Tossell auf X](https://x.com/bentossell/status/2006352820140749073)*
