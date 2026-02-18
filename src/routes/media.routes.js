import { Router } from 'express';
import {
  getAllMedia,
  getMediaById,
  createMedia,
  updateMedia,
  deleteMedia,
} from '../controllers/media.controllers.js';

const router = Router();

// Public routes
router.get('/', getAllMedia);
router.get('/:mediaId', getMediaById);
router.post('/', createMedia);
router.put('/:mediaId', updateMedia);
router.delete('/:mediaId', deleteMedia);

export default router;
