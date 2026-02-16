'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Box, Heart } from 'lucide-react';
import { uiLibraries } from '@/data/ui-libraries';
import { useFavorites } from '@/hooks/use-favorites';
import { cn } from '@/lib/utils';

export default function UILibrariesPage() {
  const { isFavorite, toggleFavorite } = useFavorites('ui-libraries');

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
          <Box className="h-8 w-8 text-primary" />
          UI Bibliotheken
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Kuratierte Sammlung moderner UI-Bibliotheken für React-Projekte.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {uiLibraries.map((lib, index) => {
          const isFav = isFavorite(lib.name);
          return (
            <motion.div
              key={lib.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative"
            >
              <a
                href={lib.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                <div className="h-full rounded-2xl border border-border/50 bg-card/50 p-6 transition-all hover:border-primary/30 hover:bg-card hover:shadow-lg">
                  <div className="mb-4 flex items-start justify-between pr-6">
                    <div className="rounded-xl bg-primary/10 p-3">
                      <lib.icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="rounded-lg bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                      {lib.category}
                    </span>
                  </div>

                  <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors pr-8">
                    {lib.name}
                  </h3>

                  <p className="mb-4 text-sm text-muted-foreground">
                    {lib.description}
                  </p>

                  <div className="flex items-center gap-1 text-sm font-medium text-primary">
                    Besuchen
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </div>
              </a>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(lib.name);
                }}
                className="absolute top-4 right-4 z-20 p-1.5 rounded-full hover:bg-muted/50 transition-colors"
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isFav ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-foreground"
                  )}
                />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
