---
title: 'Help Schema Erklärung'
domain: 'Dokumentation'
tags: ['Schema', 'Help', 'Markdown']
variables: []
notes: 'Diese Datei erklärt den Aufbau von Help Markdown Dateien.'
updatedDate: '2025-12-20'
---

# Help Markdown Schema

Diese Datei beschreibt das Schema für Help Markdown Dateien in
`src/content/help`. Jede Datei besteht aus YAML Frontmatter und einem Markdown
Body. Der Body ist das eigentliche Template.

## Frontmatter Felder

- `title` (string, required): Anzeigename des Templates.
- `domain` (string, required): Themenbereich, z.B. `DevOps`.
- `tags` (string[], required): Tags für Filter und Suche.
- `variables` (array, required): Liste der Variablen fuer Platzhalter.
  - `name` (string, required): Variablenname fuer `{{name}}` im Template.
  - `label` (string, required): Label fuer Formulare.
  - `default` (string, optional): Default-Wert.
  - `placeholder` (string, optional): Beispielwert.
- `notes` (string, required): Hinweise zur Nutzung.
- `updatedDate` (YYYY-MM-DD, required): Letztes Update.

Hinweis: Die `id` wird aus dem Dateinamen abgeleitet und muss nicht im
Frontmatter stehen. Der Markdown Body wird als `template` genutzt.

## Beispiel (minimal)

```yaml
---
title: 'Beispiel Help'
domain: 'Beispiele'
tags: ['Beispiel']
variables:
  - name: 'tool'
    label: 'Tool'
    default: 'git'
    placeholder: 'z.B. git'
notes: 'Passe die Werte an.'
updatedDate: '2025-12-20'
---

# Hilfe für {{tool}}

Kurze Anleitung...
```
