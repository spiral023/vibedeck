import type { HelpTemplate } from '@/types/help';

export const helpTemplates: HelpTemplate[] = [
  {
    id: 'docker-help',
    title: 'Docker HELP.md',
    domain: 'DevOps',
    tags: ['Docker', 'Container', 'DevOps'],
    variables: [
      { name: 'project_name', label: 'Projektname', default: 'my-app', placeholder: 'z.B. my-webapp' },
      { name: 'port', label: 'Port', default: '3000', placeholder: 'z.B. 8080' },
      { name: 'node_version', label: 'Node.js Version', default: '20', placeholder: 'z.B. 18, 20' },
      { name: 'registry', label: 'Container Registry', default: 'ghcr.io', placeholder: 'z.B. docker.io' },
    ],
    template: `# Docker Setup für {{project_name}}

## Voraussetzungen

- Docker Desktop installiert
- Docker Compose (optional)

## Quick Start

\`\`\`bash
# Image bauen
docker build -t {{project_name}} .

# Container starten
docker run -p {{port}}:{{port}} {{project_name}}
\`\`\`

## Dockerfile

\`\`\`dockerfile
FROM node:{{node_version}}-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE {{port}}

CMD ["npm", "start"]
\`\`\`

## Docker Compose

\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "{{port}}:{{port}}"
    environment:
      - NODE_ENV=production
\`\`\`

## Registry Push

\`\`\`bash
docker tag {{project_name}} {{registry}}/{{project_name}}:latest
docker push {{registry}}/{{project_name}}:latest
\`\`\`

## Nützliche Befehle

| Befehl | Beschreibung |
|--------|--------------|
| \`docker ps\` | Laufende Container anzeigen |
| \`docker logs {{project_name}}\` | Logs anzeigen |
| \`docker exec -it {{project_name}} sh\` | Shell im Container öffnen |
| \`docker system prune\` | Ungenutzte Ressourcen aufräumen |
`,
    notes: 'Passe die Werte an dein Projekt an. Für Produktions-Deployments empfehlen wir Multi-Stage Builds.',
    updatedDate: '2024-12-15',
  },
  {
    id: 'git-help',
    title: 'Git HELP.md',
    domain: 'Versionierung',
    tags: ['Git', 'Version Control', 'Workflow'],
    variables: [
      { name: 'main_branch', label: 'Hauptbranch', default: 'main', placeholder: 'main oder master' },
      { name: 'feature_prefix', label: 'Feature Branch Prefix', default: 'feature/', placeholder: 'z.B. feat/' },
      { name: 'commit_style', label: 'Commit Style', default: 'Conventional Commits', placeholder: 'z.B. Angular' },
    ],
    template: `# Git Workflow Guide

## Branch-Strategie

- **{{main_branch}}**: Produktionscode, immer stabil
- **develop**: Integration von Features
- **{{feature_prefix}}***: Neue Features

## Neues Feature starten

\`\`\`bash
git checkout {{main_branch}}
git pull origin {{main_branch}}
git checkout -b {{feature_prefix}}mein-feature
\`\`\`

## Commit Convention ({{commit_style}})

\`\`\`
<type>(<scope>): <beschreibung>

[optionaler body]

[optionaler footer]
\`\`\`

### Types:
- **feat**: Neues Feature
- **fix**: Bugfix
- **docs**: Dokumentation
- **style**: Formatierung
- **refactor**: Code-Refactoring
- **test**: Tests hinzufügen/ändern
- **chore**: Wartungsarbeiten

## Feature mergen

\`\`\`bash
git checkout {{main_branch}}
git merge --no-ff {{feature_prefix}}mein-feature
git push origin {{main_branch}}
git branch -d {{feature_prefix}}mein-feature
\`\`\`

## Häufige Probleme

### Merge-Konflikte auflösen
\`\`\`bash
git status                    # Konflikte anzeigen
# Dateien manuell bearbeiten
git add <datei>
git commit
\`\`\`

### Letzten Commit korrigieren
\`\`\`bash
git commit --amend
\`\`\`

### Änderungen temporär speichern
\`\`\`bash
git stash
git stash pop
\`\`\`
`,
    notes: 'Diese Konventionen helfen bei der Zusammenarbeit im Team. Passe sie an eure Workflows an.',
    updatedDate: '2024-12-14',
  },
  {
    id: 'postgres-help',
    title: 'PostgreSQL HELP.md',
    domain: 'Datenbank',
    tags: ['PostgreSQL', 'Database', 'SQL'],
    variables: [
      { name: 'db_name', label: 'Datenbankname', default: 'myapp_db', placeholder: 'z.B. production_db' },
      { name: 'db_user', label: 'Benutzer', default: 'app_user', placeholder: 'z.B. admin' },
      { name: 'db_host', label: 'Host', default: 'localhost', placeholder: 'z.B. db.example.com' },
      { name: 'db_port', label: 'Port', default: '5432', placeholder: '5432' },
    ],
    template: `# PostgreSQL Referenz für {{db_name}}

## Verbindung

\`\`\`bash
psql -h {{db_host}} -p {{db_port}} -U {{db_user}} -d {{db_name}}
\`\`\`

## Connection String

\`\`\`
postgresql://{{db_user}}:PASSWORD@{{db_host}}:{{db_port}}/{{db_name}}
\`\`\`

## Häufige Befehle

### psql Konsole
| Befehl | Beschreibung |
|--------|--------------|
| \`\\l\` | Datenbanken auflisten |
| \`\\dt\` | Tabellen anzeigen |
| \`\\d table_name\` | Tabellenstruktur |
| \`\\q\` | Beenden |

### Datenbank-Operationen

\`\`\`sql
-- Datenbank erstellen
CREATE DATABASE {{db_name}};

-- Benutzer erstellen
CREATE USER {{db_user}} WITH PASSWORD 'sicheres_passwort';

-- Rechte vergeben
GRANT ALL PRIVILEGES ON DATABASE {{db_name}} TO {{db_user}};
\`\`\`

## Backup & Restore

\`\`\`bash
# Backup erstellen
pg_dump -h {{db_host}} -U {{db_user}} {{db_name}} > backup.sql

# Backup wiederherstellen
psql -h {{db_host}} -U {{db_user}} {{db_name}} < backup.sql
\`\`\`

## Performance

\`\`\`sql
-- Langsame Queries finden
SELECT query, mean_time, calls
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Index erstellen
CREATE INDEX idx_name ON table_name(column_name);

-- Query Plan analysieren
EXPLAIN ANALYZE SELECT * FROM table_name WHERE condition;
\`\`\`

## Nützliche Extensions

\`\`\`sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- UUIDs
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- Fuzzy Search
\`\`\`
`,
    notes: 'Ersetze PASSWORD durch ein sicheres Passwort. Speichere Credentials niemals im Code.',
    updatedDate: '2024-12-13',
  },
];

export function getHelpTemplateById(id: string): HelpTemplate | undefined {
  return helpTemplates.find(t => t.id === id);
}

export function getHelpTemplateIndex(): HelpTemplate[] {
  return [...helpTemplates].sort((a, b) => a.title.localeCompare(b.title));
}
