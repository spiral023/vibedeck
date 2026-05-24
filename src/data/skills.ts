import type { ElementType } from 'react';
import {
  BookMarked,
  Bot,
  Brain,
  Code2,
  Database,
  Lightbulb,
  Paintbrush,
  Palette,
  Rocket,
  Target,
  Terminal,
  TrendingUp,
  Wand2,
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
      {
        name: 'affaan-m/ECC',
        description:
          '60 spezialisierte Subagenten, 232 Skills und 75 Legacy-Shims für Claude Code, Cursor, Codex und Co. — von Code Review bis Security Scanning.',
        url: 'https://github.com/affaan-m/ECC',
        icon: Bot,
        author: 'Affaan Mustafa',
      },
      {
        name: 'get-shit-done',
        description:
          'Meta-Prompting-System gegen Context Rot: strukturierte Artefakte (Vision, Roadmap, State) und ein sechsstufiger Loop — Initialize → Discuss → Plan → Execute → Verify → Ship.',
        url: 'https://github.com/gsd-build/get-shit-done',
        icon: Target,
        author: 'open-gsd',
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
      {
        name: 'make-interfaces-feel-better',
        description:
          'Skill für kleine aber wirkungsvolle UI-Details: nested Border Radius, Ein-/Ausgangsanimationen, Shadow-Einsatz und Text-Wrapping — die Design-Engineering-Details, die Interfaces polieren.',
        url: 'https://github.com/jakubkrehel/make-interfaces-feel-better',
        icon: Wand2,
        author: 'Jakub Krehel',
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
      {
        name: 'context7',
        description:
          'MCP-Server und CLI, der versionsgenaue Bibliotheks-Dokumentation (React, Next.js, Prisma u.v.m.) direkt in den LLM-Kontext lädt — keine veralteten Trainingsdaten, keine halluzinierten APIs.',
        url: 'https://github.com/upstash/context7',
        icon: Database,
        author: 'Upstash',
      },
    ],
  },
];
