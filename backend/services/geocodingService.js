import { env } from '../config/env.js';

export async function geocodeLocation(label) {
  const url = new URL('/search', env.geocoderBaseUrl);
  url.searchParams.set('q', label);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '1');
  try {
    const response = await fetch(url, { headers: { 'User-Agent': env.geocoderUserAgent, Accept: 'application/json' }, signal: AbortSignal.timeout(7000) });
    if (!response.ok) return null;
    const results = await response.json();
    if (!results[0]) return null;
    const latitude = Number(results[0].lat);
    const longitude = Number(results[0].lon);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
    return { latitude, longitude };
  } catch {
    return null;
  }
}
