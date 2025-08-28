import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { errorResponse } from './response';

export function validateRequest(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors.map(err => err.message).join(', ');
        return errorResponse(res, `Validation error: ${errorMessage}`, 400);
      }
      return errorResponse(res, 'Internal server error', 500);
    }
  };
}

export function validatePagination(req: Request, res: Response, next: NextFunction): void {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  if (page < 1 || limit < 1 || limit > 100) {
    errorResponse(res, 'Invalid pagination parameters', 400);
    return;
  }
  
  req.query.page = page.toString();
  req.query.limit = limit.toString();
  
  next();
}
