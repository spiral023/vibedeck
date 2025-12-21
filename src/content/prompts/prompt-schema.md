---
id: prompt-schema
title: "Prompt Schema Erklaerung"
category: Learn
complexity: beginner
tags: ["Schema","Prompts","Markdown","Frontmatter"]
related_prompts: ["deployment-checklist"]
dependencies: []
agent_role: "Prompt Librarian"
shortExcerpt: "Erklaert Aufbau, Felder und Regeln fuer Prompt-Dateien."
updatedDate: "2025-12-20"
variables: []
changelog:
  - date: "2025-12-20"
    note: "Initiale Version"
pre_prompt: |
  Du erklaerst das Schema fuer Prompt-Dateien im Projekt.
  Die Erklaerung ist knapp, klar und nutzt Beispiele.
variants:
  default: |
    Erklaere das Prompt-Schema inklusive Frontmatter, Variablen und Varianten.

---

## Zweck

Diese Datei beschreibt das Schema fuer Prompt-Dateien in `src/content/prompts`.
Jede Prompt-Datei besteht aus einem YAML-Frontmatter und einem Markdown-Body.

## Frontmatter Felder

- `id` (string, required): Eindeutige ID, sollte dem Dateinamen entsprechen.
- `title` (string, required): Anzeigename des Prompts.
- `category` (enum, required): `Build`, `Browse`, `Ship`, `Learn`.
- `complexity` (enum, required): `beginner`, `intermediate`, `expert`.
- `tags` (string[], required): Tags fuer Filter und Suche.
- `related_prompts` (string[], required): IDs verwandter Prompts.
- `dependencies` (string[], required): Tools/Stacks, z.B. `react`, `zod`.
- `agent_role` (string, optional): Persona fuer den Prompt.
- `shortExcerpt` (string, required): Kurzbeschreibung fuer Karten.
- `updatedDate` (YYYY-MM-DD, required): Letztes Update.
- `variables` (array, required): Liste von Variablen.
  - `name` (string, required): Variablenname fuer `{{name}}` im Prompt.
  - `label` (string, required): Label fuer das Formular.
  - `default` (string, optional): Default-Wert.
- `global_variable_refs` (string[], optional): Referenzen auf globale Variablen.
- `changelog` (array, required): Historie der Aenderungen.
  - `date` (YYYY-MM-DD, required)
  - `note` (string, required)
- `pre_prompt` (string, required): Kontext fuer die Rolle/Regeln.
- `variants` (object, required): Textvarianten des Prompts.
  - `default` (string, required)
  - `beginner` (string, optional)
  - `expert` (string, optional)

## Body

Der Body ist normales Markdown und dient als zusaetzliche Hinweise, Beispiele oder
Erlaeuterungen zum Prompt.

## Beispiel (minimal)

```yaml
---
id: beispiel-prompt
title: "Beispiel"
category: Build
complexity: beginner
tags: ["Beispiel"]
related_prompts: []
dependencies: []
shortExcerpt: "Kurzbeschreibung."
updatedDate: "2025-12-20"
variables: []
changelog:
  - date: "2025-12-20"
    note: "Initiale Version"
pre_prompt: |
  Du bist ein hilfreicher Assistent.
variants:
  default: |
    Erstelle eine kurze Antwort.
---
```
