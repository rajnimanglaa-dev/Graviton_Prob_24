import { z } from 'zod';
import { withTransaction } from '../config/db.js';
import { createReport, findReportByIdempotencyKey, findReportByPublicId, findReportRowByPublicId, listReports, updateReport } from '../models/repositories.js';
import { ApiError } from '../utils/ApiError.js';
import { id, publicId } from '../utils/ids.js';
import { storeReportImage } from '../services/storageService.js';
import { analyzeReport } from '../services/grokService.js';
import { notify } from '../services/notificationService.js';
import { emitReportChanged } from '../services/socketService.js';

const categories = ['plastic', 'organic', 'construction', 'mixed', 'electronic', 'hazardous', 'unclassified'];
const statuses = ['pending_verification', 'verified', 'rejected', 'assigned', 'on_the_way', 'arrived', 'collected', 'resolved'];

export const createReportSchema = z.object({
  title: z.string().trim().min(3).max(240).optional(),
  description: z.string().trim().max(4000).optional(),
  locationLabel: z.string().trim().min(3).max(500),
  ward: z.string().trim().max(120).optional(),
  latitude: z.coerce.number().gte(-90).lte(90).optional(),
  longitude: z.coerce.number().gte(-180).lte(180).optional(),
  category: z.enum(categories).optional(),
  idempotencyKey: z.string().trim().min(8).max(128).regex(/^[A-Za-z0-9_-]+$/).optional()
});

export const updateStatusSchema = z.object({
  status: z.enum(['pending', ...statuses]),
  note: z.string().trim().min(2).max(1000).optional()
});

function normalizedStatus(status) {
  return status === 'pending' ? 'pending_verification' : status;
}

async function requireReport(publicId) {
  const row = await findReportRowByPublicId(publicId);
  if (!row) throw new ApiError(404, 'Report not found.', 'REPORT_NOT_FOUND');
  return row;
}

function canAccessReport(user, row) {
  return user.role === 'administrator'
    || (user.role === 'citizen' && row.reporter_user_id === user.id)
    || (user.role === 'driver' && row.assigned_vehicle_public_id === user.assignedTruckId);
}

export async function create(request, response) {
  const existingKey = request.body.idempotencyKey;
  if (existingKey) {
    const existing = await findReportByIdempotencyKey(existingKey);
    if (existing) return response.status(200).json({ success: true, idempotent: true, report: existing });
  }
  const stored = await storeReportImage(request.file);
  const report = await withTransaction(async (connection) => {
    const newReport = await createReport({
      id: id(), publicId: publicId('FMA'), historyId: id(), reporterUserId: request.user.id,
      source: 'website', idempotencyKey: request.body.idempotencyKey || null,
      title: request.body.title || 'Illegal waste reported at ' + request.body.locationLabel,
      description: request.body.description, imageUrl: stored.url, imageStorageKey: stored.key,
      locationLabel: request.body.locationLabel, ward: request.body.ward,
      latitude: request.body.latitude, longitude: request.body.longitude, category: request.body.category,
      historyNote: 'Website report submitted with photographic evidence.'
    }, connection);
    await notify({ targetRole: 'administrator', type: 'report_submitted', title: 'New website report', message: 'A citizen submitted ' + newReport.id + ' for verification.', entityType: 'report', entityId: newReport.databaseId }, connection);
    return newReport;
  });
  emitReportChanged(report);
  response.status(201).json({ success: true, report });
  queueMicrotask(async () => {
    try {
      await analyzeReport(report.id);
      const refreshed = await findReportByPublicId(report.id);
      if (refreshed) emitReportChanged(refreshed);
    } catch (error) {
      void error;
    }
  });
}

export async function list(request, response) {
  const query = request.query;
  const filters = {
    source: query.source, status: query.status ? normalizedStatus(query.status) : undefined, priority: query.priority,
    search: query.search && String(query.search).slice(0, 120), limit: Math.min(Number(query.limit) || 100, 200), offset: Math.max(Number(query.offset) || 0, 0)
  };
  if (request.user.role === 'citizen') filters.reporterUserId = request.user.id;
  if (request.user.role === 'driver') filters.assignedVehiclePublicId = request.user.assignedTruckId;
  const reports = await listReports(filters);
  response.json({ success: true, reports });
}

export async function mine(request, response) {
  const reports = await listReports({ reporterUserId: request.user.id, limit: 200 });
  response.json({ success: true, reports });
}

export async function getOne(request, response) {
  const row = await requireReport(request.params.id);
  if (!canAccessReport(request.user, row)) throw new ApiError(403, 'You cannot view this report.', 'FORBIDDEN');
  const report = await findReportByPublicId(request.params.id);
  response.json({ success: true, report });
}

export async function updateStatus(request, response) {
  const row = await requireReport(request.params.id);
  if (request.user.role === 'citizen') throw new ApiError(403, 'Citizens cannot change a report status.', 'FORBIDDEN');
  if (request.user.role === 'driver' && row.assigned_vehicle_public_id !== request.user.assignedTruckId) {
    throw new ApiError(403, 'Drivers can update only reports assigned to their vehicle.', 'FORBIDDEN');
  }
  const nextStatus = normalizedStatus(request.body.status);
  if (!statuses.includes(nextStatus)) throw new ApiError(422, 'Invalid report status.', 'INVALID_STATUS');
  const changes = { status: nextStatus };
  if (nextStatus === 'on_the_way') changes.collection_started_at = new Date();
  if (nextStatus === 'resolved') changes.resolved_at = new Date();
  const report = await withTransaction(async (connection) => {
    const updated = await updateReport({
      id: row.id, publicId: row.public_id, changes,
      history: { id: id(), previousStatus: row.status, newStatus: nextStatus, note: request.body.note || 'Status updated by municipal staff.', userId: request.user.id }
    }, connection);
    if (updated.citizenId) await notify({ userId: updated.citizenId, type: 'report_status_changed', title: 'Report status updated', message: updated.id + ' is now ' + nextStatus.replaceAll('_', ' ') + '.', entityType: 'report', entityId: updated.databaseId }, connection);
    return updated;
  });
  emitReportChanged(report);
  response.json({ success: true, report });
}

export async function assignVehicle(request, response) {
  const body = z.object({ vehicleId: z.string().trim().min(3).max(32), note: z.string().trim().max(1000).optional() }).parse(request.body);
  const { findVehicleByPublicId } = await import('../models/repositories.js');
  const row = await requireReport(request.params.id);
  const vehicle = await findVehicleByPublicId(body.vehicleId);
  if (!vehicle) throw new ApiError(404, 'Vehicle not found.', 'VEHICLE_NOT_FOUND');
  if (!['available', 'assigned', 'on_route'].includes(vehicle.status)) throw new ApiError(422, 'This vehicle is not available for assignment.', 'VEHICLE_UNAVAILABLE');
  const report = await withTransaction(async (connection) => {
    const updated = await updateReport({
      id: row.id, publicId: row.public_id, changes: { assigned_vehicle_id: vehicle.databaseId, status: 'assigned' },
      history: { id: id(), previousStatus: row.status, newStatus: 'assigned', note: body.note || 'Assigned to vehicle ' + vehicle.id + '.', userId: request.user.id }
    }, connection);
    if (vehicle.driverUserId) await notify({ userId: vehicle.driverUserId, type: 'vehicle_assigned', title: 'New collection assignment', message: updated.id + ' has been assigned to ' + vehicle.name + '.', entityType: 'report', entityId: updated.databaseId }, connection);
    if (updated.citizenId) await notify({ userId: updated.citizenId, type: 'vehicle_assigned', title: 'Collection vehicle assigned', message: vehicle.name + ' is assigned to ' + updated.id + '.', entityType: 'report', entityId: updated.databaseId }, connection);
    return updated;
  });
  emitReportChanged(report);
  response.json({ success: true, report });
}
