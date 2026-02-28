---
title: 'Tutorial: Nano Banana Pro (Gemini 3 Pro Image)'
description: >-
  Ein umfassender Developer-Guide für die Features von Nano Banana Pro: Thinking
  Process, Search Grounding, 4K Output und mehr.
category: patterns
icon: Image
readTime: 6 Min
tags: ["gemini", "image-generation", "tooling", "docs"]
sourceURL: 'https://x.com/GoogleAIStudio/status/1992267030050083091'
sourceType: thread
author: Google AI Studio
level: advanced
addedDate: "2026-02-01"
---

> **Hinweis:** "Nano Banana" ist der Codename für Gemini 2.5 Flash Image Generation. "Nano Banana Pro" bezieht sich auf **Gemini 3 Pro Image Preview**.

![Cover](/images/knowledge/nano-banana-pro-tutorial/cover.jpg)

Nano Banana Pro bringt fortschrittliche Features wie "Thinking", Search Grounding und hochauflösenden 4K-Output. Während das Flash-Modell Geschwindigkeit und Kosteneffizienz brachte, führt die Pro-Version High-Fidelity-Generierung ein.

Dieser Guide führt dich durch die Nutzung der Advanced Features mit der **Gemini Developer API**.

## 1. Nutzung in Google AI Studio

Der beste Ort für Entwickler, um Prompts zu prototypen, ist [Google AI Studio](https://aistudio.google.com/banana-pro).

![AI Studio](/images/knowledge/nano-banana-pro-tutorial/ai-studio.jpg)

Wähle **Nano Banana Pro** (Gemini 3 Pro Image) im Model-Picker. Beachte, dass es für die Pro-Version keinen kostenlosen Tier gibt. Du benötigst einen API-Key mit aktiviertem Billing.

> **Tipp:** Du kannst Nano Banana Web Apps direkt im AI Studio unter [ai.studio/apps](https://ai.studio/apps) "vibecoden".

## 2. Project Setup

Du benötigst:
*   Einen API Key von Google AI Studio.
*   Billing aktiviert für dein Google Cloud Projekt.
*   Das Google Gen AI SDK für Python oder JavaScript/TypeScript.

### API Key & Billing

Erstelle einen Key im [API Key Management Screen](https://aistudio.google.com/api-keys).

![API Key](/images/knowledge/nano-banana-pro-tutorial/api-key.jpg)

Aktiviere Billing in den [Projekteinstellungen](https://aistudio.google.com/projects).

![Billing](/images/knowledge/nano-banana-pro-tutorial/billing.jpg)

> **Kosten:** 4K-Bilder kosten ca. $0.24, kleinere Auflösungen $0.134. Nutze die **Batch API**, um 50% der Kosten zu sparen (bei bis zu 24h Wartezeit).

### SDK Installation

**Python:**
```bash
pip install -U google-genai
pip install Pillow
```

**JavaScript / TypeScript:**
```bash
npm install @google/genai
```

## 3. Client Initialisierung

Nutze die Model-ID `gemini-3-pro-image-preview`.

```python
from google import genai
from google.genai import types

client = genai.Client(api_key="YOUR_API_KEY")
PRO_MODEL_ID = "gemini-3-pro-image-preview"
```

## 4. Basic Generation

Hier ist ein Standard-Beispiel. Du kannst `response_modalities` und `aspect_ratio` steuern.

```python
prompt = "Create a photorealistic image of a siamese cat with a green left eye and a blue right one"
aspect_ratio = "16:9" # "1:1","2:3","3:2","3:4","4:3","4:5","5:4","9:16","16:9","21:9"

response = client.models.generate_content(
    model=PRO_MODEL_ID,
    contents=prompt,
    config=types.GenerateContentConfig(
        response_modalities=['Image'],
        image_config=types.ImageConfig(
            aspect_ratio=aspect_ratio,
        )
    )
)

for part in response.parts:
    if image := part.as_image():
        image.save("cat.png")
```

![Cat](/images/knowledge/nano-banana-pro-tutorial/cat.jpg)

## 5. The "Thinking" Process

Nano Banana Pro "denkt", bevor es zeichnet. Das ermöglicht es dem Modell, komplexe Prompts zu durchdenken. Setze `include_thoughts=True`.

```python
response = client.models.generate_content(
    model=PRO_MODEL_ID,
    contents="Create an unusual but realistic image that might go viral",
    config=types.GenerateContentConfig(
        response_modalities=['Text', 'Image'],
        image_config=types.ImageConfig(aspect_ratio="16:9"),
        thinking_config=types.ThinkingConfig(
            include_thoughts=True # Enable thoughts
        )
    )
)

for part in response.parts:
    if part.thought:
        print(f"Thought: {part.text}")
    elif image := part.as_image():
        image.save("viral.png")
```

Das Modell gibt seine Gedanken aus ("Imagining...", "Visualizing the Concept..."), was hilft zu verstehen, wie es den Prompt interpretiert.

![Thinking](/images/knowledge/nano-banana-pro-tutorial/thinking.jpg)

## 6. Search Grounding

Das Modell kann auf Echtzeitdaten zugreifen. Aktiviere dazu das `google_search` Tool.

```python
prompt = "Visualize the current weather forecast for the next 5 days in Tokyo as a clean, modern weather chart. add a visual on what i should wear each day"

response = client.models.generate_content(
    model=PRO_MODEL_ID,
    contents=prompt,
    config=types.GenerateContentConfig(
        response_modalities=['Image'],
        image_config=types.ImageConfig(aspect_ratio="16:9"),
        tools=[{"google_search": {}}] # Enable Google Search
    )
)
```

![Search Grounding](/images/knowledge/nano-banana-pro-tutorial/search-grounding.jpg)

## 7. 4K Generation

Für Print-Qualität unterstützt das Modell 4K-Auflösung.

```python
response = client.models.generate_content(
    model=PRO_MODEL_ID,
    contents="A photo of an oak tree experiencing every season",
    config=types.GenerateContentConfig(
        response_modalities=['Image'],
        image_config=types.ImageConfig(
            aspect_ratio="1:1",
            image_size="4K" # "1K", "2K", "4K"
        )
    )
)
```

![4K Tree](/images/knowledge/nano-banana-pro-tutorial/4k-tree.jpg)

## 8. Polyglot Banana (Multilingual)

Das Modell kann Text in Bildern generieren und übersetzen.

```python
# Infografik auf Spanisch generieren
message = "Make an infographic explaining Einstein's theory of General Relativity suitable for a 6th grader in Spanish"
# ... generate content ...
```

![Relativity Spanish](/images/knowledge/nano-banana-pro-tutorial/relativity-es.jpg)

Du kannst das Bild dann übersetzen lassen, indem du das generierte Bild zurück in den Chat gibst:

```python
message = "Translate this infographic in Japanese, keeping everything else the same"
# ... send message with image ...
```

![Relativity Japanese](/images/knowledge/nano-banana-pro-tutorial/relativity-jp.jpg)

## 9. Advanced Image Mixing

Das Pro-Modell kann bis zu **14 Bilder** als Input verarbeiten (Flash nur 3). Perfekt für Collagen oder Gruppenfotos.

```python
response = client.models.generate_content(
    model=PRO_MODEL_ID,
    contents=[
        "An office group photo of these people, they are making funny faces.",
        PIL.Image.open('John.png'),
        PIL.Image.open('Jane.png'),
        # ... bis zu 14 Bilder
    ]
)
```

![Group Picture](/images/knowledge/nano-banana-pro-tutorial/group.jpg)

> **Hinweis:** Für hohe Wiedergabetreue bei Charakteren, beschränke dich auf ca. 5 Personen.

## 10. Pro-Exclusive Demos

**Personalized Pixel Art (Search Grounding):**
Prompt: *"Search the web then generate an image of isometric perspective, detailed pixel art that shows the career of Guillaume Vernade"*

![Pixel Art](/images/knowledge/nano-banana-pro-tutorial/pixel-art.jpg)

**Complex Text Integration:**
Prompt: *"Show me an infographic about how sonnets work, using a sonnet about bananas written in it, along with a lengthy literary analysis of the poem. Good vintage aesthetics"*

![Sonnet](/images/knowledge/nano-banana-pro-tutorial/sonnet.jpg)

**High-Fidelity Mockups:**
Prompt: *"A photo of a program for the Broadway show about TCG players on a nice theater seat..."*

![Mockup](/images/knowledge/nano-banana-pro-tutorial/mockup.jpg)

## 11. Best Practices

*   **Be Hyper-Specific:** Details zu Subjekten, Farben, Licht und Komposition.
*   **Provide Context:** Erkläre den Zweck oder die Stimmung.
*   **Iterate:** Nutze den Konversationsmodus für Änderungen.
*   **Step-by-Step:** Zerlege komplexe Szenen in sequentielle Anweisungen.
*   **Positive Framing:** Beschreibe was da sein soll ("leere Straße"), statt was nicht ("keine Autos").
*   **Camera Control:** Nutze Begriffe wie "wide-angle", "macro shot".
*   **Search Grounding präzise nutzen:** Sag explizit "Search the web about...".
*   **Batch API nutzen:** Um Kosten zu sparen.
