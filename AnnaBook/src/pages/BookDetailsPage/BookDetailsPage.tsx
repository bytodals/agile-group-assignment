import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { BookType } from '../../types';
import { getBookById } from '../../services/api';
import './BookDetailsPage.modules.css';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';

export default function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState<BookType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;

    const loadBook = async () => {
      try {
        const data = await getBookById(id);
        if (!active) return;
        if (data) {
          setBook(data);
          setError(null);
        } else {
          setError('The book you are looking for could not be found.');
        }
      } catch (err) {
        if (!active) return;
        const message = err instanceof Error ? err.message : 'Failed to load this book.';
        setError(message);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadBook();

    return () => {
      active = false;
    };
  }, [id]);
  if (loading)
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LoadingSpinner />
      </div>
    );
  if (error || !book) {
    return (
      <section className="book-details">
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back
        </button>
        <ErrorMessage variant="block" title="Book not found">
          {error ?? 'The book you are looking for could not be found.'}
        </ErrorMessage>
      </section>
    );
  }

  return (
    <section className="book-details">
      <button className="back-btn" onClick={() => navigate(-1)}>
        Back
      </button>
      <section className="book-details-card">
        <img src="https://placehold.co/200x300" alt={book.title} className="book-details-img" />
        <div className="book-details-content">
          <h2>{book.title}</h2>
          <p>
            by <span className="author-link">{book.author.name}</span>
          </p>
        </div>
      </section>
    </section>
  );
}
