---
title: "Claude + Obsidian: Ein echter KI-Mitarbeiter, der sich alles merkt"
description: "Wie Fraser Cottrell Claude mit Obsidian, MCP und automatischer Transkript-Verarbeitung zu einem dauerhaft lernenden Geschäftssystem verbunden hat – Schritt für Schritt nachbaubar."
type: source
status: seed
category: workflows
icon: BrainCircuit
readTime: 11
tags:
  - workflows/knowledge-management
  - workflows/agentic-coding
  - tooling/obsidian
  - tooling/mcp
aliases:
  - "AI Employee System"
  - "Claude Obsidian System"
topics:
  - "[[MCP]]"
  - "[[Obsidian]]"
  - "[[Persistent Memory]]"
  - "[[Knowledge Management]]"
  - "[[Claude Cowork]]"
up: "[[Agentic Workflows]]"
sourceURL: "https://x.com/sourfraser/status/2035454870204100810"
sourceType: "thread"
author: "Fraser Cottrell (@sourfraser)"
sourceDate: "2026-03-21"
addedDate: "2026-04-27"
---

![Claude + Obsidian – AI Employee System](/images/knowledge/claude-obsidian-ai-employee/header.jpg)

Fraser Cottrell, Founder einer Ad-Creative-Agentur mit 15 Mitarbeitenden, hat Claude mit Obsidian, automatischer Transkript-Verarbeitung und MCP-Konnektoren zu einem System verbunden, das er als „echten KI-Mitarbeiter" bezeichnet. Das System lief an einem Nachmittag auf – und wächst seitdem täglich von selbst.

> Most people use AI like a temp worker with amnesia. Open a chat. Paste some context. Get a response. Close the tab. Next conversation? Start from scratch.
> — @sourfraser

## Das Grundproblem

Das Standardmuster bei der KI-Nutzung: Context einfügen, Antwort holen, Tab schließen. Beim nächsten Chat wieder von vorne erklären, wer man ist, was das Unternehmen macht, was zuletzt besprochen wurde. Das ist kein KI-Mitarbeiter – das ist eine Suchmaschine mit Persönlichkeit.

Die Lösung liegt nicht im Modell. Sie liegt darin, ihm **etwas zum Erinnern** zu geben.

## Das System: 3 Ebenen

### Ebene 1 – Die Wissensbasis (Obsidian)

Obsidian ist eine kostenlose Notiz-App, die alles als Plain-Text-Dateien lokal speichert. Fraser hat seinen Vault als vollständiges Business-Betriebssystem aufgebaut:

- **Memory-Datei** – das Onboarding-Dokument für den KI-Mitarbeiter: wer er ist, wie das Unternehmen strukturiert ist, Prozesse, Tools, Kommunikationsstil, Ziele. Alles, was Claude wissen muss, bevor er ein Wort sagt.
- **Client Roster** – alle aktiven Kunden mit Status und Verantwortlichen
- **Action Tracker** – alle offenen Aufgaben mit Owner und Deadline
- **Frameworks-Bibliothek** – Verkaufsprozess, Produktionsworkflow, Orgstruktur
- **Templates-Ordner** – wiederverwendbare Formate für Call-Notizen, Follow-up-Mails, Proposals, Daily Briefs

Alle Dateien sind verlinkt. Jede Datei hat eine übergeordnete Datei. Alles führt zurück zu einer zentralen Home-Seite. Das ergibt einen **Knowledge Graph des Unternehmens**.

**Tipp:** Den Obsidian-Vault in Google Drive (oder Dropbox/iCloud) ablegen – nicht in einem lokalen Ordner. So ist der Vault auf jedem Gerät synchron, und Claude hat überall denselben Kontext.

### Ebene 2 – Der automatische Memory Loop

Das ist der Teil, der alles verändert hat:

1. **Fathom** nimmt Calls auf und transkribiert sie
2. **Zapier** legt jedes neue Transkript automatisch in Google Drive ab
3. **Claude** (via MCP) liest die Transkripte täglich und extrahiert:
   - Zusammenfassung des Gesprächs
   - Alle getroffenen Entscheidungen
   - Alle Action Items (Wer, Was, Deadline)
4. Claude schreibt die Ergebnisse direkt in den Obsidian-Vault: Actions in den Action Tracker, Entscheidungen ins Log, Client-Infos in die jeweilige Client-Datei

> Three weeks ago I was on a call where we agreed to change how we handle product shipping for a specific client. I forgot about it completely. Two days later I asked Claude about that client's status and it pulled up the decision from the transcript — with the exact context of why we made it.

Kein Code, kein manueller Schritt. Jeder Call landet automatisch als strukturiertes Wissen im System.

**Kompatible Tools:** Fathom, Otter, Fireflies, Google Meet Recording, Zoom – jedes Tool, das Transkripte in Drive/Dropbox/lokale Ordner exportiert.

### Ebene 3 – Die Intelligenzschicht (Claude Cowork + MCP)

Obsidian ist das Gehirn. Aber ohne Anbindung bleibt es ein passives Ablagesystem.

**Claude Cowork** läuft als Desktop-App und verbindet sich über **MCP-Konnektoren** mit den tatsächlichen Arbeitstools: Slack, Google Calendar, Gmail, Google Drive, ClickUp. MCP gibt Claude die Schlüssel zur Arbeitsumgebung.

Das macht folgende Abfragen möglich:

- *„Check my Slack and tell me what's going on across clients"* → vollständiger Status-Report: wer ist on track, wer ist blockiert, wo fehlt Feedback
- *„What do I have coming up this week"* → Kalender + relevanter Vault-Kontext: welche Clients, was wurde zuletzt besprochen, welche Actions sind noch offen

> That's not a chatbot. That's a chief of staff.

## Der Compound-Effekt

Das System lernt durch bloße Nutzung:

| Woche | Was Claude weiß |
|---|---|
| 1 | Basics: Wer du bist, was dein Unternehmen macht |
| 4 | Clients, Team-Dynamiken, Prozesse, Kommunikationspräferenzen |
| 8 | Fängt Versäumnisse auf, erinnert an Zusagen, verbindet Dots über verschiedene Geschäftsbereiche |

Der Vault wächst täglich. Weil Claude ihn zu Beginn jeder Session einliest, weiß er bei jedem Gespräch mehr.

## So baust du das nach

Das System besteht aus **5 Komponenten** – kein Code, kein komplexes Setup:

### 1. Obsidian (kostenlos)

Vault anlegen mit: Memory-Datei, Home-Seite, Ordner für Clients, Calls, Actions, Templates. Die Memory-Datei ist das zeitintensivste Stück – ein Brain-Dump von allem, was jemand wissen müsste, um neben dir zu arbeiten. Je gründlicher, desto besser.

### 2. Call-Transkription → Google Drive

Beliebiges Transkriptions-Tool wählen, Transkripte in einen Drive-Ordner routen. Fathom + Zapier für vollständige Automatisierung. Auch manueller Export funktioniert – perfect ist der Feind von done.

### 3. Obsidian MCP

Open-Source MCP-Server, der Claude direkten Lese- und Schreibzugriff auf den Vault gibt. Installation: ein Node-Package, konfiguriert in Claudes MCP-Einstellungen. Setup: ~5 Minuten.

Ohne diesen Konnektor müsste man zwischen Claude und Obsidian copy-pasten. Mit ihm schreibt Claude direkt in den Vault.

### 4. Claude Cowork + MCP-Konnektoren

Cowork auf dem Desktop installieren, dann für jedes Tool einen MCP-Konnektor hinzufügen: Obsidian, Drive, Slack, Google Calendar. Jeder Konnektor dauert wenige Minuten.

**Wichtige Einstellung:** In den User Preferences eintragen, dass Claude zu Beginn jeder Session die Memory-Datei liest. Ohne diese Anweisung: mächtiges Tool ohne Gedächtnis. Mit ihr: Mitarbeiter mit Kontext.

### 5. Custom Instructions

Eine einzige Zeile reicht:

> "Before answering any question, always search the Obsidian vault for relevant notes. Use what you find to inform your response."

Diese Anweisung funktioniert in Claude Cowork, in Claude Projects und überall dort, wo Claude MCP-Zugriff hat. Zusätzlich können Routing-Regeln hinterlegt werden – wo Actions gespeichert werden, wohin Entscheidungen geloggt werden, wo Session-Zusammenfassungen landen. Fraser hält all das in der Memory-Datei selbst, sodass Claude die Routing-Regeln gleichzeitig mit dem Kontext einliest.

## Kosten

| Komponente | Kosten |
|---|---|
| Obsidian | kostenlos |
| Obsidian MCP | kostenlos (Open Source) |
| MCP-Konnektoren | kostenlos |
| Claude (Cowork / Pro) | monatlicher Plan |
| Fathom | kostenlos (Basic) / kostenpflichtig |

Das System ersetzt kein Team. Es eliminiert den operativen Overhead: das Kontextwechseln, das „Was haben wir auf dem letzten Call vereinbart?", das Scrollen durch Slack um 7 Uhr morgens.

> Your tools are only as good as the system behind them.

## Verbindungen
- [[MCP]]
- [[Obsidian]]
- [[Persistent Memory]]
- [[Knowledge Management]]
- [[Claude Cowork]]
- [[Agentic Workflows]]
- [[Knowledge Graph]]
- [[Call Transcription]]
- [[Zapier]]
- [[Custom Instructions]]
