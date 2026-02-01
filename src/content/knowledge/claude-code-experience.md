---
title: "Der ultimative Guide zu Claude Code 2.0 & Opus 4.5"
description: "Ein umfassender Deep Dive von Sankalp über Claude Code 2.0: Von der 'Anthropic Redemption Arc' über versteckte Features bis hin zu fortgeschrittenem Context Engineering."
category: advanced
icon: Bot
readTime: 30 Min
---

> Ursprünglich veröffentlicht auf [Sankalp's Blog](https://sankalp.bearblog.dev/my-experience-with-claude-code-20-and-how-to-get-better-at-using-coding-agents/).

![Dario Amodei](/images/knowledge/claude-code-experience/dario.webp)

Dieser Artikel ist ein Nachfolger zu meinen Erfahrungen mit Claude Code aus dem Juli 2025. Da viele neue Nutzer – sowohl technische als auch "technically-lite" Menschen – Claude Code (CC) ausprobieren, ist es Zeit für einen Deep Dive. Wie Karpathy sagte: "Es ist ein kleiner Geist, der auf deinem Computer lebt."

## Warum dieser Post?

Ich habe großartiges Feedback zu meinen Opus 4.5 Tweets und meinem letzten Blogpost erhalten. Es gibt eine klare Nachfrage nach tiefgehenden Ressourcen.

Wenn du auch nur 3-4 Ideen hieraus mitnimmst, die dir helfen, Claude Code (oder andere Tools wie Codex/Gemini CLI/OpenCode) besser zu nutzen oder LLMs besser zu verstehen, ist das ein Gewinn.

## Die Karte ist nicht das Territorium

Ich will hier keine starre Anleitung ("Karte") geben, sondern zeigen, was möglich ist ("Territorium").

Claude Code hat dieses Jahr die CLI-Coding-Product-Experience dominiert. Tools wie Codex, OpenCode, Amp CLI und Cursor haben sich stark davon inspirieren lassen. **Das bedeutet: Wenn du lernst, wie Dinge in Claude Code funktionieren, überträgt sich dieses Wissen direkt auf andere Tools.**

### Wie man mithält (ohne verrückt zu werden)

Karpathy hat Twitter neulich mit einem Post über das "Mithalten" gesprengt. Es ist ein verständlicher Crashout – die Technologie entwickelt sich rasant.

Statt Panik zu schieben ("keeping up"), sollten wir uns darauf konzentrieren, uns selbst zu verbessern ("augment").

1.  **Bleib bei den Tools am Ball:** Nutze sie regelmäßig. Ich mache das ständig; es kann anstrengend sein, aber es hilft mir im Job. Für "technically-lite" Leute reichen wöchentliche Updates.
2.  **Upskilling in deiner Domain:** Je mehr du weißt, desto besser kannst du prompten ("unknown unknowns" zu "known unknowns" machen). Erfahrung baut Urteilsvermögen (Taste) auf – das unterscheidet professionelle Devs von Vibe-Codern. Da die Implementierung schneller geht, kannst du mehr Zeit in das Refinement stecken.
3.  **Spiele mehr:** Probier neue Modelle aus. Sei nicht geizig. Frag Dinge, von denen du denkst, dass das Modell sie nicht kann. Du wirst überrascht sein.

## Lore Time: Meine Hass-Liebe zu Anthropic

### Die Timeline
2025 war wild. OpenAI hat mit GPT-5-Codex stark aufgeholt. Ich hatte mein Claude-Abo im September gekündigt, weil Sonnet 4.5 für mich zu viel "Slop" (minderwertigen Code) produzierte und GPT-5-Codex stabiler war.

### Die "Redemption Arc" & Opus 4.5
Ende Oktober kam Anthropic mit einem Angebot zurück, und im November erschien **Opus 4.5**. Das war der Wendepunkt. Ich habe es 5 Tage lang getestet und war bekehrt.

![2025 AI Timeline](/images/knowledge/claude-code-experience/timeline-2025.webp)

**Warum Opus 4.5 sich so gut anfühlt:**
*   **Schneller:** Es erledigt Aufgaben in weniger Zeit als Codex.
*   **Besserer Kommunikator:** Es ignoriert seltener Instruktionen und versteht die Intention besser.
*   **Visceral Progress:** Durch die Geschwindigkeit fühlen sich Feedback-Loops direkter an.
*   **UI/UX:** Claude Codes Interface (fetterer Text, besserer Kontrast) ist angenehmer als Codex.
*   **Soul:** Opus 4.5 hat eine Persönlichkeit, die viele Nutzer lieben. Amanda Askell (Anthropic) bestätigte, dass sie Claude auf speziellen Dokumenten trainiert haben, um ihm mehr "Seele" zu geben.

> **Wichtig:** Dieser Post ist nicht gesponsert. Ich habe Anthropic oft genug kritisiert. Aber Claude Code ist eine der angenehmsten Produkterfahrungen, die ich je hatte.

## Pointers für die "Technically-Lite" Fraktion

Bevor wir tief eintauchen, ein paar Konzepte:

*   **Kontext & Context Window:** Der Input für das LLM. Das "Arbeitsgedächtnis". Opus 4.5 hat 200k Token (ca. 150.000 Wörter). Alles – Code, Chatverlauf, Tool-Outputs – muss hier reinpassen.
*   **Tool Calling:** LLMs können nicht direkt surfen oder Dateien bearbeiten. Wir definieren "Tools" (Funktionen), und das Modell entscheidet, wann es welches Tool aufruft.
*   **Agent:** Ein LLM, das proaktiv Tools in einer Schleife nutzen kann, um ein Ziel zu erreichen. (Definition nach Anthropic).
*   **Agentic:** Bezieht sich auf die Fähigkeit, Tools proaktiv und korrekt zu nutzen.
*   **Harness (Gerüst):** Das Software-Gerüst um das Modell herum (Prompts, Tool-Definitionen, Umgebung), das es dem Modell ermöglicht, autonom zu agieren. Claude Code ist das Produkt, aber es *hat* einen sehr ausgefeilten Harness.

![Agent Loop](/images/knowledge/claude-code-experience/agent-loop.webp)

## Die Evolution: Claude Code 2.0 Features

Claude Code hat viele "Quality of Life" Verbesserungen erhalten. Hier sind die Features, die den Unterschied machen:

1.  **Syntax Highlighting (2.0.71):** Endlich lesbare Diffs im Terminal. Ich verbringe 80% meiner Zeit im CLI, das ist ein Segen.
2.  **Tips:** Kleine Hinweise während Claude denkt (manchmal nützlich).
3.  **Feedback UI:** Schnell und unaufdringlich (1, 2, 3 drücken).
4.  **Ask Mode Options:** Option 3 "Sag Claude, was es anders machen soll" ist mächtig.
5.  **Ultrathink:** Für harte Aufgaben, wenn Opus 4.5 rigoroser sein soll (Self-Review, tiefe Erklärungen).
6.  **Thinking Toggle:** Tab (oder Alt+Tab) zum Umschalten (Buggy auf Mac).
7.  **`/context`:** Zeigt die aktuelle Token-Nutzung an. Ich mache oft einen Handoff oder Compact bei 60%.
8.  **`/usage` & `/stats`:** Detaillierte Nutzungsstatistiken.
9.  **Checkpointing (`Esc + Esc` oder `/rewind`):** Ein Gamechanger. Spring zurück zu einem Punkt, bevor alles schiefging. Es setzt Code *und* Konversation zurück.
10. **Prompt Suggestions (2.0.73):** Vorschläge für den nächsten Prompt. Ziemlich gute Vorhersagen.
11. **History Search (`Ctrl + R`):** Durchsuche deine Prompt-Historie projektübergreifend.
12. **Cursor Cycling:** Mit Pfeiltasten schnell an Anfang/Ende des Prompts springen.
13. **Message Queue Navigation:** Durch gequeuedte Nachrichten blättern.
14. **Fuzzy File Search (2.0.72):** 3x schnellere Dateivorschläge.
15. **LSP Support:** Language Server Protocol Support via Plugins für bessere Code-Intelligenz.

![Syntax Highlighting](/images/knowledge/claude-code-experience/syntax-highlighting.webp)

![Context Usage](/images/knowledge/claude-code-experience/context-usage.webp)

## Feature Deep Dive: Commands & Sub-Agents

### Commands
Mit `/` rufst du Slash-Commands auf. Du kannst eigene erstellen (`.claude/commands/` oder `~/.claude/commands`).
Wenn du einen Command eingibst, wird der Prompt an die Konversation angehängt.

*   **`/handoff`**: Ein Custom Command von mir, der Claude bittet, den aktuellen Stand zusammenzufassen, bevor ich die Session kille und neu starte (Alternative zu `/compact`).
*   **`bootstrap-repo`**: Startet 10 parallele Sub-Agents, um das Repo zu durchsuchen und eine Doku zu erstellen (Vorsicht: Flickering Bug).

Du kannst Claude einfach bitten: *"Erstelle einen Custom Command /handoff, der..."* – es weiß, wie man das macht.

### Sub-Agents: Die heimlichen Stars

Sub-Agents sind separate Claude-Instanzen, die vom Haupt-Agenten gespawnt werden. Du kannst sie auch manuell triggern oder eigene definieren (`.claude/agents/your-agent.md`).

![Sub-Agents](/images/knowledge/claude-code-experience/sub-agents.webp)

#### Der Explore Agent

Der **Explore** Agent ist ein Read-Only Spezialist. Er kann `glob`, `grep`, `read` nutzen, aber **keine Dateien ändern**.

Auszug aus dem **System Prompt des Explore Agents** (Reverse Engineered):
```markdown
=== CRITICAL: READ-ONLY MODE - NO FILE MODIFICATIONS ===
This is a READ-ONLY exploration task. You are STRICTLY PROHIBITED from:
- Creating new files (no Write, touch...)
- Modifying existing files (no Edit operations)
- Running ANY commands that change system state

Your strengths:
- Rapidly finding files using glob patterns
- Searching code and text with powerful regex patterns
```

#### Wie werden Sub-Agents gespawnt? (The Task Tool)

Der Haupt-Agent nutzt das `Task` Tool, um Sub-Agents zu rufen. Hier ist ein Blick unter die Haube auf die verfügbaren Agent-Typen im Prompt:

*   **`general-purpose`**: Für komplexe Recherche und Multi-Step Tasks. (Tools: Alle)
*   **`Explore`**: Schneller Agent für Codebase-Erkundung. (Tools: Alle, aber Read-Only instruiert)
*   **`Plan`**: Software-Architekt für Implementierungspläne. Identifiziert kritische Dateien und Trade-offs.
*   **`claude-code-guide`**: Für Fragen zu Claude Code Features selbst.
*   **`statusline-setup`**: Konfiguration der Statuszeile.

Und das JSON-Schema, das der Agent nutzt:
```json
{
  "subagent_type": "string", // z.B. "Explore"
  "model": "string", // "sonnet", "opus", "haiku"
  "run_in_background": "boolean"
}
```

> **Pro-Tipp:** Sag Claude "Launch explore agent with Sonnet 4.5", wenn du willst, dass er Sonnet statt Haiku für die Suche nutzt. Oder nutze `run_in_background` für lange Skripte, um Logs zu überwachen.

### Erben Sub-Agents den Kontext?

*   `general-purpose` und `plan`: **Ja**, sie erben den vollen Kontext.
*   `Explore`: **Nein**, er startet mit einem frischen Slate. Das macht Sinn, da Suchaufgaben oft unabhängig sind.

Es ist wichtig, dass das Hauptmodell (Opus) die relevanten Dateien am Ende selbst liest (nicht nur die Zusammenfassung des Explore Agents), damit der "ingested context" im Attention-Mechanismus verarbeitet werden kann (Self-Attention braucht die Details für Pair-Wise Relationships).

## Mein Workflow (The Sankalp Method)

### 1. Setup
Ich habe einen task-basierten Workflow:
*   **Claude Code:** Main Driver.
*   **Codex:** Für Reviews und schwierige Tasks.
*   **Cursor:** Für manuelles Lesen und Edits.
Ich nutze selten den Plan Mode. Ich erkunde lieber interaktiv.

### 2. Exploration & Execution
Opus 4.5 erklärt Dinge großartig und macht tolle ASCII-Diagramme.
*   Ich stelle viele Fragen: Kläre Anforderungen, verstehe wo/wie Änderungen nötig sind.
*   Sobald ich genug Kontext habe, spamme ich `/ultrathink` und frage nach den nötigen Änderungen.
*   Wenn es gut aussieht: Execution. Ich überwache die Änderungen genau (Micro-Management).

### 3. "Throw-away First Draft" (Für schwierige Features)
Für komplexe Features nutze ich manchmal einen Wegwerf-Entwurf:
1.  Neuen Branch erstellen.
2.  Claude das Feature End-to-End schreiben lassen, während ich zusehe.
3.  Ergebnis mit meinem mentalen Modell vergleichen: Wo weicht es ab? Wo hat es Fehler gemacht?
4.  Mit diesem Wissen ("Hindsight") starte ich eine neue Iteration mit viel präziseren Prompts. (Wie im Film *Tenet*).

Für Backend-Heavy Sachen lasse ich manchmal Codex (`xhigh`) den Plan generieren.

### 4. Was ich nutze (und was nicht)
*   **Nutze:** Custom Commands, CLAUDE.md, Scratchpad, Background Agents (für Logs).
*   **Nutze selten:** Custom Sub-Agents, Git Worktrees.
*   **MCPs:** Nur bei Bedarf (z.B. Playwright, Figma), generell kein Fan.

Der Harness ist so gut, dass Claude meist selbst weiß, was zu tun ist. Deine Aufgabe ist Urteilsvermögen und Lenkung.

### 5. Review
Für Code-Reviews und Bug-Finding finde ich **GPT-5.2-Codex (`xhigh`)** überlegen. Einfach `/review` nutzen. Es findet Bugs oft zuverlässiger, markiert Severity (P1, P2) und liefert weniger False-Positives als Claude. Claude für die Arbeit, GPT für die Kontrolle.

## Context Engineering: Die Kunst der Token-Kuration

Agents sind "Token Guzzlers". Jeder Tool-Call und dessen Output landet im Kontext. Da LLMs stateless sind, muss alles immer wieder gesendet werden.

Beispiel einer einfachen Aufgabe ("Erstelle Landing Page"):
1.  Web Search Tool Call + Ergebnisse (~1.5k Token)
2.  Read File Tool Call + Inhalt (~4k Token)
3.  Create File Tool Call + Erfolg (~50 Token)
4.  Generate Image Tool Call + URL (~30 Token)
5.  Edit File Tool Call + Diff (~300 Token)
**Total: ~6k+ Token.** Und das bleibt alles im Kontext!

### Was ist Context Engineering?
Es geht darum, die Frage zu beantworten: *"Welche Konfiguration von Kontext erzeugt am wahrscheinlichsten das gewünschte Verhalten?"*

Sub-Agents, Scratchpads und Compaction sind alles Methoden des Context Managements.

### Context Rot (Verfall)
Die Leistung von LLMs nimmt ab, je mehr Token im Kontext sind ("Attention Budget"). Ein 200k Kontext ist effektiv vielleicht nur 50-60% nutzbar für komplexe Tasks.
Starte keine komplizierte Aufgabe, wenn du mitten in einer langen Konversation bist. Nutze `/compact` oder starte neu.

### MCP Server & Code Execution
MCP Server verbinden Claude mit externen Tools.
**Problem:** Tool-Definitionen blähen den Kontext auf.
**Lösung (MCP Code Exec):** Statt viele Tool-Definitionen zu laden, gibt man Claude eine Sandbox und lässt es Code schreiben, um die Tools zu nutzen.

### System Reminders
Wie hält man das Modell auf Kurs? Durch **Wiederholung**.
Manus (ein anderes Agent-Tool) schreibt ständig eine `todo.md` neu ans Ende des Kontextes. Das drückt den globalen Plan in den "Recent Attention Span" des Modells.

Claude Code nutzt `<system-reminder>` Tags, die dynamisch in User-Nachrichten und Tool-Results injiziert werden.
Beispiel:
```xml
<system-reminder>
As you answer the user's questions, you can use the following context:
# claudeMd
Contents of /Users/sankalp/.claude/CLAUDE.md...
</system-reminder>
```

### Skills und Plugins
Anthropic hat **Agent Skills** eingeführt (auch von Codex übernommen).
Ein Skill ist ein Ordner mit einer `SKILL.md`. Claude lädt diese Instruktionen bei Bedarf ("I know Kung Fu"-Moment). Das spart Kontext, da das Wissen nicht permanent geladen sein muss.

**Plugins** bündeln Skills, Commands und MCPs. Ein gutes Beispiel ist das `frontend-design` Plugin (eigentlich nur ein Skill), das Claude ästhetische Prinzipien beibringt, um "AI Slop" Designs zu vermeiden.

### Hooks
Hooks erlauben dir, Bash-Skripte an bestimmten Punkten im Agent-Loop auszuführen (z.B. `Stop`, `UserPromptSubmit`).

**Kreativer Use-Case:** Ein "Do more" Hook, der nach jedem Stop automatisch "Mach weiter" promptet, um Claude stundenlang autonom arbeiten zu lassen.

**Advanced Combo:** Skills + Hooks + Reminders.
Teile deine `CLAUDE.md` in kleine Skills auf. Nutze Hooks, um Claude daran zu erinnern, bestimmte Skills zu nutzen, wenn er bestimmte Dateien anfasst.

![Advanced Workflow](/images/knowledge/claude-code-experience/advanced-workflow.webp)

## Fazit

Wir leben in transformativen Zeiten. Manchmal fühlt man sich wie ein "Background Agent", der nur noch zuschaut. Manchmal fühlt man sich schlau, weil man einen Bug gefunden hat, den das Modell nicht sah.

Ich erwarte für 2026 Durchbrüche in RL-Training, Long Context Effectiveness (neue Attention-Architekturen?) und Reasoning (o1/o3 Level). Bis dahin: **Nutze die Tools, spiel damit herum und bau Intuition auf.**

Wenn du das hier nützlich fandest: Probier heute **ein** neues Feature aus (z.B. Checkpointing oder einen Sub-Agent). Happy Building!

---
*Quelle: [Sankalp's Blog](https://sankalp.bearblog.dev/my-experience-with-claude-code-20-and-how-to-get-better-at-using-coding-agents/)*