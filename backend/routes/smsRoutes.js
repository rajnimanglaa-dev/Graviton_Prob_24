import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { smsRateLimit } from '../middleware/rateLimit.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { incomingSmsSchema, incoming, history, getOne } from '../controllers/smsController.js';

const router = Router();
router.post('/incoming', smsRateLimit, validate(incomingSmsSchema), asyncHandler(incoming));
router.post('/provider-webhook', smsRateLimit, (request, response, next) => { request.headers['x-sms-source'] = 'provider'; next(); }, validate(incomingSmsSchema), asyncHandler(incoming));
router.get('/history', authenticate, authorize('administrator'), asyncHandler(history));
router.get('/:id', authenticate, authorize('administrator'), asyncHandler(getOne));
export default router;
