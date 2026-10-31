import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authRateLimit } from '../middleware/rateLimit.js';
import { validate } from '../middleware/validate.js';
import * as auth from '../controllers/authController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.post('/register', authRateLimit, validate(auth.registerSchema), asyncHandler(auth.register));
router.post('/login', authRateLimit, validate(auth.loginSchema), asyncHandler(auth.login));
router.get('/me', authenticate, asyncHandler(auth.me));
router.post('/logout', authenticate, asyncHandler(auth.logout));
export default router;
