import { getAllKnowledgeArticles } from '@/lib/knowledge';
import { getAllBlogArticles } from '@/lib/blog';
import { SettingsClient } from './client';

export default function SettingsPage() {
  const knowledgeArticles = getAllKnowledgeArticles();
  const blogArticles = getAllBlogArticles();

  return (
    <SettingsClient
      knowledgeArticles={knowledgeArticles}
      blogArticles={blogArticles}
    />
  );
}
