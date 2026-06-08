import { Router } from 'express';

const router = Router();

console.log('🔥 HEALTH ROUTE v2 - ALWAYS 503 🔥');

router.get('/', (_req, res) => {
  console.log('🧪 HEALTH ENDPOINT CALLED - FORCED 503');

  return res.status(503).json({
    status: 'error',
    timestamp: new Date().toISOString(),
    message: 'Database unavailable - FORCED TEST',
  });
});

export default router;
