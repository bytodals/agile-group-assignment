import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Book from '../models/Book.js';
import '../models/Author.js';
import { fetchWorkCoverId, searchBooks } from '../services/openLibraryService.js';

dotenv.config({ quiet: true });

const THROTTLE_MS = 3000;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function normalize(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
}

function tokenize(s: string): Set<string> {
  return new Set(
    normalize(s)
      .split(/[^\p{L}\p{N}]+/u)
      .filter((t) => t.length >= 3),
  );
}

function authorMatches(dbAuthor: string, olAuthor?: string): boolean {
  if (!olAuthor) return false;
  const a = tokenize(dbAuthor);
  const b = tokenize(olAuthor);
  for (const t of a) if (b.has(t)) return true;
  return false;
}

async function findCoverByOlKey(olKey: string): Promise<{ coverId: number } | null> {
  const coverId = await fetchWorkCoverId(olKey);
  return typeof coverId === 'number' ? { coverId } : null;
}

async function findCoverBySearch(
  title: string,
  authorName: string | undefined,
): Promise<{ coverId: number; olKey: string } | null> {
  if (!authorName) return null;
  const query = `${title} ${authorName}`.trim();
  const results = await searchBooks(query);
  const hit = results.find(
    (r) => typeof r.coverId === 'number' && authorMatches(authorName, r.authorName),
  );
  if (!hit || typeof hit.coverId !== 'number') return null;
  return { coverId: hit.coverId, olKey: hit.olKey };
}

async function main(): Promise<void> {
  await connectDB();

  const candidates = await Book.find({
    $or: [{ coverId: { $exists: false } }, { coverId: null }],
  })
    .populate<{ author: { name: string } }>('author', 'name')
    .select('_id title olKey author')
    .lean();

  if (candidates.length === 0) {
    console.log('[backfill] No books missing a coverId — nothing to do.');
    await mongoose.disconnect();
    return;
  }

  console.log(`[backfill] Found ${candidates.length} book(s) without coverId. Starting…\n`);

  let updated = 0;
  let missing = 0;
  let failed = 0;

  for (let i = 0; i < candidates.length; i++) {
    const book = candidates[i];
    const tag = `[${i + 1}/${candidates.length}]`;
    const authorName = book.author?.name;

    try {
      let found: { coverId: number; olKey?: string } | null = null;
      let viaSearch = false;

      if (book.olKey) {
        found = await findCoverByOlKey(book.olKey);
      }

      if (!found) {
        if (book.olKey) await delay(THROTTLE_MS);
        found = await findCoverBySearch(book.title, authorName);
        viaSearch = Boolean(found);
      }

      if (found) {
        const update: Record<string, unknown> = { coverId: found.coverId };
        if (viaSearch && found.olKey && !book.olKey) {
          update.olKey = found.olKey;
        }
        await Book.updateOne({ _id: book._id }, update);
        const via = viaSearch ? ` (via search → ${found.olKey})` : '';
        console.log(`${tag} ${book.title} → cover ${found.coverId}${via}`);
        updated++;
      } else {
        console.log(`${tag} ${book.title} — no match on OL`);
        missing++;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.log(`${tag} ${book.title} → error: ${message}`);
      failed++;
    }

    if (i < candidates.length - 1) {
      await delay(THROTTLE_MS);
    }
  }

  console.log(
    `\n[backfill] Done. Updated ${updated} / scanned ${candidates.length}` +
      ` (no match: ${missing}, errors: ${failed}).`,
  );

  await mongoose.disconnect();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[backfill] Fatal:', err);
    void mongoose.disconnect().finally(() => process.exit(1));
  });
