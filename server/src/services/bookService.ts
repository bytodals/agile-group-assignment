import Book, { IBook } from '../models/Book.js';
import Author from '../models/Author.js';

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

export const updateFavorite = async (id: string, favorite: boolean): Promise<IBook | null> => {
  return Book.findByIdAndUpdate(id, { favorite }, { new: true }).populate('author');
};

export const addToFavorites = async (data: {
  olKey: string;
  title: string;
  authorOlKey?: string;
  authorName?: string;
  genre?: string;
}): Promise<IBook> => {
  let authorId;
  if (data.authorOlKey && data.authorName) {
    const author = await Author.findOneAndUpdate(
      { olKey: data.authorOlKey },
      { name: data.authorName, olKey: data.authorOlKey },
      { upsert: true, new: true },
    );
    authorId = author._id;
  }
  const book = await Book.findOneAndUpdate(
    { olKey: data.olKey },
    { title: data.title, genre: data.genre, author: authorId, olKey: data.olKey, favorite: true },
    { upsert: true, new: true },
  );
  return book.populate('author');
};

export const removeFromFavorites = async (id: string): Promise<IBook | null> => {
  return Book.findByIdAndDelete(id);
};
