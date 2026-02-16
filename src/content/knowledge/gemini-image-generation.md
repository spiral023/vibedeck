---
title: Gemini Image Generation Guide
description: Master image generation and editing with Gemini 2.5 Flash and Gemini 3 Pro.
category: fundamentals
icon: Image
readTime: 5 Min
tags: ["gemini", "image-generation", "prompts", "tooling"]
level: intermediate
---

# Gemini Image Generation Guide

Gemini can generate and process images conversationally. You can prompt either the [fast Gemini 2.5 Flash (aka Nano Banana) or the advanced Gemini 3 Pro Preview (aka Nano Banana Pro)](https://ai.google.dev/gemini-api/docs/image-generation#model-selection) image models with text, images, or a combination of both, allowing you to create, edit, and iterate on visuals with unprecedented control.

## Core Capabilities

- **Text, Image, and Multi-Image to Image:** Generate high-quality images from text descriptions, use text prompts to edit and adjust a given image, or use multiple input images to compose new scenes and transfer styles.
- **Iterative refinement:** Conversationally refine your image over multiple turns, making small adjustments until it's perfect.
- **High-Fidelity text rendering:** Accurately generate images that contain legible and well-placed text, ideal for logos, diagrams, and posters.

All generated images include a [SynthID watermark](https://ai.google.dev/responsible/docs/safeguards/synthid).

## Image generation (text-to-image)

### Python Example

```python
from google import genai
from google.genai import types
from PIL import Image

client = genai.Client()

prompt = "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"

response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=[prompt],
)

for part in response.parts:
    if part.text is not None:
        print(part.text)
    elif part.inline_data is not None:
        image = part.as_image()
        image.save("generated_image.png")
```

### JavaScript Example

```javascript
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {
  const ai = new GoogleGenAI({});
  const prompt = "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme";

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      fs.writeFileSync("gemini-native-image.png", buffer);
    }
  }
}
main();
```

## Image editing (text-and-image-to-image)

Provide an image and use text prompts to add, remove, or modify elements, change the style, or adjust the color grading.

### Python Example

```python
from google import genai
from PIL import Image

client = genai.Client()
prompt = "Create a picture of my cat eating a nano-banana in a fancy restaurant under the Gemini constellation"
image = Image.open("/path/to/cat_image.png")

response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=[prompt, image],
)
```

## New with Gemini 3 Pro Image

Gemini 3 Pro Image (`gemini-3-pro-image-preview`) is optimized for professional asset production.

- **High-resolution output**: Built-in generation capabilities for 1K, 2K, and 4K visuals.
- **Advanced text rendering**: Capable of generating legible, stylized text.
- **Grounding with Google Search**: Use Google Search as a tool to verify facts and generate imagery based on real-time data.
- **Thinking mode**: Utilizes a "thinking" process to reason through complex prompts.
- **Up to 14 reference images**: Mix up to 14 reference images to produce the final image.

### Using Reference Images (Python)

```python
from google import genai
from google.genai import types
from PIL import Image

prompt = "An office group photo of these people, they are making funny faces."
aspect_ratio = "5:4"

client = genai.Client()

response = client.models.generate_content(
    model="gemini-3-pro-image-preview",
    contents=[
        prompt,
        Image.open('person1.png'),
        Image.open('person2.png'),
        Image.open('person3.png'),
        Image.open('person4.png'),
        Image.open('person5.png'),
    ],
    config=types.GenerateContentConfig(
        response_modalities=['TEXT', 'IMAGE'],
        image_config=types.ImageConfig(
            aspect_ratio=aspect_ratio,
            image_size="2K"
        ),
    )
)
```

## Prompting guide and strategies

> **Describe the scene, don't just list keywords.** A narrative, descriptive paragraph will almost always produce a better, more coherent image.

### Strategies

1.  **Photorealistic scenes**: Use photography terms (camera angles, lighting, lens types).
2.  **Stylized illustrations**: Be explicit about style (e.g., "kawaii sticker", "transparent background").
3.  **Accurate text**: Specify the text, font style, and placement clearly.
4.  **Product mockups**: Describe lighting setup, camera angle, and background surface.
5.  **Character consistency**: Use reference images or describe features in detail across prompts.

### Example Prompt Template

> A photorealistic [shot type] of [subject], [action or expression], set in [environment]. The scene is illuminated by [lighting description], creating a [mood] atmosphere. Captured with a [camera/lens details], emphasizing [key textures and details].

## Technical Details

**Gemini 2.5 Flash Image** supports various aspect ratios (1:1, 16:9, 4:3, etc.) at roughly 1MP resolution.

**Gemini 3 Pro Image Preview** supports 1K, 2K, and 4K resolutions with token costs scaling accordingly (approx 1120 tokens for 1K/2K, 2000 tokens for 4K).

***

**Originalbeitrag:** [Gemini API Documentation - Image Generation](https://ai.google.dev/gemini-api/docs/image-generation?hl=de)
