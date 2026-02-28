import type { BlogArticle } from '@/types/blog';

const formatYamlString = (value: string) => {
  const sanitized = value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');

  return `"${sanitized}"`;
};

const formatYamlArray = (values: string[]) => `[${values.map((value) => formatYamlString(value)).join(', ')}]`;

export const formatBlogArticleMarkdown = (article: BlogArticle) => {
  const lines: string[] = [
    `title: ${formatYamlString(article.title)}`,
    `description: ${formatYamlString(article.description)}`,
    `category: ${formatYamlString(article.category)}`,
    `icon: ${formatYamlString(article.icon)}`,
    `readTime: ${formatYamlString(article.readTime)}`,
  ];

  if (article.tags && article.tags.length > 0) {
    lines.push(`tags: ${formatYamlArray(article.tags)}`);
  }

  if (article.keyPoints && article.keyPoints.length > 0) {
    lines.push('keyPoints:');
    article.keyPoints.slice(0, 3).forEach((point) => {
      lines.push(`  - ${formatYamlString(point)}`);
    });
  }

  if (article.sourceURL) {
    lines.push(`sourceURL: ${formatYamlString(article.sourceURL)}`);
  }
  if (article.sourceType) {
    lines.push(`sourceType: ${formatYamlString(article.sourceType)}`);
  }
  if (article.author) {
    lines.push(`author: ${formatYamlString(article.author)}`);
  }
  if (article.sourceDate) {
    lines.push(`sourceDate: ${formatYamlString(article.sourceDate)}`);
  }
  if (article.addedDate) {
    lines.push(`addedDate: ${formatYamlString(article.addedDate)}`);
  }

  const frontmatter = ['---', ...lines, '---'].join('\n');
  const body = article.content.trim();
  return body ? `${frontmatter}\n\n${body}` : frontmatter;
};

export const formatBlogCollectionMarkdown = (articles: BlogArticle[]) => {
  return articles.map((article) => formatBlogArticleMarkdown(article)).join('\n\n\n');
};
