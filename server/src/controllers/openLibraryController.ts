import { NextFunction, Request, Response } from 'express';
import * as openLibraryService from '../services/openLibraryService.js';

export const searchAuthors = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query = String(req.query.q ?? '');
    if (!query) {
      res.status(400).json({ message: 'Query parameter "q" is required' });
      return;
    }
    const authors = await openLibraryService.searchAuthors(query);
    res.json(authors);
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
    if (!query) {
      res.status(400).json({ message: 'Query parameter "q" is required' });
      return;
    }
    const books = await openLibraryService.searchBooks(query);
    res.json(books);
  } catch (err) {
    next(err);
  }
};
