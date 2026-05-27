import { Router } from 'express';
import {
  getBooks,
  getBook,
  searchBooks,
  getBooksByAuthor,
  createBook,
  updateAvailability,
  updateFavorite,
  addToFavorites,
  removeFromFavorites,
} from '../controllers/bookController.js';

const router = Router();

router.get('/', getBooks);
router.get('/search', searchBooks);
router.get('/author/:authorId', getBooksByAuthor);
router.get('/:id', getBook);
router.post('/', createBook);
router.post('/favorite', addToFavorites);
router.patch('/:id/availability', updateAvailability);
router.patch('/:id/favorite', updateFavorite);
router.delete('/:id', removeFromFavorites);

export default router;
