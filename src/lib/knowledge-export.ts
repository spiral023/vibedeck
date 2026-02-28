import type { KnowledgeArticle } from '@/types/knowledge';

const formatYamlString = (value: string) => {
  const sanitized = value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');

  return `"${sanitized}"`;
};

const formatYamlArray = (values: string[]) => `[${values.map((value) => formatYamlString(value)).join(', ')}]`;

export const formatKnowledgeArticleMarkdown = (article: KnowledgeArticle) => {
  const lines: string[] = [
    `title: ${formatYamlString(article.title)}`,
    `description: ${formatYamlString(article.description)}`,
    `category: ${formatYamlString(article.category)}`,
    `icon: ${formatYamlString(article.icon)}`,
    `readTime: ${typeof article.readTime === 'number' ? article.readTime : formatYamlString(article.readTime)}`,
  ];

  if (article.tags && article.tags.length > 0) {
    lines.push(`tags: ${formatYamlArray(article.tags)}`);
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

  if (!body) {
    return frontmatter;
  }

  return `${frontmatter}\n\n${body}`;
};

export const formatKnowledgeCollectionMarkdown = (articles: KnowledgeArticle[]) => {
  return articles.map((article) => formatKnowledgeArticleMarkdown(article)).join('\n\n\n');
};
