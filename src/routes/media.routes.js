import { Router } from 'express';
import upload from '../middlewares/uploadImage.js';
import {
  getAllMedia,
  getMediaById,
  uploadMediaFile,
  createMedia,
  updateMedia,
  deleteMedia,
} from '../controllers/media.controllers.js';

const router = Router();

router.get('/', getAllMedia);
router.get('/:mediaId', getMediaById);
router.post('/', upload.single('file'), uploadMediaFile);
router.put('/:mediaId', updateMedia);
router.delete('/:mediaId', deleteMedia);

export default router;
