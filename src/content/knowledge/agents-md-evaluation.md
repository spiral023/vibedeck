---
title: "Hilft AGENTS.md wirklich? Eine Evaluierung von Repository-Level Context Files"
description: "Eine Studie der ETH Zürich untersucht, ob Dateien wie AGENTS.md oder CLAUDE.md die Performance von Coding-Agents tatsächlich verbessern oder nur die Kosten in die Höhe treiben."
category: patterns
icon: BrainCircuit
readTime: 6 Min
tags: ["llm-coding", "agents", "context-engineering", "benchmark"]
sourceURL: "https://x.com/omarsar0/status/2027025098578727353"
sourceType: "thread"
author: "elvis (@omarsar0)"
sourceDate: "2026-02-26"
---

![Header Image](/images/knowledge/agents-md-evaluation/header.jpg)

Helfen Dateien wie `AGENTS.md` oder `CLAUDE.md` Deinem Coding-Agent wirklich, oder schaden sie ihm sogar? Fast jedes ernsthafte Coding-Projekt nutzt mittlerweile solche Context Files im Root-Verzeichnis, um Agents Anweisungen zu geben, welche Commands sie ausführen sollen oder welche Conventions einzuhalten sind. Die Annahme: Mehr Kontext führt zu besseren Ergebnissen.

Ein neues Paper des **SRI Labs der ETH Zürich** hat diese Annahme nun auf den Prüfstand gestellt. Die Ergebnisse sind überraschend und zeigen, dass wir unser Verständnis von Context Engineering überdenken müssen.

## Das Problem: Intuition vs. Messung

Context Files (Variationen von `AGENTS.md`, `CLAUDE.md` oder `CONTRIBUTING.md`) haben sich parallel zu Coding-Agents verbreitet. Die Idee ist intuitiv: Wenn man dem Agent erklärt, wie das Repo funktioniert, sollte er besser abschneiden. Doch bisher gab es kaum systematische Messungen, ob diese positive Beziehung wirklich existiert.

Ein tieferliegendes Problem ist, dass Standard-Benchmarks wie SWE-bench meist populäre Repositories abdecken, die bereits sehr gut dokumentiert sind und oft keine spezifischen Context Files für Agents benötigen. Daher wurde für diese Studie ein neuer Benchmark entwickelt.

## AGENTbench: Ein neuer Benchmark

Das Paper führt **AGENTbench** ein, der 138 Instanzen aus 12 weniger populären Python-Repositories enthält. Diese Repos verfügen bereits über von Entwicklern geschriebene Context Files. Diese Dateien sind substanziell: Im Durchschnitt umfassen sie 641 Wörter in fast 10 Abschnitten.

Drei Agents wurden evaluiert:
*   **Claude Code** (Sonnet-4.5)
*   **Codex** (GPT-5.2 und GPT-5.1 mini)
*   **Qwen Code** (Qwen3-30b-coder)

Die Agents wurden unter drei Bedingungen getestet: Ohne Context File, mit einem LLM-generierten Context File und mit einem von Menschen geschriebenen Context File.

![Benchmark Comparison](/images/knowledge/agents-md-evaluation/benchmark.jpg)

## Die nackten Zahlen

Die wichtigste Erkenntnis: **LLM-generierte Context Files reduzieren die Erfolgsquote** im Vergleich zu gar keinem Kontext, während sie die **Inference-Kosten um über 20% erhöhen**.

![Task Success Drop](/images/knowledge/agents-md-evaluation/success_rates.jpg)

In SWE-bench Lite sank die Performance bei LLM-generierten Dateien im Schnitt um 0,5%, in AGENTbench sogar um 2%. Das ist zwar kein Katastrophenszenario, aber die falsche Richtung.

### Der Kostenfaktor
Egal ob menschlich geschrieben oder auto-generiert: Context Files führen dazu, dass Agents **14-22% mehr Reasoning-Tokens** verbrauchen und 2-4 zusätzliche Schritte benötigen. Das Befolgen von Instruktionen kostet Rechenleistung – unabhängig davon, ob diese Instruktionen helfen oder nicht.

![Cost Increase](/images/knowledge/agents-md-evaluation/cost_increase.jpg)

**Menschlich geschriebene Dateien** hingegen erzielten eine **Verbesserung von 4%** gegenüber der Bedingung ohne Kontext. Das ist ein signifikanter Gewinn und erklärt, warum sich Context Files überhaupt durchgesetzt haben.

## Das Explorations-Paradoxon

Agents folgen den Anweisungen in Context Files sehr getreu. Wenn eine Datei die Nutzung von `uv` vorschreibt, steigt die Nutzung von `uv` drastisch an. Das Instruction-Following funktioniert also perfekt.

![Exploration Steps](/images/knowledge/agents-md-evaluation/inference_steps.png)

Das Problem: **Instruction-Following bedeutet nicht automatisch Erfolg.** Agents mit Context Files führen mehr Tests aus, durchsuchen mehr Dateien und generieren mehr Reasoning-Output. Sie explorieren gründlicher, aber nicht unbedingt korrekter. Ein ausführlicher Überblick über die Codebase hilft dem Agent oft nicht dabei, schneller die *richtige* Stelle für den Fix zu finden.

## Warum menschliche Dateien gewinnen: Redundanz vs. Additivität

Der Unterschied zwischen menschlichen und auto-generierten Dateien liegt in der **Redundanz**.

> LLM-generierte Dateien neigen dazu, Informationen zu reproduzieren, die bereits an anderer Stelle im Repo (README, Dokumentation, CONTRIBUTING.md) vorhanden sind.

In einem Experiment wurden Dokumentationsdateien entfernt, bevor die Context Files generiert wurden. In diesem Fall verbesserten sich die LLM-generierten Dateien um 2,7% und übertrafen sogar die menschlichen Dateien. Das zeigt: **Redundanter Inhalt macht auto-generierte Dateien kontraproduktiv.**

![Redundancy](/images/knowledge/agents-md-evaluation/exploration.jpg)

Menschliche Context Files hingegen enthalten oft Informationen, die nirgendwo sonst stehen: Spezifische Tooling-Entscheidungen, Eigenheiten des CI-Setups oder nicht-standardisierte Conventions. Dies ist **additiver Kontext**, der dem Agent wirklich einen Mehrwert bietet.

## Was bedeutet das für die Praxis?

1.  **Schreibe für die Lücke, nicht für den Überblick:** Context Files sollten das kodieren, was das Repository *nicht* bereits erklärt. Ein `CLAUDE.md`, das nur das README wiederholt, schadet wahrscheinlich mehr als es nützt.
2.  **Kosten im Blick behalten:** Jedes Context File erhöht die Kosten um ca. 20%. Ob sich das lohnt, hängt von der Qualität der Datei und der Komplexität der Aufgabe ab.
3.  **Minimalismus gewinnt:** Halte Dateien wie `AGENTS.md` kurz und spezifisch. Beschreibe Tools und Conventions, die nicht offensichtlich sind.

## Fazit

Context Files sind keine Magie, aber auch nicht nutzlos. Die Qualität des Ergebnisses hängt vollständig von der Qualität und Einzigartigkeit der Instruktionen ab. Für Entwickler bedeutet das: Weniger ist mehr. Konzentriere Dich auf das Wesentliche, das der Agent nicht selbst durch einfaches Lesen der bestehenden Dokumentation herausfinden kann.

---

### Ressourcen
*   **Vollständiges Paper:** [Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?](https://arxiv.org/abs/2602.11988)
*   **AGENTbench Dataset:** [github.com/eth-sri/agentbench](https://github.com/eth-sri/agentbench)
*   **Original Blogpost:** [dair.ai/blog/agents-md-evaluation](https://academy.dair.ai/blog/agents-md-evaluation)
