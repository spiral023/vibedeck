'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings2, ExternalLink, Search } from 'lucide-react';
import { setupItems } from '@/data/setup-items';
import { cn } from '@/lib/utils';

export default function SetupPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  // Extract unique labels
  const allLabels = Array.from(new Set(setupItems.flatMap(item => item.labels))).sort();
  const filterLabels = ['all', ...allLabels];

  const toggleLabel = (label: string) => {
    if (label === 'all') {
      setSelectedLabels([]);
      return;
    }
    setSelectedLabels(prev =>
      prev.includes(label)
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  const filteredItems = setupItems.filter((item) => {
    const matchesLabel = selectedLabels.length === 0 || item.labels.some(l => selectedLabels.includes(l));
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLabel && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
          <Settings2 className="h-8 w-8 text-primary" />
          Setup
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Tutorials, Guides und Informationen zur professionellen Einrichtung von Agentic Coding Tools in Unternehmen.
        </p>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Setup Guides durchsuchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-border/50 bg-card/50 pl-12 pr-4 h-12 focus:border-primary focus:outline-none"
        />
      </div>

      {/* Labels */}
      <div className="flex flex-wrap gap-2">
        {filterLabels.map((label) => (
          <button
            key={label}
            onClick={() => toggleLabel(label)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors capitalize',
              (label === 'all' ? selectedLabels.length === 0 : selectedLabels.includes(label))
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {label === 'all' ? 'Alle' : label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {filteredItems.map((item, index) => (
          <motion.a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="block group"
          >
            <div className="rounded-2xl border border-border/50 bg-card/50 p-6 transition-all hover:border-primary/30 hover:bg-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors flex items-center gap-2">
                    {item.title}
                    <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {item.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.labels.map((label) => (
                      <span
                        key={label}
                        className="rounded-md bg-secondary/50 px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
