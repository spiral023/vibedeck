import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { KnowledgeArticle } from '@/types/knowledge';

const { downloadKnowledgeArticlePdfMock, toastSuccessMock, toastErrorMock } = vi.hoisted(() => ({
  downloadKnowledgeArticlePdfMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
}));

vi.mock('@/lib/knowledge-pdf-download', () => ({
  downloadKnowledgeArticlePdf: downloadKnowledgeArticlePdfMock,
}));

vi.mock('sonner', () => ({
  toast: {
    success: toastSuccessMock,
    error: toastErrorMock,
  },
}));

import { ArticleView } from '../client';

const article: KnowledgeArticle = {
  id: 'test-artikel',
  title: 'Testartikel',
  description: 'Eine Testbeschreibung',
  category: 'Tools',
  icon: 'BookOpen',
  readTime: 1,
  content: 'Testinhalt',
};

describe('ArticleView PDF download action', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders PDF actions in both groups and shows the generating state until the PDF is ready', async () => {
    let resolveDownload: (() => void) | undefined;
    downloadKnowledgeArticlePdfMock.mockImplementationOnce(() => new Promise<void>((resolve) => {
      resolveDownload = resolve;
    }));

    render(<ArticleView article={article} />);

    const downloadButtons = screen.getAllByRole('button', { name: 'PDF herunterladen' });
    expect(downloadButtons).toHaveLength(2);

    fireEvent.click(downloadButtons[0]);

    expect(downloadKnowledgeArticlePdfMock).toHaveBeenCalledWith(article);
    expect(screen.getAllByRole('button', { name: 'PDF wird erstellt…' })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: 'PDF wird erstellt…' })[0]).toBeDisabled();

    resolveDownload?.();

    await waitFor(() => {
      expect(toastSuccessMock).toHaveBeenCalledWith('PDF heruntergeladen');
    });
    expect(screen.getAllByRole('button', { name: 'PDF herunterladen' })[0]).toBeEnabled();
    expect(toastErrorMock).not.toHaveBeenCalled();
  });
});
