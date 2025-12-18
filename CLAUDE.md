# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Project Overview

VibeDeck is an AI Prompt Engineering Studio built with Next.js 16 (App Router). It's a German-language application that provides a centralized hub for managing prompts, workflows, and AI-related resources. The architecture is entirely client-side with no backend API - all data is stored as markdown files and state is managed via Zustand with localStorage persistence.

## Architecture

### Server/Client Component Pattern

The codebase follows a strict server/client component separation:

```
Server Component (page.tsx)
├── Fetches data from markdown files (getAllPrompts, getPromptById)
├── Processes server-side only operations
└── Passes data to Client Component

Client Component (client.tsx or client-page.tsx)
├── Handles user interactions and state
├── Integrates with Zustand stores
├── Uses React hooks (useState, useSearchParams, useRouter)
└── Manages client-side filtering/search
```

**Important**: Server components cannot use hooks or browser APIs. Client components are marked with `"use client"` directive and handle all interactivity.

### Data Flow: Markdown-Based Content System

All prompts are stored in `src/content/prompts/` as markdown files with YAML frontmatter:

1. **File Structure** (e.g., `react-component-generator.md`):
   - Frontmatter (YAML) contains metadata validated by Zod schemas
   - Body contains additional documentation/examples

2. **Loading Pipeline** (`src/lib/prompts.ts`):
   ```typescript
   getAllPrompts() → gray-matter parsing → Zod validation → Typed Prompt[]
   ```

3. **Frontmatter Schema** (defined in `src/types/prompt.ts`):
   ```yaml
   id: string
   title: string
   category: 'Build' | 'Browse' | 'Ship' | 'Learn'
   tags: string[]
   complexity: 'beginner' | 'intermediate' | 'expert'
   agent_role?: string
   variables: [{ name, label, default? }]
   changelog: [{ date: YYYY-MM-DD, note }]
   pre_prompt: string (multiline with |)
   variants:
     default: string (supports {{variable}} placeholders)
     beginner?: string
     expert?: string
   ```

4. **Adding New Prompts**:
   - Create `.md` file in `src/content/prompts/`
   - Follow existing frontmatter schema exactly
   - ID should match filename (without .md)
   - Use `{{variableName}}` syntax for variable placeholders
   - No code changes needed - prompts auto-discovered at build time

### State Management: Zustand Stores

Four global stores with localStorage persistence (all in `src/stores/`):

1. **`settings-store.ts`** - User Preferences:
   - `themeMode`, `preferredLanguage`, `defaultComplexity`
   - `globalVariables` (user-defined variables like `global_stack`, `global_project_name`)
   - Used for prompt variable substitution across the app

2. **`theme-store.ts`** - Theme Management:
   - Handles dark/light/system theme with DOM manipulation
   - Separate from settings store for performance

3. **`history-store.ts`** - User Action History:
   - Tracks last 100 actions (prompt copies, builder usage)
   - Stores resolved variables and output for each action

4. **`prompt-status-store.ts`** - Prompt Metadata:
   - `favorites`: Record<promptId, true>
   - `done`: Record<promptId, true>
   - `agentRoleOverrides`: Record<promptId, customRole>

**Usage Pattern**:
```typescript
'use client'
import { useSettingsStore } from '@/stores/settings-store'

function Component() {
  const { globalVariables, setGlobalVariable } = useSettingsStore()
  // Updates automatically persist to localStorage
}
```

### Routing Structure (Next.js App Router)

18 routes organized by feature:

```
/                          → Homepage with stats and quick access
/prompt-builder            → Custom prompt builder with state sharing
/prompt-factory            → Generate prompts using factory pattern
/prompt-library            → Browse/filter/search prompts (main feature)
/prompt-library/[id]       → Individual prompt detail with variable input
/workflows                 → Workflow templates listing
/workflows/[id]            → Workflow execution with step-by-step guide
/help-library              → Help documentation
/history                   → User action history
/settings                  → User preferences and global variables
/rules-generator           → Generate cursor/windsurf rules
/superpowers              → Advanced features
/tool-directory           → Tool directory
/ui-libraries             → UI component library info
/knowledge                → Knowledge base
/hosting                  → Hosting resources
/idea-lab                 → Idea brainstorming
```

**Navigation**: Sidebar component (`src/components/layout/Sidebar.tsx`) renders all routes with responsive mobile drawer.

### Component Organization

**Layout Components** (`src/components/layout/`):
- `Sidebar.tsx` - Main navigation with responsive design (desktop sidebar + mobile drawer)

**Domain Components** (`src/components/prompts/`):
- `PromptCard.tsx` - Reusable card for prompt listings
- `TokenEstimator.tsx` - GPT token counting

**UI Components** (`src/components/ui/`):
- 50+ shadcn/ui components (Radix UI foundation)
- Never modify these directly - regenerate via shadcn CLI if needed

**App-Level Components** (`src/app/`):
- `client-layout.tsx` - Wraps all pages with sidebar, command palette, toasters
- `providers.tsx` - React Query and Tooltip providers

### Variable Substitution System

VibeDeck uses a sophisticated variable system for prompt templates:

1. **Variable Types**:
   - **Prompt-specific**: Defined in frontmatter `variables` array
   - **Global**: Stored in settings store (e.g., `{{global_stack}}`)

2. **Resolution Order** (`src/lib/placeholder-utils.ts`):
   ```typescript
   {{variableName}} → Check user input → Check global variables → Use default → Empty string
   ```

3. **Usage in Templates**:
   ```yaml
   variants:
     default: |
       Create a {{componentName}} using {{global_stack}}.
       Project: {{global_project_name}}
   ```

4. **User Flow**:
   - User clicks prompt → Modal shows input fields for variables
   - Global variables auto-populate from settings
   - User can override per-use
   - Resolved prompt copied to clipboard with history entry

## Key Utilities

### Copy Formatting (`src/lib/copy-utils.ts`)

Three copy formats available throughout app:

```typescript
formatForCopy(text, 'markdown')  // With markdown formatting
formatForCopy(text, 'raw')       // Plain text only
formatForCopy(text, 'json')      // JSON structure
```

Used in: PromptCard actions, prompt detail page, builder export.

### Token Counting (`src/lib/token-utils.ts`)

```typescript
import { countTokens } from '@/lib/token-utils'

const tokens = countTokens(promptText)  // Uses gpt-tokenizer package
```

Displayed in TokenEstimator component and prompt detail pages.

### Syntax Highlighting (`src/lib/shiki-utils.ts`)

```typescript
import { highlightCode } from '@/lib/shiki-utils'

const html = await highlightCode(code, 'typescript')
```

Used for code blocks in prompt body content.

## Styling Conventions

- **Tailwind CSS** for all styling (never write custom CSS)
- **CSS Variables** for theming (defined in `globals.css`)
- Use `cn()` utility from `src/lib/utils.ts` for conditional classes:
  ```typescript
  import { cn } from '@/lib/utils'

  <div className={cn("base-class", isActive && "active-class")} />
  ```
- **Responsive Design**: Mobile-first with Tailwind breakpoints (sm, md, lg, xl, 2xl)

## Search and Filtering

### Fuse.js Integration

The prompt library uses Fuse.js for client-side fuzzy search:

```typescript
const fuse = new Fuse(prompts, {
  keys: ['title', 'tags', 'category'],
  threshold: 0.3,
  includeScore: true
})
```

Combined with URL search params for persistent filter state:

```typescript
const searchParams = useSearchParams()
const category = searchParams.get('category')
const tags = searchParams.get('tags')?.split(',')
```

**Important**: Always update URL when filters change to maintain deep-linking capability.

## Testing

No test framework currently configured. If adding tests:
- Vitest is already in dependencies
- Configure for Next.js App Router server/client components
- Mock Zustand stores for component tests

## Common Patterns

### Adding a New Page

1. Create route folder in `src/app/[route-name]/`
2. Create `page.tsx` (server component) for data fetching
3. Create `client.tsx` with `"use client"` directive for interactivity
4. Export default from `page.tsx` that renders client component
5. Add route to `Sidebar.tsx` navigation array
6. Update CommandPalette pages array if applicable

### Adding a New Zustand Store

1. Create file in `src/stores/[store-name]-store.ts`
2. Use `persist` middleware for localStorage:
   ```typescript
   export const useMyStore = create<MyState>()(
     persist(
       (set) => ({ /* state and actions */ }),
       { name: 'vibedeck-[store-name]', version: 1 }
     )
   )
   ```
3. Import and use in client components only

### Working with Prompts

When adding/modifying prompts:
- Always validate frontmatter matches Zod schema in `src/types/prompt.ts`
- Date format: `YYYY-MM-DD` (strictly enforced by regex)
- Variables are case-sensitive: `{{componentName}}` ≠ `{{ComponentName}}`
- Pre-prompt and variants support multiline with YAML `|` syntax
- Test variable substitution in UI before committing

## Technology Stack

- **Framework**: Next.js 16.0.10 (App Router, React 18.3.1)
- **Language**: TypeScript 5.8.3 (strict mode)
- **Styling**: Tailwind CSS 3.4.17, shadcn/ui components
- **State**: Zustand 5.0.9 with localStorage persistence
- **Data**: gray-matter (YAML frontmatter), Zod validation
- **Search**: Fuse.js 7.1.0
- **Animations**: Framer Motion 12.23.26
- **Forms**: React Hook Form 7.61.1 with Zod resolvers
- **Utilities**: gpt-tokenizer, nanoid, date-fns, shiki

## Important Constraints

1. **No Backend**: This is a static site. All data must be in markdown files or hardcoded in `src/data/`.
2. **German-First**: UI text is primarily German. Consider localization when adding new strings.
3. **Client-Side Only Stores**: Zustand stores only work in client components with `"use client"`.
4. **Server Component Restrictions**: Cannot use hooks, browser APIs, or event handlers in `page.tsx` files.
5. **Prompt Schema**: Changing prompt frontmatter schema requires updating Zod schemas AND all existing markdown files.
6. **localStorage Dependency**: All user data (settings, history, favorites) is stored locally - no cloud sync.

## File Naming Conventions

- **Pages**: `page.tsx` (server), `client.tsx` or `client-page.tsx` (client)
- **Components**: PascalCase (`PromptCard.tsx`)
- **Utilities**: kebab-case (`copy-utils.ts`)
- **Stores**: kebab-case with `-store` suffix (`settings-store.ts`)
- **Types**: kebab-case (`prompt.ts`)
- **Content**: kebab-case markdown files (`react-component-generator.md`)
