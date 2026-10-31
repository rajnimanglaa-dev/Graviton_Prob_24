import { spawn } from 'node:child_process';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export const MUNICIPAL_DEPOT = { name: 'Central Municipal Fleet Depot', latitude: 28.6139, longitude: 77.2090, address: 'Central municipal fleet depot' };
export const PROCESSING_FACILITY = { name: 'Regional Solid Waste Processing Facility', latitude: 28.642, longitude: 77.235, address: 'Regional solid waste processing facility' };

function coordinateString(points) {
  return points.map((point) => point.longitude + ',' + point.latitude).join(';');
}

export async function osrmTable(points) {
  const url = env.osrmBaseUrl.replace(/\/$/, '') + '/table/v1/driving/' + coordinateString(points) + '?annotations=distance,duration';
  let response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  } catch {
    throw new ApiError(503, 'The OSRM routing service is unavailable. No route was generated.', 'OSRM_UNAVAILABLE');
  }
  if (!response.ok) throw new ApiError(502, 'OSRM could not calculate road-network travel costs.', 'OSRM_FAILED');
  const payload = await response.json();
  if (payload.code !== 'Ok' || !payload.distances || !payload.durations) {
    throw new ApiError(502, 'OSRM returned an incomplete route matrix.', 'OSRM_INVALID_RESPONSE');
  }
  return { distances: payload.distances, durations: payload.durations };
}

export async function osrmRoute(points) {
  const url = env.osrmBaseUrl.replace(/\/$/, '') + '/route/v1/driving/' + coordinateString(points) + '?overview=full&geometries=geojson';
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) }).catch(() => null);
  if (!response || !response.ok) throw new ApiError(503, 'OSRM route geometry is unavailable. No route was saved.', 'OSRM_UNAVAILABLE');
  const payload = await response.json();
  const route = payload.routes && payload.routes[0];
  if (!route) throw new ApiError(502, 'OSRM did not return a route geometry.', 'OSRM_INVALID_RESPONSE');
  return { distanceMeters: route.distance, durationSeconds: route.duration, geometry: route.geometry };
}

export async function optimizeWithOrtools(input) {
  return new Promise((resolve, reject) => {
    const child = spawn(env.pythonBin, ['backend/python/route_optimizer.py'], { cwd: process.cwd(), stdio: ['pipe', 'pipe', 'pipe'] });
    let output = '';
    let errorOutput = '';
    child.stdout.on('data', (chunk) => { output += chunk; });
    child.stderr.on('data', (chunk) => { errorOutput += chunk; });
    child.on('error', () => reject(new ApiError(503, 'Google OR-Tools is not available. Install backend/requirements.txt to enable routing.', 'ORTOOLS_UNAVAILABLE')));
    child.on('close', (code) => {
      if (code !== 0) return reject(new ApiError(503, 'Google OR-Tools optimization failed: ' + errorOutput.slice(0, 300), 'ORTOOLS_FAILED'));
      try {
        resolve(JSON.parse(output));
      } catch {
        reject(new ApiError(502, 'Google OR-Tools returned an invalid optimization result.', 'ORTOOLS_INVALID_RESPONSE'));
      }
    });
    child.stdin.end(JSON.stringify(input));
  });
}
