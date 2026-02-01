---
title: Datenbank-Patterns
description: Effiziente Datenmodellierung und Abfragen.
category: patterns
icon: Database
readTime: 15 Min
---

## Datenbank Best Practices

### Schema Design

- Normalisiere wo sinnvoll
- Denormalisiere für Leseleistung
- Nutze konsistente Namenskonventionen

### Queries optimieren

- Erstelle Indizes für häufige Abfragen
- Vermeide N+1 Query-Probleme
- Nutze Pagination für große Datensätze

### Supabase-spezifisch

- Nutze Row Level Security (RLS)
- Verwende Realtime für Live-Updates
- Implementiere Edge Functions für komplexe Logik
