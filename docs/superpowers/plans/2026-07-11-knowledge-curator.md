# Knowledge Curator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Den installierten Codex-Skill `knowledge-curator` zu einem evidenzbasierten, multimodalen Workflow für Create, Update, Improve und Merge von VibeDeck-Wissensartikeln auszubauen.

**Architecture:** Eine kompakte `SKILL.md` orchestriert Moduswahl, Quellenaufnahme, Synthese und Qualitäts-Gates. Zwei bedarfsgeladene Referenzen trennen Quellenstrategien vom VibeDeck-Format; ein Node.js-Validator prüft deterministische Artikel- und Assetregeln. Die bestehende Gemini-Skill-Kopie wird erst nach bestandener Validierung entfernt.

**Tech Stack:** Markdown Agent Skills, Node.js ESM, `node:test`, `gray-matter` aus dem VibeDeck-Projekt, PowerShell, Codex Browser/Web/GitHub-Werkzeuge.

---

## File Map

- Modify: `C:/Users/asi/.codex/skills/knowledge-curator/SKILL.md` — kompakte Workflow-Steuerung und Qualitäts-Gates.
- Modify: `C:/Users/asi/.codex/skills/knowledge-curator/agents/openai.yaml` — UI-Metadaten passend zum erweiterten Skill.
- Create: `C:/Users/asi/.codex/skills/knowledge-curator/references/source-playbooks.md` — X-, Website-, Docs-, GitHub- und Markdown-spezifische Extraktion.
- Create: `C:/Users/asi/.codex/skills/knowledge-curator/references/vibedeck-article-format.md` — Frontmatter, Schreibstil, Bilder, Mermaid, Tabellen und Artikelstruktur.
- Create: `C:/Users/asi/.codex/skills/knowledge-curator/scripts/validate-knowledge-article.mjs` — deterministische Artikelprüfung.
- Create: `C:/Users/asi/.codex/skills/knowledge-curator/scripts/validate-knowledge-article.test.mjs` — Validator-Regressionstests.
- Delete: `C:/Users/asi/Documents/GitHub/vibedeck/.gemini/skills/knowledge-curator/SKILL.md` — obsolet nach erfolgreicher Codex-Migration.
- Existing: `C:/Users/asi/Documents/GitHub/vibedeck/docs/superpowers/specs/2026-07-11-knowledge-curator-design.md` — freigegebene Anforderungen.

### Task 1: Baseline-Evaluation des unveränderten Skills

**Files:**
- Read: `C:/Users/asi/.codex/skills/knowledge-curator/SKILL.md`
- Read: `C:/Users/asi/Documents/GitHub/vibedeck/.gemini/skills/knowledge-curator/SKILL.md`
- Do not persist evaluation artifacts in the skill directory.

- [ ] **Step 1: Record the current skill checksum and content boundary**

Run:

```powershell
Get-FileHash C:/Users/asi/.codex/skills/knowledge-curator/SKILL.md -Algorithm SHA256
(Get-Content C:/Users/asi/.codex/skills/knowledge-curator/SKILL.md).Count
```

Expected: one SHA256 hash and the current line count; no file changes.

- [ ] **Step 2: Run six fresh baseline scenarios without supplying the skill body**

Use fresh evaluation agents with minimal context. Give each only one of these prompts and ask for an execution plan, not live external mutations:

```text
1. Erstelle aus einem 18-Post-X-Thread mit sechs Bildern einen VibeDeck-Wissensartikel. Der Thread ist lazy-loaded; zwei Antworten stammen von anderen Accounts.
2. Erstelle aus einer Website mit Navigation, Newsletter-CTA, Codeblöcken und drei erklärenden Diagrammen einen Wissensartikel samt Bildern.
3. Erstelle aus einem GitHub-Repository mit README, docs/, Releases und Beispielcode einen belastbaren Wissensartikel.
4. Kombiniere drei Quellen, von denen zwei beim Veröffentlichungsdatum und einer Performance-Aussage widersprechen.
5. Verbessere einen vorhandenen Artikel, ohne manuelle Ergänzungen oder vorhandene lokale Bilder zu verlieren.
6. Führe zwei bestehende Artikel samt Assets zusammen und lösche die Ursprungsdateien erst, wenn das Ziel valide ist.
```

Expected baseline failures to verify rather than assume: no GitHub playbook; exact-URL duplicate always aborts; no explicit create/update/improve/merge semantics; only header image; no MIME/asset verification; no multi-source evidence/conflict handling; no conditional Mermaid/table guidance; no deterministic validator.

- [ ] **Step 3: Capture exact observed gaps in the active task notes**

For every scenario record:

```text
- Chosen mode
- Source acquisition path
- Evidence/provenance handling
- Asset handling
- Destructive-action timing
- Validation performed
- Missing or unsafe behavior, quoting the evaluation output
```

Expected: concrete baseline observations drive the minimal skill edits in Tasks 4–5.

### Task 2: Write Failing Validator Tests

**Files:**
- Create: `C:/Users/asi/.codex/skills/knowledge-curator/scripts/validate-knowledge-article.test.mjs`
- Test: `C:/Users/asi/.codex/skills/knowledge-curator/scripts/validate-knowledge-article.test.mjs`

- [ ] **Step 1: Create the Node test suite before the validator exists**

Create a `node:test` suite that builds an isolated temporary VibeDeck structure and invokes the future CLI with `spawnSync`. The suite must define these fixtures inline:

```javascript
const validFrontmatter = `---
title: "Testartikel"
description: "Ein belastbarer Testartikel für die Validator-Prüfung."
type: source
status: seed
category: tooling
icon: Code2
readTime: 1
tags:
  - tooling/codex
aliases:
  - "Validator Test"
topics:
  - "[[Codex]]"
sourceURL: "https://example.com/source"
sourceType: docs
author: "Example Author"
sourceDate: "2026-07-10"
addedDate: "2026-07-11"
level: intermediate
---`;

const validBody = `
Ein kurzer fachlicher Inhalt mit genügend Kontext für den Test.

![Aussagekräftiges Diagramm](/images/knowledge/testartikel/diagram.png)

## Verbindungen

- [[Codex]]
- [[Validation]]
`;
```

Cover at least these test names and assertions:

```javascript
test('accepts a valid article with an existing local image', ... exit code 0 ...);
test('rejects missing required frontmatter and unsupported sourceType', ... output contains both diagnostics ...);
test('rejects invalid dates and implausible readTime', ... output contains date and readTime diagnostics ...);
test('rejects missing image files and unreferenced assets', ... output contains both paths ...);
test('rejects a duplicate primary source URL in another article', ... output names the duplicate article ...);
test('requires Quellen when additional source count is greater than zero', ... invoke --additional-source-count 2 ...);
test('rejects an unclosed mermaid fence', ... output contains Mermaid diagnostic ...);
```

- [ ] **Step 2: Run the tests and verify RED**

Run:

```powershell
node C:/Users/asi/.codex/skills/knowledge-curator/scripts/validate-knowledge-article.test.mjs
```

Expected: FAIL because `validate-knowledge-article.mjs` does not exist. Confirm the failure is about the missing validator, not malformed test setup.

### Task 3: Implement the Article Validator

**Files:**
- Create: `C:/Users/asi/.codex/skills/knowledge-curator/scripts/validate-knowledge-article.mjs`
- Modify: `C:/Users/asi/.codex/skills/knowledge-curator/scripts/validate-knowledge-article.test.mjs`

- [ ] **Step 1: Implement CLI argument parsing and project-aware gray-matter loading**

Implement this public CLI contract:

```text
node validate-knowledge-article.mjs <article.md> [--project-root <path>] [--additional-source-count <n>]
```

Resolve `projectRoot` from `--project-root` or by walking upward from the article until `package.json` is found. Load `gray-matter` via `createRequire(path.join(projectRoot, 'package.json'))`. On usage or dependency failure, print a precise error and exit `2`.

- [ ] **Step 2: Implement deterministic metadata checks**

Define these constants and validations:

```javascript
const REQUIRED_FIELDS = [
  'title', 'description', 'type', 'status', 'category', 'icon', 'readTime',
  'tags', 'aliases', 'topics', 'sourceURL', 'sourceType', 'addedDate'
];
const ALLOWED_TYPES = new Set(['source']);
const ALLOWED_STATUS = new Set(['seed', 'incubating', 'evergreen', 'archived']);
const ALLOWED_SOURCE_TYPES = new Set(['tweet', 'blog', 'thread', 'docs']);
const ALLOWED_LEVELS = new Set(['beginner', 'intermediate', 'advanced']);
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
```

Require non-empty arrays for `tags`, `aliases`, and `topics`; require quoted Wikilink values to parse as strings matching `/^\[\[[^\]]+\]\]$/`; validate `sourceDate` when present and `addedDate` always. Count body words after removing fenced code, Markdown URLs and Wikilink brackets. Require integer `readTime === Math.max(1, Math.ceil(words / 140))`.

- [ ] **Step 3: Implement source, section, image and Mermaid checks**

Add these behaviors:

```text
- Search src/content/knowledge/*.md for the same normalized sourceURL, excluding the target article.
- Normalize URLs by removing hashes, common tracking parameters, and trailing slash.
- Require a non-empty ## Verbindungen section with at least two unique Wikilinks.
- Require a non-empty ## Quellen section when --additional-source-count is greater than zero.
- Resolve /images/... references against <projectRoot>/public.
- Report missing referenced files.
- Report files in public/images/knowledge/<slug>/ that are not referenced by the target article.
- Require non-empty image alt text.
- Require balanced ```mermaid fences and a supported diagram declaration after each opening fence.
```

Supported Mermaid declarations:

```javascript
const MERMAID_TYPES = /^(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram(?:-v2)?|erDiagram|journey|timeline|mindmap|quadrantChart|xychart-beta|sankey-beta)\b/;
```

- [ ] **Step 4: Print all diagnostics in one run**

Output format:

```text
PASS <relative article path>
```

or:

```text
FAIL <relative article path>
- <diagnostic 1>
- <diagnostic 2>
```

Exit `0` on success and `1` on validation failures. Do not stop after the first content error.

- [ ] **Step 5: Run validator tests and verify GREEN**

Run:

```powershell
node C:/Users/asi/.codex/skills/knowledge-curator/scripts/validate-knowledge-article.test.mjs
```

Expected: all seven or more tests PASS with no warnings.

### Task 4: Add Source and Format References

**Files:**
- Create: `C:/Users/asi/.codex/skills/knowledge-curator/references/source-playbooks.md`
- Create: `C:/Users/asi/.codex/skills/knowledge-curator/references/vibedeck-article-format.md`

- [ ] **Step 1: Write source-playbooks.md**

Use one top-level quick-reference table followed by sections for `X/Twitter`, `Website/Blog`, `Docs/PDF`, `GitHub Repository`, and `Existing Markdown`. Each section must state:

```text
- what to inspect
- preferred access path
- fallback path
- how to identify completeness
- media extraction rules
- provenance/conflict risks
- stop conditions
```

Include the X rule that author posts must be separated from third-party replies, the website rule to remove boilerplate, and the GitHub rule to inspect only files relevant to the article question. Tool names must be capability-based (`browser`, `web search`, `GitHub/API/CLI`) with examples, not hard dependencies on obsolete MCP identifiers.

- [ ] **Step 2: Write vibedeck-article-format.md**

Include the exact supported `KnowledgeArticle` frontmatter fields from `src/types/knowledge.ts`, the four source type values, date/read-time rules, and a complete canonical Source Note example. Define:

```text
- adaptive synthesis behavior
- German language and retained English technical terms
- ## Quellen and ## Verbindungen contracts
- image selection, local storage, alt text and ordering
- optional Mermaid decision rule
- optional Markdown table decision rule
- create/update/improve/merge preservation rules
```

State explicitly: Mermaid or a table is used only when it communicates a relationship materially better than concise prose; neither is a default article component.

- [ ] **Step 3: Check references for duplication and stale commands**

Run:

```powershell
rg -n "playwright__|brave_web_search|mkdir -p|curl -o|readTime: 10 Min|sourceType:.*article" C:/Users/asi/.codex/skills/knowledge-curator/references
```

Expected: no stale hard-coded tool identifiers, Unix-only project commands, invalid readTime strings, or unsupported `article` source type.

### Task 5: Rewrite the Core Skill Against Baseline Failures

**Files:**
- Modify: `C:/Users/asi/.codex/skills/knowledge-curator/SKILL.md`
- Read: `C:/Users/asi/.codex/skills/knowledge-curator/references/source-playbooks.md`
- Read: `C:/Users/asi/.codex/skills/knowledge-curator/references/vibedeck-article-format.md`

- [ ] **Step 1: Replace frontmatter description with trigger-only metadata**

Use exactly two YAML fields and a trigger-focused description:

```yaml
---
name: knowledge-curator
description: Use when creating, updating, improving, or merging VibeDeck Markdown knowledge articles from URLs, X/Twitter posts or threads, websites, documentation, GitHub repositories, multiple sources, or existing knowledge notes, especially when source images and provenance must be preserved.
---
```

- [ ] **Step 2: Define mode selection and non-destructive semantics**

Add a compact table for `create`, `update`, `improve`, `merge`. Require explicit target confirmation only when multiple existing articles are equally plausible. Exact URL duplicates stop only `create`; other modes reuse the existing article. Require validation before deleting merge inputs or assets.

- [ ] **Step 3: Define the evidence-first workflow**

The core workflow must require this sequence:

```text
1. Inspect project schema and existing content conventions.
2. Select mode and target.
3. Check exact and semantic duplicates.
4. Read source-playbooks.md sections for only the active source types.
5. Acquire complete text, metadata and relevant media.
6. Build an internal claim/source/confidence/conflict inventory.
7. Read vibedeck-article-format.md.
8. Draft or revise without inventing facts.
9. Download and verify assets before referencing them.
10. Run the bundled validator.
11. Run the relevant VibeDeck project check/build.
12. Only then perform approved cleanup or merge deletion.
```

- [ ] **Step 4: Add adaptive synthesis and conditional visual rules**

State that short sources gain only necessary explanatory context, long sources are organized and condensed, and multiple sources become a traceable synthesis. Require Mermaid and tables only when they materially improve explanation; prohibit decorative or redundant visuals.

- [ ] **Step 5: Add failure and completion gates from baseline observations**

Address every concrete Task 1 failure. Include blocked-source fallbacks, incomplete-thread handling, image download failure, source conflict handling, preservation of manual content, no empty asset directories, and no success claim before validator and project checks pass.

- [ ] **Step 6: Keep the core skill concise**

Run:

```powershell
$lines = (Get-Content C:/Users/asi/.codex/skills/knowledge-curator/SKILL.md).Count
$words = ((Get-Content -Raw C:/Users/asi/.codex/skills/knowledge-curator/SKILL.md) -split '\s+' | Where-Object { $_ }).Count
"lines=$lines words=$words"
```

Expected: fewer than 300 lines; detailed schemas and source variants live in references.

### Task 6: Refresh Skill UI Metadata and Validate Structure

**Files:**
- Modify: `C:/Users/asi/.codex/skills/knowledge-curator/agents/openai.yaml`
- Read: `C:/Users/asi/.codex/skills/.system/skill-creator/references/openai_yaml.md`

- [ ] **Step 1: Regenerate openai.yaml**

Run the official generator with these interface values:

```powershell
python C:/Users/asi/.codex/skills/.system/skill-creator/scripts/generate_openai_yaml.py C:/Users/asi/.codex/skills/knowledge-curator --interface "display_name=Knowledge Curator" --interface "short_description=Quellen in belastbare VibeDeck-Wissensartikel verwandeln" --interface "default_prompt=Nutze $knowledge-curator, um diese Quellen als belegbaren VibeDeck-Wissensartikel zu erstellen, zu verbessern oder zusammenzuführen."
```

Expected: valid `agents/openai.yaml` with no optional branding fields.

- [ ] **Step 2: Run the official skill validator**

Run:

```powershell
python C:/Users/asi/.codex/skills/.system/skill-creator/scripts/quick_validate.py C:/Users/asi/.codex/skills/knowledge-curator
```

Expected: validation succeeds.

- [ ] **Step 3: Verify every referenced resource exists**

Run:

```powershell
Get-ChildItem -Recurse C:/Users/asi/.codex/skills/knowledge-curator | Select-Object FullName,Length
rg -n "references/|scripts/" C:/Users/asi/.codex/skills/knowledge-curator/SKILL.md
```

Expected: all links resolve to the two references and validator; no placeholder files.

### Task 7: Forward-Test the Revised Skill

**Files:**
- Read: all files under `C:/Users/asi/.codex/skills/knowledge-curator/`
- Do not leave generated evaluation articles or assets in the repository.

- [ ] **Step 1: Re-run the six Task 1 scenarios with fresh agents and the revised skill**

Use the exact same scenario prompts. This time explicitly request use of `$knowledge-curator` at `C:/Users/asi/.codex/skills/knowledge-curator`. Pass the skill artifact, not the intended answers or baseline diagnosis.

Expected per scenario:

```text
1. Complete author thread, ordered relevant media, third-party replies excluded.
2. Main content without boilerplate; only explanatory images retained.
3. Targeted README/docs/releases/code inspection with docs source type.
4. Claim provenance plus visible conflict treatment and ## Quellen.
5. Improve mode preserves manual text and valid assets.
6. Merge defers destructive cleanup until target validation passes.
```

- [ ] **Step 2: Run one counter-example for visual restraint**

Prompt:

```text
Verbessere einen kurzen, linearen Wissensartikel mit drei Absätzen. Es gibt keine Architektur, keinen Prozess, keinen Vergleich und keine Zustandsänderung.
```

Expected: no Mermaid diagram and no Markdown table proposed merely for decoration.

- [ ] **Step 3: Refactor only for observed gaps and re-run affected scenarios**

If an agent invents a source, drops manual content, downloads decorative media, uses an unsupported source type, or adds decorative Mermaid/tables, update the smallest relevant instruction and re-run that exact scenario. Keep validator tests green after every edit.

### Task 8: Validate Against VibeDeck and Remove Gemini Skill

**Files:**
- Delete: `C:/Users/asi/Documents/GitHub/vibedeck/.gemini/skills/knowledge-curator/SKILL.md`
- Verify: `C:/Users/asi/Documents/GitHub/vibedeck/src/types/knowledge.ts`
- Verify: `C:/Users/asi/Documents/GitHub/vibedeck/src/content/knowledge/*.md`

- [ ] **Step 1: Validate a representative existing article without changing it**

Run:

```powershell
node C:/Users/asi/.codex/skills/knowledge-curator/scripts/validate-knowledge-article.mjs C:/Users/asi/Documents/GitHub/vibedeck/src/content/knowledge/agent-skills-deep-dive.md --project-root C:/Users/asi/Documents/GitHub/vibedeck
```

Expected: either PASS or a complete actionable list of pre-existing article issues. Pre-existing content issues do not authorize unrelated article edits.

- [ ] **Step 2: Run repository checks before deletion**

Run:

```powershell
npm test -- --run
npm run build
```

Expected: tests and static build pass. If the repository's test command differs, use the exact scripts declared in `package.json` and record the command used.

- [ ] **Step 3: Delete the Gemini skill only after all Codex checks pass**

Delete exactly:

```text
C:/Users/asi/Documents/GitHub/vibedeck/.gemini/skills/knowledge-curator/SKILL.md
```

Remove the now-empty `.gemini/skills/knowledge-curator/` directory. Do not delete other `.gemini` content.

- [ ] **Step 4: Verify final repository scope**

Run:

```powershell
git status --short
git diff --check
git diff -- .gemini/skills/knowledge-curator/SKILL.md
```

Expected: the Gemini file is deleted; no unintended repository files changed beyond the approved spec/plan and deletion.

- [ ] **Step 5: Commit the repository migration**

Run:

```powershell
git add -- .gemini/skills/knowledge-curator/SKILL.md docs/superpowers/plans/2026-07-11-knowledge-curator.md
git commit -m "chore: retire Gemini knowledge curator skill"
```

Expected: commit contains the implementation plan and Gemini skill deletion only. The globally installed Codex skill remains outside this repository and must be reported separately with its absolute path and validation results.

### Task 9: Final Verification

**Files:**
- Verify: `C:/Users/asi/.codex/skills/knowledge-curator/**`
- Verify: `C:/Users/asi/Documents/GitHub/vibedeck/.gemini/skills/knowledge-curator/` is absent.

- [ ] **Step 1: Run the complete verification set from a clean command context**

Run:

```powershell
node C:/Users/asi/.codex/skills/knowledge-curator/scripts/validate-knowledge-article.test.mjs
python C:/Users/asi/.codex/skills/.system/skill-creator/scripts/quick_validate.py C:/Users/asi/.codex/skills/knowledge-curator
Test-Path C:/Users/asi/Documents/GitHub/vibedeck/.gemini/skills/knowledge-curator
git -C C:/Users/asi/Documents/GitHub/vibedeck status --short
```

Expected: validator tests PASS; skill validation succeeds; `Test-Path` is `False`; repository status contains no unexplained changes.

- [ ] **Step 2: Report evidence, not an unsupported success claim**

Final handoff must include:

```text
- installed Codex skill path
- created/modified skill resources
- validator test count and result
- official skill validation result
- forward-test scenarios and any remaining limitations
- repository build/test result
- Gemini deletion confirmation
- repository commit hash
```
