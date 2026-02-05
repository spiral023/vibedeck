'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Code2, Database, FileCode, Layers, Lock, Rocket, Search, Zap, Image } from 'lucide-react';
import { cn } from '@/lib/utils';
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

interface KnowledgeClientProps {
  articles: KnowledgeArticle[];
}

export function KnowledgeClient({ articles }: KnowledgeClientProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllTags, setShowAllTags] = useState(false);
  const [canExpandTags, setCanExpandTags] = useState(false);
  const [collapsedTagHeight, setCollapsedTagHeight] = useState<number | null>(null);
  const tagContainerRef = useRef<HTMLDivElement | null>(null);

  const tagStats = articles.reduce<Record<string, number>>((acc, article) => {
    (article.tags ?? []).forEach((tag) => {
      acc[tag] = (acc[tag] ?? 0) + 1;
    });
    return acc;
  }, {});

  const allTags = Object.entries(tagStats)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);

  const filtered = articles.filter((article) => {
    const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) =>
      (article.tags ?? []).includes(tag)
    );
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const searchTargets = [
      article.title,
      article.description,
      article.author,
      article.sourceType,
      ...(article.tags ?? []),
    ].filter((value): value is string => Boolean(value));
    const matchesSearch = normalizedQuery.length === 0 || searchTargets.some((value) =>
      value.toLowerCase().includes(normalizedQuery)
    );
    return matchesTags && matchesSearch;
  });

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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Artikel durchsuchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-border/50 bg-card/50 pl-12 pr-4 h-12 focus:border-primary focus:outline-none"
        />
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

          return (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/knowledge/${article.id}`} className="block h-full group">
                <div className="h-full rounded-2xl border border-border/50 bg-card/50 p-5 transition-all hover:border-primary/30 hover:bg-card">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-xl bg-primary/10 p-2.5">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">{article.readTime}</span>
                  </div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {article.description}
                  </p>
                  {visibleTags.length > 0 && (
                    <div className="mt-3 space-y-2">
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
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
