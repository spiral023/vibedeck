import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Copy,
  ExternalLink,
  GitBranch,
  Heart,
  Check,
  Package,
  Tag,
  User,
  Zap,
} from 'lucide-react';
import { getPromptById } from '@/data/prompts';
import { CategoryBadge, ComplexityBadge, TagBadge } from '@/components/ui/badges';
import { TokenEstimator } from '@/components/prompts/TokenEstimator';
import { useSettingsStore } from '@/stores/settings-store';
import { usePromptStatusStore } from '@/stores/prompt-status-store';
import { useHistoryStore, type CopyFormat } from '@/stores/history-store';
import { resolvePlaceholders, segmentText, type TextSegment } from '@/lib/placeholder-utils';
import { copyToClipboard, formatForCopy, copyFormatLabels } from '@/lib/copy-utils';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function PromptDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const prompt = id ? getPromptById(id) : undefined;
  
  const { defaultComplexity, globalVariables } = useSettingsStore();
  const { favorites, done, toggleFavorite, toggleDone, agentRoleOverrides, setAgentRoleOverride } = usePromptStatusStore();
  const { addEntry } = useHistoryStore();
  
  const [selectedVariant, setSelectedVariant] = useState<'beginner' | 'intermediate' | 'expert'>('intermediate');
  const [showPrePrompt, setShowPrePrompt] = useState(true);
  const [editingRole, setEditingRole] = useState(false);
  const [customRole, setCustomRole] = useState('');
  
  // Initialize variant from settings
  useEffect(() => {
    setSelectedVariant(defaultComplexity);
  }, [defaultComplexity]);
  
  // Initialize custom role
  useEffect(() => {
    if (prompt) {
      setCustomRole(agentRoleOverrides[prompt.id] || prompt.agent_role || '');
    }
  }, [prompt, agentRoleOverrides]);

  // Build form schema from variables
  const formSchema = useMemo(() => {
    if (!prompt) return z.object({});
    
    const shape: Record<string, z.ZodTypeAny> = {};
    prompt.variables.forEach((v) => {
      shape[v.name] = z.string().optional().default(v.default || '');
    });
    
    // Add global variable refs
    prompt.global_variable_refs?.forEach((ref) => {
      shape[ref] = z.string().optional().default('');
    });
    
    return z.object(shape);
  }, [prompt]);
  
  type FormValues = Record<string, string>;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  
  // Set default values when prompt loads
  useEffect(() => {
    if (prompt) {
      const defaults: Record<string, string> = {};
      
      prompt.variables.forEach((v) => {
        defaults[v.name] = v.default || '';
      });
      
      // Merge global variables
      prompt.global_variable_refs?.forEach((ref) => {
        if (globalVariables[ref]) {
          defaults[ref] = globalVariables[ref];
        }
      });
      
      form.reset(defaults);
    }
  }, [prompt, globalVariables, form]);
  
  const formValues = form.watch();
  
  // Get current variant text
  const currentVariantText = useMemo(() => {
    if (!prompt) return '';
    
    if (selectedVariant === 'beginner' && prompt.variants.beginner) {
      return prompt.variants.beginner;
    }
    if (selectedVariant === 'expert' && prompt.variants.expert) {
      return prompt.variants.expert;
    }
    return prompt.variants.default;
  }, [prompt, selectedVariant]);
  
  // Resolve placeholders
  const resolvedText = useMemo(() => {
    return resolvePlaceholders(currentVariantText, formValues);
  }, [currentVariantText, formValues]);
  
  // Segment text for highlighting
  const segments = useMemo(() => {
    return segmentText(currentVariantText, formValues);
  }, [currentVariantText, formValues]);
  
  // Copy handler
  const handleCopy = useCallback(async (format: CopyFormat) => {
    if (!prompt) return;
    
    const content = formatForCopy(format, resolvedText, {
      promptId: prompt.id,
      promptTitle: prompt.title,
      selectedVariant,
      resolvedVariables: formValues,
      prePrompt: prompt.pre_prompt,
    });
    
    const success = await copyToClipboard(content);
    
    if (success) {
      addEntry({
        entryType: 'prompt',
        copyFormat: format,
        promptId: prompt.id,
        promptTitle: prompt.title,
        selectedVariant,
        resolvedVariables: formValues,
        resolvedPromptMarkdown: resolvedText,
      });
      
      toast.success('Kopiert & im Verlauf gespeichert');
    } else {
      toast.error('Kopieren fehlgeschlagen');
    }
  }, [prompt, resolvedText, selectedVariant, formValues, addEntry]);
  
  // Copy pre-prompt
  const handleCopyPrePrompt = useCallback(async () => {
    if (!prompt) return;
    
    const success = await copyToClipboard(prompt.pre_prompt);
    if (success) {
      toast.success('Pre-Prompt kopiert');
    } else {
      toast.error('Kopieren fehlgeschlagen');
    }
  }, [prompt]);
  
  // Save custom role
  const handleSaveRole = () => {
    if (prompt && customRole) {
      setAgentRoleOverride(prompt.id, customRole);
      setEditingRole(false);
      toast.success('Rolle gespeichert');
    }
  };

  if (!prompt) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold">Prompt nicht gefunden</h1>
        <p className="mt-2 text-muted-foreground">
          Der gesuchte Prompt existiert nicht.
        </p>
        <Link
          to="/prompt-library"
          className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zur Bibliothek
        </Link>
      </div>
    );
  }

  const isFavorite = !!favorites[prompt.id];
  const isDone = !!done[prompt.id];
  const currentRole = agentRoleOverrides[prompt.id] || prompt.agent_role;

  return (
    <div className="space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-lg"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex flex-wrap items-center gap-3">
          <CategoryBadge category={prompt.category} />
          <ComplexityBadge complexity={prompt.complexity} />
          
          {/* Quick actions */}
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => toggleFavorite(prompt.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors focus-ring',
                isFavorite 
                  ? 'bg-red-500/10 text-red-400' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
              {isFavorite ? 'Favorit' : 'Favorisieren'}
            </button>
            <button
              onClick={() => toggleDone(prompt.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors focus-ring',
                isDone 
                  ? 'bg-green-500/10 text-green-400' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              <Check className={cn('h-4 w-4', isDone && 'stroke-[3]')} />
              {isDone ? 'Erledigt' : 'Erledigen'}
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
          {prompt.title}
        </h1>

        <p className="text-lg text-muted-foreground">
          {prompt.shortExcerpt}
        </p>

        {/* Meta info */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {new Intl.DateTimeFormat('de-DE', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }).format(new Date(prompt.updatedDate))}
          </span>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Agent Role */}
          {(currentRole || editingRole) && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border/50 bg-card/50 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="flex items-center gap-2 font-semibold">
                  <User className="h-4 w-4 text-primary" />
                  Agent Rolle
                </h2>
                {!editingRole && (
                  <button
                    onClick={() => setEditingRole(true)}
                    className="text-xs text-primary hover:underline"
                  >
                    Bearbeiten
                  </button>
                )}
              </div>
              
              {editingRole ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="z.B. Senior React Entwickler"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveRole}
                      className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      Speichern
                    </button>
                    <button
                      onClick={() => {
                        setEditingRole(false);
                        setCustomRole(agentRoleOverrides[prompt.id] || prompt.agent_role || '');
                      }}
                      className="rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{currentRole}</p>
              )}
            </motion.section>
          )}

          {/* Pre-prompt - Collapsible */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border/50 bg-card/50"
          >
            <button
              onClick={() => setShowPrePrompt(!showPrePrompt)}
              className="flex w-full items-center justify-between p-5 text-left"
            >
              <h2 className="text-xl font-semibold">System-Prompt (Pre-Prompt)</h2>
              {showPrePrompt ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            
            {showPrePrompt && (
              <div className="border-t border-border/50 p-5">
                <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none mb-4">
                  <ReactMarkdown>{prompt.pre_prompt}</ReactMarkdown>
                </div>
                <button
                  onClick={handleCopyPrePrompt}
                  className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 focus-ring"
                >
                  <Clipboard className="h-4 w-4" />
                  Pre-Prompt kopieren
                </button>
              </div>
            )}
          </motion.section>

          {/* Variant selector */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-border/50 bg-card/50 p-5"
          >
            <h2 className="mb-4 text-xl font-semibold">Variante wählen</h2>
            <div className="flex flex-wrap gap-2">
              {['beginner', 'intermediate', 'expert'].map((variant) => {
                const isAvailable = variant === 'intermediate' || 
                  (variant === 'beginner' && prompt.variants.beginner) ||
                  (variant === 'expert' && prompt.variants.expert);
                
                const labels = {
                  beginner: 'Einsteiger',
                  intermediate: 'Standard',
                  expert: 'Experte',
                };
                
                return (
                  <button
                    key={variant}
                    onClick={() => isAvailable && setSelectedVariant(variant as typeof selectedVariant)}
                    disabled={!isAvailable}
                    className={cn(
                      'rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-ring',
                      selectedVariant === variant
                        ? 'bg-primary text-primary-foreground'
                        : isAvailable
                          ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                    )}
                  >
                    {labels[variant as keyof typeof labels]}
                  </button>
                );
              })}
            </div>
          </motion.section>

          {/* Variables form */}
          {prompt.variables.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border/50 bg-card/50 p-5"
            >
              <h2 className="mb-4 text-xl font-semibold">Variablen</h2>
              <div className="space-y-4">
                {prompt.variables.map((variable) => (
                  <div key={variable.name}>
                    <label className="mb-1.5 block text-sm font-medium">
                      {variable.label}
                      <code className="ml-2 rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">
                        {'{{' + variable.name + '}}'}
                      </code>
                    </label>
                    <input
                      {...form.register(variable.name)}
                      placeholder={variable.default || `${variable.label} eingeben...`}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                ))}
                
                {/* Global variable refs */}
                {prompt.global_variable_refs?.map((ref) => (
                  <div key={ref}>
                    <label className="mb-1.5 block text-sm font-medium">
                      {ref.replace('global_', '').replace(/_/g, ' ')}
                      <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                        Global
                      </span>
                    </label>
                    <input
                      {...form.register(ref)}
                      placeholder="Aus Einstellungen..."
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Live Preview */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border border-border/50 bg-card/50 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Live-Vorschau
              </h2>
              
              {/* Smart Copy Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-ring">
                    <Copy className="h-4 w-4" />
                    Kopieren als
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {(['chat_markdown', 'json', 'raw_text'] as CopyFormat[]).map((format) => (
                    <DropdownMenuItem
                      key={format}
                      onClick={() => handleCopy(format)}
                      className="cursor-pointer"
                    >
                      {copyFormatLabels[format]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Highlighted preview */}
            <div className="rounded-xl bg-secondary/30 p-4 font-mono text-sm whitespace-pre-wrap">
              {segments.map((segment, i) => (
                <HighlightedSegment key={i} segment={segment} />
              ))}
            </div>
          </motion.section>

          {/* Token Estimator */}
          <TokenEstimator text={resolvedText} />

          {/* Notes (Markdown body) */}
          {prompt.body && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-border/50 bg-card/50 p-6"
            >
              <h2 className="mb-4 text-xl font-semibold">Hinweise</h2>
              <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
                <ReactMarkdown>{prompt.body}</ReactMarkdown>
              </div>
            </motion.section>
          )}
        </div>

        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Tags */}
          <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
            <h3 className="mb-3 font-semibold">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {prompt.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          </div>

          {/* Dependencies */}
          {prompt.dependencies.length > 0 && (
            <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <Package className="h-4 w-4" />
                Abhängigkeiten
              </h3>
              <ul className="space-y-1">
                {prompt.dependencies.map((dep) => (
                  <li key={dep} className="text-sm text-muted-foreground">
                    {dep}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related prompts */}
          {prompt.related_prompts.length > 0 && (
            <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <GitBranch className="h-4 w-4" />
                Verwandte Prompts
              </h3>
              <ul className="space-y-2">
                {prompt.related_prompts.map((relId) => (
                  <li key={relId}>
                    <Link
                      to={`/prompt-library/${relId}`}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      {relId}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Changelog */}
          {prompt.changelog.length > 0 && (
            <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
              <h3 className="mb-3 font-semibold">Änderungsverlauf</h3>
              <ul className="space-y-3">
                {prompt.changelog.map((entry, i) => (
                  <li key={i} className="text-sm">
                    <div className="text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat('de-DE').format(new Date(entry.date))}
                    </div>
                    <div>{entry.note}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.aside>
      </div>
    </div>
  );
}

function HighlightedSegment({ segment }: { segment: TextSegment }) {
  if (segment.type === 'text') {
    return <span>{segment.content}</span>;
  }
  
  if (segment.type === 'placeholder_resolved') {
    return (
      <span className="rounded bg-green-500/20 px-1 text-green-400" title={`{{${segment.placeholder}}}`}>
        {segment.content}
      </span>
    );
  }
  
  // Unresolved
  return (
    <span className="rounded bg-amber-500/20 px-1 text-amber-400" title="Nicht ausgefüllt">
      {segment.content}
    </span>
  );
}
