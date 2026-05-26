import Author, { IAuthor } from '../models/Author.js';
import Book from '../models/Book.js';
import * as openLibraryService from './openLibraryService.js';

export const getAllAuthors = async (): Promise<IAuthor[]> => {
  return Author.find().sort({ name: 1 });
};

export const getAuthorById = async (id: string): Promise<IAuthor | null> => {
  return Author.findById(id);
};

export const createAuthor = async (name: string): Promise<IAuthor> => {
  return Author.create({ name });
};

export const searchAuthors = async (query: string): Promise<IAuthor[]> => {
  return Author.find({ name: { $regex: query, $options: 'i' } }).sort({ name: 1 });
};

export const updateFavorite = async (id: string, favorite: boolean): Promise<IAuthor | null> => {
  return Author.findByIdAndUpdate(id, { favorite }, { new: true });
};

export const addToFavorites = async (olKey: string, name: string): Promise<IAuthor> => {
  const author = await Author.findOneAndUpdate(
    { olKey },
    { name, olKey, favorite: true },
    { upsert: true, new: true },
  );

  const olBooks = await openLibraryService.fetchAuthorWorks(olKey);
  for (const olBook of olBooks) {
    await Book.findOneAndUpdate(
      { olKey: olBook.olKey },
      { title: olBook.title, genre: olBook.genre, author: author._id, olKey: olBook.olKey },
      { upsert: true, new: true },
    );
  }

  return author;
};

export const removeFromFavorites = async (id: string): Promise<IAuthor | null> => {
  return Author.findByIdAndDelete(id);
};
