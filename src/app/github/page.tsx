'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { githubRepos } from '@/data/github-repos';

export default function GithubPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
          <Github className="h-8 w-8 text-primary" />
          GitHub Repos
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Kuratierte Sammlung hilfreicher Awesome-Listen und GitHub Repositories.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {githubRepos.map((repo, index) => (
          <motion.a
            key={repo.name}
            href={repo.url}
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
                  <repo.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="rounded-lg bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                  {repo.category}
                </span>
              </div>

              <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
                {repo.name}
              </h3>

              <p className="mb-3 text-sm text-muted-foreground">
                {repo.description}
              </p>

              <p className="mb-4 text-xs text-muted-foreground/70">
                von <span className="font-medium text-muted-foreground">{repo.author}</span>
              </p>

              <div className="flex items-center gap-1 text-sm font-medium text-primary">
                Auf GitHub ansehen
                <ExternalLink className="h-4 w-4" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
