import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  PlayCircle,
  Zap,
} from 'lucide-react';
import { workflows, getWorkflowById } from '@/data/workflows';
import { getPromptById } from '@/data/prompts';
import { CategoryBadge, TagBadge } from '@/components/ui/badges';
import { useHistoryStore, type CopyFormat } from '@/stores/history-store';
import { useSettingsStore } from '@/stores/settings-store';
import { resolvePlaceholders, segmentText } from '@/lib/placeholder-utils';
import { copyToClipboard, formatForCopy, copyFormatLabels } from '@/lib/copy-utils';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function WorkflowsPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">Workflows</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Strukturierte Arbeitsabläufe für wiederkehrende Aufgaben.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {workflows.map((workflow, index) => (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={`/workflows/${workflow.id}`}
              className="group block h-full"
            >
              <div className="h-full rounded-2xl border border-border/50 bg-card/50 p-5 transition-all hover:border-primary/30 hover:bg-card hover:shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <CategoryBadge category={workflow.category} size="sm" />
                  <span className="text-sm text-muted-foreground">
                    {workflow.steps.length} Schritte
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
                  {workflow.title}
                </h3>

                <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                  {workflow.description}
                </p>

                <div className="mb-4 flex flex-wrap gap-1.5">
                  {workflow.tags.slice(0, 3).map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat('de-DE').format(new Date(workflow.updatedDate))}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="h-4 w-4" />
                    Starten
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function WorkflowDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const workflow = id ? getWorkflowById(id) : undefined;
  const [currentStep, setCurrentStep] = useState(0);
  const { globalVariables, defaultComplexity } = useSettingsStore();
  const { addEntry } = useHistoryStore();

  if (!workflow) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold">Workflow nicht gefunden</h1>
        <Link to="/workflows" className="mt-4 text-primary hover:underline flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Zurück zu Workflows
        </Link>
      </div>
    );
  }

  const step = workflow.steps[currentStep];
  const prompt = step.promptRef ? getPromptById(step.promptRef) : undefined;

  const goToStep = (index: number) => {
    if (index >= 0 && index < workflow.steps.length) {
      setCurrentStep(index);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToStep(currentStep - 1);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goToStep(currentStep + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  return (
    <div className="space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/workflows')}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-lg"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück zu Workflows
      </button>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-4">
          <CategoryBadge category={workflow.category} />
          <span className="text-sm text-muted-foreground">
            {workflow.steps.length} Schritte
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{workflow.title}</h1>
        <p className="mt-2 text-muted-foreground">{workflow.description}</p>
      </motion.div>

      {/* Stepper */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border/50 bg-card/50 p-6"
      >
        {/* Step indicators */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
          {workflow.steps.map((s, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              className={cn(
                'flex flex-col items-center gap-2 min-w-[80px] focus-ring rounded-lg p-2 transition-colors',
                index === currentStep && 'bg-primary/10'
              )}
            >
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                  index < currentStep
                    ? 'border-green-500 bg-green-500/20 text-green-400'
                    : index === currentStep
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground'
                )}
              >
                {index < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium text-center',
                  index === currentStep ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {s.title.length > 15 ? s.title.slice(0, 15) + '...' : s.title}
              </span>
            </button>
          ))}
        </div>

        {/* Current step content */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Schritt {currentStep + 1}: {step.title}
            </h2>
            <p className="text-muted-foreground">{step.description}</p>
          </div>

          {/* Embedded prompt */}
          {prompt && (
            <WorkflowStepPrompt
              prompt={prompt}
              workflowId={workflow.id}
              stepIndex={currentStep}
              defaultComplexity={defaultComplexity}
              globalVariables={globalVariables}
              addEntry={addEntry}
            />
          )}

          {!prompt && step.promptRef && (
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 text-sm text-amber-400">
              Prompt "{step.promptRef}" nicht gefunden.
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <button
              onClick={() => goToStep(currentStep - 1)}
              disabled={currentStep === 0}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-ring',
                currentStep === 0
                  ? 'text-muted-foreground cursor-not-allowed'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück
            </button>

            <span className="text-sm text-muted-foreground">
              {currentStep + 1} / {workflow.steps.length}
            </span>

            <button
              onClick={() => goToStep(currentStep + 1)}
              disabled={currentStep === workflow.steps.length - 1}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-ring',
                currentStep === workflow.steps.length - 1
                  ? 'text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              Weiter
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Workflow notes */}
      {workflow.body && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border/50 bg-card/50 p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Hinweise</h3>
          <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
            <ReactMarkdown>{workflow.body}</ReactMarkdown>
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface WorkflowStepPromptProps {
  prompt: ReturnType<typeof getPromptById>;
  workflowId: string;
  stepIndex: number;
  defaultComplexity: 'beginner' | 'intermediate' | 'expert';
  globalVariables: Record<string, string | undefined>;
  addEntry: (entry: any) => string;
}

function WorkflowStepPrompt({
  prompt,
  workflowId,
  stepIndex,
  defaultComplexity,
  globalVariables,
  addEntry,
}: WorkflowStepPromptProps) {
  if (!prompt) return null;

  const [selectedVariant, setSelectedVariant] = useState<'beginner' | 'intermediate' | 'expert'>(defaultComplexity);

  const formSchema = useMemo(() => {
    const shape: Record<string, z.ZodTypeAny> = {};
    prompt.variables.forEach((v) => {
      shape[v.name] = z.string().optional().default(v.default || '');
    });
    return z.object(shape);
  }, [prompt]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: prompt.variables.reduce((acc, v) => ({
      ...acc,
      [v.name]: globalVariables[v.name] || v.default || '',
    }), {}),
  });

  const formValues = form.watch();

  const currentVariantText = useMemo(() => {
    if (selectedVariant === 'beginner' && prompt.variants.beginner) {
      return prompt.variants.beginner;
    }
    if (selectedVariant === 'expert' && prompt.variants.expert) {
      return prompt.variants.expert;
    }
    return prompt.variants.default;
  }, [prompt, selectedVariant]);

  const resolvedText = useMemo(() => {
    return resolvePlaceholders(currentVariantText, formValues);
  }, [currentVariantText, formValues]);

  const segments = useMemo(() => {
    return segmentText(currentVariantText, formValues);
  }, [currentVariantText, formValues]);

  const handleCopy = useCallback(async (format: CopyFormat) => {
    const content = formatForCopy(format, resolvedText, {
      promptId: prompt.id,
      promptTitle: prompt.title,
      selectedVariant,
      resolvedVariables: formValues,
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
        workflowId,
        stepIndex,
      });

      toast.success('Kopiert & im Verlauf gespeichert');
    }
  }, [prompt, resolvedText, selectedVariant, formValues, addEntry, workflowId, stepIndex]);

  return (
    <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-5">
      <div className="flex items-center justify-between">
        <Link
          to={`/prompt-library/${prompt.id}`}
          className="font-semibold text-primary hover:underline flex items-center gap-1"
        >
          {prompt.title}
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>

        {/* Variant selector */}
        <div className="flex gap-1">
          {['beginner', 'intermediate', 'expert'].map((v) => {
            const available = v === 'intermediate' ||
              (v === 'beginner' && prompt.variants.beginner) ||
              (v === 'expert' && prompt.variants.expert);
            const labels = { beginner: 'E', intermediate: 'S', expert: 'X' };

            return (
              <button
                key={v}
                onClick={() => available && setSelectedVariant(v as typeof selectedVariant)}
                disabled={!available}
                title={{ beginner: 'Einsteiger', intermediate: 'Standard', expert: 'Experte' }[v]}
                className={cn(
                  'h-7 w-7 rounded text-xs font-medium transition-colors focus-ring',
                  selectedVariant === v
                    ? 'bg-primary text-primary-foreground'
                    : available
                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      : 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed'
                )}
              >
                {labels[v as keyof typeof labels]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Variables */}
      {prompt.variables.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {prompt.variables.map((variable) => (
            <div key={variable.name}>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                {variable.label}
              </label>
              <input
                {...form.register(variable.name as any)}
                placeholder={variable.default}
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          ))}
        </div>
      )}

      {/* Preview */}
      <div className="rounded-lg bg-secondary/30 p-3 font-mono text-xs max-h-48 overflow-y-auto">
        {segments.map((seg, i) => (
          <span
            key={i}
            className={cn(
              seg.type === 'placeholder_resolved' && 'bg-green-500/20 text-green-400 rounded px-0.5',
              seg.type === 'placeholder_unresolved' && 'bg-amber-500/20 text-amber-400 rounded px-0.5'
            )}
          >
            {seg.content}
          </span>
        ))}
      </div>

      {/* Copy button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-ring">
            <Copy className="h-3.5 w-3.5" />
            Kopieren
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {(['chat_markdown', 'json', 'raw_text'] as CopyFormat[]).map((format) => (
            <DropdownMenuItem key={format} onClick={() => handleCopy(format)}>
              {copyFormatLabels[format]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
