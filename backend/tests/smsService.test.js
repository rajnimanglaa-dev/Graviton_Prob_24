import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePhone, parseReportSms } from '../services/smsService.js';

test('SMS parser accepts a REPORT location', () => {
  assert.deepEqual(parseReportSms('  REPORT   Sector 15, Chandigarh  '), {
    original: '  REPORT   Sector 15, Chandigarh  ',
    location: 'Sector 15, Chandigarh'
  });
});

test('SMS parser rejects messages without REPORT', () => {
  assert.throws(() => parseReportSms('Hello'), { code: 'INVALID_SMS_FORMAT' });
});

test('SMS parser rejects REPORT without a location', () => {
  assert.throws(() => parseReportSms('REPORT'), { code: 'SMS_LOCATION_REQUIRED' });
});

test('SMS parser normalizes a valid Indian number', () => {
  assert.equal(normalizePhone('+91 98765 43210'), '9876543210');
});

test('SMS parser rejects an invalid number', () => {
  assert.throws(() => normalizePhone('1234'), { code: 'INVALID_PHONE_NUMBER' });
});
