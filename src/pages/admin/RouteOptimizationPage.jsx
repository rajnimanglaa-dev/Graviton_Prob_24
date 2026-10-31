import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { optimizeRoute, MUNICIPAL_DEPOT, RECYCLING_LANDFILL } from "../../services/routeService.js";
import { getWasteVisualCategory } from "../../services/wasteCategoryTheme.js";
import RouteMap from "../../components/Map/RouteMap.jsx";
import {
  Route,
  Truck,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Info
} from "lucide-react";

export default function RouteOptimizationPage() {
  const { vehicles, reports } = useApp();
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || "SW-TRUCK-01");

  const activeReports = reports.filter(r => r.status !== "resolved" && r.status !== "rejected");

  const [selectedReportIds, setSelectedReportIds] = useState(() =>
    activeReports.slice(0, 4).map(r => r.id)
  );

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  const toggleStop = (id) => {
    if (selectedReportIds.includes(id)) {
      setSelectedReportIds(selectedReportIds.filter(x => x !== id));
    } else {
      setSelectedReportIds([...selectedReportIds, id]);
    }
  };

  const candidateStops = activeReports.filter(r => selectedReportIds.includes(r.id));

  const routeResult = optimizeRoute({
    startLocation: selectedVehicle?.location || MUNICIPAL_DEPOT,
    stops: candidateStops
  });

  const totalPayloadNeededKg = candidateStops.reduce((sum, s) => {
    return sum + (s.wqi?.estimatedWeightKg || Math.round((s.wqi?.estimatedVolumeM3 || 2) * 350));
  }, 0);

  const remainingCapacity = selectedVehicle?.capacityKg - selectedVehicle?.currentLoadKg;
  const isOverCapacity = totalPayloadNeededKg > remainingCapacity;

  return (
    <div className="space-y-6 animate-fadeIn text-[#F5F7F5]">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A36A] animate-pulse" />
            <span className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">
              AUTONOMOUS FLEET ROUTING ENGINE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7F5] tracking-tight mt-1 font-heading">
            Smart Multi-Stop Route Optimization
          </h1>
          <p className="text-xs sm:text-sm text-[#A5B3AA] mt-0.5">
            Greedy TSP heuristic sequencing collection waypoints: prioritizing critical hazard severity first while minimizing deadhead transit mileage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#A5B3AA] bg-[#1D2B25] px-3.5 py-1.5 rounded-xl border border-[#273b33]">
            Selected Waypoints: <strong className="text-[#8BE0B0] font-stat">{candidateStops.length}</strong>
          </span>
        </div>
      </div>

      {/* Main Grid: Controls & Route Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 5 Cols: Vehicle Selector & Stops List */}
        <div className="lg:col-span-5 space-y-4">
          {/* Vehicle Selector Card */}
          <div className="p-5 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-3">
            <label className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider block font-mono">
              1. Select Dispatch Vehicle:
            </label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#273b33] text-xs font-bold text-[#F5F7F5] bg-[#142820] focus:outline-none focus:border-[#16A36A]"
            >
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.type}) — {v.capacityKg - v.currentLoadKg} kg free
                </option>
              ))}
            </select>

            {/* Vehicle Stats Strip */}
            <div className="p-3 bg-[#142820] rounded-2xl border border-[#273b33] text-xs space-y-1">
              <div className="flex justify-between text-[#A5B3AA]">
                <span>Driver: <strong className="text-[#F5F7F5]">{selectedVehicle.driverName}</strong></span>
                <span className="capitalize text-[#8BE0B0] font-bold font-mono">{selectedVehicle.status.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between text-[#A5B3AA]">
                <span>Free Payload: <strong className="text-[#8BE0B0] font-stat">{remainingCapacity} kg</strong></span>
                <span>Stops Weight: <strong className={isOverCapacity ? "text-red-400 font-stat" : "text-[#F5F7F5] font-stat"}>{totalPayloadNeededKg} kg</strong></span>
              </div>
              {isOverCapacity && (
                <div className="text-[11px] text-red-400 font-bold flex items-center gap-1 pt-1">
                  <AlertTriangle size={12} />
                  <span>Exceeds vehicle capacity by {totalPayloadNeededKg - remainingCapacity} kg!</span>
                </div>
              )}
            </div>
          </div>

          {/* Stops Selector Card */}
          <div className="p-5 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">
                2. Select Waypoints to Route:
              </label>
              <button
                type="button"
                onClick={() => setSelectedReportIds(activeReports.map(r => r.id))}
                className="text-[11px] font-bold text-[#8BE0B0] hover:underline"
              >
                Select All
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {activeReports.map(report => {
                const isSelected = selectedReportIds.includes(report.id);
                const visual = getWasteVisualCategory(report.category);
                return (
                  <div
                    key={report.id}
                    onClick={() => toggleStop(report.id)}
                    className={`p-3 rounded-2xl border transition cursor-pointer text-xs flex items-center justify-between ${
                      isSelected
                        ? "border-[#16A36A] bg-[#16A36A]/15 text-[#8BE0B0]"
                        : "border-[#273b33] bg-[#142820] text-[#A5B3AA] hover:border-[#16A36A]/40"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded text-[#16A36A] focus:ring-[#16A36A] h-4 w-4 shrink-0 accent-[#16A36A]"
                      />
                      <div className="min-w-0">
                        <div className="font-bold flex items-center gap-1.5">
                          <span className="font-mono text-[#F5F7F5]">{report.id}</span>
                          <span
                            className="text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase"
                            style={{ backgroundColor: `${visual.color}25`, color: visual.mint }}
                          >
                            {visual.badgeLabel}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#A5B3AA] truncate">{report.location.address}</p>
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-[#A5B3AA] shrink-0 font-medium font-stat">
                      ~{report.wqi?.estimatedVolumeM3 || 2.4} m³
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Interactive Map & Turn-by-Turn Sequence */}
        <div className="lg:col-span-7 space-y-4">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-[#1D2B25] rounded-3xl border border-[#273b33] shadow-md text-center">
            <div>
              <span className="text-[10px] text-[#A5B3AA] uppercase font-bold block font-mono">Estimated Distance</span>
              <span className="text-xl font-black text-[#8BE0B0] font-stat">{routeResult.totalDistanceFormatted}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#A5B3AA] uppercase font-bold block font-mono">Travel Duration</span>
              <span className="text-xl font-black text-[#F5F7F5] font-stat">~{routeResult.estimatedDurationMins} mins</span>
            </div>
            <div>
              <span className="text-[10px] text-[#A5B3AA] uppercase font-bold block font-mono">Est. CO2 Diverted</span>
              <span className="text-xl font-black text-[#16A36A] font-stat">~{routeResult.estimatedCo2SavingsKg} kg</span>
            </div>
          </div>

          {/* Interactive Route Map */}
          <RouteMap routeData={routeResult} height="440px" />

          {/* Turn-by-Turn Sequenced Stops List */}
          <div className="p-5 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-3">
            <h4 className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider flex items-center gap-2 font-mono">
              <Zap size={14} className="text-[#16A36A]" />
              <span>Optimized Multi-Stop Itinerary Sequence</span>
            </h4>

            <div className="space-y-2 text-xs">
              {/* Start Depot */}
              <div className="p-2.5 rounded-xl bg-[#142820] border border-[#273b33] flex items-center justify-between text-[#8BE0B0]">
                <div className="flex items-center gap-2">
                  <span className="font-bold">🏢 START:</span>
                  <span className="text-[#F5F7F5]">{MUNICIPAL_DEPOT.name} ({MUNICIPAL_DEPOT.address})</span>
                </div>
                <span className="font-mono text-[11px] text-[#8BE0B0]">Depot Hub</span>
              </div>

              {/* Numbered Stops */}
              {routeResult.orderedStops.map((stop, idx) => {
                const visual = getWasteVisualCategory(stop.category);
                return (
                  <div
                    key={stop.id}
                    className="p-2.5 rounded-xl bg-[#142820] border border-[#273b33] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-6 h-6 rounded-full text-white text-[11px] font-extrabold flex items-center justify-center shrink-0 font-stat"
                        style={{ backgroundColor: visual.color }}
                      >
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="font-bold text-[#F5F7F5] truncate">
                          {stop.id} — {stop.title}
                        </div>
                        <div className="text-[11px] text-[#A5B3AA] truncate">
                          📍 {stop.location.address}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                        style={{ backgroundColor: `${visual.color}25`, color: visual.mint }}
                      >
                        {visual.badgeLabel}
                      </span>
                      <div className="text-[10px] text-[#A5B3AA] mt-0.5 font-stat">
                        +{stop.legDistanceFormatted}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Final Landfill Stop */}
              <div className="p-2.5 rounded-xl bg-[#142820] border border-[#16A36A]/40 flex items-center justify-between text-[#8BE0B0]">
                <div className="flex items-center gap-2">
                  <span className="font-bold">♻️ FINAL:</span>
                  <span className="text-[#F5F7F5]">{RECYCLING_LANDFILL.name} ({RECYCLING_LANDFILL.address})</span>
                </div>
                <span className="font-mono text-[11px] text-[#8BE0B0]">Eco-Processing Plant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
