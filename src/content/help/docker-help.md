---
title: 'Docker HELP.md'
domain: 'DevOps'
tags: ['Docker', 'Container', 'DevOps']
variables:
  - name: 'project_name'
    label: 'Projektname'
    default: 'my-app'
    placeholder: 'z.B. my-webapp'
  - name: 'port'
    label: 'Port'
    default: '3000'
    placeholder: 'z.B. 8080'
  - name: 'node_version'
    label: 'Node.js Version'
    default: '20'
    placeholder: 'z.B. 18, 20'
  - name: 'registry'
    label: 'Container Registry'
    default: 'ghcr.io'
    placeholder: 'z.B. docker.io'
notes: 'Passe die Werte an dein Projekt an. Für Produktions-Deployments empfehlen wir Multi-Stage Builds.'
updatedDate: '2024-12-15'
---

# Docker Setup für {{project_name}}

## Voraussetzungen

- Docker Desktop installiert
- Docker Compose (optional)

## Quick Start

```bash
# Image bauen
docker build -t {{project_name}} .

# Container starten
docker run -p {{port}}:{{port}} {{project_name}}
```

## Dockerfile

```dockerfile
FROM node:{{node_version}}-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE {{port}}

CMD ["npm", "start"]
```

## Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "{{port}}:{{port}}"
    environment:
      - NODE_ENV=production
```

## Registry Push

```bash
docker tag {{project_name}} {{registry}}/{{project_name}}:latest
docker push {{registry}}/{{project_name}}:latest
```

## Nützliche Befehle

| Befehl | Beschreibung |
|--------|--------------|
| `docker ps` | Laufende Container anzeigen |
| `docker logs {{project_name}}` | Logs anzeigen |
| `docker exec -it {{project_name}} sh` | Shell im Container öffnen |
| `docker system prune` | Ungenutzte Ressourcen aufräumen |
