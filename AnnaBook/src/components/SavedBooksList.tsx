import type { ReactNode } from 'react';
import { BookmarkCheck, BookOpen, CalendarClock, User } from 'lucide-react';
import type { BookType } from '../types';
import LoadingSpinner from './ui/LoadingSpinner';

type BookListProps = {
  books: BookType[];
  emptyState: string;
  isLoading?: boolean;
  error?: string | null;
  loadingLabel?: string;
  renderActions?: (book: BookType) => ReactNode;
  summary?: string;
};

export default function BookList({
  books,
  emptyState,
  isLoading = false,
  error = null,
  loadingLabel = 'Loading books...',
  renderActions,
  summary,
}: BookListProps) {
  if (isLoading) {
    return (
      <div className="ui-spinner-wrapper book-list__state">
        <LoadingSpinner size="large" label={loadingLabel} />
      </div>
    );
  }

  if (error) {
    return (
      <section className="book-list__state book-list__state--error" role="alert">
        <h2>We couldn’t load your books</h2>
        <p>{error}</p>
      </section>
    );
  }

  if (books.length === 0) {
    return (
      <section className="book-list__state book-list__state--empty">
        <BookmarkCheck size={28} />
        <p>{emptyState}</p>
      </section>
    );
  }

  return (
    <div className="book-list">
      {summary ? <p className="book-list__summary">{summary}</p> : null}

      <ul className="book-list__grid" aria-label="Book list">
        {books.map((book) => (
          <li key={book._id} className="book-card">
            <div className="book-card__header">
              <div>
                <p className="book-card__kicker">
                  <BookOpen size={15} /> Saved book
                </p>
                <h2 className="book-card__title">{book.title}</h2>
              </div>
              {book.favorite ? <span className="book-card__badge">Saved</span> : null}
            </div>

            <dl className="book-card__meta">
              <div>
                <dt>
                  <User size={14} /> Author
                </dt>
                <dd>{book.author?.name ?? 'Unknown author'}</dd>
              </div>
              <div>
                <dt>
                  <CalendarClock size={14} /> Status
                </dt>
                <dd>{book.available ? 'Available' : 'Checked out'}</dd>
              </div>
              {book.genre ? (
                <div>
                  <dt>Genre</dt>
                  <dd>{book.genre}</dd>
                </div>
              ) : null}
            </dl>

            {renderActions ? <div className="book-card__actions">{renderActions(book)}</div> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
