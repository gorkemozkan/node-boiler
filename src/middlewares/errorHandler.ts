import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { errorResponse } from '../utils/response';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function errorHandler(
  error: AppError | ZodError | Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  _next: NextFunction
) {
  console.error('Error:', error);

  if (error instanceof ZodError) {
    const errorMessage = error.errors.map(err => err.message).join(', ');
    return errorResponse(res, `Validation error: ${errorMessage}`, 400);
  }

  // Custom app errors
  if ((error as AppError).statusCode) {
    return errorResponse(res, error.message, (error as AppError).statusCode);
  }

  // Default error
  return errorResponse(res, 'Internal server error', 500);
}

export function notFoundHandler(req: Request, res: Response) {
  return errorResponse(res, `Route ${req.originalUrl} not found`, 404);
}
