/**
 * SmartWaste Geolocation & Duplicate Detection Engine
 * Uses Haversine Distance algorithm for GPS coordinates proximity clustering
 */

const EARTH_RADIUS_METERS = 6371000;

export function calculateDistanceMeters(lat1, lng1, lat2, lng2) {
  if (!lat1 || !lng1 || !lat2 || !lng2) return 0;
  
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_METERS * c);
}

export function formatDistance(meters) {
  if (meters < 1000) {
    return `${meters} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

export function findNearbyDuplicates(newLat, newLng, existingReports, thresholdMeters = 100) {
  const duplicates = [];

  for (const report of existingReports) {
    if (["resolved", "rejected"].includes(report.status)) continue;
    if (!report.location || !report.location.lat || !report.location.lng) continue;

    const distance = calculateDistanceMeters(newLat, newLng, report.location.lat, report.location.lng);
    if (distance <= thresholdMeters) {
      duplicates.push({
        report,
        distanceMeters: distance
      });
    }
  }

  duplicates.sort((a, b) => a.distanceMeters - b.distanceMeters);
  return duplicates;
}

export const DEFAULT_MAP_CENTER = {
  lat: 28.6139,
  lng: 77.2090,
  zoom: 13,
  city: "Central City Zone"
};
