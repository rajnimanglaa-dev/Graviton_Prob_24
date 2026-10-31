import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import { getWasteVisualCategory } from "../../services/wasteCategoryTheme.js";
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
      case "critical": return "bg-red-500/20 text-red-300 border-red-500/50";
      case "high": return "bg-orange-500/20 text-orange-300 border-orange-500/50";
      case "medium": return "bg-amber-500/20 text-amber-300 border-amber-500/50";
      default: return "bg-emerald-500/20 text-emerald-300 border-emerald-500/50";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "resolved": return "bg-[#16A36A]/20 text-[#8BE0B0] border border-[#16A36A]/40";
      case "collected": return "bg-teal-500/20 text-teal-300 border border-teal-500/40";
      case "on_the_way": return "bg-[#3987F5]/20 text-[#90c2ff] border border-[#3987F5]/40";
      case "assigned": return "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40";
      default: return "bg-amber-500/20 text-amber-300 border border-amber-500/40";
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#F5F7F5]">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#142820] to-[#1D2B25] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-[#273b33] shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16A36A]/20 border border-[#16A36A]/40 text-xs font-semibold text-[#8BE0B0] font-mono">
            <Sparkles size={13} className="text-[#16A36A]" />
            <span>CITIZEN ACTION PORTAL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
            Welcome back, {currentUser.name}!
          </h2>
          <p className="text-xs sm:text-sm text-[#A5B3AA] leading-relaxed">
            Your community reports help keep {currentUser.ward || "your locality"} clean. Every verified complaint earns EcoPoints and triggers automated municipal dispatch.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            to="/citizen/report"
            className="px-5 py-3 rounded-xl bg-[#16A36A] text-white hover:bg-[#0f7a4e] text-xs font-extrabold shadow-md shadow-[#16A36A]/30 transition flex items-center justify-center gap-2"
          >
            <PlusCircle size={16} />
            <span>Report New Garbage</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards (Manrope Stats) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Submitted */}
        <div className="p-5 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-2">
          <div className="flex items-center justify-between text-[#A5B3AA]">
            <span className="text-xs font-semibold">Total Reports</span>
            <FileText size={18} className="text-[#8BE0B0]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F5F7F5] font-stat">{myReports.length}</div>
          <div className="text-[11px] text-[#A5B3AA]">Lodged by your account</div>
        </div>

        {/* Resolved */}
        <div className="p-5 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-2">
          <div className="flex items-center justify-between text-[#A5B3AA]">
            <span className="text-xs font-semibold">Resolved Clean</span>
            <CheckCircle2 size={18} className="text-[#16A36A]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#8BE0B0] font-stat">{resolvedCount}</div>
          <div className="text-[11px] text-[#8BE0B0] font-medium">Verified by photo proof</div>
        </div>

        {/* In Collection */}
        <div className="p-5 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-2">
          <div className="flex items-center justify-between text-[#A5B3AA]">
            <span className="text-xs font-semibold">In Collection</span>
            <Truck size={18} className="text-[#3987F5]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#3987F5] font-stat">{inProgressCount}</div>
          <div className="text-[11px] text-[#90c2ff] font-medium">Truck assigned or en route</div>
        </div>

        {/* EcoPoints */}
        <div className="p-5 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-2">
          <div className="flex items-center justify-between text-[#A5B3AA]">
            <span className="text-xs font-semibold">Eco-Reward Points</span>
            <Award size={18} className="text-[#F4C542]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F4C542] font-stat">{currentUser.points || 420}</div>
          <div className="text-[11px] text-[#fce58d] font-medium">Rank #1 in {currentUser.ward}</div>
        </div>
      </div>

      {/* 2-Column: Recent Complaints + Nearby Dumping Sites */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Recent Complaints Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#F5F7F5] font-heading">Your Recent Complaints</h3>
            <Link to="/citizen/my-reports" className="text-xs font-bold text-[#8BE0B0] hover:underline flex items-center gap-1">
              <span>View All ({myReports.length})</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-[#1D2B25] rounded-3xl border border-[#273b33] shadow-md overflow-hidden">
            {myReports.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <FileText size={32} className="mx-auto text-[#A5B3AA]/50" />
                <p className="text-xs text-[#A5B3AA]">You haven't submitted any waste reports yet.</p>
                <Link
                  to="/citizen/report"
                  className="inline-block px-4 py-2 rounded-xl bg-[#16A36A] text-white text-xs font-bold shadow-md"
                >
                  Report Waste Now
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#273b33]">
                {myReports.slice(0, 4).map(report => {
                  const visual = getWasteVisualCategory(report.category);
                  return (
                    <div
                      key={report.id}
                      onClick={() => setSelectedReport(report)}
                      className="p-4 hover:bg-[#24362f] transition cursor-pointer flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={report.imageUrl}
                          alt={report.title}
                          className="w-12 h-12 rounded-xl object-cover border border-[#273b33] shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[11px] font-mono font-bold text-[#8BE0B0]">{report.id}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(report.priority)}`}>
                              {report.priority.toUpperCase()}
                            </span>
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                              style={{ backgroundColor: `${visual.color}20`, borderColor: visual.color, color: visual.mint }}
                            >
                              {visual.badgeLabel}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-[#F5F7F5] truncate">{report.title}</h4>
                          <p className="text-[11px] text-[#A5B3AA] truncate">📍 {report.location.address}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${getStatusBadge(report.status)}`}>
                          {report.status.replace("_", " ")}
                        </span>
                        <div className="text-[10px] text-[#A5B3AA] mt-1 font-mono">
                          WQI: <strong className="text-[#8BE0B0] font-stat">{report.wqi?.total || 75}/100</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Nearby Dumping Sites in Locality */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#F5F7F5] font-heading">Nearby Incidents</h3>
            <Link to="/live-map" className="text-xs font-bold text-[#8BE0B0] hover:underline">
              Live Map
            </Link>
          </div>

          <div className="bg-[#1D2B25] rounded-3xl border border-[#273b33] p-4 shadow-md space-y-3">
            <div className="text-xs text-[#A5B3AA] flex items-center gap-1.5 pb-2 border-b border-[#273b33]">
              <MapPin size={14} className="text-[#16A36A]" />
              <span>Incidents in {currentUser.ward || "Civil Lines"}</span>
            </div>

            {nearbyReports.map(nr => {
              const visual = getWasteVisualCategory(nr.category);
              return (
                <div
                  key={nr.id}
                  onClick={() => setSelectedReport(nr)}
                  className="p-3 rounded-2xl bg-[#142820] hover:bg-[#24362f] transition cursor-pointer border border-[#273b33] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#8BE0B0]">{nr.id}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(nr.priority)}`}>
                      {nr.priority.toUpperCase()}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-[#F5F7F5] line-clamp-1">{nr.title}</h5>
                  <div className="flex items-center justify-between text-[10px]">
                    <span style={{ color: visual.mint }} className="font-semibold">{visual.badgeLabel}</span>
                    <span className="text-[#A5B3AA] font-mono">WQI: {nr.wqi?.total || 70}/100</span>
                  </div>
                </div>
              );
            })}
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
