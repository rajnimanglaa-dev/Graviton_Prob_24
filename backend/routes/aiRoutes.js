import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as ai from '../controllers/aiController.js';

const router = Router();
router.use(authenticate);
router.post('/analyze/:reportId', asyncHandler(ai.analyze));
router.get('/analysis/:reportId', asyncHandler(ai.getAnalysis));
export default router;
