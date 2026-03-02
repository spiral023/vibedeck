'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { BookOpen, Code2, Database, FileCode, Layers, Lock, Rocket, Search, Zap, Image, ArrowLeft, Copy, Check, Eye, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { copyToClipboard } from '@/lib/copy-utils';
import { formatKnowledgeArticleMarkdown } from '@/lib/knowledge-export';
import { type KnowledgeArticle } from '@/types/knowledge';
import { Mermaid } from '@/components/Mermaid';
import { cn } from '@/lib/utils';
import { useContentStatusStore } from '@/stores/content-status-store';
import { removeVerbindungenSection } from '@/lib/knowledge-connections';

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Code2,
  Database,
  FileCode,
  Layers,
  Lock,
  Rocket,
  Search,
  Zap,
  Image,
};

const sourceTypeLabels: Record<NonNullable<KnowledgeArticle['sourceType']>, string> = {
  tweet: 'Tweet',
  blog: 'Blog',
  thread: 'Thread',
  docs: 'Docs',
};

const formatSourceDate = (value?: string) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString('de-DE');
};

interface ArticleViewProps {
  article: KnowledgeArticle;
}

export function ArticleView({ article }: ArticleViewProps) {
  const {
    markViewed,
    isViewed,
    isFavorite,
    isDone,
    toggleFavorite,
    toggleDone,
    runLegacyMigration,
  } = useContentStatusStore();
  const [mounted, setMounted] = useState(false);
  const Icon = iconMap[article.icon] || BookOpen;
  const formattedDate = formatSourceDate(article.sourceDate);
  const sourceLabel = article.sourceType
    ? sourceTypeLabels[article.sourceType] ?? article.sourceType
    : (article.author || formattedDate ? 'Quelle' : null);
  const sourceParts: string[] = [];

  if (sourceLabel) {
    sourceParts.push(sourceLabel);
  }

  if (article.author) {
    sourceParts.push(`von ${article.author}`);
  }

  if (formattedDate) {
    sourceParts.push(`vom ${formattedDate}`);
  }

  const sourceLine = sourceParts.length
    ? sourceParts.join(' ')
    : null;
  const connections = article.connections ?? [];
  const contentWithoutVerbindungen = removeVerbindungenSection(article.content);
  const tags = article.tags ?? [];
  const tagLine = tags.length > 0 ? `Tags: ${tags.join(', ')}` : null;
  const viewed = mounted && isViewed('knowledge', article.id);
  const favorite = mounted && isFavorite('knowledge', article.id);
  const done = mounted && isDone('knowledge', article.id);

  useEffect(() => {
    runLegacyMigration();
    markViewed('knowledge', article.id);
  }, [article.id, markViewed, runLegacyMigration]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopyMarkdown = async () => {
    const success = await copyToClipboard(formatKnowledgeArticleMarkdown(article));
    if (success) {
      toast.success('Markdown kopiert');
    } else {
      toast.error('Kopieren fehlgeschlagen');
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/knowledge"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück zur Übersicht
      </Link>

      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="prose prose-neutral dark:prose-invert max-w-none"
      >
        <div className="not-prose mb-6">
          <div className="flex flex-wrap items-start gap-4 mb-4">
            <div className="rounded-xl bg-primary/10 p-3">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                <span>{typeof article.readTime === 'number' ? `${article.readTime} Min.` : article.readTime} Lesezeit</span>
                {viewed && (
                  <>
                    <span className="text-muted-foreground/50">•</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-200/50 bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:border-blue-800/50 dark:text-blue-400">
                      <Eye className="h-3 w-3" />
                      Bereits aufgerufen
                    </span>
                  </>
                )}
                {(sourceLine || tagLine) && <span className="text-muted-foreground/50">•</span>}
                {sourceLine && (
                  <span>
                    {article.sourceURL ? (
                      <a
                        href={article.sourceURL}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-dotted underline-offset-4 hover:text-foreground"
                      >
                        {sourceLine}
                      </a>
                    ) : (
                      sourceLine
                    )}
                  </span>
                )}
                {tagLine && (
                  <>
                    {sourceLine && <span className="text-muted-foreground/50">•</span>}
                    <span>{tagLine}</span>
                  </>
                )}
              </p>
            </div>
            <div className="w-full sm:w-auto sm:ml-auto flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => toggleFavorite('knowledge', article.id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium focus-ring',
                  favorite
                    ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                <Heart className={cn('h-4 w-4', favorite && 'fill-current')} />
                {favorite ? 'Favorit' : 'Favorisieren'}
              </button>
              <button
                type="button"
                onClick={() => toggleDone('knowledge', article.id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium focus-ring',
                  done
                    ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                <Check className={cn('h-4 w-4', done && 'stroke-[3]')} />
                {done ? 'Erledigt' : 'Erledigen'}
              </button>
              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-ring"
              >
                <Copy className="h-4 w-4" />
                Copy as Markdown
              </button>
            </div>
          </div>
          {connections.length > 0 && (
            <div className="rounded-xl border border-border/60 bg-card/40 p-4">
              <h2 className="mb-2 text-sm font-semibold">Verbindungen</h2>
              <div className="flex flex-wrap gap-2">
                {connections.map((connection) => (
                  <Link
                    key={connection}
                    href={`/knowledge?connection=${encodeURIComponent(connection)}`}
                    className="rounded-full bg-secondary/70 px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary"
                  >
                    {connection}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ node, ...props }) => (
                <span className="block my-8">
                  <img
                    {...props}
                    className="rounded-xl shadow-lg border border-border/50"
                    alt={props.alt || ''}
                  />
                </span>
              ),
              code: ({ node, inline, className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || '');
                const isMermaid = match?.[1] === 'mermaid';

                if (!inline && isMermaid) {
                  return <Mermaid chart={String(children).replace(/\n$/, '')} />;
                }

                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {contentWithoutVerbindungen}
          </ReactMarkdown>
        </div>
      </motion.article>
    </div>
  );
}
