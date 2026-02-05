---
title: The Complete Claude Code Tutorial
description: >-
  Ein umfassender Leitfaden von Eyad Khrais zur effektiven Nutzung von Claude
  Code für robuste Systeme: Planning, Architecture, CLAUDE.md und mehr.
category: fundamentals
icon: Code2
readTime: 8 Min
tags: ["claude-code", "workflows", "best-practices", "tooling"]
sourceURL: 'https://x.com/eyad_khrais/status/2010076957938188661'
sourceType: tweet
author: Eyad Khrais
sourceDate: '2026-01-10'
---

![The Complete Claude Code Tutorial](/images/knowledge/claude-code-tutorial/header.jpg)

Ich bin seit 7 Jahren Software Engineer (Amazon, Disney, Capital One). Der Code, den ich ausgeliefert habe, erreicht Millionen von Nutzern. Jetzt bin ich CTO eines Startups, das Agenten für Unternehmen baut, und **Claude Code** ist mein tägliches Werkzeug.

Hier ist ein Playbook für Anfänger mit allem, was ich über Claude gelernt habe, um robuste Systeme zu bauen.

## 1. Erst denken, dann tippen (Think First)

Der größte Fehler: Sofort loslegen und tippen (oder sprechen). Das Erste, was du tun musst, ist **nachdenken**.

Der **Plan Mode** liefert 10 von 10 Mal signifikant bessere Ergebnisse als einfach alles in Claude hineinzuwerfen.

**Mein Rat:**
1.  **Lerne Architektur:** Wenn du keine Erfahrung hast, fang an zu lernen.
2.  **Deep Dive Dialog:** Habe einen tiefen Austausch mit dem LLM. Beschreibe genau, was du bauen willst, frage nach Design-Optionen und einigt euch auf eine Lösung. Es muss ein Dialog sein, keine Einbahnstraße.

Das gilt für alles: Vom Zusammenfassen von E-Mails bis zum Refactoring. Je mehr Information du im Plan Mode hast, desto besser ist der Output, weil der Input besser ist.

> **Muster:** Erst denken, dann tippen = Dramatisch bessere Ergebnisse.

## 2. Architektur ist entscheidend

Architektur ist wie einem Menschen das Ziel zu geben, aber nicht den Weg. Das lässt zu viel Spielraum für Fehler.

**Schlecht:**
> "Build me an auth system"

**Gut:**
> "Build email/password authentication using the existing User model, store sessions in Redis with 24-hour expiry, and add middleware that protects all routes under /api/protected."

Drücke `Shift + Tab` zweimal für den **Plan Mode**. Es kostet dich 5 Minuten, spart dir aber Stunden beim Debuggen.

## 3. Die Macht der CLAUDE.md

`CLAUDE.md` ist eine Markdown-Datei, die Claude extrem gut verarbeiten kann. Sie ist das **Onboarding-Material**, das Claude vor jeder einzelnen Konversation liest.

Viele ignorieren sie oder füllen sie mit Müll.

**Was wirklich zählt:**
*   **Kurz halten:** Claude kann nur ca. 150-200 Anweisungen zuverlässig befolgen (das System nutzt schon 50). Wenn deine `CLAUDE.md` ein Roman ist, wird Claude Dinge zufällig ignorieren.
*   **Projektspezifisch:** Erkläre nicht, was ein Components-Folder ist. Erkläre die "weird stuff", wie spezifische Bash-Commands.
*   **Das "Warum" erklären:** "Use TypeScript strict mode" ist okay. "Use TypeScript strict mode because we've had production bugs from implicit any types" ist besser. Das gibt Claude Kontext für Entscheidungen.
*   **Ständig aktualisieren:** Drücke `#`, während du arbeitest, und Claude fügt Anweisungen automatisch hinzu. Wenn du Claude zweimal korrigieren musst, gehört es in die Datei.

> Eine schlechte `CLAUDE.md` sieht aus wie Doku für einen neuen Mitarbeiter. Eine gute sieht aus wie Notizen an dich selbst, wenn du morgen Amnesie hättest.

## 4. Limitationen des Context Window

Auch bei 200k Token: Das Modell degradiert lange bevor du 100% erreichst. Ab ca. **20-40% Context Usage** beginnt die Qualität zu bröckeln.

**Lösungen:**
*   **Scope deine Konversationen:** Eine Konversation pro Feature. Vermische nicht Auth-System und Datenbank-Refactoring.
*   **Externer Speicher:** Lass Claude Pläne in Dateien schreiben (z.B. `SCRATCHPAD.md` oder `plan.md`). Diese überdauern Sessions.
*   **Copy-Paste Reset:** Wenn der Kontext aufgebläht ist: Wichtiges kopieren, `/compact` nutzen, `/clear` ausführen und nur das Wichtige wieder einfügen.
*   **Wisse, wann du clearen musst:** Wenn eine Konversation entgleist, ist `/clear` besser als weiterzukämpfen. Claude hat immer noch deine `CLAUDE.md`.

> **Mental Model:** Claude ist zustandslos (stateless). Jede Konversation startet bei Null, außer dem, was du explizit gibst.

## 5. Prompts sind alles

Prompting ist keine mystische Kunst, sondern fundamentale Kommunikation.

**Was hilft:**
*   **Sei spezifisch:** Gib ein klares Ziel vor (siehe Architektur-Beispiel).
*   **Sag, was es NICHT tun soll:** Claude 4.5 neigt zum Overengineering. Sag: "Keep this simple. Don't add abstractions I didn't ask for."
*   **Gib Kontext zum "Warum":** "Das muss schnell sein" vs. "Das ist ein Wegwerf-Prototyp" ändert alles.

## 6. Bad Input == Bad Output

Wenn du schlechte Ergebnisse mit einem guten Modell (wie Opus 4.5) bekommst, ist dein Input schuld.

Der Fix ist nicht ein besseres Modell, sondern:
*   Bessere Prompts (Spezifisch > Vag)
*   Bessere Requests (Zerlege komplexe Aufgaben)
*   Besserer Kontext

**Modell-Unterschiede:**
*   **Sonnet:** Schnell, günstig. Gut für Ausführung (Boilerplate, Refactoring nach Plan).
*   **Opus:** Langsam, teuer. Gut für komplexes Reasoning und Planung.

> **Workflow:** Nutze Opus für Planung/Architektur, dann Sonnet für die Implementierung.

## 7. MCP, Tools und Konfigurationen

Claude hat viele Features: MCP Server, Hooks, Custom Slash Commands. Du musst nicht alle nutzen, aber du solltest experimentieren.

*   **MCP (Model Context Protocol):** Verbindet Claude mit externen Diensten (GitHub, Datenbanken). Wenn du oft Dinge kopierst, gibt es wahrscheinlich einen MCP Server dafür.
*   **Hooks:** Führe Code automatisch aus. Prettier nach jedem Edit? Type-Check? Hooks fangen Probleme sofort ab.
*   **Custom Slash Commands:** Verpacke wiederkehrende Prompts in Commands (`.claude/commands`). Gut für Debugging, Reviews, Deployments.

## 8. Wenn Claude stecken bleibt

Manchmal loopet Claude. Es versucht das Gleiche, scheitert, wiederholt es.

**Was tun?**
*   **Start simple:** `/clear` für einen Neustart.
*   **Vereinfache den Task:** Zerlege ihn in kleinere Teile.
*   **Show instead of tell:** Schreibe ein minimales Beispiel selbst und sag "Wende dieses Muster an".
*   **Be Creative:** Reframe das Problem. "Implementiere als State Machine" statt "Handle diese Transitions".

## 9. Baue Systeme (Build Systems)

Profis nutzen Claude nicht für One-Off Tasks, sondern bauen Systeme. Claude Code hat einen `-p` Flag für **Headless Mode**.

Das bedeutet:
*   Du kannst es scripten.
*   Output in andere Tools pipen.
*   In automatisierte Workflows integrieren (Auto PR Reviews, Support Tickets).

**Das Flywheel:** Claude macht Fehler -> Du prüfst Logs -> Du verbesserst `CLAUDE.md` oder Tooling -> Claude wird besser.

> Wenn du Claude nur interaktiv nutzt, lässt du Potenzial liegen.

---

**TL;DR:**
1.  **Denken vor Tippen:** Planung ist alles.
2.  **CLAUDE.md ist dein Hebel:** Kurz, spezifisch, mit "Warum".
3.  **Kontext degradiert:** Nutze externen Speicher und `/clear`.
4.  **Architektur zuerst:** Ohne Struktur ist der Output schlecht.
5.  **Output kommt von Input:** Verbessere deine Kommunikation.
6.  **Experimentiere:** Nutze MCP, Hooks, Slash Commands.
7.  **Baue Systeme:** Nutze Headless Mode und Automation.
