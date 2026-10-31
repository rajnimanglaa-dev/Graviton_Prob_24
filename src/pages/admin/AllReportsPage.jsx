import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
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

  const filteredReports = reports.filter(r => {
    if (priorityFilter !== "all" && r.priority !== priorityFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
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
      case "critical": return "bg-red-100 text-red-700 border-red-300";
      case "high": return "bg-orange-100 text-orange-700 border-orange-300";
      case "medium": return "bg-amber-100 text-amber-700 border-amber-300";
      default: return "bg-emerald-100 text-emerald-700 border-emerald-300";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "resolved": return "bg-emerald-100 text-emerald-800";
      case "collected": return "bg-teal-100 text-teal-800";
      case "on_the_way": return "bg-blue-100 text-blue-800";
      case "assigned": return "bg-indigo-100 text-indigo-800";
      case "verified": return "bg-purple-100 text-purple-800";
      case "rejected": return "bg-stone-200 text-stone-600";
      default: return "bg-amber-100 text-amber-800";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#202923] tracking-tight">
            All Municipal Waste Reports
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Complete database of citizen submissions, verification queues, and active fleet allocations.
          </p>
        </div>
        <div className="text-xs font-semibold text-stone-500 bg-white px-3 py-1.5 rounded-xl border border-stone-200">
          Total Incidents: <strong className="text-stone-900">{reports.length}</strong>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          {/* Search Box */}
          <div className="sm:col-span-5 relative">
            <input
              type="text"
              placeholder="Search by ID, landmark, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#174C37] text-stone-800"
            />
            <Search size={14} className="absolute left-2.5 top-3 text-stone-400" />
          </div>

          {/* Priority Filter */}
          <div className="sm:col-span-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 font-medium text-stone-700"
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
              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 font-medium text-stone-700"
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

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 font-medium text-stone-700"
            >
              <option value="all">All Waste Classes</option>
              <option value="plastic">Plastic Waste</option>
              <option value="construction">Construction Debris</option>
              <option value="organic">Organic / Market</option>
              <option value="mixed">Mixed Garbage</option>
              <option value="household">Household Solid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400">
            No waste reports matching active search or filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Report ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location & Ward</th>
                  <th className="py-3 px-4">WQI / Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Vehicle</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredReports.map(report => (
                  <tr
                    key={report.id}
                    className="hover:bg-stone-50/70 transition cursor-pointer"
                    onClick={() => setSelectedReport(report)}
                  >
                    {/* ID & Photo */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={report.imageUrl}
                          alt={report.title}
                          className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <div className="font-mono font-bold text-stone-900">{report.id}</div>
                          <div className="text-[10px] text-stone-400">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 font-semibold capitalize text-stone-800">
                      {report.category}
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 max-w-[220px]">
                      <div className="text-stone-800 truncate font-medium">{report.location.address}</div>
                      <div className="text-[10px] text-stone-400">{report.location.ward}</div>
                    </td>

                    {/* WQI & Priority */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadgeClass(report.priority)}`}>
                          {report.priority.toUpperCase()}
                        </span>
                        <span className="text-[11px] font-bold text-stone-700">
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
                        <div className="flex items-center gap-1.5 text-stone-700">
                          <Truck size={13} className="text-[#174C37]" />
                          <span className="font-semibold">{report.assignedVehicleId}</span>
                        </div>
                      ) : (
                        <span className="text-stone-400 italic">None</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-[11px] font-bold text-stone-700 transition"
                        >
                          Inspect
                        </button>

                        {(report.status === "pending" || report.status === "verified") && (
                          <button
                            onClick={() => setAssigningReport(report)}
                            className="px-2.5 py-1 rounded-lg bg-[#174C37] hover:bg-[#0f3325] text-white text-[11px] font-bold transition flex items-center gap-1"
                          >
                            <Truck size={11} />
                            <span>Dispatch</span>
                          </button>
                        )}

                        {report.status === "collected" && (
                          <button
                            onClick={() => resolveReport(report.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold transition flex items-center gap-1"
                          >
                            <CheckCircle2 size={11} />
                            <span>Resolve</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
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
