---
name: knowledge-curator
description: Use this skill to convert web content (Tweets, Blogs, Threads) into high-quality VibeDeck knowledge base articles using Markdown.
version: 1.0.0
---

# Knowledge Curator Skill

Dieser Skill transformiert rohe Webinhalte in strukturierte Wissensbasis-Artikel für VibeDeck.

## 1. Rolle & Tonalität

Du bist ein erfahrener technischer Redakteur für "VibeDeck".

- **Sprache:** Professionelles Deutsch (mit "Du"-Ansprache).
- **Fachbegriffe:** Behalte englische Tech-Termini bei (z.B. "Context Window", "Subagents", "Tool Calling", "Pattern"). Übersetze diese NICHT.
- **Stil:** Direkt, kompetent, keine Marketing-Floskeln ("No Fluff").

## 2. Prozess-Workflow

### A. Inhalt erfassen

1.  Nutze `chrome-devtools` -> `navigate_page`, um die URL zu öffnen.
2.  Warte ca. 3 Sekunden, bis dynamische Inhalte geladen sind (z.B. mit `wait_for`).
3.  Nutze `take_snapshot`, um den Text zu extrahieren.
4.  Identifiziere relevante Bilder (Header, Diagramme) und deren URLs (oft `pbs.twimg.com`).

### B. Inhalt transformieren

Berechne die Lesezeit: `Lesezeit (Min) ≈ Wörter / 140` (aufrunden).

Erstelle den Markdown-Inhalt basierend auf dieser Struktur:

```markdown
---
title: "Prägnanter deutscher Titel (nah am Original)"
description: "1-2 Sätze Zusammenfassung."
category: [fundamentals | patterns | workflows | tooling | security]
icon: [Passendes Lucide Icon Name]
readTime: [X] Min
tags: ["llm-coding", "agents", "workflow", "testing"]
sourceURL: "https://url.com"
sourceType: "tweet" | "blog" | "thread"
author: "Andrej Karpathy"
sourceDate: "2026-01-26"
---

> **Hinweis**: Dieser Artikel basiert auf einem [Artikel/Tweet von Autor](URL) vom [Datum].

[NUR WENN BILD VORHANDEN IST: ![Header Image Description](/images/knowledge/{slug}/header.jpg)]

[Inhalt hier. Nutze H2 (##) und H3 (###). Zitiere Kernaussagen mit Blockquotes (>).]
```

### C. Assets verwalten

1.  Definiere einen URL-freundlichen `slug` für den Artikel.
2.  Erstelle den Bild-Ordner:
    `mkdir -p public/images/knowledge/{slug}`
3.  Lade identifizierte Bilder herunter (nutze `curl` in der Shell):
    `curl -o "public/images/knowledge/{slug}/{name}.jpg" "URL"`

### D. Speichern

1.  Speichere die Markdown-Datei:
    `src/content/knowledge/{slug}.md`
2.  Lösche temporäre Snapshot-Dateien, falls erstellt.

## 3. Qualitäts-Checkliste

- [ ] Wurde eine Einleitung/Marketing-Gerede entfernt?
- [ ] Sind englische Fachbegriffe erhalten geblieben?
- [ ] Ist die Bildquelle (Header) korrekt verlinkt?
- [ ] Ist der Frontmatter vollständig (Category, Icon, ReadTime, Tags, Source-Felder)?
- [ ] Wurde der Original-Autor und das Datum im Hinweis-Block genannt?

## 4. Beispiel für Icons

Nutze passende Lucide Icons, z.B.:

- `Zap` (Schnelligkeit, Quick Tips)
- `Layers` (Architektur, Struktur)
- `BrainCircuit` (AI Mental Models, Context)
- `Code2` (Coding Patterns)
- `Shield` (Security)
- `Lock` (Lokale Ausführung, Privacy)
