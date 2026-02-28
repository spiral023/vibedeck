---
title: Der Software Development Lifecycle (SDLC) ist tot
description: KI-Agenten beschleunigen den SDLC nicht nur – sie bringen ihn zum Einsturz. Ein Blick auf die neue Ära der Softwareentwicklung.
type: source
status: seed
category: fundamentals
icon: Skull
readTime: 8
tags:
  - workflows/sdlc
  - patterns/ai-agents
  - workflows/devops
  - workflows/software-engineering
  - workflows/future-of-work
aliases:
  - Der Software Development Lifecycle (SDLC) ist tot
topics:
  - "[[AI Engineering]]"
  - "[[DevOps]]"
  - "[[Prompt Engineering]]"
  - "[[Workflow Design]]"
up: "[[AI Engineering]]"
sourceURL: https://boristane.com/blog/the-software-development-lifecycle-is-dead/
sourceType: blog
author: Boris Tane
sourceDate: "2026-02-20"
addedDate: "2026-02-25"
---

KI-Agenten haben den Software Development Lifecycle (SDLC) nicht einfach nur schneller gemacht. Sie haben ihn getötet.

Die Vorstellung von KI als bloßem "10x Entwickler-Tool" greift zu kurz. Sie setzt voraus, dass der Workflow gleich bleibt und nur das Tempo steigt. In Wirklichkeit bricht der gesamte Lebenszyklus, um den wir Karrieren aufgebaut und eine Milliarden-Industrie an Tools erschaffen haben, in sich zusammen.

## Der klassische SDLC ist ein Relikt

Der klassische SDLC, den wir gelernt haben, besteht aus diskreten, sequenziellen Phasen:
1. Requirements
2. System Design
3. Implementation
4. Testing
5. Code Review
6. Deployment
7. Monitoring

Jeder Schritt hat seine eigenen Rituale und Tools (Jira, Figma, GitHub, AWS, Datadog). Wenn ein Ingenieur jedoch mit einem Coding-Agenten arbeitet, verschmelzen diese Phasen. Es gibt keine Übergaben mehr. Es gibt nur noch **Intent (Absicht)**, **Context** und **Iteration**.

## Die Ära der AI-Native Engineers

Ingenieure, die ihre Karriere nach dem Launch von Tools wie Cursor gestartet haben, kennen den SDLC oft gar nicht mehr. Sie wissen nicht, was DevOps oder SRE ist – nicht weil sie schlecht sind, sondern weil sie es nie brauchten. Sie haben nie in Sprint-Plannings gesessen oder drei Tage auf ein Code Review gewartet. Sie beschreiben, was sie wollen, der Agent baut es, sie prüfen es und laden es hoch. Gleichzeitig.

## Der Zusammenbruch der Phasen

### Requirements: Fluid statt diktiert
Früher wurden Requirements eingefroren, bevor eine Zeile Code geschrieben wurde, weil Entwicklung teuer war. Heute generiert ein Agent eine komplette Funktion in Minuten. Man braucht keine detaillierte Spezifikation vorab; man gibt die Richtung vor, sieht das Ergebnis und passt es an. Jira wird so von einem Projektmanagement-Tool zu einem (schlechten) Speicher für Kontext.

### System Design: Entdeckt statt vorgeschrieben
Design passiert nicht mehr ausschließlich *vor* dem Code. Da Modelle mehr Architekturen gesehen haben als jeder Mensch, schlagen sie oft überlegene Lösungen vor, während man das Problem beschreibt. Design ist eine Echtzeit-Konversation geworden.

### Implementation & Testing: Die Aufgabe des Agenten
Agenten schreiben den Code und die Tests gleichzeitig. TDD ist keine Methode mehr, sondern der Standardzustand der KI. Das Konzept von QA als separater Phase verschwindet, da Code und Tests gemeinsam verifiziert werden.

### Code Review: Ein künstlicher Flaschenhals
Der Pull-Request-Flow (PR) ist in einer Welt, in der Agenten hunderte PRs am Tag erstellen könnten, ein Hindernis. Wir halten an menschlichen Ritualen fest, die nicht auf maschinelle Workflows skalieren. Die Verifizierung muss automatisiert werden: Ein zweiter Agent (Adversarial Agent) prüft den ersten, validiert gegen Architektur-Constraints und Tests. Menschen greifen nur noch bei echten Ausnahmen ein.

### Deployment: Kontinuierlich und entkoppelt
Agenten verwalten bereits komplexe Pipelines mit Feature Flags und Canary Releases. Deployment (Code landet in Produktion hinter einem Gate) wird von Release (Nutzer sieht das Feature) entkoppelt. Der Prozess wird zu einem dauerhaften, selbstregulierenden Kreislauf.

## Monitoring: Die letzte Bastion

Monitoring ist die einzige Phase, die nicht nur überlebt, sondern zum Fundament wird. Wenn Code schneller fließt, als Menschen ihn prüfen können, ist Observability der primäre Sicherheitsmechanismus. 

Doch Vorsicht: Die meisten Plattformen sind für Menschen gebaut (Dashboards, Alarme). Wenn 500 Änderungen pro Tag erfolgen, kann kein Mensch mehr jede Anomalie prüfen. Die Zukunft gehört **Closed-Loop-Systemen**, in denen Telemetriedaten direkt als Kontext zurück an den Agenten fließen, damit dieser Fehler selbst erkennt und behebt.

## Der neue Zyklus: Intent -> Build -> Observe

Der SDLC war ein weiter, linearer Bogen. Der neue Lebenszyklus ist ein enger Loop:
**Human Intent + Context -> AI Agent -> Build/Test/Deploy -> Observe -> Next Intent.**

Keine Tickets, keine Story Points, keine Warteschlangen. Nur noch eine Person mit einer Absicht und ein Agent, der sie ausführt.

**Was bleibt übrig? Kontext.**
Die Qualität dessen, was du mit Agenten baust, ist direkt proportional zur Qualität des Kontextes, den du ihnen gibst. Der neue Skill ist **Context Engineering**, das neue Sicherheitsnetz ist **Observability**.

*Quelle: Basierend auf einem Blogartikel von [Boris Tane](https://boristane.com/blog/the-software-development-lifecycle-is-dead/).*

## Verbindungen
- [[AI Engineering]]
- [[DevOps]]
- [[Prompt Engineering]]
- [[Workflow Design]]
- [[Agent Workflows]]
- [[Tool Calling]]
- [[Context Engineering]]
- [[Knowledge Management]]
