import type { CopyFormat } from '@/stores/history-store';

export interface CopyPayload {
  promptId: string;
  promptTitle: string;
  selectedVariant: 'beginner' | 'intermediate' | 'expert';
  resolvedVariables: Record<string, string>;
  resolvedPromptMarkdown: string;
  prePrompt?: string;
  createdAt: string;
}

/**
 * Strip Markdown formatting from text.
 * Handles code blocks, inline code, links, images, headers, bold, italic, etc.
 */
export function stripMarkdown(md: string): string {
  let text = md;
  
  // Remove code blocks but keep content
  text = text.replace(/```[\s\S]*?```/g, (match) => {
    const lines = match.split('\n');
    // Remove first line (```lang) and last line (```)
    return lines.slice(1, -1).join('\n');
  });
  
  // Remove inline code backticks
  text = text.replace(/`([^`]+)`/g, '$1');
  
  // Remove images
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');
  
  // Remove links but keep text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Remove headers
  text = text.replace(/^#{1,6}\s+/gm, '');
  
  // Remove bold/italic
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/__([^_]+)__/g, '$1');
  text = text.replace(/_([^_]+)_/g, '$1');
  
  // Remove blockquotes
  text = text.replace(/^>\s+/gm, '');
  
  // Remove horizontal rules
  text = text.replace(/\n^[-*_]{3,}$\n?/gm, '\n');
  
  // Remove list markers
  text = text.replace(/^\s*[-*+]\s+/gm, '');
  text = text.replace(/^\s*\d+\.\s+/gm, '');
  
  // Clean up extra whitespace
  text = text.replace(/\n{3,}/g, '\n\n').trim();
  
  return text;
}

/**
 * Format content for copying based on format type
 */
export function formatForCopy(
  format: CopyFormat,
  content: string,
  payload?: Partial<CopyPayload>
): string {
  switch (format) {
    case 'chat_markdown':
      return content;
      
    case 'json':
      return JSON.stringify(
        {
          promptId: payload?.promptId,
          promptTitle: payload?.promptTitle,
          selectedVariant: payload?.selectedVariant,
          resolvedVariables: payload?.resolvedVariables,
          resolvedPromptMarkdown: content,
          prePrompt: payload?.prePrompt,
          createdAt: new Date().toISOString(),
        },
        null,
        2
      );
      
    case 'raw_text':
      return stripMarkdown(content);
      
    default:
      return content;
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

/**
 * Format labels for UI (German)
 */
export const copyFormatLabels: Record<CopyFormat, string> = {
  chat_markdown: 'Für Chat (Markdown)',
  json: 'Als JSON (API)',
  raw_text: 'Nur Text',
};
