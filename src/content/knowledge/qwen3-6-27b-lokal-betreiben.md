---
title: "Qwen3.6-27B schlägt Claude 4.5 Opus beim Coding – Open Source, lokal lauffähig"
description: "Ein 27B Dense-Modell übertrifft Qwen3.5-397B (15× größer) auf allen Coding-Benchmarks und matcht Claude 4.5 Opus auf mehreren Tasks – Apache 2.0, lokal betreibbar ab 18 GB RAM."
type: source
status: seed
category: fundamentals
icon: BrainCircuit
readTime: 5
tags:
  - fundamentals/benchmarks
  - tooling/local-llm
  - tooling/unsloth
  - workflows/agentic-coding
aliases:
  - "Qwen 3.6"
  - "Qwen3.6-27B"
topics:
  - "[[Benchmark Evaluation]]"
  - "[[Agentic Coding]]"
  - "[[Open Source LLMs]]"
  - "[[Hybrid Thinking]]"
up: "[[Open Source LLMs]]"
sourceURL: "https://x.com/Alibaba_Qwen/status/2046939764428009914"
sourceType: "tweet"
author: "Alibaba Qwen"
sourceDate: "2026-04-22"
addedDate: "2026-04-27"
---

![Qwen3.6-27B Benchmark-Übersicht](/images/knowledge/qwen3-6-27b-lokal-betreiben/header.jpg)

Alibaba hat am 22. April 2026 **Qwen3.6-27B** veröffentlicht – ein 27B Dense-Modell, das auf allen wichtigen Coding-Benchmarks den eigenen Qwen3.5-397B-A17B (15× mehr Parameter) übertrifft und dabei mit Claude 4.5 Opus auf Augenhöhe ist. Apache 2.0, lokal ab 18 GB RAM.

> Smaller model. Bigger results. Community's favorite.
> — @Alibaba_Qwen, 22. April 2026

## Coding Agent Benchmarks

Das ist die Kernaussage des Releases: Ein 27B-Modell, das ein MoE-Modell mit 397B Gesamtparametern in jedem einzelnen Coding-Benchmark übertrifft – und gegen das kommerzielle Claude 4.5 Opus antritt.

| Benchmark | Qwen3.5-27B | Qwen3.5-397B-A17B | Gemma4-31B | **Claude 4.5 Opus** | Qwen3.6-27B |
|---|---|---|---|---|---|
| SWE-bench Verified | 75.0 | 76.2 | 52.0 | **80.9** | 77.2 |
| SWE-bench Pro | 51.2 | 50.9 | 35.7 | **57.1** | 53.5 |
| SWE-bench Multilingual | 69.3 | 69.3 | 51.7 | **77.5** | 71.3 |
| Terminal-Bench 2.0 | 41.6 | 52.5 | 42.9 | 59.3 | **59.3** ← Gleichstand |
| SkillsBench Avg | 27.2 | 30.0 | 23.6 | 45.3 | **48.2** ← Qwen gewinnt |
| Claw-Eval Avg | 64.3 | 70.7 | 48.5 | 76.6 | **72.4** |
| Claw-Eval Pass³ | 46.2 | 48.1 | 25.0 | 59.6 | **60.6** ← Qwen gewinnt |
| NL2Repo | 27.3 | 32.2 | 15.5 | 43.2 | **36.2** |

**Zusammenfassung:** Qwen3.6-27B liegt auf SWE-bench knapp unter Claude 4.5 Opus, übertrifft ihn aber auf SkillsBench (+3 Punkte) und Claw-Eval Pass³ (+1 Punkt). Gegenüber Qwen3.5-397B-A17B gewinnt es auf der gesamten Linie – besonders drastisch bei SkillsBench (+18 Punkte) und Terminal-Bench (+6.8 Punkte).

## STEM & Reasoning Benchmarks

| Benchmark | Qwen3.5-27B | Qwen3.5-397B-A17B | Gemma4-31B | **Claude 4.5 Opus** | Qwen3.6-27B |
|---|---|---|---|---|---|
| GPQA Diamond | 85.5 | 88.4 | 84.3 | 87.0 | **87.8** ← Qwen gewinnt |
| LiveCodeBench v6 | 80.7 | 83.6 | 80.0 | 84.8 | **83.9** |
| AIME26 | 92.6 | 93.3 | 89.2 | **95.1** | 94.1 |
| HMMT Feb 25 | 92.0 | 94.8 | 88.7 | 92.9 | **93.8** |
| HMMT Feb 26 | 84.3 | 87.9 | 77.2 | 85.3 | **84.3** |
| IMOAnswerBench | 79.9 | 80.9 | 74.5 | **84.0** | 80.8 |
| MMLU-Pro | 86.1 | **87.8** | 85.2 | 89.5 | 86.2 |

Auf GPQA Diamond (Scientific Reasoning) übertrifft Qwen3.6-27B sogar Claude 4.5 Opus (87.8 vs. 87.0). Bei AIME26 und LiveCodeBench liegt es knapp dahinter, aber vor allen anderen Open-Source-Modellen dieser Größenklasse.

## Vision Language Benchmarks

![Qwen3.6-27B Score-Übersicht](/images/knowledge/qwen3-6-27b-lokal-betreiben/score.png)

Qwen3.6-27B ist nativ multimodal und verarbeitet Text, Bilder und Videos in einem einzigen Checkpoint.

| Benchmark | Qwen3.5-27B | **Claude 4.5 Opus** | Qwen3.6-27B |
|---|---|---|---|
| MMMU | 82.3 | 80.7 | **82.9** ← Qwen gewinnt |
| MMMU-Pro | 75.0 | 70.6 | **75.8** ← Qwen gewinnt |
| MathVista mini | 87.8 | -- | **87.4** |
| VlmsAreBlind | 96.9 | -- | **97.0** |
| VideoMME (w/ sub.) | 87.0 | 77.7 | **87.7** ← Qwen gewinnt |
| AndroidWorld | 64.2 | -- | **70.3** |

Bei Vision-Language-Tasks liegt Qwen3.6-27B auf ganzer Linie vor Claude 4.5 Opus – insbesondere bei VideoMME (+10 Punkte) und MMMU-Pro (+5 Punkte).

## Was das bedeutet

Die entscheidenden Zahlen im Überblick:

- **vs. Qwen3.5-397B-A17B (15× größer):** Qwen3.6-27B gewinnt auf *allen* Coding-Benchmarks. SkillsBench: +18 Punkte.
- **vs. Claude 4.5 Opus (kommerziell, closed):** Gleichstand auf Terminal-Bench, Sieg auf SkillsBench, Claw-Eval Pass³, GPQA Diamond, allen Vision-Tasks.
- **Lizenz:** Apache 2.0 – keine Nutzungsbeschränkungen, kein API-Pricing.
- **Lokaler Betrieb:** Via Unsloth Dynamic 2.0 GGUFs ab ~18 GB RAM (27B), ~22 GB RAM (35B-A3B).

Das Modell unterstützt **Hybrid-Thinking** (Chain-of-Thought on/off), **Preserve Thinking** (Reasoning-Kontext über Turns hinweg) und **Tool Calling** mit verbessertem Parsing für verschachtelte Objekte.

## Inference-Performance (lokal)

Geschwindigkeit hängt primär von der **Speicherbandbreite** ab. Richtwerte für Q4_K_M (GGUF, ~18 GB):

| Hardware | tok/s (ca.) | Hinweis |
|---|---|---|
| RTX Pro 6000 Blackwell (96 GB) | 90–120 | Q8/FP16 ebenfalls vollständig in VRAM |
| RTX 4090 (24 GB) | 50–70 | Q4 passt knapp rein |
| Apple M3/M4 Max (96–128 GB) | 30–50 | Unified Memory, kein Offloading |
| CPU-only / Hybrid-Offload | 5–20 | RAM-Bandbreite limitiert |

Die 96 GB der RTX Pro 6000 erlauben sogar FP16 (~54 GB) vollständig im VRAM – und bei Qwen3.6-27Bs nativem 262K-Context-Fenster entstehen dadurch keine KV-Cache-Engpässe.

## Verbindungen
- [[Benchmark Evaluation]]
- [[SWE-bench]]
- [[Agentic Coding]]
- [[Hybrid Thinking]]
- [[Open Source LLMs]]
- [[GGUF Quantization]]
- [[Local LLM]]
- [[Vision Language Model]]
- [[Claude 4.5 Opus]]
- [[Tool Calling]]
