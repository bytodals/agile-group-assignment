import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { logger } from '../utils/logger.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const ctx = `${req.method} ${req.url}`;

  if (err instanceof MongooseError.CastError) {
    logger.warn('errorHandler', `CastError on ${ctx} — Invalid value for "${err.path}"`);
    res.status(400).json({ message: `Invalid value for field "${err.path}"` });
    return;
  }
  if (err instanceof MongooseError.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    logger.warn('errorHandler', `ValidationError on ${ctx} — ${messages.join(', ')}`);
    res.status(400).json({ message: messages.join(', ') });
    return;
  }

  logger.error('errorHandler', `Unhandled error on ${ctx} — ${err.message}`, err.stack);
  res.status(500).json({ message: 'Internal server error' });
};
