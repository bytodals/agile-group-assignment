import type { BookType, AuthorType, SavedBooksResponse } from '../types';

export type OLBook = {
  olKey: string;
  title: string;
  authorOlKey?: string;
  authorName?: string;
  genre?: string;
  coverId?: number;
};

export type DbBook = {
  _id: string;
  title: string;
  genre?: string;
  author: {
    _id: string;
    name: string;
  };
  available: boolean;
  favorite?: boolean;
  createdAt: string;
  updatedAt: string;
};

type SavedBooksQuery = {
  page?: number;
  limit?: number;
  query?: string;
  signal?: AbortSignal;
};

async function parseJsonResponse<T>(response: Response, fallbackError: string): Promise<T> {
  const contentType = response.headers.get('content-type') ?? '';

  if (!response.ok) {
    if (contentType.includes('application/json')) {
      try {
        const errorBody = (await response.json()) as {
          message?: string;
        };

        throw new Error(errorBody.message ?? fallbackError);
      } catch {
        throw new Error(fallbackError);
      }
    }

    throw new Error(fallbackError);
  }

  if (!contentType.includes('application/json')) {
    throw new Error('Invalid response format from server.');
  }

  return (await response.json()) as T;
}

export async function getBooks(): Promise<DbBook[]> {
  const response = await fetch('/api/books');

  return parseJsonResponse<DbBook[]>(response, 'Failed to fetch books');
}

export async function getBookById(id: string): Promise<DbBook | null> {
  const response = await fetch(`/api/books/${id}`);

  if (response.status === 404) {
    return null;
  }

  return parseJsonResponse<DbBook>(response, 'Failed to fetch book');
}

export default async function searchDbBooks(searchWord: string): Promise<BookType[]> {
  const encodedSearchWord = encodeURIComponent(searchWord);

  const [booksRes, authorsRes] = await Promise.all([
    fetch(`/api/books/search?q=${encodedSearchWord}`),
    fetch(`/api/authors/search?q=${encodedSearchWord}`),
  ]);

  const books = await parseJsonResponse<DbBook[]>(booksRes, 'Failed to search books');

  const authors = await parseJsonResponse<AuthorType[]>(authorsRes, 'Failed to search authors');

  // Fetch books for each matched author.
  const authorBooks = (
    await Promise.all(
      authors.map(async (author) => {
        const response = await fetch(`/api/books/author/${author._id}`);

        return parseJsonResponse<DbBook[]>(response, 'Failed to load books by author');
      }),
    )
  ).flat();

  // Merge results and remove duplicates.
  const uniqueBooks = [...books, ...authorBooks].filter(
    (book, index, array) => array.findIndex((b) => b._id === book._id) === index,
  );

  return uniqueBooks.map((book) => ({
    _id: book._id,
    title: book.title,
    genre: book.genre,
    author: book.author,
    available: book.available,
  }));
}

export async function searchOpenLibraryBooks(query: string): Promise<OLBook[]> {
  const response = await fetch(`/api/openlibrary/books?q=${encodeURIComponent(query)}`);

  return parseJsonResponse<OLBook[]>(response, 'Open Library search failed');
}

export async function fetchSavedBooks({
  page = 1,
  limit = 8,
  query = '',
  signal,
}: SavedBooksQuery = {}): Promise<SavedBooksResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (query.trim()) {
    params.set('q', query.trim());
  }

  const response = await fetch(`/api/books/favorites?${params.toString()}`, { signal });

  return parseJsonResponse<SavedBooksResponse>(response, 'Failed to load saved books');
}

export async function removeSavedBook(bookId: string): Promise<void> {
  const response = await fetch(`/api/books/${bookId}/favorite`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      favorite: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to remove saved book (${response.status})`);
  }
}

export async function addBookToShelf(book: OLBook): Promise<void> {
  const response = await fetch('/api/books/favorite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  });

  if (!response.ok) {
    throw new Error('Failed to add book to shelf');
  }
}
