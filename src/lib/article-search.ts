import Fuse from 'fuse.js';
import { type SearchDocument, type SearchResult } from '@/types/search';

export type SearchFuse = Fuse<SearchDocument>;

export function normalizeSearchInput(query: string): string {
  return query.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function createSearchFuse(documents: SearchDocument[]): SearchFuse {
  return new Fuse(documents, {
    includeScore: true,
    threshold: 0.28,
    ignoreLocation: true,
    minMatchCharLength: 2,
    keys: [
      { name: 'title', weight: 0.35 },
      { name: 'tags', weight: 0.18 },
      { name: 'description', weight: 0.17 },
      { name: 'keyPoints', weight: 0.1 },
      { name: 'author', weight: 0.05 },
      { name: 'sourceType', weight: 0.03 },
      { name: 'searchText', weight: 0.12 },
    ],
  });
}

export function searchDocuments(fuse: SearchFuse, query: string, limit?: number): SearchResult[] {
  const normalizedQuery = normalizeSearchInput(query);
  if (!normalizedQuery) {
    return [];
  }

  const results = fuse.search(normalizedQuery, limit ? { limit } : undefined);

  return results
    .map((result) => ({
      item: result.item,
      score: result.score ?? 1,
    }))
    .sort((a, b) => a.score - b.score);
}
