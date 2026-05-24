# Skills-Seite — Implementierungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Neuen Menüpunkt „Skills" anlegen, der kuratierte Agent-Skills und Plugins mit Kurzbeschreibung und externem Link in kategorisierten Sektionen anzeigt.

**Architecture:** Statische Client Component nach dem Tool-Directory-Muster — Daten in `src/data/skills.ts`, Seite in `src/app/skills/page.tsx` mit Framer Motion Animationen, Sidebar-Eintrag nach „Tool Directory". Kein Store, kein API-Aufruf, kein eigener State.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide Icons

---

### Task 1: Datei `src/data/skills.ts` anlegen

**Files:**
- Create: `src/data/skills.ts`

> Hinweis: Kein Testframework konfiguriert (Vitest in deps aber nicht eingerichtet). Schritte ohne TDD-Zyklus.

- [ ] **Schritt 1: Datei anlegen**

Inhalt exakt so in `src/data/skills.ts` schreiben:

```typescript
import type { ElementType } from 'react';
import {
  BookMarked,
  Brain,
  Code2,
  Lightbulb,
  Palette,
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
```

- [ ] **Schritt 2: Commit**

```bash
git add src/data/skills.ts
git commit -m "feat(skills): add skills data file with 3 categories and 8 entries"
```

---

### Task 2: Seite `src/app/skills/page.tsx` anlegen

**Files:**
- Create: `src/app/skills/page.tsx`

- [ ] **Schritt 1: Verzeichnis anlegen und Datei schreiben**

Ordner `src/app/skills/` anlegen, dann `src/app/skills/page.tsx` mit folgendem Inhalt:

```typescript
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
```

- [ ] **Schritt 2: Im Browser prüfen**

Dev-Server starten (falls nicht läuft):

```bash
npm run dev
```

`http://localhost:3000/skills` öffnen und prüfen:
- Header mit Blocks-Icon und Titel sichtbar
- 3 Abschnitte: Development (4 Karten), Design & Marketing (2 Karten), Knowledge & AI Tools (2 Karten)
- Hover-Effekt: Border wird farbig, „Öffnen ↗" erscheint
- Links öffnen korrekte GitHub-URLs in neuem Tab
- Responsive: 2-spaltig auf Tablet, 4-spaltig auf Desktop

- [ ] **Schritt 3: Commit**

```bash
git add src/app/skills/page.tsx
git commit -m "feat(skills): add skills page with categorized sections"
```

---

### Task 3: Sidebar-Eintrag hinzufügen

**Files:**
- Modify: `src/components/layout/Sidebar.tsx:7-29` (imports) und `:41-59` (navItems)

- [ ] **Schritt 1: `Blocks`-Icon zum Import hinzufügen**

In `src/components/layout/Sidebar.tsx` den bestehenden Import-Block (Zeile 7–29) anpassen — `Blocks` ergänzen:

```typescript
import {
  Blocks,
  BookOpen,
  Box,
  Compass,
  Factory,
  FileText,
  FolderKanban,
  Github,
  History,
  Lightbulb,
  Library,
  Layers,
  Menu,
  Newspaper,
  Rocket,
  Server,
  Settings,
  Settings2,
  Sparkles,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
```

- [ ] **Schritt 2: Skills-Eintrag in `navItems` einfügen**

In `src/components/layout/Sidebar.tsx` den `navItems`-Array (ab Zeile 41) anpassen — nach dem Tool-Directory-Eintrag `Blocks` einfügen:

```typescript
const navItems: NavItem[] = [
  { label: 'Prompt Builder', href: '/prompt-builder', icon: Wrench },
  { label: 'Prompt Composer', href: '/prompt-composer', icon: Layers },
  { label: 'Prompt Factory', href: '/prompt-factory', icon: Factory },
  { label: 'Prompt Bibliothek', href: '/prompt-library', icon: Library, badge: 'Neu' },
  { label: 'Workflows', href: '/workflows', icon: FolderKanban },
  { label: 'Help Bibliothek', href: '/help-library', icon: FileText },
  { label: 'UI Bibliotheken', href: '/ui-libraries', icon: Box },
  { label: 'Tool Directory', href: '/tool-directory', icon: Compass },
  { label: 'Skills', href: '/skills', icon: Blocks },
  { label: 'GitHub Repos', href: '/github', icon: Github },
  { label: 'Wissensbasis', href: '/knowledge', icon: BookOpen },
  { label: 'Blog', href: '/blog', icon: Newspaper },
  { label: 'Setup', href: '/setup', icon: Settings2 },
  { label: 'Hosting', href: '/hosting', icon: Server },
  { label: 'Superpowers', href: '/superpowers', icon: Zap },
  { label: 'Ideen Lab', href: '/idea-lab', icon: Lightbulb },
  { label: 'Rules Generator', href: '/rules-generator', icon: Sparkles },
  { label: 'Verlauf', href: '/history', icon: History },
];
```

- [ ] **Schritt 3: Im Browser prüfen**

`http://localhost:3000` öffnen und prüfen:
- „Skills" erscheint in der Sidebar nach „Tool Directory"
- Klick navigiert zu `/skills`
- Aktiver Zustand (Highlight) funktioniert auf der Skills-Seite
- Mobile Drawer zeigt den Eintrag ebenfalls korrekt

- [ ] **Schritt 4: Commit**

```bash
git add src/components/layout/Sidebar.tsx
git commit -m "feat(skills): add Skills nav item to sidebar"
```

---

## Spec Coverage Check

| Spec-Anforderung | Task |
|-----------------|------|
| 3 Kategorien (Development, Design & Marketing, Knowledge & AI Tools) | Task 1 |
| 8 Einträge mit Name, Beschreibung, URL, Icon, Author | Task 1 |
| Kategorisierte Sektionen wie Tool Directory | Task 2 |
| Framer Motion Animationen mit Stagger | Task 2 |
| Hover-Effekt (Border + Shadow + Öffnen CTA) | Task 2 |
| Responsive Grid (sm:2, lg:4) | Task 2 |
| Sidebar-Eintrag nach „Tool Directory" | Task 3 |
| Blocks-Icon in Sidebar | Task 3 |
