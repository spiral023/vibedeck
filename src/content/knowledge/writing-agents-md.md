---
title: Eine gute AGENTS.md schreiben
description: Best Practices für CLAUDE.md, GEMINI.md und das Onboarding von AI-Agents.
category: fundamentals
icon: FileCode
readTime: 12 Min
---

# Eine gute AGENTS.md schreiben

Hinweis: Dieser Beitrag gilt auch für **CLAUDE.md** und **GEMINI.md**

## Prinzip: LLMs sind (meistens) zustandslos

LLMs sind zustandslose Funktionen. Ihre Gewichte sind zum Zeitpunkt der Inferenz „eingefroren“, sie lernen also nicht über die Zeit hinweg. Das Einzige, was das Modell über deine Codebasis weiß, sind die Tokens, die du hineinsteckst.

Ähnlich ist es bei Coding-Agent-Harnesses wie Claude Code: Dort musst du das „Gedächtnis“ des Agents meist explizit verwalten. **CLAUDE.md (oder AGENTS.md)** ist die einzige Datei, die standardmäßig in *jede einzelne* Unterhaltung mit dem Agent eingeht.

Das hat drei wichtige Konsequenzen:

* Coding-Agents wissen zu Beginn jeder Session absolut nichts über deine Codebasis.
* Der Agent muss bei jedem Start einer Session alles Wichtige über deine Codebasis erneut gesagt bekommen.
* **CLAUDE.md** ist der bevorzugte Weg, das zu tun.

## CLAUDE.md onboardet Claude in deine Codebasis

Da Claude zu Beginn jeder Session nichts über deine Codebasis weiß, solltest du **CLAUDE.md** nutzen, um Claude in dein Projekt „einzuarbeiten“. Auf hoher Ebene bedeutet das, dass die Datei Folgendes abdecken sollte:

* **WAS (WHAT):** Erkläre Claude die Technologie, deinen Stack, die Projektstruktur. Gib Claude eine Karte der Codebasis. Das ist besonders wichtig in Monorepos! Sag Claude, welche Apps es gibt, welche Shared Packages, und wofür alles da ist, damit es weiß, wo es nach Dingen suchen soll.
* **WARUM (WHY):** Erkläre den Zweck des Projekts und was im Repository passiert. Was ist Zweck und Funktion der unterschiedlichen Teile?
* **WIE (HOW):** Sag Claude, wie es am Projekt arbeiten soll. Nutzt ihr z. B. bun statt node? Gib alle Infos, die Claude braucht, um wirklich sinnvolle Arbeit zu leisten. Wie kann Claude Änderungen verifizieren? Wie führt es Tests, Typechecks und Build-/Compile-Schritte aus?

Aber *wie* du das machst, ist wichtig: Versuche nicht, in CLAUDE.md jeden Befehl unterzubringen, den Claude jemals brauchen könnte – das liefert suboptimale Ergebnisse.

## Claude ignoriert CLAUDE.md oft

Unabhängig vom Modell kannst du beobachten, dass Claude den Inhalt deiner CLAUDE.md häufig ignoriert.

Du kannst das selbst untersuchen, indem du einen Logging-Proxy zwischen claude-code-CLI und der Anthropic-API setzt, z. B. über **ANTHROPIC_BASE_URL**. Claude Code injiziert zusammen mit deiner CLAUDE.md folgende System-Erinnerung in die User-Message an den Agent:

```xml
<system-reminder>
      IMPORTANT: this context may or may not be relevant to your tasks. 
      You should not respond to this context unless it is highly relevant to your task.
</system-reminder>
```

Dadurch ignoriert Claude den Inhalt deiner CLAUDE.md, wenn es entscheidet, dass er für die aktuelle Aufgabe nicht relevant ist. Je mehr Informationen in der Datei stehen, die nicht universell auf die Aufgaben passen, desto wahrscheinlicher ist es, dass Claude deine Anweisungen aus der Datei ignoriert.

Warum hat Anthropic das eingebaut? Sicher kann man das nicht sagen, aber man kann spekulieren: Viele CLAUDE.md-Dateien enthalten einen Haufen Anweisungen, die nicht allgemein gelten. Viele Nutzer behandeln die Datei wie eine Sammlung von „Hotfixes“ für unerwünschtes Verhalten und hängen immer mehr Regeln dran, die nicht unbedingt breit anwendbar sind.

Vermutlich hat das Claude-Code-Team festgestellt, dass das Harness bessere Ergebnisse liefert, wenn Claude explizit ermutigt wird, schlechte oder irrelevante Instruktionen zu ignorieren.

## Eine gute CLAUDE.md erstellen

Der folgende Abschnitt gibt Empfehlungen, wie du eine gute CLAUDE.md nach Best Practices des Context Engineering schreibst.

Ergebnisse können variieren. Nicht alle Regeln sind für jedes Setup optimal. Wie bei allem gilt: Regeln darf man brechen – aber erst, wenn …

* du verstehst, wann & warum es okay ist, sie zu brechen
* du einen guten Grund dafür hast

### Weniger (Instruktionen) ist mehr

Es ist verlockend, jeden einzelnen Befehl, den Claude jemals brauchen könnte, plus Code-Standards und Style-Guidelines in CLAUDE.md zu stopfen. Davon raten wir ab.

Auch wenn das nicht extrem streng erforscht ist, deuten einige Untersuchungen auf Folgendes hin:

* Frontier-„Thinking“-LLMs können ungefähr **150–200** Instruktionen mit brauchbarer Konsistenz befolgen. Kleinere Modelle können weniger Instruktionen „im Blick“ behalten als größere, und Non-Thinking-Modelle weniger als Thinking-Modelle.
* Kleinere Modelle werden **viel schneller viel schlechter**: Sie zeigen oft einen **exponentiellen** Abfall in der Befolgung von Instruktionen, je mehr Instruktionen dazukommen; große Frontier-Thinking-Modelle zeigen eher einen **linearen** Abfall (siehe unten). Darum empfehlen wir kleinere Modelle nicht für Multi-Step-Tasks oder komplizierte Implementierungspläne.
* LLMs haben einen Bias zu Instruktionen an den „Rändern“ des Prompts: ganz am Anfang (System Message + CLAUDE.md) und ganz am Ende (die neuesten User-Messages).
* Mit steigender Instruktionsanzahl sinkt die Qualität der Instruktionsbefolgung **gleichmäßig**. Das heißt: Wenn du mehr Instruktionen gibst, ignoriert das Modell nicht nur die neueren („weiter unten in der Datei“), sondern beginnt, **alle** Instruktionen gleichmäßig schlechter zu befolgen.

**Instruction following**

Unsere Analyse des Claude-Code-Harnesses deutet darauf hin, dass der System-Prompt von Claude Code ungefähr **50 einzelne Instruktionen** enthält. Je nach Modell ist das bereits fast ein Drittel der Instruktionen, die dein Agent zuverlässig befolgen kann – und das noch bevor Regeln, Plugins, Skills oder User-Messages dazukommen.

Das impliziert: Deine CLAUDE.md sollte **so wenige Instruktionen wie möglich** enthalten – idealerweise nur solche, die universell für deine Aufgaben gelten.

### Länge & Anwendbarkeit der CLAUDE.md

Wenn sonst alles gleich ist, performt ein LLM besser, wenn sein Context Window mit fokussiertem, relevantem Kontext (Beispiele, verwandte Dateien, Tool Calls, Tool Results) gefüllt ist, statt mit viel irrelevanter Information.

Da CLAUDE.md in jede Session geht, sollte ihr Inhalt so universell anwendbar wie möglich sein.

Vermeide z. B. Anweisungen darüber, wie man ein neues Datenbankschema strukturiert – das ist oft irrelevant und lenkt das Modell ab, wenn du an etwas völlig anderem arbeitest.

Auch bei der Länge gilt „weniger ist mehr“. Anthropic hat keine offizielle Empfehlung, aber der allgemeine Konsens ist: **< 300 Zeilen** ist am besten – und kürzer ist noch besser.

Bei HumanLayer ist die root CLAUDE.md weniger als sechzig Zeilen lang.

### Progressive Disclosure

Eine knappe CLAUDE.md zu schreiben, die trotzdem alles Wichtige enthält, kann gerade in großen Projekten schwierig sein.

Hier hilft das Prinzip **Progressive Disclosure**: Claude soll nur dann task- oder projektspezifische Instruktionen sehen, wenn es sie wirklich braucht.

Statt alle Instruktionen zum Bauen, Testen, Code-Conventions oder sonstigen Kontext in CLAUDE.md zu packen, empfiehlt es sich, taskspezifische Anweisungen in separate Markdown-Dateien mit selbsterklärenden Namen irgendwo im Projekt zu legen.

Zum Beispiel:

```text
agent_docs/
  |- building_the_project.md
  |- running_tests.md
  |- code_conventions.md
  |- service_architecture.md
  |- database_schema.md
  |- service_communication_patterns.md
```

Dann kannst du in CLAUDE.md eine Liste dieser Dateien mit kurzer Beschreibung aufnehmen und Claude anweisen, zu entscheiden, welche (falls überhaupt) relevant sind, und sie zu lesen, bevor es loslegt. Oder du lässt Claude erst die Dateien nennen, die es lesen will, und holst dir dafür eine Freigabe, bevor es sie liest.

Bevorzuge **Verweise statt Kopien**. Wenn möglich, keine Code-Snippets in diese Dateien aufnehmen – die veralten schnell. Stattdessen: **file:line-Referenzen**, die Claude zum maßgeblichen Kontext führen.

Konzeptionell ist das ähnlich zu „Claude Skills“, nur dass Skills mehr auf Tool-Nutzung als auf Instruktionen abzielen.

### Claude ist (nicht) ein teurer Linter

Eines der häufigsten Dinge, die wir in CLAUDE.md sehen, sind Code-Style-Guidelines. Schick niemals ein LLM los, um die Arbeit eines Linters zu machen. LLMs sind im Vergleich zu klassischen Lintern/Formattern teuer und langsam. Deterministische Tools solltest du immer nutzen, wenn es geht.

Code-Style-Guidelines packen zwangsläufig viele Instruktionen und meist irrelevante Snippets in dein Context Window, verschlechtern die Performance und fressen Kontext.

LLMs lernen „in-context“: Wenn dein Code ohnehin einem Stil folgt, wird dein Agent mit ein paar Suchen in der Codebasis (oder einem guten Research-Dokument) vorhandene Muster und Konventionen meist übernehmen, ohne dass du es explizit anweisen musst.

Wenn du da sehr streng bist, könntest du sogar einen **Claude Code Stop Hook** einrichten, der Formatter & Linter laufen lässt und Fehler an Claude zurückgibt, damit es sie behebt. Lass Claude nicht selbst nach Formatierungsproblemen suchen.

Bonus: Nutze einen Linter, der automatisch fixen kann (wir mögen **Biome**) und tune Regeln sorgfältig, welche Fixes sicher auto-anwendbar sind, um maximale (sichere) Abdeckung zu erreichen.

Alternativ: Erstelle einen **Slash Command**, der deine Code-Guidelines enthält und Claude auf die Änderungen in der Versionskontrolle oder deinen `git status` verweist. So trennst du Implementierung und Formatierung. Das ergibt oft bessere Resultate bei beidem.

### Nicht /init nutzen oder CLAUDE.md auto-generieren

Sowohl Claude Code als auch andere Harnesses wie OpenCode haben Möglichkeiten, deine CLAUDE.md (oder AGENTS.md) automatisch zu generieren.

Weil CLAUDE.md in jede Session geht, ist sie einer der Hebelpunkte mit dem größten Einfluss – im Guten wie im Schlechten.

Eine schlechte Codezeile ist eine schlechte Codezeile. Eine schlechte Zeile in einem Implementierungsplan kann viele schlechte Codezeilen erzeugen. Schlechte Research, die das System missversteht, kann zu einem schlechten Plan führen – und dadurch zu noch mehr schlechtem Code.

Aber die CLAUDE.md beeinflusst *jede Phase* deines Workflows und *jedes* Artefakt. Darum solltest du jede einzelne Zeile, die hineinwandert, sehr bewusst überlegen:

**Leverage**

## Fazit

* CLAUDE.md dient dazu, Claude in deine Codebasis einzuarbeiten. Sie sollte **WARUM, WAS und WIE** deines Projekts definieren.
* Weniger (Instruktionen) ist mehr: Lass nichts Notwendiges weg, aber pack so wenig wie möglich hinein.
* Halte den Inhalt knapp und universell anwendbar.
* Nutze Progressive Disclosure: Sag Claude nicht alles, sondern zeig ihm, wie es wichtige Informationen findet – und zwar nur dann, wenn es sie braucht, damit Context Window und Instruktionsbudget nicht aufblähen.
* Claude ist kein Linter: Nutze Linter und Formatter, und ergänze bei Bedarf Hooks und Slash Commands.
* CLAUDE.md ist ein High-Leverage-Punkt des Harnesses: Vermeide Auto-Generierung und gestalte den Inhalt sorgfältig für die besten Ergebnisse.
