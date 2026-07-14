# Wissensbasis-Artikel-PDF-Download Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Wissensbasis-Artikel als robustes, direkt herunterladbares A4-PDF bereitstellen.

**Architecture:** Die Detailseite bleibt eine Client Component und ruft eine PDF-Download-Funktion auf. Ein reiner Markdown-Parser erzeugt testbare PDF-Blöcke; ein separater React-PDF-Renderer erstellt das Dokument. Bilder werden vor dem Rendern als Data URLs geladen, sodass nicht abrufbare Bilder und dynamische Inhalte als Hinweis statt als defekte Grafik erscheinen.

**Tech Stack:** Next.js App Router, TypeScript, Vitest, @react-pdf/renderer, Lucide React, Sonner.

---

## Dateistruktur

- package.json und package-lock.json: Runtime-Abhängigkeit für die Browser-PDF-Erzeugung.
- src/lib/knowledge-pdf.ts: PDF-Blocktypen, Markdown-Parser, Inline-Parser, Dateiname, Bildvorbereitung.
- src/lib/knowledge-pdf-download.tsx: erzeugt Blob und startet den direkten Browser-Download.
- src/lib/__tests__/knowledge-pdf.test.ts: Tests für Parser, Dateiname und fehlende Bilder.
- src/lib/__tests__/knowledge-pdf-download.test.tsx: Test der Download-Auslösung mit gemocktem PDF-Renderer.
- src/components/knowledge/KnowledgeArticlePdf.tsx: A4-PDF-Dokument mit Metadaten und Blöcken.
- src/app/knowledge/[id]/client.tsx: Button, Lade- und Fehlerzustand.

### Task 1: Abhängigkeit, Markdown-Parser und Bild-Fallbacks

**Files:**

- Modify: package.json
- Modify: package-lock.json
- Create: src/lib/knowledge-pdf.ts
- Create: src/lib/__tests__/knowledge-pdf.test.ts

- [ ] **Step 1: Die PDF-Abhängigkeit installieren**

Run:

    npm install @react-pdf/renderer

Expected: Die Abhängigkeit steht unter dependencies und der Lockfile ist aktualisiert.

- [ ] **Step 2: Den fehlschlagenden Parser-Test schreiben**

Create src/lib/__tests__/knowledge-pdf.test.ts. Der Test importiert createKnowledgePdfFilename, parseKnowledgePdfBlocks, parseKnowledgePdfInline und prepareKnowledgePdfImages aus ../knowledge-pdf und enthält diese fünf Fälle:

    parseKnowledgePdfBlocks mit einer H2-Überschrift, Absatz mit **fett** und [Link](https://example.com), zwei Bullet-Listeneinträgen, ![Architektur](/images/architecture.png) und einem ts-Codeblock; erwartet werden die Blöcke heading, paragraph, unordered-list, image und code.

    parseKnowledgePdfBlocks mit einem mermaid-Codeblock, einer ## Verbindungen-Sektion und einer folgenden ## Fazit-Überschrift; erwartet werden dynamic-content-notice, heading(Fazit) und paragraph.

    parseKnowledgePdfInline('**fett** und `code` bei [VibeDeck](https://vibedeck.app)') erwartet fünf Tokens für fett, Zwischenraum, code, Zwischenraum und Link.

    createKnowledgePdfFilename('claude-code/überblick') erwartet 'claude-code-ueberblick.pdf'.

    prepareKnowledgePdfImages mit einem 200-Blob-Response für /ok.png und einem 404-Response für /missing.png erwartet eine Data URL nur für /ok.png.

- [ ] **Step 3: Testfehler bestätigen**

Run:

    npx vitest run src/lib/__tests__/knowledge-pdf.test.ts

Expected: FAIL because ../knowledge-pdf does not exist.

- [ ] **Step 4: Die minimale Datenlogik implementieren**

Create src/lib/knowledge-pdf.ts with these exact exported types:

    export type KnowledgePdfBlock =
      | { type: 'heading'; level: number; text: string }
      | { type: 'paragraph'; text: string }
      | { type: 'unordered-list'; items: string[] }
      | { type: 'ordered-list'; items: string[] }
      | { type: 'blockquote'; text: string }
      | { type: 'code'; language?: string; text: string }
      | { type: 'image'; alt: string; src: string }
      | { type: 'dynamic-content-notice' };

    export type KnowledgePdfInline = {
      text: string; bold?: boolean; italic?: boolean; code?: boolean; href?: string;
    };

    export function parseKnowledgePdfBlocks(content: string): KnowledgePdfBlock[];
    export function parseKnowledgePdfInline(value: string): KnowledgePdfInline[];
    export function createKnowledgePdfFilename(id: string): string;
    export async function prepareKnowledgePdfImages(
      blocks: KnowledgePdfBlock[],
    ): Promise<Map<string, string>>;

Call removeVerbindungenSection before a line-by-line parser. Recognize fenced code, headings, ordered and unordered list lines, quotes and standalone Markdown images. Group consecutive list or quote lines, flush paragraphs on blank lines, ignore horizontal rules, and emit dynamic-content-notice for a mermaid fence. Tokenize bold, italic, inline code and links. Create filenames using NFD normalization, removal of combining marks, replacement of non-alphanumeric runs by a dash, fallback wissensartikel and the .pdf suffix. Fetch each unique image only once; turn successful blobs into Data URLs via FileReader; ignore non-OK responses and fetch errors.

- [ ] **Step 5: Parser-Test bestehen lassen**

Run:

    npx vitest run src/lib/__tests__/knowledge-pdf.test.ts

Expected: PASS with 5 tests.

- [ ] **Step 6: Datenlogik committen**

Run:

    git add package.json package-lock.json src/lib/knowledge-pdf.ts src/lib/__tests__/knowledge-pdf.test.ts && git commit -m "feat: add knowledge PDF data utilities"

### Task 2: A4-Renderer und direkter Datei-Download

**Files:**

- Create: src/components/knowledge/KnowledgeArticlePdf.tsx
- Create: src/lib/knowledge-pdf-download.tsx
- Create: src/lib/__tests__/knowledge-pdf-download.test.tsx

- [ ] **Step 1: Den fehlschlagenden Download-Test schreiben**

Create src/lib/__tests__/knowledge-pdf-download.test.tsx. Mock pdf from @react-pdf/renderer so pdf returns an object whose toBlob resolves to a PDF Blob. Mock KnowledgeArticlePdf to a null component. Mock parseKnowledgePdfBlocks to [], prepareKnowledgePdfImages to a new Map, and createKnowledgePdfFilename to test-artikel.pdf. Stub URL.createObjectURL to return blob:pdf, URL.revokeObjectURL and HTMLAnchorElement.prototype.click.

Call downloadKnowledgeArticlePdf with this minimal article:

    {
      id: 'test-artikel', title: 'Test', description: 'Test', category: 'Tools',
      icon: 'BookOpen', readTime: 1, content: 'Inhalt',
    }

Assert toBlob, createObjectURL and anchor click each ran once and revokeObjectURL received blob:pdf.

- [ ] **Step 2: Testfehler bestätigen**

Run:

    npx vitest run src/lib/__tests__/knowledge-pdf-download.test.tsx

Expected: FAIL because ../knowledge-pdf-download does not exist.

- [ ] **Step 3: Das A4-PDF-Dokument implementieren**

Create src/components/knowledge/KnowledgeArticlePdf.tsx. Import Document, Page, Text, View, Image, Link and StyleSheet from @react-pdf/renderer. The component accepts article: KnowledgeArticle and imageSources: Map<string, string>, creates a Document with title article.title and author article.author ?? 'VibeDeck', and renders one A4 Page.

Use 48pt page padding, a 24pt bold title, 10pt body text, 8.5pt metadata and 12pt Courier code. Under the title render description, Lesezeit, optional source URL, author, source date and tags. Render parseKnowledgePdfBlocks(article.content) as headings, paragraphs, lists, blockquotes and code. Use nested Text and Link nodes with parseKnowledgePdfInline for inline formatting. List items receive a bullet or their 1-based ordinal. Mermaid notices render exactly: Dynamischer Inhalt ist im PDF nicht enthalten. Images render only if imageSources contains their source; otherwise render a muted Text value built with `Bild konnte nicht eingebettet werden: ${block.alt || 'ohne Beschreibung'}.`. Do not render category, icon, connections or SVG/Mermaid output.

- [ ] **Step 4: Die Download-Funktion implementieren**

Create src/lib/knowledge-pdf-download.tsx with this exact flow:

    const blocks = parseKnowledgePdfBlocks(article.content);
    const imageSources = await prepareKnowledgePdfImages(blocks);
    const blob = await pdf(
      <KnowledgeArticlePdf article={article} imageSources={imageSources} />,
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = createKnowledgePdfFilename(article.id);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

Export that flow as async function downloadKnowledgeArticlePdf(article: KnowledgeArticle): Promise<void>.

- [ ] **Step 5: Download-Test bestehen lassen**

Run:

    npx vitest run src/lib/__tests__/knowledge-pdf-download.test.tsx

Expected: PASS.

- [ ] **Step 6: Renderer und Download committen**

Run:

    git add src/components/knowledge/KnowledgeArticlePdf.tsx src/lib/knowledge-pdf-download.tsx src/lib/__tests__/knowledge-pdf-download.test.tsx && git commit -m "feat: render and download knowledge article PDFs"

### Task 3: Artikelaktion und Produktionsverifikation

**Files:**

- Modify: src/app/knowledge/[id]/client.tsx

- [ ] **Step 1: Download-Callback ergänzen**

Import Download from lucide-react and downloadKnowledgeArticlePdf from @/lib/knowledge-pdf-download. Add isGeneratingPdf state. Add handleDownloadPdf, which sets the state true, awaits downloadKnowledgeArticlePdf(article), shows toast.success('PDF heruntergeladen'), logs caught errors with console.error('PDF-Export fehlgeschlagen:', error), shows toast.error('PDF konnte nicht erstellt werden') and resets state in finally.

- [ ] **Step 2: In beide Aktionsgruppen denselben Download-Button einfügen**

Insert immediately before each Markdown-copy button:

    <button
      type="button"
      onClick={handleDownloadPdf}
      disabled={isGeneratingPdf}
      className="inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-60 focus-ring"
    >
      <Download className="h-4 w-4" />
      {isGeneratingPdf ? 'PDF wird erstellt…' : 'PDF herunterladen'}
    </button>

- [ ] **Step 3: Relevante Tests, Lint und Build ausführen**

Run:

    npx vitest run src/lib/__tests__/knowledge-pdf.test.ts src/lib/__tests__/knowledge-pdf-download.test.tsx
    npm run lint
    npm run build

Expected: All commands PASS and the static build generates out without a server endpoint.

- [ ] **Step 4: UI-Integration committen**

Run:

    git add "src/app/knowledge/[id]/client.tsx" && git commit -m "feat: add knowledge article PDF action"

## Plan-Selbstprüfung

- Spec coverage: Task 1 handles Markdown, names and unavailable images. Task 2 provides independent A4 layout, dynamic-content fallback and direct Blob download. Task 3 adds the action, loading/error feedback and verifies static-build compatibility.
- Placeholder scan: All implementation units, text strings, commands and commit scopes are specified.
- Type consistency: KnowledgePdfBlock, parseKnowledgePdfBlocks, prepareKnowledgePdfImages, KnowledgeArticlePdf and downloadKnowledgeArticlePdf retain the same signatures across tasks.
