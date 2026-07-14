import { pdf } from '@react-pdf/renderer';
import { describe, expect, it } from 'vitest';

import { KnowledgeArticlePdf } from '../KnowledgeArticlePdf';

describe('KnowledgeArticlePdf', () => {
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
});
