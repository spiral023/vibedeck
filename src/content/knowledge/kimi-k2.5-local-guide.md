---
title: "Kimi K2.5: Lokale Ausführung & Guide"
description: "Erfahre, wie Du Kimi K2.5 von Moonshot AI lokal ausführst. Nutze Unsloth Dynamic GGUFs für maximale Performance bei geringem Speicherbedarf."
category: tooling
icon: Lock
readTime: 8 Min
tags: ["llm-coding", "local-llm", "unsloth", "moonshot-ai", "kimi"]
sourceURL: "https://unsloth.ai/docs/models/kimi-k2.5"
sourceType: "blog"
author: "Unsloth Team"
sourceDate: "2026-01-31"
---

![Unsloth Logo](/images/knowledge/kimi-k2.5-local-guide/header.jpg)

Kimi K2.5 ist das neueste Modell von Moonshot AI, das SOTA-Leistung in den Bereichen Vision, Coding, Agentic und Chat-Aufgaben erzielt. Während das vollständige Modell mit 1T Parametern rund 600 GB Festplattenspeicher benötigt, reduziert die **Unsloth Dynamic 1.8-bit** Version diesen Bedarf auf 240 GB (-60% Größe).

Alle Uploads nutzen Unsloth **Dynamic 2.0** für SOTA-Performance in Aider und 5-shot MMLU.

## ⚙️ Empfohlene Anforderungen

> Die einzige Voraussetzung ist: **Festplattenspeicher + RAM + VRAM ≥ 240 GB**.

- **Speicher:** Du benötigst mindestens 240 GB freien Speicher für den 1-bit Quant.
- **RAM/VRAM:** Du musst nicht zwingend so viel RAM oder VRAM haben, aber das Modell wird deutlich langsamer, wenn es auf die Festplatte auslagern muss.
- **Performance:** Der 1.8-bit (UD-TQ1_0) Quant läuft auf einer einzelnen 24 GB GPU, wenn alle MoE-Layer in den System-RAM (oder eine schnelle SSD) ausgelagert werden. Mit ~256 GB RAM sind ca. 10 Tokens/s zu erwarten. Auf einer B200 sind bei passendem Speicher über 40 Tokens/s möglich.
- **Balance:** Unsloth empfiehlt **UD-Q2_K_XL (375 GB)** als guten Kompromiss zwischen Größe und Qualität.

## 🥝 Kimi K2.5 ausführen

Kimi K2.5 benötigt je nach Anwendungsfall unterschiedliche Sampling-Parameter. Aktuell gibt es in `llama.cpp` noch **keine Vision-Unterstützung**, diese wird jedoch bald erwartet.

### Unterschiede zu Kimi K2 Thinking
- Beide Modelle nutzen eine modifizierte DeepSeek V3 MoE Architektur.
- `rope_scaling.beta_fast`: K2.5 nutzt 32.0 (vs. 1.0 bei K2 Thinking).
- **MoonViT:** Der native 200M Parameter Vision-Encoder ähnelt dem von Kimi-VL-A3B-Instruct.

## 🌙 Usage Guide

Moonshot AI empfiehlt folgende Einstellungen für die Kimi K2.5 Inference:

| Einstellung | Default (Instant Mode) | Thinking Mode |
| :--- | :--- | :--- |
| **temperature** | 0.6 | 1.0 |
| **top_p** | 0.95 | 0.95 |
| **min_p** | 0.01 | 0.01 |

> **Tipp:** Setze `min_p` auf 0.01, um unwahrscheinliche Tokens zu unterdrücken, und deaktiviere den `repeat penalty` (oder setze ihn auf 1.0), falls nötig. Die vorgeschlagene Context Length liegt bei 98.304 (bis zu 256K).

### Chat Template
Das Modell nutzt das ChatML-Format mit einem speziellen `<think>` Tag für den Assistant:
```text
<|im_system|>system<|im_middle|>You are Kimi, an AI assistant created by Moonshot AI.<|im_end|><|im_user|>user<|im_middle|>What is 1+1?<|im_end|><|im_assistant|>assistant<|im_middle|><think>
```

## ✨ Kimi K2.5 in llama.cpp ausführen

1. **llama.cpp bauen:**
   Stelle sicher, dass Du die neueste Version von `llama.cpp` nutzt.
   ```bash
   git clone https://github.com/ggml-org/llama.cpp
   cmake llama.cpp -B llama.cpp/build -DBUILD_SHARED_LIBS=OFF -DGGML_CUDA=ON
   cmake --build llama.cpp/build --config Release -j --target llama-cli llama-server
   ```

2. **Modell laden:**
   Nutze `--fit on` für die automatische Verteilung auf GPU und CPU. `LLAMA_SET_ROWS=1` beschleunigt die Ausführung zusätzlich.
   ```bash
   LLAMA_SET_ROWS=1 ./llama.cpp/llama-cli 
       -hf unsloth/Kimi-K2.5-GGUF:UD-TQ1_0 
       --temp 1.0 
       --min-p 0.01 
       --top-p 0.95 
       --ctx-size 16384 
       --fit on 
       --jinja
   ```

3. **MoE Layer manuell auslagern:**
   Falls `--fit on` nicht optimal funktioniert, kannst Du mit `-ot` gezielt Layer auf die CPU verschieben:
   - `-ot ".ffn_.*_exps.=CPU"`: Alle MoE-Layer auf CPU (spart am meisten VRAM).
   - `-ot ".ffn_(up|down)_exps.=CPU"`: Nur Up/Down Projections auf CPU.

## 📊 Benchmarks

Kimi K2.5 zeigt beeindruckende Ergebnisse im Vergleich zu anderen Top-Modellen:

| Benchmark | Kimi K2.5 | GPT-4o (5.2) | Claude 3.5 Opus (4.5) |
| :--- | :--- | :--- | :--- |
| **AIME 2025** | 96.1 | 100 | 92.8 |
| **GPQA-Diamond** | 87.6 | 92.4 | 87.0 |
| **MMLU-Pro** | 87.1 | 86.7 | 89.3 |
| **SWE-Bench Verified** | 76.8 | 80.0 | 80.9 |
| **MathVista** | 90.1 | 82.8 | 80.2 |
