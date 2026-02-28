import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const rootDir = process.cwd();
const contentDirectories = [
  path.join(rootDir, 'src/content/blog'),
  path.join(rootDir, 'src/content/knowledge'),
];

function getTodayLocalIsoDate() {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toGitPath(filePath) {
  return path.relative(rootDir, filePath).split(path.sep).join('/');
}

function getAddedDateFromGit(filePath) {
  try {
    const output = execFileSync(
      'git',
      ['log', '--follow', '--diff-filter=A', '--format=%as', '--', toGitPath(filePath)],
      { cwd: rootDir, encoding: 'utf8' }
    );

    const dates = output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (dates.length === 0) {
      return null;
    }

    return dates[dates.length - 1];
  } catch {
    return null;
  }
}

function insertAddedDateFrontmatter(content, addedDate) {
  const lineEnding = content.includes('\r\n') ? '\r\n' : '\n';
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n)?/);

  if (!match) {
    return { changed: false, nextContent: content, reason: 'missing-frontmatter' };
  }

  const frontmatter = match[1];
  if (/^addedDate:/m.test(frontmatter)) {
    return { changed: false, nextContent: content, reason: 'already-has-addedDate' };
  }

  const addedDateLine = `addedDate: "${addedDate}"`;
  const nextFrontmatter = /^sourceDate:.*$/m.test(frontmatter)
    ? frontmatter.replace(/^sourceDate:.*$/m, (line) => `${line}${lineEnding}${addedDateLine}`)
    : `${frontmatter}${lineEnding}${addedDateLine}`;

  const nextHeader = `---${lineEnding}${nextFrontmatter}${lineEnding}---${lineEnding}`;
  const nextBody = content.slice(match[0].length);

  return { changed: true, nextContent: `${nextHeader}${nextBody}` };
}

function getMarkdownFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => path.join(directory, fileName));
}

function run() {
  const allFiles = contentDirectories.flatMap(getMarkdownFiles);
  const today = getTodayLocalIsoDate();
  let updatedCount = 0;
  let skippedCount = 0;

  for (const filePath of allFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const addedDate = getAddedDateFromGit(filePath) ?? today;
    const { changed, nextContent } = insertAddedDateFrontmatter(content, addedDate);

    if (!changed) {
      skippedCount += 1;
      continue;
    }

    fs.writeFileSync(filePath, nextContent, 'utf8');
    updatedCount += 1;
    console.log(`updated ${toGitPath(filePath)} -> ${addedDate}`);
  }

  console.log('');
  console.log(`done. updated=${updatedCount}, skipped=${skippedCount}, total=${allFiles.length}`);
}

run();
