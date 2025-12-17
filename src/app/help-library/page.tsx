'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, Search } from 'lucide-react';
import { getHelpTemplateIndex } from '@/data/help-templates';
import { TagBadge } from '@/components/ui/badges';

export default function HelpLibraryPage() {
  const [query, setQuery] = useState('');
  const templates = getHelpTemplateIndex();

  const filtered = useMemo(() => {
    if (!query) return templates;
    const lower = query.toLowerCase();
    return templates.filter(
      (t) =>
        t.title.toLowerCase().includes(lower) ||
        t.domain.toLowerCase().includes(lower) ||
        t.tags.some((tag) => tag.toLowerCase().includes(lower))
    );
  }, [query, templates]);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          HELP.md Bibliothek
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Dynamische Vorlagen für projektspezifische Dokumentation.
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Vorlagen durchsuchen..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 w-full rounded-2xl border border-border/50 bg-card/50 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </motion.div>

      {/* Templates grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={`/help-library/${template.id}`}
              className="group block h-full"
            >
              <div className="h-full rounded-2xl border border-border/50 bg-card/50 p-5 transition-all hover:border-primary/30 hover:bg-card hover:shadow-lg">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-lg bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {template.domain}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {template.variables.length} Variablen
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
                  {template.title}
                </h3>

                <div className="mb-4 flex flex-wrap gap-1.5">
                  {template.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  {template.notes}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Keine Vorlagen gefunden</h3>
          <p className="mt-1 text-muted-foreground">
            Versuche andere Suchbegriffe.
          </p>
        </div>
      )}
    </div>
  );
}
