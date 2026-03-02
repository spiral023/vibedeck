'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, Check, Copy, ExternalLink, Eye, Heart, Newspaper } from 'lucide-react';
import { toast } from 'sonner';
import { copyToClipboard } from '@/lib/copy-utils';
import { Mermaid } from '@/components/Mermaid';
import { type BlogArticle } from '@/types/blog';
import { useContentStatusStore } from '@/stores/content-status-store';
import { cn } from '@/lib/utils';
import { formatBlogArticleMarkdown } from '@/lib/blog-export';
import { getBlogTagLabel } from '@/lib/blog-tags';
import { removeVerbindungenSection } from '@/lib/knowledge-connections';

const sourceTypeLabels: Record<NonNullable<BlogArticle['sourceType']>, string> = {
  tweet: 'Tweet',
  blog: 'Blog',
  thread: 'Thread',
  docs: 'Docs',
};

const formatDate = (value?: string) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString('de-DE');
};

interface BlogArticleViewProps {
  article: BlogArticle;
}

export function BlogArticleView({ article }: BlogArticleViewProps) {
  const { markViewed, isViewed, isFavorite, isDone, toggleFavorite, toggleDone } = useContentStatusStore();
  const [mounted, setMounted] = useState(false);
  const formattedDate = formatDate(article.sourceDate);
  const sourceLabel = article.sourceType
    ? sourceTypeLabels[article.sourceType] ?? article.sourceType
    : null;
  const viewed = mounted && isViewed('blog', article.id);
  const favorite = mounted && isFavorite('blog', article.id);
  const done = mounted && isDone('blog', article.id);
  const connections = article.connections ?? [];
  const contentWithoutVerbindungen = removeVerbindungenSection(article.content);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    markViewed('blog', article.id);
  }, [article.id, markViewed]);

  const handleCopyMarkdown = async () => {
    const success = await copyToClipboard(formatBlogArticleMarkdown(article));
    if (success) {
      toast.success('Markdown kopiert');
    } else {
      toast.error('Kopieren fehlgeschlagen');
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück zur Blog-Übersicht
      </Link>

      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="prose prose-neutral dark:prose-invert max-w-none"
      >
        <div className="not-prose mb-6">
          <div className="mb-4 flex flex-wrap items-start gap-4">
            <div className="rounded-xl bg-primary/10 p-3">
              <Newspaper className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="mb-2 text-3xl font-bold">{article.title}</h1>
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                <span>{article.readTime} Lesezeit</span>
                {viewed && (
                  <>
                    <span className="text-muted-foreground/50">•</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-200/50 bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:border-blue-800/50 dark:text-blue-400">
                      <Eye className="h-3 w-3" />
                      Bereits aufgerufen
                    </span>
                  </>
                )}
                {(sourceLabel || article.author || formattedDate) && (
                  <span className="text-muted-foreground/50">•</span>
                )}
                {sourceLabel && <span>{sourceLabel}</span>}
                {article.author && <span>von {article.author}</span>}
                {formattedDate && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formattedDate}
                  </span>
                )}
                {article.sourceURL && (
                  <>
                    <span className="text-muted-foreground/50">•</span>
                    <a
                      href={article.sourceURL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-4 hover:text-foreground"
                    >
                      Original lesen
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </>
                )}
              </p>
            </div>
            <div className="w-full sm:ml-auto sm:w-auto flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => toggleFavorite('blog', article.id)}
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
                onClick={() => toggleDone('blog', article.id)}
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

          {(article.tags?.length ?? 0) > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {article.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary/70 px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                >
                  {getBlogTagLabel(tag)}
                </span>
              ))}
            </div>
          )}

          {(article.keyPoints?.length ?? 0) > 0 && (
            <div className="rounded-xl border border-border/60 bg-card/40 p-4">
              <h2 className="mb-2 text-sm font-semibold">3 wichtigste Kernaussagen</h2>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {article.keyPoints?.slice(0, 3).map((point, idx) => (
                  <li key={`point-${idx}`} className="flex gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-primary/70" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {connections.length > 0 && (
            <div className="rounded-xl border border-border/60 bg-card/40 p-4">
              <h2 className="mb-2 text-sm font-semibold">Verbindungen</h2>
              <div className="flex flex-wrap gap-2">
                {connections.map((connection) => (
                  <Link
                    key={connection}
                    href={`/blog?connection=${encodeURIComponent(connection)}`}
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
                <span className="my-8 block">
                  <img
                    {...props}
                    className="rounded-xl border border-border/50 shadow-lg"
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
