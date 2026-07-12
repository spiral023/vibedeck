---
title: "A Field Guide to Fable: Finding Your Unknowns"
description: "Ein Source Note zu Thariqs Field Guide für Claude Fable 5: Warum die Qualität der Ergebnisse an den eigenen Unknowns hängt und wie Blind Spot Pass, Interviews, Prototypen, Implementation Plans und Merge-Quizzes diese Lücken systematisch schließen."
type: source
status: seed
category: workflows
icon: Search
readTime: 11
tags:
  - models/claude-fable-5
  - workflows/prompting
  - patterns/unknowns
  - workflows/planning
  - patterns/verification
aliases:
  - "Finding Your Unknowns"
  - "Fable Field Guide"
  - "The Map Is Not the Territory"
topics:
  - "[[Claude Fable 5]]"
  - "[[Unknowns]]"
  - "[[Prompting]]"
  - "[[Implementation Plans]]"
  - "[[Blind Spot Pass]]"
  - "[[Context Engineering]]"
  - "[[Verification]]"
up: "[[Claude Fable 5]]"
sourceURL: "https://x.com/trq212/status/2073100352921215386"
sourceType: tweet
author: "Thariq Shihipar (@trq212)"
sourceDate: "2026-07-03"
addedDate: "2026-07-12"
level: intermediate
---

Thariq Shihipar arbeitet bei Anthropic am Claude-Code-Team und hat mit diesem X-Artikel einen der meistgeteilten Praxis-Guides zum Arbeiten mit Claude Fable 5 geschrieben (über 3,6 Millionen Views in den ersten Tagen). Der Guide ist kein Feature-Überblick, sondern eine Methodik: **Wie finde ich heraus, was ich dem Modell nicht gesagt habe — bevor es teuer wird?**

Die zentrale These steckt in einem alten Aphorismus:

> The map is not the territory.

Prompts, Skills und Kontext sind nur eine **Karte** der Arbeit. Das **Territorium** ist die echte Codebasis, ihre Geschichte und die undokumentierten Constraints im Kopf des Entwicklers. Die Differenz zwischen Karte und Territorium sind die **Unknowns** — und immer wenn Fable auf ein Unknown trifft, muss es raten.

## Warum das gerade bei Fable 5 wichtig wird

Thariqs Beobachtung: Fable 5 ist das erste Modell, bei dem die Qualität der Arbeit nicht mehr primär an der Modellfähigkeit hängt, sondern an der Fähigkeit des Nutzers, **die eigenen Unknowns zu klären**.

Das ist kontraintuitiv, denn stärkere Modelle machen das Problem schlimmer, nicht besser:

- Schwächere Modelle scheitern laut und lokal — man merkt es sofort.
- Ein starkes Modell löst Ambiguität selbstbewusst auf und trägt eine falsche Annahme konsistent durch eine ganze Multi-File-Session.

Der Engpass verschiebt sich also von „Kann das Modell die Aufgabe?" zu „Habe ich die Aufgabe richtig spezifiziert?".

## Das Framework: Vier Arten von Unknowns

Thariq zerlegt die Lücke zwischen Karte und Territorium in vier Quadranten (nach dem bekannten Rumsfeld-Schema):

| Quadrant | Bedeutung |
| --- | --- |
| **Known Knowns** | Was explizit im Prompt steht |
| **Known Unknowns** | Lücken, von denen man weiß, dass man sie noch nicht geklärt hat |
| **Unknown Knowns** | Was so offensichtlich ist, dass man es nie aufschreiben würde — es aber sofort erkennt, wenn es fehlt |
| **Unknown Unknowns** | Faktoren, an die man überhaupt nicht gedacht hat |

Die gefährlichsten Kategorien sind die unteren beiden: implizites Wissen, das nie in den Kontext gelangt, und blinde Flecken, die erst beim Review auffallen. Der gesamte Guide ist eine Sammlung von Techniken, um genau diese beiden Quadranten systematisch auszuleuchten.

## Vor der Implementierung: Unknowns aufdecken

### 1. Blind Spot Pass

Bevor die eigentliche Arbeit startet, sagt man Fable offen, was man **nicht** versteht — die unbekannte Library, die fremde Domäne, das Legacy-Modul. Das Modell kartiert dann Standards, historische Probleme und Fragen, die man selbst nicht zu stellen wusste. Das ist der direkteste Angriff auf die Unknown Unknowns.

### 2. Brainstorms und Prototypen

Für visuelle oder Design-Arbeit gilt: Reagieren ist leichter als Spezifizieren. Statt eine Design-Entscheidung in Prosa zu beschreiben, lässt man Fable **mehrere bewusst unterschiedliche HTML-Prototypen mit Beispieldaten** bauen und wählt aus. Die Unknown Knowns („das erkenne ich, wenn ich es sehe") werden so sichtbar, ohne dass man sie formulieren muss.

### 3. Interviews

Statt selbst zu raten, welche Details fehlen, lässt man sich vom Modell interviewen: **eine Frage nach der anderen**, priorisiert nach architektonischer Tragweite, am Ende ein dokumentierter Decision Record. Das dreht die übliche Prompt-Richtung um — das Modell zieht die Anforderungen aus dem Kopf des Nutzers heraus.

### 4. References statt Beschreibungen

Wenn ein Verhalten schwer zu beschreiben ist, ist **Quellcode die bessere Spezifikation**. Eine Library oder ein Modul als Referenz benennen und Fable die Patterns daraus nachbauen lassen, schlägt jede noch so ausführliche Prosa-Beschreibung.

### 5. Implementation Plans — sortiert nach Änderungswahrscheinlichkeit

Thariqs interessantester Detail-Tipp: Implementierungspläne nicht in Ausführungsreihenfolge schreiben, sondern **nach Wahrscheinlichkeit der Änderung sortieren**. Datenmodelle und Interfaces (die Entscheidungen, die am ehesten kippen) nach vorne, mechanisches Refactoring ans Ende. So konzentriert sich das Review auf die Stellen, an denen Unknowns am teuersten sind.

## Während der Implementierung: Implementation Notes

Fable führt ein laufendes Protokoll: getroffene Entscheidungen, Abweichungen vom Plan, unerwartete Funde im Code. Diese Notes sind später Gold wert — sie zeigen, wo die Karte vom Territorium abgewichen ist, und werden zur Grundlage der Abnahme.

## Nach der Implementierung: Verstehen, bevor gemergt wird

### Pitches und Explainer

Spezifikation, Prototyp und Implementation Notes werden zu einem einzigen Dokument konsolidiert, das mit Demos beginnt und Experten-Fragen vorwegnimmt. Das zwingt zu einer kohärenten Erzählung der Änderung statt eines rohen Diffs.

### Der Change Quiz

Die vielleicht ungewöhnlichste Technik: Vor dem Merge lässt man sich von Fable einen Report mit Kontext und Intuition zu den Änderungen erklären — und **absolviert am Ende ein Quiz über den eigenen Code**. Wer das Quiz nicht besteht, hat die Änderung nicht verstanden und sollte nicht mergen. Das ist Verification nicht für das Modell, sondern für den Menschen.

## Praxisbeispiel: Das Fable-Launch-Video

Thariq demonstriert die Methodik an einer Domäne, in der er selbst Laie ist: dem Schnitt des Fable-Launch-Videos. Statt Video-Editing zu lernen, klärte er iterativ mit Claude seine Unknowns — Transkriptionsgenauigkeit, Timing, Color Grading — und kam so zu einem Ergebnis, das ohne die systematische Unknown-Jagd nicht möglich gewesen wäre. Die Pointe: Die Methodik funktioniert gerade dann, wenn die eigene Expertise fehlt.

## Einordnung

Der Guide ist deshalb so stark, weil er das Prompting-Problem umdreht. Die übliche Frage lautet „Wie schreibe ich einen besseren Prompt?". Thariqs Frage lautet: **„Was weiß ich, das ich nicht aufgeschrieben habe — und was weiß ich nicht, das ich wissen müsste?"**

Praktisch heißt das:

- Vor großen Tasks einen Blind Spot Pass und/oder ein Interview einplanen — die fünf Minuten sind billiger als eine falsch abgebogene Session.
- Bei Design-Entscheidungen mehrere Wegwerf-Prototypen anfordern statt einer perfekten Beschreibung.
- Pläne nach Änderungswahrscheinlichkeit sortieren und Reviews dort konzentrieren.
- Nichts mergen, was man nicht in einem Quiz erklären könnte.

Die Community hat die acht Techniken inzwischen als installierbare Claude-Code-Skills nachgebaut (u. a. `blindspot-pass`, `interview-me`, `change-quiz`), was den Guide de facto zu einem Workflow-Standard für Fable 5 macht. Verwandte Ideen finden sich in [[Context Engineering]] und im spezifikationsgetriebenen Arbeiten ([[Implementation Plans]]).
