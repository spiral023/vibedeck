---
title: 'Workflow Schema Erklaerung'
description: 'Erklaert Aufbau und Felder fuer Workflow Markdown Dateien.'
category: 'Learn'
tags: ['Schema', 'Workflow', 'Markdown']
steps:
  - order: 1
    title: 'Frontmatter'
    description: 'Welche Felder im YAML Frontmatter erwartet werden.'
  - order: 2
    title: 'Steps'
    description: 'Wie Schritte strukturiert sind und optional promptRef nutzen.'
  - order: 3
    title: 'Body'
    description: 'Wie der Markdown Body fuer Hinweise genutzt wird.'
changelog:
  - date: '2025-12-20'
    note: 'Initiale Version'
---

## Zweck

Diese Datei beschreibt das Schema fuer Workflow Markdown Dateien in
`src/content/workflows`. Jede Datei besteht aus YAML Frontmatter und einem
Markdown Body.

## Frontmatter Felder

- `title` (string, required): Anzeigename des Workflows.
- `description` (string, required): Kurzbeschreibung fuer Uebersichten.
- `category` (enum, required): `Build`, `Browse`, `Ship`, `Learn`.
- `tags` (string[], required): Tags fuer Filter und Suche.
- `steps` (array, required): Liste der Schritte.
  - `order` (number, required): Reihenfolge des Schritts.
  - `title` (string, required): Titel des Schritts.
  - `description` (string, required): Beschreibung des Schritts.
  - `promptRef` (string, optional): ID eines Prompts aus
    `src/content/prompts`.
- `changelog` (array, required): Historie der Aenderungen.
  - `date` (YYYY-MM-DD, required)
  - `note` (string, required)

Hinweis: Die `id` wird aus dem Dateinamen abgeleitet und im Loader gesetzt.
Du musst sie nicht im Frontmatter angeben.

## Body

Der Body ist normales Markdown fuer Erklaerungen, Tipps oder Beispiele.

## Beispiel (minimal)

```yaml
---
title: 'Beispiel Workflow'
description: 'Kurzbeschreibung.'
category: 'Build'
tags: ['Beispiel']
steps:
  - order: 1
    title: 'Start'
    description: 'Erster Schritt.'
changelog:
  - date: '2025-12-20'
    note: 'Initiale Version'
---
```
