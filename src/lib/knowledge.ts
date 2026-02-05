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
    if (a.sourceDate || b.sourceDate) {
      const dateA = a.sourceDate ? new Date(a.sourceDate).getTime() : 0;
      const dateB = b.sourceDate ? new Date(b.sourceDate).getTime() : 0;
      if (dateA !== dateB) {
        return dateB - dateA;
      }
    }
    return a.title.localeCompare(b.title);
  });
}

export function getKnowledgeArticle(id: string): KnowledgeArticle | null {
  const fullPath = path.join(knowledgeDirectory, `${id}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  return {
    id,
    ...matterResult.data,
    content: matterResult.content,
  } as KnowledgeArticle;
}
