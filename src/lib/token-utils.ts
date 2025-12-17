import { useQuery } from '@tanstack/react-query';
import { useMemo, useState, useEffect } from 'react';

// Model pricing per 1M tokens (input/output in USD)
export const MODEL_PRICING: Record<string, { input: number; output: number; name: string }> = {
  'gpt-4o': { input: 2.5, output: 10, name: 'GPT-4o' },
  'gpt-4o-mini': { input: 0.15, output: 0.6, name: 'GPT-4o Mini' },
  'gpt-4-turbo': { input: 10, output: 30, name: 'GPT-4 Turbo' },
  'claude-3.5-sonnet': { input: 3, output: 15, name: 'Claude 3.5 Sonnet' },
  'claude-3-opus': { input: 15, output: 75, name: 'Claude 3 Opus' },
  'gemini-pro': { input: 0.5, output: 1.5, name: 'Gemini Pro' },
};

// Simple hash function for caching
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

// Lazy load tokenizer
let tokenizerPromise: Promise<typeof import('gpt-tokenizer')> | null = null;

async function getTokenizer() {
  if (!tokenizerPromise) {
    tokenizerPromise = import('gpt-tokenizer');
  }
  return tokenizerPromise;
}

export async function countTokens(text: string): Promise<number> {
  const tokenizer = await getTokenizer();
  return tokenizer.encode(text).length;
}

/**
 * Hook to get token count with caching and debouncing
 */
export function useTokenCount(text: string, debounceMs = 300) {
  const [debouncedText, setDebouncedText] = useState(text);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedText(text), debounceMs);
    return () => clearTimeout(timer);
  }, [text, debounceMs]);
  
  const hash = useMemo(() => hashString(debouncedText), [debouncedText]);
  
  return useQuery({
    queryKey: ['tokenCount', hash],
    queryFn: () => countTokens(debouncedText),
    enabled: debouncedText.length > 0,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Calculate estimated cost
 */
export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  modelId: string
): number {
  const pricing = MODEL_PRICING[modelId];
  if (!pricing) return 0;
  
  const inputCost = (inputTokens / 1_000_000) * pricing.input;
  const outputCost = (outputTokens / 1_000_000) * pricing.output;
  
  return inputCost + outputCost;
}

/**
 * Format cost for display (de-DE locale)
 */
export function formatCost(cost: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  }).format(cost);
}

/**
 * Format number with de-DE locale
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('de-DE').format(num);
}
