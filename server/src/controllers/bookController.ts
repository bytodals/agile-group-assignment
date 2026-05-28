import { asyncHandler } from '../middleware/asyncHandler.js';
import * as bookService from '../services/bookService.js';

export const getBooks = asyncHandler(async (req, res) => {
  const sortBy = String(req.query.sortBy ?? 'title');
  const books = await bookService.getAllBooks(sortBy);
  res.json(books);
});

export const getBook = asyncHandler(async (req, res) => {
  const book = await bookService.getBookById(String(req.params.id));
  if (!book) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }
  res.json(book);
});

export const searchBooks = asyncHandler(async (req, res) => {
  const query = String(req.query.q ?? '');
  const books = await bookService.searchBooks(query);
  res.json(books);
});

export const getBooksByAuthor = asyncHandler(async (req, res) => {
  const books = await bookService.getBooksByAuthor(String(req.params.authorId));
  res.json(books);
});

export const createBook = asyncHandler(async (req, res) => {
  const book = await bookService.createBook(req.body);
  res.status(201).json(book);
});

export const updateAvailability = asyncHandler(async (req, res) => {
  const book = await bookService.updateAvailability(String(req.params.id), req.body.available);
  if (!book) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }
  res.json(book);
});

export const updateFavorite = asyncHandler(async (req, res) => {
  const book = await bookService.updateFavorite(String(req.params.id), req.body.favorite);
  if (!book) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }
  res.json(book);
});

export const addToFavorites = asyncHandler(async (req, res) => {
  const { olKey, title, authorOlKey, authorName, genre } = req.body as {
    olKey: string;
    title: string;
    authorOlKey?: string;
    authorName?: string;
    genre?: string;
  };
  if (!olKey || !title) {
    res.status(400).json({ message: '"olKey" and "title" are required' });
    return;
  }
  const book = await bookService.addToFavorites({ olKey, title, authorOlKey, authorName, genre });
  res.status(201).json(book);
});

export const removeFromFavorites = asyncHandler(async (req, res) => {
  const deleted = await bookService.removeFromFavorites(String(req.params.id));
  if (!deleted) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }
  res.status(204).send();
});
