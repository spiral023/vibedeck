'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Compass, Heart } from 'lucide-react';
import { toolCategories } from '@/data/tool-directory';
import { useFavorites } from '@/hooks/use-favorites';
import { cn } from '@/lib/utils';

export default function ToolDirectoryPage() {
  const { isFavorite, toggleFavorite } = useFavorites('tool-directory');

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
          <Compass className="h-8 w-8 text-primary" />
          Tool Directory
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Essenzielle Tools für moderne Webentwicklung.
        </p>
      </motion.div>

      {toolCategories.map((category, catIndex) => (
        <motion.section
          key={category.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: catIndex * 0.1 }}
        >
          <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {category.tools.map((tool, index) => {
              const isFav = isFavorite(tool.name);
              return (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIndex * 0.1 + index * 0.03 }}
                  className="group relative"
                >
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    <div className="h-full rounded-2xl border border-border/50 bg-card/50 p-4 transition-all hover:border-primary/30 hover:bg-card hover:shadow-lg">
                      <div className="mb-3 flex items-center gap-3">
                        <tool.icon className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold group-hover:text-primary transition-colors pr-6">
                          {tool.name}
                        </h3>
                      </div>

                      <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                        {tool.description}
                      </p>

                      <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Öffnen
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </div>
                  </a>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(tool.name);
                    }}
                    className="absolute top-3 right-3 z-20 p-1 rounded-full hover:bg-muted/50 transition-colors"
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isFav ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-foreground"
                      )}
                    />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      ))}
    </div>
  );
}
