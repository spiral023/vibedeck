'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Box } from 'lucide-react';
import { uiLibraries } from '@/data/ui-libraries';

export default function UILibrariesPage() {
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
        {uiLibraries.map((lib, index) => (
          <motion.a
            key={lib.name}
            href={lib.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group block"
          >
            <div className="h-full rounded-2xl border border-border/50 bg-card/50 p-6 transition-all hover:border-primary/30 hover:bg-card hover:shadow-lg">
              <div className="mb-4 flex items-start justify-between">
                <div className="rounded-xl bg-primary/10 p-3">
                  <lib.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="rounded-lg bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                  {lib.category}
                </span>
              </div>

              <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
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
          </motion.a>
        ))}
      </div>
    </div>
  );
}
