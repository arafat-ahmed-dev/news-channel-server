import express from 'express';
import { body } from 'express-validator';
import validateRequest from '../middlewares/validateRequest.js';
import { requireAdmin } from '../middlewares/auth.middleware.js';
import {
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategory,
  updateCategoryById,
  deleteCategory,
  deleteCategoryById,
} from '../controllers/category.controllers.js';

const router = express.Router();

router.post(
  '/',
  ...requireAdmin,
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
  '/id/:id',
  ...requireAdmin,
  [
    body('name').optional().notEmpty(),
    body('nameEn').optional().notEmpty(),
    body('slug').optional().notEmpty(),
    validateRequest,
  ],
  updateCategoryById,
);
router.delete('/id/:id', ...requireAdmin, deleteCategoryById);
router.put(
  '/:slug',
  ...requireAdmin,
  [
    body('name').optional().notEmpty(),
    body('nameEn').optional().notEmpty(),
    body('slug').optional().notEmpty(),
    validateRequest,
  ],
  updateCategory,
);
router.delete('/:slug', ...requireAdmin, deleteCategory);

export default router;
