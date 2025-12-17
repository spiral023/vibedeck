import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Package } from 'lucide-react';
import type { Prompt } from '@/types/prompt';
import { CategoryBadge, ComplexityBadge, TagBadge } from '@/components/ui/badges';
import { cn } from '@/lib/utils';

interface PromptCardProps {
  prompt: Prompt;
  index?: number;
}

export function PromptCard({ prompt, index = 0 }: PromptCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        to={`/prompt-library/${prompt.id}`}
        className="group block h-full"
      >
        <div className={cn(
          'relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-5',
          'transition-all duration-300',
          'hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/5',
          'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'
        )}>
          {/* Header */}
          <div className="mb-4 flex items-start justify-between gap-3">
            <CategoryBadge category={prompt.category} size="sm" />
            <ComplexityBadge complexity={prompt.complexity} size="sm" />
          </div>

          {/* Title */}
          <h3 className="mb-2 text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
            {prompt.title}
          </h3>

          {/* Excerpt */}
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {prompt.shortExcerpt}
          </p>

          {/* Tags */}
          <div className="mb-4 flex flex-wrap gap-1.5">
            {prompt.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
            {prompt.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">+{prompt.tags.length - 3}</span>
            )}
          </div>

          {/* Dependencies */}
          {prompt.dependencies.length > 0 && (
            <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Package className="h-3.5 w-3.5" />
              <span>{prompt.dependencies.slice(0, 2).join(', ')}</span>
              {prompt.dependencies.length > 2 && (
                <span>+{prompt.dependencies.length - 2}</span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <span className="text-xs text-muted-foreground">
              Aktualisiert: {new Intl.DateTimeFormat('de-DE', { 
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              }).format(new Date(prompt.updatedDate))}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Öffnen
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
