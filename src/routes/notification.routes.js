import express from 'express';
import { body, param } from 'express-validator';
import validateRequest from '../middlewares/validateRequest.js';
import { verifyToken, requireAdmin } from '../middlewares/auth.middleware.js';
import {
  createNotification,
  getNotificationsByUser,
  markNotificationRead,
  deleteNotification,
} from '../controllers/notification.controllers.js';

const router = express.Router();

router.post(
  '/',
  ...requireAdmin,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('message').notEmpty().withMessage('Message is required'),
    body('timestamp').notEmpty().withMessage('Timestamp is required'),
    body('type').notEmpty().withMessage('Type is required'),
    body('userId').notEmpty().withMessage('User ID is required'),
    validateRequest,
  ],
  createNotification,
);
router.get('/user/:userId', verifyToken, getNotificationsByUser);
router.patch(
  '/:id/read',
  verifyToken,
  [
    param('id').notEmpty().withMessage('Notification ID is required'),
    validateRequest,
  ],
  markNotificationRead,
);
router.delete(
  '/:id',
  ...requireAdmin,
  [
    param('id').notEmpty().withMessage('Notification ID is required'),
    validateRequest,
  ],
  deleteNotification,
);

export default router;
