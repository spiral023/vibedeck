import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { type HelpTemplate } from '@/types/help';

const helpDirectory = path.join(process.cwd(), 'src/content/help');

export function getAllHelpTemplates(): HelpTemplate[] {
  if (!fs.existsSync(helpDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(helpDirectory);
  const allTemplates = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(helpDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    // We trust the structure for now, but in prod we should use Zod like for workflows
    return {
      id,
      ...matterResult.data,
      template: matterResult.content, // The markdown body IS the template
    } as HelpTemplate;
  });

  return allTemplates.sort((a, b) => a.title.localeCompare(b.title));
}

export function getHelpTemplateById(id: string): HelpTemplate | undefined {
  try {
    const fullPath = path.join(helpDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      id,
      ...matterResult.data,
      template: matterResult.content,
    } as HelpTemplate;
  } catch (error) {
    return undefined;
  }
}

export function getHelpTemplateIndex(): HelpTemplate[] {
  return getAllHelpTemplates();
}
