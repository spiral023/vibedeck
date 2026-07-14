import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { pdfMock, toBlobMock } = vi.hoisted(() => {
  const toBlobMock = vi.fn();
  const pdfMock = vi.fn(() => ({ toBlob: toBlobMock }));

  return { pdfMock, toBlobMock };
});

vi.mock('@react-pdf/renderer', () => ({
  pdf: pdfMock,
}));

vi.mock('@/components/knowledge/KnowledgeArticlePdf', () => ({
  KnowledgeArticlePdf: () => null,
}));

vi.mock('../knowledge-pdf', () => ({
  parseKnowledgePdfBlocks: vi.fn(() => []),
  prepareKnowledgePdfImages: vi.fn(async () => new Map()),
  createKnowledgePdfFilename: vi.fn(() => 'test-artikel.pdf'),
}));

import { downloadKnowledgeArticlePdf } from '../knowledge-pdf-download';

describe('downloadKnowledgeArticlePdf', () => {
  const createObjectURL = vi.fn(() => 'blob:pdf');
  const revokeObjectURL = vi.fn();
  const click = vi.fn();

  beforeEach(() => {
    toBlobMock.mockResolvedValue(new Blob(['PDF'], { type: 'application/pdf' }));
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(click);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('creates a blob URL, clicks the download link, and revokes it', async () => {
    await downloadKnowledgeArticlePdf({
      id: 'test-artikel',
      title: 'Test',
      description: 'Test',
      category: 'Tools',
      icon: 'BookOpen',
      readTime: 1,
      content: 'Inhalt',
    });

    expect(toBlobMock).toHaveBeenCalledOnce();
    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:pdf');
  });
});
