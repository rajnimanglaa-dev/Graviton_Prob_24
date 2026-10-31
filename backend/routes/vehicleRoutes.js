import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as vehicles from '../controllers/vehicleController.js';

const router = Router();
router.use(authenticate);
router.get('/', asyncHandler(vehicles.list));
router.post('/', authorize('administrator'), validate(vehicles.vehicleSchema), asyncHandler(vehicles.create));
export default router;
