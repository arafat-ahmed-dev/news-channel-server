import { Router } from 'express';
import {
  register,
  login,
  refreshAccessToken,
} from '../controllers/auth.controllers.js';
const router = Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/refresh-token').post(refreshAccessToken);

export default router;
