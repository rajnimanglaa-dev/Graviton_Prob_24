import { calculateDistanceMeters, formatDistance } from "./geoService.js";

export const MUNICIPAL_DEPOT = {
  name: "Central Municipal Fleet Depot",
  lat: 28.6139,
  lng: 77.2090,
  address: "Sector 1 Depot Road, Central Ward"
};

export const RECYCLING_LANDFILL = {
  name: "Regional Solid Waste Processing Facility",
  lat: 28.6420,
  lng: 77.2350,
  address: "Okhla Eco-Processing Plant, Zone B"
};

export function optimizeRoute({ startLocation = MUNICIPAL_DEPOT, stops = [] }) {
  if (!stops || stops.length === 0) {
    return {
      orderedStops: [],
      totalDistanceMeters: 0,
      totalDistanceFormatted: "0 km",
      estimatedDurationMins: 0,
      estimatedCo2SavingsKg: 0,
      polylinePoints: []
    };
  }

  const remaining = [...stops];
  const ordered = [];
  let currentLat = startLocation.lat;
  let currentLng = startLocation.lng;
  let totalDistanceMeters = 0;

  const polylinePoints = [[startLocation.lat, startLocation.lng]];

  while (remaining.length > 0) {
    let bestIndex = 0;
    let bestMetric = -Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const stop = remaining[i];
      const dist = calculateDistanceMeters(currentLat, currentLng, stop.location.lat, stop.location.lng);

      let priorityBonus = 0;
      if (stop.priority === "critical") priorityBonus = 15000;
      else if (stop.priority === "high") priorityBonus = 8000;
      else if (stop.priority === "medium") priorityBonus = 3000;

      const metric = priorityBonus - dist;

      if (metric > bestMetric) {
        bestMetric = metric;
        bestIndex = i;
      }
    }

    const nextStop = remaining.splice(bestIndex, 1)[0];
    const legDistance = calculateDistanceMeters(currentLat, currentLng, nextStop.location.lat, nextStop.location.lng);
    totalDistanceMeters += legDistance;

    ordered.push({
      ...nextStop,
      legDistanceMeters: legDistance,
      legDistanceFormatted: formatDistance(legDistance)
    });

    polylinePoints.push([nextStop.location.lat, nextStop.location.lng]);
    currentLat = nextStop.location.lat;
    currentLng = nextStop.location.lng;
  }

  const finalLeg = calculateDistanceMeters(currentLat, currentLng, RECYCLING_LANDFILL.lat, RECYCLING_LANDFILL.lng);
  totalDistanceMeters += finalLeg;
  polylinePoints.push([RECYCLING_LANDFILL.lat, RECYCLING_LANDFILL.lng]);

  const totalKm = totalDistanceMeters / 1000;
  const driveMinutes = Math.round((totalKm / 24) * 60);
  const stopHandlingMinutes = ordered.length * 12;
  const totalDurationMins = driveMinutes + stopHandlingMinutes;

  const naiveEstimatedKm = totalKm * 1.45;
  const kmSaved = naiveEstimatedKm - totalKm;
  const estimatedCo2SavingsKg = Math.round(kmSaved * 0.72);

  return {
    orderedStops: ordered,
    totalDistanceMeters,
    totalDistanceFormatted: `${totalKm.toFixed(1)} km`,
    estimatedDurationMins: totalDurationMins,
    estimatedDriveMins: driveMinutes,
    estimatedHandlingMins: stopHandlingMinutes,
    estimatedCo2SavingsKg,
    depot: MUNICIPAL_DEPOT,
    landfill: RECYCLING_LANDFILL,
    polylinePoints
  };
}
