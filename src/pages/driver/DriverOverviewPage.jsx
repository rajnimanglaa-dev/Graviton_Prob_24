import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Camera,
  Navigation
} from "lucide-react";
import CleaningProofModal from "../../components/Modals/CleaningProofModal.jsx";
import ReportDetailsModal from "../../components/Modals/ReportDetailsModal.jsx";

export default function DriverOverviewPage() {
  const { currentUser, vehicles, reports, updateDriverTaskStatus } = useApp();

  const myTruck = vehicles.find(v => v.id === currentUser.assignedTruckId) || vehicles[0];
  const assignedTasks = reports.filter(r => r.assignedVehicleId === myTruck.id && r.status !== "resolved");
  const completedTasks = reports.filter(r => r.assignedVehicleId === myTruck.id && (r.status === "collected" || r.status === "resolved"));

  const [activeProofReport, setActiveProofReport] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  const remainingCapacity = myTruck.capacityKg - myTruck.currentLoadKg;
  const loadPercentage = Math.round((myTruck.currentLoadKg / myTruck.capacityKg) * 100);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#174C37] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-emerald-300">
            <Truck size={14} />
            <span>Driver Fleet Console • On Duty</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Hello, {currentUser.name}!
          </h2>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Assigned to <strong>{myTruck.name} ({myTruck.id})</strong>. You have <strong>{assignedTasks.length} pending collections</strong> scheduled for your shift today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            to="/driver/tasks"
            className="px-5 py-3 rounded-xl bg-white text-[#174C37] hover:bg-stone-100 text-xs font-extrabold shadow-sm transition flex items-center justify-center gap-2"
          >
            <span>View Task Queue ({assignedTasks.length})</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* Truck Telemetry & Capacity Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Remaining Capacity */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
          <div className="flex justify-between text-xs text-stone-500 font-semibold">
            <span>Remaining Payload Capacity</span>
            <span className="font-bold text-stone-900">{loadPercentage}% Full</span>
          </div>
          <div className="text-2xl font-black text-[#174C37]">
            {remainingCapacity} <span className="text-xs font-normal text-stone-500">kg free</span>
          </div>
          <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                loadPercentage > 85 ? "bg-red-600" : "bg-[#174C37]"
              }`}
              style={{ width: `${loadPercentage}%` }}
            />
          </div>
        </div>

        {/* Pending Pickups */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
          <div className="flex justify-between text-xs text-stone-500 font-semibold">
            <span>Queued Pickups</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{assignedTasks.length} Stops</div>
          <div className="text-[11px] text-stone-400">Scheduled on optimal route</div>
        </div>

        {/* Completed Pickups */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
          <div className="flex justify-between text-xs text-stone-500 font-semibold">
            <span>Completed Today</span>
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{completedTasks.length} Cleared</div>
          <div className="text-[11px] text-emerald-600 font-medium">100% verified with photo proof</div>
        </div>
      </div>

      {/* Active Tasks Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900">
            Immediate Collection Tasks
          </h3>
          <Link to="/driver/tasks" className="text-xs font-bold text-[#174C37] hover:underline">
            View All Tasks →
          </Link>
        </div>

        {assignedTasks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-xs space-y-2">
            <CheckCircle2 size={36} className="text-emerald-500 mx-auto" />
            <h4 className="text-sm font-bold text-stone-800">All Assigned Tasks Completed!</h4>
            <p className="text-xs text-stone-400">Great job. Stand by for new municipal dispatch allocations.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignedTasks.map(task => {
              const isCritical = task.priority === "critical";

              return (
                <div
                  key={task.id}
                  className="p-6 rounded-3xl bg-white border-2 border-stone-200 hover:border-[#174C37] transition shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <img
                      src={task.imageUrl}
                      alt={task.title}
                      className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shrink-0"
                    />

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-stone-600">{task.id}</span>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                          isCritical ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                        }`}>
                          {task.priority} PRIORITY
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">
                          {task.status.replace("_", " ")}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-stone-900 truncate">{task.title}</h4>
                      <p className="text-xs text-stone-500 truncate">📍 {task.location.address}</p>
                      <div className="text-[11px] text-stone-600 font-medium">
                        Category: <strong className="capitalize">{task.category}</strong> • Volume: ~{task.wqi?.estimatedVolumeM3 || 2.4} m³
                      </div>
                    </div>
                  </div>

                  {/* Driver Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0 justify-end pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
                    <button
                      type="button"
                      onClick={() => setSelectedReport(task)}
                      className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-700 transition"
                    >
                      Details
                    </button>

                    {task.status === "assigned" && (
                      <button
                        type="button"
                        onClick={() => updateDriverTaskStatus(task.id, "on_the_way")}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                      >
                        <Truck size={14} />
                        <span>Start Driving (On the Way)</span>
                      </button>
                    )}

                    {task.status === "on_the_way" && (
                      <button
                        type="button"
                        onClick={() => updateDriverTaskStatus(task.id, "arrived")}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                      >
                        <MapPin size={14} />
                        <span>Mark Arrived at Site</span>
                      </button>
                    )}

                    {(task.status === "arrived" || task.status === "on_the_way") && (
                      <button
                        type="button"
                        onClick={() => setActiveProofReport(task)}
                        className="px-4 py-2 rounded-xl bg-[#174C37] hover:bg-[#0f3325] text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                      >
                        <Camera size={14} />
                        <span>Upload Proof & Mark Collected</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {activeProofReport && (
        <CleaningProofModal
          report={activeProofReport}
          isOpen={!!activeProofReport}
          onClose={() => setActiveProofReport(null)}
        />
      )}

      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}
