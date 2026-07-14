import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createKnowledgePdfFilename,
  parseKnowledgePdfBlocks,
  parseKnowledgePdfInline,
  prepareKnowledgePdfImages,
} from '../knowledge-pdf';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

beforeEach(() => {
  class DecodableImage {
    src = '';

    decode() {
      return Promise.resolve();
    }
  }

  vi.stubGlobal('Image', DecodableImage);
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
          headers: new Headers({ 'content-type': 'image/png' }),
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

  it('embeds allowed JPEG and SVG image sources', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => ({
      ok: true,
      headers: new Headers({
        'content-type': url === '/diagram.svg' ? 'image/svg+xml' : 'image/jpeg',
      }),
      blob: async () => new Blob(
        [url === '/diagram.svg' ? '<svg xmlns="http://www.w3.org/2000/svg" />' : 'jpeg bytes'],
        { type: url === '/diagram.svg' ? 'image/svg+xml' : 'image/jpeg' },
      ),
    })));

    const imageSources = await prepareKnowledgePdfImages(parseKnowledgePdfBlocks(`
![Foto](/photo.jpg)
![Diagramm](/diagram.svg)
`));

    expect(imageSources.get('/photo.jpg')).toMatch(/^data:image\/jpeg;base64,/);
    expect(imageSources.get('/diagram.svg')).toMatch(/^data:image\/svg\+xml;base64,/);
  });

  it('omits successful responses with unsupported content types', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      headers: new Headers({ 'content-type': 'text/html' }),
      blob: async () => new Blob(['not an image'], { type: 'text/html' }),
    })));

    const imageSources = await prepareKnowledgePdfImages(parseKnowledgePdfBlocks('![HTML](/page.html)'));

    expect(imageSources.has('/page.html')).toBe(false);
  });

  it('omits successful WebP and GIF responses for the PDF renderer fallback', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => ({
      ok: true,
      status: 200,
      headers: new Headers({
        'content-type': url === '/animated.gif' ? 'image/gif' : 'image/webp',
      }),
      blob: async () => new Blob(['image bytes'], {
        type: url === '/animated.gif' ? 'image/gif' : 'image/webp',
      }),
    })));

    const imageSources = await prepareKnowledgePdfImages(parseKnowledgePdfBlocks(`
![WebP](/modern.webp)
![GIF](/animated.gif)
`));

    expect(imageSources.has('/modern.webp')).toBe(false);
    expect(imageSources.has('/animated.gif')).toBe(false);
  });

  it('omits images whose Data URL conversion fails', async () => {
    class FailingFileReader {
      result: string | null = null;
      error = new DOMException('Conversion failed.');
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      readAsDataURL() {
        this.onerror?.();
      }
    }

    vi.stubGlobal('FileReader', FailingFileReader);
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      headers: new Headers({ 'content-type': 'image/png' }),
      blob: async () => new Blob(['image bytes'], { type: 'image/png' }),
    })));

    const imageSources = await prepareKnowledgePdfImages(parseKnowledgePdfBlocks('![Fehler](/broken.png)'));

    expect(imageSources.has('/broken.png')).toBe(false);
  });

  it('omits image bodies that do not decode despite an image/png content type', async () => {
    class CorruptImage {
      private source = '';

      set src(value: string) {
        this.source = value;
      }

      decode() {
        return this.source.includes('bm90IGFuIGltYWdl')
          ? Promise.reject(new Error('Invalid image data.'))
          : Promise.resolve();
      }
    }

    vi.stubGlobal('Image', CorruptImage);
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      headers: new Headers({ 'content-type': 'image/png' }),
      blob: async () => new Blob(['not an image'], { type: 'image/png' }),
    })));

    const imageSources = await prepareKnowledgePdfImages(parseKnowledgePdfBlocks('![Kaputt](/corrupt.png)'));

    expect(imageSources.has('/corrupt.png')).toBe(false);
  });

  it('omits images whose fetches time out', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn((_url: string, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => reject(new DOMException('Timed out.', 'AbortError')));
    }));
    vi.stubGlobal('fetch', fetchMock);

    const imageSourcesPromise = prepareKnowledgePdfImages(parseKnowledgePdfBlocks('![Langsam](/slow.png)'));
    await vi.runAllTimersAsync();

    await expect(imageSourcesPromise).resolves.toEqual(new Map());
    expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(true);
  });

  it('omits images whose response body stalls past the fetch deadline', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => ({
      ok: true,
      headers: new Headers({ 'content-type': 'image/png' }),
      blob: () => new Promise<Blob>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new DOMException('Timed out.', 'AbortError')));
      }),
    }));
    vi.stubGlobal('fetch', fetchMock);

    const imageSourcesPromise = prepareKnowledgePdfImages(parseKnowledgePdfBlocks('![Langsam](/slow-body.png)'));
    await vi.runAllTimersAsync();

    await expect(imageSourcesPromise).resolves.toEqual(new Map());
    expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(true);
  });
});
