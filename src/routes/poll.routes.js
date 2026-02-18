import express from 'express';
import { body, param } from 'express-validator';
import validateRequest from '../middlewares/validateRequest.js';
import {
  createPoll,
  getAllPolls,
  getPollById,
  updatePoll,
  votePoll,
  deletePoll,
} from '../controllers/poll.controllers.js';

const router = express.Router();

router.post(
  '/',
  [
    body('question').notEmpty().withMessage('Question is required'),
    body('options')
      .isArray({ min: 2 })
      .withMessage('At least 2 options required'),
    validateRequest,
  ],
  createPoll,
);
router.get('/', getAllPolls);
router.get(
  '/:pollId',
  [
    param('pollId').notEmpty().withMessage('Poll ID is required'),
    validateRequest,
  ],
  getPollById,
);
router.put(
  '/:pollId',
  [
    param('pollId').notEmpty().withMessage('Poll ID is required'),
    validateRequest,
  ],
  updatePoll,
);
router.post(
  '/vote',
  [
    body('pollId').notEmpty().withMessage('Poll ID is required'),
    body('userId').notEmpty().withMessage('User ID is required'),
    body('optionIndex').isInt().withMessage('Option index must be an integer'),
    validateRequest,
  ],
  votePoll,
);
router.delete(
  '/:pollId',
  [
    param('pollId').notEmpty().withMessage('Poll ID is required'),
    validateRequest,
  ],
  deletePoll,
);

export default router;
