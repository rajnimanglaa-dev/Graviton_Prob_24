import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import {
  Truck,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  User,
  Phone,
  Fuel,
  Star,
  Activity,
  Layers
} from "lucide-react";

export default function VehicleManagementPage() {
  const { vehicles, reports } = useApp();
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]);

  const totalCapacityKg = vehicles.reduce((sum, v) => sum + v.capacityKg, 0);
  const totalCurrentLoadKg = vehicles.reduce((sum, v) => sum + v.currentLoadKg, 0);
  const totalRemainingCapKg = totalCapacityKg - totalCurrentLoadKg;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-[#174C37] uppercase tracking-wider">
              Municipal Fleet Asset Telematics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#202923] tracking-tight mt-1">
            Smart Vehicle Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Real-time payload utilization, telemetry status, driver allocation, and task assignment queues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 bg-white px-3 py-1.5 rounded-xl border border-stone-200">
            Active Fleet Units: <strong className="text-stone-900">{vehicles.length}</strong>
          </span>
        </div>
      </div>

      {/* Fleet Utilization Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-stone-500">Total Fleet Payload Capacity</span>
          <div className="text-2xl font-black text-stone-900">
            {(totalCapacityKg / 1000).toFixed(1)} <span className="text-sm font-normal text-stone-500">Metric Tons</span>
          </div>
          <div className="text-[11px] text-stone-400">Combined hydraulic rating across 4 trucks</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-stone-500">Current Load Loaded</span>
          <div className="text-2xl font-black text-[#174C37]">
            {(totalCurrentLoadKg / 1000).toFixed(1)} <span className="text-sm font-normal text-stone-500">Metric Tons</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">
            {Math.round((totalCurrentLoadKg / totalCapacityKg) * 100)}% Average Fleet Capacity Used
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-stone-500">Remaining Free Payload</span>
          <div className="text-2xl font-black text-blue-700">
            {(totalRemainingCapKg / 1000).toFixed(1)} <span className="text-sm font-normal text-stone-500">Metric Tons</span>
          </div>
          <div className="text-[11px] text-blue-600 font-medium">Available for immediate dispatch</div>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehicles.map(vehicle => {
          const remainingCap = vehicle.capacityKg - vehicle.currentLoadKg;
          const loadPercent = Math.round((vehicle.currentLoadKg / vehicle.capacityKg) * 100);
          const isSelected = selectedVehicle?.id === vehicle.id;

          const assignedReports = reports.filter(r => r.assignedVehicleId === vehicle.id && r.status !== "resolved");

          return (
            <div
              key={vehicle.id}
              onClick={() => setSelectedVehicle(vehicle)}
              className={`p-6 rounded-3xl bg-white border-2 transition cursor-pointer shadow-xs space-y-5 ${
                isSelected
                  ? "border-[#174C37] ring-2 ring-[#174C37]/15"
                  : "border-stone-200 hover:border-stone-300"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#174C37] text-white flex items-center justify-center shrink-0">
                    <Truck size={24} className="text-emerald-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-500">{vehicle.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        vehicle.status === "available"
                          ? "bg-emerald-100 text-emerald-800"
                          : vehicle.status === "on_route"
                          ? "bg-blue-100 text-blue-800"
                          : vehicle.status === "loading"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {vehicle.status.replace("_", " ")}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-stone-900 mt-0.5">{vehicle.name}</h3>
                    <p className="text-xs text-stone-500">{vehicle.type} • {vehicle.serviceZone}</p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-amber-500 font-bold flex items-center gap-1 justify-end">
                    <Star size={13} fill="#f59e0b" /> {vehicle.rating}
                  </span>
                </div>
              </div>

              {/* Payload Progress Bar */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Carrying Capacity Utilization</span>
                  <span className="font-bold text-stone-900">
                    {vehicle.currentLoadKg} / {vehicle.capacityKg} kg ({loadPercent}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      loadPercent > 85 ? "bg-red-600" : loadPercent > 60 ? "bg-amber-500" : "bg-[#174C37]"
                    }`}
                    style={{ width: `${loadPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-stone-400">
                  <span>Free remaining: <strong>{remainingCap} kg</strong></span>
                  <span>Eco efficiency: {vehicle.fuelEfficiencyKmPerL} km/L</span>
                </div>
              </div>

              {/* Driver & Telemetry Details */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Driver Assigned</span>
                  <div className="font-bold text-stone-800">{vehicle.driverName}</div>
                  <div className="text-[11px] text-stone-500">{vehicle.driverPhone}</div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Live GPS Telemetry</span>
                  <div className="font-semibold text-stone-800 truncate">{vehicle.location.address}</div>
                  <div className="text-[10px] text-stone-400 font-mono">
                    {vehicle.location.lat}, {vehicle.location.lng}
                  </div>
                </div>
              </div>

              {/* Assigned Tasks Summary */}
              <div className="pt-1 text-xs">
                <div className="font-bold text-stone-700 mb-1 flex items-center justify-between">
                  <span>Active Tasks Assigned:</span>
                  <span className="text-[#174C37]">{assignedReports.length} pick-up stops</span>
                </div>

                {assignedReports.length === 0 ? (
                  <div className="text-stone-400 text-[11px] italic">No active pick-ups currently queued.</div>
                ) : (
                  <div className="space-y-1">
                    {assignedReports.map(task => (
                      <div key={task.id} className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-200/60 flex items-center justify-between text-[11px]">
                        <span className="font-mono font-bold text-[#174C37]">{task.id}</span>
                        <span className="text-stone-600 truncate max-w-[200px]">{task.location.address}</span>
                        <span className="uppercase font-bold text-[9px] px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900">
                          {task.status.replace("_", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
