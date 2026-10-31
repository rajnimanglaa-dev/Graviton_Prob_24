import 'dotenv/config';

function required(name, fallback) {
  const value = process.env[name] || fallback;
  if (!value) throw new Error('Missing required environment variable: ' + name);
  return value;
}

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  jwtSecret: required('JWT_SECRET', process.env.NODE_ENV === 'production' ? '' : 'development-only-change-me-before-production-12345'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  database: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    name: required('DB_NAME', 'fixmyarea'),
    user: required('DB_USER', 'root'),
    password: process.env.DB_PASSWORD || ''
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || ''
  },
  publicApiUrl: process.env.PUBLIC_API_URL || 'http://localhost:5000',
  xaiApiKey: process.env.XAI_API_KEY || '',
  grokModel: process.env.GROK_MODEL || 'grok-4.7',
  osrmBaseUrl: process.env.OSRM_BASE_URL || 'http://router.project-osrm.org',
  geocoderBaseUrl: process.env.GEOCODER_BASE_URL || 'https://nominatim.openstreetmap.org',
  geocoderUserAgent: process.env.GEOCODER_USER_AGENT || 'FixMyArea/1.0',
  pythonBin: process.env.PYTHON_BIN || 'python',
  allowSmsSimulator: process.env.ALLOW_SMS_SIMULATOR !== 'false',
  smsWebhookSecret: process.env.SMS_PROVIDER_WEBHOOK_SECRET || ''
});
