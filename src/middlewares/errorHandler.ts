import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

// Global error handler middleware
export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Global error:', err);

  // Handle specific error types
  if (err.name === 'ValidationError') {
    errorResponse(res, 'Validation failed', 400, err.message);
    return;
  }

  if (err.name === 'UnauthorizedError') {
    errorResponse(res, 'Unauthorized access', 401, err.message);
    return;
  }

  if (err.code === '23505') { // PostgreSQL unique constraint violation
    errorResponse(res, 'Duplicate entry found', 409, 'Resource already exists');
    return;
  }

  if (err.code === '23503') { // PostgreSQL foreign key constraint violation
    errorResponse(res, 'Referenced resource not found', 400, 'Invalid reference');
    return;
  }

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message || 'Something went wrong';

  errorResponse(res, message, statusCode);
}

// 404 handler for undefined routes
export function notFoundHandler(req: Request, res: Response): void {
  errorResponse(res, `Route ${req.originalUrl} not found`, 404);
}

// Rate limiting error handler
export function rateLimitHandler(req: Request, res: Response): void {
  errorResponse(res, 'Too many requests. Please try again later.', 429);
}
