import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { optimizeRoute, MUNICIPAL_DEPOT, RECYCLING_LANDFILL } from "../../services/routeService.js";
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

  // Filter unresolved reports
  const activeReports = reports.filter(r => r.status !== "resolved" && r.status !== "rejected");

  const [selectedReportIds, setSelectedReportIds] = useState(() =>
    activeReports.slice(0, 4).map(r => r.id)
  );

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  // Toggle report stop selection
  const toggleStop = (id) => {
    if (selectedReportIds.includes(id)) {
      setSelectedReportIds(selectedReportIds.filter(x => x !== id));
    } else {
      setSelectedReportIds([...selectedReportIds, id]);
    }
  };

  // Selected stop objects
  const candidateStops = activeReports.filter(r => selectedReportIds.includes(r.id));

  // Compute optimized route
  const routeResult = optimizeRoute({
    startLocation: selectedVehicle?.location || MUNICIPAL_DEPOT,
    stops: candidateStops
  });

  // Calculate total payload needed
  const totalPayloadNeededKg = candidateStops.reduce((sum, s) => {
    return sum + (s.wqi?.estimatedWeightKg || Math.round((s.wqi?.estimatedVolumeM3 || 2) * 350));
  }, 0);

  const remainingCapacity = selectedVehicle?.capacityKg - selectedVehicle?.currentLoadKg;
  const isOverCapacity = totalPayloadNeededKg > remainingCapacity;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-[#174C37] uppercase tracking-wider">
              Autonomous Vehicle Route Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#202923] tracking-tight mt-1">
            Smart Multi-Stop Route Optimization
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Greedy TSP heuristic sequencing collection waypoints: prioritizing critical hazard severity first while minimizing deadhead transit mileage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 bg-white px-3 py-1.5 rounded-xl border border-stone-200">
            Selected Waypoints: <strong className="text-stone-900">{candidateStops.length}</strong>
          </span>
        </div>
      </div>

      {/* Main Grid: Controls & Route Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 4 Cols: Vehicle Selector & Stops List */}
        <div className="lg:col-span-5 space-y-4">
          {/* Vehicle Selector Card */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
              1. Select Dispatch Vehicle:
            </label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#174C37]"
            >
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.type}) — {v.capacityKg - v.currentLoadKg} kg free
                </option>
              ))}
            </select>

            {/* Vehicle Stats Strip */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
              <div className="flex justify-between text-stone-600">
                <span>Driver: <strong>{selectedVehicle.driverName}</strong></span>
                <span className="capitalize text-emerald-800 font-bold">{selectedVehicle.status.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Free Payload: <strong>{remainingCapacity} kg</strong></span>
                <span>Stops Weight: <strong className={isOverCapacity ? "text-red-600" : "text-stone-900"}>{totalPayloadNeededKg} kg</strong></span>
              </div>
              {isOverCapacity && (
                <div className="text-[11px] text-red-600 font-bold flex items-center gap-1 pt-1">
                  <AlertTriangle size={12} />
                  <span>Exceeds vehicle capacity by {totalPayloadNeededKg - remainingCapacity} kg!</span>
                </div>
              )}
            </div>
          </div>

          {/* Stops Selector Card */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                2. Select Waypoints to Route:
              </label>
              <button
                type="button"
                onClick={() => setSelectedReportIds(activeReports.map(r => r.id))}
                className="text-[11px] font-bold text-[#174C37] hover:underline"
              >
                Select All
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {activeReports.map(report => {
                const isSelected = selectedReportIds.includes(report.id);
                return (
                  <div
                    key={report.id}
                    onClick={() => toggleStop(report.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer text-xs flex items-center justify-between ${
                      isSelected
                        ? "border-[#174C37] bg-emerald-50/50 text-[#174C37]"
                        : "border-stone-200 hover:border-stone-300 text-stone-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded text-[#174C37] focus:ring-[#174C37] h-4 w-4 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold flex items-center gap-1.5">
                          <span>{report.id}</span>
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                            report.priority === "critical" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                          }`}>
                            {report.priority}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 truncate">{report.location.address}</p>
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-stone-600 shrink-0 font-medium">
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
          <div className="grid grid-cols-3 gap-3 p-4 bg-white rounded-2xl border border-stone-200 shadow-xs text-center">
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Estimated Distance</span>
              <span className="text-xl font-black text-[#174C37]">{routeResult.totalDistanceFormatted}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Estimated Travel Time</span>
              <span className="text-xl font-black text-stone-800">~{routeResult.estimatedDurationMins} mins</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Est. CO2 Diverted</span>
              <span className="text-xl font-black text-emerald-700">~{routeResult.estimatedCo2SavingsKg} kg</span>
            </div>
          </div>

          {/* Interactive Route Map */}
          <RouteMap routeData={routeResult} height="440px" />

          {/* Turn-by-Turn Sequenced Stops List */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">
              <Zap size={14} className="text-[#174C37]" />
              <span>Optimized Multi-Stop Itinerary Sequence</span>
            </h4>

            <div className="space-y-2 text-xs">
              {/* Start Depot */}
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-blue-950">
                <div className="flex items-center gap-2">
                  <span className="font-bold">🏢 START:</span>
                  <span>{MUNICIPAL_DEPOT.name} ({MUNICIPAL_DEPOT.address})</span>
                </div>
                <span className="font-mono text-[11px] text-blue-700">Depot Hub</span>
              </div>

              {/* Numbered Stops */}
              {routeResult.orderedStops.map((stop, idx) => (
                <div
                  key={stop.id}
                  className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-[#174C37] text-white text-[11px] font-extrabold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-stone-900 truncate">
                        {stop.id} — {stop.title}
                      </div>
                      <div className="text-[11px] text-stone-500 truncate">
                        📍 {stop.location.address}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      stop.priority === "critical" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                    }`}>
                      {stop.priority}
                    </span>
                    <div className="text-[10px] text-stone-400 mt-0.5">
                      +{stop.legDistanceFormatted}
                    </div>
                  </div>
                </div>
              ))}

              {/* Final Landfill Stop */}
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-950">
                <div className="flex items-center gap-2">
                  <span className="font-bold">♻️ FINAL:</span>
                  <span>{RECYCLING_LANDFILL.name} ({RECYCLING_LANDFILL.address})</span>
                </div>
                <span className="font-mono text-[11px] text-emerald-700">Processing Plant</span>
              </div>
            </div>
          </div>

          {/* Technical Transparency Note */}
          <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 text-[11px] text-stone-500 flex items-start gap-2">
            <Info size={14} className="text-stone-400 shrink-0 mt-0.5" />
            <p>
              <strong>Demo Disclaimer:</strong> Mileage and driving duration are simulated using straight-line GIS Haversine calculations at average city urban speeds (24 km/h) with 12-minute waste loading buffers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
