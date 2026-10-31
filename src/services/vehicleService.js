import { calculateDistanceMeters, formatDistance } from "./geoService.js";

export function recommendVehiclesForReport(report, vehicles) {
  if (!report || !vehicles || vehicles.length === 0) return [];

  const wasteLat = report.location?.lat || 28.6139;
  const wasteLng = report.location?.lng || 77.2090;
  const estWeightKg = report.wqi?.estimatedWeightKg || Math.round((report.wqi?.estimatedVolumeM3 || 2) * 400);
  const wasteCategory = report.category || "mixed";

  const scoredVehicles = vehicles.map(vehicle => {
    const isAvailable = vehicle.status === "available" || vehicle.status === "on_route";
    if (vehicle.status === "maintenance") {
      return {
        vehicle,
        score: 0,
        eligible: false,
        reasons: ["Vehicle is currently in maintenance."]
      };
    }

    const remainingCapKg = Math.max(0, vehicle.capacityKg - vehicle.currentLoadKg);
    const capacityRatio = remainingCapKg / (estWeightKg || 1);
    const hasEnoughCapacity = remainingCapKg >= estWeightKg;

    const distanceMeters = calculateDistanceMeters(
      vehicle.location.lat,
      vehicle.location.lng,
      wasteLat,
      wasteLng
    );
    const distanceKm = distanceMeters / 1000;

    let distanceScore = Math.max(0, 40 - (distanceKm * 3.5));

    let capacityScore = 0;
    if (hasEnoughCapacity) {
      capacityScore = 30;
      if (capacityRatio >= 1.2 && capacityRatio <= 4.0) {
        capacityScore = 30;
      }
    } else {
      capacityScore = Math.max(5, Math.round((remainingCapKg / estWeightKg) * 20));
    }

    let typeScore = 15;
    let typeFitReason = "Compatible general fleet unit";

    if (wasteCategory === "construction") {
      if (vehicle.type.toLowerCase().includes("tipper")) {
        typeScore = 20;
        typeFitReason = "Optimal match: Heavy hydraulic tipper for construction debris";
      } else {
        typeScore = 8;
        typeFitReason = "Sub-optimal: Heavy debris can damage standard compactor blades";
      }
    } else if (wasteCategory === "plastic" || wasteCategory === "mixed") {
      if (vehicle.type.toLowerCase().includes("compactor")) {
        typeScore = 20;
        typeFitReason = "Optimal match: High volumetric compression ratio for plastic/mixed waste";
      }
    } else if (wasteCategory === "organic" || report.wqi?.estimatedVolumeM3 < 1.5) {
      if (vehicle.type.toLowerCase().includes("van") || vehicle.type.toLowerCase().includes("medium")) {
        typeScore = 20;
        typeFitReason = "Optimal match: Rapid agile low-emission dispatch for moderate volume";
      }
    }

    const taskCount = (vehicle.assignedTasks || []).length;
    let queueScore = Math.max(2, 10 - (taskCount * 3));

    const totalScore = Math.min(100, Math.round(distanceScore + capacityScore + typeScore + queueScore));

    const reasons = [
      `Distance: ${formatDistance(distanceMeters)} away (${Math.round(distanceKm * 2.5)} mins ETA)`,
      `Payload: ${remainingCapKg} kg capacity remaining (Waste: ~${estWeightKg} kg)`,
      typeFitReason
    ];

    if (!hasEnoughCapacity) {
      reasons.push(`Warning: Requires ${estWeightKg - remainingCapKg} kg more capacity than currently available.`);
    }

    return {
      vehicle,
      score: totalScore,
      eligible: hasEnoughCapacity && vehicle.status !== "maintenance",
      distanceMeters,
      distanceFormatted: formatDistance(distanceMeters),
      estimatedEtaMins: Math.max(5, Math.round(distanceKm * 2.8 + 4)),
      remainingCapacityKg: remainingCapKg,
      reasons
    };
  });

  scoredVehicles.sort((a, b) => b.score - a.score);
  return scoredVehicles;
}
