import { Request, Response } from 'express';
import * as authorService from '../services/authorService.js';

export const getAuthors = async (_req: Request, res: Response): Promise<void> => {
  const authors = await authorService.getAllAuthors();
  res.json(authors);
};

export const getAuthor = async (req: Request, res: Response): Promise<void> => {
  const author = await authorService.getAuthorById(String(req.params.id));
  if (!author) {
    res.status(404).json({ message: 'Author not found' });
    return;
  }
  res.json(author);
};

export const searchAuthors = async (req: Request, res: Response): Promise<void> => {
  const query = String(req.query.q ?? '');
  const authors = await authorService.searchAuthors(query);
  res.json(authors);
};

export const createAuthor = async (req: Request, res: Response): Promise<void> => {
  const author = await authorService.createAuthor(req.body.name);
  res.status(201).json(author);
};
