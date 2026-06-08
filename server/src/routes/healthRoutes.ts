import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const state = mongoose.connection.readyState;

    // 1 = connected, 2 = connecting, 3 = disconnecting, 0 = disconnected
    if (state !== 1) {
      return res.status(503).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        message: 'Database unavailable',
      });
    }

    // Extra safety check: ping the database to ensure it's responsive
    await mongoose.connection.db?.admin().ping();

    return res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Database unavailable',
    });
  }
});

export default router;
