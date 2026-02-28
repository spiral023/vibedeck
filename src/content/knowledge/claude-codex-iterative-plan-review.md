---
title: "Claude vs. Codex: Iterative Plan-Reviews für fehlerfreien Code"
description: "Wie du Claude Code und OpenAI Codex in einer iterativen Review-Schleife gegeneinander antreten lässt, um produktionsreife Specs zu erhalten."
type: source
status: seed
category: workflows
icon: Code2
readTime: 12
tags:
  - tooling/claude-code
  - tooling/codex
  - agent-skills
  - code-review
  - ai-workflow
aliases:
  - "Claude Codex Review Loop"
  - "Iterative Plan Review Guide"
topics:
  - "[[Cross-Model Review]]"
  - "[[Iterative Review Loop]]"
  - "[[Verdict Protocol]]"
  - "[[Codex CLI]]"
up: "[[AI Workflows]]"
sourceURL: "https://aseemshrey.in/blog/claude-codex-iterative-plan-review/"
sourceType: "blog"
author: "Aseem Shrey"
sourceDate: "2026-02-20"
addedDate: "2026-02-25"
---

Ich nutze Claude Code täglich. Es plant Features, schreibt Code und erstellt PRs. Aber ich stieß immer wieder auf das gleiche Problem: **Claudes Pläne waren gut, wurden aber nie herausgefordert.** Es fehlte eine zweite Meinung, die architektonische blinde Flecken, fehlende Edge Cases oder Sicherheitslücken aufdeckt.

Also habe ich ein System gebaut, in dem **Codex die Pläne von Claude überprüft** – in einer iterativen Schleife, bis Codex sein "Approved" gibt.

## Das Problem: "Single-Model Blindness"

Wenn du nur ein einziges KI-Modell für Planung und Ausführung nutzt, erhältst du zwar konsistente, aber oft unangefochtene Ergebnisse. Das Modell argumentiert nicht mit sich selbst. Es wird nicht sagen: "Eigentlich ist dieses Auth-Modell unvollständig" oder "Deine Shell-Quotes sind hier fehlerhaft".

Häufige Muster, die mir auffielen:
- Pläne ohne klares Authentifizierungsmodell.
- Shell-Scripte mit Quoting-Fehlern (z.B. `$1` in Single Quotes).
- Schema-Designs mit widersprüchlichen Zustandsfeldern.
- Fehlendes Concurrency-Handling in Multi-Agenten-Szenarien.

Das sind keine Fehler, die Claude nicht finden *könnte* – aber Planer und Reviewer sind dieselbe Instanz. Es fehlt die "gegnerische Spannung".

## Die Lösung: `/codex-review`

Ich habe einen **Claude Code Skill** gebaut – einen Slash-Befehl, der eine iterative Review-Schleife zwischen Claude und dem OpenAI Codex CLI auslöst.

### So funktioniert es:
1. **Start**: Du tippst `/codex-review`.
2. **Runde 1**: Claude schreibt den Plan in eine temporäre Datei -> sendet diese an Codex (gpt-5.3-codex, read-only Sandbox) -> Codex prüft -> **VERDICT: REVISE** (z.B. 8 Probleme gefunden).
3. **Runde 2**: Claude überarbeitet den Plan basierend auf dem Feedback -> nimmt die Codex-Session wieder auf (Kontext bleibt erhalten) -> Codex prüft erneut -> **VERDICT: REVISE** (z.B. 6 Restpunkte).
4. **Runde 3**: Claude überarbeitet erneut -> Codex prüft -> **VERDICT: APPROVED**.

**Der entscheidende Vorteil:** Codex läuft im Read-only Modus. Er kann die Codebase lesen, aber nichts verändern. Und da wir die Codex-Session zwischen den Runden fortsetzen, "erinnert" er sich an seine vorherigen Aussagen und prüft gezielt, ob die Fehler behoben wurden.

---

## Vorher vs. Nachher: Ein Praxisbeispiel

Ich bat Claude, ein "Mission Control" Dashboard für einen Multi-Agenten-Swarm zu planen.

**Vorher (Single-pass planning):**
- Keine Auth für Agent-Endpoints.
- Kaputte Shell-Scripts (`"$1"` innerhalb von `' '`).
- Redundante Felder im Schema (`status` und `column`), die auseinanderlaufen könnten.
- Kein Concurrency-Handling beim "Claimen" von Tasks.

**Nachher (Iterative cross-model review):**
- API-Key Auth pro Agent mit serverseitiger Identitätsableitung.
- Ein typisiertes CLI-Tool statt fragiler Shell-Scripts.
- Atomare Lease-Claims mit optimistischer Parallelitätssteuerung.
- Explizite ACL-Berechtigungsmatrix.
- Integration- und Security-Tests inklusive.

**Ergebnis:** 3 automatisierte Runden, 14 gefundene und behobene Probleme. Der Plan wurde von "Demo-Qualität" zu einer "Production-grade Spec" – ohne manuellen Review-Aufwand meinerseits.

---

## Design-Entscheidungen

### Warum ein Skill und kein Hook?
Ich möchte nicht, dass *jeder* Plan überprüft wird. Kleine Änderungen brauchen keine zweite Meinung. Ein Skill (Slash-Command) ist **on-demand** – ich aktiviere ihn nur, wenn viel auf dem Spiel steht.

### Warum iterativ und nicht "One-shot"?
Ein One-shot Review findet Probleme, verifiziert aber nicht die Korrektur. Die Schleife stellt sicher, dass Claude nicht "eine Sache repariert und dabei zwei andere kaputt macht".

### Das VERDICT-Protokoll
Die Schleife braucht ein Stopp-Signal. Codex beendet jeden Review mit entweder `VERDICT: APPROVED` oder `VERDICT: REVISE`. Das gibt Claude ein klares Signal. Als Sicherheit ist das Ganze auf maximal 5 Runden begrenzt.

## Technische Implementierung

Das gesamte System ist eine einzige Markdown-Datei unter `.claude/skills/codex-review/SKILL.md`. Es nutzt Claude Codes Fähigkeit, Tools auszuführen, und Codex CLIs Session-Management (`codex exec resume <session-id>`).

### Setup-Schritte:
1. **Codex CLI installieren**: `npm install -g @openai/codex`
2. **Skill-Datei ablegen**: Lade die `SKILL.md` aus diesem [GitHub Gist](https://gist.github.com/LuD1161/84102959a9375961ad9252e4d16ed592) herunter und lege sie in `.claude/skills/codex-review/` ab.
3. **Ausführen**: Nutze `/codex-review` in Claude Code, sobald dein Plan bereit ist.

## Fazit: Kontext ist alles
Die Qualität dessen, was du mit Agenten baust, hängt direkt von der Qualität des Kontextes ab, den du ihnen gibst. Der `/codex-review` Skill ist ein einfacher Weg, um architektonische Tiefe und Sicherheit in deine KI-Workflows zu bringen.

*Quelle: Basierend auf einem Blogartikel von [Aseem Shrey](https://aseemshrey.in/blog/claude-codex-iterative-plan-review/).*

---
*P.S. – Ja, dieser Blogpost wurde auch mit Unterstützung von KI geschrieben. Wir lassen KIs darüber schreiben, wie KIs miteinander streiten. Wir sind offiziell hinter den Spiegeln gelandet.*

## Verbindungen
- [[Cross-Model Review]]
- [[Iterative Review Loop]]
- [[Verdict Protocol]]
- [[Codex CLI]]
- [[Claude Code]]
- [[OpenAI Codex]]
- [[Spec-First Development]]
- [[Code Review]]
- [[Architecture]]
- [[Agentic Workflow]]
