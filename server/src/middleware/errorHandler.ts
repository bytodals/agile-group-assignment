import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof MongooseError.CastError) {
    res.status(400).json({ message: `Invalid value for field "${err.path}"` });
    return;
  }
  if (err instanceof MongooseError.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    res.status(400).json({ message: messages.join(', ') });
    return;
  }
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
};
