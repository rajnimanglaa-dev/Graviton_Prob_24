import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { getWasteVisualCategory } from "../../services/wasteCategoryTheme.js";
import {
  X,
  MapPin,
  Calendar,
  User,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Ban
} from "lucide-react";
import AssignVehicleModal from "./AssignVehicleModal.jsx";

export default function ReportDetailsModal({ report, isOpen, onClose }) {
  const { currentUser, verifyReport, rejectReport, resolveReport } = useApp();
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  if (!isOpen || !report) return null;

  const isAdmin = currentUser.role === "admin";
  const visualCat = getWasteVisualCategory(report.category);

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-300 border-red-500/40";
      case "high": return "bg-orange-500/20 text-orange-300 border-orange-500/40";
      case "medium": return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      default: return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "resolved": return "bg-[#16A36A]/20 text-[#8BE0B0] border-[#16A36A]/40";
      case "collected": return "bg-teal-500/20 text-teal-300 border-teal-500/40";
      case "on_the_way": return "bg-[#3987F5]/20 text-[#90c2ff] border-[#3987F5]/40";
      case "assigned": return "bg-indigo-500/20 text-indigo-300 border-indigo-500/40";
      case "verified": return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "rejected": return "bg-stone-500/20 text-stone-300 border-stone-500/40";
      default: return "bg-amber-500/20 text-amber-300 border-amber-500/40";
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn text-[#F5F7F5]">
        <div className="bg-[#1D2B25] rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-[#273b33]">
          {/* Header */}
          <div className="bg-[#142820] text-white p-5 flex items-center justify-between border-b border-[#273b33]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#101A17] text-[#8BE0B0] border border-[#273b33]">
                  {report.id}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadgeClass(report.priority)}`}>
                  {report.priority.toUpperCase()} PRIORITY
                </span>
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full border"
                  style={{ backgroundColor: `${visualCat.color}20`, borderColor: visualCat.color, color: visualCat.mint }}
                >
                  {visualCat.badgeLabel}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeClass(report.status)}`}>
                  {report.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#F5F7F5] line-clamp-1 font-heading">{report.title}</h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 rounded-lg text-[#A5B3AA] hover:bg-[#1D2B25] hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Top Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[#142820] rounded-2xl border border-[#273b33] text-xs">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#16A36A] shrink-0" />
                <span className="text-[#A5B3AA] line-clamp-1">{report.location.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#16A36A] shrink-0" />
                <span className="text-[#A5B3AA] font-mono">{new Date(report.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} className="text-[#16A36A] shrink-0" />
                <span className="text-[#A5B3AA]">{report.citizenName || "Anonymous Citizen"}</span>
              </div>
            </div>

            {/* Photos (Before & After if available) */}
            <div>
              <h4 className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider mb-2 font-mono">
                Photographic Evidence
              </h4>
              <div className={`grid ${report.afterImageUrl ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
                <div className="border border-[#273b33] rounded-2xl overflow-hidden bg-[#142820]">
                  <div className="relative h-48">
                    <img
                      src={report.imageUrl}
                      alt="Initial report photograph"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/20">
                      BEFORE: INITIAL REPORT
                    </span>
                  </div>
                  <div className="p-2.5 text-xs text-[#A5B3AA] flex justify-between">
                    <span>Category: <strong style={{ color: visualCat.mint }}>{visualCat.name}</strong></span>
                    <span>WQI Score: <strong className="text-[#8BE0B0] font-stat">{report.wqi?.total || 70}/100</strong></span>
                  </div>
                </div>

                {report.afterImageUrl && (
                  <div className="border-2 border-[#16A36A] rounded-2xl overflow-hidden bg-[#16A36A]/10">
                    <div className="relative h-48">
                      <img
                        src={report.afterImageUrl}
                        alt="After cleaning photograph"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-[#16A36A] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <CheckCircle2 size={11} /> AFTER: CLEANED & VERIFIED
                      </span>
                    </div>
                    <div className="p-2.5 text-xs text-[#8BE0B0] font-medium">
                      Cleared by Driver: {report.assignedDriverName || "Municipal Fleet"}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description & Priority Rationale */}
            <div className="space-y-3">
              <div className="p-3.5 bg-[#142820] rounded-2xl border border-[#273b33]">
                <span className="text-[11px] font-bold text-[#8BE0B0] uppercase tracking-wider block mb-1 font-mono">
                  Citizen Description
                </span>
                <p className="text-xs text-[#A5B3AA] leading-relaxed">{report.description}</p>
              </div>

              {report.priorityReason && (
                <div className="p-3.5 bg-[#142820] rounded-2xl border border-[#16A36A]/40">
                  <span className="text-[11px] font-bold text-[#8BE0B0] uppercase tracking-wider block mb-1 flex items-center gap-1.5 font-mono">
                    <Sparkles size={13} className="text-[#16A36A]" />
                    AI Prioritization Rationale
                  </span>
                  <p className="text-xs text-[#A5B3AA] font-medium leading-relaxed">{report.priorityReason}</p>
                </div>
              )}
            </div>

            {/* WQI Breakdown Grid */}
            <div>
              <h4 className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider mb-2 flex items-center justify-between font-mono">
                <span>Waste Quantity Index (WQI) Score Breakdown</span>
                <span className="text-[#8BE0B0] font-extrabold font-stat">{report.wqi?.total || 75} / 100</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-[#142820] border border-[#273b33] text-center">
                  <div className="text-[11px] text-[#A5B3AA] mb-1">Volume (40%)</div>
                  <div className="text-lg font-bold text-[#F5F7F5] font-stat">{report.wqi?.volumeScore || 28} / 40</div>
                  <div className="text-[10px] text-[#A5B3AA] font-stat">~{report.wqi?.estimatedVolumeM3 || 2.4} m³</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#142820] border border-[#273b33] text-center">
                  <div className="text-[11px] text-[#A5B3AA] mb-1">Area Spread (25%)</div>
                  <div className="text-lg font-bold text-[#F5F7F5] font-stat">{report.wqi?.areaScore || 18} / 25</div>
                  <div className="text-[10px] text-[#A5B3AA] font-stat">~{report.wqi?.estimatedAreaM2 || 8.0} m²</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#142820] border border-[#273b33] text-center">
                  <div className="text-[11px] text-[#A5B3AA] mb-1">Hazard / Type (20%)</div>
                  <div className="text-lg font-bold text-[#F5F7F5] font-stat">{report.wqi?.hazardScore || 15} / 20</div>
                  <div className="text-[10px] text-[#8BE0B0] capitalize">{report.category}</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#142820] border border-[#273b33] text-center">
                  <div className="text-[11px] text-[#A5B3AA] mb-1">Recurrence (15%)</div>
                  <div className="text-lg font-bold text-[#F5F7F5] font-stat">{report.wqi?.recurrenceScore || 10} / 15</div>
                  <div className="text-[10px] text-[#A5B3AA] font-stat">{report.duplicateInfo?.corroborationCount || 1} Reports</div>
                </div>
              </div>
            </div>

            {/* Lifecycle Timeline */}
            <div>
              <h4 className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider mb-3 font-mono">
                Report Lifecycle Timeline
              </h4>
              <div className="relative pl-6 space-y-4 border-l-2 border-[#273b33] ml-2">
                {report.timeline?.map((event, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-[#1D2B25] bg-[#16A36A] shadow-sm" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F5F7F5] capitalize">
                        {event.status.replace("_", " ")}
                      </span>
                      <span className="text-[10px] text-[#A5B3AA] font-mono">
                        {new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#8BE0B0] font-medium">{event.actor}</div>
                    <p className="text-xs text-[#A5B3AA] mt-0.5">{event.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-4 bg-[#142820] border-t border-[#273b33] flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#A5B3AA] hover:text-white transition"
            >
              Close
            </button>

            {isAdmin && (
              <div className="flex items-center gap-2">
                {report.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => { verifyReport(report.id); onClose(); }}
                      className="px-3.5 py-2 rounded-xl bg-[#16A36A] text-white hover:bg-[#0f7a4e] text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-[#16A36A]/30"
                    >
                      <CheckCircle2 size={14} />
                      <span>Verify Report</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { rejectReport(report.id, "Invalid or private property"); onClose(); }}
                      className="px-3.5 py-2 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 hover:bg-red-600 hover:text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Ban size={14} />
                      <span>Reject</span>
                    </button>
                  </>
                )}

                {(report.status === "verified" || report.status === "assigned" || report.status === "pending") && (
                  <button
                    type="button"
                    onClick={() => setIsAssignOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#16A36A] text-white hover:bg-[#0f7a4e] text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-[#16A36A]/30"
                  >
                    <Truck size={14} />
                    <span>{report.assignedVehicleId ? "Reassign Fleet Truck" : "Allocate Collection Truck"}</span>
                  </button>
                )}

                {report.status === "collected" && (
                  <button
                    type="button"
                    onClick={() => { resolveReport(report.id); onClose(); }}
                    className="px-4 py-2 rounded-xl bg-[#16A36A] text-white hover:bg-[#0f7a4e] text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-[#16A36A]/30"
                  >
                    <CheckCircle2 size={14} />
                    <span>Approve Proof & Close Ticket</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isAssignOpen && (
        <AssignVehicleModal
          report={report}
          isOpen={isAssignOpen}
          onClose={() => setIsAssignOpen(false)}
        />
      )}
    </>
  );
}
