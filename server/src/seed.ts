import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Author from './models/Author.js';
import Book from './models/Book.js';

dotenv.config({ quiet: true });

const authors = [
  { name: 'Astrid Lindgren' },
  { name: 'Stieg Larsson' },
  { name: 'Fredrik Backman' },
];

const seed = async (): Promise<void> => {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('Connected to MongoDB');

  await Author.deleteMany({});
  await Book.deleteMany({});
  console.log('Cleared existing data');

  const createdAuthors = await Author.insertMany(authors);
  console.log(`Inserted ${createdAuthors.length} authors`);

  const [astrid, stieg, fredrik] = createdAuthors;

  const books = [
    { title: 'Pippi Långstrump', genre: 'Barn', author: astrid._id, available: true },
    { title: 'Emil i Lönneberga', genre: 'Barn', author: astrid._id, available: false },
    { title: 'Män som hatar kvinnor', genre: 'Thriller', author: stieg._id, available: true },
    { title: 'Flickan som lekte med elden', genre: 'Thriller', author: stieg._id, available: true },
    {
      title: 'En man som heter Ove',
      genre: 'Skönlitteratur',
      author: fredrik._id,
      available: false,
    },
    { title: 'Anxious People', genre: 'Skönlitteratur', author: fredrik._id, available: true },
  ];

  const createdBooks = await Book.insertMany(books);
  console.log(`Inserted ${createdBooks.length} books`);

  console.log('\nSeed complete!');
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
