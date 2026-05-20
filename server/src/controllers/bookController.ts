import { Request, Response } from 'express';
import * as bookService from '../services/bookService.js';

export const getBooks = async (req: Request, res: Response): Promise<void> => {
  const sortBy = String(req.query.sortBy ?? 'title');
  const books = await bookService.getAllBooks(sortBy);
  res.json(books);
};

export const getBook = async (req: Request, res: Response): Promise<void> => {
  const book = await bookService.getBookById(String(req.params.id));
  if (!book) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }
  res.json(book);
};

export const searchBooks = async (req: Request, res: Response): Promise<void> => {
  const query = String(req.query.q ?? '');
  const books = await bookService.searchBooks(query);
  res.json(books);
};

export const getBooksByAuthor = async (req: Request, res: Response): Promise<void> => {
  const books = await bookService.getBooksByAuthor(String(req.params.authorId));
  res.json(books);
};

export const createBook = async (req: Request, res: Response): Promise<void> => {
  const book = await bookService.createBook(req.body);
  res.status(201).json(book);
};

export const updateAvailability = async (req: Request, res: Response): Promise<void> => {
  const book = await bookService.updateAvailability(String(req.params.id), req.body.available);
  if (!book) {
    res.status(404).json({ message: 'Book not found' });
    return;
  }
  res.json(book);
};
