import { Request, Response } from 'express';
import { User } from '../models/user';
import { findById, findByEmail, createUser, updateUser, deleteUser, getAllUsers } from '../database/userRepository';
import { successResponse, errorResponse } from '../utils/response';

// Interface for authenticated request
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Get current user profile
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      errorResponse(res, 'User not authenticated', 401);
      return;
    }

    const user: User | null = await findById(req.user.id);
    if (!user) {
      errorResponse(res, 'User not found', 404);
      return;
    }

    successResponse(res, user, 'User profile retrieved successfully');
  } catch (error: any) {
    console.error('Error getting current user:', error);
    errorResponse(res, 'Internal server error', 500);
  }
};

// Get user by ID (Admin only)
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: number = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      errorResponse(res, 'Invalid user ID', 400);
      return;
    }

    const user: User | null = await findById(userId);
    if (!user) {
      errorResponse(res, 'User not found', 404);
      return;
    }

    successResponse(res, user, 'User retrieved successfully');
  } catch (error: any) {
    console.error('Error getting user by ID:', error);
    errorResponse(res, 'Internal server error', 500);
  }
};

// Get all users (Admin only)
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const offset: number = (page - 1) * limit;

    const users: User[] = await getAllUsers(limit, offset);
    
    successResponse(res, {
      users,
      pagination: {
        page,
        limit,
        total: users.length
      }
    }, 'Users retrieved successfully');
  } catch (error: any) {
    console.error('Error getting users:', error);
    errorResponse(res, 'Internal server error', 500);
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      errorResponse(res, 'User not authenticated', 401);
      return;
    }

    const { name, email } = req.body;
    
    // Validate input
    if (!name || !email) {
      errorResponse(res, 'Name and email are required', 400);
      return;
    }

    // Check if email is already taken by another user
    const existingUser: User | null = await findByEmail(email);
    if (existingUser && existingUser.id !== req.user.id) {
      errorResponse(res, 'Email already in use', 409);
      return;
    }

    const updatedUser: User = await updateUser(req.user.id, { name, email });
    successResponse(res, updatedUser, 'Profile updated successfully');
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    errorResponse(res, 'Internal server error', 500);
  }
};

// Delete user account
export const deleteUserAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      errorResponse(res, 'User not authenticated', 401);
      return;
    }

    await deleteUser(req.user.id);
    
    // Destroy session after account deletion
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
    });

    successResponse(res, null, 'Account deleted successfully');
  } catch (error: any) {
    console.error('Error deleting user account:', error);
    errorResponse(res, 'Internal server error', 500);
  }
};

// Admin: Delete user by ID
export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: number = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      errorResponse(res, 'Invalid user ID', 400);
      return;
    }

    const user: User | null = await findById(userId);
    if (!user) {
      errorResponse(res, 'User not found', 404);
      return;
    }

    await deleteUser(userId);
    successResponse(res, null, 'User deleted successfully');
  } catch (error: any) {
    console.error('Error deleting user:', error);
    errorResponse(res, 'Internal server error', 500);
  }
};