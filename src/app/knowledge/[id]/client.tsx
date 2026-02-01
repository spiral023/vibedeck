'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { BookOpen, Code2, Database, FileCode, Layers, Lock, Rocket, Search, Zap, Image, ArrowLeft } from 'lucide-react';
import { type KnowledgeArticle } from '@/types/knowledge';

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Code2,
  Database,
  FileCode,
  Layers,
  Lock,
  Rocket,
  Search,
  Zap,
  Image,
};

interface ArticleViewProps {
  article: KnowledgeArticle;
}

export function ArticleView({ article }: ArticleViewProps) {
  const Icon = iconMap[article.icon] || BookOpen;

  return (
    <div className="space-y-6">
      <Link
        href="/knowledge"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurück zur Übersicht
      </Link>

      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="prose prose-neutral dark:prose-invert max-w-none"
      >
        <div className="not-prose mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-primary/10 p-3">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
              <p className="text-muted-foreground">{article.readTime} Lesezeit</p>
            </div>
          </div>
        </div>
        <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              img: ({ node, ...props }) => (
                <span className="block my-8">
                  <img
                    {...props}
                    className="rounded-xl shadow-lg border border-border/50"
                    alt={props.alt || ''}
                  />
                </span>
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>
      </motion.article>
    </div>
  );
}
