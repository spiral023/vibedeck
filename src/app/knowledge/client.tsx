'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { BookOpen, Code2, Database, FileCode, Layers, Lock, Rocket, Search, Zap, Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type KnowledgeArticle } from '@/types/knowledge';

const categories = [
  { id: 'all', label: 'Alle' },
  { id: 'fundamentals', label: 'Grundlagen' },
  { id: 'patterns', label: 'Patterns' },
  { id: 'security', label: 'Sicherheit' },
  { id: 'performance', label: 'Performance' },
];

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

interface KnowledgeClientProps {
  articles: KnowledgeArticle[];
}

export function KnowledgeClient({ articles }: KnowledgeClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  const filtered = articles.filter((article) => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const currentArticle = selectedArticle ? articles.find(a => a.id === selectedArticle) : null;

  if (currentArticle) {
    const Icon = iconMap[currentArticle.icon] || BookOpen;

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedArticle(null)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Zurück zur Übersicht
        </button>

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
                <h1 className="text-3xl font-bold">{currentArticle.title}</h1>
                <p className="text-muted-foreground">{currentArticle.readTime} Lesezeit</p>
              </div>
            </div>
          </div>
          <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
            <ReactMarkdown>{currentArticle.content}</ReactMarkdown>
          </div>
        </motion.article>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          Wissensbasis
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Dokumentation und Best Practices für AI-gestützte Entwicklung.
        </p>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Artikel durchsuchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-border/50 bg-card/50 pl-12 pr-4 h-12 focus:border-primary focus:outline-none"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              selectedCategory === cat.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((article, index) => {
          const Icon = iconMap[article.icon] || BookOpen;
          return (
            <motion.button
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedArticle(article.id)}
              className="text-left group"
            >
              <div className="h-full rounded-2xl border border-border/50 bg-card/50 p-5 transition-all hover:border-primary/30 hover:bg-card">
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-primary/10 p-2.5">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">{article.readTime}</span>
                </div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {article.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
