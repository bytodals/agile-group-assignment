import { useState, useEffect } from 'react';
import searchDbBooks from '../services/api.ts';
import type { BookType } from '../types';
import LoadingSpinner from './ui/LoadingSpinner.tsx';
import ErrorMessage from './ui/ErrorMessage.tsx';

export default function BookSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [searchWord, setSearchWord] = useState('');
  const [dbSearchResult, setDbSearchResult] = useState<BookType[]>([]);

  async function searchBookDatabase(searchInput: string) {
    try {
      setIsLoading(true);
      setIsError(false);
      const result = await searchDbBooks(searchInput);
      setDbSearchResult(result);
    } catch (e) {
      console.error(e);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchWord.trim() !== '') {
        searchBookDatabase(searchWord);
      } else {
        setDbSearchResult([]);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchWord]);

  return (
    <div>
      <label>
        Sök böcker i databasen:
        <input value={searchWord} onChange={(e) => setSearchWord(e.target.value)}></input>
      </label>

      {isLoading && <LoadingSpinner />}

      {isError && <ErrorMessage>Book-search failed.</ErrorMessage>}

      {!isLoading && dbSearchResult?.length === 0 && searchWord?.length > 1 && (
        <p className="hp-search-feedback">No books match your search term.</p>
      )}

      <ul>
        {dbSearchResult.map((book) => (
          <li key={book._id}>
            {book.title} {book.genre} {book.author.name}{' '}
            {book.available ? 'Available' : 'Checked out'}
          </li>
        ))}
      </ul>
    </div>
  );
}
