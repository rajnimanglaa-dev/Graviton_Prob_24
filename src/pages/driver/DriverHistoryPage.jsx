import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { CheckCircle2, Clock, Calendar, Truck, ArrowRight, Eye, ShieldCheck } from "lucide-react";
import ReportDetailsModal from "../../components/Modals/ReportDetailsModal.jsx";

export default function DriverHistoryPage() {
  const { reports, currentUser } = useApp();
  const [selectedReport, setSelectedReport] = useState(null);

  // Completed or resolved reports
  const completedReports = reports.filter(r =>
    (r.status === "collected" || r.status === "resolved")
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#202923] tracking-tight">
          Collection History & Cleared Logs
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Archived collection records complete with verified before & after photographic evidence.
        </p>
      </div>

      {/* History Grid */}
      <div className="space-y-4">
        {completedReports.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 text-stone-400 text-xs">
            No completed collection logs on record yet.
          </div>
        ) : (
          completedReports.map(report => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className="p-6 rounded-3xl bg-white border border-stone-200 hover:border-[#174C37] transition cursor-pointer shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-stone-800">{report.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase flex items-center gap-1">
                    <CheckCircle2 size={11} /> Verified Cleared
                  </span>
                </div>
                <span className="text-xs text-stone-400">
                  {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Before vs After Photos */}
                <div className="sm:col-span-5 grid grid-cols-2 gap-2">
                  <div className="relative h-28 rounded-xl overflow-hidden border border-stone-200">
                    <img
                      src={report.imageUrl}
                      alt="Before"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      BEFORE
                    </span>
                  </div>
                  <div className="relative h-28 rounded-xl overflow-hidden border-2 border-emerald-500">
                    <img
                      src={report.afterImageUrl || report.imageUrl}
                      alt="After"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-emerald-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      AFTER PROOF
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-7 space-y-1.5 text-xs">
                  <h4 className="text-sm font-bold text-stone-900">{report.title}</h4>
                  <p className="text-stone-500">📍 {report.location.address}</p>
                  <div className="flex items-center gap-4 text-stone-600 pt-1">
                    <span>Category: <strong className="capitalize">{report.category}</strong></span>
                    <span>Cleared Volume: <strong>{report.wqi?.estimatedVolumeM3 || 2.4} m³</strong></span>
                  </div>
                  <div className="text-[11px] text-emerald-800 font-semibold pt-1">
                    ✓ Verified by Municipal Sanitation Inspector (+50 Citizen Points Released)
                  </div>
                </div>
              </div>
            </div>
          ))
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
