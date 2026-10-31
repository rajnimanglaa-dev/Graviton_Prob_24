import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { findUserById } from '../models/repositories.js';

function tokenFrom(request) {
  const header = request.headers.authorization;
  if (header && header.startsWith('Bearer ')) return header.slice(7);
  return request.cookies?.access_token || null;
}

export const authenticate = asyncHandler(async (request, response, next) => {
  const token = tokenFrom(request);
  if (!token) throw new ApiError(401, 'Authentication is required.', 'AUTH_REQUIRED');

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch (error) {
    throw new ApiError(401, error.name === 'TokenExpiredError' ? 'Your session has expired.' : 'Invalid authentication token.', 'INVALID_TOKEN');
  }

  const user = await findUserById(payload.sub);
  if (!user || !user.isActive) throw new ApiError(401, 'This user account is unavailable.', 'ACCOUNT_UNAVAILABLE');
  request.user = user;
  next();
});

export function authorize(...roles) {
  return (request, response, next) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action.', 'FORBIDDEN'));
    }
    return next();
  };
}
