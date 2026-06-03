import type { BookType, AuthorType } from '../types';

export type OLBook = {
  olKey: string;
  title: string;
  authorOlKey?: string;
  authorName?: string;
  genre?: string;
  coverId?: number;
};

//Används den bara här? Annars, lägg i Types-mappen?
type DbBook = {
  _id: string;
  title: string;
  genre?: string;
  author: {
    _id: string;
    name: string;
  };
  available: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getBooks(): Promise<DbBook[]> {
  const res = await fetch('/api/books');
  if (!res.ok) throw new Error('Failed to fetch books');
  return res.json() as Promise<DbBook[]>;
}

export async function getBookById(id: string): Promise<DbBook | null> {
  const res = await fetch(`/api/books/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch book');
  return res.json() as Promise<DbBook>;
}

//Funktion för att söka i bokdatabasen.
export default async function searchDbBooks(searchWord: string): Promise<BookType[]> {
  try {
    const encodedSearchWord = encodeURIComponent(searchWord);

    const [booksRes, authorsRes] = await Promise.all([
      fetch(`/api/books/search?q=${encodedSearchWord}`),
      fetch(`/api/authors/search?q=${encodedSearchWord}`),
    ]);

    const books = (await booksRes.json()) as DbBook[];
    const authors = (await authorsRes.json()) as AuthorType[];

    //hämtar böcker per matchad författare
    const authorBooks = (
      await Promise.all(
        authors.map(async (author) => {
          const res = await fetch(`/api/books/author/${author._id}`);
          return (await res.json()) as DbBook[];
        }),
      )
    ).flat();

    //slå ihop och ta bort dubletter
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

export async function addBookToShelf(book: OLBook): Promise<void> {
  const res = await fetch('/api/books/favorite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error('Failed to add book to shelf');
}
