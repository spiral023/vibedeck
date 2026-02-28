export type SearchDomain = 'blog' | 'knowledge';

export interface SearchDocument {
  id: string;
  domain: SearchDomain;
  path: string;
  title: string;
  description?: string;
  tags?: string[];
  author?: string;
  sourceType?: 'tweet' | 'blog' | 'thread' | 'docs';
  sourceDate?: string;
  addedDate?: string;
  keyPoints?: string[];
  searchText: string;
}

export interface SearchResult {
  item: SearchDocument;
  score: number;
}
