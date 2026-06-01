import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger.js';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    const status = res.statusCode;
    const msg = `${req.method} ${req.url} → ${status} (${ms}ms)`;
    if (status >= 500) logger.error('http', msg);
    else if (status >= 400) logger.warn('http', msg);
    else logger.info('http', msg);
  });
  next();
}
