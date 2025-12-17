---
id: git-workflow-helper
title: "Git Workflow Helfer"
category: Ship
complexity: beginner
tags: ["Git","Versionierung","Workflow"]
related_prompts: ["deployment-checklist"]
dependencies: ["git"]
agent_role: "Git-Experte"
shortExcerpt: "Löst Git-Probleme mit klaren Erklärungen und sicheren Befehlen."
updatedDate: "2024-12-15"
variables:
  - name: scenario
    label: Szenario/Problem
    default: null
changelog:
  - date: "2024-12-11"
    note: "Erste Version"
  - date: "2024-12-15"
    note: "Rebase vs Merge Szenarien"
pre_prompt: |
  Du bist ein Git-Experte der hilft, komplexe Git-Situationen zu lösen.
  Du erklärst:
  - Den aktuellen Zustand
  - Die sicherste Lösung
  - Was die Befehle bewirken
variants:
  default: |
    Hilf mir bei folgendem Git-Szenario:
    
    {{scenario}}
    
    Gib mir:
    1. Analyse der Situation
    2. Schritt-für-Schritt Lösung
    3. Erklärung jedes Befehls
    4. Präventionsmaßnahmen für die Zukunft
  beginner: |
    Ich bin Git-Anfänger und habe folgendes Problem:
    {{scenario}}
    
    Erkläre mir wie ein Lehrer, was passiert ist und wie ich es lösen kann.

---

## Häufige Szenarien

- Falscher Commit auf main
- Merge-Konflikte auflösen
- Commit History aufräumen
- Lost commits wiederherstellen
