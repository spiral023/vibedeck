'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Copy, Link2, Share2, Wrench } from 'lucide-react';
import { useHistoryStore } from '@/stores/history-store';
import { useSettingsStore } from '@/stores/settings-store';
import { copyToClipboard } from '@/lib/copy-utils';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const builderSchema = z.object({
  project_name: z.string().min(1, 'Projektname erforderlich'),
  language: z.enum(['de', 'en']),
  experience_level: z.enum(['beginner', 'expert']),
  stack: z.string().min(1, 'Tech Stack erforderlich'),
  user_flow: z.string().min(10, 'Mindestens 10 Zeichen'),
  include_explanations: z.boolean(),
});

type BuilderForm = z.infer<typeof builderSchema>;

// Encode config to base64url
function encodeState(data: BuilderForm): string {
  return btoa(JSON.stringify(data))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Decode from base64url
function decodeState(str: string): BuilderForm | null {
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

function generateBuildPrompt(form: BuilderForm): string {
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

function PromptBuilderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { globalVariables } = useSettingsStore();
  const { addEntry } = useHistoryStore();

  const form = useForm<BuilderForm>({
    resolver: zodResolver(builderSchema),
    defaultValues: {
      project_name: '',
      language: 'de',
      experience_level: 'beginner',
      stack: globalVariables.global_stack || 'React, TypeScript, Tailwind CSS',
      user_flow: '',
      include_explanations: true,
    },
  });

  // Load state from URL
  useEffect(() => {
    const stateParam = searchParams.get('state');
    if (stateParam) {
      const decoded = decodeState(stateParam);
      if (decoded) {
        form.reset(decoded);
        toast.success('Konfiguration geladen');
      } else {
        toast.error('Ungültige Konfiguration in URL');
        // Clear invalid state by replacing URL
        router.replace('/prompt-builder');
      }
    }
  }, [searchParams, router, form]);

  const formValues = form.watch();
  const generatedPrompt = useMemo(() => {
    if (!formValues.project_name || !formValues.user_flow) return '';
    return generateBuildPrompt(formValues);
  }, [formValues]);

  const handleCopy = async () => {
    if (!generatedPrompt) {
      toast.error('Bitte fülle alle Felder aus');
      return;
    }

    const success = await copyToClipboard(generatedPrompt);
    if (success) {
      addEntry({
        entryType: 'prompt_builder',
        rawOutput: generatedPrompt,
        promptTitle: `Build: ${formValues.project_name}`,
        resolvedVariables: formValues as any,
      });
      toast.success('Kopiert & im Verlauf gespeichert');
    }
  };

  const handleShare = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error('Bitte korrigiere die Fehler');
      return;
    }

    const state = encodeState(formValues);
    const url = `${window.location.origin}/prompt-builder?state=${state}`;

    const success = await copyToClipboard(url);
    if (success) {
      toast.success('Link kopiert');
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
          <Wrench className="h-8 w-8 text-primary" />
          Prompt Builder
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Erstelle individuelle Build-Prompts für deine Projekte.
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Project name */}
          <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
            <label className="mb-2 block text-sm font-medium">
              Projektname *
            </label>
            <input
              {...form.register('project_name')}
              placeholder="z.B. TaskFlow App"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:border-primary focus:outline-none"
            />
            {form.formState.errors.project_name && (
              <p className="mt-1 text-xs text-destructive">
                {form.formState.errors.project_name.message}
              </p>
            )}
          </div>

          {/* Language & Level */}
          <div className="rounded-2xl border border-border/50 bg-card/50 p-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Sprache</label>
              <div className="flex gap-2">
                {(['de', 'en'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => form.setValue('language', lang)}
                    className={cn(
                      'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-ring',
                      formValues.language === lang
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    )}
                  >
                    {lang === 'de' ? 'Deutsch' : 'English'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Erfahrungslevel</label>
              <div className="flex gap-2">
                {([
                  { value: 'beginner', label: 'Einsteiger' },
                  { value: 'expert', label: 'Experte' },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => form.setValue('experience_level', opt.value)}
                    className={cn(
                      'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-ring',
                      formValues.experience_level === opt.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tech stack */}
          <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
            <label className="mb-2 block text-sm font-medium">Tech Stack *</label>
            <input
              {...form.register('stack')}
              placeholder="z.B. React, TypeScript, Tailwind CSS"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:border-primary focus:outline-none"
            />
            {form.formState.errors.stack && (
              <p className="mt-1 text-xs text-destructive">
                {form.formState.errors.stack.message}
              </p>
            )}
          </div>

          {/* User flow */}
          <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
            <label className="mb-2 block text-sm font-medium">
              Benutzerfluss / Beschreibung *
            </label>
            <textarea
              {...form.register('user_flow')}
              placeholder="Beschreibe die Funktionen und den Benutzerfluss deiner App..."
              rows={5}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:border-primary focus:outline-none resize-none"
            />
            {form.formState.errors.user_flow && (
              <p className="mt-1 text-xs text-destructive">
                {form.formState.errors.user_flow.message}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                {...form.register('include_explanations')}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <span className="text-sm font-medium">
                Erklärungen im Code einbeziehen
              </span>
            </label>
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Generierter Prompt</h3>
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 focus-ring"
                title="Konfiguration teilen"
              >
                <Link2 className="h-4 w-4" />
                Teilen
              </button>
              <button
                onClick={handleCopy}
                disabled={!generatedPrompt}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Copy className="h-4 w-4" />
                Kopieren
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/50 p-5 font-mono text-sm whitespace-pre-wrap max-h-[600px] overflow-y-auto min-h-[300px]">
            {generatedPrompt || (
              <span className="text-muted-foreground">
                Fülle die Felder aus, um einen Prompt zu generieren...
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            💡 Tipp: Nutze den "Teilen" Button, um deine Konfiguration mit anderen zu teilen.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function PromptBuilderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PromptBuilderContent />
    </Suspense>
  );
}