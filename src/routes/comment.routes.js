import express from 'express';
import { body, param } from 'express-validator';
import validateRequest from '../middlewares/validateRequest.js';
import {
  createComment,
  getCommentsByArticle,
  updateCommentStatus,
  deleteComment,
} from '../controllers/comment.controllers.js';

const router = express.Router();

router.post(
  '/',
  [
    body('articleId').notEmpty().withMessage('Article ID is required'),
    body('author').notEmpty().withMessage('Author is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('timestamp').notEmpty().withMessage('Timestamp is required'),
    validateRequest,
  ],
  createComment,
);
router.get('/article/:articleId', getCommentsByArticle);
router.put(
  '/:id/status',
  [
    param('id').notEmpty().withMessage('Comment ID is required'),
    body('status').notEmpty().withMessage('Status is required'),
    validateRequest,
  ],
  updateCommentStatus,
);
router.delete(
  '/:id',
  [
    param('id').notEmpty().withMessage('Comment ID is required'),
    validateRequest,
  ],
  deleteComment,
);

export default router;
