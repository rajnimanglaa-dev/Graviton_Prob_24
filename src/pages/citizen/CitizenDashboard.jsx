import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import {
  PlusCircle,
  FileText,
  CheckCircle2,
  Clock,
  Truck,
  AlertTriangle,
  Award,
  ArrowRight,
  MapPin,
  Sparkles
} from "lucide-react";
import ReportDetailsModal from "../../components/Modals/ReportDetailsModal.jsx";

export default function CitizenDashboard() {
  const { currentUser, reports } = useApp();
  const [selectedReport, setSelectedReport] = useState(null);

  const myReports = reports.filter(r => r.citizenId === currentUser.id || r.citizenEmail === currentUser.email);
  const resolvedCount = myReports.filter(r => r.status === "resolved").length;
  const pendingCount = myReports.filter(r => r.status === "pending" || r.status === "verified").length;
  const inProgressCount = myReports.filter(r => r.status === "assigned" || r.status === "on_the_way" || r.status === "arrived" || r.status === "collected").length;

  const nearbyReports = reports.filter(r => r.location?.ward === currentUser.ward && r.id !== myReports[0]?.id).slice(0, 3);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-700 border-red-200";
      case "high": return "bg-orange-100 text-orange-700 border-orange-200";
      case "medium": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "resolved": return "bg-emerald-100 text-emerald-800";
      case "collected": return "bg-teal-100 text-teal-800";
      case "on_the_way": return "bg-blue-100 text-blue-800";
      case "assigned": return "bg-indigo-100 text-indigo-800";
      default: return "bg-amber-100 text-amber-800";
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#174C37] to-[#23674c] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-emerald-300">
            <Sparkles size={13} />
            <span>Citizen Action Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser.name}!
          </h2>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Your community reports help keep {currentUser.ward || "your locality"} clean. Every verified complaint earns EcoPoints and triggers automated municipal dispatch.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            to="/citizen/report"
            className="px-5 py-3 rounded-xl bg-white text-[#174C37] hover:bg-stone-100 text-xs font-extrabold shadow-sm transition flex items-center justify-center gap-2"
          >
            <PlusCircle size={16} />
            <span>Report New Garbage</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Submitted */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold">Total Reports</span>
            <FileText size={18} className="text-[#174C37]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900">{myReports.length}</div>
          <div className="text-[11px] text-stone-400">Lodged by your account</div>
        </div>

        {/* Resolved */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold">Resolved Clean</span>
            <CheckCircle2 size={18} className="text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">{resolvedCount}</div>
          <div className="text-[11px] text-emerald-600 font-medium">Verified by photo proof</div>
        </div>

        {/* In Collection */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold">In Collection</span>
            <Truck size={18} className="text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-700">{inProgressCount}</div>
          <div className="text-[11px] text-blue-600 font-medium">Truck assigned or en route</div>
        </div>

        {/* EcoPoints */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-semibold">Eco-Reward Points</span>
            <Award size={18} className="text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">{currentUser.points || 420}</div>
          <div className="text-[11px] text-amber-700 font-medium">Rank #1 in {currentUser.ward}</div>
        </div>
      </div>

      {/* 2-Column: Recent Complaints + Nearby Dumping Sites */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Recent Complaints Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900">Your Recent Complaints</h3>
            <Link to="/citizen/my-reports" className="text-xs font-bold text-[#174C37] hover:underline flex items-center gap-1">
              <span>View All ({myReports.length})</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            {myReports.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <FileText size={32} className="mx-auto text-stone-300" />
                <p className="text-xs text-stone-500">You haven't submitted any waste reports yet.</p>
                <Link
                  to="/citizen/report"
                  className="inline-block px-4 py-2 rounded-xl bg-[#174C37] text-white text-xs font-bold"
                >
                  Report Waste Now
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {myReports.slice(0, 4).map(report => (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className="p-4 hover:bg-stone-50/80 transition cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={report.imageUrl}
                        alt={report.title}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[11px] font-mono font-bold text-stone-500">{report.id}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(report.priority)}`}>
                            {report.priority.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-stone-800 truncate">{report.title}</h4>
                        <p className="text-[11px] text-stone-500 truncate">📍 {report.location.address}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${getStatusBadge(report.status)}`}>
                        {report.status.replace("_", " ")}
                      </span>
                      <div className="text-[10px] text-stone-400 mt-1">
                        WQI: <strong className="text-stone-700">{report.wqi?.total || 75}/100</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Nearby Dumping Sites in Locality */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900">Nearby Incidents</h3>
            <Link to="/live-map" className="text-xs font-bold text-[#174C37] hover:underline">
              Live Map
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
            <div className="text-xs text-stone-500 flex items-center gap-1.5 pb-2 border-b border-stone-100">
              <MapPin size={14} className="text-[#174C37]" />
              <span>Incidents in {currentUser.ward || "Civil Lines"}</span>
            </div>

            {nearbyReports.map(nr => (
              <div
                key={nr.id}
                onClick={() => setSelectedReport(nr)}
                className="p-3 rounded-xl bg-stone-50 hover:bg-emerald-50/50 transition cursor-pointer border border-stone-200/60 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-stone-500">{nr.id}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(nr.priority)}`}>
                    {nr.priority.toUpperCase()}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-stone-800 line-clamp-1">{nr.title}</h5>
                <div className="flex items-center justify-between text-[10px] text-stone-500">
                  <span>{nr.category.toUpperCase()}</span>
                  <span>WQI: {nr.wqi?.total || 70}/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>
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
