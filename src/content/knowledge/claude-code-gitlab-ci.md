---
title: Claude Code in GitLab CI/CD
description: >-
  Integriere Claude Code in deine GitLab CI/CD Pipelines für automatisierte MRs,
  Code-Reviews und Bugfixes.
category: tools
icon: Gitlab
readTime: 4 Min
tags: ["claude-code", "ci-cd", "tooling", "docs"]
sourceURL: "https://code.claude.com/docs/en/gitlab-ci-cd"
sourceType: "docs"
author: "Anthropic Docs"
level: advanced
addedDate: "2026-02-01"
---

Claude Code kann direkt in GitLab CI/CD integriert werden, um Aufgaben in isolierten Jobs auszuführen und Ergebnisse als Merge Requests (MRs) zurückzuspielen. Dies ermöglicht Workflows wie "Erstelle MR aus Issue" oder "Fixe diesen Bug".

## Warum Claude Code mit GitLab?

*   **Sofortige MRs:** Beschreibe Änderungen, Claude erstellt den MR.
*   **Projekt-Aware:** Berücksichtigt `CLAUDE.md` und bestehende Patterns.
*   **Sicher:** Läuft in deinen Runnern, nutzt deine Branch-Protection-Regeln.
*   **Enterprise-Ready:** Unterstützt Claude API, AWS Bedrock und Google Vertex AI.

## Funktionsweise

1.  **Event-Driven:** GitLab hört auf Trigger (z.B. Kommentar mit `@claude`).
2.  **Provider-Abstraktion:** Nutzt Claude API (SaaS), AWS Bedrock oder Google Vertex AI.
3.  **Sandboxed Execution:** Jeder Job läuft isoliert. Änderungen fließen durch MRs für Reviews.

## Setup (Quick Start)

Am einfachsten startest du mit der Claude API und einem maskierten Variable.

1.  **Variable hinzufügen:** Füge `ANTHROPIC_API_KEY` als maskierte Variable in **Settings > CI/CD** hinzu.
2.  **Job in `.gitlab-ci.yml` hinzufügen:**

```yaml
stages:
  - ai

claude:
  stage: ai
  image: node:24-alpine3.21
  rules:
    - if: '$CI_PIPELINE_SOURCE == "web"'
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
  variables:
    GIT_STRATEGY: fetch
  before_script:
    - apk update && apk add --no-cache git curl bash
    - curl -fsSL https://claude.ai/install.sh | bash
  script:
    - /bin/gitlab-mcp-server || true
    - echo "$AI_FLOW_INPUT for $AI_FLOW_CONTEXT"
    - >
      claude
      -p "${AI_FLOW_INPUT:-'Review this MR and implement requested changes'}"
      --permission-mode acceptEdits
      --allowedTools "Bash Read Edit Write mcp__gitlab"
      --debug
```

## Use Cases

### Issue zu MR
In einem Issue-Kommentar:
```
@claude implementiere dieses Feature basierend auf der Beschreibung
```
Claude analysiert das Issue, schreibt Code in einem Branch und öffnet einen MR.

### Implementierungshilfe
In einer MR-Diskussion:
```
@claude schlage einen konkreten Ansatz für das Caching dieses API-Calls vor
```
Claude schlägt Änderungen vor und aktualisiert den MR.

### Bugfix
```
@claude fixe den TypeError im User Dashboard
```
Claude lokalisiert den Bug und implementiert den Fix.

## Enterprise: AWS Bedrock & Google Vertex AI

Für Enterprise-Umgebungen kannst du Claude Code auf deiner eigenen Cloud-Infrastruktur laufen lassen (ohne statische Keys im Repo).

### AWS Bedrock (OIDC)
Erfordert AWS OIDC Provider für GitLab und eine IAM Rolle.

```yaml
claude-bedrock:
  # ... (Image & Rules wie oben)
  before_script:
    - apk add --no-cache bash curl jq git python3 py3-pip awscli
    - curl -fsSL https://claude.ai/install.sh | bash
    # OIDC Token Exchange Logik hier (siehe Docs)
  script:
    - >
      claude
      -p "${AI_FLOW_INPUT:-'Implement changes'}"
      --permission-mode acceptEdits
      --debug
  variables:
    AWS_REGION: "us-west-2"
    # AWS_ROLE_TO_ASSUME via CI/CD Settings
```

### Google Vertex AI (Workload Identity)
Erfordert GCP Workload Identity Federation.

```yaml
claude-vertex:
  image: gcr.io/google.com/cloudsdktool/google-cloud-cli:slim
  # ...
  before_script:
    - apt-get update && apt-get install -y git
    - curl -fsSL https://claude.ai/install.sh | bash
    # WIF Authentifizierung hier (siehe Docs)
  script:
    - >
      claude
      -p "${AI_FLOW_INPUT:-'Review code'}"
      --permission-mode acceptEdits
      --debug
```

## Best Practices

*   **CLAUDE.md:** Definiere Coding-Standards im Root des Repos.
*   **Security:** Niemals API Keys committen! Nutze CI/CD Variablen oder OIDC.
*   **Performance:** Halte `CLAUDE.md` prägnant und cache NPM-Pakete.
*   **Kosten:** Beachte Runner-Minuten und API-Token-Kosten.

## Troubleshooting

*   **Keine Reaktion:** Prüfe Pipeline-Trigger und ob `@claude` (nicht `/claude`) verwendet wurde.
*   **Keine MRs:** Prüfe `CI_JOB_TOKEN` Berechtigungen oder nutze einen Project Access Token.
*   **Auth Fehler:** Prüfe API Key oder OIDC Konfiguration.
