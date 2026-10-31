import multer from 'multer';
import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';

export function notFoundHandler(request, response) {
  response.status(404).json({ success: false, code: 'NOT_FOUND', message: 'API endpoint not found.' });
}

export function errorHandler(error, request, response) {
  let status = error.status || 500;
  let code = error.code || 'INTERNAL_ERROR';
  let message = error.message || 'An unexpected server error occurred.';
  let details = error.details;

  if (error instanceof ZodError) {
    status = 422;
    code = 'VALIDATION_ERROR';
    message = 'One or more fields are invalid.';
    details = error.flatten();
  } else if (error instanceof multer.MulterError) {
    status = 422;
    code = 'UPLOAD_ERROR';
    message = error.code === 'LIMIT_FILE_SIZE' ? 'Image must be 5 MB or smaller.' : error.message;
  }

  if (status >= 500) {
    logger.error('request_failed', { method: request.method, path: request.originalUrl, code, message });
  }

  response.status(status).json({
    success: false,
    code,
    message,
    ...(details ? { details } : {})
  });
}
