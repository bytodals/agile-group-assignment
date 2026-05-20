import Author, { IAuthor } from '../models/Author.js';

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
