import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import Author from './models/Author.js';
import Book from './models/Book.js';

dotenv.config({ quiet: true });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not set');
  process.exit(1);
}

await mongoose.connect(uri);
console.log('[Export] Connected to Atlas MongoDB');

const authors = await Author.find().lean();
const books = await Book.find().lean();

const dataDir = path.join(process.cwd(), 'data');
mkdirSync(dataDir, { recursive: true });

writeFileSync(path.join(dataDir, 'seed-data.json'), JSON.stringify({ authors, books }, null, 2));

console.log(
  `[Export] Saved ${authors.length} authors and ${books.length} books → data/seed-data.json`,
);

await mongoose.disconnect();
