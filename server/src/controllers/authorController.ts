import { NextFunction, Request, Response } from 'express';
import * as authorService from '../services/authorService.js';

export const getAuthors = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authors = await authorService.getAllAuthors();
    res.json(authors);
  } catch (err) {
    next(err);
  }
};

export const getAuthor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const author = await authorService.getAuthorById(String(req.params.id));
    if (!author) {
      res.status(404).json({ message: 'Author not found' });
      return;
    }
    res.json(author);
  } catch (err) {
    next(err);
  }
};

export const searchAuthors = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query = String(req.query.q ?? '');
    const authors = await authorService.searchAuthors(query);
    res.json(authors);
  } catch (err) {
    next(err);
  }
};

export const createAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const author = await authorService.createAuthor(req.body.name);
    res.status(201).json(author);
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
    const author = await authorService.updateFavorite(String(req.params.id), req.body.favorite);
    if (!author) {
      res.status(404).json({ message: 'Author not found' });
      return;
    }
    res.json(author);
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
    const { olKey, name } = req.body as { olKey: string; name: string };
    if (!olKey || !name) {
      res.status(400).json({ message: '"olKey" and "name" are required' });
      return;
    }
    const author = await authorService.addToFavorites(olKey, name);
    res.status(201).json(author);
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
    const deleted = await authorService.removeFromFavorites(String(req.params.id));
    if (!deleted) {
      res.status(404).json({ message: 'Author not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
