import crypto from 'node:crypto';

export function id() {
  return crypto.randomUUID();
}

export function publicId(prefix) {
  return prefix + '-' + new Date().getFullYear() + '-' + crypto.randomUUID().slice(0, 8).toUpperCase();
}

export function stableHash(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}
