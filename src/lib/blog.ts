import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { type BlogArticle } from '@/types/blog';
import { normalizeBlogTags } from '@/lib/blog-tags';
import { extractConnectionsFromVerbindungenSection } from '@/lib/knowledge-connections';

const blogDirectory = path.join(process.cwd(), 'src/content/blog');

function getTimestamp(dateString?: string): number {
  if (!dateString) {
    return 0;
  }

  const timestamp = new Date(dateString).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function normalizeArrayValue(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const normalized = value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);

  return normalized.length > 0 ? normalized : undefined;
}

export function getAllBlogArticles(): BlogArticle[] {
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(blogDirectory);
  const allArticles = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(blogDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);
      const tags = normalizeBlogTags(normalizeArrayValue(matterResult.data.tags));
      const keyPoints = normalizeArrayValue(matterResult.data.keyPoints)?.slice(0, 3);
      const connections = extractConnectionsFromVerbindungenSection(matterResult.content);

      return {
        id,
        ...matterResult.data,
        tags,
        connections,
        keyPoints,
        content: matterResult.content,
      } as BlogArticle;
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

export function getBlogArticle(id: string): BlogArticle | null {
  const fullPath = path.join(blogDirectory, `${id}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  const connections = extractConnectionsFromVerbindungenSection(matterResult.content);

  return {
    id,
    ...matterResult.data,
    tags: normalizeBlogTags(normalizeArrayValue(matterResult.data.tags)),
    connections,
    keyPoints: normalizeArrayValue(matterResult.data.keyPoints)?.slice(0, 3),
    content: matterResult.content,
  } as BlogArticle;
}
