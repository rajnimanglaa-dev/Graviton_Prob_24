import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as admin from '../controllers/adminController.js';

const router = Router();
router.use(authenticate, authorize('administrator'));
router.get('/dashboard', asyncHandler(admin.dashboard));
router.get('/reports', asyncHandler(admin.reports));
router.patch('/reports/:id/verify', asyncHandler(admin.verify));
export default router;
