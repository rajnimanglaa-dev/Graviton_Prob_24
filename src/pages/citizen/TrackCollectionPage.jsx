import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import { getWasteVisualCategory } from "../../services/wasteCategoryTheme.js";
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
  const visualCat = activeReport ? getWasteVisualCategory(activeReport.category) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn text-[#F5F7F5]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A36A] animate-pulse" />
          <span className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">
            LIVE COMPLAINT TRACKING TIMELINE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7F5] tracking-tight mt-1 font-heading">
          Track Waste Collection Progress
        </h1>
        <p className="text-xs sm:text-sm text-[#A5B3AA] mt-0.5">
          Real-time end-to-end municipal progress tracking from dispatch to before/after photographic proof verification.
        </p>
      </div>

      {/* Report Selector Dropdown */}
      <div className="p-4 bg-[#1D2B25] rounded-3xl border border-[#273b33] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <label className="font-bold text-[#F5F7F5]">Select Complaint Ticket:</label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-[#273b33] font-mono text-xs text-[#F5F7F5] bg-[#142820] focus:outline-none focus:border-[#16A36A]"
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
          <div className="p-6 sm:p-8 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-xl space-y-8">
            {/* Top Incident Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#273b33] gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#142820] text-[#8BE0B0] border border-[#273b33]">
                    {activeReport.id}
                  </span>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#16A36A]/20 border border-[#16A36A]/40 text-[#8BE0B0] uppercase">
                    {activeReport.status.replace("_", " ")}
                  </span>
                  {visualCat && (
                    <span
                      className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border"
                      style={{ backgroundColor: `${visualCat.color}20`, borderColor: visualCat.color, color: visualCat.mint }}
                    >
                      {visualCat.badgeLabel}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-[#F5F7F5] font-heading">{activeReport.title}</h3>
                <p className="text-xs text-[#A5B3AA] mt-0.5">📍 {activeReport.location.address}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] text-[#A5B3AA] block font-mono">WQI Priority Score</span>
                <span className="text-2xl font-black text-[#8BE0B0] font-stat">
                  {activeReport.wqi?.total || 75} <span className="text-xs font-normal text-[#A5B3AA]">/ 100</span>
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
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-md ${
                          isDone
                            ? "bg-[#16A36A] text-white shadow-[#16A36A]/40"
                            : "bg-[#142820] text-[#A5B3AA] border border-[#273b33]"
                        } ${isCurrent ? "scale-110 ring-4 ring-[#8BE0B0]/40" : ""}`}
                      >
                        {isDone ? "✓" : idx + 1}
                      </div>
                      <div>
                        <div className={`text-xs font-bold capitalize font-heading ${isDone ? "text-[#F5F7F5]" : "text-[#A5B3AA]"}`}>
                          {step.label}
                        </div>
                        <div className="text-[10px] text-[#A5B3AA] mt-0.5 line-clamp-2">
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
            <div className="p-6 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Truck size={16} className="text-[#16A36A]" />
                  <span>Assigned Municipal Collection Fleet</span>
                </h4>
                <span className="text-[11px] font-bold text-[#8BE0B0] bg-[#142820] px-2.5 py-0.5 rounded-full border border-[#273b33]">
                  Live Dispatch
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 bg-[#142820] rounded-2xl border border-[#273b33] space-y-1">
                  <span className="text-[#A5B3AA] text-[10px] uppercase font-bold font-mono">Assigned Vehicle</span>
                  <div className="font-bold text-[#F5F7F5] text-sm">
                    {assignedTruck?.name || activeReport.assignedVehicleId}
                  </div>
                  <div className="text-[#8BE0B0] text-[11px]">{assignedTruck?.type || "Heavy Compactor"}</div>
                </div>

                <div className="p-3.5 bg-[#142820] rounded-2xl border border-[#273b33] space-y-1">
                  <span className="text-[#A5B3AA] text-[10px] uppercase font-bold font-mono">Driver on Duty</span>
                  <div className="font-bold text-[#F5F7F5] text-sm">
                    {activeReport.assignedDriverName || assignedTruck?.driverName || "Fleet Crew"}
                  </div>
                  <div className="text-[#A5B3AA] text-[11px] font-mono">{assignedTruck?.driverPhone || "+91 98765 43210"}</div>
                </div>

                <div className="p-3.5 bg-[#142820] rounded-2xl border border-[#16A36A]/40 space-y-1">
                  <span className="text-[#8BE0B0] text-[10px] uppercase font-bold font-mono">Estimated Arrival</span>
                  <div className="font-bold text-[#8BE0B0] text-sm font-stat">
                    {activeReport.status === "on_the_way" ? "Within 15 mins" : activeReport.status === "collected" || activeReport.status === "resolved" ? "Completed" : "Scheduled"}
                  </div>
                  <div className="text-[#A5B3AA] text-[11px]">En route from Central Depot</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-[#142820] border border-amber-500/40 text-xs text-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-amber-400 shrink-0" />
                <div>
                  <strong className="block font-bold">Awaiting Municipal Vehicle Assignment</strong>
                  <span className="text-[#A5B3AA]">Our command center is matching an optimal compactor unit based on payload & distance.</span>
                </div>
              </div>
            </div>
          )}

          {/* Before & After Photo Comparison */}
          <div className="p-6 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-4">
            <h4 className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">
              Photographic Verification Audit
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-[#273b33] rounded-2xl overflow-hidden bg-[#142820]">
                <div className="relative h-48">
                  <img
                    src={activeReport.imageUrl}
                    alt="Initial report photo"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/20">
                    INITIAL REPORTED DUMP
                  </span>
                </div>
                <div className="p-3 text-xs text-[#A5B3AA]">
                  Reported by {activeReport.citizenName} on {new Date(activeReport.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className={`border-2 rounded-2xl overflow-hidden ${
                activeReport.afterImageUrl ? "border-[#16A36A] bg-[#16A36A]/10" : "border-dashed border-[#273b33] bg-[#142820]"
              }`}>
                <div className="relative h-48">
                  {activeReport.afterImageUrl ? (
                    <>
                      <img
                        src={activeReport.afterImageUrl}
                        alt="After cleaning proof"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-[#16A36A] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                        <CheckCircle2 size={11} /> VERIFIED CLEANED
                      </span>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#A5B3AA] p-4 text-center">
                      <Camera size={28} className="text-[#16A36A]" />
                      <span className="text-xs mt-2 font-medium text-[#F5F7F5]">Cleaning in progress</span>
                      <span className="text-[10px] text-[#A5B3AA] mt-0.5">
                        Driver will upload proof photo upon completion
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3 text-xs text-[#A5B3AA]">
                  {activeReport.afterImageUrl ? (
                    <span className="text-[#8BE0B0] font-semibold">
                      Proof verified by Municipal Sanitation Directorate
                    </span>
                  ) : (
                    <span>Proof photo pending collection</span>
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
