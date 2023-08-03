import { ApiError } from '../exceptions/exception';
import { Request, Response, NextFunction } from 'express';

export default function (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err);
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }

  return res.status(500).json({ message: 'Unknown error on server side' });
}
