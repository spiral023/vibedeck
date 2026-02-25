import { z } from 'zod';

export interface BlogArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  readTime: string;
  tags?: string[];
  sourceURL?: string;
  sourceType?: 'tweet' | 'blog' | 'thread' | 'docs';
  author?: string;
  sourceDate?: string;
  keyPoints?: string[];
  content: string;
}

export const BlogArticleSchema = z.object({
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
  keyPoints: z.array(z.string()).optional(),
  content: z.string(),
});
