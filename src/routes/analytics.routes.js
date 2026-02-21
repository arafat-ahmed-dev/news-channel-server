import { Router } from 'express';
import { requireAdmin } from '../middlewares/auth.middleware.js';
import {
  getAllAnalytics,
  getAnalyticsByDateRange,
  getLatestAnalytics,
  getAnalyticsByRange,
  createAnalytics,
  updateAnalytics,
  deleteAnalytics,
} from '../controllers/analytics.controllers.js';

const router = Router();

// Protected routes (admin only — analytics is sensitive data)
router.get('/', ...requireAdmin, getAnalyticsByRange);
router.get('/latest', ...requireAdmin, getLatestAnalytics);
router.get('/range', ...requireAdmin, getAnalyticsByDateRange);
router.post('/', ...requireAdmin, createAnalytics);
router.put('/:analyticsId', ...requireAdmin, updateAnalytics);
router.delete('/:analyticsId', ...requireAdmin, deleteAnalytics);

export default router;
