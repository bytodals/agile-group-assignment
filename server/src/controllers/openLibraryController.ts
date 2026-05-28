import { asyncHandler } from '../middleware/asyncHandler.js';
import * as openLibraryService from '../services/openLibraryService.js';

export const searchAuthors = asyncHandler(async (req, res) => {
  const query = String(req.query.q ?? '');
  if (!query) {
    res.status(400).json({ message: 'Query parameter "q" is required' });
    return;
  }
  const authors = await openLibraryService.searchAuthors(query);
  res.json(authors);
});

export const searchBooks = asyncHandler(async (req, res) => {
  const query = String(req.query.q ?? '');
  if (!query) {
    res.status(400).json({ message: 'Query parameter "q" is required' });
    return;
  }
  const books = await openLibraryService.searchBooks(query);
  res.json(books);
});
