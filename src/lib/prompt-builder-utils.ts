import { z } from 'zod';

export const builderSchema = z.object({
  project_name: z.string().min(1, 'Projektname erforderlich'),
  language: z.enum(['de', 'en']),
  experience_level: z.enum(['beginner', 'expert']),
  stack: z.string().min(1, 'Tech Stack erforderlich'),
  user_flow: z.string().min(10, 'Mindestens 10 Zeichen'),
  include_explanations: z.boolean(),
});

export type BuilderForm = z.infer<typeof builderSchema>;

// Encode config to base64url
export function encodeState(data: BuilderForm): string {
  return btoa(JSON.stringify(data))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Decode from base64url
export function decodeState(str: string): BuilderForm | null {
  try {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const decoded = JSON.parse(atob(padded));
    const result = builderSchema.safeParse(decoded);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function generateBuildPrompt(form: BuilderForm): string {
  const lang = form.language === 'de';

  let prompt = lang
    ? `# Projekt: ${form.project_name}

## Anforderungen

Erstelle eine Webanwendung mit folgenden Spezifikationen:

### Tech Stack
${form.stack}

### Benutzerfluss
${form.user_flow}

### Richtlinien
`
    : `# Project: ${form.project_name}

## Requirements

Build a web application with the following specifications:

### Tech Stack
${form.stack}

### User Flow
${form.user_flow}

### Guidelines
`;

  if (form.experience_level === 'beginner') {
    prompt += lang
      ? `- Halte den Code einfach und gut kommentiert
- Erkläre komplexe Konzepte
- Verwende bewährte Patterns
`
      : `- Keep code simple and well-commented
- Explain complex concepts
- Use established patterns
`;
  } else {
    prompt += lang
      ? `- Optimiere für Performance und Skalierbarkeit
- Verwende fortgeschrittene Patterns wenn sinnvoll
- Fokussiere auf Clean Architecture
`
      : `- Optimize for performance and scalability
- Use advanced patterns where appropriate
- Focus on clean architecture
`;
  }

  if (form.include_explanations) {
    prompt += lang
      ? `- Füge Erklärungen zu wichtigen Entscheidungen hinzu
- Kommentiere nicht-offensichtlichen Code
`
      : `- Add explanations for important decisions
- Comment non-obvious code
`;
  }

  prompt += lang
    ? `
## Ausgabe

Generiere den vollständigen Code für diese Anwendung. Strukturiere die Ausgabe nach Dateien.`
    : `
## Output

Generate the complete code for this application. Structure the output by files.`;

  return prompt;
}
