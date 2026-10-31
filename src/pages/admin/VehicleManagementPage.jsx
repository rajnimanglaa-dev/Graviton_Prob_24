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
    <div className="space-y-6 animate-fadeIn text-[#F5F7F5]">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A36A] animate-pulse" />
            <span className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">
              MUNICIPAL FLEET ASSET TELEMATICS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7F5] tracking-tight mt-1 font-heading">
            Smart Vehicle Management
          </h1>
          <p className="text-xs sm:text-sm text-[#A5B3AA] mt-0.5">
            Real-time payload utilization, telemetry status, driver allocation, and task assignment queues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#8BE0B0] bg-[#1D2B25] px-3.5 py-1.5 rounded-2xl border border-[#273b33] font-mono">
            Active Fleet Units: <strong className="text-[#F5F7F5] font-stat">{vehicles.length}</strong>
          </span>
        </div>
      </div>

      {/* Fleet Utilization Metrics Strip (Manrope numbers) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-2">
          <span className="text-xs font-semibold text-[#A5B3AA]">Total Fleet Payload Capacity</span>
          <div className="text-2xl font-black text-[#F5F7F5] font-stat">
            {(totalCapacityKg / 1000).toFixed(1)} <span className="text-sm font-normal text-[#A5B3AA]">Metric Tons</span>
          </div>
          <div className="text-[11px] text-[#A5B3AA]">Combined hydraulic rating across 4 trucks</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-2">
          <span className="text-xs font-semibold text-[#A5B3AA]">Current Load Loaded</span>
          <div className="text-2xl font-black text-[#8BE0B0] font-stat">
            {(totalCurrentLoadKg / 1000).toFixed(1)} <span className="text-sm font-normal text-[#A5B3AA]">Metric Tons</span>
          </div>
          <div className="text-[11px] text-[#8BE0B0] font-medium">
            {Math.round((totalCurrentLoadKg / totalCapacityKg) * 100)}% Average Fleet Capacity Used
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-2">
          <span className="text-xs font-semibold text-[#A5B3AA]">Remaining Free Payload</span>
          <div className="text-2xl font-black text-[#3987F5] font-stat">
            {(totalRemainingCapKg / 1000).toFixed(1)} <span className="text-sm font-normal text-[#A5B3AA]">Metric Tons</span>
          </div>
          <div className="text-[11px] text-[#90c2ff] font-medium">Available for immediate dispatch</div>
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
              className={`p-6 rounded-3xl bg-[#1D2B25] border-2 transition cursor-pointer shadow-md space-y-5 ${
                isSelected
                  ? "border-[#16A36A] ring-1 ring-[#16A36A]"
                  : "border-[#273b33] hover:border-[#16A36A]/40"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#142820] border border-[#273b33] text-[#8BE0B0] flex items-center justify-center shrink-0">
                    <Truck size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#8BE0B0]">{vehicle.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize font-mono ${
                        vehicle.status === "available"
                          ? "bg-[#16A36A]/20 text-[#8BE0B0] border border-[#16A36A]/40"
                          : vehicle.status === "on_route"
                          ? "bg-[#3987F5]/20 text-[#90c2ff] border border-[#3987F5]/40"
                          : vehicle.status === "loading"
                          ? "bg-[#F4C542]/20 text-[#fce58d] border border-[#F4C542]/40"
                          : "bg-red-500/20 text-red-300 border border-red-500/40"
                      }`}>
                        {vehicle.status.replace("_", " ")}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#F5F7F5] mt-0.5 font-heading">{vehicle.name}</h3>
                    <p className="text-xs text-[#A5B3AA]">{vehicle.type} • {vehicle.serviceZone}</p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-[#F4C542] font-bold flex items-center gap-1 justify-end font-stat">
                    <Star size={13} fill="#F4C542" /> {vehicle.rating}
                  </span>
                </div>
              </div>

              {/* Payload Progress Bar */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#A5B3AA]">
                  <span>Carrying Capacity Utilization</span>
                  <span className="font-bold text-[#F5F7F5] font-stat">
                    {vehicle.currentLoadKg} / {vehicle.capacityKg} kg ({loadPercent}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#101A17] overflow-hidden border border-[#273b33]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      loadPercent > 85 ? "bg-red-500" : loadPercent > 60 ? "bg-[#F4C542]" : "bg-[#16A36A]"
                    }`}
                    style={{ width: `${loadPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[#A5B3AA]">
                  <span>Free remaining: <strong className="text-[#8BE0B0] font-stat">{remainingCap} kg</strong></span>
                  <span>Efficiency: <strong className="font-stat">{vehicle.fuelEfficiencyKmPerL} km/L</strong></span>
                </div>
              </div>

              {/* Driver & Telemetry Details */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#142820] rounded-2xl border border-[#273b33] text-xs">
                <div>
                  <span className="text-[10px] font-bold text-[#8BE0B0] uppercase block font-mono">Driver Assigned</span>
                  <div className="font-bold text-[#F5F7F5]">{vehicle.driverName}</div>
                  <div className="text-[11px] text-[#A5B3AA] font-mono">{vehicle.driverPhone}</div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#8BE0B0] uppercase block font-mono">Live GPS Telemetry</span>
                  <div className="font-semibold text-[#F5F7F5] truncate">{vehicle.location.address}</div>
                  <div className="text-[10px] text-[#A5B3AA] font-mono">
                    {vehicle.location.lat}, {vehicle.location.lng}
                  </div>
                </div>
              </div>

              {/* Assigned Tasks Summary */}
              <div className="pt-1 text-xs">
                <div className="font-bold text-[#A5B3AA] mb-1 flex items-center justify-between">
                  <span>Active Tasks Assigned:</span>
                  <span className="text-[#8BE0B0] font-stat">{assignedReports.length} pick-up stops</span>
                </div>

                {assignedReports.length === 0 ? (
                  <div className="text-[#A5B3AA] text-[11px] italic">No active pick-ups currently queued.</div>
                ) : (
                  <div className="space-y-1">
                    {assignedReports.map(task => (
                      <div key={task.id} className="p-2 bg-[#142820] rounded-xl border border-[#273b33] flex items-center justify-between text-[11px]">
                        <span className="font-mono font-bold text-[#8BE0B0]">{task.id}</span>
                        <span className="text-[#A5B3AA] truncate max-w-[200px]">{task.location.address}</span>
                        <span className="uppercase font-bold text-[9px] px-1.5 py-0.2 rounded bg-[#16A36A]/20 border border-[#16A36A]/40 text-[#8BE0B0]">
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
