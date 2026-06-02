import type { BookType, AuthorType, SavedBooksResponse } from '../types';

// Is this only used here? If not, move it to the Types folder.
type DbBook = {
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
      let errorMessage: string | undefined;
      try {
        const errorBody = (await response.json()) as { message?: string };
        errorMessage = errorBody.message;
      } catch {
        // fall back to generic error below
      }

      throw new Error(errorMessage ?? fallbackError);
    }

    const text = await response.text();
    if (text.trimStart().startsWith('<')) {
      throw new Error('Could not load data');
    }

    throw new Error(fallbackError);
  }

  if (!contentType.includes('application/json')) {
    const text = await response.text();
    if (text.trimStart().startsWith('<')) {
      throw new Error('Could not reach the API. Please make sure the backend server is running.');
    }

    throw new Error('Invalid response format from server.');
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new Error('Invalid data received from server.');
  }
}

// Function for searching books in the database.
export default async function searchDbBooks(searchWord: string): Promise<BookType[]> {
  try {
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
          const res = await fetch(`/api/books/author/${author._id}`);
          return await parseJsonResponse<DbBook[]>(res, 'Failed to load books by author');
        }),
      )
    ).flat();

    // Merge and remove duplicates.
    const allBooks = [...books, ...authorBooks];
    const uniqueResult = allBooks.filter(
      (book, i, arr) => arr.findIndex((x) => x._id === book._id) === i,
    );

    return uniqueResult.map((book) => ({
      _id: book._id,
      title: book.title,
      genre: book.genre,
      author: book.author,
      available: book.available,
    }));
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function searchOpenLibraryBooks(query: string): Promise<OLBook[]> {
  const res = await fetch(`/api/openlibrary/books?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Open Library search failed');
  return res.json() as Promise<OLBook[]>;
}
export async function fetchSavedBooks({
  page = 1,
  limit = 8,
  query = '',
  signal,
}: SavedBooksQuery = {}): Promise<SavedBooksResponse> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (query.trim()) {
    params.set('q', query.trim());
  }

  const response = await fetch(`/api/books/favorites?${params.toString()}`, { signal });

  return parseJsonResponse<SavedBooksResponse>(response, 'Failed to load saved books');
}

export async function removeSavedBook(bookId: string): Promise<void> {
  const response = await fetch(`/api/books/${bookId}`, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error(`Failed to remove saved book (${response.status})`);
  }
}


export async function addBookToShelf(book: OLBook): Promise<void> {
  const res = await fetch('/api/books/favorite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error('Failed to add book to shelf');
}
