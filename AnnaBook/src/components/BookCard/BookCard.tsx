import type { Book } from '@shared/book';

type BookCardProps = Book;
//url till bokomslag?

export default function BookCard({ title, author }: BookCardProps) {
  return (
    <article className="hp-card">
      <img src="https://placehold.co/200x300" alt={title} />
      <h3>{title}</h3>
      <p>{author}</p>
    </article>
  );
}
