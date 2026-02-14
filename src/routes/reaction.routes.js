import express from 'express';
import { body, param } from 'express-validator';
import validateRequest from '../middlewares/validateRequest.js';
import {
  createReaction,
  getReactionsByArticle,
  deleteReaction,
} from '../controllers/reaction.controllers.js';

const router = express.Router();

router.post(
  '/',
  [
    body('articleId').notEmpty().withMessage('Article ID is required'),
    body('type').notEmpty().withMessage('Reaction type is required'),
    validateRequest,
  ],
  createReaction,
);
router.get('/article/:articleId', getReactionsByArticle);
router.delete(
  '/',
  [
    body('articleId').notEmpty().withMessage('Article ID is required'),
    body('userId').notEmpty().withMessage('User ID is required'),
    validateRequest,
  ],
  deleteReaction,
);

export default router;
