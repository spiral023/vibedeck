---
title: API-Sicherheit Best Practices
description: Sichere deine APIs vor häufigen Angriffsvektoren.
category: security
icon: Lock
readTime: 1 Min
tags: ["security", "best-practices", "tooling"]
level: intermediate
---

## API Sicherheit

### Authentifizierung

- Verwende JWT oder Session-basierte Auth
- Implementiere Token-Refresh-Mechanismen
- Speichere Secrets niemals im Frontend

### Input Validierung

- Validiere alle Eingaben serverseitig
- Nutze Zod oder ähnliche Bibliotheken
- Sanitize User-Input gegen XSS

### Rate Limiting

- Implementiere Request-Limits pro User/IP
- Nutze exponential backoff bei Fehlern
- Logge verdächtige Aktivitäten

### CORS

- Konfiguriere strenge CORS-Policies
- Erlaube nur notwendige Origins
- Vermeide Wildcards in Produktion
