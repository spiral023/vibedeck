'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { BookOpen, Code2, Database, FileCode, Layers, Lock, Rocket, Search, Zap, Image, ArrowLeft, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { copyToClipboard } from '@/lib/copy-utils';
import { formatKnowledgeArticleMarkdown } from '@/lib/knowledge-export';
import { type KnowledgeArticle } from '@/types/knowledge';

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
  const tags = article.tags ?? [];
  const tagLine = tags.length > 0 ? `Tags: ${tags.join(', ')}` : null;

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
                <span>{article.readTime} Lesezeit</span>
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
            <div className="w-full sm:w-auto sm:ml-auto">
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
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>
      </motion.article>
    </div>
  );
}
