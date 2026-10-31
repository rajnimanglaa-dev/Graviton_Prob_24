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
      primaryWaste: "Plastic & Packaging (Green Stream)",
      riskLevel: "Critical",
      recommendedAction: "Install CCTV surveillance + Deploy Fixed Semi-Underground Bin"
    },
    {
      id: "HSP-102",
      location: "Wholesale Mandi Lane 2 Entrance",
      ward: "Ward 15 - West Hub",
      occurrences30d: 8,
      primaryWaste: "Organic Food Waste (Blue Stream)",
      riskLevel: "High",
      recommendedAction: "Establish Daily 6:00 AM Compactor Shift + Bio-Methanation Point"
    },
    {
      id: "HSP-103",
      location: "Vacant Plot 44 adjacent to School Wall",
      ward: "Ward 4 - East Extension",
      occurrences30d: 4,
      primaryWaste: "Construction Debris (Yellow Stream)",
      riskLevel: "High",
      recommendedAction: "Erect Barbed Fencing + ₹25,000 Illegal Dumping Fine Signboard"
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-[#F5F7F5]">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A36A] animate-pulse" />
          <span className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">
            PREDICTIVE SANITATION & HOTSPOT CLUSTERING
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7F5] tracking-tight mt-1 font-heading">
          Hotspot Surveillance & Recurring Zones
        </h1>
        <p className="text-xs sm:text-sm text-[#A5B3AA] mt-0.5">
          Identifies persistent illegal dumping epicenters, correlates geographic repeat frequencies, and informs preventive municipal infrastructure.
        </p>
      </div>

      {/* Density Map Container */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#F5F7F5] flex items-center gap-2 font-heading">
            <Layers size={16} className="text-[#16A36A]" />
            <span>Interactive Spatial Density Heatmap</span>
          </h3>
          <span className="text-xs text-[#8BE0B0] font-mono">
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
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">
              Ward-wise Waste Incidents
            </h4>
            <span className="text-xs text-[#A5B3AA]">Total volume logged</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardStatistics}>
                <XAxis dataKey="ward" stroke="#A5B3AA" fontSize={10} tickLine={false} />
                <YAxis stroke="#A5B3AA" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#142820", borderColor: "#273b33", color: "#F5F7F5", borderRadius: "12px", fontSize: "12px" }}
                />
                <Bar dataKey="totalReports" fill="#F4C542" radius={[6, 6, 0, 0]} name="Total Complaints" />
                <Bar dataKey="resolved" fill="#16A36A" radius={[6, 6, 0, 0]} name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cleanliness Rankings Summary */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-3">
          <h4 className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">
            Ward Performance Rankings
          </h4>

          <div className="space-y-2.5">
            {wardStatistics.map(w => (
              <div key={w.ward} className="p-3 bg-[#142820] rounded-2xl border border-[#273b33] text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#F5F7F5]">{w.ward}</div>
                  <div className="text-[10px] text-[#A5B3AA]">
                    {w.resolved} of {w.totalReports} resolved • Avg SLA: {w.avgResolutionHours}h
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-[#8BE0B0] font-stat">{w.score}%</span>
                  <div className="text-[10px] text-[#A5B3AA]">Cleanliness</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Identified Recurring Dumping Hotspots */}
      <div className="p-6 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-4">
        <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2 font-mono">
          <AlertTriangle size={16} className="text-red-400" />
          <span>Top Persistent Dumping Hotspots (Last 30 Days)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recurringSpots.map(spot => (
            <div key={spot.id} className="p-4 rounded-2xl bg-[#142820] border border-[#273b33] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#8BE0B0]">{spot.id}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-500/20 text-red-300 border border-red-500/40">
                  {spot.riskLevel} Risk
                </span>
              </div>
              <h5 className="font-bold text-[#F5F7F5] line-clamp-1">{spot.location}</h5>
              <div className="text-[#A5B3AA] text-[11px]">{spot.ward}</div>
              <div className="p-2.5 rounded-xl bg-[#1D2B25] border border-[#273b33] text-[#A5B3AA] space-y-1">
                <div><strong className="text-[#F5F7F5]">Occurrences:</strong> {spot.occurrences30d} incidents</div>
                <div><strong className="text-[#F5F7F5]">Dominant Stream:</strong> {spot.primaryWaste}</div>
              </div>
              <div className="text-[10px] text-[#8BE0B0] font-semibold pt-1">
                🛡️ <strong>Recommended Action:</strong> {spot.recommendedAction}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
