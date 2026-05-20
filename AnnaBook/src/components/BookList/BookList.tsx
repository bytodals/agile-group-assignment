import { useState, useEffect } from "react";
import BookCard from "../BookCard/BookCard";

export default function BookList() {
  // importera sen från Types
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // lägga i API-filen?
  useEffect(() => {
    getBooks()
      .then(setBooks)
      .catch(() => setError("Kunde inte hämta böcker."))
      .finally(() => setLoading(false));
  }, []);

  // fixa loading-komponent?
  if (loading) return <p>Laddar böcker...</p>;
  // fixa error-komponent?
  if (error) return <p>{error}</p>;
  if (books.length === 0) return <p>Inga böcker hittades.</p>;

  return (
    <ul>
      {books.map((book) => (
        <BookCard 
        key={book._id}
        id={book.id} 
        title={book.title}
        author={book.author}
        coverUrl={book.coverUrl} />
      ))}
    </ul>
  );
}
