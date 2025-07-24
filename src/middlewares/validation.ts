import { Request, Response, NextFunction } from 'express';
import { validationErrorResponse } from '../utils/response';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate update profile request
export function validateUpdateProfile(req: Request, res: Response, next: NextFunction): void {
  const { name, email } = req.body;
  const errors: string[] = [];

  // Validate name
  if (!name || typeof name !== 'string') {
    errors.push('Name is required and must be a string');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  } else if (name.trim().length > 100) {
    errors.push('Name must be less than 100 characters');
  }

  // Validate email
  if (!email || typeof email !== 'string') {
    errors.push('Email is required and must be a string');
  } else if (!emailRegex.test(email)) {
    errors.push('Please provide a valid email address');
  } else if (email.length > 255) {
    errors.push('Email must be less than 255 characters');
  }

  if (errors.length > 0) {
    validationErrorResponse(res, errors);
    return;
  }

  // Sanitize input
  req.body.name = name.trim();
  req.body.email = email.toLowerCase().trim();

  next();
}

// Validate pagination parameters
export function validatePagination(req: Request, res: Response, next: NextFunction): void {
  const errors: string[] = [];
  
  if (req.query.page) {
    const page = parseInt(req.query.page as string);
    if (isNaN(page) || page < 1) {
      errors.push('Page must be a positive integer');
    }
  }

  if (req.query.limit) {
    const limit = parseInt(req.query.limit as string);
    if (isNaN(limit) || limit < 1 || limit > 100) {
      errors.push('Limit must be a positive integer between 1 and 100');
    }
  }

  if (errors.length > 0) {
    validationErrorResponse(res, errors);
    return;
  }

  next();
}

// Validate user ID parameter
export function validateUserId(req: Request, res: Response, next: NextFunction): void {
  const userId = parseInt(req.params.id);
  
  if (isNaN(userId) || userId < 1) {
    validationErrorResponse(res, ['Invalid user ID']);
    return;
  }

  next();
}
