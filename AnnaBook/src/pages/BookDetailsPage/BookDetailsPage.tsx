import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBookById } from '../../services/api';
import './BookDetailsPage.modules.css';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import type { DbBook } from '../../services/api';

export default function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState<DbBook | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getBookById(id)
      .then((data) => {
        if (data) {
          setBook(data);
        }
      })
      .finally(() => setLoading(false));
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
  if (!book) return <p>Boken hittades inte.</p>;

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
          <p>{book.genre}</p>
        </div>
      </section>
    </section>
  );
}
