import { Router } from 'express';
import { searchAuthors, searchBooks } from '../controllers/openLibraryController.js';

const router = Router();

router.get('/authors', searchAuthors);
router.get('/books', searchBooks);

export default router;
