import { pdf } from '@react-pdf/renderer';

import { KnowledgeArticlePdf } from '@/components/knowledge/KnowledgeArticlePdf';
import {
  createKnowledgePdfFilename,
  parseKnowledgePdfBlocks,
  prepareKnowledgePdfImages,
} from '@/lib/knowledge-pdf';
import type { KnowledgeArticle } from '@/types/knowledge';

export async function downloadKnowledgeArticlePdf(article: KnowledgeArticle): Promise<void> {
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
}
