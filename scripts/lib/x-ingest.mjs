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
