'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Lightbulb, Shuffle, Copy, Sparkles, ArrowRight } from 'lucide-react';
import { copyToClipboard } from '@/lib/copy-utils';
import { cn } from '@/lib/utils';

const projectTypes = [
  'SaaS Dashboard',
  'E-Commerce Shop',
  'Social Media App',
  'Produktivitäts-Tool',
  'Portfolio Website',
  'Blog Platform',
  'Learning Platform',
  'Fitness Tracker',
  'Rezept-App',
  'Event Management',
  'Chat Application',
  'Booking System',
];

const features = [
  'Dark Mode',
  'Multi-Language',
  'Real-time Updates',
  'Offline Support',
  'Push Notifications',
  'Social Login',
  'Payment Integration',
  'Analytics Dashboard',
  'Export to PDF',
  'Collaboration Features',
  'AI-powered Search',
  'Customizable Themes',
];

const techStacks = [
  'React + TypeScript + Tailwind',
  'Next.js + Prisma + PostgreSQL',
  'Vite + Supabase + Shadcn',
  'React Native + Expo',
  'Remix + Cloudflare Workers',
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateIdea(): string {
  const type = randomFrom(projectTypes);
  const feature1 = randomFrom(features);
  let feature2 = randomFrom(features);
  while (feature2 === feature1) feature2 = randomFrom(features);
  const stack = randomFrom(techStacks);

  return `🎯 **Projektidee: ${type}**

### Features
- ${feature1}
- ${feature2}

### Tech Stack
${stack}

### Nächste Schritte
1. User Stories definieren
2. Wireframes erstellen
3. MVP Scope festlegen
4. Mit Lovable umsetzen 🚀`;
}

export default function IdeaLabPage() {
  const [userInput, setUserInput] = useState('');
  const [generatedIdea, setGeneratedIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation delay for effect
    setTimeout(() => {
      setGeneratedIdea(generateIdea());
      setIsGenerating(false);
    }, 500);
  };

  const handleCustomGenerate = () => {
    if (!userInput.trim()) {
      toast.error('Bitte gib eine Beschreibung ein');
      return;
    }

    const customIdea = `🎯 **Projektidee basierend auf deiner Beschreibung**

### Deine Idee
${userInput}

### Empfohlene Features
- ${randomFrom(features)}
- ${randomFrom(features)}
- ${randomFrom(features)}

### Empfohlener Tech Stack
${randomFrom(techStacks)}

### Mögliche Erweiterungen
- ${randomFrom(features)}
- ${randomFrom(features)}

### Nächste Schritte
1. Kernfunktionen priorisieren
2. Zielgruppe definieren
3. MVP in Lovable bauen 🚀`;

    setGeneratedIdea(customIdea);
  };

  const handleCopy = async () => {
    if (!generatedIdea) return;
    const success = await copyToClipboard(generatedIdea);
    if (success) {
      toast.success('Idee kopiert');
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
          <Lightbulb className="h-8 w-8 text-primary" />
          Ideen Lab
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Brainstorme neue Projektideen und lass dich inspirieren.
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Random Generator */}
          <div className="rounded-2xl border border-border/50 bg-card/50 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shuffle className="h-5 w-5 text-primary" />
              Zufällige Idee
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Keine Inspiration? Lass dir eine zufällige Projektidee generieren.
            </p>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={cn(
                'w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground',
                'hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
              )}
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  Generiere...
                </>
              ) : (
                <>
                  <Shuffle className="h-5 w-5" />
                  Idee generieren
                </>
              )}
            </button>
          </div>

          {/* Custom Input */}
          <div className="rounded-2xl border border-border/50 bg-card/50 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Eigene Idee verfeinern
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Beschreibe deine grobe Idee und lass sie mit Vorschlägen anreichern.
            </p>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="z.B. Eine App um Rezepte zu speichern und zu teilen..."
              rows={4}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 resize-none focus:border-primary focus:outline-none mb-4"
            />
            <button
              onClick={handleCustomGenerate}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 font-medium text-secondary-foreground hover:bg-secondary/80 transition-all"
            >
              <ArrowRight className="h-5 w-5" />
              Idee erweitern
            </button>
          </div>
        </motion.div>

        {/* Output Section */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Ergebnis</h2>
            {generatedIdea && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Copy className="h-4 w-4" />
                Kopieren
              </button>
            )}
          </div>

          <div className={cn(
            'min-h-[400px] rounded-2xl border border-border/50 bg-card/50 p-6',
            !generatedIdea && 'flex items-center justify-center'
          )}>
            {generatedIdea ? (
              <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none whitespace-pre-wrap">
                {generatedIdea}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Klicke auf "Idee generieren" oder beschreibe deine eigene Idee.</p>
              </div>
            )}
          </div>

          {generatedIdea && (
            <p className="text-xs text-muted-foreground text-center">
              💡 Tipp: Kopiere die Idee und nutze sie als Basis für deinen Prompt Builder.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
