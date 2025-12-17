import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Category, Complexity } from '@/types/prompt';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md';
}

const categoryStyles: Record<Category, string> = {
  Build: 'badge-build',
  Browse: 'badge-browse',
  Ship: 'badge-ship',
  Learn: 'badge-learn',
};

const categoryLabels: Record<Category, string> = {
  Build: 'Erstellen',
  Browse: 'Erkunden',
  Ship: 'Ausliefern',
  Learn: 'Lernen',
};

export function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'inline-flex items-center rounded-lg border font-medium',
        categoryStyles[category],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
      )}
    >
      {categoryLabels[category]}
    </motion.span>
  );
}

interface ComplexityBadgeProps {
  complexity: Complexity;
  size?: 'sm' | 'md';
}

const complexityStyles: Record<Complexity, string> = {
  beginner: 'complexity-beginner',
  intermediate: 'complexity-intermediate',
  expert: 'complexity-expert',
};

const complexityLabels: Record<Complexity, string> = {
  beginner: 'Einsteiger',
  intermediate: 'Fortgeschritten',
  expert: 'Experte',
};

export function ComplexityBadge({ complexity, size = 'md' }: ComplexityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg font-medium',
        complexityStyles[complexity],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
      )}
    >
      {complexityLabels[complexity]}
    </span>
  );
}

interface TagBadgeProps {
  tag: string;
  onClick?: () => void;
  active?: boolean;
}

export function TagBadge({ tag, onClick, active }: TagBadgeProps) {
  const Component = onClick ? 'button' : 'span';
  
  return (
    <Component
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors',
        active
          ? 'bg-primary text-primary-foreground'
          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        onClick && 'cursor-pointer focus-ring'
      )}
    >
      {tag}
    </Component>
  );
}
