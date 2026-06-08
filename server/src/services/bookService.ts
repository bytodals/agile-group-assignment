import Book, { IBook } from '../models/Book.js';
import Author from '../models/Author.js';
import { fetchTrending, fetchWorkDescription } from './openLibraryService.js';

export interface FeaturedBook {
  olKey: string;
  title: string;
  author?: string;
  coverId?: number;
  description?: string;
}

let featuredCache: { date: string; book: FeaturedBook } | null = null;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export const getFeaturedBook = async (): Promise<FeaturedBook | null> => {
  const today = todayKey();
  if (featuredCache && featuredCache.date === today) {
    return featuredCache.book;
  }

  try {
    const trending = await fetchTrending('monthly');
    if (trending.length > 0) {
      const pick = trending[Math.floor(Math.random() * trending.length)];
      const description = await fetchWorkDescription(pick.olKey);
      const book: FeaturedBook = {
        olKey: pick.olKey,
        title: pick.title,
        author: pick.authorName,
        coverId: pick.coverId,
        description,
      };
      featuredCache = { date: today, book };
      return book;
    }
  } catch {
    // fall through to DB fallback
  }

  const fallbackCount = await Book.countDocuments({ favorite: true, coverId: { $exists: true } });
  if (fallbackCount === 0) return null;
  const skip = Math.floor(Math.random() * fallbackCount);
  const doc = await Book.findOne({ favorite: true, coverId: { $exists: true } })
    .skip(skip)
    .populate<{ author: { name: string } }>('author');
  if (!doc) return null;
  const book: FeaturedBook = {
    olKey: doc.olKey ?? '',
    title: doc.title,
    author: doc.author?.name,
    coverId: doc.coverId,
  };
  featuredCache = { date: today, book };
  return book;
};

export const getGenresWithCounts = async (
  limit = 6,
): Promise<{ genre: string; count: number }[]> => {
  const results = await Book.aggregate<{ _id: string; count: number }>([
    { $match: { genre: { $exists: true, $nin: [null, ''] } } },
    { $group: { _id: '$genre', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]);
  return results.map((r) => ({ genre: r._id, count: r.count }));
};

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
  coverId?: number;
}): Promise<IBook> => {
  let authorId;
  if (data.authorName) {
    const author = await Author.findOneAndUpdate(
      data.authorOlKey ? { olKey: data.authorOlKey } : { name: data.authorName },
      { name: data.authorName, olKey: data.authorOlKey },
      { upsert: true, new: true },
    );
    authorId = author._id;
  }
  const update: Record<string, unknown> = {
    title: data.title,
    genre: data.genre,
    author: authorId,
    olKey: data.olKey,
    favorite: true,
  };
  if (typeof data.coverId === 'number') {
    update.coverId = data.coverId;
  }
  const book = await Book.findOneAndUpdate({ olKey: data.olKey }, update, {
    upsert: true,
    new: true,
  });
  return book.populate('author');
};

export const removeFromFavorites = async (id: string): Promise<IBook | null> => {
  return Book.findByIdAndDelete(id);
};
