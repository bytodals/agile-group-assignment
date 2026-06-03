import { useState, useEffect } from 'react';
import BookCard from '../BookCard/BookCard';
import { getBooks } from '../../services/api';
import type { BookType } from '../../types';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function BookList() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBooks()
      .then(setBooks)
      .catch(() => setError('Kunde inte hämta böcker.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p>{error}</p>;
  if (books.length === 0) return <p>Inga böcker hittades.</p>;

  return (
    <ul style={{ padding: 0 }}>
      {books.map((book) => (
        <li key={book._id} style={{ listStyle: 'none' }}>
          <Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/books/${book._id}`}>
            <BookCard
              title={book.title}
              author={book.author.name}
              available={book.available}
              favorite={false}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
