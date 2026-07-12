export function parseArgs(argv) {
  const args = { input: undefined, thread: false, force: false, maxThread: 50 };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--thread') args.thread = true;
    else if (a === '--force') args.force = true;
    else if (a === '--max-thread') {
      const n = Number.parseInt(argv[i + 1], 10);
      args.maxThread = Number.isFinite(n) && n > 0 ? n : 50;
      i += 1;
    } else if (!a.startsWith('--') && args.input === undefined) {
      args.input = a;
    }
  }
  return args;
}

export function parseTweetId(input) {
  const trimmed = (input ?? '').trim();
  if (/^\d+$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/(?:twitter\.com|x\.com)\/[^/]+\/status\/(\d+)/i);
  if (match) return match[1];
  throw new Error(
    `Konnte keine Tweet-ID aus "${input}" lesen. Erwartet: Tweet-URL oder numerische ID.`,
  );
}

export function extractTweetText(tweet) {
  return tweet?.note_tweet?.text ?? tweet?.text ?? '';
}

export function extractArticleText(tweet) {
  return tweet?.article?.plain_text ?? '';
}

export function extractLinks(tweet) {
  const entities = tweet?.note_tweet?.entities ?? tweet?.entities ?? {};
  const urls = Array.isArray(entities.urls) ? entities.urls : [];
  const seen = new Set();
  const links = [];
  for (const u of urls) {
    const expanded = u.expanded_url ?? u.url;
    if (!expanded || seen.has(expanded)) continue;
    seen.add(expanded);
    links.push({ url: expanded, display: u.display_url ?? expanded });
  }
  return links;
}

export function extractMedia(mediaList) {
  if (!Array.isArray(mediaList)) return [];
  return mediaList.map((m) => ({
    type: m.type ?? 'unknown',
    alt: m.alt_text ?? '',
    url: m.url ?? m.preview_image_url ?? '',
  }));
}

export function isThreadStart(tweet) {
  return Boolean(tweet?.id && tweet.id === tweet.conversation_id);
}

export function orderThreadChronologically(tweets) {
  return [...tweets].sort((a, b) => {
    const ta = a?.created_at ? Date.parse(a.created_at) : 0;
    const tb = b?.created_at ? Date.parse(b.created_at) : 0;
    return ta - tb;
  });
}

export function formatDump({ tweet, author, media, thread }) {
  const handle = author?.username ? `@${author.username}` : 'unbekannt';
  const name = author?.name ?? 'Unbekannt';
  const lines = [`# X-Ingest: ${name} (${handle})`, ''];
  lines.push(`- **Tweet-ID:** ${tweet.id}`);
  lines.push(`- **URL:** https://x.com/${author?.username ?? 'i'}/status/${tweet.id}`);
  if (tweet.created_at) lines.push(`- **Datum:** ${tweet.created_at}`);
  const m = tweet.public_metrics;
  if (m) {
    lines.push(
      `- **Metriken:** ${m.like_count ?? 0} Likes · ${m.retweet_count ?? 0} Retweets · ${m.reply_count ?? 0} Replies · ${m.impression_count ?? '?'} Views`,
    );
  }
  lines.push('');
  if (tweet.article) {
    const title = tweet.article.title ?? '(ohne Titel)';
    const articleText = extractArticleText(tweet);
    if (articleText) {
      lines.push(`## Artikel: ${title}`, '', articleText, '');
    } else {
      lines.push(
        `> ⚠️ Nativer X-Artikel „${title}" — Volltext nicht über die API verfügbar; bei Bedarf Sekundärquelle prüfen.`,
        '',
      );
    }
  }
  lines.push('## Text', '', extractTweetText(tweet), '');
  const links = extractLinks(tweet);
  if (links.length) {
    lines.push('## Links', '');
    for (const l of links) lines.push(`- [${l.display}](${l.url})`);
    lines.push('');
  }
  if (media.length) {
    lines.push('## Media', '');
    for (const md of media) {
      lines.push(`- **${md.type}**${md.alt ? `: ${md.alt}` : ''}${md.url ? ` (${md.url})` : ''}`);
    }
    lines.push('');
  }
  if (thread && thread.length) {
    lines.push('## Thread', '');
    thread.forEach((t, i) => {
      lines.push(`### ${i + 1}/${thread.length}`, '', extractTweetText(t), '');
    });
  }
  return lines.join('\n');
}
