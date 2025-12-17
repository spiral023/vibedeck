import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { workflows } from '@/data/workflows';
import { CategoryBadge, TagBadge } from '@/components/ui/badges';

export function WorkflowsPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">Workflows</h1>
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
              to={`/workflows/${workflow.id}`}
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

      {workflows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <PlayCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Noch keine Workflows</h3>
          <p className="mt-1 text-muted-foreground">
            Workflows werden bald hinzugefügt.
          </p>
        </div>
      )}
    </div>
  );
}
