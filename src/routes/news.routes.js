import express from 'express';
import { body } from 'express-validator';
import validateRequest from '../middlewares/validateRequest.js';
import upload from '../middlewares/uploadImage.js';
import {
  createNews,
  getAllNews,
  getNewsBySlug,
  updateNews,
  deleteNews,
} from '../controllers/news.controllers.js';

const router = express.Router();

router.post(
  '/',
  upload.single('image'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('excerpt').notEmpty().withMessage('Excerpt is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('categorySlug').notEmpty().withMessage('Category slug is required'),
    body('author').notEmpty().withMessage('Author is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('slug').notEmpty().withMessage('Slug is required'),
    validateRequest,
  ],
  createNews,
);
router.get('/', getAllNews);
router.get('/:slug', getNewsBySlug);
router.put(
  '/:slug',
  [
    body('title').optional().notEmpty(),
    body('excerpt').optional().notEmpty(),
    body('category').optional().notEmpty(),
    body('categorySlug').optional().notEmpty(),
    body('author').optional().notEmpty(),
    body('date').optional().notEmpty(),
    body('slug').optional().notEmpty(),
    validateRequest,
  ],
  updateNews,
);
router.delete('/:slug', deleteNews);

export default router;
