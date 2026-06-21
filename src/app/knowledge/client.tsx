'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  BookOpen, Code2, Database, FileCode, Layers, Lock, Rocket, Search, Zap, Image,
  Calendar, ArrowUpDown, BarChart, Flame, Heart, Check, Eye, Copy, ArrowRight,
  Hash, Clock, X, Sparkles, FileSearch,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { type KnowledgeArticle } from '@/types/knowledge';
import { useContentStatusStore } from '@/stores/content-status-store';
import { copyToClipboard, stripMarkdown } from '@/lib/copy-utils';
import { createSearchFuse, normalizeSearchInput, searchDocuments as runSearchDocuments } from '@/lib/article-search';
import { type SearchDocument } from '@/types/search';
import { articleHasConnection } from '@/lib/knowledge-connections';
import { formatKnowledgeArticleMarkdown } from '@/lib/knowledge-export';
import { parseReadTimeToMinutes, sumReadTimes, formatDurationMinutes } from '@/lib/read-time';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const levelConfig: Record<string, { label: string; color: string }> = {
  beginner: { label: 'Einsteiger', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50' },
  intermediate: { label: 'Fortgeschritten', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50' },
  advanced: { label: 'Profi', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200/50 dark:border-purple-800/50' },
};

interface KnowledgeClientProps {
  articles: KnowledgeArticle[];
}

type SortBy =
  | 'added-date-desc'
  | 'added-date-asc'
  | 'source-date-desc'
  | 'source-date-asc'
  | 'read-time-desc'
  | 'read-time-asc'
  | 'title'
  | 'level';
type LevelFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

const levelWeight: Record<string, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

function isSortBy(value: string): value is SortBy {
  return [
    'added-date-desc',
    'added-date-asc',
    'source-date-desc',
    'source-date-asc',
    'read-time-desc',
    'read-time-asc',
    'title',
    'level',
  ].includes(value);
}

function dateValue(date?: string): number {
  if (!date) {
    return 0;
  }

  const parsed = new Date(date).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

export function KnowledgeClient({ articles }: KnowledgeClientProps) {
  const searchParams = useSearchParams();
  const {
    isFavorite,
    isDone,
    isViewed,
    toggleFavorite,
    toggleDone,
    runLegacyMigration,
  } = useContentStatusStore();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('added-date-desc');
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>('all');
  const [showHotOnly, setShowHotOnly] = useState(true);
  const activeConnection = (searchParams.get('connection') ?? '').trim();
  const [showAllTags, setShowAllTags] = useState(false);
  const [canExpandTags, setCanExpandTags] = useState(false);
  const [collapsedTagHeight, setCollapsedTagHeight] = useState<number | null>(null);
  const tagContainerRef = useRef<HTMLDivElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    runLegacyMigration();
  }, [runLegacyMigration]);

  // Load from local storage on mount
  useEffect(() => {
    const savedSortBy = localStorage.getItem('vibedeck-knowledge-sortBy');
    if (savedSortBy === 'date') {
      setSortBy('source-date-desc');
    } else if (savedSortBy && isSortBy(savedSortBy)) {
      setSortBy(savedSortBy);
    } else if (savedSortBy) {
      setSortBy('added-date-desc');
    }

    const savedLevel = localStorage.getItem('vibedeck-knowledge-selectedLevel');
    if (savedLevel) setSelectedLevel(savedLevel as LevelFilter);

    const savedHot = localStorage.getItem('vibedeck-knowledge-showHotOnly');
    if (savedHot !== null) setShowHotOnly(savedHot === 'true');

    const savedTags = localStorage.getItem('vibedeck-knowledge-selectedTags');
    if (savedTags) {
      try {
        setSelectedTags(JSON.parse(savedTags));
      } catch (e) {
        console.error("Failed to parse tags", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('vibedeck-knowledge-sortBy', sortBy);
    localStorage.setItem('vibedeck-knowledge-selectedLevel', selectedLevel);
    localStorage.setItem('vibedeck-knowledge-showHotOnly', String(showHotOnly));
    localStorage.setItem('vibedeck-knowledge-selectedTags', JSON.stringify(selectedTags));
  }, [sortBy, selectedLevel, showHotOnly, selectedTags, isLoaded]);

  const tagStats = articles.reduce<Record<string, number>>((acc, article) => {
    (article.tags ?? []).forEach((tag) => {
      acc[tag] = (acc[tag] ?? 0) + 1;
    });
    return acc;
  }, {});

  const allTags = Object.entries(tagStats)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);

  // Aggregated stats for the header strip
  const stats = useMemo(() => {
    const totalReadMin = sumReadTimes(articles.map((a) => a.readTime));
    const hotCount = articles.filter((a) => a.hot).length;
    return {
      total: articles.length,
      readTime: formatDurationMinutes(totalReadMin),
      hot: hotCount,
      tagCount: allTags.length,
    };
  }, [articles, allTags.length]);

  const searchIndexDocuments = useMemo<SearchDocument[]>(() => {
    return articles.map((article) => ({
      id: article.id,
      domain: 'knowledge',
      path: `/knowledge/${article.id}`,
      title: article.title,
      description: article.description,
      tags: article.tags,
      author: article.author,
      sourceType: article.sourceType,
      sourceDate: article.sourceDate,
      addedDate: article.addedDate,
      searchText: normalizeSearchInput(stripMarkdown(article.content)),
    }));
  }, [articles]);

  const articleById = useMemo(() => {
    return new Map(articles.map((article) => [article.id, article]));
  }, [articles]);

  const searchFuse = useMemo(() => createSearchFuse(searchIndexDocuments), [searchIndexDocuments]);

  const compareBySort = useCallback((a: KnowledgeArticle, b: KnowledgeArticle) => {
    if (sortBy === 'added-date-desc') {
      const diff = dateValue(b.addedDate) - dateValue(a.addedDate);
      if (diff !== 0) {
        return diff;
      }
      const sourceDiff = dateValue(b.sourceDate) - dateValue(a.sourceDate);
      if (sourceDiff !== 0) {
        return sourceDiff;
      }
      return a.title.localeCompare(b.title);
    }

    if (sortBy === 'added-date-asc') {
      const diff = dateValue(a.addedDate) - dateValue(b.addedDate);
      if (diff !== 0) {
        return diff;
      }
      const sourceDiff = dateValue(a.sourceDate) - dateValue(b.sourceDate);
      if (sourceDiff !== 0) {
        return sourceDiff;
      }
      return a.title.localeCompare(b.title);
    }

    if (sortBy === 'source-date-desc') {
      const diff = dateValue(b.sourceDate) - dateValue(a.sourceDate);
      if (diff !== 0) {
        return diff;
      }
      return a.title.localeCompare(b.title);
    }

    if (sortBy === 'source-date-asc') {
      const diff = dateValue(a.sourceDate) - dateValue(b.sourceDate);
      if (diff !== 0) {
        return diff;
      }
      return a.title.localeCompare(b.title);
    }

    if (sortBy === 'read-time-desc') {
      const diff = parseReadTimeToMinutes(b.readTime) - parseReadTimeToMinutes(a.readTime);
      if (diff !== 0) {
        return diff;
      }
      return a.title.localeCompare(b.title);
    }

    if (sortBy === 'read-time-asc') {
      const diff = parseReadTimeToMinutes(a.readTime) - parseReadTimeToMinutes(b.readTime);
      if (diff !== 0) {
        return diff;
      }
      return a.title.localeCompare(b.title);
    }

    if (sortBy === 'level') {
      const weightA = a.level ? levelWeight[a.level] ?? 4 : 4;
      const weightB = b.level ? levelWeight[b.level] ?? 4 : 4;
      if (weightA !== weightB) {
        return weightA - weightB;
      }
      return a.title.localeCompare(b.title);
    }
    return a.title.localeCompare(b.title);
  }, [sortBy]);

  const filtered = useMemo(() => {
    const normalizedQuery = normalizeSearchInput(searchQuery);

    const baseFiltered = articles.filter((article) => {
      const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) =>
        (article.tags ?? []).includes(tag)
      );
      const matchesLevel = selectedLevel === 'all' || article.level === selectedLevel;
      const matchesHot = !showHotOnly || article.hot;
      const matchesConnection = !activeConnection || articleHasConnection(article.connections, activeConnection);
      return matchesTags && matchesLevel && matchesHot && matchesConnection;
    });

    if (!normalizedQuery) {
      return [...baseFiltered].sort(compareBySort);
    }

    const allowedIds = new Set(baseFiltered.map((article) => article.id));

    const rankedResults = runSearchDocuments(searchFuse, normalizedQuery, articles.length)
      .filter((result) => allowedIds.has(result.item.id))
      .map((result) => {
        const article = articleById.get(result.item.id);
        if (!article) {
          return null;
        }
        return { article, score: result.score };
      })
      .filter((entry): entry is { article: KnowledgeArticle; score: number } => entry !== null);

    return rankedResults
      .sort((a, b) => {
        if (a.score !== b.score) {
          return a.score - b.score;
        }
        return compareBySort(a.article, b.article);
      })
      .map((entry) => entry.article);
  }, [
    articles,
    searchQuery,
    selectedTags,
    selectedLevel,
    showHotOnly,
    activeConnection,
    compareBySort,
    searchFuse,
    articleById,
  ]);

  const handleCopyMarkdown = useCallback(async (article: KnowledgeArticle) => {
    const success = await copyToClipboard(formatKnowledgeArticleMarkdown(article));
    if (success) {
      toast.success('Markdown kopiert');
    } else {
      toast.error('Kopieren fehlgeschlagen');
    }
  }, []);

  const updateTagLayout = useCallback(() => {
    const container = tagContainerRef.current;
    if (!container) {
      return;
    }

    const tagButton = container.querySelector<HTMLButtonElement>('button');
    if (!tagButton) {
      setCanExpandTags(false);
      setCollapsedTagHeight(null);
      return;
    }

    const styles = window.getComputedStyle(container);
    const rowGapValue = styles.rowGap || styles.gap || '0';
    const rowGap = Number.parseFloat(rowGapValue) || 0;
    const tagHeight = tagButton.offsetHeight;
    const maxHeight = tagHeight * 2 + rowGap;

    setCollapsedTagHeight(maxHeight);
    setCanExpandTags(container.scrollHeight > maxHeight + 1);
  }, []);

  useEffect(() => {
    updateTagLayout();

    const container = tagContainerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => updateTagLayout());
    observer.observe(container);

    return () => observer.disconnect();
  }, [updateTagLayout, allTags.length]);

  const hasActiveFilter =
    selectedLevel !== 'all' ||
    selectedTags.length > 0 ||
    !!activeConnection ||
    searchQuery.trim().length > 0;

  const resetAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedTags([]);
    setSelectedLevel('all');
  }, []);

  return (
    <div className="space-y-8">
      {/* Header with atmospheric background */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-radial px-6 py-8 sm:px-8 sm:py-10"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" />
        <div className="relative">
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Wissensbasis
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
            Dokumentation und Best Practices für AI-gestützte Entwicklung.
          </p>

          {/* Stats strip */}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary/70" />
              <span className="font-mono tabular-nums text-foreground">{stats.total}</span>
              <span>Artikel</span>
            </div>
            <span className="h-1 w-1 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-primary/70" />
              <span className="font-mono tabular-nums text-foreground">{stats.readTime}</span>
              <span>Lesezeit</span>
            </div>
            <span className="h-1 w-1 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <Flame className="h-3.5 w-3.5 text-red-500/80" />
              <span className="font-mono tabular-nums text-foreground">{stats.hot}</span>
              <span>Hot</span>
            </div>
            <span className="h-1 w-1 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <Hash className="h-3.5 w-3.5 text-primary/70" />
              <span className="font-mono tabular-nums text-foreground">{stats.tagCount}</span>
              <span>Themen</span>
            </div>
          </div>

          {activeConnection && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-medium text-primary">
                <span className="font-mono text-xs uppercase tracking-wider opacity-70">Verbindung</span>
                {activeConnection}
              </span>
              <Link href="/knowledge" className="text-muted-foreground underline decoration-dotted underline-offset-4 hover:text-foreground">
                zurücksetzen
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* Sticky filter bar */}
      <div className="sticky top-0 z-20 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-2 backdrop-blur-md bg-background/80 border-b border-border/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Artikel durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-border/50 bg-card/50 pl-12 pr-10 h-12 focus:border-primary focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                aria-label="Suche zurücksetzen"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
            <button
              onClick={() => setShowHotOnly(!showHotOnly)}
              className={cn(
                "flex items-center gap-2 px-4 h-12 rounded-2xl border transition-colors",
                showHotOnly
                  ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
                  : "bg-card/50 border-border/50 text-muted-foreground hover:bg-card hover:text-foreground"
              )}
            >
              <Flame className={cn("h-4 w-4", showHotOnly && "fill-current")} />
              <span className="font-medium">Hot</span>
            </button>
            <div className="w-[160px]">
              <Select value={selectedLevel} onValueChange={(value) => setSelectedLevel(value as LevelFilter)}>
                <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-card/50 px-4 focus:ring-0 focus:ring-offset-0">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-muted-foreground rotate-90" />
                    <SelectValue placeholder="Level" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Level</SelectItem>
                  <SelectItem value="beginner">Einsteiger</SelectItem>
                  <SelectItem value="intermediate">Fortgeschritten</SelectItem>
                  <SelectItem value="advanced">Profi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-[200px]">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
                <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-card/50 px-4 focus:ring-0 focus:ring-offset-0">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Sortieren" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="added-date-desc">Hinzugefügt (Neu zuerst)</SelectItem>
                  <SelectItem value="added-date-asc">Hinzugefügt (Alt zuerst)</SelectItem>
                  <SelectItem value="source-date-desc">Originaldatum (Neu zuerst)</SelectItem>
                  <SelectItem value="source-date-asc">Originaldatum (Alt zuerst)</SelectItem>
                  <SelectItem value="read-time-desc">Lesezeit (Lang zuerst)</SelectItem>
                  <SelectItem value="read-time-asc">Lesezeit (Kurz zuerst)</SelectItem>
                  <SelectItem value="title">Titel (A-Z)</SelectItem>
                  <SelectItem value="level">Level (Aufsteigend)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Result count + active filter chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-mono tabular-nums text-muted-foreground">
            <span className="text-foreground font-semibold">{filtered.length}</span>
            <span className="mx-1 opacity-50">/</span>
            <span>{articles.length}</span>
            <span className="ml-1.5">Artikel</span>
          </span>
          {selectedLevel !== 'all' && levelConfig[selectedLevel] && (
            <button
              onClick={() => setSelectedLevel('all')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-opacity hover:opacity-80',
                levelConfig[selectedLevel].color
              )}
            >
              {levelConfig[selectedLevel].label}
              <X className="h-3 w-3" />
            </button>
          )}
          {selectedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTags((prev) => prev.filter((t) => t !== tag))}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary hover:opacity-80 transition-opacity"
            >
              <Hash className="h-3 w-3" />
              {tag}
              <X className="h-3 w-3" />
            </button>
          ))}
          {hasActiveFilter && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-[11px] text-muted-foreground hover:text-foreground underline decoration-dotted underline-offset-4"
            >
              Alle Filter löschen
            </button>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
            Themen
            <span className="ml-2 tabular-nums opacity-60">{allTags.length}</span>
          </h2>
          {canExpandTags && (
            <button
              type="button"
              onClick={() => setShowAllTags((prev) => !prev)}
              className="text-xs font-medium text-primary hover:underline"
            >
              {showAllTags ? 'Weniger' : 'Alle anzeigen'}
            </button>
          )}
        </div>
        <div
          ref={tagContainerRef}
          className="flex flex-wrap gap-2 transition-[max-height] duration-300"
          style={!showAllTags && collapsedTagHeight ? { maxHeight: `${collapsedTagHeight}px`, overflow: 'hidden' } : undefined}
        >
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
                onClick={() => {
                  setSelectedTags((prev) => (
                    prev.includes(tag)
                      ? prev.filter((item) => item !== tag)
                      : [...prev, tag]
                  ));
                }}
                className={cn(
                  'rounded-full px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary ring-1 ring-primary/30'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
                aria-pressed={isActive}
              >
                <span>{tag}</span>
                <span className={cn(
                  'ml-2 text-xs font-mono tabular-nums',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}>
                  {tagStats[tag]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles or empty state */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-dashed border-border/60 bg-card/30 px-6 py-16 text-center"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <FileSearch className="h-7 w-7 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Keine Artikel gefunden</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Deine Filter sind zu eng. Setze sie zurück, um mehr zu sehen.
          </p>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-ring"
            >
              <X className="h-4 w-4" />
              Filter löschen
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article, index) => {
            const Icon = iconMap[article.icon] || BookOpen;
            const tags = article.tags ?? [];
            const visibleTags = tags.slice(0, 3);
            const extraTagCount = tags.length - visibleTags.length;
            const levelInfo = article.level ? levelConfig[article.level] : null;
            const isFav = isLoaded && isFavorite('knowledge', article.id);
            const articleDone = isLoaded && isDone('knowledge', article.id);
            const viewed = isLoaded && isViewed('knowledge', article.id);
            const readTimeLabel = typeof article.readTime === 'number' ? `${article.readTime} Min` : article.readTime;

            // Stagger only the first 12 cards to keep total animation under ~600ms
            const delay = Math.min(index, 11) * 0.04;

            return (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay, duration: 0.3 }}
                className="group"
              >
                <Link
                  href={`/knowledge/${article.id}`}
                  className="block h-full focus-ring rounded-2xl"
                >
                  <div className={cn(
                    'relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-5 flex flex-col',
                    'transition-all duration-300',
                    'hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/5',
                    article.hot && 'hover:shadow-red-500/10',
                    articleDone && 'opacity-75'
                  )}>
                    {/* Hot accent ribbon */}
                    {article.hot && (
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                    )}

                    {/* Quick actions - top right (hover) */}
                    <div className="absolute right-3 top-3 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite('knowledge', article.id);
                        }}
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-lg bg-background/80 backdrop-blur transition-colors focus-ring',
                          isFav
                            ? 'text-red-500 hover:bg-red-500/10'
                            : 'text-muted-foreground hover:bg-accent hover:text-red-500'
                        )}
                        title={isFav ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                        aria-label={isFav ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                      >
                        <Heart className={cn('h-4 w-4', isFav && 'fill-current')} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleDone('knowledge', article.id);
                        }}
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-lg bg-background/80 backdrop-blur transition-colors focus-ring',
                          articleDone
                            ? 'text-green-500 hover:bg-green-500/10'
                            : 'text-muted-foreground hover:bg-accent hover:text-green-500'
                        )}
                        title={articleDone ? 'Als ungelesen markieren' : 'Als gelesen markieren'}
                        aria-label={articleDone ? 'Als ungelesen markieren' : 'Als gelesen markieren'}
                      >
                        <Check className={cn('h-4 w-4', articleDone && 'stroke-[3]')} />
                      </button>
                    </div>

                    {/* Icon + Badges row */}
                    <div className="mb-4 flex items-start justify-between gap-2 pr-20">
                      <div className={cn(
                        'rounded-xl p-2.5 transition-colors',
                        article.hot ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex flex-wrap justify-end gap-1.5">
                        {viewed && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50">
                            <Eye className="h-3 w-3" />
                            Gesehen
                          </span>
                        )}
                        {article.hot && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border-red-200/50 dark:border-red-800/50">
                            <Flame className="h-3 w-3" />
                            Hot
                          </span>
                        )}
                        {levelInfo && (
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider",
                            levelInfo.color
                          )}>
                            {levelInfo.label}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title + meta */}
                    <div className="space-y-2 mb-2">
                      <h3 className="font-semibold leading-snug text-balance group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-mono tabular-nums">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {readTimeLabel}
                        </span>
                        {article.sourceDate && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(article.sourceDate).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {article.description}
                    </p>

                    {/* Tags */}
                    {visibleTags.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {visibleTags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-secondary/70 px-2.5 py-1 text-[11px] font-medium text-secondary-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                        {extraTagCount > 0 && (
                          <span className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground tabular-nums">
                            +{extraTagCount}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/50 pt-3">
                      <div className="flex items-center gap-1.5">
                        {isFav && (
                          <span className="flex items-center gap-1 text-[10px] font-medium text-red-500" title="Favorisiert">
                            <Heart className="h-3 w-3 fill-current" />
                          </span>
                        )}
                        {articleDone && (
                          <span className="flex items-center gap-1 text-[10px] font-medium text-green-500" title="Gelesen">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </span>
                        )}
                        {!isFav && !articleDone && (
                          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">
                            Artikel
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            void handleCopyMarkdown(article);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-primary transition-colors focus-ring"
                          title="Als Markdown kopieren"
                          aria-label="Als Markdown kopieren"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Öffnen
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
