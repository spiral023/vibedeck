import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { CommandPalette, useCommandPalette } from '@/components/CommandPalette';

function PaletteHarness() {
  const { open, setOpen } = useCommandPalette();
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div data-testid="palette-state">{open ? 'open' : 'closed'}</div>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </QueryClientProvider>
  );
}

describe('command palette shortcuts', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('opens on Ctrl+K', () => {
    render(<PaletteHarness />);

    act(() => {
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    });

    expect(screen.getByTestId('palette-state')).toHaveTextContent('open');
  });

  it('does not toggle closed on repeated Ctrl+K', () => {
    render(<PaletteHarness />);

    act(() => {
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    });

    expect(screen.getByTestId('palette-state')).toHaveTextContent('open');
  });

  it('closes on Escape', () => {
    render(<PaletteHarness />);

    act(() => {
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    });
    expect(screen.getByTestId('palette-state')).toHaveTextContent('open');

    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    expect(screen.getByTestId('palette-state')).toHaveTextContent('closed');
  });

  it('hides soon-locked pages in navigation results', () => {
    render(<PaletteHarness />);

    act(() => {
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    });

    expect(screen.getByTestId('palette-state')).toHaveTextContent('open');
    expect(screen.queryByText('Prompt Builder')).not.toBeInTheDocument();
    expect(screen.queryByText('Prompt Factory')).not.toBeInTheDocument();
    expect(screen.getByText('Help Bibliothek')).toBeInTheDocument();
  });
});
