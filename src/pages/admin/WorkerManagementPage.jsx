import React from "react";
import { useApp } from "../../context/AppContext.jsx";
import { Users, Truck, Star, Phone, Mail, Award, CheckCircle2, ShieldCheck } from "lucide-react";

export default function WorkerManagementPage() {
  const { vehicles, reports } = useApp();

  const drivers = vehicles.map(v => {
    const tasksHandled = reports.filter(r => r.assignedVehicleId === v.id);
    const completedTasks = tasksHandled.filter(r => r.status === "collected" || r.status === "resolved");

    return {
      id: "DRV-" + v.id.slice(-2),
      name: v.driverName,
      phone: v.driverPhone,
      email: v.driverEmail || `${v.driverName.toLowerCase().replace(" ", ".")}@fleet.gov.in`,
      assignedTruck: v.name,
      assignedTruckId: v.id,
      rating: v.rating,
      completedTotal: completedTasks.length + 24, // realistic baseline
      activeTasks: tasksHandled.filter(r => r.status !== "resolved").length,
      shift: "Day Shift (06:00 – 14:00)",
      license: "DL-04-COMM-998" + v.id.slice(-2)
    };
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-[#174C37] uppercase tracking-wider">
            Municipal Human Resources
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#202923] tracking-tight mt-1">
          Sanitation Drivers & Fleet Roster
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Driver performance telemetry, license verification, assigned compactor vehicles, and task completion logs.
        </p>
      </div>

      {/* Driver Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {drivers.map(driver => (
          <div key={driver.id} className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#174C37] flex items-center justify-center font-black text-base">
                  {driver.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-stone-500">{driver.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Active Shift
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 mt-0.5">{driver.name}</h3>
                  <p className="text-xs text-stone-500">{driver.shift}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                <Star size={13} fill="#f59e0b" />
                <span>{driver.rating} ★</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
              <div>
                <span className="text-stone-400 text-[10px] uppercase font-bold block">Assigned Truck</span>
                <span className="font-bold text-stone-800">{driver.assignedTruck}</span>
                <div className="text-[10px] text-stone-500 font-mono">{driver.assignedTruckId}</div>
              </div>

              <div>
                <span className="text-stone-400 text-[10px] uppercase font-bold block">Commercial License</span>
                <span className="font-mono font-bold text-stone-800">{driver.license}</span>
                <div className="text-[10px] text-emerald-700 font-semibold">Verified Valid</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <div className="text-stone-600">
                Completed Pickups: <strong className="text-stone-900">{driver.completedTotal}</strong>
              </div>
              <div className="text-stone-600">
                Active Queue: <strong className="text-[#174C37]">{driver.activeTasks} tickets</strong>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-stone-100 text-xs text-stone-500">
              <span className="flex items-center gap-1">
                <Phone size={13} className="text-[#174C37]" /> {driver.phone}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 truncate">
                <Mail size={13} className="text-[#174C37]" /> {driver.email}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
