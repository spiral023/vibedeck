import fs from 'fs';
import path from 'path';
import {
  parseArgs,
  parseTweetId,
  extractMedia,
  extractArticleMedia,
  extractTweetText,
  extractArticleText,
  isThreadStart,
  orderThreadChronologically,
  formatDump,
} from './lib/x-ingest.mjs';
import {
  createClient,
  fetchTweet,
  resolveThreadForward,
  resolveThreadBackward,
} from './lib/x-client.mjs';

const rootDir = process.cwd();
const ingestDir = path.join(rootDir, 'scripts/.ingest');

function usage() {
  console.log(
    'Usage: npm run ingest:x -- <tweet-url-oder-id> [--thread] [--force] [--max-thread <n>]',
  );
}

function loadEnv() {
  try {
    process.loadEnvFile(path.join(rootDir, '.env.local'));
  } catch {
    // .env.local optional — Variable kann extern gesetzt sein
  }
}

function findAuthor(includes, authorId) {
  const users = includes?.users ?? [];
  return users.find((u) => u.id === authorId) ?? users[0] ?? null;
}

function formatApiError(err) {
  const code = err?.code ?? err?.data?.status;
  if (code === 401) return '✖ 401 Unauthorized — Bearer Token ungültig oder abgelaufen.';
  if (code === 402) {
    const detail = err?.data?.detail ? ` (${err.data.detail})` : '';
    return `✖ 402 Payment Required — Guthaben der X-API aufgebraucht${detail}. Im X Developer Portal Credits aufladen und erneut versuchen.`;
  }
  if (code === 403) return '✖ 403 Forbidden — App fehlt die Berechtigung für diesen Endpoint/Tweet.';
  if (code === 404) return '✖ 404 — Tweet gelöscht, privat oder ID falsch.';
  if (code === 429) {
    const reset = err?.rateLimit?.reset
      ? ` Reset: ${new Date(err.rateLimit.reset * 1000).toLocaleTimeString()}`
      : '';
    return `✖ 429 Rate-Limit erreicht.${reset} Kein Auto-Retry (Pay-per-use).`;
  }
  if (typeof code === 'number' && code >= 500) {
    return `✖ ${code} — temporärer Serverfehler bei X. Kein Code-Problem; in ein paar Minuten erneut versuchen.`;
  }
  return `✖ API-Fehler: ${err?.message ?? String(err)}`;
}

async function resolveThread(client, tweet, author, maxThread) {
  if (isThreadStart(tweet)) {
    if (!author?.username) {
      console.warn('⚠ Thread-Start ohne auflösbaren Autor-Username — Thread wird nicht aufgelöst.');
      return { thread: null, method: null };
    }
    const fwd = await resolveThreadForward(client, tweet, author.username);
    if (fwd) return { thread: orderThreadChronologically(fwd.tweets), method: fwd.method };
    console.warn(
      '⚠ Thread über Search nicht auflösbar (>7 Tage & kein Full-Archive-Zugang). Für ältere Threads die URL des LETZTEN Tweets übergeben.',
    );
    return { thread: null, method: null };
  }
  const chain = await resolveThreadBackward(client, tweet, maxThread);
  const oldest = chain[chain.length - 1];
  const hasMoreParents = (oldest?.referenced_tweets ?? []).some((r) => r.type === 'replied_to');
  if (chain.length >= maxThread && hasMoreParents) {
    console.warn(`⚠ Rückwärts-Walk bei --max-thread=${maxThread} gekappt (weitere Vorgänger vorhanden).`);
  }
  return { thread: orderThreadChronologically(chain), method: 'backward-walk' };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.input) {
    usage();
    process.exit(1);
  }

  let id;
  try {
    id = parseTweetId(args.input);
  } catch (err) {
    console.error(`✖ ${err.message}`);
    process.exit(1);
  }

  fs.mkdirSync(ingestDir, { recursive: true });
  const jsonPath = path.join(ingestDir, `${id}.json`);
  const mdPath = path.join(ingestDir, `${id}.md`);

  let payload;
  if (fs.existsSync(jsonPath) && !args.force) {
    console.log(
      `● Cache-Treffer: ${path.relative(rootDir, jsonPath)} (kein API-Call). --force zum Neuladen.`,
    );
    payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } else {
    loadEnv();
    const token = process.env.X_BEARER_TOKEN;
    if (!token) {
      console.error(
        '✖ X_BEARER_TOKEN fehlt. Lege .env.local an mit:\n  X_BEARER_TOKEN=dein_bearer_token\n(Vorlage: .env.example)',
      );
      process.exit(1);
    }

    const client = createClient(token);
    let res;
    try {
      res = await fetchTweet(client, id);
    } catch (err) {
      console.error(formatApiError(err));
      process.exit(1);
    }
    if (!res?.data) {
      console.error('✖ Kein Tweet in der Antwort (gelöscht, privat oder ID falsch?).');
      process.exit(1);
    }

    const tweet = res.data;
    const author = findAuthor(res.includes, tweet.author_id);
    let thread = null;
    let threadMethod = null;
    if (args.thread) {
      ({ thread, method: threadMethod } = await resolveThread(client, tweet, author, args.maxThread));
    }

    payload = {
      fetchedAt: new Date().toISOString(),
      id,
      tweet,
      includes: res.includes ?? {},
      thread,
      threadMethod,
    };
    fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2), 'utf8');
  }

  const tweet = payload.tweet;
  const author = findAuthor(payload.includes, tweet.author_id);
  const media = extractMedia(payload.includes?.media);
  const articleMedia = extractArticleMedia(tweet, payload.includes?.media);
  const md = formatDump({ tweet, author, media, articleMedia, thread: payload.thread });
  fs.writeFileSync(mdPath, md, 'utf8');

  const articleText = extractArticleText(tweet);
  const contentLen = articleText ? articleText.length : extractTweetText(tweet).length;
  const contentNote = articleText ? ` Zeichen (Artikel)` : ` Zeichen`;
  const threadNote = payload.thread
    ? ` · Thread: ${payload.thread.length} Posts (${payload.threadMethod})`
    : '';
  console.log(`✔ Dump: ${path.relative(rootDir, mdPath)}`);
  console.log(
    `  Autor: ${author?.name ?? '?'} (@${author?.username ?? '?'}) · ${contentLen}${contentNote}${threadNote}`,
  );
}

main().catch((err) => {
  console.error(`✖ Unerwarteter Fehler: ${err?.message ?? err}`);
  process.exit(1);
});
