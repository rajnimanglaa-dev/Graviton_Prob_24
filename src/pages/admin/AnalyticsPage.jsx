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

  // 3-Color Categorization Distribution
  const catDistribution = [
    { name: "🟢 Recyclable (Green)", count: reports.filter(r => r.category === "plastic" || r.category === "paper").length * 8 + 34, color: "#16A36A" },
    { name: "🔵 Wet / Organic (Blue)", count: reports.filter(r => r.category === "organic").length * 8 + 26, color: "#3987F5" },
    { name: "🟡 Mixed / Other (Yellow)", count: reports.filter(r => r.category === "mixed" || r.category === "construction" || r.category === "household").length * 8 + 30, color: "#F4C542" }
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
    link.setAttribute("download", `click2clean_municipal_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#F5F7F5]">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A36A] animate-pulse" />
            <span className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">
              DIRECTORATE EXECUTIVE TELEMETRY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7F5] tracking-tight mt-1 font-heading">
            Analytics & Environmental Performance
          </h1>
          <p className="text-xs sm:text-sm text-[#A5B3AA] mt-0.5">
            Macro-level metrics across all city wards: resolution turnaround SLAs, fleet efficiency, and landfill diversion volume.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#273b33] text-xs font-bold text-[#F5F7F5] bg-[#142820] focus:outline-none focus:border-[#16A36A]"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter</option>
          </select>

          <button
            type="button"
            onClick={exportToCsv}
            className="px-4 py-2 rounded-xl bg-[#16A36A] text-white hover:bg-[#0f7a4e] text-xs font-bold shadow-md shadow-[#16A36A]/30 transition flex items-center gap-2"
          >
            <Download size={14} />
            <span>Export CSV Audit Log</span>
          </button>
        </div>
      </div>

      {/* Top Level Strategic Metrics (Manrope numbers) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-1">
          <span className="text-xs font-semibold text-[#A5B3AA]">Average Resolution Turnaround</span>
          <div className="text-2xl sm:text-3xl font-black text-[#8BE0B0] font-stat">3.8 Hours</div>
          <div className="text-[11px] text-[#8BE0B0] font-medium">↓ 42% faster than municipal SLA</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-1">
          <span className="text-xs font-semibold text-[#A5B3AA]">Total Waste Diverted</span>
          <div className="text-2xl sm:text-3xl font-black text-[#F5F7F5] font-stat">1,480+ Tons</div>
          <div className="text-[11px] text-[#A5B3AA]">Processed at regional recycling hub</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-1">
          <span className="text-xs font-semibold text-[#A5B3AA]">Estimated Fuel Saved</span>
          <div className="text-2xl sm:text-3xl font-black text-[#3987F5] font-stat">22.6%</div>
          <div className="text-[11px] text-[#90c2ff] font-medium">via multi-stop heuristic TSP routing</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-1">
          <span className="text-xs font-semibold text-[#A5B3AA]">First-Time Redressal Rate</span>
          <div className="text-2xl sm:text-3xl font-black text-[#F4C542] font-stat">97.8%</div>
          <div className="text-[11px] text-[#fce58d] font-medium">Supported by before/after photos</div>
        </div>
      </div>

      {/* 2 Charts: Monthly Trend & 3-Color Categorical Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Trend Line Chart */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">
              Waste Influx vs Clearance Volume (6-Month Trend)
            </h4>
            <span className="text-[11px] text-[#A5B3AA]">Monthly Reports</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#273b33" />
                <XAxis dataKey="month" stroke="#A5B3AA" fontSize={11} tickLine={false} />
                <YAxis stroke="#A5B3AA" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#142820", borderColor: "#273b33", color: "#F5F7F5", borderRadius: "12px", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", color: "#A5B3AA" }} />
                <Line type="monotone" dataKey="submitted" stroke="#F4C542" strokeWidth={2.5} name="Submitted Complaints" />
                <Line type="monotone" dataKey="resolved" stroke="#16A36A" strokeWidth={2.5} name="Verified Cleaned" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3-Color Waste Categorization Donut */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">
              3-Stream Material Breakdown
            </h4>
            <span className="text-[11px] text-[#A5B3AA]">Tonnage Share</span>
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
                  contentStyle={{ backgroundColor: "#142820", borderColor: "#273b33", color: "#F5F7F5", borderRadius: "12px", fontSize: "12px" }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: "11px", paddingTop: "8px", color: "#A5B3AA" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Ward-Level Efficiency Matrix */}
      <div className="p-6 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-4">
        <h4 className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">
          Ward-Level Operational Resolution Matrix
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#142820] border-b border-[#273b33] text-[#A5B3AA] font-bold uppercase tracking-wider text-[11px] font-mono">
                <th className="py-3 px-4">Municipal Ward</th>
                <th className="py-3 px-4">Total Incidents</th>
                <th className="py-3 px-4">Resolved</th>
                <th className="py-3 px-4">Pending</th>
                <th className="py-3 px-4">Avg Resolution SLA</th>
                <th className="py-3 px-4">Cleanliness Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#273b33]">
              {wardStatistics.map(w => (
                <tr key={w.ward} className="hover:bg-[#24362f] transition">
                  <td className="py-3 px-4 font-bold text-[#F5F7F5]">{w.ward}</td>
                  <td className="py-3 px-4 font-stat">{w.totalReports}</td>
                  <td className="py-3 px-4 text-[#8BE0B0] font-bold font-stat">{w.resolved}</td>
                  <td className="py-3 px-4 text-[#F4C542] font-bold font-stat">{w.pending}</td>
                  <td className="py-3 px-4 font-stat">{w.avgResolutionHours} Hours</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-[#101A17] overflow-hidden border border-[#273b33]">
                        <div
                          className="h-full bg-[#16A36A] rounded-full"
                          style={{ width: `${w.score}%` }}
                        />
                      </div>
                      <span className="font-extrabold text-[#8BE0B0] font-stat">{w.score}%</span>
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
