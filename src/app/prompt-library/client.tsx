'use client';

import { useMemo, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, Heart, Check, Library } from 'lucide-react';
import Fuse from 'fuse.js';
import { PromptCard } from '@/components/prompts/PromptCard';
import { CategoryBadge, TagBadge } from '@/components/ui/badges';
import { usePromptStatusStore } from '@/stores/prompt-status-store';
import { cn } from '@/lib/utils';
import type { Prompt, Category, Complexity } from '@/types/prompt';

const complexityOptions: { value: Complexity | 'all'; label: string }[] = [
  { value: 'all', label: 'Alle Level' },
  { value: 'beginner', label: 'Einsteiger' },
  { value: 'intermediate', label: 'Fortgeschritten' },
  { value: 'expert', label: 'Experte' },
];

interface PromptLibraryClientProps {
  initialPrompts: Prompt[];
  allTags: string[];
  allCategories: Category[];
}

export function PromptLibraryClient({ initialPrompts, allTags, allCategories }: PromptLibraryClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [showFilters, setShowFilters] = useState(false);
  const { favorites, done } = usePromptStatusStore();

  const query = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') as Category | null;
  const complexityFilter = searchParams.get('complexity') as Complexity | 'all' | null;
  const tagsFilter = searchParams.get('tags')?.split(',').filter(Boolean) || [];
  const favoritesOnly = searchParams.get('favorites') === 'true';
  const doneFilter = searchParams.get('done') as 'done' | 'not_done' | null;

  // Fuse.js setup for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(initialPrompts, {
      keys: ['title', 'shortExcerpt', 'tags', 'category'],
      threshold: 0.3,
      ignoreLocation: true,
    });
  }, [initialPrompts]);

  // Filter prompts
  const filteredPrompts = useMemo(() => {
    let results = initialPrompts;

    // Apply fuzzy search
    if (query) {
      results = fuse.search(query).map(r => r.item);
    }

    // Apply category filter
    if (categoryFilter) {
      results = results.filter(p => p.category === categoryFilter);
    }

    // Apply complexity filter
    if (complexityFilter && complexityFilter !== 'all') {
      results = results.filter(p => p.complexity === complexityFilter);
    }

    // Apply tags filter
    if (tagsFilter.length > 0) {
      results = results.filter(p => 
        tagsFilter.some(tag => p.tags.includes(tag))
      );
    }

    // Apply favorites filter
    if (favoritesOnly) {
      results = results.filter(p => favorites[p.id]);
    }

    // Apply done filter
    if (doneFilter === 'done') {
      results = results.filter(p => done[p.id]);
    } else if (doneFilter === 'not_done') {
      results = results.filter(p => !done[p.id]);
    }

    return results;
  }, [query, categoryFilter, complexityFilter, tagsFilter, favoritesOnly, doneFilter, fuse, favorites, done, initialPrompts]);

  const updateParams = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    router.replace(`${pathname}?${newParams.toString()}`);
  };

  const toggleTag = (tag: string) => {
    const newTags = tagsFilter.includes(tag)
      ? tagsFilter.filter(t => t !== tag)
      : [...tagsFilter, tag];
    updateParams('tags', newTags.length > 0 ? newTags.join(',') : null);
  };

  const clearFilters = () => {
    router.replace(pathname);
  };

  const hasActiveFilters = query || categoryFilter || complexityFilter || tagsFilter.length > 0 || favoritesOnly || doneFilter;

  const favoritesCount = Object.keys(favorites).length;
  const doneCount = Object.keys(done).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
          <Library className="h-8 w-8 text-primary" />
          Prompt Bibliothek
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Durchsuche und entdecke {initialPrompts.length} kuratierte Prompts für deine Projekte.
        </p>
      </motion.div>
      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {/* Search bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Prompts durchsuchen..."
              value={query}
              onChange={(e) => updateParams('q', e.target.value || null)}
              className={cn(
                'h-12 w-full rounded-2xl border border-border/50 bg-card/50 pl-12 pr-4',
                'text-foreground placeholder:text-muted-foreground',
                'focus:border-primary/50 focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20',
                'transition-all duration-200'
              )}
            />
            {query && (
              <button
                onClick={() => updateParams('q', null)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex h-12 items-center gap-2 rounded-2xl border border-border/50 bg-card/50 px-4',
              'hover:bg-card transition-colors focus-ring',
              showFilters && 'border-primary/50 bg-card'
            )}
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span className="hidden sm:inline">Filter</span>
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {(categoryFilter ? 1 : 0) + (complexityFilter && complexityFilter !== 'all' ? 1 : 0) + tagsFilter.length + (favoritesOnly ? 1 : 0) + (doneFilter ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Quick filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateParams('favorites', favoritesOnly ? null : 'true')}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              favoritesOnly
                ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            <Heart className={cn('h-4 w-4', favoritesOnly && 'fill-current')} />
            Favoriten ({favoritesCount})
          </button>
          <button
            onClick={() => {
              const next = doneFilter === 'done' ? 'not_done' : doneFilter === 'not_done' ? null : 'done';
              updateParams('done', next);
            }}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              doneFilter === 'done'
                ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                : doneFilter === 'not_done'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            <Check className={cn('h-4 w-4', doneFilter === 'done' && 'stroke-[3]')} />
            {doneFilter === 'done' ? 'Erledigt' : doneFilter === 'not_done' ? 'Offen' : 'Status'} ({doneCount})
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl border border-border/50 bg-card/50 p-5 space-y-5"
          >
            {/* Categories */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">Kategorie</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateParams('category', null)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                    !categoryFilter
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  )}
                >
                  Alle
                </button>
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateParams('category', categoryFilter === cat ? null : cat)}
                    className={cn(
                      'transition-transform hover:scale-105',
                      categoryFilter === cat && 'ring-2 ring-primary ring-offset-2 ring-offset-background rounded-lg'
                    )}
                  >
                    <CategoryBadge category={cat} size="sm" />
                  </button>
                ))}
              </div>
            </div>

            {/* Complexity */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">Komplexität</h3>
              <div className="flex flex-wrap gap-2">
                {complexityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateParams('complexity', opt.value === 'all' ? null : opt.value)}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                      (complexityFilter || 'all') === opt.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <TagBadge
                    key={tag}
                    tag={tag}
                    active={tagsFilter.includes(tag)}
                    onClick={() => toggleTag(tag)}
                  />
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Filter zurücksetzen
              </button>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Results */}
      <div>
        <div className="mb-4 text-sm text-muted-foreground">
          {filteredPrompts.length} {filteredPrompts.length === 1 ? 'Prompt' : 'Prompts'} gefunden
        </div>
        
        {filteredPrompts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPrompts.map((prompt, index) => (
              <PromptCard key={prompt.id} prompt={prompt} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="mb-4 rounded-full bg-muted p-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Keine Prompts gefunden</h3>
            <p className="mt-1 text-muted-foreground">
              Versuche andere Suchbegriffe oder entferne einige Filter.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
