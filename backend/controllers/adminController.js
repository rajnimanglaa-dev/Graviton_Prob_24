import { z } from 'zod';
import { withTransaction } from '../config/db.js';
import { findReportRowByPublicId, listReports, updateReport } from '../models/repositories.js';
import { ApiError } from '../utils/ApiError.js';
import { id } from '../utils/ids.js';
import { notify } from '../services/notificationService.js';
import { emitReportChanged } from '../services/socketService.js';

const verifySchema = z.object({
  action: z.enum(['verify', 'reject']),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  category: z.string().trim().min(2).max(80).optional(),
  severity: z.enum(['small', 'medium', 'large']).optional(),
  estimatedWeightKg: z.coerce.number().positive().max(100000).optional(),
  latitude: z.coerce.number().gte(-90).lte(90).optional(),
  longitude: z.coerce.number().gte(-180).lte(180).optional(),
  reason: z.string().trim().min(3).max(500).optional()
}).superRefine((value, context) => {
  if ((value.latitude === undefined) !== (value.longitude === undefined)) context.addIssue({ code: 'custom', message: 'Latitude and longitude must be supplied together.' });
  if (value.action === 'reject' && !value.reason) context.addIssue({ code: 'custom', message: 'A rejection reason is required.', path: ['reason'] });
});

export async function dashboard(request, response) {
  const reports = await listReports({ limit: 200 });
  const count = (predicate) => reports.filter(predicate).length;
  const categories = {};
  const statuses = {};
  for (const report of reports) {
    categories[report.category] = (categories[report.category] || 0) + 1;
    statuses[report.workflowStatus] = (statuses[report.workflowStatus] || 0) + 1;
  }
  response.json({
    success: true,
    stats: {
      totalReports: reports.length,
      pendingReports: count((report) => report.workflowStatus === 'pending_verification'),
      highPriorityReports: count((report) => ['high', 'critical'].includes(report.priority) && report.workflowStatus !== 'resolved'),
      resolvedReports: count((report) => report.workflowStatus === 'resolved'),
      categoryDistribution: categories, statusDistribution: statuses
    }
  });
}

export async function reports(request, response) {
  const result = await listReports({
    source: request.query.source, status: request.query.status === 'pending' ? 'pending_verification' : request.query.status,
    priority: request.query.priority, search: request.query.search && String(request.query.search).slice(0, 120),
    limit: Math.min(Number(request.query.limit) || 100, 200)
  });
  response.json({ success: true, reports: result });
}

export async function verify(request, response) {
  const body = verifySchema.parse(request.body);
  const row = await findReportRowByPublicId(request.params.id);
  if (!row) throw new ApiError(404, 'Report not found.', 'REPORT_NOT_FOUND');
  const nextStatus = body.action === 'verify' ? 'verified' : 'rejected';
  const changes = {
    status: nextStatus,
    verified_by_user_id: request.user.id,
    verified_at: new Date(),
    rejection_reason: body.action === 'reject' ? body.reason : null
  };
  if (body.priority) changes.priority = body.priority;
  if (body.category) changes.category = body.category;
  if (body.severity) changes.severity = body.severity;
  if (body.estimatedWeightKg) changes.estimated_weight_kg = body.estimatedWeightKg;
  if (body.latitude !== undefined) { changes.latitude = body.latitude; changes.longitude = body.longitude; }

  const report = await withTransaction(async (connection) => {
    const updated = await updateReport({
      id: row.id, publicId: row.public_id, changes,
      history: { id: id(), previousStatus: row.status, newStatus: nextStatus, note: body.action === 'verify' ? 'Report verified by an administrator.' : 'Report rejected: ' + body.reason, userId: request.user.id }
    }, connection);
    if (updated.citizenId) await notify({
      userId: updated.citizenId, type: body.action === 'verify' ? 'report_approved' : 'report_rejected',
      title: body.action === 'verify' ? 'Report approved' : 'Report rejected',
      message: updated.id + (body.action === 'verify' ? ' has been verified and is ready for dispatch.' : ' was rejected: ' + body.reason),
      entityType: 'report', entityId: updated.databaseId
    }, connection);
    return updated;
  });
  emitReportChanged(report);
  response.json({ success: true, report });
}
