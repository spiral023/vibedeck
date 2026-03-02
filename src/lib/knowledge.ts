import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { type KnowledgeArticle } from '@/types/knowledge';
import { extractKnowledgeConnections } from '@/lib/knowledge-connections';

const knowledgeDirectory = path.join(process.cwd(), 'src/content/knowledge');

function getTimestamp(dateString?: string): number {
  if (!dateString) {
    return 0;
  }

  const timestamp = new Date(dateString).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

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
      const connections = extractKnowledgeConnections({
        content: matterResult.content,
        topics: Array.isArray(matterResult.data.topics) ? matterResult.data.topics : undefined,
      });

      return {
        id,
        ...matterResult.data,
        connections,
        content: matterResult.content,
      } as KnowledgeArticle;
    });

  return allArticles.sort((a, b) => {
    const addedDiff = getTimestamp(b.addedDate) - getTimestamp(a.addedDate);
    if (addedDiff !== 0) {
      return addedDiff;
    }

    const sourceDiff = getTimestamp(b.sourceDate) - getTimestamp(a.sourceDate);
    if (sourceDiff !== 0) {
      return sourceDiff;
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
  const connections = extractKnowledgeConnections({
    content: matterResult.content,
    topics: Array.isArray(matterResult.data.topics) ? matterResult.data.topics : undefined,
  });

  return {
    id,
    ...matterResult.data,
    connections,
    content: matterResult.content,
  } as KnowledgeArticle;
}
