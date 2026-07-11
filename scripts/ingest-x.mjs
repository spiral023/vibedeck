function usage() {
  console.log(
    'Usage: npm run ingest:x -- <tweet-url-oder-id> [--thread] [--force] [--max-thread <n>]',
  );
}

const input = process.argv.slice(2).find((a) => !a.startsWith('--'));
if (!input) {
  usage();
  process.exit(1);
}

console.log('not-yet-implemented');
