---
title: "Claude Cowork richtig einrichten: Der ultimative Guide für 2026"
description: "Erfahre, wie du Claude Cowork so konfigurierst, dass es deine Arbeit autonom erledigt, während du dich anderen Dingen widmest."
type: source
status: seed
category: workflows
icon: Layers
readTime: 12
tags:
  - tooling/claude-cowork
  - anthropic
  - ai-productivity
  - workflows
  - agents
aliases:
  - "Claude Cowork Setup Guide"
topics:
  - "[[Claude Cowork]]"
  - "[[File System Access]]"
  - "[[AskUserQuestion]]"
  - "[[Connectors]]"
  - "[[Global Instructions]]"
up: "[[Claude Tools]]"
sourceURL: "https://x.com/heynavtoor/status/2026717574776631556"
sourceType: article
author: "Nav Toor (@heynavtoor)"
sourceDate: "2026-02-25"
addedDate: "2026-02-25"
---

![Claude Cowork Setup Guide](/images/knowledge/claude-cowork-setup-guide/header.jpg)

> "Die Leute, die KI im Jahr 2026 wirklich 'verstehen', sind nicht diejenigen, die die cleversten Prompts schreiben. Es sind diejenigen, die Cowork verstanden haben." — Nav Toor

Claude Cowork ist kein einfacher Chatbot. Es ist ein Desktop-Tool, das direkt in deiner Arbeitsumgebung lebt, Dateien liest und schreibt, Dokumente erstellt und sich mit deinen täglichen Tools verbindet. Dieser Guide zeigt dir, wie du es in 30 Minuten perfekt einrichtest.

## Was ist Claude Cowork?

Im Gegensatz zur Browser-Version unter `claude.ai` lebt Cowork lokal auf deinem Desktop. Es hat Zugriff auf dein Dateisystem, kann Word-Dokumente erstellen, Excel-Tabellen mit Formeln bauen und spezialisierte Plugins für deine Rolle nutzen. 

Der größte Unterschied: Wenn Cowork nicht genug Informationen hat, rät es nicht einfach ("Halluzination"), sondern nutzt das **AskUserQuestion** Feature, um bei dir nachzufragen.

---

## Die 5 Kern-Features von Cowork

Nav Toor unterteilt Cowork in fünf wesentliche Säulen:

### 1. File System Access (Dateisystem-Zugriff)
Claude kann Dateien direkt in einem von dir gewählten Ordner lesen und schreiben. Kein lästiges Hoch- und Herunterladen mehr.

**Setup:**
1. Lade die Desktop-App unter `claude.com/download` herunter.
2. Wechsle im Tab oben auf **Cowork**.
3. Wähle einen lokalen Ordner aus. Alles in diesem Ordner ist nun für Claude während der Session verfügbar.

> **Pro-Tipp: Die Context-Files Strategie**
> Erstelle einen Ordner namens `Claude Context` mit drei Dateien:
> - `about-me.md`: Wer du bist und was du tust.
> - `brand-voice.md`: Wie du kommunizierst (Beispiele deiner besten Texte).
> - `working-style.md`: Wie Claude sich verhalten soll (z.B. "Immer erst Fragen stellen").

### 2. AskUserQuestion
Anstatt bei unklaren Aufgaben zu raten, stoppt Cowork und generiert ein Formular mit Fragen oder Optionen.

**Best Practice:**
Füge dies am Ende deiner Prompts hinzu:
`Fange NOCH NICHT mit der Arbeit an. Stelle mir zuerst klärende Fragen (nutze AskUserQuestion), damit wir den Ansatz gemeinsam definieren können. Beginne erst, wenn wir uns abgestimmt haben.`

### 3. Plugins
Plugins sind spezialisierte "Skill-Packs", die Claude zum Experten für bestimmte Rollen machen. 
Verfügbare Plugins (Stand Jan 2026):
- **Productivity**: Aufgabenmanagement & Kalender.
- **Marketing**: Content-Drafting & Brand Voice.
- **Sales**: Account-Recherche & Call-Prep.
- **Finance**: Finanzmodellierung.
- **Data Analysis**: SQL & Dashboards.
- **Legal**: Vertragsprüfung.

### 4. Instructions (Global & Folder)
Da Cowork kein Gedächtnis zwischen Sessions hat, sind **Instructions** essenziell. Es sind "Dauerbefehle", die bei jedem Start automatisch geladen werden.
- **Global Instructions**: Gelten immer (Name, Stil, Format-Präferenzen).
- **Folder Instructions**: Gelten nur für bestimmte Projekt-Ordner (ideal für Kundenprojekte).

### 5. Connectors
Live-Integrationen für Slack, Google Drive, Notion, Figma und über 50 weitere Tools. Claude kann damit Live-Daten referenzieren, ohne dass du Screenshots machen oder Texte kopieren musst.

---

## Wo Cowork (noch) schwächelt

Nav Toor bleibt ehrlich und nennt die aktuellen Grenzen:
- **Kein sessionübergreifendes Gedächtnis**: Jede Session startet bei Null (Workaround: Context-Files & Instructions).
- **App-Abhängigkeit**: Wenn du die App schließt, stoppt der Task (Lösung: Standby statt Schließen).
- **Hoher Ressourcenverbrauch**: Komplexe Cowork-Tasks verbrauchen mehr Kontingent als normaler Chat.
- **Nur Desktop**: Kein Mobile, keine Synchronisation zwischen Geräten.
- **Keine Bildgenerierung**: Für Bilder sind Tools wie Gemini Imagen weiterhin nötig.

---

## Dein 30-Minuten-Plan für den Start

1. **Minuten 0–5: Installation**
   Desktop App laden, Pro-Plan ($20/Monat) aktivieren, Cowork-Tab öffnen.
2. **Minuten 5–10: Context-Files erstellen**
   Erstelle `about-me.md`, `brand-voice.md` und `working-style.md` in einem lokalen Ordner.
3. **Minuten 10–15: Global Instructions setzen**
   Kopiere die wichtigsten Infos aus deinen Context-Files in die Settings > Cowork > Global Instructions.
4. **Minuten 15–20: Erster Task**
   Wähle deinen Context-Ordner und starte mit: `Lies alle Dateien in diesem Ordner. Hilf mir dann bei [Aufgabe]. Stelle mir zuerst klärende Fragen.`
5. **Minuten 20–25: Plugin installieren**
   Wähle ein Plugin passend zu deinem Job (z.B. Marketing) und teste die neuen `/`-Befehle.
6. **Minuten 25–30: Tool verbinden**
   Verbinde Slack oder Google Drive in den Connectors und lass Claude eine Zusammenfassung der letzten 7 Tage erstellen.

---

> "ChatGPT hat dich gelehrt, bessere Prompts zu schreiben. Cowork lehrt dich, besseren Kontext aufzubauen. Das eine ist ein Skill, der an Wert verliert – das andere ein System, das über Zeit immer wertvoller wird."

*Quelle: Basierend auf einem Thread von [Nav Toor](https://x.com/heynavtoor) auf X.*

![Cowork Overview](/images/knowledge/claude-cowork-setup-guide/cowork-overview.jpg)

## Verbindungen
- [[Claude Cowork]]
- [[File System Access]]
- [[AskUserQuestion]]
- [[Connectors]]
- [[Global Instructions]]
- [[Context-Files Strategie]]
- [[Plugins]]
- [[Context Engineering]]
- [[AI Productivity]]
- [[Autonomous Agents]]
