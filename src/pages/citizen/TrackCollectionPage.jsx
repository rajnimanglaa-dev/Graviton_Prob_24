import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import {
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  ShieldCheck,
  Camera,
  AlertCircle,
  PhoneCall,
  User,
  Sparkles
} from "lucide-react";

export default function TrackCollectionPage() {
  const location = useLocation();
  const { reports, vehicles, currentUser } = useApp();

  // Parse report ID from query string if available, else pick first relevant report
  const queryParams = new URLSearchParams(location.search);
  const targetId = queryParams.get("id");

  const [selectedId, setSelectedId] = useState(targetId || reports[0]?.id);

  const activeReport = reports.find(r => r.id === selectedId) || reports[0];
  const assignedTruck = vehicles.find(v => v.id === activeReport?.assignedVehicleId);

  const TIMELINE_STEPS = [
    { key: "submitted", label: "Submitted", desc: "Citizen filed photo & GPS" },
    { key: "verified", label: "Verified", desc: "Admin verified WQI & Priority" },
    { key: "assigned", label: "Assigned", desc: "Collection truck allocated" },
    { key: "on_the_way", label: "On the Way", desc: "Driver departed depot" },
    { key: "collected", label: "Collected", desc: "Waste loaded & proof taken" },
    { key: "resolved", label: "Resolved", desc: "Final verification complete" }
  ];

  // Map status to active index
  const getStepIndex = (status) => {
    switch (status) {
      case "submitted":
      case "pending": return 0;
      case "verified": return 1;
      case "assigned": return 2;
      case "on_the_way": return 3;
      case "arrived": return 3;
      case "collected": return 4;
      case "resolved": return 5;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(activeReport?.status);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-bold text-[#174C37] uppercase tracking-wider">
            Live Complaint Tracking Timeline
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#202923] tracking-tight mt-1">
          Track Waste Collection Progress
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Real-time end-to-end municipal progress tracking from dispatch to before/after photographic proof verification.
        </p>
      </div>

      {/* Report Selector Dropdown */}
      <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <label className="font-bold text-stone-700">Select Complaint Ticket:</label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-stone-300 font-mono text-xs text-stone-800 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#174C37]"
        >
          {reports.map(r => (
            <option key={r.id} value={r.id}>
              {r.id} — {r.title.slice(0, 45)}... ({r.status.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {activeReport && (
        <div className="space-y-6">
          {/* Main Status & Progress Stepper */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-8">
            {/* Top Incident Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-stone-100 text-stone-700">
                    {activeReport.id}
                  </span>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                    {activeReport.status.replace("_", " ")}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-stone-900">{activeReport.title}</h3>
                <p className="text-xs text-stone-500 mt-0.5">📍 {activeReport.location.address}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] text-stone-400 block">WQI Priority Score</span>
                <span className="text-2xl font-black text-[#174C37]">
                  {activeReport.wqi?.total || 75} <span className="text-xs font-normal text-stone-400">/ 100</span>
                </span>
              </div>
            </div>

            {/* Stepper Timeline Visualizer */}
            <div className="relative">
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
                {TIMELINE_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center space-y-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-sm ${
                          isDone
                            ? "bg-[#174C37] text-white ring-4 ring-emerald-100"
                            : "bg-stone-100 text-stone-400 border border-stone-200"
                        } ${isCurrent ? "scale-110 ring-4 ring-emerald-400/50" : ""}`}
                      >
                        {isDone ? "✓" : idx + 1}
                      </div>
                      <div>
                        <div className={`text-xs font-bold capitalize ${isDone ? "text-stone-900" : "text-stone-400"}`}>
                          {step.label}
                        </div>
                        <div className="text-[10px] text-stone-400 mt-0.5 line-clamp-2">
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Assigned Driver & Truck Card */}
          {activeReport.assignedVehicleId ? (
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">
                  <Truck size={16} className="text-[#174C37]" />
                  <span>Assigned Municipal Collection Fleet</span>
                </h4>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Live Dispatch
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <span className="text-stone-400 text-[10px] uppercase font-bold">Assigned Vehicle</span>
                  <div className="font-bold text-stone-800 text-sm">
                    {assignedTruck?.name || activeReport.assignedVehicleId}
                  </div>
                  <div className="text-stone-500 text-[11px]">{assignedTruck?.type || "Heavy Compactor"}</div>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <span className="text-stone-400 text-[10px] uppercase font-bold">Driver on Duty</span>
                  <div className="font-bold text-stone-800 text-sm">
                    {activeReport.assignedDriverName || assignedTruck?.driverName || "Fleet Crew"}
                  </div>
                  <div className="text-stone-500 text-[11px]">{assignedTruck?.driverPhone || "+91 98765 43210"}</div>
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                  <span className="text-emerald-800 text-[10px] uppercase font-bold">Estimated Arrival</span>
                  <div className="font-bold text-emerald-950 text-sm">
                    {activeReport.status === "on_the_way" ? "Within 15 mins" : activeReport.status === "collected" || activeReport.status === "resolved" ? "Completed" : "Scheduled"}
                  </div>
                  <div className="text-emerald-700 text-[11px]">En route from Central Depot</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-amber-600 shrink-0" />
                <div>
                  <strong className="block font-bold">Awaiting Municipal Vehicle Assignment</strong>
                  <span>Our command center is matching an optimal compactor unit based on payload & distance.</span>
                </div>
              </div>
            </div>
          )}

          {/* Before & After Photo Comparison */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Photographic Verification Audit
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-stone-200 rounded-2xl overflow-hidden bg-stone-50">
                <div className="relative h-48">
                  <img
                    src={activeReport.imageUrl}
                    alt="Initial report photo"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-stone-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    INITIAL REPORTED DUMP
                  </span>
                </div>
                <div className="p-3 text-xs text-stone-600">
                  Reported by {activeReport.citizenName} on {new Date(activeReport.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className={`border-2 rounded-2xl overflow-hidden ${
                activeReport.afterImageUrl ? "border-emerald-500 bg-emerald-50/20" : "border-dashed border-stone-300 bg-stone-50"
              }`}>
                <div className="relative h-48">
                  {activeReport.afterImageUrl ? (
                    <>
                      <img
                        src={activeReport.afterImageUrl}
                        alt="After cleaning proof"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                        <CheckCircle2 size={11} /> VERIFIED CLEANED
                      </span>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-4 text-center">
                      <Camera size={28} />
                      <span className="text-xs mt-2 font-medium">Cleaning in progress</span>
                      <span className="text-[10px] text-stone-400 mt-0.5">
                        Driver will upload proof photo upon completion
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3 text-xs text-stone-600">
                  {activeReport.afterImageUrl ? (
                    <span className="text-emerald-800 font-semibold">
                      Proof verified by Municipal Sanitation Directorate
                    </span>
                  ) : (
                    <span className="text-stone-400">Proof photo pending collection</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
