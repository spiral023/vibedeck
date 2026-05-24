---
title: "73 % Overhead in Claude Code: 9 Patterns, die Tokens verbrennen"
description: "Ein Source Note zu neun unsichtbaren Overhead-Mustern in Claude Code, die laut Mnimiy 73 % des Token-Budgets auffressen, plus konkrete Fixes für CLAUDE.md, Hooks, Skills, MCP, Cache und Session-Design."
type: source
status: seed
category: tooling
icon: Layers
readTime: 12
tags:
  - tooling/claude-code
  - tooling/token-efficiency
  - patterns/context-engineering
  - configuration/hooks
  - configuration/mcp
aliases:
  - "I tracked 430 hours of Claude Code usage. 73% was wasted on these 9 patterns."
  - "Claude Code Overhead Audit"
topics:
  - "[[Claude Code]]"
  - "[[Token Overhead]]"
  - "[[CLAUDE.md]]"
  - "[[Prompt Caching]]"
  - "[[Hooks]]"
  - "[[MCP]]"
  - "[[Context Engineering]]"
up: "[[Claude Code]]"
sourceURL: "https://x.com/Mnilax/status/2050261839653556522"
sourceType: tweet
author: "Mnimiy (@Mnilax)"
sourceDate: "2026-05-01"
addedDate: "2026-05-25"
level: advanced
---

![Claude Code Overhead Header](/images/knowledge/claude-code-overhead-9-patterns/header.jpg)

Dieser Artikel ist kein allgemeiner Productivity-Post, sondern eine ziemlich konkrete Betriebsanalyse von Claude Code. Mnimiy beschreibt einen 90-Tage-Audit mit HTTP-Proxy vor der Anthropic-API: 430 Stunden Nutzung, 6 Millionen Input-Tokens und 1.340 Dollar API-Kosten.

Die zentrale Frage lautet nicht "Wie schreibe ich bessere Prompts?", sondern: **Wie viel meines Budgets geht überhaupt in echte Arbeit und wie viel in Overhead?**

Die Antwort des Audits ist hart:

> Nur 27 % der Tokens waren produktiv. 73 % gingen in neun unsichtbare Patterns.

Das Interessante daran: Die teuersten Fehler lagen laut Autor nicht bei der Modellwahl, sondern bei **Kontext-Bloat, Session-Architektur, Hook-Injection und immer mitgeladenem Tooling**.

## Was im Audit als Overhead gezaehlt wurde

Mnimiy zerlegt jede Anfrage in mehrere Kostenbloecke:

- produktive Tokens
- Cache-Hits und Cache-Misses
- erneutes Einlesen von Conversation History
- Hook-Injection
- Skill-Loading
- Tool-Definitionen und Result-Blocks
- Extended Thinking
- `CLAUDE.md`

Damit verschiebt sich der Blick von Prompt-Qualität zu **Systemkosten pro Turn**. Genau dieses mentale Modell ist der eigentliche Wert des Posts.

## 1. Zu grosse `CLAUDE.md` erzeugt permanente Grundsteuer

Das erste Pattern ist die klassische schleichende Überkonfiguration: eine `CLAUDE.md`, die über Monate wächst, bis sie bei jedem Turn mehrere tausend Tokens kostet.

Der Autor nennt als Beispiel eine Datei mit 4.800 Tokens, die bei jeder Session und jedem Turn wieder in den Kontext geladen wurde.

Der vorgeschlagene Audit:

```bash
# Find what's in your CLAUDE.md
wc -w ~/.claude/CLAUDE.md
wc -w .claude/CLAUDE.md  # project-level

# Target: combined under 1,200 words (~1,500 tokens)
```

Die eigentliche Empfehlung ist aber strukturell:

- globale Regeln nur für globale Invarianten
- projektspezifische Regeln nach `.claude/CLAUDE.md`
- wiederkehrende Spezialfälle in Skills auslagern
- verbose Begründungen in knappe Imperative umschreiben

> Eine aufgeblasene `CLAUDE.md` ist kein Wissensspeicher, sondern ein Baseline-Kostenblock.

## 2. Lange Chats machen jeden weiteren Turn teurer

Das zweite Pattern ist Conversation History Re-Read. Jeder Follow-up-Turn bezahlt das erneute Tokenisieren früherer Nachrichten.

Die Folge: Nachricht 30 ist nicht einfach "eine weitere Nachricht", sondern finanziert im Extremfall die komplette Historie 1 bis 29 erneut.

Der Fix ist simpel und gut:

1. frühere Nachricht editieren statt stumpf nachzuschieben
2. Konversationen bei etwa 20 Nachrichten hart kappen
3. ` /compact ` statt ` /clear ` nutzen, wenn Kontinuität erhalten bleiben soll

Das ist ein gutes Beispiel für ein Pattern, das man im Alltag kaum merkt, das auf API-Ebene aber brutal teuer werden kann.

## 3. `UserPromptSubmit`-Hooks können Prompt-Wände erzeugen

Ein besonders guter Befund im Post: Mehrere Plugins hatten `UserPromptSubmit`-Hooks registriert und vor jeden Prompt zusätzlichen Kontext gehängt. Einzeln klein, zusammen mehrere tausend Tokens pro Eingabe.

Audit:

```bash
# See what's being injected
cat ~/.claude/settings.json | jq '.hooks.UserPromptSubmit'
cat .claude/settings.json | jq '.hooks.UserPromptSubmit'

# Disable any hook you can't justify with a specific task
/plugin disable <plugin-name>
```

Der wichtige Gedanke dabei: Hooks sind nicht neutral. Sie sind **immer wiederkehrender Kontext**, und damit wiederkehrende Kosten.

## 4. Prompt Cache mit kurzer Lebensdauer erzeugt teure Resume-Misses

Laut Quelle hat Anthropic standardmäßig nur eine kurze Cache-Lebensdauer. Sobald Du nach einer Pause zurückkommst, wird System Prompt, `CLAUDE.md` und Tool Schema wieder voll bepreist statt als günstiger Cache-Read.

Die vorgeschlagenen Fixes:

- vor einer kurzen Pause einen kleinen Ping senden, um den Cache warm zu halten
- bei passenden Plänen eine längere Cache-Lebensdauer nutzen

Das ist weniger ein "Hack" als ein Hinweis, dass **Arbeitsrhythmus und Cache-Politik** direkt in die Kostenstruktur eingreifen.

## 5. Zu viele Skills laden "just in case"

Der Post kritisiert nicht Skills an sich, sondern schlecht kuratierte Skill-Sets. Wenn zu viele Skills installiert sind, wird bei unklarer Relevanz konservativ geladen.

Das führt zu Overhead, obwohl die eigentliche Aufgabe vielleicht gar keinen dieser Skills braucht.

Audit-Vorschlag:

```bash
# Which skills were actually invoked in your sessions
grep -h "skill_invoked" ~/.claude/logs/*.log | sort | uniq -c | sort -rn

# Anything not in the output -> /plugin disable <skill-name>
```

Die Quintessenz ist klar: Skills sind gut, aber nur dann, wenn sie **selektiv** geladen werden und zur täglichen Arbeit passen.

## 6. Zu viele MCP-Server blasen jede Anfrage auf

Das gleiche Muster gilt für MCP. Jeder verbundene Server bringt Tool-Schemas mit, unabhängig davon, ob Du ihn in diesem Task brauchst.

Der vorgeschlagene Minimal-Audit:

```bash
/mcp                    # list connected servers
/mcp disable <server>   # disable for current session
```

Strategisch ist das einer der besten Punkte im Artikel: MCP-Server sollten wie Produktions-Dependencies behandelt werden, nicht wie eine dauerhafte Werkzeughalde.

## 7. Extended Thinking darf kein globaler Default sein

Mnimiy argumentiert, dass Extended Thinking für Architekturfragen, komplexes Debugging und mehrstufige Entscheidungen echten Wert hat, für triviale Aufgaben aber nur Overhead produziert.

Die Regel ist deshalb bewusst einfach:

- standardmäßig aus
- pro Nachricht gezielt einschalten
- erst dann aktivieren, wenn ein einfacher Versuch nicht reicht

Das ist kein Anti-Reasoning-Argument. Es ist ein Argument für **Reasoning nur dort, wo es Rendite liefert**.

## 8. Schlechte Antworten zu lange auslaufen lassen kostet Output-Tokens

Ein kleiner, aber praktischer Punkt: Wenn nach wenigen Zeilen klar ist, dass Claude in die falsche Richtung läuft, solltest Du die Generierung sofort abbrechen.

Der Post beschreibt das als vermeidbare "Stupid Tax": Du zahlst für hunderte Output-Tokens, obwohl die Antwort schon früh erkennbar falsch ist.

Das zugehörige Pattern ist weniger technisch, mehr operativ:

- Drift früh erkennen
- Generation sofort stoppen
- auf dem schon erzeugten Zustand neu steuern

## 9. SessionStart- und Plugin-Noise summiert sich

Das letzte Pattern betrifft `SessionStart`-Hooks und kleine Plugin-Meldungen, die für sich harmlos wirken, aber bei jeder Session wieder auftauchen.

Audit:

```bash
# Audit SessionStart hooks
cat ~/.claude/settings.json | jq '.hooks.SessionStart'

# Anything that's just a "loaded" notification -> kill
```

Gerade diese Sorte Overhead ist gefährlich, weil sie selten sichtbar, aber extrem persistent ist.

## Was der Autor explizit nicht als Haupthebel sieht

Der Artikel grenzt sich bewusst von einigen Standard-Ratschlaegen ab:

1. Einfach auf ein billigeres Modell wechseln hilft nur begrenzt.
2. Aggressiv ` /clear ` nach jeder Aufgabe zu nutzen ist oft kontraproduktiv.
3. Alle Skills pauschal abzuschalten führt leicht dazu, dass dieselben Instruktionen manuell in Prompts wandern.
4. Off-Peak-Nutzung ist real, aber laut Autor meist ein kleinerer Hebel als Kontext-Overhead.

Das ist ein wichtiger Punkt. Die größte Einsparung entsteht hier nicht durch Modell-Switching, sondern durch **schlankere Sessions**.

## Das Audit-Script als woechentlicher Wartungscheck

Der Post endet nicht nur mit Prinzipien, sondern mit einem kleinen Audit-Script, das die neun Muster an einer Stelle sichtbar machen soll:

```bash
#!/bin/bash
# claude-audit.sh — run in your project root

echo "=== CLAUDE.md size ==="
wc -w ~/.claude/CLAUDE.md 2>/dev/null
wc -w .claude/CLAUDE.md 2>/dev/null
echo "Target: combined < 1,200 words"

echo
echo "=== Active hooks ==="
cat ~/.claude/settings.json 2>/dev/null | jq '.hooks // {} | keys'
cat .claude/settings.json 2>/dev/null | jq '.hooks // {} | keys'

echo
echo "=== UserPromptSubmit injections ==="
cat ~/.claude/settings.json 2>/dev/null | jq '.hooks.UserPromptSubmit'
cat .claude/settings.json 2>/dev/null | jq '.hooks.UserPromptSubmit'

echo
echo "=== Installed plugins ==="
ls ~/.claude/plugins/ 2>/dev/null
echo "Target: 3-5 active. Disable the rest."

echo
echo "=== Installed skills ==="
ls ~/.claude/skills/ 2>/dev/null
echo "Target: 3-5 active matching daily work."

echo
echo "=== Connected MCPs ==="
cat ~/.claude/settings.json 2>/dev/null | jq '.mcpServers // {} | keys'
echo "Target: 3 always-on. Per-session enable rest."
```

Das Spannende daran ist weniger das Skript selbst als der Prozess dahinter: Claude Code wird wie ein System behandelt, das regelmäßig beobachtet, entrümpelt und neu kalibriert werden muss.

## Der eigentliche Mental Model Shift

Die stärkste Aussage des Artikels ist diese:

> Produktive Tokens sind nicht der Standardzustand, sondern der Restbetrag nach allen Basiskosten.

Daraus folgen drei brauchbare Prinzipien:

1. Prompt-Optimierung ist nachgelagert, wenn der System-Overhead bereits zu groß ist.
2. Session-Design, Cache-Verhalten, Hooks, Skills und MCP bestimmen die reale Wirtschaftlichkeit.
3. "Claude wurde dummer" ist oft ein Diagnosefehler für gewachsenen Kontext-Ballast.

Wenn Du Claude Code wirklich effizient nutzen willst, dann ist dieser Post ein guter Reminder, die Kosten nicht nur auf Modell-Ebene, sondern auf **Architektur-Ebene** zu denken.

## Verbindungen
- [[Claude Code]]
- [[Token Overhead]]
- [[CLAUDE.md]]
- [[Prompt Caching]]
- [[Hooks]]
- [[MCP]]
- [[Skills]]
- [[Conversation Compaction]]
- [[Context Engineering]]
- [[Tool Schema Overhead]]
