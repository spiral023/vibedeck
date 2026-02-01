import { z } from 'zod';

export interface KnowledgeArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string; // Name of the icon, mapped in client
  readTime: string;
  content: string; // Markdown content
}

export const KnowledgeArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  icon: z.string(),
  readTime: z.string(),
  content: z.string(),
});
