import { useEffect, useMemo, useState, useCallback } from 'react';
import { Bookmark, ChevronLeft, ChevronRight, Home, Search, Trash2 } from 'lucide-react';
import BookList from '../components/BookList';
import { fetchSavedBooks, removeSavedBook } from '../services/api';
import type { BookType } from '../types';

type SavedBooksPageProps = {
  onNavigate: (path: string) => void;
};

const PAGE_SIZE = 8;

export default function SavedBooksPage({ onNavigate }: SavedBooksPageProps) {
  const [books, setBooks] = useState<BookType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(handle);
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const loadBooks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchSavedBooks({
          page,
          limit: PAGE_SIZE,
          query: searchQuery,
          signal: controller.signal,
        });

        if (!active) {
          return;
        }

        setBooks(result.books);
        setTotalPages(result.totalPages);
        setTotalItems(result.totalItems);

        if (result.page !== page) {
          setPage(result.page);
        }
      } catch (err) {
        if (!active || controller.signal.aborted) {
          return;
        }

        const message = err instanceof Error ? err.message : 'Failed to load saved books.';
        setError(message);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadBooks();

    return () => {
      active = false;
      controller.abort();
    };
  }, [page, searchQuery]);

  const summary = useMemo(() => {
    if (!totalItems) {
      return '';
    }

    return searchQuery
      ? `${totalItems} saved book${totalItems === 1 ? '' : 's'} match “${searchQuery}”`
      : `${totalItems} saved book${totalItems === 1 ? '' : 's'} in your account`;
  }, [searchQuery, totalItems]);

  const handleRemoveBook = useCallback(async (book: BookType) => {
    const confirmed = window.confirm(`Remove “${book.title}” from your saved books?`);
    if (!confirmed) return;

    const previousBooks = books;
    // Optimistically remove locally for snappier UX
    setRemovingId(book._id);
    setBooks((current) => current.filter((b) => b._id !== book._id));
    setTotalItems((n) => Math.max(0, n - 1));

    try {
      await removeSavedBook(book._id);

      // Re-fetch to ensure pagination and totals are accurate
      const result = await fetchSavedBooks({
        page,
        limit: PAGE_SIZE,
        query: searchQuery,
      });

      if (result.books.length === 0 && page > 1) {
        setPage((current) => Math.max(1, current - 1));
        return;
      }

      setBooks(result.books);
      setTotalPages(result.totalPages);
      setTotalItems(result.totalItems);
      setError(null);
    } catch (err) {
      // rollback on error
      setBooks(previousBooks);
      const message = err instanceof Error ? err.message : 'Failed to remove the book.';
      setError(message);
    } finally {
      setRemovingId(null);
    }
  }, [books, page, searchQuery]);

  return (
    <div className="saved-books-page" data-sidebar-open="false">
      <aside className="saved-books-page__sidebar" aria-label="Primary">
        <nav className="saved-books-page__nav">
          <button className="saved-books-page__nav-item" type="button" onClick={() => onNavigate('/')}>
            <Home className="icon" size={18} /> Home
          </button>
          <button className="saved-books-page__nav-item saved-books-page__nav-item--active" type="button">
            <Bookmark className="icon" size={18} /> Saved books
          </button>
        </nav>
      </aside>

      <main className="saved-books-page__main">
        <header className="saved-books-page__header">
          <div>
            <p className="saved-books-page__eyebrow">Your shelf</p>
            <h1 className="saved-books-page__title">Saved books</h1>
            <p className="saved-books-page__subtitle">
              Review the books you’ve saved, search your shelf, and remove titles you’re no longer keeping.
            </p>
          </div>

          <button className="saved-books-page__back" type="button" onClick={() => onNavigate('/')}>
            <Home size={18} /> Back
          </button>
        </header>

        <section className="saved-books-page__toolbar" aria-label="Saved books search">
          <label className="saved-books-page__search">
            <Search size={18} />
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search saved books by title or author"
            />
          </label>

          <p className="saved-books-page__count">{summary || 'No saved books yet'}</p>
        </section>

        <BookList
          books={books}
          emptyState="You haven't saved any books yet"
          isLoading={isLoading}
          error={error}
          loadingLabel="Loading your saved books..."
          summary={summary || undefined}
          renderActions={(book) => (
            <button
              className="ui-button ui-button--ghost ui-button--danger"
              type="button"
              onClick={() => void handleRemoveBook(book)}
              disabled={removingId === book._id}
            >
              <Trash2 size={16} /> {removingId === book._id ? 'Removing…' : 'Remove'}
            </button>
          )}
        />

        {!isLoading && !error && totalPages > 1 ? (
          <nav className="saved-books-page__pagination" aria-label="Saved books pagination">
            <button
              className="ui-button ui-button--secondary"
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <p className="saved-books-page__pagination-text">
              Page {page} of {totalPages}
            </p>

            <button
              className="ui-button ui-button--secondary"
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages}
            >
              Next <ChevronRight size={16} />
            </button>
          </nav>
        ) : null}
      </main>
    </div>
  );
}