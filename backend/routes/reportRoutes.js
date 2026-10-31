import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as reports from '../controllers/reportController.js';

const router = Router();
router.use(authenticate);
router.post('/', uploadImage.single('image'), validate(reports.createReportSchema), asyncHandler(reports.create));
router.get('/', asyncHandler(reports.list));
router.get('/my-reports', asyncHandler(reports.mine));
router.get('/:id', asyncHandler(reports.getOne));
router.patch('/:id/status', validate(reports.updateStatusSchema), asyncHandler(reports.updateStatus));
router.patch('/:id/assign', authorize('administrator'), asyncHandler(reports.assignVehicle));
export default router;
