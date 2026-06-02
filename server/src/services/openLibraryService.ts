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

async function safeFetch<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const msg = `External API failed: GET ${url} → ${res.status} ${res.statusText}`;
    logger.warn('openLibrary', msg);
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export async function searchAuthors(query: string): Promise<OLAuthor[]> {
  const data = await safeFetch<{ docs: { key: string; name: string }[] }>(
    `${OL_BASE}/search/authors.json?q=${encodeURIComponent(query)}&limit=10`,
  );
  return (data.docs ?? []).map((d) => ({ olKey: d.key, name: d.name }));
}

export async function searchBooks(query: string): Promise<OLBook[]> {
  const data = await safeFetch<{
    docs: {
      key: string;
      title: string;
      author_key?: string[];
      author_name?: string[];
      subject?: string[];
    }[];
  }>(
    `${OL_BASE}/search.json?q=${encodeURIComponent(query)}&fields=key,title,author_key,author_name,subject&limit=10`,
  );
  return (data.docs ?? []).map((d) => ({
    olKey: d.key.replace('/works/', ''),
    title: d.title,
    authorOlKey: d.author_key?.[0],
    authorName: d.author_name?.[0],
    genre: pickGenre(d.subject),
  }));
}

export async function fetchAuthorWorks(authorOlKey: string): Promise<OLBook[]> {
  const data = await safeFetch<{
    entries: { key: string; title: string; subjects?: string[] }[];
  }>(`${OL_BASE}/authors/${authorOlKey}/works.json?limit=20`);
  return (data.entries ?? []).map((e) => ({
    olKey: e.key.replace('/works/', ''),
    title: e.title,
    genre: pickGenre(e.subjects),
  }));
}
