/**
 * Pattern to match placeholders like {{variable_name}}
 */
export const PLACEHOLDER_PATTERN = /\{\{([^}]+)\}\}/g;

/**
 * Extract all placeholder names from text
 */
export function extractPlaceholders(text: string): string[] {
  const matches = text.matchAll(PLACEHOLDER_PATTERN);
  return [...new Set([...matches].map((m) => m[1].trim()))];
}

/**
 * Check if a placeholder is resolved (has a non-empty value)
 */
export function isPlaceholderResolved(
  placeholder: string,
  values: Record<string, string>
): boolean {
  const value = values[placeholder];
  return value !== undefined && value.trim() !== '';
}

/**
 * Resolve placeholders in text with given values
 */
export function resolvePlaceholders(
  text: string,
  values: Record<string, string>
): string {
  return text.replace(PLACEHOLDER_PATTERN, (match, name) => {
    const trimmedName = name.trim();
    const value = values[trimmedName];
    return value !== undefined && value.trim() !== '' ? value : match;
  });
}

/**
 * Get unresolved placeholders
 */
export function getUnresolvedPlaceholders(
  text: string,
  values: Record<string, string>
): string[] {
  const placeholders = extractPlaceholders(text);
  return placeholders.filter((p) => !isPlaceholderResolved(p, values));
}

/**
 * Split text into segments for highlighting
 */
export interface TextSegment {
  type: 'text' | 'placeholder_resolved' | 'placeholder_unresolved';
  content: string;
  placeholder?: string;
}

export function segmentText(
  text: string,
  values: Record<string, string>
): TextSegment[] {
  const segments: TextSegment[] = [];
  let lastIndex = 0;
  
  const regex = new RegExp(PLACEHOLDER_PATTERN);
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    // Add text before placeholder
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: text.slice(lastIndex, match.index),
      });
    }
    
    const placeholder = match[1].trim();
    const isResolved = isPlaceholderResolved(placeholder, values);
    
    segments.push({
      type: isResolved ? 'placeholder_resolved' : 'placeholder_unresolved',
      content: isResolved ? values[placeholder] : match[0],
      placeholder,
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.slice(lastIndex),
    });
  }
  
  return segments;
}
