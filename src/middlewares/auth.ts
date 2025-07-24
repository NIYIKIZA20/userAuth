import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';
import { User } from '../models/user';

// Extended Request interface for authenticated requests
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Middleware to ensure user is authenticated
export function ensureAuthenticated(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated && req.isAuthenticated() && req.user) {
    return next();
  }
  errorResponse(res, 'Authentication required. Please log in.', 401);
}

// Middleware to ensure user is admin (optional for future use)
export function ensureAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
    errorResponse(res, 'Authentication required', 401);
    return;
  }

  // Add admin check logic here if you have admin roles
  // For now, we'll just pass through
  next();
}

// Middleware to check if user owns the resource or is admin
export function ensureOwnershipOrAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
    errorResponse(res, 'Authentication required', 401);
    return;
  }

  const userId: number = parseInt(req.params.id);
  
  if (isNaN(userId)) {
    errorResponse(res, 'Invalid user ID', 400);
    return;
  }

  // Allow if user is accessing their own data
  if (req.user && req.user.id === userId) {
    return next();
  }

  // Add admin check here if needed
  // For now, deny access
  errorResponse(res, 'Access denied. You can only access your own data.', 403);
}