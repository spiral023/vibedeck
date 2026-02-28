---
title: "Codex Rules: Kontrolle über Befehle außerhalb der Sandbox"
description: "Verwalte mit Rules, welche Befehle Codex außerhalb der isolierten Sandbox ausführen darf – von der automatischen Freigabe bis zur strikten Blockierung."
category: security
icon: Shield
readTime: 10 Min
tags: ["codex", "openai", "security", "sandbox", "cli", "rules"]
sourceURL: "https://developers.openai.com/codex/rules"
sourceType: "blog"
author: "OpenAI"
sourceDate: "2026-02-28"
addedDate: "2026-02-28"
---

> **Quelle:** Dieser Artikel basiert auf der offiziellen [OpenAI Codex Dokumentation zu Rules](https://developers.openai.com/codex/rules).

Das Feature **Rules** in Codex ermöglicht es dir, präzise zu steuern, welche Befehle das Tool außerhalb der geschützten **Sandbox** ausführen darf. Dies ist ein entscheidendes Sicherheits-Feature, um zu verhindern, dass die KI unbeabsichtigt kritische Systembefehle direkt auf deinem Host-Rechner ausführt.

---

## 1. Erstellen einer Rules-Datei

Rules werden in Dateien mit der Endung `.rules` unter dem Pfad `./codex/rules/` gespeichert (z. B. `~/.codex/rules/default.rules`).

Eine Regel wird mit der Funktion `prefix_rule()` definiert. Hier ist ein Beispiel, das eine Bestätigung (Prompt) anfordert, bevor der Befehl `gh pr view` außerhalb der Sandbox ausgeführt wird:

```python
# Fordert eine Bestätigung an, bevor Befehle mit dem Präfix `gh pr view` ausgeführt werden.
prefix_rule(
    # Das zu prüfende Präfix (Pattern).
    pattern = ["gh", "pr", "view"],

    # Die Aktion, die Codex bei einem Match ausführen soll.
    decision = "prompt",

    # Optionale Begründung für die Regel.
    justification = "Das Einsehen von PRs ist nach Freigabe erlaubt",

    # 'match' und 'not_match' dienen als Unit-Tests für deine Regel.
    match = [
        "gh pr view 7888",
        "gh pr view --repo openai/codex",
    ],
    not_match = [
        # Stimmt nicht überein, da das Pattern ein exaktes Präfix sein muss.
        "gh pr --repo openai/codex view 7888",
    ],
)
```

Nachdem du die Datei erstellt hast, musst du Codex neu starten. Beim Start scannt Codex alle `rules/` Verzeichnisse in deinen Konfigurations-Locations.

---

## 2. Die Felder von prefix_rule() verstehen

Die Funktion `prefix_rule()` unterstützt folgende Parameter:

- **`pattern` (erforderlich)**: Eine Liste von Strings, die das Befehls-Präfix definieren.
- **`decision` (Standard: "allow")**: Bestimmt die Aktion bei einem Match. Codex wendet immer die restriktivste Entscheidung an (`forbidden` > `prompt` > `allow`).
  - `allow`: Führt den Befehl ohne Rückfrage aus.
  - `prompt`: Fragt vor jeder Ausführung nach.
  - `forbidden`: Blockiert den Befehl ohne Rückfrage.
- **`justification` (optional)**: Eine menschlich lesbare Begründung. Diese wird in Approval-Prompts oder Fehlermeldungen angezeigt.
- **`match` / `not_match`**: Beispiele, die Codex beim Laden validiert, um Fehler in der Regellogik frühzeitig abzufangen.

---

## 3. Shell Wrappers und komplexe Befehle

Einige Tools verpacken mehrere Shell-Befehle in einen einzigen Aufruf, z. B.:
`["bash", "-lc", "git add . && rm -rf /"]`

Da solche Aufrufe gefährliche Aktionen verschleiern können, behandelt Codex `bash -c`, `zsh -c` und deren Äquivalente speziell.

### Wann Codex Skripte aufteilt (Splitting)
Codex nutzt **Tree-sitter**, um Shell-Skripte zu parsen und in Einzelbefehle zu zerlegen, wenn das Skript eine lineare Kette ist, die nur aus:
- Einfachen Wörtern (keine Variablen-Expansion wie `$FOO`, keine Wildcards wie `*`).
- Sicheren Operatoren (`&&`, `||`, `;`, `|`) besteht.

Das obige Beispiel wird also in zwei Befehle aufgeteilt:
1. `["git", "add", "."]`
2. `["rm", "-rf", "/"]`

Codex prüft beide Befehle gegen deine Rules. Wenn du `git add` erlaubst, aber `rm -rf` blockierst, wird der gesamte Aufruf gestoppt.

### Wann Codex Skripte NICHT aufteilt
In folgenden Fällen wird das Skript als ein einziger, monolithischer Block behandelt:
- Nutzung von Redirections (`>`, `>>`, `<`).
- Variablen-Substitutionen oder Umgebungsvariablen (`FOO=bar`).
- Wildcards (`*`, `?`).
- Control-Flow (`if`, `for`, etc.).

Hier greift Codex auf das konservativste Verhalten zurück und wendet die Regeln auf den gesamten `bash -lc <script>` Aufruf an.

---

## 4. Testen deiner Rules

Du kannst deine Regeln testen, ohne sie scharf zu schalten, indem du den Befehl `codex execpolicy check` nutzt:

```powershell
codex execpolicy check --pretty `
  --rules ~/.codex/rules/default.rules `
  -- gh pr view 7888 --json title,body,comments
```

Die Ausgabe zeigt dir im JSON-Format, welche Entscheidung getroffen wurde und welche Regeln (inklusive Justification) gegriffen haben.

---

## 5. Die Rules-Sprache (Starlark)

Das `.rules` Dateiformat basiert auf **Starlark**, einer Sprache, die syntaktisch stark an Python angelehnt ist. Starlark wurde speziell entwickelt, um sicher ausgeführt werden zu können: Die Rules-Engine kann den Code ausführen, ohne dass Seiteneffekte (wie Zugriffe auf das Dateisystem) möglich sind.

---

## Fazit: Sicherheit durch Transparenz

Rules geben Administratoren und Power-Usern die volle Kontrolle zurück. Durch die Kombination von **Smart Approvals** (bei denen Codex Regeln basierend auf deinem Verhalten vorschlägt) und manuell definierten **Restrictive Rules** kannst du eine Arbeitsumgebung schaffen, die sowohl produktiv als auch sicher vor destruktiven KI-Aktionen ist.
