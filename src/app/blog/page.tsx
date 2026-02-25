import { Suspense } from 'react';
import { getAllBlogArticles } from '@/lib/blog';
import { BlogClient } from './client';

export default function BlogPage() {
  const articles = getAllBlogArticles();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogClient articles={articles} />
    </Suspense>
  );
}
