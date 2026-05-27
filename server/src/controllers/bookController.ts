import { NextFunction, Request, Response } from 'express';
import * as bookService from '../services/bookService.js';

export const getBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sortBy = String(req.query.sortBy ?? 'title');
    const books = await bookService.getAllBooks(sortBy);
    res.json(books);
  } catch (err) {
    next(err);
  }
};

export const getBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const book = await bookService.getBookById(String(req.params.id));
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    res.json(book);
  } catch (err) {
    next(err);
  }
};

export const searchBooks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query = String(req.query.q ?? '');
    const books = await bookService.searchBooks(query);
    res.json(books);
  } catch (err) {
    next(err);
  }
};

export const getBooksByAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const books = await bookService.getBooksByAuthor(String(req.params.authorId));
    res.json(books);
  } catch (err) {
    next(err);
  }
};

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const book = await bookService.createBook(req.body);
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};

export const updateAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const book = await bookService.updateAvailability(String(req.params.id), req.body.available);
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    res.json(book);
  } catch (err) {
    next(err);
  }
};

export const updateFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const book = await bookService.updateFavorite(String(req.params.id), req.body.favorite);
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    res.json(book);
  } catch (err) {
    next(err);
  }
};

export const addToFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
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
  } catch (err) {
    next(err);
  }
};

export const removeFromFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const deleted = await bookService.removeFromFavorites(String(req.params.id));
    if (!deleted) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
