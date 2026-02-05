import { getAllKnowledgeArticles } from '@/lib/knowledge';
import { formatKnowledgeCollectionMarkdown } from '@/lib/knowledge-export';
import { SettingsClient } from './client';

export default function SettingsPage() {
  const articles = getAllKnowledgeArticles();
  const knowledgeExport = formatKnowledgeCollectionMarkdown(articles);

  return (
    <SettingsClient
      knowledgeExport={knowledgeExport}
      knowledgeCount={articles.length}
    />
  );
}
