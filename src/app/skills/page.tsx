'use client';

import { motion } from 'framer-motion';
import { Blocks, ExternalLink } from 'lucide-react';
import { skillCategories } from '@/data/skills';

export default function SkillsPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
          <Blocks className="h-8 w-8 text-primary" />
          Skills & Plugins
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Kuratierte Skills und Plugins für Coding Agents.
        </p>
      </motion.div>

      {skillCategories.map((category, catIndex) => (
        <motion.section
          key={category.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: catIndex * 0.1 }}
        >
          <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {category.skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.1 + index * 0.03 }}
                className="group"
              >
                <a
                  href={skill.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <div className="h-full rounded-2xl border border-border/50 bg-card/50 p-4 transition-all hover:border-primary/30 hover:bg-card hover:shadow-lg">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <skill.icon className="h-5 w-5 shrink-0 text-primary" />
                        <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                          {skill.name}
                        </h3>
                      </div>
                      {skill.author && (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {skill.author}
                        </span>
                      )}
                    </div>

                    <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                      {skill.description}
                    </p>

                    <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Öffnen
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </motion.section>
      ))}
    </div>
  );
}
