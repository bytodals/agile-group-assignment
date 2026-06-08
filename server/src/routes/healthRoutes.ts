import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/', async (_req, res) => {
  const state = mongoose.connection.readyState;

  // 1 = connected
  if (state !== 1) {
    return res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Database unavailable',
    });
  }

  try {
    await mongoose.connection.db?.admin().ping();

    return res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);

    return res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Database unavailable',
    });
  }
});

export default router;
