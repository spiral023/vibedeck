---
title: 'Bug beheben'
description: 'Systematischer Workflow zur Identifikation und Behebung von Bugs.'
category: 'Ship'
tags: ['Debugging', 'Bugfix', 'Qualität']
steps:
  - order: 1
    title: 'Bug reproduzieren'
    description: 'Stelle sicher, dass der Bug konsistent reproduzierbar ist.'
  - order: 2
    title: 'Ursache analysieren'
    promptRef: 'code-reviewer'
    description: 'Analysiere den Code, um die Ursache zu finden.'
  - order: 3
    title: 'Fix implementieren'
    description: 'Implementiere die Lösung mit minimalen Änderungen.'
  - order: 4
    title: 'Testen'
    description: 'Teste den Fix gründlich inkl. Regression.'
  - order: 5
    title: 'Git Workflow'
    promptRef: 'git-workflow-helper'
    description: 'Committe und pushe die Änderungen korrekt.'
changelog:
  - date: '2024-12-12'
    note: 'Workflow erstellt'
updatedDate: '2024-12-12'
---

## Bug-Fix Best Practices

- Schreibe erst einen fehlschlagenden Test
- Fixe nur den Bug, keine anderen Änderungen
- Dokumentiere die Ursache
