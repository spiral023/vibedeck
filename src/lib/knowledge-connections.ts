const WIKILINK_PATTERN = /\[\[([^[\]]+)\]\]/g;
const VERBINDUNGEN_HEADING_PATTERN = /^##\s+Verbindungen\b/i;
const NEXT_HEADING_PATTERN = /^##\s+/;

function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function extractWikiLinkTarget(value: string): string {
  const beforePipe = value.split('|')[0] ?? '';
  const beforeHash = beforePipe.split('#')[0] ?? '';
  return normalizeWhitespace(beforeHash);
}

function dedupeConnections(values: string[]): string[] {
  const seen = new Set<string>();
  const deduped: string[] = [];

  for (const value of values) {
    const normalized = normalizeConnectionLabel(value);
    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    deduped.push(value);
  }

  return deduped;
}

function parseConnectionFragments(value: string): string[] {
  const trimmed = normalizeWhitespace(value);
  if (!trimmed) {
    return [];
  }

  const matches: string[] = [];
  for (const match of trimmed.matchAll(WIKILINK_PATTERN)) {
    const target = extractWikiLinkTarget(match[1] ?? '');
    if (target) {
      matches.push(target);
    }
  }

  if (matches.length > 0) {
    return matches;
  }

  return [trimmed];
}

export function normalizeConnectionLabel(value: string): string {
  return normalizeWhitespace(value).toLowerCase();
}

export function extractConnectionsFromVerbindungenSection(content: string): string[] {
  if (!content) {
    return [];
  }

  const lines = content.split(/\r?\n/);
  const headingIndex = lines.findIndex((line) => VERBINDUNGEN_HEADING_PATTERN.test(line.trim()));
  if (headingIndex < 0) {
    return [];
  }

  const sectionLines: string[] = [];
  for (let index = headingIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (NEXT_HEADING_PATTERN.test(line.trim())) {
      break;
    }
    sectionLines.push(line);
  }

  const connections = sectionLines.flatMap((line) => parseConnectionFragments(line));
  return dedupeConnections(connections);
}

export function removeVerbindungenSection(content: string): string {
  if (!content) {
    return content;
  }

  const lines = content.split(/\r?\n/);
  const headingIndex = lines.findIndex((line) => VERBINDUNGEN_HEADING_PATTERN.test(line.trim()));
  if (headingIndex < 0) {
    return content;
  }

  let endIndex = lines.length;
  for (let index = headingIndex + 1; index < lines.length; index += 1) {
    if (NEXT_HEADING_PATTERN.test(lines[index].trim())) {
      endIndex = index;
      break;
    }
  }

  const remaining = [...lines.slice(0, headingIndex), ...lines.slice(endIndex)];
  return remaining.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd();
}

export function extractKnowledgeConnections(input: { content: string; topics?: string[] }): string[] {
  const fromSection = extractConnectionsFromVerbindungenSection(input.content);
  const fromTopics = (input.topics ?? []).flatMap((topic) => parseConnectionFragments(topic));
  return dedupeConnections([...fromSection, ...fromTopics]);
}

export function articleHasConnection(connections: string[] | undefined, value: string): boolean {
  const normalizedNeedle = normalizeConnectionLabel(value);
  if (!normalizedNeedle) {
    return false;
  }

  return (connections ?? []).some((connection) => normalizeConnectionLabel(connection) === normalizedNeedle);
}
