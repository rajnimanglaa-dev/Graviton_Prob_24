import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter(request, file, callback) {
    if (!allowed.has(file.mimetype)) {
      callback(new ApiError(422, 'Only JPEG, PNG, and WEBP images are accepted.', 'INVALID_IMAGE_TYPE'));
      return;
    }
    callback(null, true);
  }
});
