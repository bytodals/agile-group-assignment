import { logger } from '../utils/logger.js';

const OL_BASE = 'https://openlibrary.org';

export interface OLAuthor {
  olKey: string;
  name: string;
}

export interface OLBook {
  olKey: string;
  title: string;
  authorOlKey?: string;
  authorName?: string;
  genre?: string;
  coverId?: number;
}

function pickGenre(subjects?: string[]): string {
  if (!subjects || subjects.length === 0) return 'Okänd';
  const lower = subjects.map((s) => s.toLowerCase());
  if (lower.some((s) => s.includes('child') || s.includes('juvenile'))) return 'Barn';
  if (lower.some((s) => s.includes('thriller') || s.includes('crime') || s.includes('mystery')))
    return 'Thriller';
  if (lower.some((s) => s.includes('fiction'))) return 'Skönlitteratur';
  if (lower.some((s) => s.includes('fantasy'))) return 'Fantasy';
  if (lower.some((s) => s.includes('horror'))) return 'Skräck';
  return subjects[0].slice(0, 50);
}

async function safeFetch<T>(
  url: string,
  options: { emptyOnStatus?: number[] } = {},
): Promise<T | null> {
  const res = await fetch(url);
  if (!res.ok) {
    if (options.emptyOnStatus?.includes(res.status)) {
      logger.warn('openLibrary', `GET ${url} → ${res.status} ${res.statusText}, returning empty`);
      return null;
    }
    const msg = `External API failed: GET ${url} → ${res.status} ${res.statusText}`;
    logger.warn('openLibrary', msg);
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

// Statuses that should yield an empty result set instead of bubbling as a 500,
// e.g. when the user's typed query is too short for OL's validator.
const EMPTY_RESULT_STATUSES = [400, 422];

export async function searchAuthors(query: string): Promise<OLAuthor[]> {
  const data = await safeFetch<{ docs: { key: string; name: string }[] }>(
    `${OL_BASE}/search/authors.json?q=${encodeURIComponent(query)}&limit=10`,
    { emptyOnStatus: EMPTY_RESULT_STATUSES },
  );
  return (data?.docs ?? []).map((d) => ({ olKey: d.key, name: d.name }));
}

export async function searchBooks(query: string): Promise<OLBook[]> {
  const data = await safeFetch<{
    docs: {
      key: string;
      title: string;
      author_key?: string[];
      author_name?: string[];
      subject?: string[];
      cover_i?: number;
    }[];
  }>(
    `${OL_BASE}/search.json?q=${encodeURIComponent(query)}&fields=key,title,author_key,author_name,subject,cover_i&limit=10&mode=everything`,
    { emptyOnStatus: EMPTY_RESULT_STATUSES },
  );
  return (data?.docs ?? []).map((d) => ({
    olKey: d.key.replace('/works/', ''),
    title: d.title,
    authorOlKey: d.author_key?.[0],
    authorName: d.author_name?.[0],
    genre: pickGenre(d.subject),
    coverId: d.cover_i,
  }));
}

export interface OLTrendingWork {
  olKey: string;
  title: string;
  authorName?: string;
  authorOlKey?: string;
  coverId?: number;
  genre?: string;
}

export async function fetchTrending(
  period: 'now' | 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly',
): Promise<OLTrendingWork[]> {
  const data = await safeFetch<{
    works: {
      key: string;
      title: string;
      author_name?: string[];
      author_key?: string[];
      cover_i?: number;
      subject?: string[];
    }[];
  }>(`${OL_BASE}/trending/${period}.json?limit=50`);
  return (data?.works ?? [])
    .filter((w) => w.cover_i && w.title)
    .map((w) => ({
      olKey: w.key.replace('/works/', ''),
      title: w.title,
      authorName: w.author_name?.[0],
      authorOlKey: w.author_key?.[0],
      coverId: w.cover_i,
      genre: pickGenre(w.subject),
    }));
}

export async function fetchWorkCoverId(olKey: string): Promise<number | undefined> {
  try {
    const data = await safeFetch<{ covers?: number[] }>(`${OL_BASE}/works/${olKey}.json`);
    const id = data?.covers?.find((c) => typeof c === 'number' && c > 0);
    return id;
  } catch {
    return undefined;
  }
}

export async function fetchWorkDescription(olKey: string): Promise<string | undefined> {
  try {
    const data = await safeFetch<{
      description?: string | { value: string };
    }>(`${OL_BASE}/works/${olKey}.json`);
    if (!data?.description) return undefined;
    const raw = typeof data.description === 'string' ? data.description : data.description.value;
    return raw
      .split('\n')[0]
      .replace(/\s*\(\[source\].*?\)\s*$/i, '')
      .trim();
  } catch {
    return undefined;
  }
}

export async function fetchAuthorWorks(authorOlKey: string): Promise<OLBook[]> {
  const data = await safeFetch<{
    entries: { key: string; title: string; subjects?: string[] }[];
  }>(`${OL_BASE}/authors/${authorOlKey}/works.json?limit=20`);
  return (data?.entries ?? []).map((e) => ({
    olKey: e.key.replace('/works/', ''),
    title: e.title,
    genre: pickGenre(e.subjects),
  }));
}
