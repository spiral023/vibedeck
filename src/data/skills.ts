import type { ElementType } from 'react';
import {
  BookMarked,
  Brain,
  Code2,
  Lightbulb,
  Paintbrush,
  Palette,
  Rocket,
  Terminal,
  TrendingUp,
  Zap,
} from 'lucide-react';

export interface SkillEntry {
  name: string;
  description: string;
  url: string;
  icon: ElementType;
  author?: string;
}

export interface SkillCategory {
  name: string;
  skills: SkillEntry[];
}

export const skillCategories: SkillCategory[] = [
  {
    name: 'Development',
    skills: [
      {
        name: 'gstack',
        description:
          '40+ Slash-Commands für den vollständigen Dev-Zyklus (Think→Plan→Build→Review→Ship) mit Claude Code.',
        url: 'https://github.com/garrytan/gstack',
        icon: Terminal,
        author: 'Garry Tan',
      },
      {
        name: 'mattpocock/skills',
        description:
          '20+ komponierbare Agent Skills für Requirements-Klärung, TDD, Debugging und Architektur-Pflege.',
        url: 'https://github.com/mattpocock/skills',
        icon: Code2,
        author: 'Matt Pocock',
      },
      {
        name: 'claude-code-best-practice',
        description:
          '83 Tipps und 11 Workflow-Methoden für produktionsnahes Agentic Engineering mit Claude Code.',
        url: 'https://github.com/shanraisshan/claude-code-best-practice',
        icon: Lightbulb,
        author: 'Shan Raisshan',
      },
      {
        name: 'vercel-labs/agent-skills',
        description:
          'Offizielle Vercel-Skills für Next.js-Optimierung, Performance-Audits und Vercel-Deployments.',
        url: 'https://github.com/vercel-labs/agent-skills',
        icon: Zap,
        author: 'Vercel Labs',
      },
      {
        name: 'obra/superpowers',
        description:
          'Agentic Skills-Framework mit strukturierten Workflows für Brainstorming, Planung, TDD, Subagent-Koordination und Code-Reviews.',
        url: 'https://github.com/obra/superpowers',
        icon: Rocket,
        author: 'Jesse Vincent',
      },
    ],
  },
  {
    name: 'Design & Marketing',
    skills: [
      {
        name: 'ui-ux-pro-max-skill',
        description:
          '161 Design-Regeln, 67 UI-Stile und 161 Farbpaletten — generiert vollständige Design-Systeme für React, Next.js und Flutter in Sekunden.',
        url: 'https://github.com/nextlevelbuilder/ui-ux-pro-max-skill',
        icon: Palette,
        author: 'nextlevelbuilder',
      },
      {
        name: 'marketingskills',
        description:
          '40+ Marketing-Skills für Conversion-Optimierung, SEO, Paid Ads, Retention und Copywriting mit Claude Code.',
        url: 'https://github.com/coreyhaines31/marketingskills',
        icon: TrendingUp,
        author: 'Corey Haines',
      },
      {
        name: 'anthropics/skills · frontend-design',
        description:
          'Offizieller Anthropic-Skill für produktionsreife Frontend-Interfaces — mutige Typografie, Farbpaletten, Animationen und räumliche Komposition statt generischer AI-Optik.',
        url: 'https://github.com/anthropics/skills',
        icon: Paintbrush,
        author: 'Anthropic',
      },
    ],
  },
  {
    name: 'Knowledge & AI Tools',
    skills: [
      {
        name: 'obsidian-skills',
        description:
          '5 Agent Skills für Obsidian-Vaults: Markdown, Bases, Canvas, CLI-Interaktion und sauberes Web-Scraping.',
        url: 'https://github.com/kepano/obsidian-skills',
        icon: BookMarked,
        author: 'Kepano',
      },
      {
        name: 'notebooklm-py',
        description:
          'Python-CLI für programmatischen Zugriff auf Google NotebookLM — Quellen, Audio-Overviews und Quiz via Agent.',
        url: 'https://github.com/teng-lin/notebooklm-py',
        icon: Brain,
        author: 'Teng Lin',
      },
    ],
  },
];
