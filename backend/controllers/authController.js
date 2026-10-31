import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env.js';
import { createUser, findUserByEmail } from '../models/repositories.js';
import { ApiError } from '../utils/ApiError.js';
import { id, publicId } from '../utils/ids.js';

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  password: z.string().min(10).max(128).regex(/[a-z]/, 'Password needs a lowercase character.').regex(/[A-Z]/, 'Password needs an uppercase character.').regex(/[0-9]/, 'Password needs a number.'),
  phoneNumber: z.string().trim().regex(/^[6-9][0-9]{9}$/).optional(),
  ward: z.string().trim().min(2).max(120).optional()
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128)
});

function publicUser(user) {
  return {
    id: user.id, publicId: user.publicId, name: user.name, email: user.email, phoneNumber: user.phoneNumber,
    role: user.role, ward: user.ward, avatarUrl: user.avatarUrl, points: user.points, assignedTruckId: user.assignedTruckId
  };
}

function setSession(response, user) {
  const token = jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn, issuer: 'fixmyarea', audience: 'fixmyarea-web' });
  response.cookie('access_token', token, {
    httpOnly: true, secure: env.cookieSecure, sameSite: 'lax', maxAge: 8 * 60 * 60 * 1000, path: '/'
  });
}

export async function register(request, response) {
  const existing = await findUserByEmail(request.body.email);
  if (existing) throw new ApiError(409, 'An account with this email already exists.', 'EMAIL_ALREADY_EXISTS');
  const passwordHash = await bcrypt.hash(request.body.password, 12);
  const user = await createUser({
    id: id(), publicId: publicId('CIT'), name: request.body.name, email: request.body.email,
    passwordHash, phoneNumber: request.body.phoneNumber, ward: request.body.ward, role: 'citizen'
  });
  setSession(response, user);
  response.status(201).json({ success: true, user: publicUser(user) });
}

export async function login(request, response) {
  const row = await findUserByEmail(request.body.email);
  const valid = row && await bcrypt.compare(request.body.password, row.password_hash);
  if (!valid || !row.is_active) throw new ApiError(401, 'Invalid email or password.', 'INVALID_CREDENTIALS');
  const user = {
    id: row.id, publicId: row.public_id, name: row.full_name, email: row.email, phoneNumber: row.phone_number,
    role: row.role, ward: row.ward, avatarUrl: row.avatar_url, points: Number(row.points || 0)
  };
  setSession(response, user);
  response.json({ success: true, user: publicUser(user) });
}

export async function me(request, response) {
  response.json({ success: true, user: publicUser(request.user) });
}

export async function logout(request, response) {
  response.clearCookie('access_token', { httpOnly: true, secure: env.cookieSecure, sameSite: 'lax', path: '/' });
  response.status(204).send();
}
