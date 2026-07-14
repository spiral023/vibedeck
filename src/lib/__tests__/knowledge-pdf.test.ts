import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createKnowledgePdfFilename,
  parseKnowledgePdfBlocks,
  parseKnowledgePdfInline,
  prepareKnowledgePdfImages,
} from '../knowledge-pdf';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('knowledge PDF data utilities', () => {
  it('parses the supported regular markdown blocks', () => {
    const blocks = parseKnowledgePdfBlocks(`## Architektur

Ein Absatz mit **fett** und [Link](https://example.com).

- Erstes Element
- Zweites Element

![Architektur](/images/architecture.png)

\`\`\`ts
const answer = 42;
\`\`\``);

    expect(blocks).toEqual([
      { type: 'heading', level: 2, text: 'Architektur' },
      { type: 'paragraph', text: 'Ein Absatz mit **fett** und [Link](https://example.com).' },
      { type: 'unordered-list', items: ['Erstes Element', 'Zweites Element'] },
      { type: 'image', alt: 'Architektur', src: '/images/architecture.png' },
      { type: 'code', language: 'ts', text: 'const answer = 42;' },
    ]);
  });

  it('replaces Mermaid and excludes the Verbindungen section', () => {
    const blocks = parseKnowledgePdfBlocks(`\`\`\`mermaid
graph TD
A --> B
\`\`\`

## Verbindungen
- [[Nicht exportieren]]

## Fazit

Der verbleibende Absatz.`);

    expect(blocks).toEqual([
      { type: 'dynamic-content-notice' },
      { type: 'heading', level: 2, text: 'Fazit' },
      { type: 'paragraph', text: 'Der verbleibende Absatz.' },
    ]);
  });

  it('parses bold, code, and link inline content', () => {
    expect(parseKnowledgePdfInline('**fett** und `code` bei [VibeDeck](https://vibedeck.app)')).toEqual([
      { text: 'fett', bold: true },
      { text: ' und ' },
      { text: 'code', code: true },
      { text: ' bei ' },
      { text: 'VibeDeck', href: 'https://vibedeck.app' },
    ]);
  });

  it('creates an ASCII-safe filename from an accented id', () => {
    expect(createKnowledgePdfFilename('claude-code/überblick')).toBe('claude-code-ueberblick.pdf');
  });

  it('embeds only successfully fetched image sources', async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url === '/ok.png') {
        return {
          ok: true,
          blob: async () => new Blob(['image bytes'], { type: 'image/png' }),
        };
      }

      return {
        ok: false,
        blob: async () => new Blob(),
      };
    });
    vi.stubGlobal('fetch', fetchMock);

    const imageSources = await prepareKnowledgePdfImages(parseKnowledgePdfBlocks(`
![OK](/ok.png)
![Noch einmal OK](/ok.png)
![Fehlt](/missing.png)
`));

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(imageSources.get('/ok.png')).toMatch(/^data:image\/png;base64,/);
    expect(imageSources.has('/missing.png')).toBe(false);
  });
});
