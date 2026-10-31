import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { getWasteVisualCategory } from "../../services/wasteCategoryTheme.js";
import {
  Search,
  Filter,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Ban,
  Clock,
  Eye,
  ArrowUpDown,
  Sparkles
} from "lucide-react";
import ReportDetailsModal from "../../components/Modals/ReportDetailsModal.jsx";
import AssignVehicleModal from "../../components/Modals/AssignVehicleModal.jsx";

export default function AllReportsPage() {
  const { reports, verifyReport, rejectReport, resolveReport } = useApp();

  const [selectedReport, setSelectedReport] = useState(null);
  const [assigningReport, setAssigningReport] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const filteredReports = reports.filter(r => {
    if (sourceFilter !== "all" && r.source !== sourceFilter) return false;
    if (priorityFilter !== "all" && r.priority !== priorityFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (categoryFilter !== "all") {
      const visual = getWasteVisualCategory(r.category);
      if (visual.group !== categoryFilter && r.category !== categoryFilter) return false;
    }
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
      case "critical": return "bg-red-500/20 text-red-300 border-red-500/40";
      case "high": return "bg-orange-500/20 text-orange-300 border-orange-500/40";
      case "medium": return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      default: return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "resolved": return "bg-[#16A36A]/20 text-[#8BE0B0] border border-[#16A36A]/40";
      case "collected": return "bg-teal-500/20 text-teal-300 border border-teal-500/40";
      case "on_the_way": return "bg-[#3987F5]/20 text-[#90c2ff] border border-[#3987F5]/40";
      case "assigned": return "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40";
      case "verified": return "bg-purple-500/20 text-purple-300 border border-purple-500/40";
      case "rejected": return "bg-stone-500/20 text-stone-300 border border-stone-500/40";
      default: return "bg-amber-500/20 text-amber-300 border border-amber-500/40";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-[#F5F7F5]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7F5] tracking-tight font-heading">
            All Municipal Waste Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#A5B3AA] mt-0.5">
            Complete database of citizen submissions, verification queues, and active fleet allocations.
          </p>
        </div>
        <div className="text-xs font-semibold text-[#8BE0B0] bg-[#1D2B25] px-3.5 py-1.5 rounded-2xl border border-[#273b33] font-mono">
          Total Incidents: <strong className="text-[#F5F7F5] font-stat">{reports.length}</strong>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 bg-[#1D2B25] rounded-3xl border border-[#273b33] shadow-md space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          {/* Search Box */}
          <div className="sm:col-span-5 relative">
            <input
              type="text"
              placeholder="Search by ID, landmark, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#142820] border border-[#273b33] text-[#F5F7F5] placeholder-[#A5B3AA]/60 focus:outline-none focus:border-[#16A36A]"
            />
            <Search size={14} className="absolute left-2.5 top-3 text-[#A5B3AA]" />
          </div>

          {/* Priority Filter */}
          <div className="sm:col-span-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#142820] border border-[#273b33] text-[#F5F7F5] font-medium focus:outline-none focus:border-[#16A36A]"
            >
              <option value="all">All Priorities</option>
              <option value="critical">🔴 Critical</option>
              <option value="high">🟠 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#142820] border border-[#273b33] text-[#F5F7F5] font-medium focus:outline-none focus:border-[#16A36A]"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="assigned">Assigned</option>
              <option value="on_the_way">On the Way</option>
              <option value="collected">Collected</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* 3-Stream Categorization Filter */}
          <div className="sm:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#142820] border border-[#273b33] text-[#F5F7F5] font-medium focus:outline-none focus:border-[#16A36A]"
            >
              <option value="all">All Waste Streams</option>
              <option value="recyclable">🟢 Recyclable (Green)</option>
              <option value="organic">🔵 Wet / Organic (Blue)</option>
              <option value="mixed">🟡 Mixed / Other (Yellow)</option>
            </select>
          </div>

          <div className="sm:col-span-1">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              aria-label="Filter report source"
              className="w-full px-3 py-2 rounded-xl bg-[#142820] border border-[#273b33] text-[#F5F7F5] font-medium focus:outline-none focus:border-[#16A36A]"
            >
              <option value="all">Source</option>
              <option value="website">Website</option>
              <option value="sms">SMS</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-[#1D2B25] rounded-3xl border border-[#273b33] shadow-md overflow-hidden">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#A5B3AA]">
            No waste reports matching active search or filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#142820] border-b border-[#273b33] text-[#8BE0B0] font-bold uppercase tracking-wider text-[11px] font-mono">
                  <th className="py-3 px-4">Report ID</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Waste Stream</th>
                  <th className="py-3 px-4">Location & Ward</th>
                  <th className="py-3 px-4">WQI / Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Vehicle</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#273b33]">
                {filteredReports.map(report => {
                  const visual = getWasteVisualCategory(report.category);
                  return (
                    <tr
                      key={report.id}
                      className="hover:bg-[#24362f] transition cursor-pointer"
                      onClick={() => setSelectedReport(report)}
                    >
                      {/* ID & Photo */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {report.imageUrl ? (
                            <img src={report.imageUrl} alt={report.title} className="w-10 h-10 rounded-xl object-cover border border-[#273b33] shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl border border-[#273b33] bg-[#142820] grid place-items-center shrink-0 text-[#8BE0B0]">SMS</div>
                          )}
                          <div>
                            <div className="font-mono font-bold text-[#F5F7F5]">{report.id}</div>
                            <div className="text-[10px] text-[#A5B3AA] font-mono">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-[#F5F7F5] capitalize">{report.source || "website"}</div>
                        {report.source === "sms" && <div className="max-w-[150px] truncate text-[10px] text-[#A5B3AA]" title={report.originalSms || ""}>{report.senderPhoneNumber || "Unknown sender"}</div>}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                          style={{ backgroundColor: `${visual.color}20`, borderColor: visual.color, color: visual.mint }}
                        >
                          {visual.badgeLabel}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4 max-w-[220px]">
                        <div className="text-[#F5F7F5] truncate font-medium">{report.location.address}</div>
                        <div className="text-[10px] text-[#A5B3AA]">{report.location.ward}</div>
                      </td>

                      {/* WQI & Priority */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadgeClass(report.priority)}`}>
                            {report.priority.toUpperCase()}
                          </span>
                          <span className="text-[11px] font-bold text-[#8BE0B0] font-stat">
                            {report.wqi?.total || 75}/100
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${getStatusBadgeClass(report.status)}`}>
                          {report.status.replace("_", " ")}
                        </span>
                      </td>

                      {/* Vehicle */}
                      <td className="py-3 px-4">
                        {report.assignedVehicleId ? (
                          <div className="flex items-center gap-1.5 text-[#F5F7F5]">
                            <Truck size={13} className="text-[#16A36A]" />
                            <span className="font-semibold font-mono">{report.assignedVehicleId}</span>
                          </div>
                        ) : (
                          <span className="text-[#A5B3AA] italic">None</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="px-2.5 py-1 rounded-xl bg-[#142820] border border-[#273b33] hover:border-[#16A36A] text-[11px] font-bold text-[#A5B3AA] hover:text-white transition"
                          >
                            Inspect
                          </button>

                          {(report.status === "pending" || report.status === "verified") && (
                            <button
                              onClick={() => setAssigningReport(report)}
                              className="px-2.5 py-1 rounded-xl bg-[#16A36A] hover:bg-[#0f7a4e] text-white text-[11px] font-bold transition flex items-center gap-1 shadow-md shadow-[#16A36A]/30"
                            >
                              <Truck size={11} />
                              <span>Dispatch</span>
                            </button>
                          )}

                          {report.status === "collected" && (
                            <button
                              onClick={() => resolveReport(report.id)}
                              className="px-2.5 py-1 rounded-xl bg-[#16A36A] hover:bg-[#0f7a4e] text-white text-[11px] font-bold transition flex items-center gap-1 shadow-md shadow-[#16A36A]/30"
                            >
                              <CheckCircle2 size={11} />
                              <span>Resolve</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
