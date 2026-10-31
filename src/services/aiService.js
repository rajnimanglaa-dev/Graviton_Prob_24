/**
 * SmartWaste AI Detection & WQI Engine
 * Deterministic Demo Analysis Engine (CV / YOLOv8 Architecture Ready)
 */

export const CATEGORY_SPECS = {
  plastic: {
    label: "Plastic Waste",
    baseHazard: 16,
    defaultDensityKgM3: 65,
    recommendedVehicle: "Heavy Compactor Truck",
    tags: ["Non-Biodegradable", "Clogging Risk", "High Recyclability Potential"]
  },
  construction: {
    label: "Construction & Demolition Debris",
    baseHazard: 14,
    defaultDensityKgM3: 1200,
    recommendedVehicle: "Tipper Truck",
    tags: ["Heavy Load", "Obstructive", "Requires Hydraulic Lift"]
  },
  organic: {
    label: "Organic & Kitchen Waste",
    baseHazard: 10,
    defaultDensityKgM3: 400,
    recommendedVehicle: "Medium Compactor",
    tags: ["Rapid Decomposition", "Vector Breeding Risk", "Compostable"]
  },
  mixed: {
    label: "Mixed Urban Garbage",
    baseHazard: 15,
    defaultDensityKgM3: 350,
    recommendedVehicle: "Heavy Compactor Truck",
    tags: ["Unsegregated", "Odor Hazard", "Public Health Impact"]
  },
  household: {
    label: "Household Solid Waste",
    baseHazard: 11,
    defaultDensityKgM3: 250,
    recommendedVehicle: "Medium Compactor",
    tags: ["Daily Refuse", "Packaging", "Requires Sorting"]
  },
  other: {
    label: "Unclassified Solid Waste",
    baseHazard: 10,
    defaultDensityKgM3: 300,
    recommendedVehicle: "Electric Van",
    tags: ["General Refuse"]
  }
};

export function analyzeWasteImage({ category = "mixed", imageFile = null, recurrenceCount = 1, isPublicLocation = true }) {
  const cat = CATEGORY_SPECS[category] ? category : "mixed";
  const spec = CATEGORY_SPECS[cat];

  let estimatedVolumeM3 = 2.4;
  let estimatedAreaM2 = 8.0;
  let confidence = 94.5;

  if (cat === "plastic") {
    estimatedVolumeM3 = 3.6;
    estimatedAreaM2 = 12.5;
    confidence = 96.2;
  } else if (cat === "construction") {
    estimatedVolumeM3 = 5.2;
    estimatedAreaM2 = 14.0;
    confidence = 97.4;
  } else if (cat === "organic") {
    estimatedVolumeM3 = 1.6;
    estimatedAreaM2 = 5.5;
    confidence = 92.8;
  } else if (cat === "household") {
    estimatedVolumeM3 = 1.2;
    estimatedAreaM2 = 4.0;
    confidence = 91.5;
  } else {
    estimatedVolumeM3 = 2.8;
    estimatedAreaM2 = 9.2;
    confidence = 93.9;
  }

  // Multi-factor WQI Calculation
  const volumeScore = Math.min(40, Math.round((estimatedVolumeM3 / 5.5) * 40));
  const areaScore = Math.min(25, Math.round((estimatedAreaM2 / 15.0) * 25));
  const hazardScore = Math.min(20, spec.baseHazard);
  const recurrenceScore = Math.min(15, Math.round(Math.min(recurrenceCount, 4) * 3.75));

  const wqiTotal = Math.min(100, Math.max(5, volumeScore + areaScore + hazardScore + recurrenceScore));

  let severityLevel = "Low";
  let priority = "low";
  let urgency = "Standard 48-Hour Routine";

  if (wqiTotal >= 76) {
    severityLevel = "Critical";
    priority = "critical";
    urgency = "Immediate Dispatch (Within 2 Hours)";
  } else if (wqiTotal >= 51) {
    severityLevel = "High";
    priority = "high";
    urgency = "Expedited Clearance (Within 4-6 Hours)";
  } else if (wqiTotal >= 26) {
    severityLevel = "Medium";
    priority = "medium";
    urgency = "Standard Same-Day Clearance";
  } else {
    severityLevel = "Low";
    priority = "low";
    urgency = "Scheduled Route Collection";
  }

  const publicLocationBonus = isPublicLocation ? 14 : 5;
  const recurrenceBonus = Math.min(20, recurrenceCount * 6);
  const priorityScore = Math.min(100, Math.round((wqiTotal * 0.55) + publicLocationBonus + (recurrenceBonus * 0.5) + 8));

  const priorityReason = `${severityLevel} Priority (${priorityScore}/100): Calculated WQI of ${wqiTotal}/100 with ${estimatedVolumeM3}m3 estimated ${spec.label.toLowerCase()} covering ${estimatedAreaM2}m2. ${
    isPublicLocation ? "Located in high-footfall public corridor." : ""
  } ${recurrenceCount > 1 ? `Corroborated by ${recurrenceCount} citizen reports.` : ""}`;

  return {
    category: cat,
    categoryLabel: spec.label,
    aiConfidence: confidence,
    estimatedVolumeM3,
    estimatedAreaM2,
    estimatedWeightKg: Math.round(estimatedVolumeM3 * spec.defaultDensityKgM3),
    wqi: {
      total: wqiTotal,
      volumeScore,
      areaScore,
      hazardScore,
      recurrenceScore,
      severityLevel,
      recommendedVehicle: spec.recommendedVehicle,
      urgency
    },
    priority,
    priorityScore,
    priorityReason,
    boundingDetections: [
      { label: spec.label, confidence: `${confidence}%`, box: "x: 18%, y: 24%, w: 64%, h: 56%" },
      { label: "Ground Contamination Spread", confidence: "88.2%", box: "x: 12%, y: 58%, w: 76%, h: 32%" }
    ],
    technicalNote: "Processed via Deterministic CV Pipeline. YOLOv8 / Roboflow inference API weights ready."
  };
}
