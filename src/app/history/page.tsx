'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  AlertTriangle,
  Clock,
  ExternalLink,
  History,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { useHistoryStore, type HistoryEntry } from '@/stores/history-store';
import { copyToClipboard, copyFormatLabels, formatForCopy } from '@/lib/copy-utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const entryTypeLabels: Record<string, string> = {
  prompt: 'Prompt',
  prompt_builder: 'Prompt Builder',
  prompt_factory: 'Prompt Factory',
  rules: 'Regeldatei',
  context_meta_prompt: 'Context Prompt',
  help_doc: 'Help Template',
};

export default function HistoryPage() {
  const { entries, deleteEntry, clearAll } = useHistoryStore();

  const handleRecopy = async (entry: HistoryEntry) => {
    if (!entry.resolvedPromptMarkdown && !entry.rawOutput) {
      toast.error('Keine kopierbaren Inhalte');
      return;
    }

    const content = entry.resolvedPromptMarkdown || entry.rawOutput || '';
    const formatted = entry.copyFormat
      ? formatForCopy(entry.copyFormat, content, {
          promptId: entry.promptId,
          promptTitle: entry.promptTitle,
          selectedVariant: entry.selectedVariant as any,
          resolvedVariables: entry.resolvedVariables || {},
        })
      : content;

    const success = await copyToClipboard(formatted);
    if (success) {
      toast.success('Erneut kopiert');
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
            <History className="h-8 w-8 text-primary" />
            Verlauf
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {entries.length} {entries.length === 1 ? 'Eintrag' : 'Einträge'} gespeichert
          </p>
        </div>

        {entries.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/20 focus-ring">
                <Trash2 className="h-4 w-4" />
                Verlauf löschen
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Verlauf löschen?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Diese Aktion kann nicht rückgängig gemacht werden. Alle {entries.length} Einträge werden unwiderruflich gelöscht.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    clearAll();
                    toast.success('Verlauf gelöscht');
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Löschen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </motion.div>

      {entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="mb-4 rounded-full bg-muted p-4">
            <Clock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Noch kein Verlauf</h3>
          <p className="mt-1 text-muted-foreground">
            Kopierte Prompts und generierte Inhalte erscheinen hier.
          </p>
          <Link
            href="/prompt-library"
            className="mt-4 text-primary hover:underline"
          >
            Zur Prompt Bibliothek →
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="rounded-2xl border border-border/50 bg-card/50 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="rounded-lg bg-secondary px-2 py-0.5 text-xs font-medium">
                      {entryTypeLabels[entry.entryType] || entry.entryType}
                    </span>
                    {entry.copyFormat && (
                      <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {copyFormatLabels[entry.copyFormat]}
                      </span>
                    )}
                    {entry.selectedVariant && (
                      <span className="text-xs text-muted-foreground">
                        Variante: {entry.selectedVariant}
                      </span>
                    )}
                    {entry.workflowId && (
                      <span className="text-xs text-muted-foreground">
                        Workflow Schritt {(entry.stepIndex || 0) + 1}
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold truncate">
                    {entry.promptTitle || 'Unbenannt'}
                  </h3>

                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {new Intl.DateTimeFormat('de-DE', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(new Date(entry.timestamp))}
                  </div>

                  {/* Preview */}
                  {(entry.resolvedPromptMarkdown || entry.rawOutput) && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2 font-mono">
                      {(entry.resolvedPromptMarkdown || entry.rawOutput || '').slice(0, 150)}...
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleRecopy(entry)}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-ring"
                    title="Erneut kopieren"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Kopieren
                  </button>

                  {entry.promptId && (
                    <Link
                      href={`/prompt-library/${entry.promptId}`}
                      className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 focus-ring"
                      title="Prompt öffnen"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      deleteEntry(entry.id);
                      toast.success('Eintrag gelöscht');
                    }}
                    className="flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-ring"
                    title="Löschen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
