import { describe, it, expect } from 'vitest';
import {
  parseArgs,
  parseTweetId,
  extractTweetText,
  extractArticleText,
  extractLinks,
  extractMedia,
  extractArticleMedia,
  isThreadStart,
  orderThreadChronologically,
  formatDump,
} from './x-ingest.mjs';

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

describe('extractTweetText', () => {
  it('bevorzugt note_tweet über text', () => {
    expect(extractTweetText({ text: 'kurz', note_tweet: { text: 'langer volltext' } })).toBe('langer volltext');
  });
  it('fällt auf text zurück', () => {
    expect(extractTweetText({ text: 'nur text' })).toBe('nur text');
  });
  it('gibt leeren String ohne Inhalt', () => {
    expect(extractTweetText({})).toBe('');
  });
});

describe('extractLinks', () => {
  it('nimmt expanded_url und dedupliziert', () => {
    const tweet = {
      entities: {
        urls: [
          { url: 'https://t.co/a', expanded_url: 'https://example.com', display_url: 'example.com' },
          { url: 'https://t.co/b', expanded_url: 'https://example.com', display_url: 'example.com' },
        ],
      },
    };
    expect(extractLinks(tweet)).toEqual([{ url: 'https://example.com', display: 'example.com' }]);
  });
  it('bevorzugt note_tweet.entities', () => {
    const tweet = {
      entities: { urls: [{ expanded_url: 'https://old.com' }] },
      note_tweet: { entities: { urls: [{ expanded_url: 'https://new.com', display_url: 'new.com' }] } },
    };
    expect(extractLinks(tweet)).toEqual([{ url: 'https://new.com', display: 'new.com' }]);
  });
  it('gibt leeres Array ohne urls', () => {
    expect(extractLinks({})).toEqual([]);
  });
});

describe('extractMedia', () => {
  it('mappt Typ, Alt-Text und URL', () => {
    const media = [{ type: 'photo', alt_text: 'ein Bild', url: 'https://img/1.jpg' }];
    expect(extractMedia(media)).toEqual([{ type: 'photo', alt: 'ein Bild', url: 'https://img/1.jpg' }]);
  });
  it('nutzt preview_image_url wenn url fehlt', () => {
    expect(extractMedia([{ type: 'video', preview_image_url: 'https://img/p.jpg' }])).toEqual([
      { type: 'video', alt: '', url: 'https://img/p.jpg' },
    ]);
  });
  it('gibt leeres Array für Nicht-Array', () => {
    expect(extractMedia(undefined)).toEqual([]);
  });
});

describe('extractArticleMedia', () => {
  const includes = [
    { media_key: '3_cover', type: 'photo', url: 'https://img/cover.jpg', alt_text: 'Titelbild' },
    { media_key: '3_a', type: 'photo', url: 'https://img/a.jpg', alt_text: 'Bild A' },
    { media_key: '3_b', type: 'video', preview_image_url: 'https://img/b.jpg' },
  ];
  it('löst cover_media und media_entities gegen includes.media auf', () => {
    const tweet = {
      article: { cover_media: '3_cover', media_entities: ['3_a', '3_b'] },
    };
    expect(extractArticleMedia(tweet, includes)).toEqual([
      { type: 'photo', alt: 'Titelbild', url: 'https://img/cover.jpg', cover: true },
      { type: 'photo', alt: 'Bild A', url: 'https://img/a.jpg', cover: false },
      { type: 'video', alt: '', url: 'https://img/b.jpg', cover: false },
    ]);
  });
  it('akzeptiert media_entities als Objekte mit media_key', () => {
    const tweet = { article: { media_entities: [{ media_key: '3_a' }] } };
    expect(extractArticleMedia(tweet, includes)).toEqual([
      { type: 'photo', alt: 'Bild A', url: 'https://img/a.jpg', cover: false },
    ]);
  });
  it('dedupliziert wiederkehrende Keys', () => {
    const tweet = { article: { cover_media: '3_a', media_entities: ['3_a'] } };
    expect(extractArticleMedia(tweet, includes)).toEqual([
      { type: 'photo', alt: 'Bild A', url: 'https://img/a.jpg', cover: true },
    ]);
  });
  it('gibt leeres Array ohne Artikel', () => {
    expect(extractArticleMedia({}, includes)).toEqual([]);
  });
  it('behält den Key als Fallback, wenn er in includes fehlt', () => {
    const tweet = { article: { media_entities: ['3_missing'] } };
    expect(extractArticleMedia(tweet, includes)).toEqual([
      { type: 'unknown', alt: '', url: '', cover: false, key: '3_missing' },
    ]);
  });
});

describe('isThreadStart', () => {
  it('true wenn id === conversation_id', () => {
    expect(isThreadStart({ id: '5', conversation_id: '5' })).toBe(true);
  });
  it('false wenn abweichend', () => {
    expect(isThreadStart({ id: '6', conversation_id: '5' })).toBe(false);
  });
});

describe('orderThreadChronologically', () => {
  it('sortiert aufsteigend nach created_at', () => {
    const out = orderThreadChronologically([
      { id: 'b', created_at: '2026-01-02T00:00:00Z' },
      { id: 'a', created_at: '2026-01-01T00:00:00Z' },
    ]);
    expect(out.map((t) => t.id)).toEqual(['a', 'b']);
  });
});

describe('formatDump', () => {
  it('enthält Autor, ID und Text', () => {
    const md = formatDump({
      tweet: { id: '20', text: 'hallo welt', created_at: '2026-07-03T00:00:00Z' },
      author: { name: 'Thariq', username: 'trq212' },
      media: [],
      thread: null,
    });
    expect(md).toContain('Thariq');
    expect(md).toContain('@trq212');
    expect(md).toContain('20');
    expect(md).toContain('hallo welt');
  });
  it('rendert Thread-Posts nummeriert', () => {
    const md = formatDump({
      tweet: { id: '1', text: 'erster' },
      author: { name: 'A', username: 'a' },
      media: [],
      thread: [{ id: '1', text: 'erster' }, { id: '2', text: 'zweiter' }],
    });
    expect(md).toContain('## Thread');
    expect(md).toContain('1/2');
    expect(md).toContain('zweiter');
  });
  it('rendert den Artikel-Volltext statt der Warnung, wenn plain_text vorhanden ist', () => {
    const md = formatDump({
      tweet: {
        id: '5',
        text: 'https://t.co/x',
        article: { title: 'Mein Artikel', plain_text: 'Das ist der komplette Artikeltext.' },
      },
      author: { name: 'A', username: 'a' },
      media: [],
      thread: null,
    });
    expect(md).toContain('## Artikel: Mein Artikel');
    expect(md).toContain('Das ist der komplette Artikeltext.');
    expect(md).not.toContain('nicht über die API verfügbar');
  });
  it('rendert eine Artikel-Media-Sektion mit Cover-Markierung und Bild-Markdown', () => {
    const md = formatDump({
      tweet: { id: '7', text: 'x', article: { title: 'Mit Bildern', plain_text: 'Text.' } },
      author: { name: 'A', username: 'a' },
      media: [],
      articleMedia: [
        { type: 'photo', alt: 'Titelbild', url: 'https://img/cover.jpg', cover: true },
        { type: 'photo', alt: '', url: 'https://img/a.jpg', cover: false },
      ],
      thread: null,
    });
    expect(md).toContain('## Artikel-Media');
    expect(md).toContain('Cover');
    expect(md).toContain('![Titelbild](https://img/cover.jpg)');
    expect(md).toContain('![](https://img/a.jpg)');
  });
  it('warnt, wenn ein Artikel ohne plain_text vorliegt', () => {
    const md = formatDump({
      tweet: { id: '6', text: 'https://t.co/y', article: { title: 'Nur Titel' } },
      author: { name: 'A', username: 'a' },
      media: [],
      thread: null,
    });
    expect(md).toContain('nicht über die API verfügbar');
    expect(md).toContain('Nur Titel');
    expect(md).not.toContain('## Artikel:');
  });
});

describe('extractArticleText', () => {
  it('gibt article.plain_text zurück', () => {
    expect(extractArticleText({ article: { plain_text: 'Volltext' } })).toBe('Volltext');
  });
  it('gibt leeren String ohne Artikel oder plain_text', () => {
    expect(extractArticleText({})).toBe('');
    expect(extractArticleText({ article: { title: 'x' } })).toBe('');
  });
});
