'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Box,
  Clock3,
  ExternalLink,
  Github,
  Newspaper,
  Rocket,
  Sparkles,
} from 'lucide-react';
import { formatDurationMinutes, sumReadTimes } from '@/lib/read-time';
import { useContentStatusStore } from '@/stores/content-status-store';

const coreSections = [
  {
    icon: BookOpen,
    title: 'Hochwertige Wissensdatenbank-Artikel',
    description:
      'Praxisnahe Guides, Patterns und Workflows für moderne AI- und Frontend-Entwicklung.',
    href: '/knowledge',
    actionLabel: 'Wissensbasis öffnen',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  {
    icon: Box,
    title: 'Beste UI-Bibliotheken',
    description:
      'Kuratierte Frontend-Library-Links für Komponenten, Animationen, Styling und Produktivität.',
    href: '/ui-libraries',
    actionLabel: 'UI Bibliotheken ansehen',
    color: 'text-sky-400',
    bgColor: 'bg-sky-500/10',
  },
  {
    icon: Github,
    title: 'Hilfreichste GitHub Repos',
    description:
      'Handverlesene Awesome-Listen und Repositories für schnelleres Lernen und Bauen.',
    href: '/github',
    actionLabel: 'Repos entdecken',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
  },
  {
    icon: Newspaper,
    title: 'Spannende Blog-Zusammenfassungen',
    description:
      'Kompakte Zusammenfassungen relevanter Beiträge mit direktem Link zur Originalquelle.',
    href: '/blog',
    actionLabel: 'Blog öffnen',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
];

const soonFeatures = [
  'Prompt Builder',
  'Prompt Composer',
  'Prompt Factory',
  'Prompt Bibliothek',
  'Workflows',
  'Rules Generator',
  'Superpowers',
  'Ideen Lab',
  'Hosting',
  'Verlauf',
];

interface HomePageClientProps {
  knowledgeCount: number;
  blogCount: number;
  knowledgeReadTimeMinutes: number;
  blogReadTimeMinutes: number;
  knowledgeReadTimeEntries: { id: string; readTime: string | number }[];
  blogReadTimeEntries: { id: string; readTime: string | number }[];
  uiLibraryCount: number;
  githubRepoCount: number;
}

export default function HomePageClient({
  knowledgeCount,
  blogCount,
  knowledgeReadTimeMinutes,
  blogReadTimeMinutes,
  knowledgeReadTimeEntries,
  blogReadTimeEntries,
  uiLibraryCount,
  githubRepoCount,
}: HomePageClientProps) {
  const knowledgeDone = useContentStatusStore((state) => state.knowledge.done);
  const blogDone = useContentStatusStore((state) => state.blog.done);
  const totalReadTimeMinutes = knowledgeReadTimeMinutes + blogReadTimeMinutes;
  const doneReadTimeMinutes = useMemo(() => {
    const knowledgeDoneReadTimes = knowledgeReadTimeEntries
      .filter((article) => knowledgeDone[article.id])
      .map((article) => article.readTime);
    const blogDoneReadTimes = blogReadTimeEntries
      .filter((article) => blogDone[article.id])
      .map((article) => article.readTime);

    return sumReadTimes([...knowledgeDoneReadTimes, ...blogDoneReadTimes]);
  }, [blogDone, blogReadTimeEntries, knowledgeDone, knowledgeReadTimeEntries]);
  const knowledgeDoneReadTimeMinutes = useMemo(
    () =>
      sumReadTimes(
        knowledgeReadTimeEntries
          .filter((article) => knowledgeDone[article.id])
          .map((article) => article.readTime)
      ),
    [knowledgeDone, knowledgeReadTimeEntries]
  );
  const blogDoneReadTimeMinutes = useMemo(
    () =>
      sumReadTimes(
        blogReadTimeEntries
          .filter((article) => blogDone[article.id])
          .map((article) => article.readTime)
      ),
    [blogDone, blogReadTimeEntries]
  );
  const readingProgressPercent =
    totalReadTimeMinutes > 0 ? Math.min(100, Math.round((doneReadTimeMinutes / totalReadTimeMinutes) * 100)) : 0;
  const remainingReadTimeMinutes = Math.max(0, totalReadTimeMinutes - doneReadTimeMinutes);

  return (
    <div className="space-y-16 py-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="relative inline-block">
          <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-2xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary/80 mx-auto">
            <Rocket className="h-10 w-10 text-primary-foreground" />
          </div>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Öffentlich verfügbar
        </span>

        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl xl:text-6xl text-balance">
          Der kuratierte Frontend- und Wissenshub von{' '}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            VibeDeck
          </span>
        </h1>

        <p className="mx-auto max-w-3xl text-lg text-muted-foreground lg:text-xl text-balance">
          Fokus auf hochwertige Wissensdatenbank-Artikel, starke UI-Bibliotheken für Frontend
          Entwicklung, hilfreiche GitHub Repositories und spannende Blogartikel-Zusammenfassungen.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            href="/knowledge"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 focus-ring"
          >
            Wissensbasis öffnen
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card/50 px-6 py-3 font-medium transition-all hover:bg-card hover:border-primary/50 focus-ring"
          >
            Blog-Zusammenfassungen lesen
          </Link>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Wissensartikel', value: knowledgeCount },
            { label: 'UI Bibliotheken', value: uiLibraryCount },
            { label: 'GitHub Repos', value: githubRepoCount },
            { label: 'Blog-Artikel', value: blogCount },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border/50 bg-card/50 p-6 text-center"
            >
              <div className="text-4xl font-bold text-primary">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card/70 to-card/50 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
              <Clock3 className="h-4 w-4" />
              Gesamte Lesezeit
            </div>
            <div className="text-xl font-semibold text-foreground sm:text-2xl">
              {formatDurationMinutes(totalReadTimeMinutes)}
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border/50 bg-card/60 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Wissensbasis</div>
              <div className="mt-1 text-lg font-semibold text-foreground">
                {formatDurationMinutes(knowledgeReadTimeMinutes)}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Gelesen: {formatDurationMinutes(knowledgeDoneReadTimeMinutes)}
              </div>
            </div>
            <div className="rounded-xl border border-border/50 bg-card/60 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Blog</div>
              <div className="mt-1 text-lg font-semibold text-foreground">
                {formatDurationMinutes(blogReadTimeMinutes)}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Gelesen: {formatDurationMinutes(blogDoneReadTimeMinutes)}
              </div>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3">
              <div className="text-xs uppercase tracking-wide text-primary">Gelesen</div>
              <div className="mt-1 text-lg font-semibold text-foreground">
                {formatDurationMinutes(doneReadTimeMinutes)}
              </div>
            </div>
          </div>
          <div className="mt-3 rounded-xl border border-border/50 bg-card/60 px-4 py-3">
            <div className="flex items-center justify-between gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <span>Lesefortschritt</span>
              <span className="font-semibold text-primary">{readingProgressPercent}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
                style={{ width: `${readingProgressPercent}%` }}
              />
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>Gelesen: {formatDurationMinutes(doneReadTimeMinutes)}</span>
              <span>Offen: {formatDurationMinutes(remainingReadTimeMinutes)}</span>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-8"
      >
        <h2 className="text-2xl font-bold tracking-tight">Jetzt verfügbar</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {coreSections.map((section, index) => (
            <Link
              key={section.href}
              href={section.href}
              className="group"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="h-full rounded-2xl border border-border/50 bg-card/50 p-6 transition-all hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/5"
              >
                <div className={`mb-4 inline-flex rounded-xl ${section.bgColor} p-3`}>
                  <section.icon className={`h-6 w-6 ${section.color}`} />
                </div>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {section.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {section.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                  {section.actionLabel}
                  <ArrowRight className="h-4 w-4" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/50 p-6">
          <h3 className="text-lg font-semibold tracking-tight">Hinweis zu den Inhalten</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Viele Inhalte wurden für schnellen Überblick aus Originalquellen übersetzt und gekürzt.
            Für den vollen Mehrwert empfehlen wir immer die verlinkte Originalquelle.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-xs font-medium text-muted-foreground">
            <ExternalLink className="h-3.5 w-3.5" />
            Originalquelle pro Eintrag verlinkt
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold tracking-tight">Demnächst</h2>
        <p className="text-sm text-muted-foreground">
          Die folgenden Features sind als <span className="font-semibold text-foreground">SOON</span>{' '}
          markiert und folgen später.
        </p>
        <div className="flex flex-wrap gap-2">
          {soonFeatures.map((feature) => (
            <span
              key={feature}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/60 px-3 py-1.5 text-xs font-medium text-secondary-foreground"
            >
              {feature}
              <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                Soon
              </span>
            </span>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
