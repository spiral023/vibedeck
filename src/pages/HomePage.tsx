import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, FolderKanban, Library, Rocket, Sparkles, Zap } from 'lucide-react';
import { prompts } from '@/data/prompts';
import { workflows } from '@/data/workflows';

const features = [
  {
    icon: Library,
    title: 'Prompt Bibliothek',
    description: 'Durchsuche kuratierte Prompts für verschiedene Anwendungsfälle.',
    href: '/prompt-library',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: FolderKanban,
    title: 'Workflows',
    description: 'Strukturierte Arbeitsabläufe für komplexe Aufgaben.',
    href: '/workflows',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  {
    icon: Sparkles,
    title: 'Rules Generator',
    description: 'Erstelle maßgeschneiderte Projekt-Regeln für AI-Agenten.',
    href: '/rules-generator',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
  },
  {
    icon: Zap,
    title: 'Superpowers',
    description: 'Erweiterte Fähigkeiten und Techniken für Power-User.',
    href: '/superpowers',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
];

export function HomePage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-2xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary/80 mx-auto">
            <Rocket className="h-10 w-10 text-primary-foreground" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl xl:text-6xl">
          Willkommen bei{' '}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            VibeDeck
          </span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground lg:text-xl">
          Deine zentrale Anlaufstelle für kuratierte Prompts, Workflows und Ressourcen 
          für die AI-gestützte Entwicklung.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/prompt-library"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 focus-ring"
          >
            Bibliothek erkunden
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/prompt-builder"
            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card/50 px-6 py-3 font-medium transition-all hover:bg-card hover:border-primary/50 focus-ring"
          >
            Prompt erstellen
          </Link>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 sm:grid-cols-3"
      >
        {[
          { label: 'Prompts', value: prompts.length },
          { label: 'Workflows', value: workflows.length },
          { label: 'Kategorien', value: 4 },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/50 bg-card/50 p-6 text-center"
          >
            <div className="text-4xl font-bold text-primary">{stat.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </motion.section>

      {/* Features */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="mb-8 text-2xl font-bold tracking-tight">Schnellzugriff</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {features.map((feature, index) => (
            <Link
              key={feature.href}
              to={feature.href}
              className="group"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="h-full rounded-2xl border border-border/50 bg-card/50 p-6 transition-all hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/5"
              >
                <div className={`mb-4 inline-flex rounded-xl ${feature.bgColor} p-3`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Öffnen
                  <ArrowRight className="h-4 w-4" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
