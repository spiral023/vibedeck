import { getAllBlogArticles } from '@/lib/blog';
import { getAllKnowledgeArticles } from '@/lib/knowledge';
import { uiLibraries } from '@/data/ui-libraries';
import { githubRepos } from '@/data/github-repos';
import HomePageClient from './client-page';

export default function HomePage() {
  const knowledgeArticles = getAllKnowledgeArticles();
  const blogArticles = getAllBlogArticles();

  return (
    <HomePageClient
      knowledgeCount={knowledgeArticles.length}
      blogCount={blogArticles.length}
      uiLibraryCount={uiLibraries.length}
      githubRepoCount={githubRepos.length}
    />
  );
}
