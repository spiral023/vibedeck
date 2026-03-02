import { getAllBlogArticles } from '@/lib/blog';
import { getAllKnowledgeArticles } from '@/lib/knowledge';
import { sumReadTimes } from '@/lib/read-time';
import { uiLibraries } from '@/data/ui-libraries';
import { githubRepos } from '@/data/github-repos';
import HomePageClient from './client-page';

export default function HomePage() {
  const knowledgeArticles = getAllKnowledgeArticles();
  const blogArticles = getAllBlogArticles();
  const knowledgeReadTimeMinutes = sumReadTimes(knowledgeArticles.map((article) => article.readTime));
  const blogReadTimeMinutes = sumReadTimes(blogArticles.map((article) => article.readTime));
  const knowledgeReadTimeEntries = knowledgeArticles.map((article) => ({
    id: article.id,
    readTime: article.readTime,
  }));
  const blogReadTimeEntries = blogArticles.map((article) => ({
    id: article.id,
    readTime: article.readTime,
  }));

  return (
    <HomePageClient
      knowledgeCount={knowledgeArticles.length}
      blogCount={blogArticles.length}
      knowledgeReadTimeMinutes={knowledgeReadTimeMinutes}
      blogReadTimeMinutes={blogReadTimeMinutes}
      knowledgeReadTimeEntries={knowledgeReadTimeEntries}
      blogReadTimeEntries={blogReadTimeEntries}
      uiLibraryCount={uiLibraries.length}
      githubRepoCount={githubRepos.length}
    />
  );
}
