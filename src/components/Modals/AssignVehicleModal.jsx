import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { recommendVehiclesForReport } from "../../services/vehicleService.js";
import { Truck, Sparkles, Check, AlertCircle, X, ShieldCheck, MapPin } from "lucide-react";

export default function AssignVehicleModal({ report, isOpen, onClose }) {
  const { vehicles, assignVehicleToReport } = useApp();
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !report) return null;

  // Run vehicle recommendation algorithm
  const recommendations = recommendVehiclesForReport(report, vehicles);
  const bestRecommendation = recommendations[0];

  const handleAssign = () => {
    const targetId = selectedVehicleId || (bestRecommendation ? bestRecommendation.vehicle.id : null);
    if (!targetId) return;

    setIsSubmitting(true);
    setTimeout(() => {
      assignVehicleToReport(report.id, targetId);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="bg-[#174C37] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Truck size={22} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Assign Collection Vehicle</h3>
              <p className="text-xs text-white/80">
                Dispatch task for Report {report.id} ({report.priority.toUpperCase()} Priority)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Target Incident Summary */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="font-semibold text-stone-700">📍 Waste Location:</span>
              <span className="text-stone-600">{report.location.address}</span>
            </div>
            <div className="text-stone-500">
              Est. Volume: <strong className="text-stone-800">{report.wqi?.estimatedVolumeM3 || 2.5} m³</strong>
            </div>
          </div>

          {/* AI Recommended Vehicle Highlight */}
          {bestRecommendation && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 border-2 border-emerald-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#174C37] text-white">
                  <Sparkles size={13} />
                  AI Recommended Match ({bestRecommendation.score}% Match)
                </span>
                <span className="text-xs font-semibold text-emerald-800">
                  ETA: ~{bestRecommendation.estimatedEtaMins} mins
                </span>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div>
                  <h4 className="font-bold text-stone-900 text-base">
                    {bestRecommendation.vehicle.name} ({bestRecommendation.vehicle.id})
                  </h4>
                  <p className="text-xs text-stone-600">
                    Driver: {bestRecommendation.vehicle.driverName} • Type: {bestRecommendation.vehicle.type}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedVehicleId(bestRecommendation.vehicle.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    (selectedVehicleId === bestRecommendation.vehicle.id || !selectedVehicleId)
                      ? "bg-[#174C37] text-white shadow-sm"
                      : "bg-white border border-stone-300 text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  {(selectedVehicleId === bestRecommendation.vehicle.id || !selectedVehicleId) && <Check size={14} />}
                  {(selectedVehicleId === bestRecommendation.vehicle.id || !selectedVehicleId) ? "Selected" : "Select"}
                </button>
              </div>

              {/* Rationale list */}
              <div className="mt-3 pt-3 border-t border-emerald-200/60 space-y-1">
                <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider block mb-1">
                  Selection Rationale:
                </span>
                {bestRecommendation.reasons.map((reason, idx) => (
                  <div key={idx} className="text-xs text-emerald-900 flex items-center gap-1.5">
                    <span className="text-emerald-600">•</span>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Available Vehicles List */}
          <div>
            <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-3">
              All Fleet Units ({vehicles.length})
            </h4>
            <div className="space-y-2.5">
              {recommendations.map(({ vehicle, score, distanceFormatted, remainingCapacityKg, eligible }) => {
                const isSelected = selectedVehicleId === vehicle.id || (!selectedVehicleId && bestRecommendation?.vehicle.id === vehicle.id);
                return (
                  <div
                    key={vehicle.id}
                    onClick={() => eligible && setSelectedVehicleId(vehicle.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "border-[#174C37] bg-emerald-50/40 ring-2 ring-[#174C37]/20"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    } ${!eligible ? "opacity-60 cursor-not-allowed bg-stone-50" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        isSelected ? "bg-[#174C37] text-white" : "bg-stone-100 text-stone-600"
                      }`}>
                        <Truck size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-stone-800">{vehicle.name}</span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                            {vehicle.id}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500">
                          {vehicle.driverName} • {distanceFormatted} away • {remainingCapacityKg} kg capacity free
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-bold text-stone-700">{score}% Fit</span>
                        <div className="text-[10px] text-stone-500 capitalize">{vehicle.status.replace("_", " ")}</div>
                      </div>
                      <input
                        type="radio"
                        name="selectedVehicle"
                        checked={isSelected}
                        onChange={() => eligible && setSelectedVehicleId(vehicle.id)}
                        disabled={!eligible}
                        className="text-[#174C37] focus:ring-[#174C37] h-4 w-4"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAssign}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-[#174C37] text-white text-xs font-bold hover:bg-[#0f3325] shadow-sm transition flex items-center gap-2 disabled:opacity-50"
          >
            <ShieldCheck size={16} />
            <span>{isSubmitting ? "Dispatching..." : "Confirm & Dispatch Vehicle"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
