import type { KnowledgePdfBlock } from './knowledge-pdf';

export type KnowledgePdfPageGroup = {
  blocks: KnowledgePdfBlock[];
  orientation: 'portrait' | 'landscape';
  compact: boolean;
};

function isWideTable(block: KnowledgePdfBlock): boolean {
  return block.type === 'table'
    && (block.headers.length > 4 || block.rows.some((row) => row.some((cell) => cell.length > 80)));
}

export function partitionKnowledgePdfBlocks(blocks: KnowledgePdfBlock[]): KnowledgePdfPageGroup[] {
  const groups: KnowledgePdfPageGroup[] = [];
  let portraitBlocks: KnowledgePdfBlock[] = [];

  const flushPortraitBlocks = () => {
    if (portraitBlocks.length > 0) {
      groups.push({ blocks: portraitBlocks, orientation: 'portrait', compact: false });
      portraitBlocks = [];
    }
  };

  for (const block of blocks) {
    if (isWideTable(block)) {
      flushPortraitBlocks();
      groups.push({ blocks: [block], orientation: 'landscape', compact: true });
      continue;
    }

    portraitBlocks.push(block);
  }

  flushPortraitBlocks();
  return groups.length > 0 ? groups : [{ blocks: [], orientation: 'portrait', compact: false }];
}
