import type { ElementType } from 'react';
import { Box, Palette, Code2, Layers, Boxes, Paintbrush, Sparkles, Wand2 } from 'lucide-react';

export interface UiLibrary {
  name: string;
  description: string;
  url: string;
  category: string;
  icon: ElementType;
}

export const uiLibraries: UiLibrary[] = [
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
