import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import { env } from '../config/env.js';
import { findUserById } from '../models/repositories.js';
import { logger } from '../utils/logger.js';

let io;

export function attachSocketServer(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: env.frontendOrigin, credentials: true }
  });
  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie || '';
      const cookie = cookieHeader.split(';').map((item) => item.trim()).find((item) => item.startsWith('access_token='));
      const bearer = socket.handshake.auth?.token;
      const token = bearer || (cookie ? decodeURIComponent(cookie.slice('access_token='.length)) : null);
      if (!token) throw new Error('Missing authentication token');
      const payload = jwt.verify(token, env.jwtSecret);
      const user = await findUserById(payload.sub);
      if (!user || !user.isActive) throw new Error('Account unavailable');
      socket.user = user;
      next();
    } catch {
      next(new Error('Unauthorized socket connection'));
    }
  });
  io.on('connection', (socket) => {
    socket.join('user:' + socket.user.id);
    socket.join('role:' + socket.user.role);
    logger.info('socket_connected', { userId: socket.user.id, role: socket.user.role });
  });
  return io;
}

export function emitNotification(notification) {
  if (!io) return;
  if (notification.userId) io.to('user:' + notification.userId).emit('notification:new', notification);
  else if (notification.targetRole === 'all') io.emit('notification:new', notification);
  else io.to('role:' + notification.targetRole).emit('notification:new', notification);
}

export function emitReportChanged(report) {
  if (!io) return;
  io.to('role:administrator').emit('report:changed', report);
  if (report.citizenId) io.to('user:' + report.citizenId).emit('report:changed', report);
  if (report.assignedVehicleId) io.emit('report:changed', report);
}
