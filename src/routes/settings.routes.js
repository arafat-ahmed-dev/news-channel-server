import { Router } from 'express';
import {
  getSettings,
  updateSettings,
  resetSettings,
} from '../controllers/settings.controllers.js';

const router = Router();

// Public routes
router.get('/', getSettings);
router.put('/', updateSettings);
router.post('/reset', resetSettings);

export default router;
