import { useEffect, useCallback, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Blocks,
  BookOpen,
  Compass,
  Copy,
  Factory,
  FolderKanban,
  History,
  Library,
  Lightbulb,
  Moon,
  Search,
  Server,
  Settings,
  Sparkles,
  Sun,
  Wrench,
  Zap,
  FileText,
  Monitor,
  Newspaper,
} from 'lucide-react';
import { useThemeStore } from '@/stores/theme-store';
import { useHistoryStore } from '@/stores/history-store';
import { copyToClipboard } from '@/lib/copy-utils';
import { createSearchFuse, normalizeSearchInput, searchDocuments as runSearchDocuments } from '@/lib/article-search';
import { SIDEBAR_SOON_MODE_ENABLED, SOON_LOCKED_PATHS } from '@/lib/navigation';
import { type SearchDocument } from '@/types/search';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SearchIndexState = 'idle' | 'loading' | 'ready' | 'error';

const navigationItems = [
  { icon: Wrench, label: 'Prompt Builder', path: '/prompt-builder', keywords: 'build create' },
  { icon: Factory, label: 'Prompt Factory', path: '/prompt-factory', keywords: 'generate factory' },
  { icon: Library, label: 'Prompt Bibliothek', path: '/prompt-library', keywords: 'library prompts' },
  { icon: FolderKanban, label: 'Workflows', path: '/workflows', keywords: 'workflow steps' },
  { icon: Sparkles, label: 'Rules Generator', path: '/rules-generator', keywords: 'rules cursor windsurf' },
  { icon: FileText, label: 'Help Bibliothek', path: '/help-library', keywords: 'help documentation' },
  { icon: Compass, label: 'Tool Directory', path: '/tool-directory', keywords: 'tools resources' },
  { icon: Blocks, label: 'Skills', path: '/skills', keywords: 'skills plugins coding agents' },
  { icon: BookOpen, label: 'Wissensbasis', path: '/knowledge', keywords: 'knowledge docs' },
  { icon: Newspaper, label: 'Blog', path: '/blog', keywords: 'blog artikel posts' },
  { icon: Server, label: 'Hosting', path: '/hosting', keywords: 'deploy hosting' },
  { icon: Zap, label: 'Superpowers', path: '/superpowers', keywords: 'tips power user' },
  { icon: Lightbulb, label: 'Ideen Lab', path: '/idea-lab', keywords: 'ideas brainstorm' },
  { icon: History, label: 'Verlauf', path: '/history', keywords: 'history recent' },
  { icon: Settings, label: 'Einstellungen', path: '/settings', keywords: 'settings preferences' },
];

const themeItems = [
  { id: 'dark', icon: Moon, label: 'Dunkel', keywords: 'theme dark dunkel', value: 'dark' as const },
  { id: 'light', icon: Sun, label: 'Hell', keywords: 'theme light hell', value: 'light' as const },
  { id: 'system', icon: Monitor, label: 'System', keywords: 'theme system auto', value: 'system' as const },
];

function matchesQuery(values: string[], query: string): boolean {
  if (!query) {
    return true;
  }

  return values.join(' ').toLowerCase().includes(query);
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { theme, setTheme } = useThemeStore();
  const { entries, getLatestEntry } = useHistoryStore();
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const normalizedSearch = useMemo(() => normalizeSearchInput(search), [search]);
  const shouldFetchArticleIndex = open && normalizedSearch.length >= 2;

  const {
    data: searchDocuments = [],
    isFetching: isSearchIndexFetching,
    isError: isSearchIndexError,
    isSuccess: isSearchIndexSuccess,
  } = useQuery<SearchDocument[]>({
    queryKey: ['command-palette-search-index'],
    queryFn: async () => {
      const response = await fetch('/search-index.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch search index: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid search index payload');
      }
      return data as SearchDocument[];
    },
    enabled: shouldFetchArticleIndex,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const searchIndexState: SearchIndexState = isSearchIndexError
    ? 'error'
    : isSearchIndexFetching
      ? 'loading'
      : isSearchIndexSuccess
        ? 'ready'
        : 'idle';

  const handleSelect = useCallback((path: string) => {
    router.push(path);
    onOpenChange(false);
  }, [router, onOpenChange]);

  const handleThemeChange = useCallback((newTheme: 'dark' | 'light' | 'system') => {
    setTheme(newTheme);
    onOpenChange(false);
    toast.success(`Theme: ${newTheme === 'system' ? 'System' : newTheme === 'dark' ? 'Dunkel' : 'Hell'}`);
  }, [setTheme, onOpenChange]);

  const handleCopyLast = useCallback(async () => {
    const latest = getLatestEntry();
    if (!latest || (!latest.resolvedPromptMarkdown && !latest.rawOutput)) {
      toast.error('Kein Eintrag zum Kopieren');
      onOpenChange(false);
      return;
    }

    const content = latest.resolvedPromptMarkdown || latest.rawOutput || '';
    const success = await copyToClipboard(content);
    if (success) {
      toast.success('Letzten Eintrag kopiert');
    }
    onOpenChange(false);
  }, [getLatestEntry, onOpenChange]);

  const filteredNavigationItems = useMemo(() => {
    return navigationItems.filter((item) => {
      if (SIDEBAR_SOON_MODE_ENABLED && SOON_LOCKED_PATHS.has(item.path)) {
        return false;
      }

      return matchesQuery([item.label, item.keywords], normalizedSearch);
    });
  }, [normalizedSearch]);

  const showCopyAction = useMemo(() => {
    return matchesQuery(['Letzten Eintrag kopieren', 'copy last prompt kopieren letzten'], normalizedSearch);
  }, [normalizedSearch]);

  const filteredThemeItems = useMemo(() => {
    return themeItems.filter((item) => matchesQuery([item.label, item.keywords], normalizedSearch));
  }, [normalizedSearch]);

  useEffect(() => {
    if (!open) {
      setSearch('');
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [open]);

  const articleSearchFuse = useMemo(() => {
    if (searchIndexState !== 'ready') {
      return null;
    }
    return createSearchFuse(searchDocuments);
  }, [searchIndexState, searchDocuments]);

  const articleResults = useMemo(() => {
    if (!articleSearchFuse || normalizedSearch.length < 2) {
      return [];
    }
    return runSearchDocuments(articleSearchFuse, normalizedSearch, 12);
  }, [articleSearchFuse, normalizedSearch]);

  const shouldRenderArticleState = normalizedSearch.length >= 2;

  const hasVisibleResults =
    filteredNavigationItems.length > 0 ||
    showCopyAction ||
    filteredThemeItems.length > 0 ||
    articleResults.length > 0 ||
    (shouldRenderArticleState && (searchIndexState === 'loading' || searchIndexState === 'error' || searchIndexState === 'ready'));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, onOpenChange]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />

          {/* Command dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <Command
              shouldFilter={false}
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
              loop
            >
              <div className="flex items-center border-b border-border px-4">
                <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                <Command.Input
                  ref={inputRef}
                  autoFocus
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Suche oder Befehl eingeben..."
                  className="flex h-12 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                />
                <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
                  ESC
                </kbd>
              </div>

              <Command.List className="max-h-[300px] overflow-y-auto p-2">
                {!hasVisibleResults && (
                  <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                    Keine Ergebnisse gefunden.
                  </Command.Empty>
                )}

                {/* Navigation */}
                {filteredNavigationItems.length > 0 && (
                  <Command.Group heading="Navigation" className="px-2 py-1.5">
                    {filteredNavigationItems.map((item) => (
                      <Command.Item
                        key={item.path}
                        value={`${item.label} ${item.keywords}`}
                        onSelect={() => handleSelect(item.path)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm cursor-pointer aria-selected:bg-accent"
                      >
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        {item.label}
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {shouldRenderArticleState && (
                  <Command.Group heading="Artikel" className="px-2 py-1.5">
                    {searchIndexState === 'loading' && (
                      <Command.Item
                        value="article-loading"
                        disabled
                        className="rounded-lg px-3 py-2 text-sm text-muted-foreground"
                      >
                        Artikelindex wird geladen...
                      </Command.Item>
                    )}
                    {searchIndexState === 'error' && (
                      <Command.Item
                        value="article-error"
                        disabled
                        className="rounded-lg px-3 py-2 text-sm text-amber-500"
                      >
                        Artikelsuche aktuell nicht verfügbar.
                      </Command.Item>
                    )}
                    {searchIndexState === 'ready' && articleResults.length === 0 && (
                      <Command.Item
                        value="article-empty"
                        disabled
                        className="rounded-lg px-3 py-2 text-sm text-muted-foreground"
                      >
                        Keine Artikeltreffer.
                      </Command.Item>
                    )}
                    {searchIndexState === 'ready' && articleResults.map((result) => (
                      <Command.Item
                        key={`${result.item.domain}-${result.item.id}`}
                        value={`${result.item.title} ${result.item.description ?? ''} ${(result.item.tags ?? []).join(' ')}`}
                        onSelect={() => handleSelect(result.item.path)}
                        className="flex items-start gap-3 rounded-lg px-3 py-2 text-sm cursor-pointer aria-selected:bg-accent"
                      >
                        <Search className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="truncate font-medium">{result.item.title}</span>
                            <span className={cn(
                              'rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide',
                              result.item.domain === 'blog'
                                ? 'bg-blue-500/10 text-blue-500'
                                : 'bg-emerald-500/10 text-emerald-500'
                            )}>
                              {result.item.domain}
                            </span>
                          </div>
                          <p className="truncate text-xs text-muted-foreground">
                            {result.item.description || (result.item.tags ?? []).slice(0, 3).join(' • ') || result.item.path}
                          </p>
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {/* Actions */}
                {showCopyAction && (
                  <Command.Group heading="Aktionen" className="px-2 py-1.5">
                    <Command.Item
                      value="copy last prompt kopieren letzten"
                      onSelect={handleCopyLast}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm cursor-pointer aria-selected:bg-accent"
                    >
                      <Copy className="h-4 w-4 text-muted-foreground" />
                      Letzten Eintrag kopieren
                      {entries.length > 0 && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          {entries.length} im Verlauf
                        </span>
                      )}
                    </Command.Item>
                  </Command.Group>
                )}

                {/* Theme */}
                {filteredThemeItems.length > 0 && (
                  <Command.Group heading="Theme" className="px-2 py-1.5">
                    {filteredThemeItems.map((item) => (
                      <Command.Item
                        key={item.id}
                        value={item.keywords}
                        onSelect={() => handleThemeChange(item.value)}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm cursor-pointer aria-selected:bg-accent',
                          theme === item.value && 'bg-primary/10'
                        )}
                      >
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        {item.label}
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook to manage command palette
export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { open, setOpen };
}
