import {
  createKnowledgePdfFilename,
  parseKnowledgePdfBlocks,
  prepareKnowledgePdfImages,
} from '@/lib/knowledge-pdf';
import type { KnowledgeArticle } from '@/types/knowledge';

export async function downloadKnowledgeArticlePdf(article: KnowledgeArticle): Promise<void> {
  const blocks = parseKnowledgePdfBlocks(article.content);
  const [imageSources, { pdf }, { KnowledgeArticlePdf }] = await Promise.all([
    prepareKnowledgePdfImages(blocks),
    import('@react-pdf/renderer'),
    import('@/components/knowledge/KnowledgeArticlePdf'),
  ]);
  const blob = await pdf(
    <KnowledgeArticlePdf article={article} imageSources={imageSources} />,
  ).toBlob();
  const url = URL.createObjectURL(blob);
  let link: HTMLAnchorElement | undefined;

  try {
    link = document.createElement('a');
    link.href = url;
    link.download = createKnowledgePdfFilename(article.id);
    document.body.appendChild(link);
    link.click();
  } finally {
    try {
      link?.remove();
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}
