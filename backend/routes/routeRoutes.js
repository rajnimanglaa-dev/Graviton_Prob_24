import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as routes from '../controllers/routeController.js';

const router = Router();
router.use(authenticate);
router.post('/optimize', authorize('administrator'), asyncHandler(routes.optimize));
router.get('/', authorize('administrator'), asyncHandler(routes.list));
router.get('/:id', authorize('administrator'), asyncHandler(routes.getOne));
export default router;
