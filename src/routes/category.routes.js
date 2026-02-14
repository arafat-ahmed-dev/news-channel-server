import express from 'express';
import { body } from 'express-validator';
import validateRequest from '../middlewares/validateRequest.js';
import {
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controllers.js';

const router = express.Router();

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('nameEn').notEmpty().withMessage('English name is required'),
    body('slug').notEmpty().withMessage('Slug is required'),
    validateRequest,
  ],
  createCategory,
);
router.get('/', getAllCategories);
router.get('/:slug', getCategoryBySlug);
router.put(
  '/:slug',
  [
    body('name').optional().notEmpty(),
    body('nameEn').optional().notEmpty(),
    body('slug').optional().notEmpty(),
    validateRequest,
  ],
  updateCategory,
);
router.delete('/:slug', deleteCategory);

export default router;
