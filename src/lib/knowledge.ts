import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { type KnowledgeArticle } from '@/types/knowledge';

const knowledgeDirectory = path.join(process.cwd(), 'src/content/knowledge');

export function getAllKnowledgeArticles(): KnowledgeArticle[] {
  if (!fs.existsSync(knowledgeDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(knowledgeDirectory);
  const allArticles = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(knowledgeDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        id,
        ...matterResult.data,
        content: matterResult.content,
      } as KnowledgeArticle;
    });

  return allArticles.sort((a, b) => {
    // Optional: Sort by date if added, or title, or just keep default order
    // For now let's sort by title
    return a.title.localeCompare(b.title);
  });
}
