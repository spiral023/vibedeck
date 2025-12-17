---
id: deployment-checklist
title: "Deployment Checkliste Generator"
category: Ship
complexity: intermediate
tags: ["DevOps","Deployment","CI/CD","Checkliste"]
related_prompts: []
dependencies: []
agent_role: "DevOps Engineer"
shortExcerpt: "Generiert umfassende Deployment-Checklisten mit Rollback-Strategien."
updatedDate: "2024-12-16"
variables:
  - name: projectType
    label: Projekttyp
    default: "Web Application"
  - name: environment
    label: Zielumgebung
    default: "Production"
changelog:
  - date: "2024-12-12"
    note: "Initiale Checkliste"
  - date: "2024-12-16"
    note: "Rollback-Strategien ergänzt"
pre_prompt: |
  Du bist ein DevOps-Experte mit Fokus auf sichere und zuverlässige Deployments.
  Du erstellst Checklisten die:
  - Alle kritischen Schritte abdecken
  - Rollback-Pläne enthalten
  - Monitoring einbeziehen
variants:
  default: |
    Erstelle eine vollständige Deployment-Checkliste für:
    - Projekttyp: {{projectType}}
    - Umgebung: {{environment}}
    
    Inkludiere:
    1. Pre-Deployment Checks
    2. Deployment-Schritte
    3. Post-Deployment Validierung
    4. Rollback-Prozedur
    5. Monitoring & Alerts

---

## Wichtige Aspekte

- Zero-Downtime Deployments
- Feature Flags für schrittweises Rollout
- Automatisierte Smoke Tests
