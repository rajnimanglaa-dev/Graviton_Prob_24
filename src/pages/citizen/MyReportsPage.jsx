import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { Link } from "react-router-dom";
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
      case "critical": return "bg-red-100 text-red-700 border-red-200";
      case "high": return "bg-orange-100 text-orange-700 border-orange-200";
      case "medium": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "resolved": return "bg-emerald-100 text-emerald-800";
      case "collected": return "bg-teal-100 text-teal-800";
      case "on_the_way": return "bg-blue-100 text-blue-800";
      case "assigned": return "bg-indigo-100 text-indigo-800";
      case "verified": return "bg-purple-100 text-purple-800";
      default: return "bg-amber-100 text-amber-800";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#202923] tracking-tight">
            My Garbage Complaints
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Track status, vehicle assignments, and verified before/after photographic proof.
          </p>
        </div>

        <Link
          to="/citizen/report"
          className="px-4 py-2.5 rounded-xl bg-[#174C37] text-white hover:bg-[#0f3325] text-xs font-bold shadow-sm transition flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle size={15} />
          <span>New Report</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by ticket ID, landmark, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#174C37] text-stone-800"
          />
          <Search size={14} className="absolute left-2.5 top-3 text-stone-400" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {["all", "pending", "assigned", "on_the_way", "collected", "resolved"].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-bold capitalize whitespace-nowrap transition ${
                statusFilter === st
                  ? "bg-[#174C37] text-white shadow-xs"
                  : "bg-stone-50 text-stone-600 hover:bg-stone-100"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table / Card Grid */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText size={36} className="mx-auto text-stone-300" />
            <h4 className="text-sm font-bold text-stone-700">No reports found matching filters</h4>
            <p className="text-xs text-stone-400">Try adjusting your search criteria or submit a new grievance.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Incident</th>
                  <th className="py-3 px-4">Waste Class</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">WQI / Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Unit</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map(report => (
                  <tr
                    key={report.id}
                    className="hover:bg-stone-50/70 transition cursor-pointer"
                    onClick={() => setSelectedReport(report)}
                  >
                    {/* Incident ID & Photo */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={report.imageUrl}
                          alt={report.title}
                          className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <div className="font-mono font-bold text-[#174C37]">{report.id}</div>
                          <div className="text-[10px] text-stone-400">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Waste Class */}
                    <td className="py-3.5 px-4 font-semibold capitalize text-stone-800">
                      {report.category}
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <div className="text-stone-800 truncate font-medium">{report.location.address}</div>
                      <div className="text-[10px] text-stone-400">{report.location.ward}</div>
                    </td>

                    {/* WQI & Priority */}
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${getStatusBadgeClass(report.status)}`}>
                        {report.status.replace("_", " ")}
                      </span>
                    </td>

                    {/* Assigned Vehicle */}
                    <td className="py-3.5 px-4">
                      {report.assignedVehicleId ? (
                        <div className="flex items-center gap-1.5 text-stone-700">
                          <Truck size={13} className="text-[#174C37]" />
                          <span className="font-semibold">{report.assignedDriverName || report.assignedVehicleId}</span>
                        </div>
                      ) : (
                        <span className="text-stone-400 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReport(report);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-[#174C37] hover:text-white transition font-bold text-[11px] text-stone-700"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
