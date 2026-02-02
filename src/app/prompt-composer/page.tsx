'use client';

import { useMemo, useState, type DragEvent, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Copy, GripVertical, Layers, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { copyToClipboard } from '@/lib/copy-utils';
import { cn } from '@/lib/utils';

type SnippetItem = {
  id: string;
  label: string;
  prompt?: string;
};

type SnippetCategory = {
  id: string;
  label: string;
  description?: string;
  strengthWeight?: number;
  items: SnippetItem[];
};

const snippetCategories: SnippetCategory[] = [
  {
    id: 'features',
    label: 'Features',
    description: 'UI-Bausteine für den Aufbau deiner Seite.',
    strengthWeight: 20,
    items: [
      { id: 'feature-hero', label: 'Hero Bereich' },
      { id: 'feature-cards', label: 'Feature-Cards' },
      { id: 'feature-tabs', label: 'Tabs' },
      { id: 'feature-faq', label: 'FAQ-Accordion' },
      { id: 'feature-testimonials', label: 'Testimonial-Slider' },
      { id: 'feature-pricing', label: 'Pricing-Cards' },
      { id: 'feature-form', label: 'Formular (E-Mail/Sign-up)' },
      { id: 'feature-metrics', label: 'Metric-Cards (KPI + Trend)' },
      { id: 'feature-modals', label: 'Modals' },
      { id: 'feature-toasts', label: 'Toasts / Alerts' },
      { id: 'feature-sidebar', label: 'Sidebar-Navigation' },
      { id: 'feature-sticky-header', label: 'Sticky Header' },
      { id: 'feature-search-results', label: 'Search Results: Liste mit Highlighting & Filtern' },
      { id: 'feature-notifications', label: 'Notification Center: Dropdown mit "Gelesen" Status' },
      { id: 'feature-video', label: 'Video Player: Custom Controls & Poster Image' },
    ],
  },
  {
    id: 'interactions',
    label: 'Interaktionen & States',
    description: 'Verhalten, Animationen und UI-Zustände.',
    strengthWeight: 15,
    items: [
      { id: 'interaction-scroll', label: 'Scroll-Animationen (Fade-in/Slide-in)' },
      { id: 'interaction-progress', label: 'Lesefortschrittsbalken' },
      { id: 'interaction-hover-cards', label: 'Cards heben sich bei Hover' },
      { id: 'interaction-hover-button', label: 'Button Scale/Glow bei Hover' },
      { id: 'interaction-tab-underline', label: 'Animierte Tab-Underline' },
      { id: 'interaction-badge-pulse', label: 'Badge mit Puls-Effekt' },
      { id: 'interaction-skeleton', label: 'Skeleton-Loader' },
      { id: 'interaction-empty', label: 'Freundliche Empty-States' },
      { id: 'interaction-error', label: 'Fehler-States mit Retry' },
    ],
  },
  {
    id: 'data-schema',
    label: 'JSON Datenschema',
    description: 'Strukturierte Datenanforderungen für dein Projekt.',
    strengthWeight: 15,
    items: [
      {
        id: 'schema-json',
        label:
          "Beschreibe die Datenstruktur im JSON-Format - z.B. { 'user': { 'name': 'string', 'email': 'string' } }",
      },
    ],
  },
  {
    id: 'layout-structure',
    label: 'Layout & Struktur',
    description: 'Grundgerüst und Navigationslogik der Seite.',
    strengthWeight: 18,
    items: [
      { id: 'layout-bento', label: 'Bento Grid: asymmetrisches Raster für Features/Grafiken' },
      { id: 'layout-masonry', label: 'Masonry Gallery: Pinterest-Style mit variabler Höhe' },
      { id: 'layout-mega-footer', label: 'Mega-Footer: Links, Newsletter, Social Media' },
      { id: 'layout-split', label: 'Split-Screen: 50% Bild / 50% Text' },
      { id: 'layout-breadcrumbs', label: 'Breadcrumbs: Home > Kategorie > Detail' },
      { id: 'layout-command', label: 'Command Palette: Strg+K Overlay für Suche' },
      { id: 'layout-dashboard', label: 'Admin Shell: Sidebar + Topbar + Content Area' },
      { id: 'layout-mobile-nav', label: 'Mobile Bottom Bar: Navigation am unteren Rand (App-Like)' },
    ],
  },
  {
    id: 'data-display',
    label: 'Daten & Listen',
    description: 'Datengetriebene Komponenten für Web-Apps.',
    strengthWeight: 18,
    items: [
      { id: 'data-table', label: 'Data Table (Advanced): Sortierung, Filter, Spalten' },
      { id: 'data-kanban', label: 'Kanban Board: Drag & Drop Cards' },
      { id: 'data-timeline', label: 'Timeline / Zeitstrahl: vertikale Historie' },
      { id: 'data-pagination', label: 'Pagination / Load More: Listen-Navigation' },
      { id: 'data-upload', label: 'File Upload Zone: Drag & Drop mit Vorschau' },
      { id: 'data-code-block', label: 'Code Block: Syntax-Highlighting Box' },
      { id: 'data-calendar', label: 'Kalender-View: Monats/Wochenansicht mit Events' },
      { id: 'data-tree', label: 'Tree View: Verschachtelte Ordnerstruktur/Hierarchie' },
    ],
  },
  {
    id: 'marketing-legal',
    label: 'Marketing & Legal',
    description: 'Conversion-Elemente und Pflichtbausteine.',
    strengthWeight: 16,
    items: [
      { id: 'marketing-cookie', label: 'Cookie Consent Banner: DSGVO-konform' },
      { id: 'marketing-exit', label: 'Exit-Intent Popup: Modal beim Verlassen' },
      { id: 'marketing-proof', label: 'Social Proof / Avatar Stack: 500+ User' },
      { id: 'marketing-countdown', label: 'Countdown Timer: limitierte Angebote' },
      { id: 'marketing-pricing-toggle', label: 'Pricing Toggle: Monatlich vs. Jährlich' },
    ],
  },
  {
    id: 'tech-context',
    label: 'Tech-Stack & Kontext',
    description: 'Wichtige Instruktionen für das LLM.',
    strengthWeight: 20,
    items: [
      { id: 'tech-shadcn', label: 'Tech: shadcn/ui + Tailwind CSS' },
      { id: 'tech-framer', label: 'Tech: Framer Motion für Animationen' },
      { id: 'tech-icons', label: 'Icon Set: Lucide React' },
      { id: 'tech-mobile', label: 'Mobile First: responsives Layout priorisieren' },
      { id: 'tech-dark', label: 'Dark Mode Support: CSS-Variablen für Themes' },
    ],
  },
  {
    id: 'tech-stack',
    label: 'Tech Stack',
    description: 'Technologie-Setup, Integrationen und Deployment.',
    strengthWeight: 20,
    items: [
      { id: 'tech-core', label: 'Tech Stack: React, TypeScript, Tailwind CSS' },
      { id: 'tech-state', label: 'State/Query: Zustand + React Query' },
      { id: 'tech-api', label: 'Backend/API: REST + Zod Schemas' },
      { id: 'tech-deploy', label: 'Deployment: Vercel + CI/CD' },
      { id: 'tech-testing', label: 'Testing: Vitest + React Testing Library Setup' },
      { id: 'tech-seo', label: 'SEO: Next-SEO / Meta Tags & OpenGraph Setup' },
    ],
  },
  {
    id: 'styling-vibe',
    label: 'Styling & Vibe',
    description: 'Farben, Typografie und Layout-Stil.',
    strengthWeight: 15,
    items: [
      { id: 'style-color', label: 'Farbschema: muted-dark mit Neon-Akzenten' },
      { id: 'style-type', label: 'Typografie: große Headlines, elegante Sans-Serif' },
      { id: 'style-layout', label: 'Layout: großzügige Abstände, klare Section-Grid' },
      { id: 'style-motion', label: 'Motion: sanfte Micro-Animationen + Hover-Lifts' },
    ],
  },
  {
    id: 'content-tone',
    label: 'Content & Tone',
    description: 'Texte, Tonalität und Storytelling.',
    strengthWeight: 15,
    items: [
      { id: 'content-tone', label: 'Tonality: confident, warm, premium' },
      { id: 'content-cta', label: 'CTAs: kurz, aktiv, klarer Nutzenfokus' },
      { id: 'content-microcopy', label: 'Microcopy: hilfreich, freundlich, präzise' },
      { id: 'content-proof', label: 'Social Proof: echte Zahlen + Kundenstimmen' },
    ],
  },
];

const snippetLookup = snippetCategories.reduce<Record<string, SnippetItem & { categoryId: string; categoryLabel: string }>>(
  (acc, category) => {
    category.items.forEach((item) => {
      acc[item.id] = {
        ...item,
        categoryId: category.id,
        categoryLabel: category.label,
      };
    });
    return acc;
  },
  {},
);

type SnippetPreset = {
  id: string;
  label: string;
  description: string;
  items: string[];
};

const snippetPresets: SnippetPreset[] = [
  {
    id: 'finance-dashboard',
    label: 'Finanz Dashboard',
    description: 'Datenlastiges UI mit Tabellen, KPIs und klarer Navigation.',
    items: [
      'layout-dashboard',
      'layout-breadcrumbs',
      'feature-metrics',
      'feature-sidebar',
      'feature-notifications',
      'feature-search-results',
      'interaction-skeleton',
      'interaction-error',
      'interaction-hover-cards',
      'data-table',
      'data-pagination',
      'data-timeline',
      'data-code-block',
      'tech-core',
      'tech-state',
      'tech-api',
      'tech-testing',
      'tech-dark',
      'tech-mobile',
    ],
  },
  {
    id: 'marketing-landing',
    label: 'Marketingseite',
    description: 'Conversion-starker Aufbau mit Storytelling und Proof.',
    items: [
      'feature-hero',
      'feature-cards',
      'feature-testimonials',
      'feature-pricing',
      'feature-faq',
      'feature-form',
      'layout-split',
      'layout-bento',
      'layout-mega-footer',
      'marketing-proof',
      'marketing-countdown',
      'marketing-pricing-toggle',
      'marketing-cookie',
      'interaction-scroll',
      'interaction-hover-button',
      'style-color',
      'style-type',
      'content-tone',
      'content-cta',
      'content-proof',
      'tech-shadcn',
      'tech-framer',
      'tech-seo',
      'tech-mobile',
    ],
  },
  {
    id: 'webshop',
    label: 'Webshop / E-Commerce',
    description: 'Produkt-Entdeckung, Filtern, Checkout und Trust-Elemente.',
    items: [
      'feature-search-results',
      'feature-tabs',
      'feature-cards',
      'feature-toasts',
      'feature-modals',
      'feature-form',
      'layout-breadcrumbs',
      'layout-mega-footer',
      'data-pagination',
      'data-upload',
      'marketing-proof',
      'marketing-cookie',
      'interaction-hover-cards',
      'interaction-badge-pulse',
      'style-color',
      'content-cta',
      'content-microcopy',
      'tech-core',
      'tech-api',
      'tech-mobile',
    ],
  },
  {
    id: 'saas-app',
    label: 'SaaS Produkt',
    description: 'Features, Onboarding, Settings und Admin-Shell.',
    items: [
      'layout-dashboard',
      'layout-command',
      'feature-tabs',
      'feature-sidebar',
      'feature-toasts',
      'feature-modals',
      'feature-form',
      'feature-notifications',
      'data-table',
      'data-kanban',
      'interaction-hover-button',
      'interaction-empty',
      'interaction-skeleton',
      'tech-shadcn',
      'tech-framer',
      'tech-testing',
      'tech-dark',
      'tech-mobile',
    ],
  },
  {
    id: 'content-portal',
    label: 'Content Portal',
    description: 'Wissensbasis, Suche, Navigation und strukturierte Inhalte.',
    items: [
      'layout-breadcrumbs',
      'layout-command',
      'feature-search-results',
      'feature-tabs',
      'feature-faq',
      'data-tree',
      'data-timeline',
      'data-pagination',
      'interaction-scroll',
      'interaction-progress',
      'style-type',
      'content-microcopy',
      'tech-seo',
      'tech-mobile',
    ],
  },
];

const uniqueItems = (items: string[]) => Array.from(new Set(items)).filter((id) => snippetLookup[id]);

const renderInlineCode = (text: string) => {
  const parts = text.split(/(`[^`]+`)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <span
          key={`inline-code-${index}`}
          className="rounded bg-amber-500/10 px-1 text-amber-600 dark:text-amber-300"
        >
          {part}
        </span>
      );
    }
    return <span key={`inline-${index}`}>{part}</span>;
  });
};

const useHighlightedMarkdown = (markdown: string) =>
  useMemo(() => {
    const lines = markdown.split('\n');
    const rendered: ReactNode[] = [];
    let inCodeBlock = false;

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        rendered.push(
          <div key={`line-${index}`} className="whitespace-pre-wrap text-amber-500 dark:text-amber-300">
            {line.length === 0 ? '\u00A0' : line}
          </div>,
        );
        return;
      }

      if (inCodeBlock) {
        rendered.push(
          <div key={`line-${index}`} className="whitespace-pre-wrap text-amber-500 dark:text-amber-300">
            {line.length === 0 ? '\u00A0' : line}
          </div>,
        );
        return;
      }

      const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        const [, hashes, title] = headingMatch;
        rendered.push(
          <div key={`line-${index}`} className="whitespace-pre-wrap">
            <span className="text-violet-500 dark:text-violet-300">{hashes} </span>
            <span className="text-primary">{renderInlineCode(title)}</span>
          </div>,
        );
        return;
      }

      const listMatch = line.match(/^(\s*)([-*])\s+(.*)$/);
      if (listMatch) {
        const [, indent, marker, rest] = listMatch;
        rendered.push(
          <div key={`line-${index}`} className="whitespace-pre-wrap">
            <span>{indent}</span>
            <span className="text-emerald-500 dark:text-emerald-300">{marker} </span>
            <span>{renderInlineCode(rest)}</span>
          </div>,
        );
        return;
      }

      rendered.push(
        <div key={`line-${index}`} className="whitespace-pre-wrap text-foreground">
          {line.length === 0 ? '\u00A0' : renderInlineCode(line)}
        </div>,
      );
    });

    return rendered;
  }, [markdown]);

export default function PromptComposerPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('custom');
  const [dropActive, setDropActive] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const selectedByCategory = useMemo(() => {
    return snippetCategories.map((category) => {
      const items = category.items.filter((item) => selectedIds.includes(item.id));
      return { ...category, items };
    });
  }, [selectedIds]);

  const promptMarkdown = useMemo(() => {
    if (selectedIds.length === 0) {
      return [
        '# Vibe Prompt',
        '',
        'Ziehe Snippets in die Drop-Zone, um deinen Prompt aufzubauen.',
      ].join('\n');
    }

    const sections = selectedByCategory
      .filter((category) => category.items.length > 0)
      .map((category) => {
        const lines = category.items.map((item) => `- ${item.prompt ?? item.label}`);
        return [`## ${category.label}`, ...lines].join('\n');
      });

    return [
      '# Vibe Prompt',
      '',
      'Erstelle eine moderne, konsistente UI auf Basis der folgenden Bausteine und Interaktionen.',
      '',
      ...sections,
    ].join('\n\n');
  }, [selectedByCategory, selectedIds.length]);

  const promptStrength = useMemo(() => {
    const baseScore = selectedByCategory.reduce((sum, category) => {
      if (category.items.length === 0) return sum;
      return sum + (category.strengthWeight ?? 0);
    }, 0);
    const bonus = Math.min(10, Math.floor(selectedIds.length / 6) * 5);
    return Math.min(100, baseScore + bonus);
  }, [selectedByCategory, selectedIds.length]);

  const strengthLabel = promptStrength < 35 ? 'Schwach' : promptStrength < 70 ? 'Solide' : 'Stark';

  const highlightedMarkdown = useHighlightedMarkdown(promptMarkdown);

  const addSnippet = (id: string) => {
    if (!snippetLookup[id]) return;
    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeSnippet = (id: string) => {
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const handleDragStart = (event: DragEvent<HTMLButtonElement>, id: string) => {
    event.dataTransfer.setData('text/plain', id);
    event.dataTransfer.effectAllowed = 'copy';
    setDraggingId(id);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    if (id) addSnippet(id);
    setDropActive(false);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setDropActive(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node)) return;
    setDropActive(false);
  };

  const handlePresetChange = (value: string) => {
    setSelectedPreset(value);
    if (value === 'custom') {
      setSelectedIds([]);
      return;
    }
    const preset = snippetPresets.find((item) => item.id === value);
    if (preset) {
      setSelectedIds(uniqueItems(preset.items));
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(promptMarkdown);
    if (success) {
      toast.success('Prompt kopiert');
    } else {
      toast.error('Kopieren fehlgeschlagen');
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
          <Layers className="h-8 w-8 text-primary" />
          Prompt Composer
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Kombiniere Vibe-Snippets per Drag & Drop und erzeuge live deinen Markdown-Prompt.
        </p>
      </motion.div>

      <div className="rounded-2xl border border-border/50 bg-card/50 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold">Preset auswählen</h2>
            <p className="text-xs text-muted-foreground">
              Wähle ein typisches Feature-Set und passe es danach weiter an.
            </p>
          </div>
          <div className="w-full max-w-md">
            <Select value={selectedPreset} onValueChange={handlePresetChange}>
              <SelectTrigger className="rounded-xl border-border/60 bg-background/70">
                <SelectValue placeholder="Preset wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom / Leer</SelectItem>
                {snippetPresets.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-2 text-xs text-muted-foreground">
              {selectedPreset === 'custom'
                ? 'Starte leer und stelle alles manuell zusammen.'
                : snippetPresets.find((preset) => preset.id === selectedPreset)?.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.section
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-border/50 bg-card/50 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Snippet-Bibliothek</h2>
              <p className="text-xs text-muted-foreground">
                Ziehe Bausteine in die Mitte oder klicke zum Hinzufügen.
              </p>
            </div>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
              {snippetCategories.reduce((sum, category) => sum + category.items.length, 0)} Snippets
            </span>
          </div>

          <div className="mt-4">
            <Accordion type="multiple" defaultValue={['features']} className="w-full">
              {snippetCategories.map((category) => (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger className="text-sm">
                    <div className="flex flex-col text-left">
                      <span>{category.label}</span>
                      {category.description && (
                        <span className="text-xs font-normal text-muted-foreground">
                          {category.description}
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {category.items.map((item) => {
                        const isSelected = selectedIds.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            draggable
                            onClick={() => addSnippet(item.id)}
                            onDragStart={(event) => handleDragStart(event, item.id)}
                            onDragEnd={handleDragEnd}
                            className={cn(
                              'flex w-full items-center justify-between gap-2 rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-left text-sm font-medium transition',
                              'hover:border-primary/40 hover:bg-background active:scale-[0.99]',
                              isSelected && 'border-primary/50 bg-primary/10 text-primary',
                            )}
                          >
                            <span className="leading-snug">{item.label}</span>
                            <span className="flex items-center gap-2 text-xs text-muted-foreground">
                              <GripVertical className="h-4 w-4" />
                              {isSelected ? 'Hinzugefügt' : 'Drag'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border/50 bg-card/50 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Drop-Zone</h2>
              <p className="text-xs text-muted-foreground">
                Bausteine werden automatisch nach Kategorien sortiert.
              </p>
            </div>
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="flex items-center gap-2 rounded-lg border border-border/60 px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Alles löschen
              </button>
            )}
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              'mt-4 min-h-[420px] rounded-2xl border border-dashed border-border/70 bg-background/40 p-4 transition',
              dropActive && 'border-primary/60 bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.35)]',
              draggingId && 'ring-1 ring-primary/20',
            )}
          >
            {selectedIds.length === 0 ? (
              <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center text-sm text-muted-foreground">
                <div className="rounded-2xl border border-border/60 bg-card/60 px-4 py-3">
                  Ziehe deine Snippets hierher, um den Prompt aufzubauen.
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {selectedByCategory
                  .filter((category) => category.items.length > 0)
                  .map((category) => (
                    <div key={category.id}>
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {category.label}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {category.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-2 rounded-full border border-border/60 bg-secondary/60 px-3 py-1 text-xs font-medium text-secondary-foreground"
                          >
                            <span>{item.label}</span>
                            <button
                              type="button"
                              onClick={() => removeSnippet(item.id)}
                              className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                              aria-label={`Snippet entfernen: ${item.label}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative rounded-2xl border border-border/50 bg-card/50 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Finaler Prompt (Output)</h2>
              <p className="text-xs text-muted-foreground">
                Live generierter Markdown-Text.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {selectedIds.length} Snippets
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="group relative inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_18px_hsl(var(--primary)/0.35)] transition-all hover:shadow-[0_0_26px_hsl(var(--primary)/0.55)] active:scale-[0.98]"
              >
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/80 via-primary to-primary/70 opacity-0 blur-lg transition-opacity group-hover:opacity-100" />
                <Copy className="relative h-4 w-4" />
                <span className="relative">Copy Prompt</span>
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-border/60 bg-background/70 p-4 shadow-[0_0_20px_hsl(var(--primary)/0.08)]">
            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold">Prompt Stärke</span>
                <span>
                  {strengthLabel} · {promptStrength}%
                </span>
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-secondary/60"
                role="progressbar"
                aria-valuenow={promptStrength}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-primary to-amber-400 transition-all duration-300"
                  style={{ width: `${promptStrength}%` }}
                />
              </div>
            </div>

            <div className="max-h-[360px] min-h-[320px] overflow-y-auto rounded-xl border border-border/50 bg-background/60 p-4 font-mono text-xs leading-relaxed text-foreground shadow-inner scrollbar-thin">
              {highlightedMarkdown}
            </div>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Mehr Details zu Tech, Styling und Content erhöhen die Prompt-Stärke.
          </p>
        </motion.section>
      </div>
    </div>
  );
}
