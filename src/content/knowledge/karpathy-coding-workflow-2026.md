---
title: 'Karpathys neuer Coding Workflow: 80% Agent, 20% Mensch'
description: >-
  Andrej Karpathys Beobachtungen zur Transition von manuellem Coding hin zu
  'English as a Programming Language' mit Claude Code.
category: workflows
icon: BrainCircuit
readTime: 5 Min
tags: ["claude-code", "agentic-coding", "workflows", "vibe-coding"]
sourceURL: 'https://x.com/karpathy/status/2015883857489522876'
sourceType: tweet
author: Andrej Karpathy
sourceDate: '2026-01-26'
---

Andrej Karpathy teilt seine Erfahrungen mit Claude Code aus den letzten Wochen. Seine zentrale Beobachtung: Er ist innerhalb kürzester Zeit von **80% manuellem Coding** (im November) zu **80% Agent Coding** (im Dezember) gewechselt.

Er programmiert nun größtenteils in Englisch und beschreibt dem LLM "Code Actions" in Worten. Das mag dem Ego eines erfahrenen Entwicklers schmerzen, aber der Netto-Nutzen ist einfach zu groß.

Hier sind seine Kernbeobachtungen zu diesem Shift.

## 1. IDEs vs. Agent Swarms

Der Hype um "Keine IDE mehr nötig" oder "Agent Swarms lösen alles" ist aktuell übertrieben.

*   **Du brauchst eine IDE:** Wenn dir dein Code wichtig ist, beobachte den Agenten wie ein Falke – in einer großen IDE.
*   **Neue Fehler-Kategorie:** Modelle machen keine Syntax-Fehler mehr. Sie machen **subtile konzeptionelle Fehler**, wie ein hastiger Junior Dev.
*   **Blindspots:** Modelle treffen falsche Annahmen, managen ihre Verwirrung nicht, fragen nicht nach und überkomplizieren APIs (Bloat).

> **Beispiel:** Ein Agent baut ein brüchiges Konstrukt über 1000 Zeilen. Du fragst: "Geht das nicht einfacher?" Der Agent: "Natürlich!" und kürzt es auf 100 Zeilen. Du musst der Senior Engineer bleiben, der die Architektur prüft.

## 2. Tenacity (Beharrlichkeit)

Das ist der interessanteste Aspekt: Ein Agent wird niemals müde oder demoralisiert.

> **"Feel the AGI" Moment:** Dem Agenten dabei zuzusehen, wie er 30 Minuten lang an einem Problem kämpft, wo ein Mensch längst aufgegeben hätte, und am Ende siegreich hervorgeht.

Ausdauer (Stamina) war früher ein Bottleneck für Arbeit. Mit LLMs wurde dieses Limit dramatisch erweitert.

## 3. Speedups vs. Expansion

Es ist schwer, den "Speedup" zu messen. Der Haupteffekt ist nicht nur Geschwindigkeit, sondern **Expansion**:
1.  Du baust Dinge, die sich vorher nicht gelohnt hätten ("Return on Investment" war zu niedrig).
2.  Du wagst dich an Code, den du vorher mangels Skills nicht angefasst hättest.

## 4. Leverage (Hebelwirkung)

LLMs sind exzellent darin, in Loops zu laufen, bis sie ein Ziel erreichen.

*   **Imperativ zu Deklarativ:** Sag ihm nicht *was* es tun soll, sondern gib ihm **Success Criteria**.
*   **Test-Driven:** Lass es Tests schreiben und diese dann selbst bestehen ("Green").
*   **Optimization Loop:** Lass es erst den naiven (korrekten) Algorithmus schreiben und bitte dann um Optimierung unter Beibehaltung der Korrektheit.

## 5. Spaß & Atrophy (Verkümmerung)

Programmieren fühlt sich **spaßiger** an, weil die Fleißarbeit ("fill in the blanks") wegfällt. Es bleibt der kreative Teil.
Aber: Die Fähigkeit, manuell Code zu schreiben, **verkümmert (Atrophy)**.

> **Erkenntnis:** "Generation" (Schreiben) und "Discrimination" (Lesen/Reviewen) sind unterschiedliche Fähigkeiten im Gehirn. Du kannst Code immer noch reviewen, auch wenn du Schwierigkeiten hast, ihn syntax-perfekt selbst zu schreiben.

## 6. The "Slopacolypse" 2026

Karpathy erwartet für 2026 eine Flut von minderwertigem AI-Content ("Slop") auf GitHub, Social Media und in wissenschaftlichen Papers. Gleichzeitig wird es aber auch echte, massive Produktivitätsgewinne geben.

## Offene Fragen für die Zukunft

*   **Der 10x Engineer:** Wird der Abstand zwischen dem Durchschnitt und der Spitze noch größer? (Wahrscheinlich ja).
*   **Generalisten vs. Spezialisten:** LLMs sind gut im "Micro" (Fill in the blanks), aber schlecht im "Macro" (Grand Strategy). Generalisten könnten im Vorteil sein.
*   **Wie fühlt sich Coding an?** Wie StarCraft spielen? Wie Factorio? Oder wie Musik machen?

## Fazit

Wir haben Ende 2025 eine Schwelle der Kohärenz überschritten (speziell mit Claude & Codex). 2026 wird das Jahr, in dem die Industrie diese neuen Fähigkeiten "verstoffwechselt" und neue organisatorische Workflows findet.
