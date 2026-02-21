import { Router } from 'express';
import { requireAdmin } from '../middlewares/auth.middleware.js';
import {
  getSettings,
  updateSettings,
  resetSettings,
} from '../controllers/settings.controllers.js';

const router = Router();

// Public routes (read-only)
router.get('/', getSettings);

// Protected routes (admin only)
router.put('/', ...requireAdmin, updateSettings);
router.post('/reset', ...requireAdmin, resetSettings);

export default router;
