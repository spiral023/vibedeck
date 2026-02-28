---
title: 'Intent Engineering: Warum Prompt- und Context-Optimierung allein nicht mehr reichen'
description: >-
  Das Video zeigt, warum Enterprise-AI nicht an Modellintelligenz scheitert, sondern an fehlender Zielausrichtung: Ohne
  maschinenlesbaren Intent optimieren Agenten lokale Metriken statt Kundenwert, Marke und langfristigem ROI.
category: fundamentals
icon: BrainCircuit
readTime: 8 Min
tags:
  - kontext-prompting
  - unternehmen-adoption
  - agenten-engineering
  - strategie-fuehrung
keyPoints:
  - >-
    Klarna zeigt das Kernrisiko: Ein leistungsstarker Agent kann die falsche Metrik perfekt optimieren und dabei
    Kundenerlebnis, Vertrauen und Marke beschädigen.
  - >-
    Context Engineering bleibt notwendig, aber erst Intent Engineering macht Ziele, Trade-offs und Eskalationsregeln für
    Agenten maschinenlesbar und handlungsfähig.
  - >-
    Der AI-Wettbewerb verschiebt sich von Modellqualität zu organisatorischer Klarheit: Wer Intent strukturiert und
    operationalisiert, skaliert Nutzen statt Aktivität.
sourceURL: 'https://www.youtube.com/watch?v=QWzLPn164w0'
sourceType: blog
author: AI News & Strategy Daily | Nate B. Jones
sourceDate: '2026-02-24'
addedDate: '2026-02-26'
---

![Header](/images/blog/intent-engineering-statt-prompt-und-context/header.jpg)

Das Video „Prompt Engineering Is Dead. Context Engineering Is Dying. What Comes Next Changes Everything.“ stellt eine unangenehme, aber präzise Diagnose: In Enterprise-AI ist nicht mehr das Modell der Engpass, sondern die fehlende Ausrichtung auf den eigentlichen Unternehmenszweck.

Die zentrale These lautet: AI-Systeme können heute so gut werden, dass sie exakt das Falsche optimieren. Wenn ein Agent nur auf lokal messbare KPIs trainiert oder gesteuert wird, steigert er diese KPI zuverlässig, selbst wenn dadurch strategischer Wert zerstört wird.

> Kontext sagt der AI, was sie wissen soll. Intent sagt ihr, was sie wollen soll.

## Klarna als Warnsignal: Wenn „zu gut“ zum Problem wird

Als Beispiel beschreibt das Video Klarna: Der AI-Customer-Service-Agent habe Arbeit im Umfang von 853 FTE übernommen und rund 60 Mio. Dollar eingespart. Gleichzeitig räumte das Management ein, dass dabei Kundenerlebnis, Vertrauen und Markenwirkung gelitten haben.

Der kritische Punkt ist nicht, dass der Agent „schlecht“ war. Im Gegenteil: Er war sehr gut darin, Tickets schnell zu schließen. Genau das war das Problem.

- Lokal optimiertes Ziel: kurze Bearbeitungszeit, hohe Abschlussquote.
- Tatsächliches Unternehmensziel: langfristige Kundenbeziehung, höherer Lifetime Value, Markentreue.

Menschen balancieren solche Zielkonflikte oft implizit: Sie nehmen sich bei heiklen Fällen mehr Zeit, eskalieren bewusst, oder biegen Regeln kontrolliert, wenn der langfristige Kundennutzen es erfordert. Ein Agent ohne expliziten Intent hat dafür kein belastbares Entscheidungsmodell.

> Ein Agent mit Prompt und Kontext kann trotzdem scheitern, wenn ihm Zielhierarchie und Trade-off-Logik fehlen.

## Von Prompt zu Context zu Intent Engineering

Das Video ordnet drei Entwicklungsstufen ein:

### 1) Prompt Engineering

Prompt Engineering ist die Kunst der Anweisung im Chatfenster. Es bleibt nützlich, aber skaliert in Unternehmen begrenzt, weil die Qualität stark von einzelnen Personen und situativer Formulierung abhängt.

### 2) Context Engineering

Context Engineering baut die Informationsgrundlage: RAG, Tool-Zugriffe, Wissensobjekte, MCP-Server, Rechtekonzepte, Aktualität. Ohne diese Schicht operieren Agenten blind.

Aber: Vollständiger Kontext löst das Zielproblem nicht. Ein Agent kann alles Relevante wissen und trotzdem falsch priorisieren.

### 3) Intent Engineering

Intent Engineering ist laut Video der nächste Schritt: Ziele, Werte, Prioritäten, Eskalationsregeln und Entscheidungsschranken werden so strukturiert, dass Agenten danach handeln können.

Das bedeutet konkret:

- Welche Metrik ist führend, welche nur sekundär?
- Welche Trade-offs sind erlaubt (z. B. Speed vs. Qualität)?
- Wann muss eskaliert werden?
- Welche Aktionen sind erlaubt, welche verboten?
- Wie wird Drift erkannt und korrigiert?

Erst diese Schicht macht aus einem „fähigen“ Agenten einen organisatorisch ausgerichteten Agenten.

## Warum „viel Investment“ und „kein ROI“ gleichzeitig wahr sein können

Viele Unternehmen investieren massiv in AI und berichten dennoch keinen spürbaren End-to-End-Impact. Das Video deutet das nicht als Modellversagen, sondern als Intent-Lücke.

In der Praxis sieht das so aus:

- Teams beantworten lokal: „Kann AI Aufgabe X automatisieren?“
- Sie verfehlen global: „Wird Aufgabe X so erledigt, dass Unternehmensziele stabil getroffen werden?“

Das erzeugt Aktivität ohne nachhaltige Wirkung. Prozesse werden schneller, aber nicht zwingend besser. Dashboards zeigen Nutzung, nicht zwingend Wertbeitrag.

## Copilot als zweites Beispiel: Adoption ohne Durchbruch

Als weiteres Beispiel nennt das Video Microsoft Copilot: breite Einführung, aber stagnierende Nutzung.

Die zugespitzte Analogie ist treffend: Wer ein AI-Tool flächig ausrollt, ohne den organisatorischen Intent zu übersetzen, stellt tausende neue Mitarbeitende ein und sagt ihnen nie:

- was wirklich wichtig ist,
- welche Entscheidungen sie selbst treffen dürfen,
- wie Zielkonflikte aufgelöst werden.

Ergebnis: viel Interaktion, wenig messbarer Outcome.

## Die drei Ebenen der Intent-Lücke

Das Video beschreibt drei systemische Ebenen, auf denen Unternehmen heute häufig scheitern.

### 1) Unified Context Infrastructure

Unternehmen brauchen eine einheitliche, sichere und versionierte Kontextschicht mit klarer Governance:

- Berechtigungen und Data Access by Design
- aktualitätsgesicherte Wissensquellen
- Nachvollziehbarkeit von Änderungen

Ohne diese Basis entstehen „Shadow Agents“ analog zu Shadow IT, aber mit höherem Risiko, weil Agenten nicht nur lesen, sondern handeln.

### 2) Coherent AI Worker Toolkit

Individuelle Tool-Bastelei skaliert nicht. Was skaliert, ist ein gemeinsames Set übertragbarer Workflows:

- standardisierte Aufgabentypen
- wiederverwendbare Agent-Patterns
- gemeinsame Qualitäts- und Freigabekriterien

Damit verschiebt sich AI-Fluency von persönlicher Prompt-Kunst zu teamfähiger operativer Infrastruktur.

### 3) Intent Engineering im engeren Sinn

OKRs sind für Menschen formuliert. Agenten brauchen handlungsfähige Zielparameter:

- maschinenlesbare Erfolgssignale und Datenquellen
- erlaubte und verbotene Aktionsräume
- klare Priorität bei Zielkonflikten
- Eskalationsschwellen
- Feedback-Loops zur Drift-Erkennung

> Ohne explizite Intent-Schicht optimieren Agenten das Messbare, nicht zwingend das Wichtige.

## Warum das bisher kaum jemand sauber gebaut hat

Das Video nennt drei Gründe, die in der Praxis plausibel sind:

1. Das Problem ist neu. Früher war der Mensch die Intent-Schicht in Echtzeit.
2. Strategie und Engineering arbeiten oft in getrennten Kulturen.
3. Entscheidendes Wissen ist tacit knowledge: implizit, historisch gewachsen, selten formalisiert.

Gerade bei langlebigen Agenten, die über Wochen oder Monate operieren, wird diese Lücke sichtbar. Was früher im Kopf von erfahrenen Mitarbeitenden steckte, muss nun formalisiert und operationalisiert werden.

## Was ein organisatorisches Intent-Betriebssystem leisten muss

Als Zielbild skizziert das Video eine vendor-agnostische Architektur, die drei Dinge zusammenführt:

1. **Governance für Kontextzugriff**
   Einheitliche Sicherheits-, Compliance- und Freigaberegeln über Tools und Modelle hinweg.

2. **Lebende Capability Map**
   Transparentes Mapping, was agent-ready ist, was human-in-the-loop braucht und was human-only bleiben muss.

3. **Übersetzungsschicht von Strategie zu Entscheidung**
   Unternehmensziele werden in konkrete Entscheidungsparameter für Agenten überführt.

Der strategische Schluss daraus ist klar: Der Wettbewerb verschiebt sich von „Wer hat das stärkste Modell?“ zu „Wer hat den klarsten und strukturiertesten organisationalen Intent?“.

## Praktischer Startpunkt für Teams

Aus den Argumenten des Videos lässt sich ein nüchterner Startplan ableiten:

1. Wähle einen geschäftskritischen Workflow mit klaren Zielkonflikten.
2. Dokumentiere die reale Zielhierarchie explizit, nicht nur die KPI.
3. Definiere erlaubte Aktionen, rote Linien und Eskalationsregeln.
4. Implementiere Monitoring auf Outcome-Ebene statt nur Aktivitätsmetriken.
5. Führe regelmäßige Drift-Reviews mit Business und Engineering gemeinsam durch.

So wird aus „Agent funktioniert technisch“ schrittweise „Agent arbeitet im Sinne des Geschäfts“.

## Fazit

Das Video trifft einen Kernpunkt der aktuellen Enterprise-AI-Phase: Prompt Engineering war der Einstieg, Context Engineering die notwendige Skalierungsschicht, aber beides reicht nicht aus, wenn Intent fehlt.

Wer Intent nicht explizit macht, bekommt oft genau das, was er messbar fordert, und verfehlt dennoch den eigentlichen Zweck. Wer Intent sauber strukturiert, kann dagegen auch mit nicht-maximalen Modellen robuste Resultate erzielen.

Die eigentliche strategische Frage ist deshalb nicht mehr primär, welches Modell ein Unternehmen nutzt, sondern ob es seinen eigenen Zweck so klar operationalisiert hat, dass autonome Systeme danach handeln können.
