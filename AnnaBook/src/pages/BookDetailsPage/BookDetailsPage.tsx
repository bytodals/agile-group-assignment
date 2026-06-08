import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import type { BookType } from '../../types';
import { getBookById } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import CoverImage from '../../components/CoverImage/CoverImage';
import TopBar from '../../components/TopBar/TopBar';
import Reveal from '../../components/motion/Reveal';

export default function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [prevId, setPrevId] = useState(id);
  const [book, setBook] = useState<BookType | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(
    id ? null : 'The book you are looking for could not be found.',
  );

  if (prevId !== id) {
    setPrevId(id);
    setBook(null);
    setError(id ? null : 'The book you are looking for could not be found.');
    setLoading(!!id);
  }

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

  return (
    <div className="editorial-root">
      <TopBar />
      <main className="editorial-page">
        <button className="details-back" type="button" onClick={() => navigate(-1)}>
          <ChevronLeft size={16} /> Back
        </button>

        {loading ? (
          <LoadingSpinner size="large" label="Loading book…" />
        ) : error || !book ? (
          <ErrorMessage variant="block" title="Book not found">
            {error ?? 'The book you are looking for could not be found.'}
          </ErrorMessage>
        ) : (
          <Reveal as="section" className="details-layout" immediate>
            <div className="details-cover">
              <CoverImage
                coverId={book.coverId}
                title={book.title}
                author={book.author?.name}
                size="lg"
              />
            </div>
            <div className="details-text">
              <h1 className="details-title">{book.title}</h1>
              {book.author?.name && <p className="details-author">by {book.author.name}</p>}
              <hr className="details-rule" />
              <div className="details-meta">
                {book.genre && <span className="details-pill">{book.genre}</span>}
                <span
                  className={`details-pill ${
                    book.available ? 'details-pill--available' : 'details-pill--unavailable'
                  }`}
                >
                  {book.available ? 'Available' : 'Checked out'}
                </span>
                {book.favorite && <span className="details-pill">★ Saved</span>}
              </div>
            </div>
          </Reveal>
        )}

        <footer className="editorial-footer">
          <p>
            <em>bookMoth</em> — a quiet shelf for a loud world
          </p>
        </footer>
      </main>
    </div>
  );
}
