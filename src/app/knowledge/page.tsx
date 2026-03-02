import { Suspense } from 'react';
import { getAllKnowledgeArticles } from '@/lib/knowledge';
import { KnowledgeClient } from './client';

export default function KnowledgePage() {
  const articles = getAllKnowledgeArticles();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KnowledgeClient articles={articles} />
    </Suspense>
  );
}
