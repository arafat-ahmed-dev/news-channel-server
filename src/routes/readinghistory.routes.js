import express from 'express';
import { body, param } from 'express-validator';
import validateRequest from '../middlewares/validateRequest.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import {
  addReadingHistory,
  getReadingHistoryByUser,
  deleteReadingHistory,
} from '../controllers/readinghistory.controllers.js';

const router = express.Router();

router.post(
  '/',
  verifyToken,
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('slug').notEmpty().withMessage('Slug is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('timestamp').notEmpty().withMessage('Timestamp is required'),
    validateRequest,
  ],
  addReadingHistory,
);
router.get('/user/:userId', verifyToken, getReadingHistoryByUser);
router.delete(
  '/:id',
  verifyToken,
  [
    param('id').notEmpty().withMessage('History ID is required'),
    validateRequest,
  ],
  deleteReadingHistory,
);

export default router;
