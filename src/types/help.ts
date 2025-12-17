import { z } from 'zod';

export interface HelpVariable {
  name: string;
  label: string;
  default?: string;
  placeholder?: string;
}

export interface HelpTemplate {
  id: string;
  title: string;
  domain: string;
  tags: string[];
  variables: HelpVariable[];
  template: string;
  notes: string;
  updatedDate: string;
}

export const HelpTemplateSchema = z.object({
  id: z.string(),
  title: z.string(),
  domain: z.string(),
  tags: z.array(z.string()),
  variables: z.array(z.object({
    name: z.string(),
    label: z.string(),
    default: z.string().optional(),
    placeholder: z.string().optional(),
  })),
  template: z.string(),
  notes: z.string(),
  updatedDate: z.string(),
});
