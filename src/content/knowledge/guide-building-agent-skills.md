---
title: "Der komplette Guide zum Erstellen von Agent Skills"
description: "Ein technischer Deep-Dive in den neuen Skills-Standard: Von der Architektur der progressiven Offenlegung bis hin zu komplexen Orchestrierungs-Patterns."
category: tooling
icon: Layers
readTime: 15 Min
tags: ["agent-skills", "claude-code", "mcp", "automation", "development", "architecture"]
sourceURL: "https://x.com/rohit4verse/status/2021622526112358663"
sourceType: "thread"
author: "Rohit"
sourceDate: "2026-02-11"
level: advanced
---

![Building Agent Skills Header](/images/knowledge/guide-building-agent-skills/header.jpg)

Die Ära, in der wir KI als generischen Chatbot behandeln, ist offiziell vorbei. Während 99% der Nutzer noch einfache Prompts schreiben, baut das restliche 1% **Skills**. Dies ist der Unterschied zwischen einem Spielzeug und einem spezialisierten 24/7-Mitarbeiter.

Dieser Guide bietet eine vollständige technische Analyse des neuen Skills-Standards, der im Oktober 2025 von Anthropic eingeführt wurde und sich mittlerweile zu einem offenen Industriestandard entwickelt hat.

## Die Anatomie eines Agent Skills

Ein Skill ist nicht einfach nur ein langer Prompt. Er ist eine dynamische, organisierte Einheit, die es Agenten ermöglicht, Kontext genau dann zu laden, wenn er benötigt wird (Context on Demand).

### Die Datei-Struktur
Ein Skill folgt einem klaren Verzeichnis-Schema:

```text
your-skill-name/
├── SKILL.md       # Erforderlich: Haupt-Datei (Instruktionen & Metadaten)
├── scripts/       # Optional: Ausführbare Logik (Python, Bash, JS)
│   ├── process_data.py
│   └── validate.sh
├── references/    # Optional: Dokumentation & Hintergrundwissen
│   ├── api-guide.md
│   └── examples/
└── assets/        # Optional: Templates, Fonts, Icons
    └── report-template.md
```

Das Herzstück ist die `SKILL.md`. Sie enthält YAML-Frontmatter für die Registrierung des Skills und Markdown-Content für die prozessualen Anweisungen.

## Wie Skills technisch funktionieren

Das Problem bei traditionellen Prompts ist das "Context Bloating" – der Kontext-Speicher füllt sich mit unnötigen Informationen. Skills lösen dies durch eine **dreistufige progressive Offenlegung (Progressive Disclosure)**:

1. **Level 1 - YAML Frontmatter (Immer im Kontext):** Name und Beschreibung des Skills sind permanent im System-Prompt von Claude präsent. Dies verbraucht minimal Token, liefert aber genug Information für die Entscheidung: *"Brauche ich diesen Skill jetzt?"*
2. **Level 2 - SKILL.md Body (On-Demand geladen):** Sobald Claude entscheidet, dass ein Skill relevant ist, wird der gesamte Markdown-Inhalt (Instruktionen, Beispiele) in die laufende Session geladen.
3. **Level 3 - Linked Resources (Gezielter Zugriff):** Zusätzliche Skripte in `scripts/` oder Referenz-Docs in `references/` werden nur dann abgerufen, wenn der Agent sie explizit zur Ausführung einer Teilaufgabe benötigt.

### Das Zwei-Nachrichten-Muster
Ein genialer Aspekt des UX-Designs von Skills ist die Trennung der Kommunikation:
- **User-visible Messages (isMeta: false):** Nachrichten, die im Chatverlauf für den Nutzer erscheinen (Transparenz).
- **Meta Messages (isMeta: true):** Technische Instruktionen und Skill-Inhalte, die an die API gesendet, aber dem Nutzer nicht angezeigt werden, um das Interface nicht zu überladen.

## Schritt-für-Schritt: Deinen ersten Skill bauen

### 1. Anwendungsfall (Use Case) identifizieren
Fokussiere dich auf Szenarien, in denen du Claude immer wieder das Gleiche erklärst.
- **Dokument- & Asset-Erstellung:** Z.B. ein `frontend-design` Skill, der sicherstellt, dass Code nicht wie "AI-Slop" aussieht, sondern modernen Design-Prinzipien folgt.
- **Workflow-Automatisierung:** Mehrstufige Prozesse wie der `skill-creator`, der dich durch den Bau neuer Skills führt.
- **MCP-Erweiterung:** Füge Logik über reine API-Aufrufe (Model Context Protocol) hinzu. Beispiel: Ein Code-Review-Skill, der Sentry-Fehlerdaten analysiert und direkt PRs in GitHub fixiert.

### 2. Erfolgskriterien definieren
Setze messbare Ziele für deinen Skill:
- **Triggering Accuracy:** Wird der Skill bei >90% der relevanten Anfragen geladen?
- **Tool Efficiency:** Werden Aufgaben in weniger Tool-Calls erledigt als ohne Skill?
- **Consistency:** Liefert der Skill über verschiedene Sessions hinweg ähnliche Qualitäts-Ergebnisse?

### 3. Effektive Beschreibungen (YAML) schreiben
Die `description` im Frontmatter ist der "Trigger". Sie muss präzise sein.
- **Struktur:** [Was der Skill tut] + [Wann er zu nutzen ist] + [Kernfähigkeiten].
- **Gutes Beispiel:** `description: Analysiert Figma-Dateien und generiert Developer-Handoff-Dokumentation. Nutze dies, wenn der User .fig Dateien hochlädt oder nach 'Design Specs' fragt.`

### 4. Instruktionen strukturieren
Der Body der `SKILL.md` sollte klare Sektionen haben:
- `## Instructions`: Schritt-für-Schritt Anleitung.
- `## Examples`: Konkrete Szenarien ("User sagt X -> Agent tut Y").
- `## Troubleshooting`: Lösungen für bekannte Probleme.

## Das SKILLS.sh CLI

Vercel hat mit **skills.sh** das "npm für AI-Agenten" geschaffen. Es ermöglicht die einfache Installation und Verwaltung von Skills über 35+ verschiedene Plattformen (Claude Code, Cursor, Windsurf, etc.).

```bash
# Installation eines Skills von GitHub
npx skills add vercel-labs/agent-skills

# Installation eines spezifischen Skills aus einem Repository
npx skills add vercel-labs/agent-skills@vercel-react-best-practices

# Installierte Skills auflisten
npx skills list
```

## Advanced Patterns & Best Practices

### Pattern 1: Kontextsensitive Tool-Wahl
Ein intelligenter Skill entscheidet basierend auf der Dateigröße oder dem Typ, welches Tool er nutzt:
- > 10MB? Nutze Cloud Storage MCP.
- Code-Änderung? Nutze GitHub MCP.
- Temporär? Lokales Dateisystem.

### Pattern 2: Domain-spezifische Intelligenz
Skills können Expertenwissen einbetten, das über das Training von Claude hinausgeht. Ein `compliance` Skill könnte beispielsweise vor jeder Transaktion automatisch Sanktionslisten prüfen und Risiko-Assessments durchführen.

### Pattern 3: Iterative Verfeinerung
Für qualitätskritische Aufgaben (z.B. Code-Review):
1. Erster Entwurf generieren.
2. Validierungs-Skripte (aus dem `scripts/` Ordner des Skills) ausführen.
3. Fehler identifizieren und den Entwurf automatisch nachbessern, bis die Qualitätsschwelle erreicht ist.

## Sicherheit und Vertrauen

Skills sind mächtig, da sie Code ausführen können. Beachte:
- **Trust Model:** Nutze primär eigene Skills oder solche von verifizierten Partnern.
- **Restricted Capabilities:** Nutze das Feld `allowed-tools` im Frontmatter, um den Zugriff eines Skills einzuschränken:
  `allowed-tools: "Bash(python:*) Bash(npm:*) WebFetch"`

## Fazit

Agent Skills transformieren KI von einer netten Spielerei zu einem strategischen Asset. Die Fähigkeit, organisatorisches Wissen in prozessuale Skills zu gießen, wird in Zukunft der entscheidende Produktivitätsvorteil für Entwickler und Unternehmen sein. 

**Empfehlung:** Starte klein. Nutze den `skill-creator` Skill in Claude, um innerhalb von 15 Minuten dein erstes eigenes Playbook zu erstellen. Die Zeitersparnis durch die Eliminierung repetitiver Erklärungen wird sich sofort bemerkbar machen.
