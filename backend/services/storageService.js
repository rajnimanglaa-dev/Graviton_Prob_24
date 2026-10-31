import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { id } from '../utils/ids.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const uploadDir = path.join(root, 'uploads');
const hasCloudinary = Boolean(env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret);

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true
  });
}

function extension(mimeType) {
  return ({ 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' })[mimeType] || '.jpg';
}

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'fixmyarea/reports', resource_type: 'image' }, (error, result) => {
      if (error) reject(error);
      else resolve({ url: result.secure_url, key: result.public_id, provider: 'cloudinary' });
    });
    stream.end(buffer);
  });
}

export async function storeReportImage(file) {
  if (!file) throw new ApiError(422, 'A report photograph is required.', 'IMAGE_REQUIRED');
  if (hasCloudinary) return uploadToCloudinary(file.buffer);
  await fs.mkdir(uploadDir, { recursive: true });
  const filename = id() + extension(file.mimetype);
  await fs.writeFile(path.join(uploadDir, filename), file.buffer, { flag: 'wx' });
  return {
    url: env.publicApiUrl.replace(/\/$/, '') + '/uploads/' + filename,
    key: filename,
    provider: 'local'
  };
}

export async function imageAsDataUrl(report) {
  if (!report.imageUrl) throw new ApiError(422, 'This report does not have a photograph to analyze.', 'IMAGE_REQUIRED');
  if (!report.imageStorageKey || /^https?:\/\//i.test(report.imageUrl) && !report.imageUrl.includes('/uploads/')) return report.imageUrl;
  const file = await fs.readFile(path.join(uploadDir, path.basename(report.imageStorageKey)));
  const extensionName = path.extname(report.imageStorageKey).toLowerCase();
  const mime = extensionName === '.png' ? 'image/png' : extensionName === '.webp' ? 'image/webp' : 'image/jpeg';
  return 'data:' + mime + ';base64,' + file.toString('base64');
}
