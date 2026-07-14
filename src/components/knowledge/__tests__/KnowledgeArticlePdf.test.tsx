import { pdf } from '@react-pdf/renderer';
import { describe, expect, it } from 'vitest';

import { KnowledgeArticlePdf } from '../KnowledgeArticlePdf';
import { parseKnowledgePdfBlocks } from '@/lib/knowledge-pdf';
import { partitionKnowledgePdfBlocks } from '@/lib/knowledge-pdf-pages';

describe('KnowledgeArticlePdf', () => {
  it('puts a wide table on a compact landscape page', () => {
    const groups = partitionKnowledgePdfBlocks(parseKnowledgePdfBlocks(`| A | B | C | D | E |
| --- | --- | --- | --- | --- |
| Ein langer Zellinhalt, der innerhalb der Tabellenzelle umbrochen werden muss und deshalb bewusst mehr als achtzig Zeichen enthält. | Zwei | Drei | Vier | Fünf |`));

    expect(groups).toEqual([
      {
        orientation: 'landscape',
        compact: true,
        blocks: [
          {
            type: 'table',
            headers: ['A', 'B', 'C', 'D', 'E'],
            rows: [['Ein langer Zellinhalt, der innerhalb der Tabellenzelle umbrochen werden muss und deshalb bewusst mehr als achtzig Zeichen enthält.', 'Zwei', 'Drei', 'Vier', 'Fünf']],
          },
        ],
      },
    ]);
  });

  it('renders a long article with links and PDF fallbacks into a blob', async () => {
    const longContent = Array.from(
      { length: 80 },
      (_, index) => `Absatz ${index + 1} mit einem [VibeDeck-Link](https://vibedeck.app).`,
    ).join('\n\n');

    const blob = await pdf(
      <KnowledgeArticlePdf
        article={{
          id: 'renderer-test',
          title: 'PDF-Renderer Test',
          description: 'Ein langer Artikel für den echten PDF-Renderpfad.',
          category: 'Tools',
          icon: 'BookOpen',
          readTime: 8,
          content: `${longContent}\n\n> **Fett formatiertes Zitat**\n\n![Nicht verfügbar](/fehlend.png)\n\n\`\`\`mermaid\ngraph TD\nA --> B\n\`\`\``,
        }}
        imageSources={new Map()}
      />,
    ).toBlob();

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('renders a wide table with wrapped cell content into a blob', async () => {
    const blob = await pdf(
      <KnowledgeArticlePdf
        article={{
          id: 'wide-table',
          title: 'Tabellentest',
          description: 'Tabellen im PDF',
          category: 'Tools',
          icon: 'BookOpen',
          readTime: 2,
          content: `| A | B | C | D | E |
| --- | --- | --- | --- | --- |
| Ein langer Zellinhalt, der innerhalb der Tabellenzelle umbrochen werden muss und deshalb bewusst mehr als achtzig Zeichen enthält. | Zwei | Drei | Vier | Fünf |`,
        }}
        imageSources={new Map()}
      />,
    ).toBlob();

    expect(blob.size).toBeGreaterThan(0);
  });
});
