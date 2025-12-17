'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Factory, Copy, Sparkles, Plus, Trash2, ArrowDown } from 'lucide-react';
import { useHistoryStore } from '@/stores/history-store';
import { copyToClipboard } from '@/lib/copy-utils';
import { cn } from '@/lib/utils';

interface PromptBlock {
  id: string;
  type: 'context' | 'instruction' | 'format' | 'constraint' | 'example';
  content: string;
}

const blockTypes = [
  { type: 'context', label: 'Kontext', color: 'bg-blue-500/15 text-blue-400', placeholder: 'Beschreibe den Hintergrund und Zweck...' },
  { type: 'instruction', label: 'Anweisung', color: 'bg-emerald-500/15 text-emerald-400', placeholder: 'Was soll die AI tun?' },
  { type: 'format', label: 'Format', color: 'bg-violet-500/15 text-violet-400', placeholder: 'Wie soll das Output aussehen?' },
  { type: 'constraint', label: 'Einschränkung', color: 'bg-amber-500/15 text-amber-400', placeholder: 'Welche Grenzen und Regeln gelten?' },
  { type: 'example', label: 'Beispiel', color: 'bg-pink-500/15 text-pink-400', placeholder: 'Zeige ein Beispiel für das gewünschte Ergebnis...' },
] as const;

type BlockType = typeof blockTypes[number]['type'];

const templates = [
  {
    name: 'Code Review',
    blocks: [
      { type: 'context' as const, content: 'Du bist ein erfahrener Senior Developer der Code Reviews durchführt.' },
      { type: 'instruction' as const, content: 'Analysiere den folgenden Code auf Qualität, Bugs und Best Practices.' },
      { type: 'format' as const, content: 'Strukturiere dein Feedback in: Positives, Verbesserungen, Kritische Punkte.' },
    ],
  },
  {
    name: 'Feature Planung',
    blocks: [
      { type: 'context' as const, content: 'Du bist ein Product Manager der Features plant.' },
      { type: 'instruction' as const, content: 'Erstelle einen detaillierten Plan für das folgende Feature.' },
      { type: 'format' as const, content: 'Inkludiere: User Stories, Acceptance Criteria, Technische Überlegungen.' },
      { type: 'constraint' as const, content: 'Fokussiere auf MVP-Scope, keine Over-Engineering.' },
    ],
  },
  {
    name: 'Bug Fix',
    blocks: [
      { type: 'context' as const, content: 'Du bist ein Debug-Experte der systematisch Fehler analysiert.' },
      { type: 'instruction' as const, content: 'Analysiere den Bug und schlage eine Lösung vor.' },
      { type: 'format' as const, content: 'Erkläre: 1. Ursache 2. Lösung 3. Prävention für die Zukunft' },
    ],
  },
];

let blockIdCounter = 0;
const generateId = () => `block-${++blockIdCounter}`;

export default function PromptFactoryPage() {
  const [blocks, setBlocks] = useState<PromptBlock[]>([]);
  const { addEntry } = useHistoryStore();

  const addBlock = (type: BlockType) => {
    setBlocks([...blocks, { id: generateId(), type, content: '' }]);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const loadTemplate = (template: typeof templates[0]) => {
    setBlocks(template.blocks.map(b => ({ ...b, id: generateId() })));
    toast.success(`Template "${template.name}" geladen`);
  };

  const generatedPrompt = useMemo(() => {
    if (blocks.length === 0) return '';

    const sections = blocks
      .filter(b => b.content.trim())
      .map(b => {
        const blockType = blockTypes.find(bt => bt.type === b.type);
        return `## ${blockType?.label || b.type}\n${b.content}`;
      });

    return sections.join('\n\n');
  }, [blocks]);

  const handleCopy = async () => {
    if (!generatedPrompt) {
      toast.error('Füge zuerst Blöcke hinzu');
      return;
    }

    const success = await copyToClipboard(generatedPrompt);
    if (success) {
      addEntry({
        entryType: 'prompt_factory',
        rawOutput: generatedPrompt,
        promptTitle: 'Factory Prompt',
      });
      toast.success('Kopiert & im Verlauf gespeichert');
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
          <Factory className="h-8 w-8 text-primary" />
          Prompt Factory
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Baue modulare Prompts aus wiederverwendbaren Blöcken.
        </p>
      </motion.div>

      {/* Templates */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-2"
      >
        <span className="text-sm text-muted-foreground py-2">Templates:</span>
        {templates.map((template) => (
          <button
            key={template.name}
            onClick={() => loadTemplate(template)}
            className="rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            {template.name}
          </button>
        ))}
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Block Builder */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h2 className="font-semibold">Blöcke</h2>

          {/* Add Block Buttons */}
          <div className="flex flex-wrap gap-2">
            {blockTypes.map((bt) => (
              <button
                key={bt.type}
                onClick={() => addBlock(bt.type)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all hover:scale-105',
                  bt.color
                )}
              >
                <Plus className="h-3.5 w-3.5" />
                {bt.label}
              </button>
            ))}
          </div>

          {/* Blocks */}
          <div className="space-y-3">
            {blocks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/50 p-8 text-center text-muted-foreground">
                <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p>Klicke auf einen Block-Typ um zu starten</p>
                <p className="text-xs mt-1">oder wähle ein Template oben</p>
              </div>
            ) : (
              blocks.map((block, index) => {
                const blockType = blockTypes.find(bt => bt.type === block.type)!;
                return (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-border/50 bg-card/50 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn('rounded-md px-2 py-0.5 text-xs font-medium', blockType.color)}>
                        {blockType.label}
                      </span>
                      <button
                        onClick={() => removeBlock(block.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      placeholder={blockType.placeholder}
                      rows={3}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none focus:border-primary focus:outline-none"
                    />
                    {index < blocks.length - 1 && (
                      <div className="flex justify-center mt-3">
                        <ArrowDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Generierter Prompt</h2>
            <button
              onClick={handleCopy}
              disabled={!generatedPrompt}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Copy className="h-4 w-4" />
              Kopieren
            </button>
          </div>

          <div className="min-h-[400px] rounded-2xl border border-border/50 bg-card/50 p-5 font-mono text-sm whitespace-pre-wrap">
            {generatedPrompt || (
              <span className="text-muted-foreground">
                Füge Blöcke hinzu um einen Prompt zu generieren...
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
