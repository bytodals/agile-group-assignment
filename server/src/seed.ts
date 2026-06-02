import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import connectDB from './config/db.js';
import Author from './models/Author.js';
import Book from './models/Book.js';

dotenv.config({ quiet: true });

const seedPath = path.join(process.cwd(), 'data', 'seed-data.json');

if (!existsSync(seedPath)) {
  console.error('[Seed] data/seed-data.json not found — run "npm run export" first');
  process.exit(1);
}

await connectDB();

const { authors, books } = JSON.parse(readFileSync(seedPath, 'utf-8')) as {
  authors: Record<string, unknown>[];
  books: Record<string, unknown>[];
};

await Author.deleteMany({});
await Book.deleteMany({});

await Author.insertMany(authors);
await Book.insertMany(books);

console.log(`[Seed] Inserted ${authors.length} authors and ${books.length} books`);

await mongoose.disconnect();
