import { notFound } from 'next/navigation';
import { getAllBlogArticles, getBlogArticle } from '@/lib/blog';
import { BlogArticleView } from './client';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export function generateStaticParams() {
  const articles = getAllBlogArticles();
  return articles.map((article) => ({
    id: article.id,
  }));
}

export default async function BlogArticlePage(props: PageProps) {
  const params = await props.params;
  const article = getBlogArticle(params.id);

  if (!article) {
    notFound();
  }

  return <BlogArticleView article={article} />;
}
