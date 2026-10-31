import { z } from 'zod';
import { env } from '../config/env.js';
import { withTransaction } from '../config/db.js';
import { createReport, createSmsRecord, findSmsById, findSmsByIdempotency, listSms } from '../models/repositories.js';
import { ApiError } from '../utils/ApiError.js';
import { id, publicId } from '../utils/ids.js';
import { geocodeLocation } from '../services/geocodingService.js';
import { getSmsIdempotencyKey, normalizePhone, parseReportSms, verifyProviderSignature } from '../services/smsService.js';
import { notify } from '../services/notificationService.js';
import { emitReportChanged } from '../services/socketService.js';

export const incomingSmsSchema = z.object({
  phone_number: z.string().trim().min(1).max(30),
  message: z.string().max(1600),
  idempotency_key: z.string().trim().min(8).max(128).regex(/^[A-Za-z0-9_-]+$/).optional(),
  provider_message_id: z.string().trim().max(255).optional()
});

export async function incoming(request, response) {
  const source = request.get('X-SMS-Source') === 'provider' ? 'provider_webhook' : 'simulator';
  if (source === 'provider_webhook') verifyProviderSignature(request, env.smsWebhookSecret);
  if (source === 'simulator' && !env.allowSmsSimulator) throw new ApiError(403, 'The SMS simulator is disabled.', 'SMS_SIMULATOR_DISABLED');

  const phoneNumber = normalizePhone(request.body.phone_number);
  const idempotencyKey = getSmsIdempotencyKey(request, phoneNumber, request.body.message);
  const duplicate = await findSmsByIdempotency(idempotencyKey);
  if (duplicate) {
    return response.status(200).json({
      success: duplicate.processing_status === 'processed',
      idempotent: true,
      message: duplicate.processing_status === 'processed' ? 'SMS was already processed.' : 'This SMS was already rejected.',
      reportId: duplicate.report_public_id || null, location: duplicate.extracted_location || null,
      status: duplicate.report_status || null, source: duplicate.source, error: duplicate.error_details || null
    });
  }

  let parsed;
  try {
    parsed = parseReportSms(request.body.message);
  } catch (error) {
    await withTransaction((connection) => createSmsRecord({
      id: id(), providerMessageId: request.body.provider_message_id, idempotencyKey, phoneNumber,
      originalMessage: request.body.message || '', source, status: 'rejected', error: error.message
    }, connection));
    throw error;
  }

  const coordinates = await geocodeLocation(parsed.location);
  const report = await withTransaction(async (connection) => {
    const created = await createReport({
      id: id(), publicId: publicId('FMA'), historyId: id(), source: 'sms',
      title: 'SMS waste report: ' + parsed.location, description: 'Submitted by SMS sender ' + phoneNumber + '.',
      locationLabel: parsed.location, latitude: coordinates?.latitude, longitude: coordinates?.longitude,
      status: 'pending_verification', historyNote: 'Incoming SMS parsed as REPORT [LOCATION].'
    }, connection);
    await createSmsRecord({
      id: id(), providerMessageId: request.body.provider_message_id, idempotencyKey, phoneNumber,
      originalMessage: parsed.original, location: parsed.location, source, reportId: created.databaseId,
      status: 'processed', processedAt: new Date()
    }, connection);
    await notify({
      targetRole: 'administrator', type: 'sms_report_received', title: 'New SMS waste report',
      message: created.id + ' was created from SMS at ' + parsed.location + '.', entityType: 'report', entityId: created.databaseId
    }, connection);
    return created;
  });
  emitReportChanged(report);
  response.status(201).json({
    success: true, message: 'SMS processed successfully', reportId: report.id, location: parsed.location,
    status: 'Pending Verification', source: 'SMS', coordinatesFound: Boolean(coordinates)
  });
}

export async function history(request, response) {
  const sms = await listSms();
  response.json({ success: true, sms });
}

export async function getOne(request, response) {
  const sms = await findSmsById(request.params.id);
  if (!sms) throw new ApiError(404, 'SMS record not found.', 'SMS_NOT_FOUND');
  response.json({ success: true, sms });
}
