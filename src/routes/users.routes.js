import { Router } from 'express';
import { requireAdmin } from '../middlewares/auth.middleware.js';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users.controllers.js';

const router = Router();

// All user management routes are admin-only
router.get('/', ...requireAdmin, getAllUsers);
router.get('/:userId', ...requireAdmin, getUserById);
router.post('/', ...requireAdmin, createUser);
router.put('/:userId', ...requireAdmin, updateUser);
router.delete('/:userId', ...requireAdmin, deleteUser);

export default router;
