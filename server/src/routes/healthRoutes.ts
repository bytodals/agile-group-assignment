import { Router } from 'express';
import mongoose from 'mongoose';
import { getDBStatus } from '../config/db.js';
import { logger } from '../utils/logger.js';

const router = Router();

router.get('/', async (_req, res) => {
  const start = Date.now();

  try {
    if (!getDBStatus()) {
      logger.info('health', 'DB status check failed → 503');
      return res.status(503).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        message: 'Database unavailable',
      });
    }

    // Extra ping to ensure DB is responsive, not just connected
    await mongoose.connection.db?.admin().ping();

    logger.info('health', `Health check passed in ${Date.now() - start}ms`);
    return res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('health', 'Health check failed with exception', errorMessage);

    return res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Database unavailable',
    });
  }
});

export default router;
