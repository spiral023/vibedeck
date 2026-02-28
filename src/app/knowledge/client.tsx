'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Code2, Database, FileCode, Layers, Lock, Rocket, Search, Zap, Image, Calendar, ArrowUpDown, BarChart, Flame, Heart, Check, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type KnowledgeArticle } from '@/types/knowledge';
import { useContentStatusStore } from '@/stores/content-status-store';
import { stripMarkdown } from '@/lib/copy-utils';
import { createSearchFuse, normalizeSearchInput, searchDocuments as runSearchDocuments } from '@/lib/article-search';
import { type SearchDocument } from '@/types/search';
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
      return matchesTags && matchesLevel && matchesHot;
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
    compareBySort,
    searchFuse,
    articleById,
  ]);

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

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          Wissensbasis
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Dokumentation und Best Practices für AI-gestützte Entwicklung.
        </p>
      </motion.div>

      {/* Search & Sort & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Artikel durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-border/50 bg-card/50 pl-12 pr-4 h-12 focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex gap-4 items-center">
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
          <div className="w-[180px]">
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
                <SelectItem value="title">Titel (A-Z)</SelectItem>
                <SelectItem value="level">Level (Aufsteigend)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-3">
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
                  'ml-2 text-xs',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}>
                  {tagStats[tag]}
                </span>
              </button>
            );
          })}
        </div>
        {canExpandTags && (
          <button
            type="button"
            onClick={() => setShowAllTags((prev) => !prev)}
            className="text-sm font-medium text-primary hover:underline"
          >
            {showAllTags ? 'Weniger anzeigen' : 'Mehr anzeigen'}
          </button>
        )}
      </div>

      {/* Articles */}
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

          return (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative"
            >
              <Link href={`/knowledge/${article.id}`} className="block h-full">
                <div className={cn(
                  'h-full rounded-2xl border border-border/50 bg-card/50 p-5 transition-all hover:border-primary/30 hover:bg-card flex flex-col relative',
                  articleDone && 'opacity-80'
                )}>
                  <div className="mb-4 flex items-start justify-between">
                    <div className="rounded-xl bg-primary/10 p-2.5">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex gap-2 pr-16">
                      {viewed && (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50">
                          <Eye className="h-3 w-3" />
                          Gesehen
                        </span>
                      )}
                      {article.hot && (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border-red-200/50 dark:border-red-800/50">
                          <Flame className="h-3 w-3" />
                          Hot
                        </span>
                      )}
                      {levelInfo && (
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider",
                          levelInfo.color
                        )}>
                          {levelInfo.label}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-2">
                    <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                      {articleDone && <span className="ml-2 text-xs text-green-500">✓</span>}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{article.readTime}</span>
                      {article.sourceDate && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(article.sourceDate).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {article.description}
                  </p>

                  <div className="mt-auto">
                    {visibleTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {visibleTags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-secondary/70 px-2.5 py-1 text-[11px] font-medium text-secondary-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                        {extraTagCount > 0 && (
                          <span className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                            +{extraTagCount}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleDone('knowledge', article.id);
                  }}
                  className="p-1.5 rounded-full hover:bg-muted/50 transition-colors"
                  title={articleDone ? 'Als offen markieren' : 'Als erledigt markieren'}
                  aria-label={articleDone ? 'Als offen markieren' : 'Als erledigt markieren'}
                >
                  <Check
                    className={cn(
                      'h-5 w-5 transition-colors',
                      articleDone ? 'text-green-500 stroke-[3]' : 'text-muted-foreground hover:text-foreground'
                    )}
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite('knowledge', article.id);
                  }}
                  className="p-1.5 rounded-full hover:bg-muted/50 transition-colors"
                  title={isFav ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                  aria-label={isFav ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                >
                  <Heart
                    className={cn(
                      'h-5 w-5 transition-colors',
                      isFav ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-foreground'
                    )}
                  />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
