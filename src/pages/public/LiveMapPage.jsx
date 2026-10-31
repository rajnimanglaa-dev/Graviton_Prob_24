import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import WasteMap from "../../components/Map/WasteMap.jsx";
import ReportDetailsModal from "../../components/Modals/ReportDetailsModal.jsx";
import { MapPin, Filter, Layers, Info, ShieldAlert, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function LiveMapPage() {
  const { reports, vehicles } = useApp();
  const [selectedReport, setSelectedReport] = useState(null);

  const pendingReports = reports.filter(r => r.status !== "resolved");
  const criticalCount = reports.filter(r => r.priority === "critical" && r.status !== "resolved").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-[#174C37] uppercase tracking-wider">
              Live Municipal GIS Feed
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#202923] tracking-tight mt-1">
            City Waste & Fleet Surveillance Map
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time public transparency for citizen reports, priority hotspots, and collection fleet movements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/citizen/report"
            className="px-4 py-2 rounded-xl bg-[#174C37] text-white hover:bg-[#0f3325] text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <MapPin size={14} />
            <span>Report Waste at My Location</span>
          </Link>
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="text-[11px] font-semibold text-stone-500">Active Incidents</div>
          <div className="text-xl font-black text-stone-800 mt-0.5">{pendingReports.length}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="text-[11px] font-semibold text-stone-500">Critical Priority</div>
          <div className="text-xl font-black text-red-600 mt-0.5">{criticalCount}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="text-[11px] font-semibold text-stone-500">Active Vehicles</div>
          <div className="text-xl font-black text-[#174C37] mt-0.5">{vehicles.length}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-xs">
          <div className="text-[11px] font-semibold text-stone-500">Resolved Today</div>
          <div className="text-xl font-black text-emerald-600 mt-0.5">
            {reports.filter(r => r.status === "resolved").length}
          </div>
        </div>
      </div>

      {/* Main Interactive Map */}
      <WasteMap
        reports={reports}
        vehicles={vehicles}
        height="640px"
        onSelectReport={(report) => setSelectedReport(report)}
        showControls={true}
      />

      {/* Bottom Information Callout */}
      <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 text-xs text-stone-600 flex items-start gap-3">
        <Info size={18} className="text-[#174C37] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Open Data Transparency:</strong> All citizen garbage reports are geocoded and publicly queryable to ensure municipal response accountability. Click on any colored pin on the map to inspect its Waste Quantity Index (WQI) score, photographic evidence, and collection progress.
        </p>
      </div>

      {/* Report Details Modal */}
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
