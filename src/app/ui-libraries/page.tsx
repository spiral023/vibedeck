'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Box, Palette, Code2, Layers, Boxes, Paintbrush, Sparkles, Wand2 } from 'lucide-react';

const libraries = [
  {
    name: 'shadcn/ui',
    description: 'Wunderschön gestaltete Komponenten mit Radix UI und Tailwind CSS.',
    url: 'https://ui.shadcn.com',
    category: 'Komponenten',
    icon: Box,
  },
  {
    name: 'Radix UI',
    description: 'Ungestylete, zugängliche Komponenten für React.',
    url: 'https://radix-ui.com',
    category: 'Primitives',
    icon: Layers,
  },
  {
    name: 'Tailwind CSS',
    description: 'Ein Utility-first CSS Framework für schnelle UI-Entwicklung.',
    url: 'https://tailwindcss.com',
    category: 'Styling',
    icon: Palette,
  },
  {
    name: 'Framer Motion',
    description: 'Produktionsreife Animationsbibliothek für React.',
    url: 'https://framer.com/motion',
    category: 'Animation',
    icon: Wand2,
  },
  {
    name: 'Headless UI',
    description: 'Vollständig ungestylete, zugängliche UI-Komponenten.',
    url: 'https://headlessui.com',
    category: 'Primitives',
    icon: Boxes,
  },
  {
    name: 'Lucide Icons',
    description: 'Wunderschöne & konsistente Icon-Bibliothek.',
    url: 'https://lucide.dev',
    category: 'Icons',
    icon: Sparkles,
  },
  {
    name: 'Recharts',
    description: 'Komposable Chart-Bibliothek für React.',
    url: 'https://recharts.org',
    category: 'Charts',
    icon: Code2,
  },
  {
    name: 'React Hook Form',
    description: 'Performante, flexible und erweiterbare Formulare.',
    url: 'https://react-hook-form.com',
    category: 'Forms',
    icon: Paintbrush,
  },
  {
    name: 'Shadcnblocks',
    description: 'Premium Sammlung aus shadcn/ui Blocks und Komponenten mit React und Tailwind.',
    url: 'https://www.shadcnblocks.com/',
    category: 'Blocks',
    icon: Layers,
  },
  {
    name: '21st.dev',
    description: 'KI-gestuetztes Product-Design fuer UI-Entwuerfe mit Produktkontext.',
    url: 'https://21st.dev/',
    category: 'Design',
    icon: Palette,
  },
  {
    name: 'Kokonut UI',
    description: 'Open-Source Sammlung aus 100+ Komponenten fuer Next.js, React, Tailwind und Motion.',
    url: 'https://kokonutui.com/',
    category: 'Komponenten',
    icon: Box,
  },
  {
    name: 'Shadcn Studio',
    description: 'Grosse Sammlung aus Shadcn UI Komponenten, Blocks, Templates und Themes mit AI-Tools.',
    url: 'https://shadcnstudio.com/',
    category: 'Templates',
    icon: Sparkles,
  },
  {
    name: 'Dice UI',
    description: 'Accessible shadcn/ui Komponenten fuer React, TypeScript und Tailwind, copy-paste ready.',
    url: 'https://www.diceui.com/',
    category: 'Komponenten',
    icon: Box,
  },
  {
    name: 'Kibo UI',
    description: 'Custom Registry aus composable, accessible Komponenten fuer shadcn/ui.',
    url: 'https://www.kibo-ui.com/',
    category: 'Komponenten',
    icon: Boxes,
  },
  {
    name: 'Magic UI',
    description: 'UI Komponenten und Templates fuer Landing Pages.',
    url: 'https://magicui.design/',
    category: 'Templates',
    icon: Sparkles,
  },
  {
    name: 'SmoothUI',
    description: 'Kostenlose React Komponenten mit Tailwind und Framer Motion, shadcn/ui kompatibel.',
    url: 'https://smoothui.dev/',
    category: 'Animation',
    icon: Wand2,
  },
  {
    name: 'Tailark',
    description: 'Marketing Blocks fuer shadcn, responsive und schnell einsetzbar.',
    url: 'https://tailark.com/',
    category: 'Blocks',
    icon: Layers,
  },
  {
    name: 'Aceternity UI',
    description: 'Tailwind CSS und Framer Motion Komponenten fuer Next.js und TypeScript.',
    url: 'https://ui.aceternity.com/',
    category: 'Komponenten',
    icon: Sparkles,
  },
  {
    name: 'Shadcn Templates',
    description: 'Grosse Sammlung aus Shadcn UI Templates, UI Kits, Blocks und Dashboards.',
    url: 'https://shadcntemplates.com/',
    category: 'Templates',
    icon: Sparkles,
  },
  {
    name: 'React Bits',
    description: 'Open-source Sammlung animierter, interaktiver React Komponenten.',
    url: 'https://reactbits.dev/',
    category: 'Animation',
    icon: Wand2,
  },
  {
    name: 'shadcn map',
    description: 'Map-Komponente fuer shadcn/ui, gebaut mit Leaflet und React Leaflet.',
    url: 'https://shadcn-map.vercel.app/',
    category: 'Komponenten',
    icon: Box,
  },
  {
    name: 'Formcn',
    description: 'Form Builder fuer shadcn, inkl. Multi-Step Forms.',
    url: 'https://formcn.dev/',
    category: 'Forms',
    icon: Paintbrush,
  },
  {
    name: 'Motion Primitives',
    description: 'Open-source UI Kit fuer animierte Interfaces in React, Next.js und Tailwind.',
    url: 'https://motion-primitives.com/',
    category: 'Animation',
    icon: Wand2,
  },
  {
    name: 'Pattern Craft',
    description: 'CSS Background Patterns und Gradients zum Kopieren fuer Websites und Apps.',
    url: 'https://patterncraft.fun/',
    category: 'Styling',
    icon: Palette,
  },
];

export default function UILibrariesPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl flex items-center gap-3">
          <Box className="h-8 w-8 text-primary" />
          UI Bibliotheken
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Kuratierte Sammlung moderner UI-Bibliotheken für React-Projekte.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {libraries.map((lib, index) => (
          <motion.a
            key={lib.name}
            href={lib.url}
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
                  <lib.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="rounded-lg bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                  {lib.category}
                </span>
              </div>

              <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
                {lib.name}
              </h3>

              <p className="mb-4 text-sm text-muted-foreground">
                {lib.description}
              </p>

              <div className="flex items-center gap-1 text-sm font-medium text-primary">
                Besuchen
                <ExternalLink className="h-4 w-4" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}