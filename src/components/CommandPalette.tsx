import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Compass,
  Copy,
  Factory,
  FolderKanban,
  History,
  Library,
  Lightbulb,
  Moon,
  Rocket,
  Search,
  Server,
  Settings,
  Sparkles,
  Sun,
  Wrench,
  Zap,
  FileText,
  Monitor,
} from 'lucide-react';
import { useThemeStore } from '@/stores/theme-store';
import { useHistoryStore } from '@/stores/history-store';
import { copyToClipboard, formatForCopy } from '@/lib/copy-utils';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navigationItems = [
  { icon: Wrench, label: 'Prompt Builder', path: '/prompt-builder', keywords: 'build create' },
  { icon: Factory, label: 'Prompt Factory', path: '/prompt-factory', keywords: 'generate factory' },
  { icon: Library, label: 'Prompt Bibliothek', path: '/prompt-library', keywords: 'library prompts' },
  { icon: FolderKanban, label: 'Workflows', path: '/workflows', keywords: 'workflow steps' },
  { icon: Sparkles, label: 'Rules Generator', path: '/rules-generator', keywords: 'rules cursor windsurf' },
  { icon: FileText, label: 'Help Bibliothek', path: '/help-library', keywords: 'help documentation' },
  { icon: Compass, label: 'Tool Directory', path: '/tool-directory', keywords: 'tools resources' },
  { icon: BookOpen, label: 'Wissensbasis', path: '/knowledge', keywords: 'knowledge docs' },
  { icon: Server, label: 'Hosting', path: '/hosting', keywords: 'deploy hosting' },
  { icon: Zap, label: 'Superpowers', path: '/superpowers', keywords: 'tips power user' },
  { icon: Lightbulb, label: 'Ideen Lab', path: '/idea-lab', keywords: 'ideas brainstorm' },
  { icon: History, label: 'Verlauf', path: '/history', keywords: 'history recent' },
  { icon: Settings, label: 'Einstellungen', path: '/settings', keywords: 'settings preferences' },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeStore();
  const { entries, getLatestEntry } = useHistoryStore();
  const [search, setSearch] = useState('');

  const handleSelect = useCallback((path: string) => {
    navigate(path);
    onOpenChange(false);
  }, [navigate, onOpenChange]);

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

  // Close on escape
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
            className="fixed left-1/2 top-1/4 z-50 w-full max-w-lg -translate-x-1/2"
          >
            <Command
              className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
              loop
            >
              <div className="flex items-center border-b border-border px-4">
                <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                <Command.Input
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
                <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                  Keine Ergebnisse gefunden.
                </Command.Empty>

                {/* Navigation */}
                <Command.Group heading="Navigation" className="px-2 py-1.5">
                  {navigationItems.map((item) => (
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

                {/* Actions */}
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

                {/* Theme */}
                <Command.Group heading="Theme" className="px-2 py-1.5">
                  <Command.Item
                    value="theme dark dunkel"
                    onSelect={() => handleThemeChange('dark')}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm cursor-pointer aria-selected:bg-accent",
                      theme === 'dark' && 'bg-primary/10'
                    )}
                  >
                    <Moon className="h-4 w-4 text-muted-foreground" />
                    Dunkel
                  </Command.Item>
                  <Command.Item
                    value="theme light hell"
                    onSelect={() => handleThemeChange('light')}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm cursor-pointer aria-selected:bg-accent",
                      theme === 'light' && 'bg-primary/10'
                    )}
                  >
                    <Sun className="h-4 w-4 text-muted-foreground" />
                    Hell
                  </Command.Item>
                  <Command.Item
                    value="theme system auto"
                    onSelect={() => handleThemeChange('system')}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm cursor-pointer aria-selected:bg-accent",
                      theme === 'system' && 'bg-primary/10'
                    )}
                  >
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    System
                  </Command.Item>
                </Command.Group>
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
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { open, setOpen };
}
