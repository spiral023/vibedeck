import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { type Workflow, WorkflowFrontmatterSchema } from '@/types/prompt';

const workflowsDirectory = path.join(process.cwd(), 'src/content/workflows');

export function getAllWorkflows(): Workflow[] {
  if (!fs.existsSync(workflowsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(workflowsDirectory).filter(name => name.endsWith('.md'));
  const allWorkflows = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(workflowsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    // Validate frontmatter
    const parsedData = WorkflowFrontmatterSchema.safeParse({ id, ...matterResult.data });
    
    if (!parsedData.success) {
      console.error(`Invalid frontmatter for workflow ${id}:`, parsedData.error);
      return null;
    }

    return {
      ...parsedData.data,
      body: matterResult.content,
      updatedDate: parsedData.data.changelog?.[parsedData.data.changelog.length - 1]?.date || new Date().toISOString().split('T')[0],
    } as Workflow;
  }).filter((w): w is Workflow => w !== null);

  return allWorkflows.sort((a, b) => a.title.localeCompare(b.title));
}

export function getWorkflowById(id: string): Workflow | undefined {
  try {
    const fullPath = path.join(workflowsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const parsedData = WorkflowFrontmatterSchema.safeParse({ id, ...matterResult.data });

    if (!parsedData.success) {
       console.error(`Invalid frontmatter for workflow ${id}:`, parsedData.error);
       return undefined;
    }

    return {
      ...parsedData.data,
      body: matterResult.content,
       updatedDate: parsedData.data.changelog?.[parsedData.data.changelog.length - 1]?.date || new Date().toISOString().split('T')[0],
    } as Workflow;
  } catch (error) {
    return undefined;
  }
}
