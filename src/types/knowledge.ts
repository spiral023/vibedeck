import { z } from 'zod';

export interface KnowledgeArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string; // Name of the icon, mapped in client
  readTime: string;
  tags?: string[];
  sourceURL?: string;
  sourceType?: 'tweet' | 'blog' | 'thread' | 'docs';
  author?: string;
  sourceDate?: string;
  content: string; // Markdown content
}

export const KnowledgeArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  icon: z.string(),
  readTime: z.string(),
  tags: z.array(z.string()).optional(),
  sourceURL: z.string().optional(),
  sourceType: z.enum(['tweet', 'blog', 'thread', 'docs']).optional(),
  author: z.string().optional(),
  sourceDate: z.string().optional(),
  content: z.string(),
});
