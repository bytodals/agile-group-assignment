import { Router } from 'express';
import {
  getBooks,
  getBook,
  searchBooks,
  getFavoriteBooks,
  getBooksByAuthor,
  getFeatured,
  getGenres,
  createBook,
  updateAvailability,
  updateFavorite,
  addToFavorites,
  removeFromFavorites,
} from '../controllers/bookController.js';

const router = Router();

router.get('/', getBooks);
router.get('/featured', getFeatured);
router.get('/genres', getGenres);
router.get('/search', searchBooks);
router.get('/favorites', getFavoriteBooks);
router.get('/author/:authorId', getBooksByAuthor);
router.get('/:id', getBook);
router.post('/', createBook);
router.post('/favorite', addToFavorites);
router.patch('/:id/availability', updateAvailability);
router.patch('/:id/favorite', updateFavorite);
router.delete('/:id', removeFromFavorites);

export default router;
