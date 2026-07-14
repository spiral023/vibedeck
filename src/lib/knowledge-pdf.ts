import { removeVerbindungenSection } from './knowledge-connections';

export type KnowledgePdfBlock =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'unordered-list'; items: string[] }
  | { type: 'ordered-list'; items: string[] }
  | { type: 'blockquote'; text: string }
  | { type: 'code'; language?: string; text: string }
  | { type: 'image'; alt: string; src: string }
  | { type: 'dynamic-content-notice' };

export type KnowledgePdfInline = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  href?: string;
};

const HEADING_PATTERN = /^(#{1,6})\s+(.+?)\s*#*\s*$/;
const UNORDERED_LIST_PATTERN = /^[-*+]\s+(.+)$/;
const ORDERED_LIST_PATTERN = /^\d+[.)]\s+(.+)$/;
const QUOTE_PATTERN = /^>\s?(.*)$/;
const IMAGE_PATTERN = /^!\[([^\]]*)\]\(([^\s)]+)(?:\s+['"][^)]*['"])?\)$/;
const HORIZONTAL_RULE_PATTERN = /^([-*_])(?:\s*\1){2,}\s*$/;
const FENCED_CODE_PATTERN = /^```\s*([^`]*)\s*$/;
const INLINE_PATTERN = /\[([^\]]+)\]\(([^\s)]+)\)|\*\*([\s\S]+?)\*\*|\*([^*\n]+?)\*|`([^`\n]+?)`/g;
const IMAGE_FETCH_TIMEOUT_MS = 10_000;
const SUPPORTED_IMAGE_CONTENT_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/svg+xml',
]);

export function parseKnowledgePdfBlocks(content: string): KnowledgePdfBlock[] {
  const blocks: KnowledgePdfBlock[] = [];
  const lines = removeVerbindungenSection(content).split(/\r?\n/);
  let paragraphLines: string[] = [];
  let listType: 'unordered-list' | 'ordered-list' | undefined;
  let listItems: string[] = [];
  let quoteLines: string[] = [];
  let codeLanguage: string | undefined;
  let codeLines: string[] | undefined;

  const flushParagraph = () => {
    if (paragraphLines.length > 0) {
      blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') });
      paragraphLines = [];
    }
  };

  const flushList = () => {
    if (listType && listItems.length > 0) {
      blocks.push({ type: listType, items: listItems });
    }
    listType = undefined;
    listItems = [];
  };

  const flushQuote = () => {
    if (quoteLines.length > 0) {
      blocks.push({ type: 'blockquote', text: quoteLines.join(' ') });
      quoteLines = [];
    }
  };

  const flushText = () => {
    flushParagraph();
    flushList();
    flushQuote();
  };

  const flushCode = () => {
    if (!codeLines) {
      return;
    }

    if (codeLanguage?.toLowerCase() === 'mermaid') {
      blocks.push({ type: 'dynamic-content-notice' });
    } else {
      blocks.push({
        type: 'code',
        ...(codeLanguage ? { language: codeLanguage } : {}),
        text: codeLines.join('\n'),
      });
    }

    codeLanguage = undefined;
    codeLines = undefined;
  };

  for (const line of lines) {
    if (codeLines) {
      const closingFence = line.match(FENCED_CODE_PATTERN);
      if (closingFence) {
        flushCode();
      } else {
        codeLines.push(line);
      }
      continue;
    }

    const trimmed = line.trim();
    const fence = trimmed.match(FENCED_CODE_PATTERN);
    if (fence) {
      flushText();
      codeLanguage = fence[1]?.trim() || undefined;
      codeLines = [];
      continue;
    }

    if (!trimmed) {
      flushText();
      continue;
    }

    if (HORIZONTAL_RULE_PATTERN.test(trimmed)) {
      flushText();
      continue;
    }

    const heading = trimmed.match(HEADING_PATTERN);
    if (heading) {
      flushText();
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2].trim() });
      continue;
    }

    const image = trimmed.match(IMAGE_PATTERN);
    if (image) {
      flushText();
      blocks.push({ type: 'image', alt: image[1], src: image[2] });
      continue;
    }

    const unorderedListItem = trimmed.match(UNORDERED_LIST_PATTERN);
    if (unorderedListItem) {
      flushParagraph();
      flushQuote();
      if (listType && listType !== 'unordered-list') {
        flushList();
      }
      listType = 'unordered-list';
      listItems.push(unorderedListItem[1]);
      continue;
    }

    const orderedListItem = trimmed.match(ORDERED_LIST_PATTERN);
    if (orderedListItem) {
      flushParagraph();
      flushQuote();
      if (listType && listType !== 'ordered-list') {
        flushList();
      }
      listType = 'ordered-list';
      listItems.push(orderedListItem[1]);
      continue;
    }

    const quote = trimmed.match(QUOTE_PATTERN);
    if (quote) {
      flushParagraph();
      flushList();
      quoteLines.push(quote[1]);
      continue;
    }

    flushList();
    flushQuote();
    paragraphLines.push(trimmed);
  }

  if (codeLines) {
    flushCode();
  } else {
    flushText();
  }

  return blocks;
}

export function parseKnowledgePdfInline(value: string): KnowledgePdfInline[] {
  const tokens: KnowledgePdfInline[] = [];
  let lastIndex = 0;

  const appendText = (text: string, formatting: Omit<KnowledgePdfInline, 'text'> = {}) => {
    if (text) {
      tokens.push({ text, ...formatting });
    }
  };

  for (const match of value.matchAll(INLINE_PATTERN)) {
    appendText(value.slice(lastIndex, match.index));

    if (match[1] !== undefined) {
      appendText(match[1], { href: match[2] });
    } else if (match[3] !== undefined) {
      appendText(match[3], { bold: true });
    } else if (match[4] !== undefined) {
      appendText(match[4], { italic: true });
    } else {
      appendText(match[5], { code: true });
    }

    lastIndex = (match.index ?? 0) + match[0].length;
  }

  appendText(value.slice(lastIndex));
  return tokens;
}

export function createKnowledgePdfFilename(id: string): string {
  const filename = id
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/Ä/g, 'Ae')
    .replace(/Ö/g, 'Oe')
    .replace(/Ü/g, 'Ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  return `${filename || 'wissensartikel'}.pdf`;
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Image could not be converted to a data URL.'));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error('Image could not be read.'));
    reader.readAsDataURL(blob);
  });
}

function isSupportedImageResponse(response: Response): boolean {
  const contentType = response.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase();
  return contentType !== undefined && SUPPORTED_IMAGE_CONTENT_TYPES.has(contentType);
}

async function fetchSupportedImageBlob(src: string): Promise<Blob | undefined> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), IMAGE_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(src, { signal: controller.signal });
    if (controller.signal.aborted || !response.ok || !isSupportedImageResponse(response)) {
      return undefined;
    }

    const blob = await response.blob();
    return controller.signal.aborted ? undefined : blob;
  } finally {
    clearTimeout(timeoutId);
  }
}

function isDecodableImageDataUrl(dataUrl: string): Promise<boolean> {
  if (typeof Image === 'undefined') {
    return Promise.resolve(false);
  }

  const image = new Image();
  if (typeof image.decode === 'function') {
    image.src = dataUrl;
    return image.decode().then(() => true, () => false);
  }

  return new Promise((resolve) => {
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = dataUrl;
  });
}

export async function prepareKnowledgePdfImages(blocks: KnowledgePdfBlock[]): Promise<Map<string, string>> {
  const sources = [...new Set(blocks.flatMap((block) => (block.type === 'image' ? [block.src] : [])))];
  const imageSources = new Map<string, string>();

  await Promise.all(sources.map(async (src) => {
    try {
      const blob = await fetchSupportedImageBlob(src);
      if (!blob) {
        return;
      }

      const dataUrl = await blobToDataUrl(blob);
      if (await isDecodableImageDataUrl(dataUrl)) {
        imageSources.set(src, dataUrl);
      }
    } catch {
      // A missing or inaccessible image should not prevent PDF creation.
    }
  }));

  return imageSources;
}
