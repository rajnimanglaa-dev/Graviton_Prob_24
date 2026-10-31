import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import { Server } from 'socket.io';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { INITIAL_REPORTS, INITIAL_VEHICLES } from '../src/services/mockData.js';
import { analyzeWasteImage } from '../src/services/aiService.js';
import { findNearbyDuplicates } from '../src/services/geoService.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.CLICK2CLEAN_STORAGE_DIR || path.join(here, 'data');
const uploadDir = path.join(dataDir, 'uploads');
const dataFile = path.join(dataDir, 'demo-store.json');
const port = Number(process.env.PORT || 5000);
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const publicApiUrl = process.env.PUBLIC_API_URL || `http://localhost:${port}`;
const password = 'DemoPass123!';
const sessions = new Map();
function allowFrontendOrigin(origin, callback) {
  const allowed = !origin || origin === frontendOrigin || (
    process.env.NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
  );
  callback(null, allowed);
}

await fs.mkdir(dataDir, { recursive: true });
await fs.mkdir(uploadDir, { recursive: true });

const demoUsers = [
  { id: 'demo-citizen', publicId: 'CIT-DEMO', name: 'Priya Sharma', email: 'citizen@fixmyarea.local', role: 'citizen', ward: 'Ward 7 - Civil Lines', points: 420, avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
  { id: 'demo-admin', publicId: 'ADM-DEMO', name: 'Director Rajiv Verma', email: 'admin@fixmyarea.local', role: 'administrator', ward: null, points: 0, avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80' },
  { id: 'demo-driver', publicId: 'DRV-DEMO', name: 'Rajesh Kumar', email: 'driver@fixmyarea.local', role: 'driver', ward: null, points: 0, assignedTruckId: 'SW-TRUCK-01', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' }
];

function initialStore() {
  return {
    users: demoUsers,
    vehicles: structuredClone(INITIAL_VEHICLES).map((vehicle) => ({ ...vehicle, driverUserId: 'demo-driver' })),
    reports: structuredClone(INITIAL_REPORTS).map((report) => ({ ...report, citizenId: 'demo-citizen', citizenName: 'Priya Sharma', citizenEmail: 'citizen@fixmyarea.local' })),
    notifications: [
      { id: 'NTF-DEMO-1', targetRole: 'administrator', title: 'Demo data ready', message: 'New citizen reports will appear in this command centre.', type: 'system', read: false, createdAt: new Date().toISOString() }
    ]
  };
}

let store;
try {
  store = JSON.parse(await fs.readFile(dataFile, 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  store = initialStore();
  await fs.writeFile(dataFile, JSON.stringify(store, null, 2));
}

let writeQueue = Promise.resolve();
function updateStore(change) {
  const operation = writeQueue.then(async () => {
    change(store);
    await fs.writeFile(dataFile, JSON.stringify(store, null, 2));
  });
  writeQueue = operation.catch(() => {});
  return operation;
}

const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: allowFrontendOrigin, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(uploadDir, { maxAge: '1d' }));
app.get('/api/health', (_request, response) => response.json({ success: true, service: 'click2clean-local-api', storage: 'local-file' }));

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => callback(null, uploadDir),
  filename: (_request, file, callback) => callback(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`)
});
const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => callback(null, /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype))
});

function publicUser(user) {
  const { password: _password, ...safe } = user;
  return safe;
}
function userFor(request) {
  const token = request.cookies.access_token;
  const userId = token && sessions.get(token);
  return userId ? store.users.find((user) => user.id === userId) : null;
}
function authenticated(request, response, next) {
  const user = userFor(request);
  if (!user) return response.status(401).json({ code: 'UNAUTHENTICATED', message: 'Sign in to continue.' });
  request.user = user;
  next();
}
function roles(...allowed) {
  return (request, response, next) => allowed.includes(request.user.role)
    ? next()
    : response.status(403).json({ code: 'FORBIDDEN', message: 'Your account cannot perform this action.' });
}
function notify(target, notification) {
  const item = { id: randomUUID(), ...target, ...notification, read: false, createdAt: new Date().toISOString() };
  store.notifications.unshift(item);
  io.emit('notification:new', item);
  return item;
}
function reportChanged(report) {
  io.to('role:administrator').emit('report:changed', report);
  if (report.citizenId) io.to(`user:${report.citizenId}`).emit('report:changed', report);
  if (report.assignedVehicleId) io.emit('report:changed', report);
}
function getReport(id) { return store.reports.find((report) => report.id === id); }

app.post('/api/auth/login', (request, response) => {
  const user = store.users.find((candidate) => candidate.email.toLowerCase() === String(request.body.email || '').toLowerCase());
  if (!user || request.body.password !== password) return response.status(401).json({ code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' });
  const token = randomUUID();
  sessions.set(token, user.id);
  response.cookie('access_token', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 8 * 60 * 60 * 1000, path: '/' });
  response.json({ success: true, user: publicUser(user) });
});
app.post('/api/auth/register', async (request, response) => {
  const { name, email, password: requestedPassword } = request.body;
  if (!name || !email || !requestedPassword || requestedPassword.length < 10) return response.status(422).json({ message: 'Name, email, and a password of at least 10 characters are required.' });
  if (store.users.some((user) => user.email.toLowerCase() === email.toLowerCase())) return response.status(409).json({ message: 'An account with this email already exists.' });
  const user = { id: randomUUID(), publicId: `CIT-${Date.now().toString(36).toUpperCase()}`, name, email: email.toLowerCase(), role: 'citizen', ward: request.body.ward || null, phoneNumber: request.body.phoneNumber || null, points: 0 };
  await updateStore((state) => state.users.push(user));
  const token = randomUUID();
  sessions.set(token, user.id);
  response.cookie('access_token', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 8 * 60 * 60 * 1000, path: '/' });
  response.status(201).json({ success: true, user: publicUser(user) });
});
app.get('/api/auth/me', authenticated, (request, response) => response.json({ success: true, user: publicUser(request.user) }));
app.post('/api/auth/logout', (request, response) => {
  if (request.cookies.access_token) sessions.delete(request.cookies.access_token);
  response.clearCookie('access_token', { httpOnly: true, sameSite: 'lax', path: '/' });
  response.status(204).end();
});

app.get('/api/reports', authenticated, (request, response) => {
  let reports = store.reports;
  if (request.user.role === 'citizen') reports = reports.filter((report) => report.citizenId === request.user.id);
  if (request.user.role === 'driver') reports = reports.filter((report) => report.assignedVehicleId === request.user.assignedTruckId || report.assignedDriverName === request.user.name);
  response.json({ success: true, reports: [...reports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
});
app.get('/api/reports/my-reports', authenticated, (request, response) => response.json({ success: true, reports: store.reports.filter((report) => report.citizenId === request.user.id) }));
app.post('/api/reports', authenticated, roles('citizen'), uploadImage.single('image'), async (request, response) => {
  if (!request.file) return response.status(422).json({ code: 'IMAGE_REQUIRED', message: 'Upload a JPEG, PNG, or WEBP photo (maximum 5 MB).' });
  const location = { lat: Number(request.body.latitude), lng: Number(request.body.longitude), address: request.body.locationLabel, ward: request.body.ward || request.user.ward || 'Ward not specified' };
  const nearby = findNearbyDuplicates(location.lat, location.lng, store.reports, 100);
  const recurrenceCount = nearby.length ? Math.max(1, nearby[0].report.duplicateInfo?.corroborationCount || 1) + 1 : 1;
  const analysis = analyzeWasteImage({ category: request.body.category, recurrenceCount, isPublicLocation: true });
  const id = `SW-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;
  const report = {
    id,
    source: 'website',
    title: request.body.title || `${analysis.categoryLabel} dumping reported at ${location.address}`,
    description: request.body.description || 'Citizen report submitted for municipal review.',
    imageUrl: `${publicApiUrl}/uploads/${request.file.filename}`,
    afterImageUrl: null,
    category: analysis.category,
    location,
    status: 'pending',
    priority: analysis.priority,
    priorityScore: analysis.priorityScore,
    priorityReason: analysis.priorityReason,
    wqi: { ...analysis.wqi, estimatedVolumeM3: analysis.estimatedVolumeM3, estimatedAreaM2: analysis.estimatedAreaM2, estimatedWeightKg: analysis.estimatedWeightKg, aiConfidence: analysis.aiConfidence },
    duplicateInfo: { isDuplicate: nearby.length > 0, parentReportId: nearby[0]?.report.id || null, corroborationCount: recurrenceCount, linkedReports: [] },
    assignedVehicleId: null,
    assignedDriverName: null,
    citizenId: request.user.id,
    citizenName: request.user.name,
    citizenEmail: request.user.email,
    createdAt: new Date().toISOString(),
    timeline: [{ status: 'submitted', timestamp: new Date().toISOString(), actor: `Citizen (${request.user.name})`, note: `Photo report submitted. WQI ${analysis.wqi.total}/100.` }]
  };
  await updateStore((state) => {
    state.reports.unshift(report);
    if (nearby[0]) {
      const parent = state.reports.find((item) => item.id === nearby[0].report.id);
      if (parent) {
        parent.duplicateInfo = { ...parent.duplicateInfo, corroborationCount: (parent.duplicateInfo?.corroborationCount || 1) + 1, linkedReports: [...(parent.duplicateInfo?.linkedReports || []), id] };
        parent.priorityScore = Math.min(100, (parent.priorityScore || 50) + 5);
      }
    }
    notify({ targetRole: 'administrator' }, { type: 'report_submitted', title: 'New citizen report', message: `${report.id} was submitted at ${location.address}.`, entityType: 'report', entityId: id });
  });
  reportChanged(report);
  response.status(201).json({ success: true, report });
});

app.patch('/api/admin/reports/:id/verify', authenticated, roles('administrator'), async (request, response) => {
  const report = getReport(request.params.id);
  if (!report) return response.status(404).json({ message: 'Report not found.' });
  const now = new Date().toISOString();
  const next = request.body.action === 'reject' ? 'rejected' : 'verified';
  await updateStore((state) => {
    const target = getReport(request.params.id);
    target.status = next;
    if (Number.isFinite(Number(request.body.estimatedWeightKg))) target.planningWeightKg = Number(request.body.estimatedWeightKg);
    target.timeline.push({ status: next, timestamp: now, actor: `Admin (${request.user.name})`, note: request.body.reason || `Report ${next} by municipal administrator.` });
    notify({ userId: target.citizenId }, { type: 'report_status_changed', title: 'Report reviewed', message: `${target.id} was ${next}.`, entityType: 'report', entityId: target.id });
  });
  reportChanged(report);
  response.json({ success: true, report });
});

app.patch('/api/reports/:id/assign', authenticated, roles('administrator'), async (request, response) => {
  const report = getReport(request.params.id);
  const vehicle = store.vehicles.find((item) => item.id === request.body.vehicleId);
  if (!report) return response.status(404).json({ message: 'Report not found.' });
  if (!vehicle) return response.status(404).json({ message: 'Vehicle not found.' });
  if (vehicle.status === 'maintenance') return response.status(422).json({ message: 'This vehicle is not available for assignment.' });
  const driver = store.users.find((item) => item.id === vehicle.driverUserId || item.assignedTruckId === vehicle.id);
  const now = new Date().toISOString();
  await updateStore((state) => {
    const target = getReport(request.params.id);
    target.status = 'assigned';
    target.assignedVehicleId = vehicle.id;
    target.assignedDriverName = driver?.name || vehicle.driverName || null;
    target.timeline.push({ status: 'assigned', timestamp: now, actor: `Admin (${request.user.name})`, note: `Assigned to ${vehicle.name}${target.assignedDriverName ? ` (${target.assignedDriverName})` : ''}.` });
    vehicle.assignedTasks = [...new Set([...(vehicle.assignedTasks || []), target.id])];
    vehicle.status = 'on_route';
    notify(driver ? { userId: driver.id } : { targetRole: 'driver' }, { type: 'vehicle_assigned', title: 'New collection assignment', message: `${target.id} has been assigned to ${vehicle.name}.`, entityType: 'report', entityId: target.id });
    notify({ userId: target.citizenId }, { type: 'vehicle_assigned', title: 'Collection vehicle assigned', message: `${vehicle.name} is assigned to ${target.id}.`, entityType: 'report', entityId: target.id });
  });
  reportChanged(report);
  response.json({ success: true, report });
});

app.patch('/api/reports/:id/status', authenticated, async (request, response) => {
  const report = getReport(request.params.id);
  if (!report) return response.status(404).json({ message: 'Report not found.' });
  if (request.user.role === 'citizen') return response.status(403).json({ message: 'Citizens cannot change report status.' });
  if (request.user.role === 'driver' && report.assignedVehicleId !== request.user.assignedTruckId) return response.status(403).json({ message: 'This report is not assigned to your vehicle.' });
  const allowed = ['on_the_way', 'arrived', 'collected', 'resolved'];
  if (!allowed.includes(request.body.status)) return response.status(422).json({ message: 'Invalid collection status.' });
  const now = new Date().toISOString();
  let proofUrl = null;
  if (request.body.afterImageUrl) {
    const dataUrl = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(request.body.afterImageUrl);
    if (dataUrl) {
      const extension = dataUrl[1] === 'jpeg' ? 'jpg' : dataUrl[1];
      const filename = `${randomUUID()}.${extension}`;
      await fs.writeFile(path.join(uploadDir, filename), Buffer.from(dataUrl[2], 'base64'));
      proofUrl = `${publicApiUrl}/uploads/${filename}`;
    } else {
      proofUrl = String(request.body.afterImageUrl).slice(0, 2048);
    }
  }
  await updateStore((state) => {
    const target = getReport(request.params.id);
    target.status = request.body.status;
    if (proofUrl) target.afterImageUrl = proofUrl;
    target.timeline.push({ status: request.body.status, timestamp: now, actor: `${request.user.role === 'driver' ? 'Driver' : 'Admin'} (${request.user.name})`, note: request.body.note || `Collection status changed to ${request.body.status.replaceAll('_', ' ')}.` });
    notify({ userId: target.citizenId }, { type: 'report_status_changed', title: 'Collection status updated', message: `${target.id} is now ${request.body.status.replaceAll('_', ' ')}.`, entityType: 'report', entityId: target.id });
    notify({ targetRole: 'administrator' }, { type: 'report_status_changed', title: 'Collection status updated', message: `${target.id} is now ${request.body.status.replaceAll('_', ' ')}.`, entityType: 'report', entityId: target.id });
  });
  reportChanged(report);
  response.json({ success: true, report });
});

app.get('/api/vehicles', authenticated, (_request, response) => response.json({ success: true, vehicles: store.vehicles.map((vehicle) => ({ ...vehicle, location: vehicle.location || null, driverName: vehicle.driverName || store.users.find((user) => user.id === vehicle.driverUserId)?.name || null })) }));
app.get('/api/notifications', authenticated, (request, response) => {
  const notifications = store.notifications.filter((item) => !item.userId || item.userId === request.user.id || item.targetRole === request.user.role || item.targetRole === 'all');
  response.json({ success: true, notifications: notifications.slice(0, 100) });
});
app.patch('/api/notifications/:id/read', authenticated, async (request, response) => {
  await updateStore((state) => { const notification = state.notifications.find((item) => item.id === request.params.id); if (notification) notification.read = true; });
  response.json({ success: true });
});
app.post('/api/routes/optimize', authenticated, roles('administrator'), (request, response) => response.json({ success: true, orderedStops: request.body.stops || [], note: 'Local demo route optimization endpoint.' }));
app.use((error, _request, response, _next) => {
  console.error('[local-api]', error.message);
  response.status(error.status || (error.code === 'LIMIT_FILE_SIZE' ? 413 : 500)).json({ message: error.message || 'Local API error.' });
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: allowFrontendOrigin, credentials: true } });
io.use((socket, next) => {
  const cookieHeader = socket.handshake.headers.cookie || '';
  const entry = cookieHeader.split(';').map((part) => part.trim()).find((part) => part.startsWith('access_token='));
  const token = entry ? decodeURIComponent(entry.slice('access_token='.length)) : null;
  const userId = token && sessions.get(token);
  const user = userId && store.users.find((candidate) => candidate.id === userId);
  if (!user) return next(new Error('Unauthorized socket connection'));
  socket.data.user = user;
  next();
});
io.on('connection', (socket) => {
  socket.join(`user:${socket.data.user.id}`);
  socket.join(`role:${socket.data.user.role}`);
});

server.listen(port, () => console.log(`Click 2 Clean local API listening on http://localhost:${port} (JSON file storage)`));

function shutdown() {
  io.close();
  server.close();
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
