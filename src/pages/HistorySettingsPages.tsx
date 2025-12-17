import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  AlertTriangle,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileJson,
  History,
  RefreshCw,
  Settings,
  Trash2,
  Upload,
} from 'lucide-react';
import { useHistoryStore, type HistoryEntry, type CopyFormat } from '@/stores/history-store';
import { useSettingsStore } from '@/stores/settings-store';
import { usePromptStatusStore } from '@/stores/prompt-status-store';
import { copyToClipboard, copyFormatLabels, formatForCopy } from '@/lib/copy-utils';
import { createExportData, validateImportData, downloadJson, readJsonFile, type ExportData } from '@/lib/export-utils';
import { cn } from '@/lib/utils';
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

export function HistoryPage() {
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
            to="/prompt-library"
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
                      to={`/prompt-library/${entry.promptId}`}
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

export function SettingsPage() {
  const settings = useSettingsStore();
  const promptStatus = usePromptStatusStore();
  const history = useHistoryStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importPreview, setImportPreview] = useState<ReturnType<typeof validateImportData> | null>(null);
  const [pendingImport, setPendingImport] = useState<unknown>(null);

  const handleExport = () => {
    const data = createExportData(
      {
        themeMode: settings.themeMode,
        preferredLanguage: settings.preferredLanguage,
        defaultComplexity: settings.defaultComplexity,
        showBeginnerExplanations: settings.showBeginnerExplanations,
        globalVariables: settings.globalVariables,
      },
      {
        favorites: promptStatus.favorites,
        done: promptStatus.done,
        agentRoleOverrides: promptStatus.agentRoleOverrides,
      },
      history.entries
    );

    const filename = `vibedeck-export-${new Date().toISOString().split('T')[0]}.json`;
    downloadJson(data, filename);
    toast.success('Daten exportiert');
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await readJsonFile(file);
      const preview = validateImportData(data);
      setImportPreview(preview);
      setPendingImport(data);
    } catch (err) {
      toast.error('Datei konnte nicht gelesen werden');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImport = () => {
    if (!pendingImport || !importPreview?.isValid) return;

    const data = pendingImport as ExportData;

    // Apply settings
    settings.setThemeMode(data.settings.themeMode);
    settings.setPreferredLanguage(data.settings.preferredLanguage);
    settings.setDefaultComplexity(data.settings.defaultComplexity);
    settings.setShowBeginnerExplanations(data.settings.showBeginnerExplanations);
    settings.setGlobalVariables(data.settings.globalVariables as any);

    // Reset and set prompt status
    promptStatus.resetAll();
    Object.keys(data.promptStatus.favorites).forEach((id) => {
      promptStatus.toggleFavorite(id);
    });
    Object.keys(data.promptStatus.done).forEach((id) => {
      promptStatus.toggleDone(id);
    });
    Object.entries(data.promptStatus.agentRoleOverrides).forEach(([id, role]) => {
      promptStatus.setAgentRoleOverride(id, role);
    });

    // Replace history
    history.clearAll();
    data.history.forEach((entry) => {
      history.addEntry(entry as any);
    });

    setImportPreview(null);
    setPendingImport(null);
    toast.success('Daten importiert');
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          Einstellungen
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Konfiguriere VibeDeck nach deinen Vorlieben.
        </p>
      </motion.div>

      {/* Tech Profile */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border/50 bg-card/50 p-6 space-y-6"
      >
        <h2 className="text-xl font-semibold">Tech Profil</h2>

        <div>
          <label className="mb-2 block text-sm font-medium">Globaler Tech Stack</label>
          <input
            type="text"
            value={settings.globalVariables.global_stack}
            onChange={(e) => settings.setGlobalVariable('global_stack', e.target.value)}
            placeholder="z.B. React, TypeScript, Tailwind CSS"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:border-primary focus:outline-none"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Wird automatisch in Prompts mit global_stack Variable eingefügt.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Bevorzugte Sprache</label>
          <div className="flex gap-2">
            {(['de', 'en'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => settings.setPreferredLanguage(lang)}
                className={cn(
                  'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-ring',
                  settings.preferredLanguage === lang
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
          <label className="mb-2 block text-sm font-medium">Standard-Komplexität</label>
          <div className="flex gap-2">
            {(['beginner', 'intermediate', 'expert'] as const).map((level) => (
              <button
                key={level}
                onClick={() => settings.setDefaultComplexity(level)}
                className={cn(
                  'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-ring',
                  settings.defaultComplexity === level
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                {{ beginner: 'Einsteiger', intermediate: 'Standard', expert: 'Experte' }[level]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.showBeginnerExplanations}
              onChange={(e) => settings.setShowBeginnerExplanations(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <span className="text-sm font-medium">Einsteiger-Erklärungen anzeigen</span>
          </label>
        </div>
      </motion.section>

      {/* Data Portability */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border/50 bg-card/50 p-6 space-y-6"
      >
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileJson className="h-5 w-5 text-primary" />
          Daten-Portabilität
        </h2>

        <div className="flex gap-4">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-ring"
          >
            <Download className="h-4 w-4" />
            Exportieren
          </button>

          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 focus-ring"
          >
            <Upload className="h-4 w-4" />
            Importieren
          </button>
        </div>

        {/* Import preview */}
        {importPreview && (
          <div className={cn(
            'rounded-xl border p-4',
            importPreview.isValid
              ? 'border-green-500/30 bg-green-500/10'
              : 'border-destructive/30 bg-destructive/10'
          )}>
            {importPreview.isValid ? (
              <>
                <h4 className="font-medium mb-2">Import-Vorschau</h4>
                <ul className="text-sm space-y-1 text-muted-foreground mb-4">
                  <li>Exportiert am: {importPreview.exportedAt && new Intl.DateTimeFormat('de-DE').format(new Date(importPreview.exportedAt))}</li>
                  <li>Einstellungen: {importPreview.settingsCount} globale Variablen</li>
                  <li>Favoriten: {importPreview.favoritesCount}</li>
                  <li>Erledigt: {importPreview.doneCount}</li>
                  <li>Verlauf: {importPreview.historyCount} Einträge</li>
                </ul>
                <div className="flex gap-2">
                  <button
                    onClick={handleImport}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus-ring"
                  >
                    Importieren (Ersetzen)
                  </button>
                  <button
                    onClick={() => {
                      setImportPreview(null);
                      setPendingImport(null);
                    }}
                    className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 focus-ring"
                  >
                    Abbrechen
                  </button>
                </div>
              </>
            ) : (
              <div className="text-destructive">
                <h4 className="font-medium mb-1">Ungültige Datei</h4>
                <p className="text-sm">{importPreview.error}</p>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Export enthält: Einstellungen, Favoriten, erledigte Prompts und Verlauf.
        </p>
      </motion.section>

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid gap-4 sm:grid-cols-3"
      >
        <div className="rounded-2xl border border-border/50 bg-card/50 p-5 text-center">
          <div className="text-3xl font-bold text-primary">
            {Object.keys(promptStatus.favorites).length}
          </div>
          <div className="text-sm text-muted-foreground">Favoriten</div>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/50 p-5 text-center">
          <div className="text-3xl font-bold text-primary">
            {Object.keys(promptStatus.done).length}
          </div>
          <div className="text-sm text-muted-foreground">Erledigt</div>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/50 p-5 text-center">
          <div className="text-3xl font-bold text-primary">
            {history.entries.length}
          </div>
          <div className="text-sm text-muted-foreground">Verlauf</div>
        </div>
      </motion.section>
    </div>
  );
}
