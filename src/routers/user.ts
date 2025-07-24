import { Router } from 'express';
import {
  getCurrentUser,
  getUserById,
  getUsers,
  updateUserProfile,
  deleteUserAccount,
  deleteUserById
} from '../controller/userController';
import { 
  ensureAuthenticated, 
  ensureAdmin, 
  ensureOwnershipOrAdmin 
} from '../middlewares/auth';
import { validateUpdateProfile } from '../middlewares/validation';

const router = Router();

// Get current user profile (authenticated users only)
router.get('/profile', ensureAuthenticated, getCurrentUser);

// Update current user profile (authenticated users only)
router.put('/profile', ensureAuthenticated, validateUpdateProfile, updateUserProfile);

// Delete current user account (authenticated users only)
router.delete('/profile', ensureAuthenticated, deleteUserAccount);

// Admin routes (require admin privileges)
router.get('/', ensureAuthenticated, ensureAdmin, getUsers);
router.get('/:id', ensureAuthenticated, ensureOwnershipOrAdmin, getUserById);
router.delete('/:id', ensureAuthenticated, ensureAdmin, deleteUserById);

export default router;
