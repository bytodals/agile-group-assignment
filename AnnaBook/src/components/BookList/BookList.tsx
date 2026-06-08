import { useState, useEffect } from 'react';
import BookCard from '../BookCard/BookCard';
import { getBooks, type DbBook } from '../../services/api';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

type BookListProps = {
  limit?: number;
};

export default function BookList({ limit }: BookListProps) {
  const [books, setBooks] = useState<DbBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBooks()
      .then((all) => {
        const ordered = [...all].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
        setBooks(typeof limit === 'number' ? ordered.slice(0, limit) : ordered);
      })
      .catch(() => setError("We couldn't load the books."))
      .finally(() => setLoading(false));
  }, [limit]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (books.length === 0) {
    return (
      <div className="empty-state">
        <h2>No books yet</h2>
        <p>Search Open Library above and save your first title — it will appear here.</p>
      </div>
    );
  }

  return (
    <ul className="poster-grid">
      {books.map((book) => (
        <li key={book._id}>
          <BookCard
            id={book._id}
            title={book.title}
            author={book.author?.name ?? 'Unknown author'}
            coverId={book.coverId}
          />
        </li>
      ))}
    </ul>
  );
}
