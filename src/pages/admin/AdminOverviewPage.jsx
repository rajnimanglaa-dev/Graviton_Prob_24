import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
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

  // Chart data: Category distribution
  const categoryCounts = reports.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = Object.keys(categoryCounts).map(cat => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    count: categoryCounts[cat]
  }));

  // Chart data: Priority distribution
  const priorityChartData = [
    { name: "Critical", value: reports.filter(r => r.priority === "critical").length, color: "#DC2626" },
    { name: "High", value: reports.filter(r => r.priority === "high").length, color: "#EA580C" },
    { name: "Medium", value: reports.filter(r => r.priority === "medium").length, color: "#D97706" },
    { name: "Low", value: reports.filter(r => r.priority === "low").length, color: "#16A34A" }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#174C37] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-emerald-300">
            <ShieldCheck size={14} />
            <span>Directorate Command Centre</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Municipal Sanitation Operations
          </h2>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Real-time urban waste monitoring, AI-calculated priority dispatch, and vehicle fleet management across all administrative zones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/priority-queue"
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 text-xs font-extrabold shadow-sm transition flex items-center gap-2"
          >
            <AlertTriangle size={15} />
            <span>Priority Queue ({criticalReports.length} Critical)</span>
          </Link>
          <Link
            to="/admin/route-optimization"
            className="px-5 py-3 rounded-xl bg-white text-[#174C37] hover:bg-stone-100 text-xs font-extrabold shadow-sm transition"
          >
            Route Optimizer
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Incidents */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-stone-500 flex items-center justify-between">
            <span>Total Logged</span>
            <FileText size={16} className="text-stone-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900">{reports.length}</div>
          <div className="text-[11px] text-stone-400">All municipal wards</div>
        </div>

        {/* Pending Dispatch */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-stone-500 flex items-center justify-between">
            <span>Pending Dispatch</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">{pendingReports.length}</div>
          <div className="text-[11px] text-amber-700 font-medium">Requires fleet action</div>
        </div>

        {/* Critical Incidents */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-stone-500 flex items-center justify-between">
            <span>Critical Hotspots</span>
            <AlertTriangle size={16} className="text-red-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-600">{criticalReports.length}</div>
          <div className="text-[11px] text-red-600 font-medium">WQI &gt; 75 severity</div>
        </div>

        {/* Active Fleet */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-stone-500 flex items-center justify-between">
            <span>Fleet Trucks</span>
            <Truck size={16} className="text-[#174C37]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#174C37]">{vehicles.length}</div>
          <div className="text-[11px] text-emerald-700 font-medium">All GPS units active</div>
        </div>

        {/* Cleared Today */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1 col-span-2 lg:col-span-1">
          <div className="text-xs font-semibold text-stone-500 flex items-center justify-between">
            <span>Cleared Today</span>
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">{completedReports.length}</div>
          <div className="text-[11px] text-emerald-700 font-medium">Photo verified</div>
        </div>
      </div>

      {/* Embedded Live Map Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900">Live Spatial Grid & Fleet Telemetry</h3>
            <p className="text-xs text-stone-500">Interactive OpenStreetMap view with colored priority markers</p>
          </div>
          <Link to="/admin/hotspots" className="text-xs font-bold text-[#174C37] hover:underline flex items-center gap-1">
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
        {/* Category Breakdown Bar Chart */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Waste Category Volume Distribution
            </h4>
            <span className="text-[11px] text-stone-400">Total Cases</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#202923", color: "#fff", borderRadius: "8px", fontSize: "12px" }}
                />
                <Bar dataKey="count" fill="#174C37" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Donut Chart */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Priority Tier Composition
            </h4>
            <span className="text-[11px] text-stone-400">By WQI Severity</span>
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
                  contentStyle={{ backgroundColor: "#202923", color: "#fff", borderRadius: "8px", fontSize: "12px" }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Incidents Needing Action */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900">
            Immediate Dispatch Queue ({pendingReports.length} Pending)
          </h3>
          <Link to="/admin/priority-queue" className="text-xs font-bold text-[#174C37] hover:underline">
            View Priority Queue →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingReports.slice(0, 4).map(report => (
            <div
              key={report.id}
              className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-[#174C37] transition space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={report.imageUrl}
                    alt={report.title}
                    className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-700">{report.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        report.priority === "critical" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                      }`}>
                        {report.priority.toUpperCase()}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-stone-800 line-clamp-1 mt-0.5">{report.title}</h5>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-stone-400 block">WQI</span>
                  <span className="text-base font-black text-[#174C37]">{report.wqi?.total || 75}</span>
                </div>
              </div>

              <p className="text-[11px] text-stone-500 line-clamp-1">📍 {report.location.address}</p>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setSelectedReport(report)}
                  className="text-xs font-bold text-stone-600 hover:text-stone-900"
                >
                  View Details
                </button>

                <button
                  type="button"
                  onClick={() => setAssigningReport(report)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#174C37] text-white text-xs font-bold hover:bg-[#0f3325] transition flex items-center gap-1.5 shadow-xs"
                >
                  <Truck size={13} />
                  <span>Recommend Vehicle</span>
                </button>
              </div>
            </div>
          ))}
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
