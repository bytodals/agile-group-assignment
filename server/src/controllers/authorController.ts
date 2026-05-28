import { asyncHandler } from '../middleware/asyncHandler.js';
import * as authorService from '../services/authorService.js';

export const getAuthors = asyncHandler(async (_req, res) => {
  const authors = await authorService.getAllAuthors();
  res.json(authors);
});

export const getAuthor = asyncHandler(async (req, res) => {
  const author = await authorService.getAuthorById(String(req.params.id));
  if (!author) {
    res.status(404).json({ message: 'Author not found' });
    return;
  }
  res.json(author);
});

export const searchAuthors = asyncHandler(async (req, res) => {
  const query = String(req.query.q ?? '');
  const authors = await authorService.searchAuthors(query);
  res.json(authors);
});

export const createAuthor = asyncHandler(async (req, res) => {
  const author = await authorService.createAuthor(req.body.name);
  res.status(201).json(author);
});

export const updateFavorite = asyncHandler(async (req, res) => {
  const author = await authorService.updateFavorite(String(req.params.id), req.body.favorite);
  if (!author) {
    res.status(404).json({ message: 'Author not found' });
    return;
  }
  res.json(author);
});

export const addToFavorites = asyncHandler(async (req, res) => {
  const { olKey, name } = req.body as { olKey: string; name: string };
  if (!olKey || !name) {
    res.status(400).json({ message: '"olKey" and "name" are required' });
    return;
  }
  const author = await authorService.addToFavorites(olKey, name);
  res.status(201).json(author);
});

export const removeFromFavorites = asyncHandler(async (req, res) => {
  const deleted = await authorService.removeFromFavorites(String(req.params.id));
  if (!deleted) {
    res.status(404).json({ message: 'Author not found' });
    return;
  }
  res.status(204).send();
});
