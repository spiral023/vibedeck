---
title: 'Docker HowTo fuer das Dev-Setup'
domain: 'DevOps'
tags: ['Docker', 'Compose', 'Development']
variables:
  - name: 'compose_file'
    label: 'Docker Compose Datei'
    default: 'docker-compose.dev.yml'
    placeholder: 'z.B. docker-compose.dev.yml'
  - name: 'service_name'
    label: 'Service Name'
    default: 'backend'
    placeholder: 'z.B. backend'
  - name: 'container_name'
    label: 'Container Name'
    default: 'eventhorizon-backend-1'
    placeholder: 'z.B. myapp-backend-1'
  - name: 'working_dir'
    label: 'Working Directory'
    default: '/app'
    placeholder: 'z.B. /app'
notes: 'Sammlung haeufig genutzter Docker-Befehle fuer lokales Development. Passe Variablen an dein Projekt an.'
updatedDate: '2025-12-20'
---

# Docker-HowTo fuer das Dev-Setup

Kurze Sammlung der wichtigsten Docker- und Compose-Befehle fuer das lokale
Backend-Development mit `{{compose_file}}`.

---

## Voraussetzungen

- Docker und Docker Compose sind installiert.
- `{{compose_file}}` liegt im Projekt-Root.
- Backend-Service in Compose heisst `{{service_name}}`.
- Optionaler Container-Name direkt ueber Docker: `{{container_name}}`.

---

## 1. Container- und Service-Uebersicht

### Laufende Container

```bash
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Image}}\t{{.Ports}}'
```

### Services im Dev-Compose

```bash
docker compose -f {{compose_file}} ps
```

---

## 2. Starten, Stoppen, Neustarten

### Backend starten bzw. neu bauen

```bash
docker compose -f {{compose_file}} up -d {{service_name}}
```

```bash
docker compose -f {{compose_file}} up -d --build {{service_name}}
```

### Backend neu starten, stoppen, entfernen

```bash
docker compose -f {{compose_file}} restart {{service_name}}
```

```bash
docker compose -f {{compose_file}} stop {{service_name}}
```

```bash
docker compose -f {{compose_file}} rm -f {{service_name}}
```

### Kompletten Dev-Stack stoppen und entfernen

```bash
docker compose -f {{compose_file}} down
```

---

## 3. Logs, Shell und Debugging

### Logs des Backend-Services (ueber Compose)

```bash
docker compose -f {{compose_file}} logs -f {{service_name}}
```

```bash
docker compose -f {{compose_file}} logs -f --tail=100 {{service_name}}
```

### Shell im Backend-Container

```bash
docker compose -f {{compose_file}} exec {{service_name}} sh
```

> `exec` nutzt den laufenden Container. Fuer einmalige Tasks kannst du auch
> `run --rm` einsetzen.

### Direkt ueber Docker (ohne Compose)

```bash
docker logs -f {{container_name}}
```

```bash
docker exec {{container_name}} sh -c "cd {{working_dir}} && python -m pip install -r requirements.txt"
```

---

## 4. Debugging und Inspektion

### Env, Files und Prozesse

```bash
docker compose -f {{compose_file}} exec {{service_name}} env
```

```bash
docker compose -f {{compose_file}} exec {{service_name}} sh -c "ls -lah"
```

```bash
docker top {{container_name}}
```

### Netzwerk und IP

```bash
docker inspect {{container_name}} | jq '.[0].NetworkSettings.IPAddress'
```

```bash
docker network ls
```

```bash
docker inspect <network-name>
```

### Image-Infos und Compose-Config

```bash
docker inspect {{container_name}} | grep -i '"Image"' -n
```

```bash
docker compose -f {{compose_file}} config
```

---

## 5. Typische Dev-Tasks im Backend-Container

### Python-Dependencies installieren

```bash
docker compose -f {{compose_file}} exec {{service_name}} sh -c "cd {{working_dir}} && python -m pip install -r requirements.txt"
```

```bash
docker compose -f {{compose_file}} run --rm {{service_name}} sh -c "cd {{working_dir}} && python -m pip install -r requirements.txt"
```

### Einzelnes Paket im Backend Container

```bash
docker compose -f {{compose_file}} exec {{service_name}} pip install unidecode
```

### Tests und Infos

```bash
docker compose -f {{compose_file}} exec {{service_name}} python -m pytest
```

```bash
docker compose -f {{compose_file}} exec {{service_name}} sh -c "python -m pip list"
```

```bash
docker compose -f {{compose_file}} exec {{service_name}} sh -c "cat /etc/os-release"
```

---

## 6. Images, Volumes und Cleanup

### Images und Volumes anzeigen

```bash
docker images --format 'table {{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.Size}}'
```

```bash
docker volume ls
```

```bash
docker volume inspect <volume-name>
```

### Aufraeumen und Platzverbrauch

```bash
docker system df
```

```bash
docker rmi $(docker images -f "dangling=true" -q)
```

```bash
docker system prune -f
```

---

## 7. Kleine Quality-of-Life-Helfer

```bash
docker stats
```

```bash
docker compose -f {{compose_file}} config
```

---

## 8. Datenbank-Migration erstellen - DEV

```bash
docker compose -f {{compose_file}} exec {{service_name}} alembic revision --autogenerate -m "description"
```

## 9. Datenbank-Migration erstellen - PROD

Wenn ihr eine separate Compose-Datei fuer Prod habt, ersetze `{{compose_file}}`
entsprechend.

```bash
docker compose -f {{compose_file}} exec {{service_name}} alembic revision --autogenerate -m "description"
```

## 10. Datenbank-Migration im Docker Backend Container anwenden

```bash
docker compose -f {{compose_file}} exec {{service_name}} alembic upgrade head
```
