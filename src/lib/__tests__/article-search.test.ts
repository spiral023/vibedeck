import { describe, expect, it } from 'vitest';
import { createSearchFuse, searchDocuments } from '@/lib/article-search';
import { type SearchDocument } from '@/types/search';

const docs: SearchDocument[] = [
  {
    id: 'knowledge-1',
    domain: 'knowledge',
    path: '/knowledge/knowledge-1',
    title: 'Agentic Search Patterns',
    description: 'Titel enthält das Schlüsselwort.',
    tags: ['search', 'agents'],
    keyPoints: ['Relevanz', 'Ranking'],
    searchText: 'this article explains search ranking strategies for ai agents',
  },
  {
    id: 'blog-1',
    domain: 'blog',
    path: '/blog/blog-1',
    title: 'Indexing at Scale',
    description: 'Das Keyword steht nur im Body.',
    tags: ['infra'],
    searchText: 'we discuss advanced agentic execution and orchestration in depth',
  },
  {
    id: 'blog-2',
    domain: 'blog',
    path: '/blog/blog-2',
    title: 'Unrelated Title',
    description: 'Ohne Treffer',
    tags: ['misc'],
    searchText: 'completely unrelated content',
  },
];

describe('article-search', () => {
  it('finds body-only matches', () => {
    const fuse = createSearchFuse(docs);
    const results = searchDocuments(fuse, 'orchestration');

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].item.id).toBe('blog-1');
  });

  it('ranks metadata title hits above metadata description-only hits when searchText is missing', () => {
    const metadataOnlyDocs: SearchDocument[] = [
      {
        id: 'title-hit',
        domain: 'knowledge',
        path: '/knowledge/title-hit',
        title: 'Agentic Search Patterns',
        description: 'No description match',
        tags: ['infra'],
      },
      {
        id: 'description-hit',
        domain: 'blog',
        path: '/blog/description-hit',
        title: 'Unrelated',
        description: 'Agentic Search Patterns',
        tags: ['infra'],
      },
    ];
    const fuse = createSearchFuse(metadataOnlyDocs);
    const results = searchDocuments(fuse, 'agentic search patterns');

    const titleHit = results.find((result) => result.item.id === 'title-hit');
    const descriptionHit = results.find((result) => result.item.id === 'description-hit');

    expect(titleHit).toBeDefined();
    expect(descriptionHit).toBeDefined();
    expect((titleHit?.score ?? 1) < (descriptionHit?.score ?? 1)).toBe(true);
  });

  it('finds matches when searchText is missing', () => {
    const metadataOnlyDocs: SearchDocument[] = [
      {
        id: 'knowledge-meta',
        domain: 'knowledge',
        path: '/knowledge/knowledge-meta',
        title: 'Distributed Systems',
        description: 'Deep dive into orchestration',
        tags: ['infra', 'systems'],
      },
      {
        id: 'blog-meta',
        domain: 'blog',
        path: '/blog/blog-meta',
        title: 'Completely unrelated',
        description: 'No overlap',
        tags: ['misc'],
      },
    ];
    const fuse = createSearchFuse(metadataOnlyDocs);
    const results = searchDocuments(fuse, 'orchestration');

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].item.id).toBe('knowledge-meta');
  });

  it('supports fuzzy matching for minor typos', () => {
    const fuse = createSearchFuse(docs);
    const results = searchDocuments(fuse, 'agentc');

    expect(results.some((result) => result.item.id === 'knowledge-1')).toBe(true);
  });

  it('returns no ranking results for empty query', () => {
    const fuse = createSearchFuse(docs);
    const results = searchDocuments(fuse, '');

    expect(results).toEqual([]);
  });
});
