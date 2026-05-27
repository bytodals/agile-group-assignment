import { Router } from 'express';
import {
  getAuthors,
  getAuthor,
  searchAuthors,
  createAuthor,
  updateFavorite,
  addToFavorites,
  removeFromFavorites,
} from '../controllers/authorController.js';

const router = Router();

router.get('/', getAuthors);
router.get('/search', searchAuthors);
router.get('/:id', getAuthor);
router.post('/', createAuthor);
router.post('/favorite', addToFavorites);
router.patch('/:id/favorite', updateFavorite);
router.delete('/:id', removeFromFavorites);

export default router;
