import { Router } from 'express';
import {
  getAuthors,
  getAuthor,
  searchAuthors,
  createAuthor,
} from '../controllers/authorController.js';

const router = Router();

router.get('/', getAuthors);
router.get('/search', searchAuthors);
router.get('/:id', getAuthor);
router.post('/', createAuthor);

export default router;
