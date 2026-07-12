import { TwitterApi } from 'twitter-api-v2';

export const TWEET_FIELDS = [
  'note_tweet',
  'article',
  'created_at',
  'public_metrics',
  'entities',
  'author_id',
  'conversation_id',
  'referenced_tweets',
  'attachments',
];
export const EXPANSIONS = [
  'author_id',
  'referenced_tweets.id',
  'attachments.media_keys',
  // Native X-Artikel hängen ihre Bilder nicht am Tweet, sondern am Artikel.
  'article.cover_media',
  'article.media_entities',
];
export const USER_FIELDS = ['name', 'username', 'verified'];
export const MEDIA_FIELDS = ['type', 'alt_text', 'url', 'preview_image_url'];

function queryOptions() {
  return {
    'tweet.fields': TWEET_FIELDS,
    expansions: EXPANSIONS,
    'user.fields': USER_FIELDS,
    'media.fields': MEDIA_FIELDS,
  };
}

export function createClient(bearerToken) {
  return new TwitterApi(bearerToken);
}

export async function fetchTweet(client, id) {
  return client.v2.singleTweet(id, queryOptions());
}

// Fall A: URL zeigt auf Thread-Start. Kanonisch conversation_id-Search (recent),
// Fallback Full-Archive. Je Weg nur die erste Seite (<=100) → kostenkontrolliert.
export async function resolveThreadForward(client, tweet, username) {
  const query = `conversation_id:${tweet.conversation_id} from:${username}`;
  const options = { ...queryOptions(), max_results: 100 };

  try {
    const recent = await client.v2.search(query, options);
    if (recent.tweets?.length) {
      return { tweets: recent.tweets, includes: recent.includes, method: 'recent-search' };
    }
  } catch {
    // Recent Search nicht verfügbar → Full-Archive versuchen
  }

  try {
    const all = await client.v2.searchAll(query, options);
    if (all.tweets?.length) {
      return { tweets: all.tweets, includes: all.includes, method: 'full-archive-search' };
    }
  } catch {
    // Kein Full-Archive-Zugang
  }

  return null;
}

// Hinweis: Das zurückgegebene `includes` aus search()/searchAll() ist eine
// TwitterV2IncludesHelper-Instanz (keine reine Struktur wie bei singleTweet).
// Der Aufrufer nutzt nur `tweets`/`method` — `includes` NICHT in die JSON-
// Payload schreiben, sonst geht die Form beim Serialisieren verloren.

// Fall B: URL zeigt auf späteren Tweet. Rückwärts der replied_to-Kette folgen,
// ein Request pro Tweet, gedeckelt auf maxTweets.
export async function resolveThreadBackward(client, tweet, maxTweets) {
  const chain = [tweet];
  let current = tweet;
  while (chain.length < maxTweets) {
    const replied = (current.referenced_tweets ?? []).find((r) => r.type === 'replied_to');
    if (!replied) break;
    const res = await fetchTweet(client, replied.id);
    if (!res?.data) break;
    chain.push(res.data);
    current = res.data;
  }
  return chain;
}
