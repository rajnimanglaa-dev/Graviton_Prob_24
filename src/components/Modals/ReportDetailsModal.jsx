import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
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
  const isCitizen = currentUser.role === "citizen";
  const isDriver = currentUser.role === "driver";

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-700 border-red-300";
      case "high": return "bg-orange-100 text-orange-700 border-orange-300";
      case "medium": return "bg-amber-100 text-amber-700 border-amber-300";
      default: return "bg-emerald-100 text-emerald-700 border-emerald-300";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "resolved": return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "collected": return "bg-teal-100 text-teal-800 border-teal-300";
      case "on_the_way": return "bg-blue-100 text-blue-800 border-blue-300";
      case "assigned": return "bg-indigo-100 text-indigo-800 border-indigo-300";
      case "verified": return "bg-purple-100 text-purple-800 border-purple-300";
      case "rejected": return "bg-stone-200 text-stone-700 border-stone-300";
      default: return "bg-amber-100 text-amber-800 border-amber-300";
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-stone-200">
          {/* Header */}
          <div className="bg-[#174C37] text-white p-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-white/20">
                  {report.id}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadgeClass(report.priority)} bg-white/90`}>
                  {report.priority.toUpperCase()} PRIORITY
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeClass(report.status)} bg-white/90`}>
                  {report.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
              <h3 className="text-base font-bold text-white line-clamp-1">{report.title}</h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-stone-800">
            {/* Top Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#174C37] shrink-0" />
                <span className="text-stone-600 line-clamp-1">{report.location.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#174C37] shrink-0" />
                <span className="text-stone-600">{new Date(report.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} className="text-[#174C37] shrink-0" />
                <span className="text-stone-600">{report.citizenName || "Anonymous Citizen"}</span>
              </div>
            </div>

            {/* Photos (Before & After if available) */}
            <div>
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Photographic Evidence
              </h4>
              <div className={`grid ${report.afterImageUrl ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
                <div className="border border-stone-200 rounded-xl overflow-hidden bg-stone-100">
                  <div className="relative h-48">
                    <img
                      src={report.imageUrl}
                      alt="Initial report photograph"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-stone-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      BEFORE: INITIAL REPORT
                    </span>
                  </div>
                  <div className="p-2.5 text-xs text-stone-600 flex justify-between">
                    <span>Category: <strong>{report.category.toUpperCase()}</strong></span>
                    <span>WQI Score: <strong>{report.wqi?.total || 70}/100</strong></span>
                  </div>
                </div>

                {report.afterImageUrl && (
                  <div className="border-2 border-emerald-500 rounded-xl overflow-hidden bg-emerald-50/20">
                    <div className="relative h-48">
                      <img
                        src={report.afterImageUrl}
                        alt="After cleaning photograph"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 size={11} /> AFTER: CLEANED & VERIFIED
                      </span>
                    </div>
                    <div className="p-2.5 text-xs text-emerald-900 font-medium">
                      Cleared by Driver: {report.assignedDriverName || "Municipal Fleet"}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description & Priority Rationale */}
            <div className="space-y-3">
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Citizen Description
                </span>
                <p className="text-xs text-stone-700 leading-relaxed">{report.description}</p>
              </div>

              {report.priorityReason && (
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-emerald-700" />
                    AI Prioritization Rationale
                  </span>
                  <p className="text-xs text-emerald-950 font-medium leading-relaxed">{report.priorityReason}</p>
                </div>
              )}
            </div>

            {/* WQI Breakdown Grid */}
            <div>
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Waste Quantity Index (WQI) Score Breakdown</span>
                <span className="text-emerald-700 font-extrabold">{report.wqi?.total || 75} / 100</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center">
                  <div className="text-[11px] text-stone-500 mb-1">Volume (40%)</div>
                  <div className="text-lg font-bold text-stone-800">{report.wqi?.volumeScore || 28} / 40</div>
                  <div className="text-[10px] text-stone-400">~{report.wqi?.estimatedVolumeM3 || 2.4} m³</div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center">
                  <div className="text-[11px] text-stone-500 mb-1">Area Spread (25%)</div>
                  <div className="text-lg font-bold text-stone-800">{report.wqi?.areaScore || 18} / 25</div>
                  <div className="text-[10px] text-stone-400">~{report.wqi?.estimatedAreaM2 || 8.0} m²</div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center">
                  <div className="text-[11px] text-stone-500 mb-1">Hazard / Type (20%)</div>
                  <div className="text-lg font-bold text-stone-800">{report.wqi?.hazardScore || 15} / 20</div>
                  <div className="text-[10px] text-stone-400 capitalize">{report.category}</div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center">
                  <div className="text-[11px] text-stone-500 mb-1">Recurrence (15%)</div>
                  <div className="text-lg font-bold text-stone-800">{report.wqi?.recurrenceScore || 10} / 15</div>
                  <div className="text-[10px] text-stone-400">{report.duplicateInfo?.corroborationCount || 1} Reports</div>
                </div>
              </div>
            </div>

            {/* Lifecycle Timeline */}
            <div>
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
                Report Lifecycle Timeline
              </h4>
              <div className="relative pl-6 space-y-4 border-l-2 border-stone-200 ml-2">
                {report.timeline?.map((event, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white bg-[#174C37] shadow-sm" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800 capitalize">
                        {event.status.replace("_", " ")}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 font-medium">{event.actor}</div>
                    <p className="text-xs text-stone-600 mt-0.5">{event.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
            >
              Close
            </button>

            {/* Admin Actions */}
            {isAdmin && (
              <div className="flex flex-wrap items-center gap-2">
                {report.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        rejectReport(report.id, "Not municipal jurisdiction");
                        onClose();
                      }}
                      className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Ban size={14} /> Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        verifyReport(report.id);
                        onClose();
                      }}
                      className="px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 transition flex items-center gap-1.5 shadow-sm"
                    >
                      <ShieldCheck size={14} /> Verify Report
                    </button>
                  </>
                )}

                {(report.status === "verified" || report.status === "pending") && (
                  <button
                    type="button"
                    onClick={() => setIsAssignOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#174C37] text-white text-xs font-bold hover:bg-[#0f3325] transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Truck size={14} /> Recommend & Assign Vehicle
                  </button>
                )}

                {report.status === "collected" && (
                  <button
                    type="button"
                    onClick={() => {
                      resolveReport(report.id);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 size={14} /> Approve & Mark Resolved
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submodal for vehicle assignment */}
      {isAssignOpen && (
        <AssignVehicleModal
          report={report}
          isOpen={isAssignOpen}
          onClose={() => {
            setIsAssignOpen(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
