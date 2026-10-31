import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  Leaf,
  Sparkles
} from "lucide-react";

export default function AnalyticsPage() {
  const { reports, vehicles, wardStatistics } = useApp();
  const [timeRange, setTimeRange] = useState("30d");

  // Trends over time (monthly report frequency)
  const monthlyTrends = [
    { month: "May", submitted: 38, resolved: 35 },
    { month: "Jun", submitted: 46, resolved: 42 },
    { month: "Jul", submitted: 58, resolved: 54 },
    { month: "Aug", submitted: 72, resolved: 68 },
    { month: "Sep", submitted: 89, resolved: 85 },
    { month: "Oct", submitted: reports.length * 10 + 20, resolved: reports.filter(r => r.status === "resolved").length * 10 + 15 }
  ];

  // Category counts
  const catDistribution = [
    { name: "Plastic", count: reports.filter(r => r.category === "plastic").length * 8 + 34, color: "#174C37" },
    { name: "Mixed Garbage", count: reports.filter(r => r.category === "mixed").length * 8 + 28, color: "#76A96B" },
    { name: "Construction Debris", count: reports.filter(r => r.category === "construction").length * 8 + 19, color: "#D97706" },
    { name: "Organic Food", count: reports.filter(r => r.category === "organic").length * 8 + 16, color: "#0284C7" },
    { name: "Household", count: reports.filter(r => r.category === "household").length * 8 + 12, color: "#9333EA" }
  ];

  // CSV Export Functionality
  const exportToCsv = () => {
    const headers = ["Report_ID,Title,Category,Ward,Priority,WQI_Total,Status,Assigned_Vehicle,Created_At\n"];
    const rows = reports.map(r =>
      `"${r.id}","${r.title.replace(/"/g, '""')}","${r.category}","${r.location.ward}","${r.priority}",${r.wqi?.total || 75},"${r.status}","${r.assignedVehicleId || 'None'}","${r.createdAt}"`
    );

    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `smartwaste_municipal_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-[#174C37] uppercase tracking-wider">
              Directorate Executive Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#202923] tracking-tight mt-1">
            Analytics & Environmental Performance
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Macro-level metrics across all city wards: resolution turnaround SLAs, fleet efficiency, and landfill diversion volume.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 bg-white"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter</option>
          </select>

          <button
            type="button"
            onClick={exportToCsv}
            className="px-4 py-2 rounded-xl bg-[#174C37] text-white hover:bg-[#0f3325] text-xs font-bold shadow-sm transition flex items-center gap-2"
          >
            <Download size={14} />
            <span>Export CSV Audit Log</span>
          </button>
        </div>
      </div>

      {/* Top Level Strategic Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-stone-500">Average Resolution Turnaround</span>
          <div className="text-2xl sm:text-3xl font-black text-[#174C37]">3.8 Hours</div>
          <div className="text-[11px] text-emerald-700 font-medium">↓ 42% faster than municipal SLA</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-stone-500">Total Waste Diverted</span>
          <div className="text-2xl sm:text-3xl font-black text-stone-900">1,480+ Tons</div>
          <div className="text-[11px] text-stone-400">Processed at regional recycling hub</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-stone-500">Estimated Fuel / Distance Saved</span>
          <div className="text-2xl sm:text-3xl font-black text-blue-700">22.6%</div>
          <div className="text-[11px] text-blue-600 font-medium">via multi-stop heuristic TSP routing</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-stone-500">First-Time Redressal Rate</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">97.8%</div>
          <div className="text-[11px] text-amber-700 font-medium">Supported by before/after photos</div>
        </div>
      </div>

      {/* 2 Charts: Monthly Trend & Waste Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Trend Line Chart */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Waste Influx vs Clearance Volume (6-Month Trend)
            </h4>
            <span className="text-[11px] text-stone-400">Monthly Reports</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#202923", color: "#fff", borderRadius: "8px", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Line type="monotone" dataKey="submitted" stroke="#EA580C" strokeWidth={2.5} name="Submitted Complaints" />
                <Line type="monotone" dataKey="resolved" stroke="#174C37" strokeWidth={2.5} name="Verified Cleaned" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waste Category Donut */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Categorical Waste Composition
            </h4>
            <span className="text-[11px] text-stone-400">Tonnage Share</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={catDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  dataKey="count"
                >
                  {catDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#202923", color: "#fff", borderRadius: "8px", fontSize: "12px" }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Ward-Level Efficiency Matrix */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          Ward-Level Operational Resolution Matrix
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Municipal Ward</th>
                <th className="py-3 px-4">Total Incidents</th>
                <th className="py-3 px-4">Resolved</th>
                <th className="py-3 px-4">Pending</th>
                <th className="py-3 px-4">Avg Resolution SLA</th>
                <th className="py-3 px-4">Cleanliness Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {wardStatistics.map(w => (
                <tr key={w.ward} className="hover:bg-stone-50/70">
                  <td className="py-3 px-4 font-bold text-stone-900">{w.ward}</td>
                  <td className="py-3 px-4">{w.totalReports}</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">{w.resolved}</td>
                  <td className="py-3 px-4 text-amber-600 font-bold">{w.pending}</td>
                  <td className="py-3 px-4">{w.avgResolutionHours} Hours</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-stone-200 overflow-hidden">
                        <div
                          className="h-full bg-[#174C37] rounded-full"
                          style={{ width: `${w.score}%` }}
                        />
                      </div>
                      <span className="font-extrabold text-[#174C37]">{w.score}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
