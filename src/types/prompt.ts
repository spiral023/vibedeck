import { z } from 'zod';

export const CategorySchema = z.enum(['Build', 'Browse', 'Ship', 'Learn']);
export type Category = z.infer<typeof CategorySchema>;

export const ComplexitySchema = z.enum(['beginner', 'intermediate', 'expert']);
export type Complexity = z.infer<typeof ComplexitySchema>;

export const VariableSchema = z.object({
  name: z.string(),
  label: z.string(),
  default: z.string().optional(),
});
export type Variable = z.infer<typeof VariableSchema>;

export const ChangelogEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  note: z.string(),
});
export type ChangelogEntry = z.infer<typeof ChangelogEntrySchema>;

export const VariantsSchema = z.object({
  default: z.string(),
  beginner: z.string().optional(),
  expert: z.string().optional(),
});
export type Variants = z.infer<typeof VariantsSchema>;

export const PromptFrontmatterSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: CategorySchema,
  tags: z.array(z.string()),
  related_prompts: z.array(z.string()).default([]),
  dependencies: z.array(z.string()).default([]),
  complexity: ComplexitySchema,
  agent_role: z.string().optional(),
  variables: z.array(VariableSchema).default([]),
  global_variable_refs: z.array(z.string()).optional(),
  changelog: z.array(ChangelogEntrySchema).default([]),
  pre_prompt: z.string(),
  variants: VariantsSchema,
});
export type PromptFrontmatter = z.infer<typeof PromptFrontmatterSchema>;

export interface Prompt extends PromptFrontmatter {
  body: string;
  shortExcerpt: string;
  updatedDate: string;
}

export interface PromptIndexItem {
  id: string;
  title: string;
  category: Category;
  tags: string[];
  complexity: Complexity;
  dependencies: string[];
  updatedDate: string;
  shortExcerpt: string;
}

// Workflow types
export const WorkflowStepSchema = z.object({
  order: z.number(),
  title: z.string(),
  promptRef: z.string().optional(),
  description: z.string(),
});

export const WorkflowFrontmatterSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: CategorySchema,
  tags: z.array(z.string()),
  steps: z.array(WorkflowStepSchema),
  changelog: z.array(ChangelogEntrySchema).default([]),
});
export type WorkflowFrontmatter = z.infer<typeof WorkflowFrontmatterSchema>;

export interface Workflow extends WorkflowFrontmatter {
  body: string;
  updatedDate: string;
}
