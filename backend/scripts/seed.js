import bcrypt from 'bcryptjs';
import { pool, withTransaction } from '../config/db.js';
import { createUser, createVehicle } from '../models/repositories.js';
import { id } from '../utils/ids.js';

const password = 'DemoPass123!';

async function userFor(email, data, connection) {
  const [existing] = await connection.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
  if (existing[0]) return existing[0].id;
  const user = await createUser({
    id: id(),
    publicId: data.publicId,
    name: data.name,
    email,
    passwordHash: await bcrypt.hash(password, 12),
    phoneNumber: data.phoneNumber,
    role: data.role,
    ward: data.ward
  }, connection);
  return user.id;
}

try {
  await withTransaction(async (connection) => {
    const citizenId = await userFor('citizen@fixmyarea.local', {
      publicId: 'CIT-DEMO', name: 'Priya Sharma', phoneNumber: '9810123456',
      role: 'citizen', ward: 'Ward 7 - Civil Lines'
    }, connection);
    const adminId = await userFor('admin@fixmyarea.local', {
      publicId: 'ADM-DEMO', name: 'Director Rajiv Verma', phoneNumber: '9820099887',
      role: 'administrator', ward: null
    }, connection);
    const driverId = await userFor('driver@fixmyarea.local', {
      publicId: 'DRV-DEMO', name: 'Rajesh Kumar', phoneNumber: '9876543210',
      role: 'driver', ward: null
    }, connection);
    const [existingVehicle] = await connection.query('SELECT id FROM vehicles WHERE registration_number = ? LIMIT 1', ['CH01-DEMO-01']);
    if (!existingVehicle[0]) {
      await createVehicle({
        id: id(),
        publicId: 'VEH-DEMO-01',
        name: 'Demo Heavy Compactor',
        registrationNumber: 'CH01-DEMO-01',
        vehicleType: 'Heavy Compactor',
        capacityKg: 8000,
        currentLoadKg: 0,
        status: 'available',
        driverUserId: driverId,
        latitude: 28.6139,
        longitude: 77.209
      }, connection);
    }
    await connection.query('UPDATE users SET points = 420 WHERE id = ?', [citizenId]);
    await connection.query('UPDATE users SET is_active = TRUE WHERE id IN (?, ?, ?)', [citizenId, adminId, driverId]);
  });
  console.log('Seeded local demo users and vehicle. Password for all demo users: ' + password);
} catch (error) {
  console.error('Database seed failed:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
