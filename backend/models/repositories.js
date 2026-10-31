import { pool } from '../config/db.js';

function json(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

const legacyStatus = { pending_verification: 'pending', pending: 'pending' };

export function toUser(row) {
  if (!row) return null;
  return {
    id: row.id, publicId: row.public_id, name: row.full_name, email: row.email,
    phoneNumber: row.phone_number, role: row.role, ward: row.ward, avatarUrl: row.avatar_url,
    points: Number(row.points || 0), isActive: Boolean(row.is_active),
    assignedTruckId: row.assigned_truck_id || null, createdAt: row.created_at
  };
}

export function toVehicle(row) {
  return {
    id: row.public_id, databaseId: row.id, name: row.name, registrationNumber: row.registration_number,
    type: row.vehicle_type, capacityKg: Number(row.capacity_kg), currentLoadKg: Number(row.current_load_kg),
    status: row.status, driverUserId: row.driver_user_id, driverName: row.driver_name || null,
    driverEmail: row.driver_email || null,
    location: row.latitude === null ? null : { lat: Number(row.latitude), lng: Number(row.longitude) },
    createdAt: row.created_at, updatedAt: row.updated_at
  };
}

export function toReport(row, history = []) {
  const analysis = row.analysis_id ? {
    id: row.analysis_id, status: row.analysis_status, provider: row.analysis_provider, model: row.analysis_model,
    wasteCategory: row.analysis_category, severity: row.analysis_severity, priority: row.analysis_priority,
    visibleMaterials: json(row.visible_materials, []), visibleQuantityIndicators: json(row.visible_quantity_indicators, []),
    environmentalConcerns: json(row.environmental_concerns, []), explanation: row.explanation,
    recommendedAction: row.recommended_action, confidence: row.analysis_confidence === null ? null : Number(row.analysis_confidence),
    errorMessage: row.analysis_error_message, analyzedAt: row.analyzed_at
  } : null;
  const category = row.category || (analysis && analysis.wasteCategory) || 'unclassified';
  const severity = row.severity || (analysis && analysis.severity) || null;
  const priority = row.priority || (analysis && analysis.priority) || 'medium';
  const score = row.priority_score === null ? null : Number(row.priority_score);
  return {
    id: row.public_id, databaseId: row.id, source: row.source, senderPhoneNumber: row.sender_phone_number || null,
    originalSms: row.original_sms || null, title: row.title, description: row.description || '', imageUrl: row.image_url || null, imageStorageKey: row.image_storage_key || null,
    location: { lat: row.latitude === null ? null : Number(row.latitude), lng: row.longitude === null ? null : Number(row.longitude), address: row.location_label, ward: row.ward || '' },
    category, severity, priority, priorityScore: score, idempotencyKey: row.idempotency_key || null,
    planningWeightKg: row.estimated_weight_kg === null ? null : Number(row.estimated_weight_kg),
    status: legacyStatus[row.status] || row.status, workflowStatus: row.status,
    verificationStatus: row.status === 'pending_verification' ? 'pending_verification' : row.status,
    rejectionReason: row.rejection_reason, assignedVehicleId: row.assigned_vehicle_public_id || null,
    assignedDriverName: row.assigned_driver_name || null, citizenId: row.reporter_user_id,
    citizenName: row.reporter_name || null, citizenEmail: row.reporter_email || null,
    createdAt: row.created_at, updatedAt: row.updated_at, aiAnalysis: analysis,
    timeline: history.map((item) => ({ id: item.id, status: legacyStatus[item.new_status] || item.new_status, timestamp: item.created_at, actor: item.actor_name || 'System', note: item.note || '' }))
  };
}

const reportSelect = `
SELECT r.*,
  u.full_name AS reporter_name, u.email AS reporter_email,
  v.public_id AS assigned_vehicle_public_id, driver.full_name AS assigned_driver_name,
  a.id AS analysis_id, a.provider AS analysis_provider, a.model AS analysis_model,
  a.status AS analysis_status, a.waste_category AS analysis_category, a.severity AS analysis_severity,
  a.priority AS analysis_priority, a.visible_materials, a.visible_quantity_indicators, a.environmental_concerns,
  a.explanation, a.recommended_action, a.confidence AS analysis_confidence, a.error_message AS analysis_error_message, a.analyzed_at,
  s.sender_phone_number, s.original_message AS original_sms
FROM waste_reports r
LEFT JOIN users u ON u.id = r.reporter_user_id
LEFT JOIN vehicles v ON v.id = r.assigned_vehicle_id
LEFT JOIN users driver ON driver.id = v.driver_user_id
LEFT JOIN ai_analyses a ON a.report_id = r.id
LEFT JOIN sms_records s ON s.report_id = r.id AND s.processing_status = 'processed'
`;

export async function findUserById(id, connection = pool) {
  const [rows] = await connection.query(
    `SELECT u.*, v.public_id AS assigned_truck_id FROM users u LEFT JOIN vehicles v ON v.driver_user_id = u.id WHERE u.id = ? LIMIT 1`,
    [id]
  );
  return toUser(rows[0]);
}

export async function findUserByEmail(email, connection = pool) {
  const [rows] = await connection.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email.toLowerCase()]);
  return rows[0] || null;
}

export async function createUser(data, connection = pool) {
  await connection.execute(
    `INSERT INTO users (id, public_id, full_name, email, password_hash, phone_number, role, ward) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.id, data.publicId, data.name, data.email.toLowerCase(), data.passwordHash, data.phoneNumber || null, data.role, data.ward || null]
  );
  return findUserById(data.id, connection);
}

export async function findReportRowByPublicId(publicId, connection = pool) {
  const [rows] = await connection.query(reportSelect + ' WHERE r.public_id = ? LIMIT 1', [publicId]);
  return rows[0] || null;
}

export async function findReportByIdempotencyKey(idempotencyKey, connection = pool) {
  const [rows] = await connection.query(reportSelect + ' WHERE r.idempotency_key = ? LIMIT 1', [idempotencyKey]);
  if (!rows[0]) return null;
  const [history] = await connection.query(
    `SELECT h.*, u.full_name AS actor_name FROM report_status_history h LEFT JOIN users u ON u.id = h.changed_by_user_id WHERE h.report_id = ? ORDER BY h.created_at ASC`,
    [rows[0].id]
  );
  return toReport(rows[0], history);
}

export async function findReportByPublicId(publicId, connection = pool) {
  const row = await findReportRowByPublicId(publicId, connection);
  if (!row) return null;
  const [history] = await connection.query(
    `SELECT h.*, u.full_name AS actor_name FROM report_status_history h LEFT JOIN users u ON u.id = h.changed_by_user_id WHERE h.report_id = ? ORDER BY h.created_at ASC`,
    [row.id]
  );
  return toReport(row, history);
}

export async function listReports(filters = {}, connection = pool) {
  const clauses = [];
  const values = [];
  if (filters.reporterUserId) { clauses.push('r.reporter_user_id = ?'); values.push(filters.reporterUserId); }
  if (filters.source) { clauses.push('r.source = ?'); values.push(filters.source); }
  if (filters.status) { clauses.push('r.status = ?'); values.push(filters.status); }
  if (filters.priority) { clauses.push('r.priority = ?'); values.push(filters.priority); }
  if (filters.assignedVehiclePublicId) { clauses.push('v.public_id = ?'); values.push(filters.assignedVehiclePublicId); }
  if (filters.search) {
    clauses.push('(r.public_id LIKE ? OR r.title LIKE ? OR r.location_label LIKE ?)');
    const term = '%' + filters.search + '%';
    values.push(term, term, term);
  }
  const where = clauses.length ? ' WHERE ' + clauses.join(' AND ') : '';
  const [rows] = await connection.query(reportSelect + where + ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?', [...values, filters.limit || 100, filters.offset || 0]);
  const reportIds = rows.map((row) => row.id);
  const historyByReport = new Map(reportIds.map((item) => [item, []]));
  if (reportIds.length) {
    const placeholders = reportIds.map(() => '?').join(',');
    const [history] = await connection.query(
      `SELECT h.*, u.full_name AS actor_name FROM report_status_history h LEFT JOIN users u ON u.id = h.changed_by_user_id WHERE h.report_id IN (` + placeholders + ') ORDER BY h.created_at ASC',
      reportIds
    );
    for (const item of history) historyByReport.get(item.report_id).push(item);
  }
  return rows.map((row) => toReport(row, historyByReport.get(row.id) || []));
}

export async function addReportHistory(data, connection = pool) {
  await connection.execute(
    `INSERT INTO report_status_history (id, report_id, previous_status, new_status, note, changed_by_user_id) VALUES (?, ?, ?, ?, ?, ?)`,
    [data.id, data.reportId, data.previousStatus, data.newStatus, data.note || null, data.userId || null]
  );
}

export async function createReport(data, connection = pool) {
  await connection.execute(
    `INSERT INTO waste_reports (id, public_id, reporter_user_id, source, idempotency_key, title, description, image_url, image_storage_key, location_label, ward, latitude, longitude, category, priority, estimated_weight_kg, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.id, data.publicId, data.reporterUserId || null, data.source, data.idempotencyKey || null, data.title, data.description || null, data.imageUrl || null, data.imageStorageKey || null, data.locationLabel, data.ward || null, data.latitude ?? null, data.longitude ?? null, data.category || null, data.priority || 'medium', data.estimatedWeightKg ?? null, data.status || 'pending_verification']
  );
  await addReportHistory({ id: data.historyId, reportId: data.id, previousStatus: null, newStatus: data.status || 'pending_verification', note: data.historyNote || (data.source === 'sms' ? 'Report created from incoming SMS.' : 'Website report submitted.'), userId: data.reporterUserId || null }, connection);
  return findReportByPublicId(data.publicId, connection);
}

export async function updateReport(data, connection = pool) {
  const columns = Object.keys(data.changes);
  if (columns.length) {
    const assignments = columns.map((column) => column + ' = ?').join(', ');
    await connection.execute('UPDATE waste_reports SET ' + assignments + ' WHERE id = ?', [...columns.map((column) => data.changes[column]), data.id]);
  }
  if (data.history) await addReportHistory({ ...data.history, reportId: data.id }, connection);
  return findReportByPublicId(data.publicId, connection);
}

export async function findVehicleByPublicId(publicId, connection = pool) {
  const [rows] = await connection.query(
    `SELECT v.*, u.full_name AS driver_name, u.email AS driver_email FROM vehicles v LEFT JOIN users u ON u.id = v.driver_user_id WHERE v.public_id = ? LIMIT 1`,
    [publicId]
  );
  return rows[0] ? toVehicle(rows[0]) : null;
}

export async function listVehicles(connection = pool) {
  const [rows] = await connection.query(
    `SELECT v.*, u.full_name AS driver_name, u.email AS driver_email FROM vehicles v LEFT JOIN users u ON u.id = v.driver_user_id ORDER BY v.name`
  );
  return rows.map(toVehicle);
}

export async function createVehicle(data, connection = pool) {
  await connection.execute(
    `INSERT INTO vehicles (id, public_id, name, registration_number, vehicle_type, capacity_kg, current_load_kg, status, driver_user_id, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.id, data.publicId, data.name, data.registrationNumber, data.vehicleType, data.capacityKg, data.currentLoadKg || 0, data.status || 'available', data.driverUserId || null, data.latitude ?? null, data.longitude ?? null]
  );
  return findVehicleByPublicId(data.publicId, connection);
}

export async function findSmsByIdempotency(idempotencyKey, connection = pool) {
  const [rows] = await connection.query(
    `SELECT s.*, r.public_id AS report_public_id, r.status AS report_status FROM sms_records s LEFT JOIN waste_reports r ON r.id = s.report_id WHERE s.idempotency_key = ? LIMIT 1`,
    [idempotencyKey]
  );
  return rows[0] || null;
}

export async function createSmsRecord(data, connection = pool) {
  await connection.execute(
    `INSERT INTO sms_records (id, provider_message_id, idempotency_key, sender_phone_number, original_message, extracted_location, source, report_id, processing_status, error_details, processed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.id, data.providerMessageId || null, data.idempotencyKey, data.phoneNumber, data.originalMessage, data.location || null, data.source, data.reportId || null, data.status, data.error || null, data.processedAt || null]
  );
}

export async function listSms(connection = pool) {
  const [rows] = await connection.query(
    `SELECT s.*, r.public_id AS report_public_id, r.status AS report_status FROM sms_records s LEFT JOIN waste_reports r ON r.id = s.report_id ORDER BY s.received_at DESC LIMIT 100`
  );
  return rows.map((row) => ({
    id: row.id, providerMessageId: row.provider_message_id, idempotencyKey: row.idempotency_key, phoneNumber: row.sender_phone_number,
    originalMessage: row.original_message, extractedLocation: row.extracted_location, source: row.source, reportId: row.report_public_id,
    reportStatus: row.report_status, status: row.processing_status, error: row.error_details, receivedAt: row.received_at, processedAt: row.processed_at
  }));
}

export async function findSmsById(id, connection = pool) {
  const [rows] = await connection.query(
    `SELECT s.*, r.public_id AS report_public_id, r.status AS report_status FROM sms_records s LEFT JOIN waste_reports r ON r.id = s.report_id WHERE s.id = ? LIMIT 1`,
    [id]
  );
  if (!rows[0]) return null;
  const row = rows[0];
  return {
    id: row.id, providerMessageId: row.provider_message_id, idempotencyKey: row.idempotency_key, phoneNumber: row.sender_phone_number,
    originalMessage: row.original_message, extractedLocation: row.extracted_location, source: row.source, reportId: row.report_public_id,
    reportStatus: row.report_status, status: row.processing_status, error: row.error_details, receivedAt: row.received_at, processedAt: row.processed_at
  };
}

export async function createAnalysis(data, connection = pool) {
  await connection.execute(
    `INSERT INTO ai_analyses (id, report_id, provider, model, status) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE provider = VALUES(provider), model = VALUES(model), status = VALUES(status), error_message = NULL`,
    [data.id, data.reportId, data.provider || 'xai', data.model, data.status || 'pending']
  );
}

export async function saveAnalysisResult(data, connection = pool) {
  await connection.execute(
    `UPDATE ai_analyses SET status = ?, waste_category = ?, severity = ?, priority = ?, visible_materials = ?, visible_quantity_indicators = ?, environmental_concerns = ?, explanation = ?, recommended_action = ?, confidence = ?, raw_response = ?, error_message = ?, analyzed_at = CURRENT_TIMESTAMP WHERE report_id = ?`,
    [data.status, data.wasteCategory || null, data.severity || null, data.priority || null, JSON.stringify(data.visibleMaterials || []), JSON.stringify(data.visibleQuantityIndicators || []), JSON.stringify(data.environmentalConcerns || []), data.explanation || null, data.recommendedAction || null, data.confidence ?? null, data.rawResponse ? JSON.stringify(data.rawResponse) : null, data.errorMessage || null, data.reportId]
  );
}

export async function createNotification(data, connection = pool) {
  await connection.execute(
    `INSERT INTO notifications (id, user_id, target_role, type, title, message, entity_type, entity_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.id, data.userId || null, data.targetRole || 'all', data.type, data.title, data.message, data.entityType || null, data.entityId || null]
  );
}

export async function listNotificationsForUser(user, connection = pool) {
  const [rows] = await connection.query(
    `SELECT * FROM notifications WHERE user_id = ? OR (user_id IS NULL AND (target_role = ? OR target_role = 'all')) ORDER BY created_at DESC LIMIT 100`,
    [user.id, user.role]
  );
  return rows.map((row) => ({ id: row.id, type: row.type, title: row.title, message: row.message, entityType: row.entity_type, entityId: row.entity_id, read: Boolean(row.is_read), createdAt: row.created_at, readAt: row.read_at }));
}

export async function markNotificationRead(id, userId, connection = pool) {
  const [result] = await connection.execute('UPDATE notifications SET is_read = TRUE, read_at = CURRENT_TIMESTAMP WHERE id = ? AND (user_id = ? OR user_id IS NULL)', [id, userId]);
  return result.affectedRows > 0;
}

export async function createRouteAssignment(data, connection = pool) {
  await connection.execute(
    `INSERT INTO route_assignments (id, public_id, vehicle_id, status, optimisation_provider, total_distance_meters, total_duration_seconds, capacity_used_kg, capacity_available_kg, route_geometry, optimisation_summary, created_by_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.id, data.publicId, data.vehicleId, data.status || 'planned', data.provider, data.distanceMeters, data.durationSeconds, data.capacityUsedKg, data.capacityAvailableKg, JSON.stringify(data.geometry || null), JSON.stringify(data.summary || {}), data.createdByUserId]
  );
  for (const stop of data.stops) {
    await connection.execute(
      `INSERT INTO route_stops (id, route_assignment_id, report_id, stop_sequence, planned_weight_kg, leg_distance_meters, leg_duration_seconds) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [stop.id, data.id, stop.reportId, stop.sequence, stop.plannedWeightKg, stop.legDistanceMeters || null, stop.legDurationSeconds || null]
    );
  }
}

function routeDto(row, stops) {
  return {
    id: row.public_id, databaseId: row.id, vehicleId: row.vehicle_public_id, vehicleName: row.vehicle_name,
    status: row.status, provider: row.optimisation_provider, totalDistanceMeters: Number(row.total_distance_meters),
    totalDurationSeconds: Number(row.total_duration_seconds), capacityUsedKg: Number(row.capacity_used_kg),
    capacityAvailableKg: Number(row.capacity_available_kg), geometry: json(row.route_geometry, null),
    summary: json(row.optimisation_summary, {}), createdAt: row.created_at,
    stops: stops.map((stop) => ({ reportId: stop.report_public_id, title: stop.title, location: { lat: Number(stop.latitude), lng: Number(stop.longitude), address: stop.location_label }, sequence: stop.stop_sequence, plannedWeightKg: Number(stop.planned_weight_kg), legDistanceMeters: stop.leg_distance_meters === null ? null : Number(stop.leg_distance_meters), legDurationSeconds: stop.leg_duration_seconds, status: stop.status }))
  };
}

export async function listRouteAssignments(connection = pool) {
  const [rows] = await connection.query(
    `SELECT ra.*, v.public_id AS vehicle_public_id, v.name AS vehicle_name FROM route_assignments ra JOIN vehicles v ON v.id = ra.vehicle_id ORDER BY ra.created_at DESC LIMIT 100`
  );
  const result = [];
  for (const row of rows) {
    const [stops] = await connection.query(
      `SELECT rs.*, r.public_id AS report_public_id, r.title, r.latitude, r.longitude, r.location_label FROM route_stops rs JOIN waste_reports r ON r.id = rs.report_id WHERE rs.route_assignment_id = ? ORDER BY rs.stop_sequence`,
      [row.id]
    );
    result.push(routeDto(row, stops));
  }
  return result;
}

export async function findRouteAssignment(publicId, connection = pool) {
  const [rows] = await connection.query(
    `SELECT ra.*, v.public_id AS vehicle_public_id, v.name AS vehicle_name FROM route_assignments ra JOIN vehicles v ON v.id = ra.vehicle_id WHERE ra.public_id = ? LIMIT 1`,
    [publicId]
  );
  if (!rows[0]) return null;
  const [stops] = await connection.query(
    `SELECT rs.*, r.public_id AS report_public_id, r.title, r.latitude, r.longitude, r.location_label FROM route_stops rs JOIN waste_reports r ON r.id = rs.report_id WHERE rs.route_assignment_id = ? ORDER BY rs.stop_sequence`,
    [rows[0].id]
  );
  return routeDto(rows[0], stops);
}
