'use client';

import { useMemo, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { ArrowLeft, ChevronDown, ChevronUp, Copy, Download } from 'lucide-react';
import { useHistoryStore } from '@/stores/history-store';
import { resolvePlaceholders } from '@/lib/placeholder-utils';
import { copyToClipboard } from '@/lib/copy-utils';
import type { HelpTemplate } from '@/types/help';

interface HelpTemplateDetailClientProps {
  template: HelpTemplate;
}

export function HelpTemplateDetailClient({ template }: HelpTemplateDetailClientProps) {
  const router = useRouter();
  const { addEntry } = useHistoryStore();
  const [showVariables, setShowVariables] = useState(true);

  const form = useForm<Record<string, string>>({
    defaultValues: template.variables.reduce<Record<string, string>>((acc, v) => ({
      ...acc,
      [v.name]: v.default || '',
    }), {}) || {},
  });

  const formValues = form.watch();

  const resolvedContent = useMemo(() => {
    return resolvePlaceholders(template.template, formValues);
  }, [template, formValues]);

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(resolvedContent);
    if (success) {
      addEntry({
        entryType: 'help_doc',
        rawOutput: resolvedContent,
        promptTitle: template.title,
        resolvedVariables: formValues,
      });
      toast.success('Kopiert & im Verlauf gespeichert');
    }
  }, [template, resolvedContent, formValues, addEntry]);

  const handleDownload = () => {
    const blob = new Blob([resolvedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'HELP.md';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('HELP.md heruntergeladen');
  };

  return (
    <div className="space-y-8">
      {/* Back button */}
      <button
        onClick={() => router.push('/help-library')}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-lg"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück
      </button>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <span className="rounded-lg bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
            {template.domain}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{template.title}</h1>
        <p className="mt-2 text-muted-foreground">{template.notes}</p>
      </motion.div>

      <div className="space-y-6">
        {/* Variables form */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border/50 bg-card/50"
        >
          <button
            onClick={() => setShowVariables((prev) => !prev)}
            className="flex w-full items-center justify-between p-5 text-left"
          >
            <h2 className="text-xl font-semibold">Variablen</h2>
            {showVariables ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          {showVariables && (
            <div className="border-t border-border/50 p-5 space-y-4">
              {template.variables.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Keine Variablen vorhanden.
                </p>
              ) : (
                template.variables.map((variable) => (
                  <div key={variable.name}>
                    <label className="mb-1.5 block text-sm font-medium">
                      {variable.label}
                      <code className="ml-2 rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">
                        {'{{' + variable.name + '}}'}
                      </code>
                    </label>
                    <input
                      {...form.register(variable.name)}
                      placeholder={variable.placeholder || variable.default}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                ))
              )}
            </div>
          )}
        </motion.section>

        {/* Preview */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Vorschau</h2>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-ring"
              >
                <Copy className="h-4 w-4" />
                Kopieren
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 focus-ring"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/50 p-5 max-h-[600px] overflow-y-auto">
            <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
              <ReactMarkdown>{resolvedContent}</ReactMarkdown>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
