import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { getWasteVisualCategory } from "../../services/wasteCategoryTheme.js";
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

  const queue = reports
    .filter(r => r.status !== "resolved" && r.status !== "rejected")
    .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));

  const criticalCount = queue.filter(r => r.priority === "critical").length;
  const highCount = queue.filter(r => r.priority === "high").length;

  return (
    <div className="space-y-6 animate-fadeIn text-[#F5F7F5]">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider font-mono">
              AUTOMATED ALGORITHMIC DISPATCH QUEUE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7F5] tracking-tight mt-1 font-heading">
            Emergency Priority Queue
          </h1>
          <p className="text-xs sm:text-sm text-[#A5B3AA] mt-0.5">
            Strict multi-factor ranking based on WQI volume, health hazard toxicity, public walkway blockage, and citizen recurrence corroborations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 font-bold border border-red-500/40 font-mono">
            🔴 {criticalCount} Critical Tiers
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-orange-500/20 text-orange-300 font-bold border border-orange-500/40 font-mono">
            🟠 {highCount} High Tiers
          </span>
        </div>
      </div>

      {/* Queue Cards Ranked #1, #2, #3 */}
      <div className="space-y-4">
        {queue.length === 0 ? (
          <div className="p-12 text-center bg-[#1D2B25] rounded-3xl border border-[#273b33] shadow-md space-y-2">
            <CheckCircle2 size={36} className="text-[#16A36A] mx-auto" />
            <h4 className="text-sm font-bold text-[#F5F7F5] font-heading">Priority Queue Cleared!</h4>
            <p className="text-xs text-[#A5B3AA]">All high-priority complaints have been collected or assigned.</p>
          </div>
        ) : (
          queue.map((report, index) => {
            const isCritical = report.priority === "critical";
            const ageHours = Math.max(0.2, (Date.now() - new Date(report.createdAt).getTime()) / (3600 * 1000)).toFixed(1);
            const visual = getWasteVisualCategory(report.category);

            return (
              <div
                key={report.id}
                className={`p-6 rounded-3xl border transition shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                  isCritical
                    ? "bg-[#1D2B25] border-red-500/60 ring-1 ring-red-500/20"
                    : report.priority === "high"
                    ? "bg-[#1D2B25] border-orange-500/40"
                    : "bg-[#1D2B25] border-[#273b33]"
                }`}
              >
                {/* Left: Queue Number + Thumbnail + Info */}
                <div className="flex items-start gap-4 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 font-stat ${
                    index === 0
                      ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                      : index === 1
                      ? "bg-orange-500 text-white shadow-sm"
                      : index === 2
                      ? "bg-[#F4C542] text-[#101A17] shadow-sm"
                      : "bg-[#142820] text-[#A5B3AA] border border-[#273b33]"
                  }`}>
                    #{index + 1}
                  </div>

                  <img
                    src={report.imageUrl}
                    alt={report.title}
                    className="w-16 h-16 rounded-2xl object-cover border border-[#273b33] shrink-0"
                  />

                  <div className="min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#8BE0B0]">{report.id}</span>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                        isCritical ? "bg-red-600 text-white" : "bg-orange-500 text-white"
                      }`}>
                        {report.priority} PRIORITY
                      </span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                        style={{ backgroundColor: `${visual.color}20`, borderColor: visual.color, color: visual.mint }}
                      >
                        {visual.badgeLabel}
                      </span>
                      <span className="text-[10px] text-[#A5B3AA] font-mono flex items-center gap-1">
                        <Clock size={12} /> {ageHours} hrs ago
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#F5F7F5] line-clamp-1 font-heading">{report.title}</h4>
                    <p className="text-xs text-[#A5B3AA] line-clamp-1">📍 {report.location.address}</p>

                    {/* Explanatory Prioritization Chip */}
                    <div className="text-[11px] text-[#A5B3AA] bg-[#142820] px-3 py-1 rounded-xl border border-[#273b33] inline-block font-medium">
                      💡 <strong className="text-[#F5F7F5]">Audit Rationale:</strong> {report.priorityReason || "High WQI score requiring expedited clearance."}
                    </div>

                    {report.duplicateInfo?.corroborationCount > 1 && (
                      <div className="text-[11px] text-[#8BE0B0] font-semibold flex items-center gap-1">
                        <Users size={13} />
                        <span>Corroborated by {report.duplicateInfo.corroborationCount} independent citizens</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Scores & Actions */}
                <div className="flex sm:flex-col items-end justify-between sm:justify-center w-full sm:w-auto shrink-0 gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#273b33]">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-[#A5B3AA] uppercase font-bold block font-mono">Priority Score</span>
                    <div className="text-2xl font-black text-[#F5F7F5] font-stat">
                      {report.priorityScore || 85} <span className="text-xs font-normal text-[#A5B3AA]">/ 100</span>
                    </div>
                    <span className="text-[10px] text-[#8BE0B0] font-mono">WQI: {report.wqi?.total || 75}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="px-3 py-2 rounded-xl bg-[#142820] border border-[#273b33] hover:border-[#16A36A] text-xs font-bold text-[#A5B3AA] hover:text-white transition"
                    >
                      Inspect
                    </button>

                    <button
                      onClick={() => setAssigningReport(report)}
                      className="px-4 py-2 rounded-xl bg-[#16A36A] text-white text-xs font-bold hover:bg-[#0f7a4e] transition flex items-center gap-1.5 shadow-md shadow-[#16A36A]/30 whitespace-nowrap"
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
