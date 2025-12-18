---
title: 'PostgreSQL HELP.md'
domain: 'Datenbank'
tags: ['PostgreSQL', 'Database', 'SQL']
variables:
  - name: 'db_name'
    label: 'Datenbankname'
    default: 'myapp_db'
    placeholder: 'z.B. production_db'
  - name: 'db_user'
    label: 'Benutzer'
    default: 'app_user'
    placeholder: 'z.B. admin'
  - name: 'db_host'
    label: 'Host'
    default: 'localhost'
    placeholder: 'z.B. db.example.com'
  - name: 'db_port'
    label: 'Port'
    default: '5432'
    placeholder: '5432'
notes: 'Ersetze PASSWORD durch ein sicheres Passwort. Speichere Credentials niemals im Code.'
updatedDate: '2024-12-13'
---

# PostgreSQL Referenz für {{db_name}}

## Verbindung

```bash
psql -h {{db_host}} -p {{db_port}} -U {{db_user}} -d {{db_name}}
```

## Connection String

```
postgresql://{{db_user}}:PASSWORD@{{db_host}}:{{db_port}}/{{db_name}}
```

## Häufige Befehle

### psql Konsole
| Befehl | Beschreibung |
|--------|--------------|
| `\l` | Datenbanken auflisten |
| `\dt` | Tabellen anzeigen |
| `\d table_name` | Tabellenstruktur |
| `\q` | Beenden |

### Datenbank-Operationen

```sql
-- Datenbank erstellen
CREATE DATABASE {{db_name}};

-- Benutzer erstellen
CREATE USER {{db_user}} WITH PASSWORD 'sicheres_passwort';

-- Rechte vergeben
GRANT ALL PRIVILEGES ON DATABASE {{db_name}} TO {{db_user}};
```

## Backup & Restore

```bash
# Backup erstellen
pg_dump -h {{db_host}} -U {{db_user}} {{db_name}} > backup.sql

# Backup wiederherstellen
psql -h {{db_host}} -U {{db_user}} {{db_name}} < backup.sql
```

## Performance

```sql
-- Langsame Queries finden
SELECT query, mean_time, calls
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Index erstellen
CREATE INDEX idx_name ON table_name(column_name);

-- Query Plan analysieren
EXPLAIN ANALYZE SELECT * FROM table_name WHERE condition;
```

## Nützliche Extensions

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- UUIDs
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- Fuzzy Search
```
