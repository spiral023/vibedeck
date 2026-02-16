---
title: "Claude Code & OpenAI Codex: Lokale LLMs nutzen"
description: "Schritt-für-Schritt-Anleitung, um Anthropic's Claude Code und OpenAI Codex mit lokalen Modellen wie DeepSeek oder Qwen via llama.cpp zu verbinden."
category: tooling
icon: Code2
readTime: 8 Min
tags: ["claude-code", "codex", "local-llm", "llama-cpp", "unsloth"]
sourceURL: "https://unsloth.ai/docs/basics/claude-codex"
sourceType: "docs"
author: "Unsloth Team"
sourceDate: "2026-02-02"
level: advanced
---

![Claude Code Local](/images/knowledge/claude-code-local-llm/header.png)

Diese Anleitung zeigt Dir, wie Du Open-Source LLMs vollständig lokal mit **Claude Code** und **OpenAI Codex** verbindest. Nutze jedes offene Modell wie DeepSeek, Qwen oder Gemma auf Deinem eigenen Rechner.

Wir nutzen in diesem Tutorial **GLM-4.7-Flash** (ein starkes 30B MoE Modell für Agentic Coding) und **Unsloth Dynamic GGUFs** für maximale Genauigkeit bei effizienter Quantisierung.

## 📖 Schritt 1: Llama.cpp installieren

Um lokale LLMs bereitzustellen (Serving), benötigen wir `llama.cpp`. Wir bauen es direkt aus dem Quellcode für optimale GPU-Unterstützung.

```bash
# System aktualisieren und Abhängigkeiten installieren
apt-get update
apt-get install pciutils build-essential cmake curl libcurl4-openssl-dev git-all -y

# Llama.cpp klonen und bauen
git clone https://github.com/ggml-org/llama.cpp
cmake llama.cpp -B llama.cpp/build -DBUILD_SHARED_LIBS=OFF -DGGML_CUDA=ON
cmake --build llama.cpp/build --config Release -j --clean-first --target llama-cli llama-mtmd-cli llama-server llama-gguf-split

# Binaries kopieren
cp llama.cpp/build/bin/llama-* llama.cpp
```
> **Hinweis:** Setze `-DGGML_CUDA=OFF`, wenn Du keine NVIDIA GPU hast.

## 📥 Schritt 2: Modelle lokal herunterladen

Nutze `huggingface_hub`, um die Modelle effizient zu laden. Wir empfehlen den **UD-Q4_K_XL** Quant für die beste Balance aus Größe und Genauigkeit.

```python
import os
os.environ["HF_HUB_ENABLE_HF_TRANSFER"] = "1"
from huggingface_hub import snapshot_download

snapshot_download(
    repo_id = "unsloth/GLM-4.7-Flash-GGUF",
    local_dir = "unsloth/GLM-4.7-Flash-GGUF",
    allow_patterns = ["*UD-Q4_K_XL*"],
)
```

## ⚡ Schritt 3: Llama-Server starten

Starte den Server mit optimierten Parametern für Agentic Workflows. Die folgenden Einstellungen passen perfekt in eine 24 GB GPU (z.B. RTX 4090).

```bash
./llama.cpp/llama-server 
    --model unsloth/GLM-4.7-Flash-GGUF/GLM-4.7-Flash-UD-Q4_K_XL.gguf 
    --alias "unsloth/GLM-4.7-Flash" 
    --fit on 
    --temp 1.0 
    --top-p 0.95 
    --min-p 0.01 
    --port 8001 
    --jinja 
    --kv-unified 
    --cache-type-k q8_0 --cache-type-v q8_0 
    --flash-attn on 
    --ctx-size 131072
```

## 👾 Claude Code Tutorial

**Claude Code** ist Anthropic's CLI-Tool für Agentic Coding. Es versteht Deine Codebase und erledigt komplexe Git-Workflows via Natural Language.

### Installation & Konfiguration
1. **Installieren:** `curl -fsSL https://claude.ai/install.sh | bash`
2. **Umleiten:** Setze `ANTHROPIC_BASE_URL`, um Claude Code mit Deinem lokalen Server zu verbinden:
   ```bash
   export ANTHROPIC_BASE_URL="http://localhost:8001"
   export ANTHROPIC_API_KEY="sk-no-key-required"
   ```

### Lokal ausführen
Navigiere in Deinen Projektordner und starte Claude:
```bash
claude --model unsloth/GLM-4.7-Flash
```

## 👾 OpenAI Codex CLI Tutorial

**Codex** ist der offizielle Coding-Agent von OpenAI. Obwohl er für ChatGPT entwickelt wurde, unterstützt er Custom API Endpoints.

### Installation
- **Linux/NPM:** `npm install -g @openai/codex`
- **Windows:** Nutzung via WSL empfohlen.

### Konfiguration
Erstelle die Datei `~/.codex/config.toml` (oder `%USERPROFILE%\.codex\config.toml` unter Windows):

```toml
[model_providers.llama_cpp]
name = "llama_cpp API"
base_url = "http://localhost:8001/v1"
wire_api = "responses"
stream_idle_timeout_ms = 10000000
```

### Starten
```bash
codex --model unsloth/GLM-4.7-Flash -c model_provider=llama_cpp --search
```

> ⚠️ **Achtung:** Mit dem Flag `--dangerously-bypass-approvals-and-sandbox` führt Codex Code ohne Bestätigung aus. Nutze dies nur in sicheren Umgebungen!
