import { Router } from 'express';
import upload from '../middlewares/uploadImage.js';
import { requireAdmin } from '../middlewares/auth.middleware.js';
import {
  getAllMedia,
  getMediaById,
  uploadMediaFile,
  createMedia,
  updateMedia,
  deleteMedia,
} from '../controllers/media.controllers.js';

const router = Router();

// Public routes (read-only)
router.get('/', getAllMedia);
router.get('/:mediaId', getMediaById);

// Protected routes (admin only)
router.post('/', ...requireAdmin, upload.single('file'), uploadMediaFile);
router.put('/:mediaId', ...requireAdmin, updateMedia);
router.delete('/:mediaId', ...requireAdmin, deleteMedia);

export default router;
