import { Response } from 'express';

// Standard API response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp?: string;
}

// Success response with proper typing
export function successResponse<T = any>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): Response<ApiResponse<T>> {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
}

// Error response with proper typing
export function errorResponse(
  res: Response,
  message: string = 'Error',
  statusCode: number = 400,
  error?: string
): Response<ApiResponse> {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
    timestamp: new Date().toISOString()
  });
}

// Paginated response
export function paginatedResponse<T = any>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message: string = 'Data retrieved successfully'
): Response<PaginatedResponse<T>> {
  const totalPages = Math.ceil(total / limit);
  
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages
    },
    timestamp: new Date().toISOString()
  });
}

// Validation error response
export function validationErrorResponse(
  res: Response,
  errors: string[]
): Response<ApiResponse> {
  return res.status(422).json({
    success: false,
    message: 'Validation failed',
    error: errors.join(', '),
    timestamp: new Date().toISOString()
  });
}