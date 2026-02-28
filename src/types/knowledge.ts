import { z } from 'zod';

export interface KnowledgeArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string; // Name of the icon, mapped in client
  readTime: string | number;
  tags?: string[];
  aliases?: string[]; // Obsidian alias support
  topics?: string[]; // Obsidian topic links
  type?: 'source' | 'concept'; // Obsidian note type
  status?: 'seed' | 'incubating' | 'evergreen' | 'archived'; // Obsidian note status
  up?: string; // Obsidian parent link
  sourceURL?: string;
  sourceType?: 'tweet' | 'blog' | 'thread' | 'docs';
  author?: string;
  sourceDate?: string;
  addedDate?: string;
  content: string; // Markdown content
  level?: 'beginner' | 'intermediate' | 'advanced';
  hot?: boolean;
}

export const KnowledgeArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  icon: z.string(),
  readTime: z.union([z.string(), z.number()]),
  tags: z.array(z.string()).optional(),
  aliases: z.array(z.string()).optional(),
  topics: z.array(z.string()).optional(),
  type: z.enum(['source', 'concept']).optional(),
  status: z.enum(['seed', 'incubating', 'evergreen', 'archived']).optional(),
  up: z.string().optional(),
  sourceURL: z.string().optional(),
  sourceType: z.enum(['tweet', 'blog', 'thread', 'docs']).optional(),
  author: z.string().optional(),
  sourceDate: z.string().optional(),
  addedDate: z.string().optional(),
  content: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  hot: z.boolean().optional(),
});
