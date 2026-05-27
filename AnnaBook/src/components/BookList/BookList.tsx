import { useState, useEffect } from "react";
import BookCard from "../BookCard/BookCard";
//getBooks service
import type { Book } from "@shared/book";
import { Link } from "react-router-dom";
import LoadingSpinner from "../ui/LoadingSpinner";

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
  if (loading) return <LoadingSpinner />;
  // fixa error-komponent?
  if (error) return <p>{error}</p>;
  if (books.length === 0) return <p>Inga böcker hittades.</p>;

  return (
    <ul style={{ padding: 0 }}>
      {books.map((book) => (
        <li key={book.id} style={{ listStyle: "none" }}>
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            to={`/books/${book.id}`}
          >
            <BookCard
              key={book._id}
              id={book.id}
              title={book.title}
              author={book.author}
              // coverUrl={book.coverUrl}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
