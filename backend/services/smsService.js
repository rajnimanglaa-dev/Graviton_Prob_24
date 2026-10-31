import crypto from 'node:crypto';
import { ApiError } from '../utils/ApiError.js';
import { stableHash } from '../utils/ids.js';

const phonePattern = /^[6-9][0-9]{9}$/;

export function normalizePhone(value) {
  const normalized = String(value || '').replace(/[^\d]/g, '').replace(/^91(?=\d{10}$)/, '');
  if (!phonePattern.test(normalized)) throw new ApiError(422, 'Enter a valid 10-digit Indian mobile number.', 'INVALID_PHONE_NUMBER');
  return normalized;
}

export function parseReportSms(message) {
  const original = String(message || '');
  const compact = original.trim().replace(/\s+/g, ' ');
  if (!compact) throw new ApiError(422, 'SMS message cannot be empty.', 'EMPTY_SMS_MESSAGE');
  const match = /^REPORT(?:\s+(.+))?$/i.exec(compact);
  if (!match) throw new ApiError(422, 'Unsupported SMS format. Use: REPORT [LOCATION].', 'INVALID_SMS_FORMAT');
  const location = (match[1] || '').trim().replace(/\s+/g, ' ');
  if (!location) throw new ApiError(422, 'A location is required after REPORT.', 'SMS_LOCATION_REQUIRED');
  if (location.length > 500) throw new ApiError(422, 'SMS location must be 500 characters or fewer.', 'SMS_LOCATION_TOO_LONG');
  return { original, location };
}

export function getSmsIdempotencyKey(request, phone, message) {
  const supplied = request.get('Idempotency-Key') || request.body.idempotency_key;
  if (supplied && /^[A-Za-z0-9_-]{8,128}$/.test(supplied)) return supplied;
  const providerId = request.body.provider_message_id;
  if (providerId) return 'provider-' + stableHash(String(providerId)).slice(0, 48);
  return 'auto-' + stableHash(phone + '|' + message + '|' + crypto.randomUUID()).slice(0, 48);
}

export function verifyProviderSignature(request, secret) {
  if (!secret) throw new ApiError(503, 'Real SMS provider webhook is not configured.', 'SMS_PROVIDER_NOT_CONFIGURED');
  const signature = request.get('X-SMS-Signature');
  if (!signature) throw new ApiError(401, 'Missing SMS provider signature.', 'INVALID_SMS_SIGNATURE');
  const body = JSON.stringify(request.body);
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  const provided = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (provided.length !== expectedBuffer.length || !crypto.timingSafeEqual(provided, expectedBuffer)) {
    throw new ApiError(401, 'Invalid SMS provider signature.', 'INVALID_SMS_SIGNATURE');
  }
}
