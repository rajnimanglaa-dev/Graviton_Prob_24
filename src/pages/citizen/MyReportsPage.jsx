import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { Link } from "react-router-dom";
import { getWasteVisualCategory } from "../../services/wasteCategoryTheme.js";
import {
  FileText,
  PlusCircle,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight
} from "lucide-react";
import ReportDetailsModal from "../../components/Modals/ReportDetailsModal.jsx";

export default function MyReportsPage() {
  const { currentUser, reports } = useApp();
  const [selectedReport, setSelectedReport] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const myReports = reports.filter(r => r.citizenId === currentUser.id || r.citizenEmail === currentUser.email);

  const filtered = myReports.filter(r => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const idMatch = r.id.toLowerCase().includes(q);
      const titleMatch = (r.title || "").toLowerCase().includes(q);
      const addrMatch = (r.location?.address || "").toLowerCase().includes(q);
      if (!idMatch && !titleMatch && !addrMatch) return false;
    }
    return true;
  });

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-300 border-red-500/50";
      case "high": return "bg-orange-500/20 text-orange-300 border-orange-500/50";
      case "medium": return "bg-amber-500/20 text-amber-300 border-amber-500/50";
      default: return "bg-emerald-500/20 text-emerald-300 border-emerald-500/50";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "resolved": return "bg-[#16A36A]/20 text-[#8BE0B0] border border-[#16A36A]/40";
      case "collected": return "bg-teal-500/20 text-teal-300 border border-teal-500/40";
      case "on_the_way": return "bg-[#3987F5]/20 text-[#90c2ff] border border-[#3987F5]/40";
      case "assigned": return "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40";
      case "verified": return "bg-purple-500/20 text-purple-300 border border-purple-500/40";
      default: return "bg-amber-500/20 text-amber-300 border border-amber-500/40";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-[#F5F7F5]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7F5] tracking-tight font-heading">
            My Garbage Complaints
          </h1>
          <p className="text-xs sm:text-sm text-[#A5B3AA] mt-0.5">
            Track status, vehicle assignments, and verified before/after photographic proof.
          </p>
        </div>

        <Link
          to="/citizen/report"
          className="px-4 py-2.5 rounded-xl bg-[#16A36A] text-white hover:bg-[#0f7a4e] text-xs font-bold shadow-md shadow-[#16A36A]/30 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle size={15} />
          <span>New Report</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-[#1D2B25] rounded-3xl border border-[#273b33] shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by ticket ID, landmark, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#142820] border border-[#273b33] text-[#F5F7F5] placeholder-[#A5B3AA]/60 focus:outline-none focus:border-[#16A36A]"
          />
          <Search size={14} className="absolute left-2.5 top-3 text-[#A5B3AA]" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {["all", "pending", "assigned", "on_the_way", "collected", "resolved"].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold capitalize whitespace-nowrap transition ${
                statusFilter === st
                  ? "bg-[#16A36A] text-white shadow-sm"
                  : "bg-[#142820] text-[#A5B3AA] hover:text-white border border-[#273b33]"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-[#1D2B25] rounded-3xl border border-[#273b33] shadow-md overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText size={36} className="mx-auto text-[#A5B3AA]/50" />
            <p className="text-xs text-[#A5B3AA]">No reports matched the selected filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#273b33]">
            {filtered.map(report => {
              const visual = getWasteVisualCategory(report.category);
              return (
                <div
                  key={report.id}
                  className="p-5 hover:bg-[#24362f] transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <img
                      src={report.imageUrl}
                      alt={report.title}
                      className="w-16 h-16 rounded-2xl object-cover border border-[#273b33] shrink-0"
                    />

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#8BE0B0]">{report.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadgeClass(report.priority)}`}>
                          {report.priority.toUpperCase()}
                        </span>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                          style={{ backgroundColor: `${visual.color}20`, borderColor: visual.color, color: visual.mint }}
                        >
                          {visual.badgeLabel}
                        </span>
                        <span className="text-[11px] text-[#A5B3AA] font-mono">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-[#F5F7F5] truncate">{report.title}</h3>
                      <p className="text-xs text-[#A5B3AA] truncate">📍 {report.location.address}</p>

                      <div className="flex items-center gap-4 text-xs pt-1">
                        <span className="text-[#A5B3AA]">
                          WQI Score: <strong className="text-[#8BE0B0] font-stat">{report.wqi?.total || 75}/100</strong>
                        </span>
                        <span className="text-[#A5B3AA]">
                          Vehicle: <strong className="text-[#F5F7F5]">{report.assignedVehicleId || "Pending Dispatch"}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${getStatusBadgeClass(report.status)}`}>
                      {report.status.replace("_", " ")}
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedReport(report)}
                      className="p-2 rounded-xl bg-[#142820] border border-[#273b33] hover:border-[#16A36A] text-[#8BE0B0] hover:text-white transition"
                      title="Inspect full complaint details"
                    >
                      <Eye size={16} />
                    </button>

                    <Link
                      to={`/citizen/track?id=${report.id}`}
                      className="p-2 rounded-xl bg-[#16A36A] text-white hover:bg-[#0f7a4e] transition"
                      title="Track collection progress timeline"
                    >
                      <Clock size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Details Modal */}
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
