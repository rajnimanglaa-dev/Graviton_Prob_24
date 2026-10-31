import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as notifications from '../controllers/notificationController.js';

const router = Router();
router.use(authenticate);
router.get('/', asyncHandler(notifications.list));
router.patch('/:id/read', asyncHandler(notifications.markRead));
export default router;
