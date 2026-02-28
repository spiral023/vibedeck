---
title: 'Anthropic: Einen C-Compiler mit einem Team paralleler Claude-Agenten bauen'
description: >-
  Anthropic zeigt, wie 16 parallel laufende Claude-Agenten in rund 2.000 Sessions einen Rust-basierten C-Compiler für
  Linux erzeugten. Der Bericht liefert konkrete Patterns für autonome Agent-Teams, Testharnesses und Sicherheitsgrenzen.
type: blog
status: published
category: workflows
icon: BrainCircuit
readTime: '12 Min'
readTimeMin: 12
tags:
  - modelle-tools
  - agenten-engineering
keyPoints:
  - >-
    Anthropic setzte 16 parallel arbeitende Claude-Agenten ein und erreichte damit in zwei Wochen einen funktionsfähigen
    100.000-Zeilen-C-Compiler.
  - >-
    Der größte Erfolgsfaktor war nicht der Prompt allein, sondern ein präziser Test- und Harness-Stack, der autonome
    Fortschritte ohne permanente Menschenaufsicht ermöglicht.
  - >-
    Trotz starker Ergebnisse bleiben klare Grenzen: fragile Regressionen, schwierige Spezialfälle und hohe
    Sicherheitsrisiken bei ungeprüftem autonomen Deployment.
aliases:
  - 'Anthropic C-Compiler mit Claude-Agenten'
  - 'Building C Compiler Anthropic'
people:
  - '[[Nicholas Carlini]]'
topics:
  - '[[Claude]]'
  - '[[Agenten-Orchestrierung]]'
  - '[[Compiler Engineering]]'
  - '[[Test Harness]]'
  - '[[AI Safety]]'
sourceURL: 'https://www.anthropic.com/engineering/building-c-compiler'
sourceType: blog
author: Nicholas Carlini
sourceDate: '2026-02-05'
addedDate: '2026-02-26'
slug: 'anthropic-building-c-compiler'
---

Kurzkontext: [[Nicholas Carlini]] ordnet die Entwicklung entlang von [[Claude]] ein.

![Header](/images/blog/anthropic-building-c-compiler/header.png)

Anthropic hat mit „Building a C compiler with a team of parallel Claudes“ einen außergewöhnlich konkreten Engineering-Bericht veröffentlicht: Nicht nur ein weiterer Demo-Post über Agentic Coding, sondern ein belastbarer Praxisbericht mit Aufwand, Kosten, Architekturentscheidungen und harten Limitierungen.

Der Kern des Experiments: Ein Team aus **16 parallel laufenden Claude-Agenten** sollte einen **Rust-basierten C-Compiler** von Grund auf bauen, der große reale Projekte kompiliert, darunter den Linux-Kernel. Das Ergebnis ist beeindruckend, aber noch wichtiger sind die methodischen Learnings über autonome Agent-Teams.

## Worum es in dem Experiment wirklich ging

Der Compiler selbst ist das sichtbare Artefakt. Carlini macht jedoch klar, dass der eigentliche Erkenntnisgewinn in der Frage lag:

> Wie baut man eine Umgebung, in der LLM-Agenten über lange Zeit autonom und sinnvoll Fortschritt machen, ohne dass ein Mensch ständig daneben sitzt?

Damit verschiebt sich der Fokus von „Kann das Modell Code schreiben?“ zu:

- Wie definiere ich verlässliche Erfolgsmetriken?
- Wie verhindere ich, dass Agenten am falschen Problem arbeiten?
- Wie strukturiere ich Parallelität, damit sie echte Geschwindigkeit bringt?
- Wo stoßen Agent-Teams praktisch an Grenzen?

## Die Größenordnung: Sessions, Tokens, Kosten

Die publizierten Eckdaten sind bemerkenswert klar:

- knapp **2.000 Claude-Code-Sessions**
- etwa **2 Milliarden Input-Tokens**
- rund **140 Millionen Output-Tokens**
- Gesamtkosten knapp **20.000 US-Dollar**
- Entwicklungsdauer: ungefähr **zwei Wochen**

Das Resultat war ein Compiler mit rund **100.000 Zeilen**, der Linux 6.9 auf **x86, ARM und RISC-V** bauen kann, dazu mehrere große Open-Source-Projekte (u. a. QEMU, FFmpeg, SQLite, Postgres, Redis) und hohe Test-Suiten-Abdeckung.

Wichtig ist die Einordnung: 20.000 Dollar sind hoch für ein Experiment, aber im Vergleich zu klassischer Team-Engineering-Zeit dennoch potenziell konkurrenzfähig, wenn man die Geschwindigkeit und Parallelität berücksichtigt.

## „Long-running Claudes“: Der einfachste Loop ist oft genug

Ein zentrales Pattern im Bericht ist überraschend schlicht: ein Endlos-Loop, der Claude nach Abschluss einer Aufgabe sofort zur nächsten führt.

Dieses Prinzip wirkt banal, löst aber ein fundamentales Problem vieler Agent-Setups:

- Ein einzelner Agent stoppt oft bei Unsicherheit und wartet auf neue Instruktionen.
- Für große Projekte erzeugt das Pausen und menschlichen Koordinationsaufwand.
- Ein robuster Loop erzwingt kontinuierliche Iteration.

Das heißt nicht, dass der Loop allein genügt. Er funktioniert nur dann, wenn Tests, Feedback und Projektstruktur klar genug sind, damit der Agent „weiß“, was als nächster sinnvoller Schritt gilt.

## Parallelisierung: Warum ein Agent nicht reicht

Carlini beschreibt zwei unmittelbare Vorteile paralleler Instanzen:

1. **Mehrere Bugs gleichzeitig bearbeiten**
2. **Rollen-Spezialisierung zwischen Agenten**

Die Implementierung war bewusst minimalistisch: Bare Git-Repo, pro Agent ein Container, lokaler Workspace, Push zurück ins Upstream-Repo. Zur Konfliktvermeidung kam ein einfaches Synchronisations-/Locking-Modell zum Einsatz, damit nicht mehrere Agenten dieselbe Aufgabe gleichzeitig „bearbeiten“.

Gerade diese Nüchternheit ist lehrreich: Hohe Wirkung braucht nicht zwingend komplexe Multi-Agent-Meta-Orchestrierung, solange Zuständigkeiten und Rückkopplung klar sind.

## Der eigentliche Hebel: Testharness statt „besserer Prompt“

Der stärkste Teil des Berichts ist die Testmethodik. Carlini betont, dass autonome Agenten zuverlässig das optimieren, was der Verifier misst. Ist der Verifier unpräzise, optimieren sie zuverlässig am Ziel vorbei.

Daraus folgt eine harte Regel:

> Wenn dein Testharness schlecht ist, wird der Agent falsch „erfolgreich“ sein.

Er nennt mehrere praktische Maßnahmen:

- hochwertige Compiler-Test-Suites integrieren
- Verifier und Build-Skripte für reale OSS-Projekte schreiben
- neue Tests entlang beobachteter Fehlermuster ergänzen
- CI-Verschärfung einführen, sobald Regressionen zunehmen

Insbesondere im späteren Projektverlauf trat ein typisches Problem auf: Neue Features zerstörten bestehende Funktionalität. Erst durch strengere CI-Checks wurde der Progress wieder stabiler.

## Tests für Agenten sind nicht Tests für Menschen

Ein subtiler, aber entscheidender Punkt: Der Autor musste sich selbst ständig daran erinnern, dass er die Testumgebung **für Claude** designt, nicht für Menschen.

Das verändert, wie Feedback aussehen muss:

- klar, maschinenlesbar, ohne unnötige Ambiguität
- präzise Fehlerlokalisierung statt rein „rot/grün“
- kurze Orientierungszeit für neue, kontextarme Agent-Instanzen

Deshalb wurden auch umfangreiche README- und Fortschrittsdateien gepflegt, damit Agenten in frischen Containern schneller verstehen, wo das Projekt steht und was als Nächstes zu tun ist.

## Wenn Parallelität plötzlich nicht mehr hilft

Ein besonders aufschlussreicher Abschnitt betrifft den Linux-Kernel-Build. Dort zeigte sich eine natürliche Grenze:

- Bei vielen unabhängigen Fehlern skaliert Parallelität sehr gut.
- Bei einem großen monolithischen Fehlerzustand laufen alle Agenten gegen dasselbe Problem.
- Ergebnis: Überschreiben, Konflikte, wenig Nettofortschritt.

Die Lösung war ein **Oracle-Ansatz mit GCC**:

- Teilmengen wurden mit GCC kompiliert,
- andere Teilmengen mit dem Claude-Compiler,
- daraus wurde schrittweise eingegrenzt, in welchen Dateien/Bereichen die eigentlichen Fehler lagen.

So wurde das große monolithische Problem in mehrere parallel bearbeitbare Teilprobleme überführt. Das ist ein starkes Muster für andere Agent-Teams: Gute Oracles können schwierige Suchräume dramatisch verkleinern.

## Spezialisierte Agenten als Qualitätsmultiplikator

Anthropic setzte nicht nur „N identische Bugfix-Agenten“ ein, sondern auch spezialisierte Rollen:

- Duplikat-Code konsolidieren
- Compiler-Performance verbessern
- Qualität des erzeugten Zielcodes erhöhen
- Rust-Designkritik und strukturelle Refactors
- Dokumentation pflegen

Diese Aufteilung spiegelt ein wichtiges Prinzip: Parallelität bringt erst dann maximalen Effekt, wenn Aufgabenprofile unterschiedlich sind. Sonst skaliert man denselben Blindspot nur schneller.

## Modellvergleich im Zeitverlauf

Der Bericht ordnet die Ergebnisse über mehrere Claude-Generationen ein. Frühere Opus-4-Varianten waren noch knapp am Schwellenwert für einen funktionalen Compiler. Opus 4.5 schaffte große Test-Suites, aber noch keine großen realen Projekte. Mit Opus 4.6 wurde erstmals der beschriebene Umfang möglich.

Das ist kein „Model-War“-Punkt, sondern methodisch interessant: Capability-Sprünge zeigen sich oft zuerst in langen, multi-step Engineering-Aufgaben, nicht nur in isolierten Benchmark-Fragen.

## Was der Compiler kann und was nicht

Die Ergebnisse sind stark, aber Anthropic dokumentiert bewusst die Grenzen:

- Regressionen blieben ein wiederkehrendes Problem
- manche Features waren schwer stabil zu integrieren
- besonders herausfordernd war ein 16-bit-x86-Codegenerator für den Boot-Pfad

In diesem Spezialfall wich das System auf GCC aus. Das zeigt eine wichtige Realität autonomer Agentenentwicklung: Teilweise „Cheats“ oder Hybridpfade sind in der Praxis oft nötig, um End-to-End-Funktionalität zu erreichen.

## Sicherheits- und Qualitätsrisiken: der unbequeme Teil

Carlini spricht einen kritischen Punkt offen an: Wenn Menschen nicht mehr eng im Loop sind, steigt das Risiko, dass „alles grün“ fälschlich als „alles sicher“ gelesen wird.

Seine Sorge ist nachvollziehbar:

- Tests decken nie alle realen Angriffsflächen ab
- autonome Systeme können plausible, aber fragile Artefakte produzieren
- ungeprüftes Deployment kann Sicherheitslücken skalieren

Gerade aus dieser Ambivalenz zieht der Text seine Glaubwürdigkeit: hohe Begeisterung für den Fortschritt, aber keine romantische Verklärung der Risiken.

## Was Engineering-Teams konkret daraus lernen können

Für die Praxis lassen sich mehrere direkt nutzbare Leitlinien ableiten:

1. **Beginne mit dem Verifier, nicht mit dem Prompt**  
   Ohne präzises Erfolgskriterium wird autonome Produktivität zum Zufall.

2. **Baue Feedback für Agenten, nicht für menschliche Lesbarkeit allein**  
   Klare, maschinenorientierte Rückmeldungen beschleunigen Iteration spürbar.

3. **Spezialisiere Agentenrollen früh**  
   Qualität, Doku, Refactoring und Performance brauchen eigene Tracks.

4. **Nutze Oracles bei monolithischen Fehlerzuständen**  
   Referenzsysteme wie GCC helfen, große Probleme in Teilprobleme zu zerlegen.

5. **Plane Sicherheits-Gates explizit ein**  
   Längere autonome Läufe erhöhen den Bedarf an menschlicher Endprüfung.

6. **Erwarte Grenzfälle und Hybridlösungen**  
   „Fast vollständig autonom“ ist oft realistischer als „vollständig autonom“.

## Praktische Blueprint-Checkliste für eigene Agent-Teams

Wer ähnliche Experimente aufsetzen möchte, kann den Anthropic-Ansatz als pragmatischen Blueprint lesen. Eine sinnvolle Reihenfolge wäre:

1. **Scope technisch eng und messbar setzen**  
   Wähle ein Ziel mit klaren Akzeptanzkriterien, z. B. „Projekt X baut und Testsuite Y läuft mit Z Prozent Erfolgsrate“.

2. **Baseline mit bekannt gutem Tooling etablieren**  
   Definiere zuerst eine stabile Referenz (z. B. GCC, bestehender Compiler, etablierter Build-Pfad), damit Regressionen objektiv erkennbar bleiben.

3. **Autonomen Loop sicher kapseln**  
   Agenten in isolierten Containern laufen lassen, mit klarer Dateisystemgrenze, reproduzierbaren Dependencies und sauberem Logging.

4. **Task-Locking und Konfliktvermeidung einbauen**  
   Schon ein einfacher Lock-Mechanismus verhindert, dass mehrere Agenten identische Aufgaben parallel „kaputt optimieren“.

5. **Feedback-Granularität erhöhen**  
   Bei Misserfolg nicht nur „fail“, sondern testnahe Diagnostik mitgeben: betroffene Datei, konkrete Assertion, erwartetes Verhalten.

6. **Spezialrollen früh anlegen**  
   Mindestens je ein Agent für Qualität, Performance und Dokumentation lohnt sich meist schon ab mittlerer Projektgröße.

7. **Human Review als Gate beibehalten**  
   Auch bei hoher Automatisierung sollten sicherheits- und releasekritische Schritte explizit menschlich verifiziert werden.

Diese Reihenfolge reduziert das Risiko, dass ein Team zu früh „mehr Agenten“ skaliert, obwohl der eigentliche Flaschenhals in der Umgebung und Messbarkeit liegt.

## Wo Agent-Teams kurzfristig besonders sinnvoll sind

Nicht jede Aufgabe profitiert gleichermaßen. Der Bericht deutet an, dass Agent-Teams vor allem dort stark sind, wo:

- das Ziel klar technisch verifizierbar ist,
- viele Teilaufgaben parallelisierbar sind,
- Regressionen automatisiert messbar bleiben,
- und bestehende Referenzimplementierungen als Oracle dienen können.

Typische Kandidaten:

- Compiler-, Interpreter- und Toolchain-Projekte
- API- und Protokoll-Migrationen mit umfangreichen Tests
- große Refactors mit klaren Non-Regression-Kriterien
- Performance-Optimierungswellen entlang messbarer Benchmarks

Weniger geeignet sind Vorhaben mit stark unscharfen Erfolgskriterien oder hohem Anteil an implizitem Domänenwissen ohne gute Testbarkeit.

## Offene Fragen für 2026 und darüber hinaus

Der Post zeigt, was heute möglich ist, lässt aber strategische Fragen offen, die für Teams entscheidend werden:

- Wie sehen belastbare Sicherheitsstandards für autonome Multi-Agent-Delivery aus?
- Welche Governance braucht man, wenn Agenten über Tage ohne menschliche Live-Steuerung laufen?
- Ab wann lohnt sich ein expliziter Orchestrator-Agent gegenüber dezentraler Selbstkoordination?
- Wie quantifiziert man „verdeckte Qualitätskosten“ bei scheinbar erfolgreichen Testläufen?

Gerade diese offenen Fragen machen den Bericht wertvoll. Er liefert keine endgültige Blaupause, sondern einen realen Zwischenstand in einem Feld, das sich schnell bewegt.

## Warum dieser Bericht über Compiler hinaus relevant ist

Man muss keinen Compiler bauen, um von den Erkenntnissen zu profitieren. Das Muster gilt ebenso für andere komplexe Softwareprojekte:

- große Refactors
- Multi-Repo-Migrationen
- Infrastruktur-Automation
- langlaufende Integrationsprojekte

Überall dort, wo Aufgaben über viele Stunden oder Tage laufen, wird der Unterschied zwischen „ein Agent, ein Prompt“ und „Agent-Team mit belastbarer Harness-Architektur“ drastisch.

## Fazit

Der Anthropic-Post zeigt, dass autonome Agent-Teams 2026 bereits mehr sind als ein Forschungs-Gimmick. Mit guter Testarchitektur, Parallelisierung und klarer Rollenaufteilung können sie heute Projekte umsetzen, die vor kurzem noch außerhalb realistischer Erwartungen lagen.

Gleichzeitig ist die wichtigste Lehre keine reine Capability-Story. Sie lautet: Der Engpass verschiebt sich vom Generieren einzelner Codeblöcke hin zum **Design der Umgebung**, in der Agenten arbeiten dürfen.

Wer diese Umgebung präzise baut, bekommt enorme Hebel. Wer sie vernachlässigt, skaliert vor allem Fehler.

## Verbindungen

- [[Nicholas Carlini]]
- [[Claude]]
- [[Agenten-Orchestrierung]]
- [[Compiler Engineering]]
- [[Test Harness]]
- [[AI Safety]]

