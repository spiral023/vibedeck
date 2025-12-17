'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Download,
  FileJson,
  Settings,
  Upload,
} from 'lucide-react';
import { useHistoryStore } from '@/stores/history-store';
import { useSettingsStore } from '@/stores/settings-store';
import { usePromptStatusStore } from '@/stores/prompt-status-store';
import { createExportData, validateImportData, downloadJson, readJsonFile, type ExportData } from '@/lib/export-utils';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
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
