import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import { getWasteVisualCategory } from "../../services/wasteCategoryTheme.js";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  Layers,
  FileText,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import WasteMap from "../../components/Map/WasteMap.jsx";
import ReportDetailsModal from "../../components/Modals/ReportDetailsModal.jsx";
import AssignVehicleModal from "../../components/Modals/AssignVehicleModal.jsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

export default function AdminOverviewPage() {
  const { reports, vehicles, currentUser } = useApp();
  const [selectedReport, setSelectedReport] = useState(null);
  const [assigningReport, setAssigningReport] = useState(null);

  const pendingReports = reports.filter(r => r.status === "pending" || r.status === "verified");
  const inProgressReports = reports.filter(r => r.status === "assigned" || r.status === "on_the_way" || r.status === "arrived");
  const completedReports = reports.filter(r => r.status === "collected" || r.status === "resolved");
  const criticalReports = reports.filter(r => r.priority === "critical" && r.status !== "resolved");

  // 3-Color Categorization Chart Data
  const streamCounts = {
    recyclable: 0,
    organic: 0,
    mixed: 0
  };

  reports.forEach(r => {
    const visual = getWasteVisualCategory(r.category);
    if (visual.group === "recyclable") streamCounts.recyclable++;
    else if (visual.group === "organic") streamCounts.organic++;
    else streamCounts.mixed++;
  });

  const categoryChartData = [
    { name: "🟢 Recyclable (Green)", count: streamCounts.recyclable, fill: "#16A36A" },
    { name: "🔵 Wet / Organic (Blue)", count: streamCounts.organic, fill: "#3987F5" },
    { name: "🟡 Mixed / Other (Yellow)", count: streamCounts.mixed, fill: "#F4C542" }
  ];

  // Chart data: Priority distribution
  const priorityChartData = [
    { name: "Critical", value: reports.filter(r => r.priority === "critical").length, color: "#EF4444" },
    { name: "High", value: reports.filter(r => r.priority === "high").length, color: "#F97316" },
    { name: "Medium", value: reports.filter(r => r.priority === "medium").length, color: "#F59E0B" },
    { name: "Low", value: reports.filter(r => r.priority === "low").length, color: "#10B981" }
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-[#F5F7F5]">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#142820] to-[#1D2B25] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-[#273b33] shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16A36A]/20 border border-[#16A36A]/40 text-xs font-semibold text-[#8BE0B0] font-mono">
            <ShieldCheck size={14} className="text-[#16A36A]" />
            <span>MUNICIPAL COMMAND CENTRE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-heading">
            Municipal Sanitation Operations
          </h2>
          <p className="text-xs sm:text-sm text-[#A5B3AA] leading-relaxed">
            Real-time urban waste monitoring, AI-calculated priority dispatch, and vehicle fleet management across all administrative zones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/priority-queue"
            className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-md shadow-red-600/30 transition flex items-center gap-2"
          >
            <AlertTriangle size={15} />
            <span>Priority Queue ({criticalReports.length} Critical)</span>
          </Link>
          <Link
            to="/admin/route-optimization"
            className="px-5 py-3 rounded-xl bg-[#1D2B25] border border-[#273b33] text-[#F5F7F5] hover:text-[#8BE0B0] text-xs font-extrabold shadow-sm transition"
          >
            Route Optimizer (TSP)
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards (Manrope Numbers) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Incidents */}
        <div className="p-5 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-1">
          <div className="text-xs font-semibold text-[#A5B3AA] flex items-center justify-between">
            <span>Total Logged</span>
            <FileText size={16} className="text-[#8BE0B0]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F5F7F5] font-stat">{reports.length}</div>
          <div className="text-[11px] text-[#A5B3AA]">All municipal wards</div>
        </div>

        {/* Pending Dispatch */}
        <div className="p-5 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-1">
          <div className="text-xs font-semibold text-[#A5B3AA] flex items-center justify-between">
            <span>Pending Dispatch</span>
            <Clock size={16} className="text-[#F4C542]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F4C542] font-stat">{pendingReports.length}</div>
          <div className="text-[11px] text-[#fce58d]">Requires fleet action</div>
        </div>

        {/* Critical Incidents */}
        <div className="p-5 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-1">
          <div className="text-xs font-semibold text-[#A5B3AA] flex items-center justify-between">
            <span>Critical Hotspots</span>
            <AlertTriangle size={16} className="text-red-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-400 font-stat">{criticalReports.length}</div>
          <div className="text-[11px] text-red-300">WQI &gt; 75 severity</div>
        </div>

        {/* Active Fleet */}
        <div className="p-5 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-1">
          <div className="text-xs font-semibold text-[#A5B3AA] flex items-center justify-between">
            <span>Fleet Trucks</span>
            <Truck size={16} className="text-[#16A36A]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#8BE0B0] font-stat">{vehicles.length}</div>
          <div className="text-[11px] text-[#8BE0B0]">All GPS units active</div>
        </div>

        {/* Cleared Today */}
        <div className="p-5 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-1 col-span-2 lg:col-span-1">
          <div className="text-xs font-semibold text-[#A5B3AA] flex items-center justify-between">
            <span>Cleared Today</span>
            <CheckCircle2 size={16} className="text-[#16A36A]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#16A36A] font-stat">{completedReports.length}</div>
          <div className="text-[11px] text-[#8BE0B0]">Photo verified</div>
        </div>
      </div>

      {/* Embedded Live Map Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#F5F7F5] font-heading">Live Spatial Grid & Fleet Telemetry</h3>
            <p className="text-xs text-[#A5B3AA]">CartoDB Dark Matter view with 3-color stream markers</p>
          </div>
          <Link to="/admin/hotspots" className="text-xs font-bold text-[#8BE0B0] hover:underline flex items-center gap-1 font-heading">
            <span>Hotspot Analysis</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <WasteMap
          reports={reports}
          vehicles={vehicles}
          height="450px"
          onSelectReport={(r) => setSelectedReport(r)}
        />
      </div>

      {/* 2 Charts: Category Distribution & Priority Share */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 3-Stream Categorization Bar Chart */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">
              3-Stream Categorization Volume Breakdown
            </h4>
            <span className="text-[11px] text-[#A5B3AA]">Incidents by Stream</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <XAxis dataKey="name" stroke="#A5B3AA" fontSize={11} tickLine={false} />
                <YAxis stroke="#A5B3AA" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#142820", borderColor: "#273b33", color: "#F5F7F5", borderRadius: "12px", fontSize: "12px" }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Donut Chart */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">
              Priority Tier Composition
            </h4>
            <span className="text-[11px] text-[#A5B3AA]">By WQI Severity</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {priorityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#142820", borderColor: "#273b33", color: "#F5F7F5", borderRadius: "12px", fontSize: "12px" }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: "11px", paddingTop: "10px", color: "#A5B3AA" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Incidents Needing Action */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#F5F7F5] font-heading">
            Immediate Dispatch Queue ({pendingReports.length} Pending)
          </h3>
          <Link to="/admin/priority-queue" className="text-xs font-bold text-[#8BE0B0] hover:underline font-heading">
            View Priority Queue →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingReports.slice(0, 4).map(report => {
            const visual = getWasteVisualCategory(report.category);
            return (
              <div
                key={report.id}
                className="p-5 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md hover:border-[#16A36A]/50 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={report.imageUrl}
                      alt={report.title}
                      className="w-12 h-12 rounded-2xl object-cover border border-[#273b33]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#8BE0B0]">{report.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          report.priority === "critical" ? "bg-red-500/20 text-red-300 border border-red-500/40" : "bg-orange-500/20 text-orange-300 border border-orange-500/40"
                        }`}>
                          {report.priority.toUpperCase()}
                        </span>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                          style={{ backgroundColor: `${visual.color}20`, borderColor: visual.color, color: visual.mint }}
                        >
                          {visual.badgeLabel}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-[#F5F7F5] line-clamp-1 mt-0.5">{report.title}</h5>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-[#A5B3AA] block font-mono">WQI</span>
                    <span className="text-base font-black text-[#8BE0B0] font-stat">{report.wqi?.total || 75}</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#A5B3AA] line-clamp-1">📍 {report.location.address}</p>

                <div className="flex items-center justify-between pt-2 border-t border-[#273b33]">
                  <button
                    type="button"
                    onClick={() => setSelectedReport(report)}
                    className="text-xs font-bold text-[#A5B3AA] hover:text-white"
                  >
                    View Details
                  </button>

                  <button
                    type="button"
                    onClick={() => setAssigningReport(report)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#16A36A] text-white text-xs font-bold hover:bg-[#0f7a4e] transition flex items-center gap-1.5 shadow-md shadow-[#16A36A]/30"
                  >
                    <Truck size={13} />
                    <span>Recommend Vehicle</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
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
