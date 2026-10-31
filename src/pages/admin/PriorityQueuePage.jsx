import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import {
  ListOrdered,
  AlertTriangle,
  Clock,
  Truck,
  Sparkles,
  CheckCircle2,
  Users,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import ReportDetailsModal from "../../components/Modals/ReportDetailsModal.jsx";
import AssignVehicleModal from "../../components/Modals/AssignVehicleModal.jsx";

export default function PriorityQueuePage() {
  const { reports } = useApp();
  const [selectedReport, setSelectedReport] = useState(null);
  const [assigningReport, setAssigningReport] = useState(null);

  // Active reports sorted descending by calculated Priority Score
  const queue = reports
    .filter(r => r.status !== "resolved" && r.status !== "rejected")
    .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));

  const criticalCount = queue.filter(r => r.priority === "critical").length;
  const highCount = queue.filter(r => r.priority === "high").length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
              Automated Algorithmic Dispatch Queue
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#202923] tracking-tight mt-1">
            Emergency Priority Queue
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Strict multi-factor ranking based on WQI volume, health hazard toxicity, public walkway blockage, and citizen recurrence corroborations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-red-100 text-red-800 font-bold border border-red-200">
            🔴 {criticalCount} Critical Tiers
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-orange-100 text-orange-800 font-bold border border-orange-200">
            🟠 {highCount} High Tiers
          </span>
        </div>
      </div>

      {/* Queue Cards Ranked #1, #2, #3 */}
      <div className="space-y-4">
        {queue.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-xs space-y-2">
            <CheckCircle2 size={36} className="text-emerald-500 mx-auto" />
            <h4 className="text-sm font-bold text-stone-800">Priority Queue Cleared!</h4>
            <p className="text-xs text-stone-400">All high-priority complaints have been collected or assigned.</p>
          </div>
        ) : (
          queue.map((report, index) => {
            const isCritical = report.priority === "critical";
            const ageHours = Math.max(0.2, (Date.now() - new Date(report.createdAt).getTime()) / (3600 * 1000)).toFixed(1);

            return (
              <div
                key={report.id}
                className={`p-6 rounded-3xl border-2 transition shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                  isCritical
                    ? "bg-gradient-to-r from-red-50/50 to-white border-red-300 ring-2 ring-red-500/10"
                    : report.priority === "high"
                    ? "bg-gradient-to-r from-orange-50/40 to-white border-orange-200"
                    : "bg-white border-stone-200"
                }`}
              >
                {/* Left: Queue Number + Thumbnail + Info */}
                <div className="flex items-start gap-4 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 ${
                    index === 0
                      ? "bg-red-600 text-white shadow-md"
                      : index === 1
                      ? "bg-orange-500 text-white shadow-sm"
                      : index === 2
                      ? "bg-amber-500 text-white shadow-sm"
                      : "bg-stone-100 text-stone-600"
                  }`}>
                    #{index + 1}
                  </div>

                  <img
                    src={report.imageUrl}
                    alt={report.title}
                    className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shrink-0"
                  />

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-700">{report.id}</span>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                        isCritical ? "bg-red-600 text-white" : "bg-orange-500 text-white"
                      }`}>
                        {report.priority} PRIORITY
                      </span>
                      <span className="text-[10px] text-stone-400 font-semibold flex items-center gap-1">
                        <Clock size={12} /> Reported {ageHours} hrs ago
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 line-clamp-1">{report.title}</h4>
                    <p className="text-xs text-stone-500 line-clamp-1">📍 {report.location.address}</p>

                    {/* Explanatory Prioritization Chip */}
                    <div className="text-[11px] text-stone-700 bg-stone-100/80 px-3 py-1 rounded-lg border border-stone-200/80 inline-block font-medium">
                      💡 <strong>Audit Rationale:</strong> {report.priorityReason || "High WQI score requiring expedited clearance."}
                    </div>

                    {report.duplicateInfo?.corroborationCount > 1 && (
                      <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                        <Users size={13} />
                        <span>Corroborated by {report.duplicateInfo.corroborationCount} independent citizens</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Scores & Actions */}
                <div className="flex sm:flex-col items-end justify-between sm:justify-center w-full sm:w-auto shrink-0 gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-200">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Priority Score</span>
                    <div className="text-2xl font-black text-stone-900">
                      {report.priorityScore || 85} <span className="text-xs font-normal text-stone-400">/ 100</span>
                    </div>
                    <span className="text-[10px] text-stone-500">WQI: {report.wqi?.total || 75}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-700 transition"
                    >
                      Inspect
                    </button>

                    <button
                      onClick={() => setAssigningReport(report)}
                      className="px-4 py-2 rounded-xl bg-[#174C37] text-white text-xs font-bold hover:bg-[#0f3325] transition flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                    >
                      <Truck size={14} />
                      <span>{report.assignedVehicleId ? "Reassign" : "Dispatch Best Vehicle"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}

      {assigningReport && (
        <AssignVehicleModal
          report={assigningReport}
          isOpen={!!assigningReport}
          onClose={() => setAssigningReport(null)}
        />
      )}
    </div>
  );
}
