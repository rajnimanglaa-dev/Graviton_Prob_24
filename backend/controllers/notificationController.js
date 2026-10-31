import { listNotificationsForUser, markNotificationRead } from '../models/repositories.js';
import { ApiError } from '../utils/ApiError.js';

export async function list(request, response) {
  response.json({ success: true, notifications: await listNotificationsForUser(request.user) });
}

export async function markRead(request, response) {
  const updated = await markNotificationRead(request.params.id, request.user.id);
  if (!updated) throw new ApiError(404, 'Notification not found.', 'NOTIFICATION_NOT_FOUND');
  response.json({ success: true });
}
