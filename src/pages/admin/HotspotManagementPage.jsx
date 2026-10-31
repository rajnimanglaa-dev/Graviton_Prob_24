import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import WasteMap from "../../components/Map/WasteMap.jsx";
import {
  Layers,
  MapPin,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BarChart2,
  Filter
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function HotspotManagementPage() {
  const { reports, vehicles, wardStatistics } = useApp();
  const [selectedWard, setSelectedWard] = useState("all");

  const recurringSpots = [
    {
      id: "HSP-101",
      location: "Behind Market Gate 4, Sector 18",
      ward: "Ward 7 - Civil Lines",
      occurrences30d: 6,
      primaryWaste: "Plastic & Packaging",
      riskLevel: "Critical",
      recommendedAction: "Install CCTV surveillance + Deploy Fixed Semi-Underground Bin"
    },
    {
      id: "HSP-102",
      location: "Wholesale Mandi Lane 2 Entrance",
      ward: "Ward 15 - West Hub",
      occurrences30d: 8,
      primaryWaste: "Organic Food Waste",
      riskLevel: "High",
      recommendedAction: "Establish Daily 6:00 AM Compactor Shift + Bio-Methanation Point"
    },
    {
      id: "HSP-103",
      location: "Vacant Plot 44 adjacent to School Wall",
      ward: "Ward 4 - East Extension",
      occurrences30d: 4,
      primaryWaste: "Construction & Demolition Debris",
      riskLevel: "High",
      recommendedAction: "Erect Barbed Fencing + ₹25,000 Illegal Dumping Fine Signboard"
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-bold text-[#174C37] uppercase tracking-wider">
            Predictive Sanitation & Hotspot Clustering
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#202923] tracking-tight mt-1">
          Hotspot Surveillance & Recurring Zones
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Identifies persistent illegal dumping epicenters, correlates geographic repeat frequencies, and informs preventive municipal infrastructure.
        </p>
      </div>

      {/* Density Map Container */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
            <Layers size={16} className="text-[#174C37]" />
            <span>Interactive Spatial Density Heatmap</span>
          </h3>
          <span className="text-xs text-stone-500">
            Click 'Hotspot Density' in map controls to view buffer radii
          </span>
        </div>

        <WasteMap
          reports={reports}
          vehicles={vehicles}
          height="520px"
          showControls={true}
        />
      </div>

      {/* Ward Waste Distribution & Recurrence Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ward Distribution Chart */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Ward-wise Waste Incidents
            </h4>
            <span className="text-xs text-stone-400">Total volume logged</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardStatistics}>
                <XAxis dataKey="ward" stroke="#888888" fontSize={10} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#202923", color: "#fff", borderRadius: "8px", fontSize: "12px" }}
                />
                <Bar dataKey="totalReports" fill="#174C37" radius={[6, 6, 0, 0]} name="Total Complaints" />
                <Bar dataKey="resolved" fill="#76A96B" radius={[6, 6, 0, 0]} name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cleanliness Rankings Summary */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Ward Performance Rankings
          </h4>

          <div className="space-y-2.5">
            {wardStatistics.map(w => (
              <div key={w.ward} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-800">{w.ward}</div>
                  <div className="text-[10px] text-stone-400">
                    {w.resolved} of {w.totalReports} resolved • Avg SLA: {w.avgResolutionHours}h
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-[#174C37]">{w.score}%</span>
                  <div className="text-[10px] text-stone-500">Cleanliness</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Identified Recurring Dumping Hotspots */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-600" />
          <span>Top Persistent Dumping Hotspots (Last 30 Days)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recurringSpots.map(spot => (
            <div key={spot.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-stone-500">{spot.id}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700">
                  {spot.riskLevel} Risk
                </span>
              </div>
              <h5 className="font-bold text-stone-900 line-clamp-1">{spot.location}</h5>
              <div className="text-stone-500 text-[11px]">{spot.ward}</div>
              <div className="p-2 rounded-lg bg-white border border-stone-200 text-stone-700 space-y-1">
                <div><strong>Occurrences:</strong> {spot.occurrences30d} incidents</div>
                <div><strong>Dominant Waste:</strong> {spot.primaryWaste}</div>
              </div>
              <div className="text-[10px] text-[#174C37] font-semibold pt-1">
                🛡️ <strong>Recommended Action:</strong> {spot.recommendedAction}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
