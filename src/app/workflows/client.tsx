'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FolderKanban,
  PlayCircle,
} from 'lucide-react';
import { CategoryBadge, TagBadge } from '@/components/ui/badges';
import type { Workflow } from '@/types/prompt';

interface WorkflowsClientProps {
  workflows: Workflow[];
}

export function WorkflowsClient({ workflows }: WorkflowsClientProps) {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
          <FolderKanban className="h-8 w-8 text-primary" />
          Workflows
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Strukturierte Arbeitsabläufe für wiederkehrende Aufgaben.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {workflows.map((workflow, index) => (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={`/workflows/${workflow.id}`}
              className="group block h-full"
            >
              <div className="h-full rounded-2xl border border-border/50 bg-card/50 p-5 transition-all hover:border-primary/30 hover:bg-card hover:shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <CategoryBadge category={workflow.category} size="sm" />
                  <span className="text-sm text-muted-foreground">
                    {workflow.steps.length} Schritte
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
                  {workflow.title}
                </h3>

                <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                  {workflow.description}
                </p>

                <div className="mb-4 flex flex-wrap gap-1.5">
                  {workflow.tags.slice(0, 3).map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat('de-DE').format(new Date(workflow.updatedDate))}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="h-4 w-4" />
                    Starten
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
