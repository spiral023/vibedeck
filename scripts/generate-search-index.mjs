import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const rootDir = process.cwd();
const blogDir = path.join(rootDir, 'src/content/blog');
const knowledgeDir = path.join(rootDir, 'src/content/knowledge');
const outputPath = path.join(rootDir, 'public/search-index.json');

function normalizeStringArray(value) {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const normalized = value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);

  return normalized.length > 0 ? normalized : undefined;
}

function parseDocument(filePath, domain) {
  const id = path.basename(filePath, '.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(fileContents);
  const tags = normalizeStringArray(parsed.data.tags);
  const keyPoints = normalizeStringArray(parsed.data.keyPoints);
  const title = typeof parsed.data.title === 'string' ? parsed.data.title : id;

  return {
    id,
    domain,
    path: domain === 'blog' ? `/blog/${id}` : `/knowledge/${id}`,
    title,
    description: typeof parsed.data.description === 'string' ? parsed.data.description : undefined,
    tags,
    author: typeof parsed.data.author === 'string' ? parsed.data.author : undefined,
    sourceType: typeof parsed.data.sourceType === 'string' ? parsed.data.sourceType : undefined,
    sourceDate: typeof parsed.data.sourceDate === 'string' ? parsed.data.sourceDate : undefined,
    addedDate: typeof parsed.data.addedDate === 'string' ? parsed.data.addedDate : undefined,
    keyPoints,
  };
}

function readMarkdownFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => path.join(directory, fileName));
}

function run() {
  const blogFiles = readMarkdownFiles(blogDir);
  const knowledgeFiles = readMarkdownFiles(knowledgeDir);

  const documents = [
    ...blogFiles.map((filePath) => parseDocument(filePath, 'blog')),
    ...knowledgeFiles.map((filePath) => parseDocument(filePath, 'knowledge')),
  ].sort((a, b) => {
    if (a.domain !== b.domain) {
      return a.domain.localeCompare(b.domain);
    }
    return a.title.localeCompare(b.title);
  });

  fs.writeFileSync(outputPath, JSON.stringify(documents), 'utf8');

  console.log(`search index written: ${path.relative(rootDir, outputPath)} (${documents.length} documents)`);
}

run();
