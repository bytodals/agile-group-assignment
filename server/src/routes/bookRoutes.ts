import { Router } from 'express';
import {
  getBooks,
  getBook,
  searchBooks,
  getBooksByAuthor,
  createBook,
  updateAvailability,
} from '../controllers/bookController.js';

const router = Router();

router.get('/', getBooks);
router.get('/search', searchBooks);
router.get('/author/:authorId', getBooksByAuthor);
router.get('/:id', getBook);
router.post('/', createBook);
router.patch('/:id/availability', updateAvailability);

export default router;
