import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    await mongoose.connection.db?.admin().ping();

    return res.status(200).json({
      status: 'ok',
      database: 'up',
      timestamp: new Date().toISOString(),
    });
  } catch {
    return res.status(503).json({
      status: 'fail',
      database: 'down',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
