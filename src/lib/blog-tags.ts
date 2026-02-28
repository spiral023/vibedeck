export const BLOG_TAG_DEFINITIONS = [
  { id: 'agenten-engineering', label: 'Agenten-Engineering' },
  { id: 'coding-workflows', label: 'Coding-Workflows' },
  { id: 'modelle-tools', label: 'Modelle & Tools' },
  { id: 'kontext-prompting', label: 'Kontext & Prompting' },
  { id: 'unternehmen-adoption', label: 'Unternehmen & Adoption' },
  { id: 'strategie-fuehrung', label: 'Strategie & Führung' },
  { id: 'arbeitswelt', label: 'Arbeitswelt' },
  { id: 'oekonomie-maerkte', label: 'Ökonomie & Märkte' },
  { id: 'evaluation-benchmarks', label: 'Evaluation & Benchmarks' },
  { id: 'fallstudien', label: 'Fallstudien' },
] as const;

const BLOG_TAG_LABELS: Record<string, string> = Object.fromEntries(
  BLOG_TAG_DEFINITIONS.map((definition) => [definition.id, definition.label])
);

export const LEGACY_BLOG_TAG_MAP: Record<string, string> = {
  'agentic-coding': 'agenten-engineering',
  'agentic-engineering': 'agenten-engineering',
  'coding-agents': 'agenten-engineering',
  'agent-design': 'agenten-engineering',
  'agent-governance': 'agenten-engineering',
  'agent-teams': 'agenten-engineering',
  'agentic-workflows': 'agenten-engineering',
  'autonomous-systems': 'agenten-engineering',
  'background-agents': 'agenten-engineering',
  'self-driving-codebase': 'agenten-engineering',
  'tool-calling': 'agenten-engineering',
  orchestration: 'agenten-engineering',
  'progressive-disclosure': 'agenten-engineering',
  elicitation: 'agenten-engineering',
  'developer-workflow': 'coding-workflows',
  'developer-productivity': 'coding-workflows',
  'software-delivery': 'coding-workflows',
  workflow: 'coding-workflows',
  'product-velocity': 'coding-workflows',
  execution: 'coding-workflows',
  'iteration-speed': 'coding-workflows',
  distribution: 'coding-workflows',
  'ai-productivity': 'coding-workflows',
  'ai-coding': 'coding-workflows',
  'claude-code': 'modelle-tools',
  codex: 'modelle-tools',
  'gpt-5.2': 'modelle-tools',
  'gpt-5.21': 'modelle-tools',
  anthropic: 'modelle-tools',
  compiler: 'modelle-tools',
  'context-engineering': 'kontext-prompting',
  'intent-engineering': 'kontext-prompting',
  prompting: 'kontext-prompting',
  'enterprise-ai': 'unternehmen-adoption',
  'ai-adoption': 'unternehmen-adoption',
  'ai-native': 'unternehmen-adoption',
  infrastructure: 'unternehmen-adoption',
  'platform-engineering': 'unternehmen-adoption',
  'ai-strategy': 'strategie-fuehrung',
  'builder-mindset': 'strategie-fuehrung',
  leadership: 'strategie-fuehrung',
  'soft-skills': 'strategie-fuehrung',
  'future-of-work': 'arbeitswelt',
  layoffs: 'arbeitswelt',
  'ai-economics': 'oekonomie-maerkte',
  macro: 'oekonomie-maerkte',
  'capital-markets': 'oekonomie-maerkte',
  'agentic-commerce': 'oekonomie-maerkte',
  'ai-evaluation': 'evaluation-benchmarks',
  'time-horizons': 'evaluation-benchmarks',
  metr: 'evaluation-benchmarks',
  'andrej-karpathy': 'fallstudien',
  'jack-dorsey': 'fallstudien',
  block: 'fallstudien',
  spotify: 'fallstudien',
};

const BLOG_TAG_IDS: Set<string> = new Set(BLOG_TAG_DEFINITIONS.map((definition) => definition.id));

export function normalizeBlogTags(tags?: string[]): string[] | undefined {
  if (!tags || tags.length === 0) {
    return undefined;
  }

  const normalized = tags
    .map((tag) => {
      const trimmed = tag.trim();
      if (!trimmed) {
        return null;
      }
      if (BLOG_TAG_IDS.has(trimmed)) {
        return trimmed;
      }
      const mapped = LEGACY_BLOG_TAG_MAP[trimmed];
      return mapped && BLOG_TAG_IDS.has(mapped) ? mapped : null;
    })
    .filter((tag): tag is string => Boolean(tag));

  return normalized.length > 0 ? Array.from(new Set(normalized)) : undefined;
}

export function getBlogTagLabel(tag: string): string {
  return BLOG_TAG_LABELS[tag] ?? tag;
}
