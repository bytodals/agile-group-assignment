import Book, { IBook } from '../models/Book.js';

export const getAllBooks = async (sortBy = 'title'): Promise<IBook[]> => {
  return Book.find()
    .populate('author')
    .sort({ [sortBy]: 1 });
};

export const getBookById = async (id: string): Promise<IBook | null> => {
  return Book.findById(id).populate('author');
};

export const searchBooks = async (query: string): Promise<IBook[]> => {
  return Book.find({ $text: { $search: query } }).populate('author');
};

export const getBooksByAuthor = async (authorId: string): Promise<IBook[]> => {
  return Book.find({ author: authorId }).populate('author').sort({ title: 1 });
};

export const createBook = async (data: Partial<IBook>): Promise<IBook> => {
  return Book.create(data);
};

export const updateAvailability = async (id: string, available: boolean): Promise<IBook | null> => {
  return Book.findByIdAndUpdate(id, { available }, { new: true });
};
