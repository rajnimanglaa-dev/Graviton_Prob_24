import { createNotification } from '../models/repositories.js';
import { id } from '../utils/ids.js';
import { emitNotification } from './socketService.js';

export async function notify(data, connection) {
  const notification = {
    id: id(),
    userId: data.userId || null,
    targetRole: data.targetRole || 'all',
    type: data.type,
    title: data.title,
    message: data.message,
    entityType: data.entityType || null,
    entityId: data.entityId || null,
    createdAt: new Date().toISOString(),
    read: false
  };
  await createNotification(notification, connection);
  emitNotification(notification);
  return notification;
}
