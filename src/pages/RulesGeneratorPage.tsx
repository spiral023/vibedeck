import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Copy, Download, FileCode, Sparkles, ToggleLeft, ToggleRight } from 'lucide-react';
import { useHistoryStore } from '@/stores/history-store';
import { copyToClipboard } from '@/lib/copy-utils';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type FileType = 'cursorrules' | 'windsurfrules';
type Language = 'de' | 'en';

interface RulesConfig {
  fileType: FileType;
  useEmoji: boolean;
  language: Language;
  includeNextJS: boolean;
  lintStrict: boolean;
  testingRequired: boolean;
  smallCommits: boolean;
  diffsOnly: boolean;
  codeStyle: 'functional' | 'oop' | 'mixed';
}

const defaultConfig: RulesConfig = {
  fileType: 'cursorrules',
  useEmoji: false,
  language: 'de',
  includeNextJS: false,
  lintStrict: true,
  testingRequired: false,
  smallCommits: true,
  diffsOnly: false,
  codeStyle: 'functional',
};

function generateRulesContent(config: RulesConfig): string {
  const lang = config.language === 'de' ? {
    header: 'Projekt-Regeln',
    commitStyle: 'Commit-Nachrichten',
    codeStyle: 'Code-Stil',
    testing: 'Testing',
    linting: 'Linting',
    workflow: 'Workflow',
  } : {
    header: 'Project Rules',
    commitStyle: 'Commit Messages',
    codeStyle: 'Code Style',
    testing: 'Testing',
    linting: 'Linting',
    workflow: 'Workflow',
  };

  const emojiMap = config.useEmoji ? {
    feat: '✨',
    fix: '🐛',
    docs: '📚',
    style: '💄',
    refactor: '♻️',
    test: '✅',
    chore: '🔧',
  } : {};

  let content = `# ${lang.header}

## ${lang.commitStyle}

${config.language === 'de' ? 'Verwende Conventional Commits:' : 'Use Conventional Commits:'}

\`\`\`
${config.useEmoji ? emojiMap.feat + ' ' : ''}feat: ${config.language === 'de' ? 'Neues Feature' : 'New feature'}
${config.useEmoji ? emojiMap.fix + ' ' : ''}fix: ${config.language === 'de' ? 'Bugfix' : 'Bug fix'}
${config.useEmoji ? emojiMap.docs + ' ' : ''}docs: ${config.language === 'de' ? 'Dokumentation' : 'Documentation'}
${config.useEmoji ? emojiMap.style + ' ' : ''}style: ${config.language === 'de' ? 'Formatierung' : 'Formatting'}
${config.useEmoji ? emojiMap.refactor + ' ' : ''}refactor: ${config.language === 'de' ? 'Code-Refactoring' : 'Code refactoring'}
${config.useEmoji ? emojiMap.test + ' ' : ''}test: ${config.language === 'de' ? 'Tests' : 'Tests'}
${config.useEmoji ? emojiMap.chore + ' ' : ''}chore: ${config.language === 'de' ? 'Wartung' : 'Maintenance'}
\`\`\`

## ${lang.codeStyle}

`;

  if (config.codeStyle === 'functional') {
    content += config.language === 'de'
      ? `- Bevorzuge funktionale Programmierung
- Verwende Pure Functions wo möglich
- Vermeide Mutationen
- Nutze Composition über Vererbung`
      : `- Prefer functional programming
- Use pure functions where possible
- Avoid mutations
- Favor composition over inheritance`;
  } else if (config.codeStyle === 'oop') {
    content += config.language === 'de'
      ? `- Verwende Klassen für komplexe Entitäten
- Halte SOLID-Prinzipien ein
- Nutze Dependency Injection`
      : `- Use classes for complex entities
- Follow SOLID principles
- Use dependency injection`;
  } else {
    content += config.language === 'de'
      ? `- Wähle den passenden Stil je nach Anwendungsfall
- Funktional für Utilities und Transformationen
- OOP für komplexe Domain-Logik`
      : `- Choose the appropriate style per use case
- Functional for utilities and transformations
- OOP for complex domain logic`;
  }

  content += '\n\n';

  if (config.lintStrict) {
    content += `## ${lang.linting}

${config.language === 'de'
  ? `- ESLint strict mode aktiviert
- Keine Warnungen erlaubt
- TypeScript strict mode erforderlich
- Prettier für Formatierung`
  : `- ESLint strict mode enabled
- No warnings allowed
- TypeScript strict mode required
- Prettier for formatting`}

`;
  }

  if (config.testingRequired) {
    content += `## ${lang.testing}

${config.language === 'de'
  ? `- Unit Tests für alle Utilities
- Integration Tests für API-Routen
- Mindestens 80% Coverage
- Tests vor dem Commit ausführen`
  : `- Unit tests for all utilities
- Integration tests for API routes
- Minimum 80% coverage
- Run tests before commit`}

`;
  }

  content += `## ${lang.workflow}

`;

  if (config.smallCommits) {
    content += config.language === 'de'
      ? `- Kleine, fokussierte Commits\n`
      : `- Small, focused commits\n`;
  }

  if (config.diffsOnly) {
    content += config.language === 'de'
      ? `- Zeige nur Diffs bei Code-Reviews\n- Keine vollständigen Dateien ausgeben\n`
      : `- Show only diffs in code reviews\n- Don't output complete files\n`;
  }

  if (config.includeNextJS) {
    content += `
## Next.js App Router

${config.language === 'de'
  ? `- Verwende Server Components als Standard
- Client Components nur wenn nötig ("use client")
- Nutze Server Actions für Mutationen
- Metadata API für SEO
- App Router Konventionen (page.tsx, layout.tsx, loading.tsx)
- Bevorzuge Edge Runtime wo sinnvoll`
  : `- Use Server Components by default
- Client Components only when needed ("use client")
- Use Server Actions for mutations
- Metadata API for SEO
- App Router conventions (page.tsx, layout.tsx, loading.tsx)
- Prefer Edge Runtime where sensible`}
`;
  }

  return content.trim();
}

export function RulesGeneratorPage() {
  const [activeTab, setActiveTab] = useState<'rules' | 'context'>('rules');
  const [config, setConfig] = useState<RulesConfig>(defaultConfig);
  const { addEntry } = useHistoryStore();

  const rulesContent = useMemo(() => generateRulesContent(config), [config]);

  const handleCopy = async () => {
    const success = await copyToClipboard(rulesContent);
    if (success) {
      addEntry({
        entryType: 'rules',
        rawOutput: rulesContent,
        promptTitle: `.${config.fileType}`,
      });
      toast.success('Kopiert & im Verlauf gespeichert');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([rulesContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `.${config.fileType}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Datei heruntergeladen');
  };

  const Toggle = ({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) => (
    <button
      onClick={() => onChange(!value)}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors focus-ring w-full',
        value ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
      )}
    >
      {value ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
      {label}
    </button>
  );

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          Rules Generator
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Erstelle maßgeschneiderte Projektregeln für AI-Agenten.
        </p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            Regeldatei
          </TabsTrigger>
          <TabsTrigger value="context" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Context-Prompt
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="mt-6">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Configuration */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* File type */}
              <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
                <h3 className="font-semibold mb-4">Dateityp</h3>
                <div className="flex gap-2">
                  {(['cursorrules', 'windsurfrules'] as FileType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setConfig({ ...config, fileType: type })}
                      className={cn(
                        'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-ring',
                        config.fileType === type
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      )}
                    >
                      .{type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language & Emoji */}
              <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
                <h3 className="font-semibold mb-4">Sprache & Stil</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfig({ ...config, language: 'de' })}
                      className={cn(
                        'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-ring',
                        config.language === 'de'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      )}
                    >
                      Deutsch
                    </button>
                    <button
                      onClick={() => setConfig({ ...config, language: 'en' })}
                      className={cn(
                        'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-ring',
                        config.language === 'en'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      )}
                    >
                      English
                    </button>
                  </div>
                  <Toggle
                    value={config.useEmoji}
                    onChange={(v) => setConfig({ ...config, useEmoji: v })}
                    label="Emoji in Commit Messages"
                  />
                </div>
              </div>

              {/* Code style */}
              <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
                <h3 className="font-semibold mb-4">Code-Stil</h3>
                <div className="flex gap-2">
                  {[
                    { value: 'functional', label: 'Funktional' },
                    { value: 'oop', label: 'OOP' },
                    { value: 'mixed', label: 'Gemischt' },
                  ].map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setConfig({ ...config, codeStyle: style.value as RulesConfig['codeStyle'] })}
                      className={cn(
                        'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-ring',
                        config.codeStyle === style.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      )}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
                <h3 className="font-semibold mb-4">Optionen</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Toggle
                    value={config.lintStrict}
                    onChange={(v) => setConfig({ ...config, lintStrict: v })}
                    label="Lint Strict"
                  />
                  <Toggle
                    value={config.testingRequired}
                    onChange={(v) => setConfig({ ...config, testingRequired: v })}
                    label="Testing Required"
                  />
                  <Toggle
                    value={config.smallCommits}
                    onChange={(v) => setConfig({ ...config, smallCommits: v })}
                    label="Small Commits"
                  />
                  <Toggle
                    value={config.diffsOnly}
                    onChange={(v) => setConfig({ ...config, diffsOnly: v })}
                    label="Diffs Only"
                  />
                  <Toggle
                    value={config.includeNextJS}
                    onChange={(v) => setConfig({ ...config, includeNextJS: v })}
                    label="Next.js App Router"
                  />
                </div>
              </div>
            </motion.div>

            {/* Preview */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Vorschau</h3>
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
                    className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 focus-ring"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="rounded-2xl border border-border/50 bg-card/50 p-5 font-mono text-sm whitespace-pre-wrap max-h-[600px] overflow-y-auto">
                {rulesContent}
              </div>
              <p className="text-xs text-muted-foreground">
                📁 Platziere diese Datei im Root deines Repositories als <code>.{config.fileType}</code>
              </p>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="context" className="mt-6">
          <ContextMetaPromptGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Context Meta-Prompt Generator
type ContextFile = 'AGENTS.md' | 'GEMINI.md' | 'CLAUDE.md';
type DetailLevel = 'kurz' | 'ausfuehrlich';

interface ContextConfig {
  targetFile: ContextFile;
  language: Language;
  detailLevel: DetailLevel;
  focusAreas: string[];
  notes: string;
}

const focusOptions = [
  { id: 'architecture', label: 'Architektur & Struktur' },
  { id: 'testing', label: 'Testing Standards' },
  { id: 'codestyle', label: 'Code Style & Linting' },
  { id: 'deployment', label: 'Deployment & Hosting' },
  { id: 'security', label: 'Sicherheit & Secrets' },
];

function ContextMetaPromptGenerator() {
  const [config, setConfig] = useState<ContextConfig>({
    targetFile: 'AGENTS.md',
    language: 'de',
    detailLevel: 'ausfuehrlich',
    focusAreas: ['architecture'],
    notes: '',
  });
  const { addEntry } = useHistoryStore();

  const toggleFocus = (id: string) => {
    setConfig({
      ...config,
      focusAreas: config.focusAreas.includes(id)
        ? config.focusAreas.filter((f) => f !== id)
        : [...config.focusAreas, id],
    });
  };

  const generatedPrompt = useMemo(() => {
    const lang = config.language === 'de';
    const detailed = config.detailLevel === 'ausfuehrlich';

    let prompt = lang
      ? `Erstelle eine ${config.targetFile} Datei für dieses Projekt.`
      : `Create a ${config.targetFile} file for this project.`;

    prompt += '\n\n';

    if (detailed) {
      prompt += lang
        ? `Die Datei soll ausführlich und umfassend sein. Erkläre Entscheidungen und gib Kontext.`
        : `The file should be comprehensive and detailed. Explain decisions and provide context.`;
    } else {
      prompt += lang
        ? `Die Datei soll prägnant und fokussiert sein. Nur die wichtigsten Informationen.`
        : `The file should be concise and focused. Only the most important information.`;
    }

    prompt += '\n\n';
    prompt += lang ? `Fokussiere auf:\n` : `Focus on:\n`;

    config.focusAreas.forEach((area) => {
      const option = focusOptions.find((o) => o.id === area);
      if (option) {
        prompt += `- ${option.label}\n`;
      }
    });

    if (config.notes) {
      prompt += `\n${lang ? 'Zusätzliche Hinweise' : 'Additional notes'}:\n${config.notes}`;
    }

    prompt += `\n\n${lang ? 'Erforderliche Abschnitte' : 'Required sections'}:\n`;
    prompt += lang
      ? `1. Projekt-Übersicht\n2. Technologie-Stack\n3. Verzeichnisstruktur\n4. Entwicklungs-Workflow\n5. Konventionen und Standards`
      : `1. Project Overview\n2. Technology Stack\n3. Directory Structure\n4. Development Workflow\n5. Conventions and Standards`;

    return prompt;
  }, [config]);

  const handleCopy = async () => {
    const success = await copyToClipboard(generatedPrompt);
    if (success) {
      addEntry({
        entryType: 'context_meta_prompt',
        rawOutput: generatedPrompt,
        promptTitle: config.targetFile,
      });
      toast.success('Kopiert & im Verlauf gespeichert');
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        {/* Target file */}
        <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
          <h3 className="font-semibold mb-4">Zieldatei</h3>
          <div className="flex gap-2">
            {(['AGENTS.md', 'GEMINI.md', 'CLAUDE.md'] as ContextFile[]).map((file) => (
              <button
                key={file}
                onClick={() => setConfig({ ...config, targetFile: file })}
                className={cn(
                  'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-ring',
                  config.targetFile === file
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                {file}
              </button>
            ))}
          </div>
        </div>

        {/* Language & Detail */}
        <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
          <h3 className="font-semibold mb-4">Sprache & Detailgrad</h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => setConfig({ ...config, language: 'de' })}
                className={cn(
                  'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-ring',
                  config.language === 'de' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                )}
              >
                Deutsch
              </button>
              <button
                onClick={() => setConfig({ ...config, language: 'en' })}
                className={cn(
                  'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-ring',
                  config.language === 'en' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                )}
              >
                English
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfig({ ...config, detailLevel: 'kurz' })}
                className={cn(
                  'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-ring',
                  config.detailLevel === 'kurz' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                )}
              >
                Kurz
              </button>
              <button
                onClick={() => setConfig({ ...config, detailLevel: 'ausfuehrlich' })}
                className={cn(
                  'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-ring',
                  config.detailLevel === 'ausfuehrlich' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                )}
              >
                Ausführlich
              </button>
            </div>
          </div>
        </div>

        {/* Focus areas */}
        <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
          <h3 className="font-semibold mb-4">Fokus-Bereiche</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {focusOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => toggleFocus(opt.id)}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-ring text-left',
                  config.focusAreas.includes(opt.id)
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
          <h3 className="font-semibold mb-4">Zusätzliche Hinweise</h3>
          <textarea
            value={config.notes}
            onChange={(e) => setConfig({ ...config, notes: e.target.value })}
            placeholder="Optionale projektspezifische Anweisungen..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[100px] focus:border-primary focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Generierter Meta-Prompt</h3>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-ring"
          >
            <Copy className="h-4 w-4" />
            Kopieren
          </button>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/50 p-5 font-mono text-sm whitespace-pre-wrap max-h-[600px] overflow-y-auto">
          {generatedPrompt}
        </div>
        <p className="text-xs text-muted-foreground">
          💡 Verwende diesen Prompt, um einem AI-Agenten zu sagen, dass er die {config.targetFile} erstellen soll.
        </p>
      </div>
    </div>
  );
}
