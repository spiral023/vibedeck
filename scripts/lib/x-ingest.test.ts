import { describe, it, expect } from 'vitest';
import { parseArgs, parseTweetId } from './x-ingest.mjs';

describe('parseTweetId', () => {
  it('extrahiert die ID aus einer x.com-URL', () => {
    expect(parseTweetId('https://x.com/trq212/status/2073100352921215386')).toBe('2073100352921215386');
  });
  it('extrahiert die ID aus einer twitter.com-URL', () => {
    expect(parseTweetId('https://twitter.com/user/status/123')).toBe('123');
  });
  it('ignoriert Query-Parameter', () => {
    expect(parseTweetId('https://x.com/user/status/456?s=20&t=abc')).toBe('456');
  });
  it('akzeptiert eine nackte numerische ID', () => {
    expect(parseTweetId('789')).toBe('789');
  });
  it('wirft bei ungültiger Eingabe', () => {
    expect(() => parseTweetId('https://x.com/user')).toThrow();
    expect(() => parseTweetId('')).toThrow();
  });
});

describe('parseArgs', () => {
  it('liest positionalen Input', () => {
    expect(parseArgs(['https://x.com/u/status/1']).input).toBe('https://x.com/u/status/1');
  });
  it('erkennt Flags und Default maxThread', () => {
    const a = parseArgs(['1', '--thread', '--force']);
    expect(a.thread).toBe(true);
    expect(a.force).toBe(true);
    expect(a.maxThread).toBe(50);
  });
  it('liest --max-thread mit Wert', () => {
    expect(parseArgs(['1', '--max-thread', '10']).maxThread).toBe(10);
  });
});
