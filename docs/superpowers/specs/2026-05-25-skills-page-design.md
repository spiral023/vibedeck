# Skills-Seite — Design-Spec

**Datum:** 2026-05-25  
**Status:** Freigegeben

## Ziel

Neuer Menüpunkt „Skills" in der Sidebar, der kuratierte Skills und Plugins für Coding Agents (Claude Code, Cursor, Windsurf, Codex) verlinkt — jeweils mit Kurzbeschreibung und Kategorie.

## Architektur

```
src/
├── data/skills.ts              ← Daten (TypeScript, statisch)
└── app/skills/
    └── page.tsx                ← Server Component (kein client nötig)

src/components/layout/
└── Sidebar.tsx                 ← +1 Eintrag nach „Tool Directory"
```

Kein Zustand, kein Zustand-Store, keine API. Gleiche Architektur wie `ui-libraries` und `tool-directory`.

## Datenstruktur

```typescript
// src/data/skills.ts
import { ElementType } from 'react';

export interface SkillEntry {
  name: string;
  description: string;
  url: string;
  icon: ElementType;
  author?: string;
}

export interface SkillCategory {
  name: string;
  icon: ElementType;
  skills: SkillEntry[];
}
```

## Inhalt: 3 Kategorien, 8 Einträge

### Development (4 Einträge)

| Name | URL | Beschreibung | Author |
|------|-----|-------------|--------|
| gstack | https://github.com/garrytan/gstack | 40+ Slash-Commands für den vollständigen Dev-Zyklus (Think→Plan→Build→Review→Ship) mit Claude Code | Garry Tan |
| mattpocock/skills | https://github.com/mattpocock/skills | 20+ komponierbare Agent Skills für Requirements-Klärung, TDD, Debugging und Architektur-Pflege | Matt Pocock |
| claude-code-best-practice | https://github.com/shanraisshan/claude-code-best-practice | 83 Tipps + 11 Workflow-Methoden für produktionsnahes Agentic Engineering mit Claude Code | Shan Raisshan |
| vercel-labs/agent-skills | https://github.com/vercel-labs/agent-skills | Offizielle Vercel-Skills für Next.js-Optimierung, Performance-Audits und Vercel-Deployments | Vercel Labs |

### Design & Marketing (2 Einträge)

| Name | URL | Beschreibung | Author |
|------|-----|-------------|--------|
| ui-ux-pro-max-skill | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | 161 Design-Regeln, 67 UI-Stile und 161 Farbpaletten — generiert vollständige Design-Systeme in Sekunden | nextlevelbuilder |
| marketingskills | https://github.com/coreyhaines31/marketingskills | 40+ Marketing-Skills für Conversion, SEO, Ads, Retention und Copywriting mit Claude Code | Corey Haines |

### Knowledge & AI Tools (2 Einträge)

| Name | URL | Beschreibung | Author |
|------|-----|-------------|--------|
| obsidian-skills | https://github.com/kepano/obsidian-skills | 5 Skills für Obsidian-Vaults: Markdown, Bases, Canvas, CLI und sauberes Web-Scraping | Kepano |
| notebooklm-py | https://github.com/teng-lin/notebooklm-py | Python-CLI für programmatischen Zugriff auf Google NotebookLM — Quellen, Audio-Overviews, Quiz via Agent | Teng Lin |

## Seitenlayout

```
┌─────────────────────────────────────────────────────────────┐
│  [Blocks-Icon] Skills & Plugins                             │  ← motion: opacity 0→1, y -10→0
│  Kuratierte Skills & Plugins für Coding Agents              │
│                                                             │
│  ── Development ─────────────────────────────────────────── │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐   │  ← sm:2-col, lg:4-col
│  │ gstack    │ │mattpocock │ │claude-best│ │vercel-skls│   │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘   │
│                                                             │
│  ── Design & Marketing ──────────────────────────────────── │
│  ┌───────────┐ ┌───────────┐                               │
│  │ui-ux-pro  │ │mktgskills │                               │
│  └───────────┘ └───────────┘                               │
│                                                             │
│  ── Knowledge & AI Tools ────────────────────────────────── │
│  ┌───────────┐ ┌───────────┐                               │
│  │obsidian   │ │notebooklm │                               │
│  └───────────┘ └───────────┘                               │
└─────────────────────────────────────────────────────────────┘
```

## Kartendesign

Identisch mit `tool-directory` (`p-4`, kompakt):

```
┌──────────────────────────────────────────┐
│  [Icon] Name der Skill          [author] │  ← icon + title inline, author rechts (xs, muted)
│  Beschreibung in 2 Zeilen...             │  ← line-clamp-2, text-sm, muted
│  Öffnen ↗                                │  ← hover-only (opacity transition), text-primary
└──────────────────────────────────────────┘
```

- **Border/BG:** `border-border/50 bg-card/50` → hover: `border-primary/30 bg-card shadow-lg`
- **Border-Radius:** `rounded-2xl`
- **Padding:** `p-4`
- **Icon:** direkt im Text-Flow, `h-5 w-5 text-primary`
- **Author:** optional, `text-xs text-muted-foreground`, rechts neben Titel
- **CTA:** `opacity-0 group-hover:opacity-100 transition-opacity`

## Animationen

```typescript
// Header
initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}

// Karten (Stagger per Kategorie)
transition={{ delay: catIndex * 0.1 + index * 0.03 }}
```

## Sidebar-Integration

```typescript
// src/components/layout/Sidebar.tsx — nach Tool Directory einfügen:
{ label: 'Skills', href: '/skills', icon: Blocks }
```

## Nicht in Scope

- Filter, Suche, Favoriten — zu wenig Einträge bei 8 Items
- Zustand-Store — kein User-State nötig
- Detail-Seiten — direkter Link zum GitHub-Repo reicht
- Badge für „neu" — nach Bedarf später ergänzen
