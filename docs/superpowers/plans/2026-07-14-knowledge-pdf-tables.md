# Wissensbasis-PDF-Tabellen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** GFM-Tabellen aus Wissensbasis-Artikeln als lesbare, umbruchfähige Tabellen im direkten PDF-Download rendern.

**Architecture:** Der bestehende PDF-Parser liefert einen neuen table-Block mit Kopfzeilen und normalisierten Datenzeilen. Der React-PDF-Renderer zeichnet den Block mit flexbasierten Zellen. Breite Tabellen erhalten eine eigene A4-Querformat-Seite, die übrigen stehen im normalen Artikelfluss.

**Tech Stack:** TypeScript, Vitest, React, @react-pdf/renderer.

---

## Dateistruktur

- src/lib/knowledge-pdf.ts: PDF-Blocktyp und GFM-Tabellenparser.
- src/lib/__tests__/knowledge-pdf.test.ts: Parser- und Fallbacktests.
- src/components/knowledge/KnowledgeArticlePdf.tsx: Tabellenlayout und Querformat-Paginierung.
- src/components/knowledge/__tests__/KnowledgeArticlePdf.test.tsx: Seitenaufteilung und echter PDF-Renderfall für breite Tabellen.

### Task 1: GFM-Tabellen in den PDF-Blockbaum parsen

**Files:**

- Modify: src/lib/knowledge-pdf.ts
- Modify: src/lib/__tests__/knowledge-pdf.test.ts

- [ ] **Step 1: Fehlende Tabellenunterstützung testen**

Append three tests:

    parseKnowledgePdfBlocks with headers Fehlanwendung, Warum sie schadet, Bessere Vorgehensweise; a separator row with three cells; and two data rows. Expect one table block with those headers and two string-array rows.

    parseKnowledgePdfBlocks with A | B | C, a three-column separator and a short row eins | zwei. Expect one table block with row ['eins', 'zwei', ''].

    parseKnowledgePdfBlocks with A | B, next line not a separator, then eins | zwei. Expect one paragraph containing the three source lines joined by spaces.

- [ ] **Step 2: Red-Test ausführen**

Run:

    npx vitest run src/lib/__tests__/knowledge-pdf.test.ts

Expected: FAIL because KnowledgePdfBlock has no table variant.

- [ ] **Step 3: Parser implementieren**

Add this KnowledgePdfBlock variant:

    | { type: 'table'; headers: string[]; rows: string[][] }

Add TABLE_SEPARATOR_CELL_PATTERN with the exact pattern /^:?-{3,}:?$/.

Add splitTableRow(line): trim the line, split by pipe, trim every cell, then remove the first or last cell only when the original trimmed line begins or ends with a pipe.

Add isTableSeparator(cells, columnCount): require exactly columnCount cells and require every cell to match TABLE_SEPARATOR_CELL_PATTERN.

Change parseKnowledgePdfBlocks from a for-of loop to an index loop. Before normal paragraph handling, inspect the current line and the next line. Emit a table only when: the header has a pipe and at least one non-empty cell; the next line is a same-width separator; and at least one following line has a pipe. Collect following consecutive pipe rows. For every data row, pad missing cells with empty strings and discard excess cells. Flush accumulated text before the table, then advance past every consumed row. Leave malformed table-looking lines in the normal paragraph path.

- [ ] **Step 4: Green-Test ausführen**

Run:

    npx vitest run src/lib/__tests__/knowledge-pdf.test.ts

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

    git add src/lib/knowledge-pdf.ts src/lib/__tests__/knowledge-pdf.test.ts && git commit -m "feat: parse tables for knowledge PDFs"

### Task 2: Tabellen im React-PDF-Dokument rendern

**Files:**

- Modify: src/components/knowledge/KnowledgeArticlePdf.tsx
- Modify: src/components/knowledge/__tests__/KnowledgeArticlePdf.test.tsx

- [ ] **Step 1: Fehlenden echten Renderfall schreiben**

Export KnowledgePdfPageGroup and partitionKnowledgePdfBlocks from KnowledgeArticlePdf.tsx. Add a unit test that passes a five-column table whose first cell contains more than 80 characters to partitionKnowledgePdfBlocks. Assert exactly one page group with orientation landscape, compact true and the table block in its blocks array.

Also add a real renderer test that creates a KnowledgeArticlePdf for that table. Generate a blob through pdf(...).toBlob() and assert blob.size is greater than zero.

- [ ] **Step 2: Red-Test ausführen**

Run:

    npx vitest run src/components/knowledge/__tests__/KnowledgeArticlePdf.test.tsx

Expected: FAIL because partitionKnowledgePdfBlocks and the table block do not yet exist.

- [ ] **Step 3: Tabellen-Renderer implementieren**

Add PdfTable, accepting a table block and compact boolean. Its header is a flex row with a light-grey background, 6pt padding and fontWeight 700. Each data row is a flex row with a thin #d1d5db top border. Each cell has flexGrow 1, flexBasis 0, borderRightWidth 0.5, padding 5 and an equal percent width based on header count. Use InlineContent for header and data text so links and emphasis still work. Use 7.5pt text and 3pt padding when compact is true.

Add isWideTable. It returns true only when a table has more than four columns or at least one cell longer than 80 characters.

Export type KnowledgePdfPageGroup with blocks: KnowledgePdfBlock[], orientation: portrait | landscape and compact: boolean. Export partitionKnowledgePdfBlocks(blocks). When a wide table appears, flush the active portrait group and create a landscape group containing only that table with compact true. All other blocks remain portrait with compact false. Render one Page per returned group. The first portrait page retains full article metadata. Later pages contain a small article-title continuation header. Add a table switch case to the existing block renderer.

- [ ] **Step 4: Realen Renderer-Test bestehen lassen**

Run:

    npx vitest run src/components/knowledge/__tests__/KnowledgeArticlePdf.test.tsx

Expected: PASS, including the bold italic quote regression and the new wide-table PDF test.

- [ ] **Step 5: Vollständig verifizieren**

Run:

    npx vitest run src/lib/__tests__/knowledge-pdf.test.ts src/components/knowledge/__tests__/KnowledgeArticlePdf.test.tsx
    npm test -- --run --reporter=dot
    npm run build

Expected: all commands exit 0.

- [ ] **Step 6: Commit**

Run:

    git add src/components/knowledge/KnowledgeArticlePdf.tsx src/components/knowledge/__tests__/KnowledgeArticlePdf.test.tsx && git commit -m "feat: render tables in knowledge PDFs"

## Plan-Selbstprüfung

- Task 1 covers valid GFM parsing, optional outer pipes, row normalization and invalid-table fallback.
- Task 2 covers header styling, cell wrapping, equal widths, a unit-tested landscape decision for wide tables, real PDF rendering and static-build verification.
- The table block uses the same headers and rows shape in parser, PdfTable and isWideTable.
