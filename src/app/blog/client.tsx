'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowUpDown, Calendar, Check, Copy, ExternalLink, Eye, Filter, Heart, Newspaper, Search, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { type BlogArticle } from '@/types/blog';
import { useContentStatusStore } from '@/stores/content-status-store';
import { copyToClipboard, stripMarkdown } from '@/lib/copy-utils';
import { createSearchFuse, normalizeSearchInput, searchDocuments as runSearchDocuments } from '@/lib/article-search';
import { type SearchDocument } from '@/types/search';
import { getBlogTagLabel } from '@/lib/blog-tags';
import { articleHasConnection } from '@/lib/knowledge-connections';
import { formatBlogArticleMarkdown } from '@/lib/blog-export';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BlogClientProps {
  articles: BlogArticle[];
}

type SortBy =
  | 'added-date-desc'
  | 'added-date-asc'
  | 'source-date-desc'
  | 'source-date-asc'
  | 'title';
type SourceTypeFilter = 'all' | 'blog' | 'tweet' | 'thread' | 'docs';

const sourceTypeLabels: Record<SourceTypeFilter, string> = {
  all: 'Alle Typen',
  blog: 'Blog',
  tweet: 'Tweet',
  thread: 'Thread',
  docs: 'Docs',
};

function formatDate(date?: string): string {
  if (!date) {
    return 'Unbekanntes Datum';
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function dateValue(date?: string): number {
  if (!date) {
    return 0;
  }

  const parsed = new Date(date).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

export function BlogClient({ articles }: BlogClientProps) {
  const searchParams = useSearchParams();
  const { isFavorite, isDone, isViewed, toggleFavorite, toggleDone } = useContentStatusStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>('added-date-desc');
  const [sourceType, setSourceType] = useState<SourceTypeFilter>('all');
  const [mounted, setMounted] = useState(false);
  const activeConnection = (searchParams.get('connection') ?? '').trim();

  useEffect(() => {
    setMounted(true);
  }, []);

  const tagStats = useMemo(() => {
    return articles.reduce<Record<string, number>>((acc, article) => {
      (article.tags ?? []).forEach((tag) => {
        acc[tag] = (acc[tag] ?? 0) + 1;
      });
      return acc;
    }, {});
  }, [articles]);

  const allTags = useMemo(() => {
    return Object.entries(tagStats)
      .sort((a, b) => b[1] - a[1] || getBlogTagLabel(a[0]).localeCompare(getBlogTagLabel(b[0]), 'de-DE'))
      .map(([tag]) => tag);
  }, [tagStats]);

  const searchIndexDocuments = useMemo<SearchDocument[]>(() => {
    return articles.map((article) => ({
      id: article.id,
      domain: 'blog',
      path: `/blog/${article.id}`,
      title: article.title,
      description: article.description,
      tags: Array.from(new Set((article.tags ?? []).flatMap((tag) => [tag, getBlogTagLabel(tag)]))),
      author: article.author,
      sourceType: article.sourceType,
      sourceDate: article.sourceDate,
      addedDate: article.addedDate,
      keyPoints: article.keyPoints,
      searchText: normalizeSearchInput(stripMarkdown(article.content)),
    }));
  }, [articles]);

  const articleById = useMemo(() => {
    return new Map(articles.map((article) => [article.id, article]));
  }, [articles]);

  const searchFuse = useMemo(() => createSearchFuse(searchIndexDocuments), [searchIndexDocuments]);

  const compareBySort = useCallback((a: BlogArticle, b: BlogArticle) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'added-date-asc') {
      const diff = dateValue(a.addedDate) - dateValue(b.addedDate);
      if (diff !== 0) return diff;
      const sourceDiff = dateValue(a.sourceDate) - dateValue(b.sourceDate);
      if (sourceDiff !== 0) return sourceDiff;
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'added-date-desc') {
      const diff = dateValue(b.addedDate) - dateValue(a.addedDate);
      if (diff !== 0) return diff;
      const sourceDiff = dateValue(b.sourceDate) - dateValue(a.sourceDate);
      if (sourceDiff !== 0) return sourceDiff;
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'source-date-asc') {
      const diff = dateValue(a.sourceDate) - dateValue(b.sourceDate);
      if (diff !== 0) return diff;
      return a.title.localeCompare(b.title);
    }
    const diff = dateValue(b.sourceDate) - dateValue(a.sourceDate);
    if (diff !== 0) return diff;
    return a.title.localeCompare(b.title);
  }, [sortBy]);

  const filtered = useMemo(() => {
    const normalizedSearch = normalizeSearchInput(searchQuery);

    const baseFiltered = articles.filter((article) => {
      const matchesSourceType = sourceType === 'all' || article.sourceType === sourceType;
      const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) =>
        (article.tags ?? []).includes(tag)
      );
      const matchesConnection = !activeConnection || articleHasConnection(article.connections, activeConnection);
      return matchesSourceType && matchesTags && matchesConnection;
    });

    if (!normalizedSearch) {
      return [...baseFiltered].sort(compareBySort);
    }

    const allowedIds = new Set(baseFiltered.map((article) => article.id));

    const rankedResults = runSearchDocuments(searchFuse, normalizedSearch, articles.length)
      .filter((result) => allowedIds.has(result.item.id))
      .map((result) => {
        const article = articleById.get(result.item.id);
        if (!article) {
          return null;
        }
        return { article, score: result.score };
      })
      .filter((entry): entry is { article: BlogArticle; score: number } => entry !== null);

    return rankedResults
      .sort((a, b) => {
        if (a.score !== b.score) {
          return a.score - b.score;
        }
        return compareBySort(a.article, b.article);
      })
      .map((entry) => entry.article);
  }, [articles, searchQuery, selectedTags, sourceType, activeConnection, compareBySort, searchFuse, articleById]);

  const handleCopyMarkdown = useCallback(async (article: BlogArticle) => {
    const success = await copyToClipboard(formatBlogArticleMarkdown(article));
    if (success) {
      toast.success('Markdown kopiert');
    } else {
      toast.error('Kopieren fehlgeschlagen');
    }
  }, []);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight lg:text-4xl">
          <Newspaper className="h-8 w-8 text-primary" />
          Blog
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Kuratierte deutsche Blogartikel mit Kernaussagen, Quellenlink und Tag-Filter.
        </p>
        {activeConnection && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-medium text-primary">
              Verbindung: {activeConnection}
            </span>
            <Link href="/blog" className="text-muted-foreground underline decoration-dotted underline-offset-4 hover:text-foreground">
              Filter zurücksetzen
            </Link>
          </div>
        )}
      </motion.div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Blogartikel durchsuchen..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="h-12 w-full rounded-2xl border border-border/50 bg-card/50 pl-12 pr-4 focus:border-primary focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>{filtered.length} Artikel</span>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="w-full sm:w-[180px]">
            <Select value={sourceType} onValueChange={(value) => setSourceType(value as SourceTypeFilter)}>
              <SelectTrigger className="h-11 rounded-xl border-border/50 bg-card/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(sourceTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-[220px]">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
              <SelectTrigger className="h-11 rounded-xl border-border/50 bg-card/50">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="added-date-desc">Hinzugefügt (Neu zuerst)</SelectItem>
                <SelectItem value="added-date-asc">Hinzugefügt (Alt zuerst)</SelectItem>
                <SelectItem value="source-date-desc">Originaldatum (Neu zuerst)</SelectItem>
                <SelectItem value="source-date-asc">Originaldatum (Alt zuerst)</SelectItem>
                <SelectItem value="title">Titel (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTags([])}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-colors',
              selectedTags.length === 0
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            Alle Tags
          </button>
          {allTags.map((tag) => {
            const isActive = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => setSelectedTags((prev) => (
                  prev.includes(tag)
                    ? prev.filter((item) => item !== tag)
                    : [...prev, tag]
                ))}
                className={cn(
                  'rounded-full px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary ring-1 ring-primary/30'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
                aria-pressed={isActive}
              >
                {getBlogTagLabel(tag)}
                <span className={cn('ml-2 text-xs', isActive ? 'text-primary' : 'text-muted-foreground')}>
                  {tagStats[tag]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-8 text-center">
          <p className="text-base font-medium">Keine Blogartikel gefunden.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Passe Suche, Tags oder Sortierung an.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((article, index) => {
            const points = (article.keyPoints ?? []).slice(0, 3);
            const articleDone = mounted && isDone('blog', article.id);
            const articleViewed = mounted && isViewed('blog', article.id);
            const articleFavorite = mounted && isFavorite('blog', article.id);

            return (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className={cn(
                  'rounded-2xl border border-border/50 bg-card/50 p-6 transition-all hover:border-primary/30 hover:bg-card',
                  articleDone && 'opacity-80'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold leading-tight">
                      <Link href={`/blog/${article.id}`} className="transition-colors hover:text-primary">
                        {article.title}
                        {articleDone && <span className="ml-2 text-xs text-green-500">✓</span>}
                      </Link>
                    </h2>
                    <Link
                      href={`/blog/${article.id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      Details öffnen
                    </Link>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(article.sourceDate)}
                      </span>
                      {article.sourceType && (
                        <span className="rounded-full bg-secondary/60 px-2 py-0.5 font-medium uppercase tracking-wide text-secondary-foreground">
                          {article.sourceType}
                        </span>
                      )}
                      {articleViewed && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-blue-200/50 bg-blue-500/10 px-2 py-0.5 font-medium text-blue-600 dark:border-blue-800/50 dark:text-blue-400">
                          <Eye className="h-3 w-3" />
                          Gesehen
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {article.sourceURL && (
                      <a
                        href={article.sourceURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-border/70 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Original
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {article.description}
                </p>

                <div className="mt-5">
                  <h3 className="text-sm font-semibold">3 wichtigste Kernaussagen</h3>
                  {points.length > 0 ? (
                    <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                      {points.map((point, pointIndex) => (
                        <li key={`${article.id}-point-${pointIndex}`} className="flex gap-2">
                          <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-primary/70" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">Keine Kernaussagen hinterlegt.</p>
                  )}
                </div>

                {(article.tags ?? []).length > 0 && (
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                    {article.tags?.map((tag) => (
                      <span
                        key={`${article.id}-${tag}`}
                        className="rounded-full bg-secondary/70 px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                      >
                        {getBlogTagLabel(tag)}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => toggleDone('blog', article.id)}
                    className={cn(
                      'inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium focus-ring transition-colors',
                      articleDone
                        ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-400'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    )}
                  >
                    <Check className={cn('h-4 w-4', articleDone && 'stroke-[3]')} />
                    {articleDone ? 'Als gelesen markiert' : 'Als gelesen markieren'}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFavorite('blog', article.id)}
                    className={cn(
                      'inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium focus-ring transition-colors',
                      articleFavorite
                        ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-400'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    )}
                  >
                    <Heart className={cn('h-4 w-4', articleFavorite && 'fill-current')} />
                    {articleFavorite ? 'Favorisiert' : 'Favorisieren'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleCopyMarkdown(article)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 focus-ring"
                  >
                    <Copy className="h-4 w-4" />
                    Als Markdown kopieren
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}
