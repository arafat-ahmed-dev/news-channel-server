import express from 'express';
import { body } from 'express-validator';
import validateRequest from '../middlewares/validateRequest.js';
import upload from '../middlewares/uploadImage.js';
import { requireEditor } from '../middlewares/auth.middleware.js';
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
  ...requireEditor,
  upload.single('image'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('excerpt').notEmpty().withMessage('Excerpt is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('categorySlug').notEmpty().withMessage('Category slug is required'),
    body('author').notEmpty().withMessage('Author is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('slug').notEmpty().withMessage('Slug is required'),
    body('status').optional().isIn(['draft', 'published']),
    body('tags')
      .optional()
      .customSanitizer((value) => {
        if (typeof value === 'string')
          return value
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);
        return value;
      })
      .isArray(),
    body('featured').optional().isBoolean(),
    validateRequest,
  ],
  createNews,
);
router.get('/', getAllNews);
router.get('/:slug', getNewsBySlug);
router.put(
  '/:slug',
  ...requireEditor,
  upload.single('image'),
  [
    body('title').optional().notEmpty(),
    body('excerpt').optional().notEmpty(),
    body('category').optional().notEmpty(),
    body('categorySlug').optional().notEmpty(),
    body('author').optional().notEmpty(),
    body('date').optional().notEmpty(),
    body('slug').optional().notEmpty(),
    body('status').optional().isIn(['draft', 'published', 'scheduled']),
    body('tags')
      .optional()
      .customSanitizer((value) => {
        if (typeof value === 'string')
          return value
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);
        return value;
      })
      .isArray(),
    body('featured')
      .optional()
      .customSanitizer((value) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
      })
      .isBoolean(),
    validateRequest,
  ],
  updateNews,
);
router.delete('/:slug', ...requireEditor, deleteNews);

export default router;
