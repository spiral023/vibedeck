import { notFound } from 'next/navigation';
import { getKnowledgeArticle, getAllKnowledgeArticles } from '@/lib/knowledge';
import { ArticleView } from './client';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export function generateStaticParams() {
  const articles = getAllKnowledgeArticles();
  return articles.map((article) => ({
    id: article.id,
  }));
}

export default async function ArticlePage(props: PageProps) {
  const params = await props.params;
  const article = getKnowledgeArticle(params.id);

  if (!article) {
    notFound();
  }

  return <ArticleView article={article} />;
}
