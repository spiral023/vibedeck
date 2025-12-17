import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Calendar, ExternalLink, GitBranch, Package, Tag } from 'lucide-react';
import { getPromptById } from '@/data/prompts';
import { CategoryBadge, ComplexityBadge, TagBadge } from '@/components/ui/badges';
import { cn } from '@/lib/utils';

export function PromptDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const prompt = id ? getPromptById(id) : undefined;

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
            Aktualisiert: {new Intl.DateTimeFormat('de-DE', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }).format(new Date(prompt.updatedDate))}
          </span>
          {prompt.agent_role && (
            <span className="flex items-center gap-1.5">
              <Tag className="h-4 w-4" />
              Rolle: {prompt.agent_role}
            </span>
          )}
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-8 lg:col-span-2">
          {/* Pre-prompt */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border/50 bg-card/50 p-6"
          >
            <h2 className="mb-4 text-xl font-semibold">System-Prompt</h2>
            <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
              <ReactMarkdown>{prompt.pre_prompt}</ReactMarkdown>
            </div>
          </motion.section>

          {/* Variants */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border/50 bg-card/50 p-6"
          >
            <h2 className="mb-4 text-xl font-semibold">Prompt-Varianten</h2>
            <div className="space-y-6">
              {/* Default */}
              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">Standard</h3>
                <div className="rounded-xl bg-secondary/50 p-4 font-mono text-sm whitespace-pre-wrap">
                  {prompt.variants.default}
                </div>
              </div>

              {/* Beginner */}
              {prompt.variants.beginner && (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Einsteiger</h3>
                  <div className="rounded-xl bg-secondary/50 p-4 font-mono text-sm whitespace-pre-wrap">
                    {prompt.variants.beginner}
                  </div>
                </div>
              )}

              {/* Expert */}
              {prompt.variants.expert && (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Experte</h3>
                  <div className="rounded-xl bg-secondary/50 p-4 font-mono text-sm whitespace-pre-wrap">
                    {prompt.variants.expert}
                  </div>
                </div>
              )}
            </div>
          </motion.section>

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
          {/* Variables */}
          {prompt.variables.length > 0 && (
            <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
              <h3 className="mb-3 font-semibold">Variablen</h3>
              <ul className="space-y-2">
                {prompt.variables.map((v) => (
                  <li key={v.name} className="text-sm">
                    <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">
                      {'{{' + v.name + '}}'}
                    </code>
                    <span className="ml-2 text-muted-foreground">{v.label}</span>
                    {v.default && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        (Standard: {v.default})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

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
