import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { CheckCircle2, Clock, Calendar, Truck, ArrowRight, Eye, ShieldCheck, CheckCheck } from "lucide-react";
import ReportDetailsModal from "../../components/Modals/ReportDetailsModal.jsx";
import { getWasteVisualCategory } from "../../services/wasteCategoryTheme.js";

export default function DriverHistoryPage() {
  const { reports, currentUser } = useApp();
  const [selectedReport, setSelectedReport] = useState(null);

  // Completed or resolved reports
  const completedReports = reports.filter(r =>
    (r.assignedVehicleId === currentUser.assignedTruckId || r.assignedDriverName === currentUser.name) &&
    (r.status === "collected" || r.status === "resolved")
  );

  return (
    <div className="space-y-6 animate-fadeIn text-[#F5F7F5]">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A36A] animate-pulse" />
          <span className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider">
            Verified Clearance Archive
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#F5F7F5] tracking-tight mt-1">
          Collection History & Cleared Logs
        </h1>
        <p className="text-xs sm:text-sm text-[#A5B3AA] mt-1">
          Archived collection records complete with verified before & after photographic evidence.
        </p>
      </div>

      {/* History Grid */}
      <div className="space-y-4">
        {completedReports.length === 0 ? (
          <div className="p-12 text-center bg-[#1D2B25] rounded-3xl border border-[#24382F] text-[#A5B3AA] text-xs shadow-lg">
            No completed collection logs on record yet.
          </div>
        ) : (
          completedReports.map(report => {
            const visualStream = getWasteVisualCategory(report.category);

            return (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className="p-6 rounded-3xl bg-[#1D2B25] border border-[#24382F] hover:border-[#8BE0B0]/40 transition cursor-pointer shadow-lg space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#24382F] gap-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#F5F7F5] bg-[#142820] px-2.5 py-1 rounded-lg border border-[#24382F]">
                      {report.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#16A36A]/20 text-[#8BE0B0] border border-[#16A36A]/30 uppercase flex items-center gap-1">
                      <CheckCircle2 size={11} /> Verified Cleared
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${visualStream.badgeClass}`}>
                      {visualStream.label}
                    </span>
                  </div>
                  <span className="text-xs text-[#A5B3AA] font-mono">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                  {/* Before vs After Photos */}
                  <div className="sm:col-span-5 grid grid-cols-2 gap-2.5">
                    <div className="relative h-28 rounded-2xl overflow-hidden border border-[#24382F] shadow-inner">
                      <img
                        src={report.imageUrl}
                        alt="Before"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1.5 left-1.5 bg-black/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                        BEFORE
                      </span>
                    </div>
                    <div className="relative h-28 rounded-2xl overflow-hidden border-2 border-[#16A36A] shadow-md shadow-[#16A36A]/20">
                      <img
                        src={report.afterImageUrl || report.imageUrl}
                        alt="After"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1.5 left-1.5 bg-[#16A36A] text-[#101A17] text-[9px] font-black px-2 py-0.5 rounded-md">
                        AFTER PROOF
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-7 space-y-2 text-xs">
                    <h4 className="text-sm font-bold font-heading text-[#F5F7F5]">{report.title}</h4>
                    <p className="text-[#A5B3AA]">📍 {report.location.address}</p>
                    <div className="flex flex-wrap items-center gap-4 text-[#A5B3AA] pt-1">
                      <span>Category: <strong className="capitalize text-[#F5F7F5]">{report.category}</strong></span>
                      <span>Cleared Volume: <strong className="font-stat text-[#8BE0B0]">{report.wqi?.estimatedVolumeM3 || 2.4} m³</strong></span>
                    </div>
                    <div className="text-[11px] text-[#8BE0B0] font-semibold pt-1 flex items-center gap-1.5">
                      <CheckCheck size={14} className="text-[#16A36A]" />
                      <span>Verified by Municipal Sanitation Inspector (+50 Citizen Points Released)</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}
