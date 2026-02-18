import { Router } from 'express';
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

// Public routes
router.get('/', getAnalyticsByRange);
router.get('/latest', getLatestAnalytics);
router.get('/range', getAnalyticsByDateRange);
router.post('/', createAnalytics);
router.put('/:analyticsId', updateAnalytics);
router.delete('/:analyticsId', deleteAnalytics);

export default router;
