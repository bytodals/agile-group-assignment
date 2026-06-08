import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { searchOpenLibraryBooks, addBookToShelf, type OLBook } from '../services/api';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorMessage from './ui/ErrorMessage';
import CoverImage from './CoverImage/CoverImage';
import type { OpenLibrarySearchResultsProps } from '../types';

export default function OpenLibrarySearchResults({ query }: OpenLibrarySearchResultsProps) {
  const [results, setResults] = useState<OLBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const trimmed = query.trim();
      if (trimmed.length < 2) {
        setResults([]);
        setError(false);
        return;
      }
      try {
        setLoading(true);
        setError(false);
        setResults(await searchOpenLibraryBooks(trimmed));
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

  if (query.trim().length < 2) return null;
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage>Book-search failed.</ErrorMessage>;
  if (results.length === 0)
    return <p className="hp-search-feedback">No books found for &quot;{query}&quot;.</p>;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={query}
        className="ol-results"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {results.map((book) => (
          <motion.article
            key={book.olKey}
            className="ol-result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="ol-result__cover">
              <CoverImage
                coverId={book.coverId}
                title={book.title}
                author={book.authorName}
                size="sm"
              />
            </div>
            <div className="ol-result__body">
              <h3 className="ol-result__title">{book.title}</h3>
              {book.authorName && <p className="ol-result__author">{book.authorName}</p>}
              <button
                className="ol-result__add"
                onClick={() => handleAddToShelf(book)}
                disabled={added.has(book.olKey)}
              >
                {added.has(book.olKey) ? 'Added ✓' : 'Add to shelf'}
              </button>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
