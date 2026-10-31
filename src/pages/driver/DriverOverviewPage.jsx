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
  Navigation,
  Gauge
} from "lucide-react";
import CleaningProofModal from "../../components/Modals/CleaningProofModal.jsx";
import ReportDetailsModal from "../../components/Modals/ReportDetailsModal.jsx";
import { getWasteVisualCategory } from "../../services/wasteCategoryTheme.js";

export default function DriverOverviewPage() {
  const { currentUser, vehicles, reports, updateDriverTaskStatus } = useApp();

  const myTruck = vehicles.find(v => v.id === currentUser.assignedTruckId) || vehicles[0];
  const belongsToDriver = report => report.assignedVehicleId === myTruck.id || report.assignedDriverName === currentUser.name;
  const assignedTasks = reports.filter(r => belongsToDriver(r) && r.status !== "resolved");
  const completedTasks = reports.filter(r => belongsToDriver(r) && (r.status === "collected" || r.status === "resolved"));

  const [activeProofReport, setActiveProofReport] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  const remainingCapacity = myTruck.capacityKg - myTruck.currentLoadKg;
  const loadPercentage = Math.round((myTruck.currentLoadKg / myTruck.capacityKg) * 100);

  return (
    <div className="space-y-8 animate-fadeIn text-[#F5F7F5]">
      {/* Welcome Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-[#142820] via-[#1D2B25] to-[#142820] border border-[#24382F] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#16A36A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 max-w-xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16A36A]/20 border border-[#16A36A]/30 text-xs font-semibold text-[#8BE0B0]">
            <Truck size={14} />
            <span>Driver Fleet Console • On Duty</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-[#F5F7F5]">
            Hello, {currentUser.name}!
          </h2>
          <p className="text-xs sm:text-sm text-[#A5B3AA] leading-relaxed">
            Assigned to <strong className="text-[#8BE0B0]">{myTruck.name} ({myTruck.id})</strong>. You have <strong className="text-[#F5F7F5]">{assignedTasks.length} pending collections</strong> scheduled for your shift today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10">
          <Link
            to="/driver/tasks"
            className="px-5 py-3 rounded-2xl bg-[#16A36A] hover:bg-[#8BE0B0] text-[#101A17] text-xs font-black font-heading shadow-lg shadow-[#16A36A]/20 transition flex items-center justify-center gap-2"
          >
            <span>View Task Queue ({assignedTasks.length})</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* Truck Telemetry & Capacity Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Remaining Capacity */}
        <div className="p-5 rounded-3xl bg-[#1D2B25] border border-[#24382F] shadow-lg space-y-3">
          <div className="flex justify-between text-xs text-[#A5B3AA] font-semibold">
            <span className="flex items-center gap-1.5">
              <Gauge size={14} className="text-[#8BE0B0]" />
              <span>Payload Capacity</span>
            </span>
            <span className="font-stat font-bold text-[#F5F7F5]">{loadPercentage}% Full</span>
          </div>
          <div className="text-2xl font-black font-stat text-[#8BE0B0]">
            {remainingCapacity} <span className="text-xs font-normal text-[#A5B3AA]">kg free</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#142820] border border-[#24382F] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                loadPercentage > 85 ? "bg-[#FF6B6B]" : "bg-[#16A36A]"
              }`}
              style={{ width: `${loadPercentage}%` }}
            />
          </div>
        </div>

        {/* Pending Pickups */}
        <div className="p-5 rounded-3xl bg-[#1D2B25] border border-[#24382F] shadow-lg space-y-3">
          <div className="flex justify-between text-xs text-[#A5B3AA] font-semibold">
            <span>Queued Pickups</span>
            <Clock size={16} className="text-[#F4C542]" />
          </div>
          <div className="text-2xl font-black font-stat text-[#F4C542]">{assignedTasks.length} Stops</div>
          <div className="text-[11px] text-[#A5B3AA]/70">Sequenced along optimized TSP corridor</div>
        </div>

        {/* Completed Pickups */}
        <div className="p-5 rounded-3xl bg-[#1D2B25] border border-[#24382F] shadow-lg space-y-3">
          <div className="flex justify-between text-xs text-[#A5B3AA] font-semibold">
            <span>Completed Today</span>
            <CheckCircle2 size={16} className="text-[#16A36A]" />
          </div>
          <div className="text-2xl font-black font-stat text-[#8BE0B0]">{completedTasks.length} Cleared</div>
          <div className="text-[11px] text-[#16A36A] font-medium">100% verified with geo-tagged photo proof</div>
        </div>
      </div>

      {/* Active Tasks Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-heading text-[#F5F7F5]">
            Immediate Collection Tasks
          </h3>
          <Link to="/driver/tasks" className="text-xs font-bold text-[#8BE0B0] hover:underline flex items-center gap-1">
            <span>View All Tasks</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {assignedTasks.length === 0 ? (
          <div className="p-12 text-center bg-[#1D2B25] rounded-3xl border border-[#24382F] shadow-lg space-y-2">
            <CheckCircle2 size={36} className="text-[#16A36A] mx-auto" />
            <h4 className="text-sm font-bold font-heading text-[#F5F7F5]">All Assigned Tasks Completed!</h4>
            <p className="text-xs text-[#A5B3AA]">Great job. Stand by for new municipal dispatch allocations.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignedTasks.map(task => {
              const isCritical = task.priority === "critical";
              const visualStream = getWasteVisualCategory(task.category);

              return (
                <div
                  key={task.id}
                  className="p-6 rounded-3xl bg-[#1D2B25] border border-[#24382F] hover:border-[#8BE0B0]/40 transition shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <img
                      src={task.imageUrl}
                      alt={task.title}
                      className="w-16 h-16 rounded-2xl object-cover border border-[#24382F] shrink-0"
                    />

                    <div className="min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#A5B3AA]">{task.id}</span>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                          isCritical
                            ? "bg-[#FF6B6B]/20 text-[#FF6B6B] border border-[#FF6B6B]/30"
                            : "bg-[#F4C542]/20 text-[#F4C542] border border-[#F4C542]/30"
                        }`}>
                          {task.priority} PRIORITY
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#3987F5]/20 text-[#3987F5] border border-[#3987F5]/30 uppercase">
                          {task.status.replace("_", " ")}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${visualStream.badgeClass}`}>
                          {visualStream.label}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold font-heading text-[#F5F7F5] truncate">{task.title}</h4>
                      <p className="text-xs text-[#A5B3AA] truncate">📍 {task.location.address}</p>
                      <div className="text-[11px] text-[#A5B3AA]/80 font-medium">
                        Category: <strong className="capitalize text-[#F5F7F5]">{task.category}</strong> • Volume: ~<span className="font-stat text-[#8BE0B0]">{task.wqi?.estimatedVolumeM3 || 2.4} m³</span>
                      </div>
                    </div>
                  </div>

                  {/* Driver Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0 justify-end pt-3 md:pt-0 border-t md:border-t-0 border-[#24382F]">
                    <button
                      type="button"
                      onClick={() => setSelectedReport(task)}
                      className="px-3.5 py-2.5 rounded-xl bg-[#142820] hover:bg-[#24382F] text-xs font-bold text-[#A5B3AA] hover:text-[#F5F7F5] border border-[#24382F] transition"
                    >
                      Details
                    </button>

                    {task.status === "assigned" && (
                      <button
                        type="button"
                        onClick={() => updateDriverTaskStatus(task.id, "on_the_way")}
                        className="px-4 py-2.5 rounded-xl bg-[#3987F5] hover:bg-[#3987F5]/80 text-white text-xs font-bold font-heading shadow-md transition flex items-center gap-1.5"
                      >
                        <Truck size={14} />
                        <span>Start Driving (On the Way)</span>
                      </button>
                    )}

                    {task.status === "on_the_way" && (
                      <button
                        type="button"
                        onClick={() => updateDriverTaskStatus(task.id, "arrived")}
                        className="px-4 py-2.5 rounded-xl bg-[#F4C542] hover:bg-[#F4C542]/80 text-[#101A17] text-xs font-bold font-heading shadow-md transition flex items-center gap-1.5"
                      >
                        <MapPin size={14} />
                        <span>Mark Arrived at Site</span>
                      </button>
                    )}

                    {(task.status === "arrived" || task.status === "on_the_way") && (
                      <button
                        type="button"
                        onClick={() => setActiveProofReport(task)}
                        className="px-4 py-2.5 rounded-xl bg-[#16A36A] hover:bg-[#8BE0B0] text-[#101A17] text-xs font-black font-heading shadow-lg shadow-[#16A36A]/20 transition flex items-center gap-1.5"
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
