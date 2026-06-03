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

export const getFavoriteBooks = async ({
  query = '',
  page = 1,
  limit = 12,
}: {
  query?: string;
  page?: number;
  limit?: number;
}): Promise<{
  books: IBook[];
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
}> => {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(Math.floor(limit), 50) : 12;
  const trimmedQuery = query.trim();

  const favoriteQuery = { favorite: true } as Record<string, unknown>;

  if (trimmedQuery) {
    const [titleMatches, authorMatches] = await Promise.all([
      Book.find({ ...favoriteQuery, $text: { $search: trimmedQuery } }).populate('author'),
      Author.find({ name: { $regex: trimmedQuery, $options: 'i' } }).select('_id'),
    ]);

    const authorBooks = authorMatches.length
      ? await Book.find({
          ...favoriteQuery,
          author: { $in: authorMatches.map((author) => author._id) },
        }).populate('author')
      : [];

    const uniqueBooks = [...titleMatches, ...authorBooks].filter(
      (book, index, arr) =>
        arr.findIndex((candidate) => candidate._id.toString() === book._id.toString()) === index,
    );

    const sortedBooks = uniqueBooks.sort((a, b) => a.title.localeCompare(b.title));
    const totalItems = sortedBooks.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit));
    const start = (safePage - 1) * safeLimit;

    return {
      books: sortedBooks.slice(start, start + safeLimit),
      totalItems,
      totalPages,
      page: Math.min(safePage, totalPages),
      limit: safeLimit,
    };
  }

  const totalItems = await Book.countDocuments(favoriteQuery);
  const totalPages = Math.max(1, Math.ceil(totalItems / safeLimit));
  const books = await Book.find(favoriteQuery)
    .populate('author')
    .sort({ updatedAt: -1, title: 1 })
    .skip((safePage - 1) * safeLimit)
    .limit(safeLimit);

  return {
    books,
    totalItems,
    totalPages,
    page: Math.min(safePage, totalPages),
    limit: safeLimit,
  };
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
