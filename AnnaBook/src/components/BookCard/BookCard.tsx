import "./BookCard.modules.css";

type BookCardProps = {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
};

export default function BookCard({ title, author, coverUrl }: BookCardProps) {
  return (
    <article className="book-card">
      <img src={coverUrl} alt={title} />
      <div className="book-card-content">
        <h3 className="title">{title}</h3>
        <p className="author">{author}</p>
      </div>
    </article>
  );
}
