import { useState, useEffect } from 'react';
import { searchOpenLibraryBooks, addBookToShelf, type OLBook } from '../services/api';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorMessage from './ui/ErrorMessage';
import type { OpenLibrarySearchResultsProps } from '../types';

export default function OpenLibrarySearchResults({ query }: OpenLibrarySearchResultsProps) {
  const [results, setResults] = useState<OLBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      try {
        setLoading(true);
        setError(false);
        setResults(await searchOpenLibraryBooks(query));
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  async function handleAddToShelf(book: OLBook) {
    try {
      await addBookToShelf(book);
      setAdded((prev) => new Set(prev).add(book.olKey));
    } catch (e) {
      console.error('Failed to add book to shelf', e);
    }
  }

  if (!query.trim()) return null;
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage>Book-search failed.</ErrorMessage>;
  if (results.length === 0)
    return <p className="hp-search-feedback">No books found for &quot;{query}&quot;.</p>;

  return (
    <div className="hp-grid hp-grid-2 hp-search-results">
      {results.map((book) => (
        <article key={book.olKey} className="hp-card">
          <img
            src={
              book.coverId
                ? `https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`
                : 'https://placehold.co/200x300'
            }
            alt={book.title}
          />
          <div>
            <h3>{book.title}</h3>
            {book.authorName && <p>{book.authorName}</p>}
            <button
              className="hp-add-btn"
              onClick={() => handleAddToShelf(book)}
              disabled={added.has(book.olKey)}
            >
              {added.has(book.olKey) ? 'Added ✓' : 'Add to shelf'}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
