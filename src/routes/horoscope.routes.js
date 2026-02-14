import express from 'express';
import { body } from 'express-validator';
import validateRequest from '../middlewares/validateRequest.js';
import {
  createHoroscopeSign,
  getAllHoroscopeSigns,
  getHoroscopeSignBySlug,
  updateHoroscopeSign,
  deleteHoroscopeSign,
} from '../controllers/horoscope.controllers.js';

const router = express.Router();

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('nameEn').notEmpty().withMessage('English name is required'),
    body('slug').notEmpty().withMessage('Slug is required'),
    validateRequest,
  ],
  createHoroscopeSign,
);
router.get('/', getAllHoroscopeSigns);
router.get('/:slug', getHoroscopeSignBySlug);
router.put(
  '/:slug',
  [
    body('name').optional().notEmpty(),
    body('nameEn').optional().notEmpty(),
    body('slug').optional().notEmpty(),
    validateRequest,
  ],
  updateHoroscopeSign,
);
router.delete('/:slug', deleteHoroscopeSign);

export default router;
