import { useQuery } from '@tanstack/react-query';

// Simple hash for caching
function hashCode(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

// Lazy load Shiki
let highlighterPromise: Promise<any> | null = null;

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki').then(async (shiki) => {
      return shiki.createHighlighter({
        themes: ['github-dark', 'github-light'],
        langs: ['typescript', 'javascript', 'tsx', 'jsx', 'json', 'html', 'css', 'bash', 'markdown'],
      });
    });
  }
  return highlighterPromise;
}

export async function highlightCode(
  code: string,
  lang: string,
  theme: 'dark' | 'light' = 'dark'
): Promise<string> {
  try {
    const highlighter = await getHighlighter();
    const themeName = theme === 'dark' ? 'github-dark' : 'github-light';
    
    // Validate language
    const supportedLangs = ['typescript', 'javascript', 'tsx', 'jsx', 'json', 'html', 'css', 'bash', 'markdown', 'text'];
    const safeLang = supportedLangs.includes(lang.toLowerCase()) ? lang.toLowerCase() : 'text';
    
    return highlighter.codeToHtml(code, {
      lang: safeLang,
      theme: themeName,
    });
  } catch (err) {
    console.error('Shiki highlighting error:', err);
    // Fallback to plain code
    return `<pre><code>${escapeHtml(code)}</code></pre>`;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Hook to get highlighted code with caching
 */
export function useHighlightedCode(
  code: string,
  lang: string,
  theme: 'dark' | 'light' = 'dark'
) {
  const hash = hashCode(`${code}:${lang}:${theme}`);
  
  return useQuery({
    queryKey: ['shikiHighlight', hash],
    queryFn: () => highlightCode(code, lang, theme),
    enabled: code.length > 0,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}
