import { useState, useEffect } from 'react';
import BookCard from '../BookCard/BookCard';
import { getBooks } from '../../services/api';
import type { Book } from '@shared/book';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function BookList() {
  // importera sen från Types
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // lägga i API-filen?
  useEffect(() => {
    getBooks()
      .then(setBooks)
      .catch(() => setError('Kunde inte hämta böcker.'))
      .finally(() => setLoading(false));
  }, []);

  // fixa loading-komponent?
  if (loading) return <LoadingSpinner />;
  // fixa error-komponent?
  if (error) return <p>{error}</p>;
  if (books.length === 0) return <p>Inga böcker hittades.</p>;

  return (
    <ul style={{ padding: 0 }}>
      {books.map((book) => (
        <li key={book._id} style={{ listStyle: 'none' }}>
          <Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/books/${book._id}`}>
            <BookCard
              title={book.title}
              author={typeof book.author === 'object' ? book.author.name : book.author}
              available={book.available}
              favorite={false}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
