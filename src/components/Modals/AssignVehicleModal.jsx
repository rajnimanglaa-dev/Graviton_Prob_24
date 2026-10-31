import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { recommendVehiclesForReport } from "../../services/vehicleService.js";
import { getWasteVisualCategory } from "../../services/wasteCategoryTheme.js";
import { Truck, Sparkles, Check, AlertCircle, X, ShieldCheck, MapPin } from "lucide-react";

export default function AssignVehicleModal({ report, isOpen, onClose }) {
  const { vehicles, assignVehicleToReport } = useApp();
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !report) return null;

  const recommendations = recommendVehiclesForReport(report, vehicles);
  const bestRecommendation = recommendations[0];
  const visualCat = getWasteVisualCategory(report.category);

  const handleAssign = async () => {
    const targetId = selectedVehicleId || (bestRecommendation ? bestRecommendation.vehicle.id : null);
    if (!targetId) return;

    setIsSubmitting(true);
    try {
      await assignVehicleToReport(report.id, targetId);
      setIsSubmitting(false);
      onClose();
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn text-[#F5F7F5]">
      <div className="bg-[#1D2B25] rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-[#273b33]">
        {/* Header */}
        <div className="bg-[#142820] text-white p-5 flex items-center justify-between border-b border-[#273b33]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#16A36A]/20 border border-[#16A36A]/40 flex items-center justify-center">
              <Truck size={22} className="text-[#8BE0B0]" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading">Assign Collection Vehicle</h3>
              <p className="text-xs text-[#A5B3AA]">
                Dispatch task for Report {report.id} ({report.priority.toUpperCase()} Priority)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-[#A5B3AA] hover:bg-[#1D2B25] hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Target Incident Summary */}
          <div className="p-3.5 bg-[#142820] rounded-2xl border border-[#273b33] text-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="font-semibold text-[#8BE0B0]">📍 Waste Location:</span>
              <span className="text-[#A5B3AA]">{report.location.address}</span>
            </div>
            <div className="text-[#A5B3AA]">
              Stream: <strong style={{ color: visualCat.mint }}>{visualCat.name}</strong> • Planning weight: <strong className="text-[#F5F7F5] font-stat">{report.planningWeightKg ? report.planningWeightKg + " kg" : "needs admin review"}</strong>
            </div>
          </div>

          {/* AI Recommended Vehicle Highlight */}
          {bestRecommendation && (
            <div className="p-4 rounded-2xl bg-[#142820] border-2 border-[#16A36A]/50">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#16A36A] text-white font-mono">
                  <Sparkles size={13} />
                  AI Recommended Match ({bestRecommendation.score}% Fit)
                </span>
                <span className="text-xs font-semibold text-[#8BE0B0] font-stat">
                  ETA: ~{bestRecommendation.estimatedEtaMins} mins
                </span>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div>
                  <h4 className="font-bold text-[#F5F7F5] text-base font-heading">
                    {bestRecommendation.vehicle.name} ({bestRecommendation.vehicle.id})
                  </h4>
                  <p className="text-xs text-[#A5B3AA]">
                    Driver: {bestRecommendation.vehicle.driverName} • Type: {bestRecommendation.vehicle.type}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedVehicleId(bestRecommendation.vehicle.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                    (selectedVehicleId === bestRecommendation.vehicle.id || !selectedVehicleId)
                      ? "bg-[#16A36A] text-white shadow-md shadow-[#16A36A]/30"
                      : "bg-[#1D2B25] border border-[#273b33] text-[#A5B3AA] hover:text-white"
                  }`}
                >
                  {(selectedVehicleId === bestRecommendation.vehicle.id || !selectedVehicleId) && <Check size={14} />}
                  {(selectedVehicleId === bestRecommendation.vehicle.id || !selectedVehicleId) ? "Selected" : "Select"}
                </button>
              </div>

              {/* Rationale list */}
              <div className="mt-3 pt-3 border-t border-[#273b33] space-y-1">
                <span className="text-[11px] font-bold text-[#8BE0B0] uppercase tracking-wider block mb-1 font-mono">
                  Selection Rationale:
                </span>
                {bestRecommendation.reasons.map((reason, idx) => (
                  <div key={idx} className="text-xs text-[#A5B3AA] flex items-center gap-1.5">
                    <span className="text-[#16A36A]">•</span>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Available Vehicles List */}
          <div>
            <h4 className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider mb-3 font-mono">
              All Fleet Units ({vehicles.length})
            </h4>
            <div className="space-y-2.5">
              {recommendations.map(({ vehicle, score, distanceFormatted, remainingCapacityKg, eligible }) => {
                const isSelected = selectedVehicleId === vehicle.id || (!selectedVehicleId && bestRecommendation?.vehicle.id === vehicle.id);
                return (
                  <div
                    key={vehicle.id}
                    onClick={() => eligible && setSelectedVehicleId(vehicle.id)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "border-[#16A36A] bg-[#16A36A]/15 ring-1 ring-[#16A36A]"
                        : "border-[#273b33] bg-[#142820] hover:border-[#16A36A]/40"
                    } ${!eligible ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? "bg-[#16A36A] text-white" : "bg-[#101A17] text-[#8BE0B0] border border-[#273b33]"
                      }`}>
                        <Truck size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#F5F7F5]">{vehicle.name}</span>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#101A17] text-[#8BE0B0] border border-[#273b33]">
                            {vehicle.id}
                          </span>
                        </div>
                        <p className="text-xs text-[#A5B3AA]">
                          {vehicle.driverName} • {distanceFormatted} away • {remainingCapacityKg} kg capacity free
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#8BE0B0] font-stat">{score}% Fit</span>
                        <div className="text-[10px] text-[#A5B3AA] capitalize font-mono">{vehicle.status.replace("_", " ")}</div>
                      </div>
                      <input
                        type="radio"
                        name="selectedVehicle"
                        checked={isSelected}
                        onChange={() => eligible && setSelectedVehicleId(vehicle.id)}
                        disabled={!eligible}
                        className="text-[#16A36A] focus:ring-[#16A36A] h-4 w-4 accent-[#16A36A]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#142820] border-t border-[#273b33] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#A5B3AA] hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAssign}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-[#16A36A] text-white text-xs font-bold hover:bg-[#0f7a4e] shadow-md shadow-[#16A36A]/30 transition flex items-center gap-2 disabled:opacity-50"
          >
            <ShieldCheck size={16} />
            <span>{isSubmitting ? "Dispatching..." : "Confirm & Dispatch Vehicle"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
