import { Router } from 'express';
import { requireAdmin } from '../middlewares/auth.middleware.js';
import {
  getAllAds,
  getAdById,
  createAd,
  updateAd,
  deleteAd,
} from '../controllers/ads.controllers.js';

const router = Router();

// Public routes (read-only)
router.get('/', getAllAds);
router.get('/:adId', getAdById);

// Protected routes (admin only)
router.post('/', ...requireAdmin, createAd);
router.put('/:adId', ...requireAdmin, updateAd);
router.delete('/:adId', ...requireAdmin, deleteAd);

export default router;
