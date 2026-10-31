import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import WasteMap from "../../components/Map/WasteMap.jsx";
import ReportDetailsModal from "../../components/Modals/ReportDetailsModal.jsx";
import { MapPin, Info } from "lucide-react";
import { Link } from "react-router-dom";

export default function LiveMapPage() {
  const { reports, vehicles } = useApp();
  const [selectedReport, setSelectedReport] = useState(null);

  const pendingReports = reports.filter(r => r.status !== "resolved");
  const criticalCount = reports.filter(r => r.priority === "critical" && r.status !== "resolved").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-[#F5F7F5]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A36A] animate-pulse" />
            <span className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">
              LIVE MUNICIPAL GIS SURVEILLANCE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7F5] tracking-tight mt-1 font-heading">
            City Waste & Fleet Surveillance Map
          </h1>
          <p className="text-xs text-[#A5B3AA] mt-0.5">
            Real-time public transparency for citizen reports, priority hotspots, and collection fleet movements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/citizen/report"
            className="px-4 py-2 rounded-xl bg-[#16A36A] text-white hover:bg-[#0f7a4e] text-xs font-bold shadow-md shadow-[#16A36A]/30 transition flex items-center gap-1.5"
          >
            <MapPin size={14} />
            <span>Report Waste at My Location</span>
          </Link>
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#1D2B25] border border-[#273b33] shadow-sm">
          <div className="text-[11px] font-semibold text-[#A5B3AA]">Active Incidents</div>
          <div className="text-xl font-extrabold text-[#F5F7F5] font-stat mt-0.5">{pendingReports.length}</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#1D2B25] border border-[#273b33] shadow-sm">
          <div className="text-[11px] font-semibold text-[#A5B3AA]">Critical Urgency</div>
          <div className="text-xl font-extrabold text-red-400 font-stat mt-0.5">{criticalCount}</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#1D2B25] border border-[#273b33] shadow-sm">
          <div className="text-[11px] font-semibold text-[#A5B3AA]">Active Vehicles</div>
          <div className="text-xl font-extrabold text-[#8BE0B0] font-stat mt-0.5">{vehicles.length}</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#1D2B25] border border-[#273b33] shadow-sm">
          <div className="text-[11px] font-semibold text-[#A5B3AA]">Resolved Today</div>
          <div className="text-xl font-extrabold text-[#16A36A] font-stat mt-0.5">
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
      <div className="p-4 rounded-2xl bg-[#142820] border border-[#273b33] text-xs text-[#A5B3AA] flex items-start gap-3">
        <Info size={18} className="text-[#8BE0B0] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#F5F7F5]">Open Data Transparency:</strong> All citizen garbage reports are geocoded and publicly queryable on our CartoDB dark GIS grid. Click on any colored pin on the map to inspect its Waste Quantity Index (WQI) score, photographic evidence, and collection progress.
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
