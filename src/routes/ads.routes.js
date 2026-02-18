import { Router } from 'express';
import {
  getAllAds,
  getAdById,
  createAd,
  updateAd,
  deleteAd,
} from '../controllers/ads.controllers.js';

const router = Router();

// Public routes
router.get('/', getAllAds);
router.get('/:adId', getAdById);
router.post('/', createAd);
router.put('/:adId', updateAd);
router.delete('/:adId', deleteAd);

export default router;
