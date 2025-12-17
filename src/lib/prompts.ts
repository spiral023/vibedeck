import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Prompt, Category } from '@/types/prompt';

const promptsDirectory = path.join(process.cwd(), 'src/content/prompts');

export function getAllPrompts(): Prompt[] {
  // Ensure directory exists to avoid errors in empty/new setups
  if (!fs.existsSync(promptsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(promptsDirectory);
  const allPromptsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(promptsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...(matterResult.data as Omit<Prompt, 'id' | 'body'>),
      body: matterResult.content,
    } as Prompt;
  });

  return allPromptsData;
}

export function getPromptById(id: string): Prompt | undefined {
  try {
    const fullPath = path.join(promptsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      id,
      ...(matterResult.data as Omit<Prompt, 'id' | 'body'>),
      body: matterResult.content,
    } as Prompt;
  } catch (error) {
    return undefined;
  }
}

export function getPromptIndex(): Prompt[] {
  const prompts = getAllPrompts();
  return prompts.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.title.localeCompare(b.title);
  });
}

export function getAllTags(): string[] {
  const prompts = getAllPrompts();
  const tags = new Set<string>();
  prompts.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}

export function getAllCategories(): Category[] {
  return ['Build', 'Browse', 'Ship', 'Learn'];
}
