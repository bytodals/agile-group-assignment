import { useEffect, useMemo, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Search, Trash2 } from 'lucide-react';
import BookList from '../components/SavedBooksList';
import TopBar from '../components/TopBar/TopBar';
import Reveal from '../components/motion/Reveal';
import { fetchSavedBooks, removeSavedBook } from '../services/api';
import type { BookType } from '../types';

const PAGE_SIZE = 8;

export default function SavedBooksPage() {
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

        if (!active) return;

        setBooks(result.books);
        setTotalPages(result.totalPages);
        setTotalItems(result.totalItems);

        if (result.page !== page) {
          setPage(result.page);
        }
      } catch (err) {
        if (!active || controller.signal.aborted) return;
        const message = err instanceof Error ? err.message : 'Failed to load saved books.';
        setError(message);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadBooks();

    return () => {
      active = false;
      controller.abort();
    };
  }, [page, searchQuery]);

  const summary = useMemo(() => {
    if (!totalItems) return '';
    return searchQuery
      ? `${totalItems} saved book${totalItems === 1 ? '' : 's'} match “${searchQuery}”`
      : `${totalItems} saved book${totalItems === 1 ? '' : 's'} in your shelf`;
  }, [searchQuery, totalItems]);

  const handleRemoveBook = useCallback(
    async (book: BookType) => {
      const confirmed = window.confirm(`Remove “${book.title}” from your saved books?`);
      if (!confirmed) return;

      const previousBooks = books;

      setRemovingId(book._id);
      setBooks((current) => current.filter((b) => b._id !== book._id));
      setTotalItems((n) => Math.max(0, n - 1));

      try {
        await removeSavedBook(book._id);

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
        setBooks(previousBooks);
        const message = err instanceof Error ? err.message : 'Failed to remove the book.';
        setError(message);
      } finally {
        setRemovingId(null);
      }
    },
    [books, page, searchQuery],
  );

  return (
    <div className="editorial-root">
      <TopBar active="shelf" />
      <main className="editorial-page">
        <Reveal as="section" className="section" immediate>
          <div className="section__head">
            <div>
              <span className="section__eyebrow">Your shelf</span>
              <h1 className="section__title">Saved books</h1>
            </div>
            <p className="section__hint">{summary || 'No saved books yet'}</p>
          </div>

          <div className="search-pill">
            <Search className="search-pill__icon" size={18} />
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search saved books by title or author…"
              aria-label="Search saved books"
            />
          </div>
        </Reveal>

        <Reveal as="section" delay={0.1} immediate>
          <BookList
            books={books}
            emptyState="Search Open Library on the home page and save a title to start your shelf."
            isLoading={isLoading}
            error={error}
            loadingLabel="Loading your saved books…"
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
        </Reveal>

        {!isLoading && !error && totalPages > 1 ? (
          <nav className="saved-books-page__pagination" aria-label="Saved books pagination">
            <button
              className="ui-button ui-button--ghost"
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
              className="ui-button ui-button--ghost"
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages}
            >
              Next <ChevronRight size={16} />
            </button>
          </nav>
        ) : null}

        <footer className="editorial-footer">
          <p>
            <em>bookMoth</em> — a quiet shelf for a loud world
          </p>
        </footer>
      </main>
    </div>
  );
}
