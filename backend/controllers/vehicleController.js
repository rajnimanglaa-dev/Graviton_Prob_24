import { z } from 'zod';
import { createVehicle, listVehicles } from '../models/repositories.js';
import { id, publicId } from '../utils/ids.js';

export const vehicleSchema = z.object({
  name: z.string().trim().min(3).max(160),
  registrationNumber: z.string().trim().min(3).max(60),
  vehicleType: z.string().trim().min(2).max(80),
  capacityKg: z.coerce.number().positive().max(100000),
  currentLoadKg: z.coerce.number().min(0).optional(),
  driverUserId: z.string().uuid().optional(),
  latitude: z.coerce.number().gte(-90).lte(90).optional(),
  longitude: z.coerce.number().gte(-180).lte(180).optional()
}).superRefine((value, context) => {
  if ((value.latitude === undefined) !== (value.longitude === undefined)) context.addIssue({ code: 'custom', message: 'Vehicle coordinates must be supplied together.' });
  if (value.currentLoadKg !== undefined && value.currentLoadKg > value.capacityKg) context.addIssue({ code: 'custom', message: 'Current load cannot exceed vehicle capacity.' });
});

export async function list(request, response) {
  response.json({ success: true, vehicles: await listVehicles() });
}

export async function create(request, response) {
  const vehicle = await createVehicle({ id: id(), publicId: publicId('VEH'), ...request.body });
  response.status(201).json({ success: true, vehicle });
}
