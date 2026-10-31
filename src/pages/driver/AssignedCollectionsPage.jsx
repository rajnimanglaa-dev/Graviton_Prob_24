import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import {
  Truck,
  MapPin,
  Camera,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Eye,
  PhoneCall
} from "lucide-react";
import CleaningProofModal from "../../components/Modals/CleaningProofModal.jsx";
import ReportDetailsModal from "../../components/Modals/ReportDetailsModal.jsx";
import { getWasteVisualCategory } from "../../services/wasteCategoryTheme.js";

export default function AssignedCollectionsPage() {
  const { currentUser, vehicles, reports, updateDriverTaskStatus } = useApp();

  const myTruck = vehicles.find(v => v.id === currentUser.assignedTruckId) || vehicles[0];
  const assignedTasks = reports.filter(r => (r.assignedVehicleId === myTruck.id || r.assignedDriverName === currentUser.name) && r.status !== "resolved");

  const [activeProofReport, setActiveProofReport] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  return (
    <div className="space-y-6 animate-fadeIn text-[#F5F7F5]">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3987F5] animate-pulse" />
            <span className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider">
              Assigned Field Work Orders
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#F5F7F5] tracking-tight mt-1">
            Assigned Waste Collections
          </h1>
          <p className="text-xs sm:text-sm text-[#A5B3AA] mt-1">
            Execute state transitions from departure to on-site loading. Mandatory cleaning verification photo required before closing tickets.
          </p>
        </div>

        <div className="text-xs font-bold px-3.5 py-2 rounded-2xl bg-[#1D2B25] border border-[#24382F] text-[#A5B3AA]">
          Queue: <strong className="font-stat text-[#8BE0B0]">{assignedTasks.length} active stops</strong>
        </div>
      </div>

      {/* Task Cards */}
      <div className="space-y-4">
        {assignedTasks.length === 0 ? (
          <div className="p-12 text-center bg-[#1D2B25] rounded-3xl border border-[#24382F] shadow-lg space-y-2">
            <CheckCircle2 size={36} className="text-[#16A36A] mx-auto" />
            <h4 className="text-sm font-bold font-heading text-[#F5F7F5]">Your task queue is clear!</h4>
            <p className="text-xs text-[#A5B3AA]">Stand by for new assignments from the Municipal Command Centre.</p>
          </div>
        ) : (
          assignedTasks.map(task => {
            const isCritical = task.priority === "critical";
            const visualStream = getWasteVisualCategory(task.category);

            return (
              <div
                key={task.id}
                className={`p-6 rounded-3xl bg-[#1D2B25] border-2 transition shadow-lg space-y-5 ${
                  isCritical
                    ? "border-[#FF6B6B]/60 ring-2 ring-[#FF6B6B]/20"
                    : "border-[#24382F] hover:border-[#8BE0B0]/40"
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#24382F]">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#142820] border border-[#24382F] text-[#A5B3AA]">
                      {task.id}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                      isCritical
                        ? "bg-[#FF6B6B]/20 text-[#FF6B6B] border border-[#FF6B6B]/30"
                        : "bg-[#F4C542]/20 text-[#F4C542] border border-[#F4C542]/30"
                    }`}>
                      {task.priority} Priority
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#3987F5]/20 text-[#3987F5] border border-[#3987F5]/30 uppercase">
                      {task.status.replace("_", " ")}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${visualStream.badgeClass}`}>
                      {visualStream.label}
                    </span>
                  </div>

                  <div className="text-xs text-[#A5B3AA]">
                    Logged: {new Date(task.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-3">
                    <img
                      src={task.imageUrl}
                      alt={task.title}
                      className="w-full h-36 rounded-2xl object-cover border border-[#24382F] shadow-inner"
                    />
                  </div>

                  <div className="md:col-span-9 space-y-2">
                    <h3 className="text-base font-bold font-heading text-[#F5F7F5]">{task.title}</h3>
                    <p className="text-xs text-[#A5B3AA]">
                      📍 <strong className="text-[#F5F7F5]">Location:</strong> {task.location.address} ({task.location.ward})
                    </p>
                    <p className="text-xs text-[#A5B3AA]">
                      💬 <strong className="text-[#F5F7F5]">Citizen Note:</strong> {task.description}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                      <div className="p-3 bg-[#142820] rounded-xl border border-[#24382F]">
                        <span className="text-[10px] text-[#A5B3AA]/70 uppercase block font-semibold">Category</span>
                        <span className="font-bold text-[#F5F7F5] capitalize">{task.category}</span>
                      </div>
                      <div className="p-3 bg-[#142820] rounded-xl border border-[#24382F]">
                        <span className="text-[10px] text-[#A5B3AA]/70 uppercase block font-semibold">Estimated Volume</span>
                        <span className="font-bold font-stat text-[#8BE0B0]">{task.wqi?.estimatedVolumeM3 || 2.4} m³</span>
                      </div>
                      <div className="p-3 bg-[#142820] rounded-xl border border-[#24382F] col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-[#A5B3AA]/70 uppercase block font-semibold">WQI Severity</span>
                        <span className="font-bold font-stat text-[#8BE0B0]">{task.wqi?.total || 75}/100</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#24382F]">
                  <button
                    type="button"
                    onClick={() => setSelectedReport(task)}
                    className="text-xs font-bold text-[#A5B3AA] hover:text-[#8BE0B0] transition flex items-center gap-1.5"
                  >
                    <Eye size={14} />
                    <span>View Full Dossier</span>
                  </button>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {task.status === "assigned" && (
                      <button
                        type="button"
                        onClick={() => updateDriverTaskStatus(task.id, "on_the_way")}
                        className="px-4 py-2.5 rounded-xl bg-[#3987F5] hover:bg-[#3987F5]/80 text-white text-xs font-bold font-heading shadow-md transition flex items-center gap-1.5"
                      >
                        <Truck size={14} />
                        <span>Step 1: Mark On the Way</span>
                      </button>
                    )}

                    {task.status === "on_the_way" && (
                      <button
                        type="button"
                        onClick={() => updateDriverTaskStatus(task.id, "arrived")}
                        className="px-4 py-2.5 rounded-xl bg-[#F4C542] hover:bg-[#F4C542]/80 text-[#101A17] text-xs font-bold font-heading shadow-md transition flex items-center gap-1.5"
                      >
                        <MapPin size={14} />
                        <span>Step 2: Mark Arrived at Dumping Site</span>
                      </button>
                    )}

                    {(task.status === "arrived" || task.status === "on_the_way") && (
                      <button
                        type="button"
                        onClick={() => setActiveProofReport(task)}
                        className="px-5 py-2.5 rounded-xl bg-[#16A36A] hover:bg-[#8BE0B0] text-[#101A17] text-xs font-black font-heading shadow-lg shadow-[#16A36A]/20 transition flex items-center gap-2"
                      >
                        <Camera size={15} />
                        <span>Step 3: Upload Cleaning Proof & Complete</span>
                      </button>
                    )}

                    {task.status === "collected" && (
                      <div className="px-3.5 py-1.5 rounded-xl bg-[#16A36A]/20 text-[#8BE0B0] border border-[#16A36A]/40 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 size={15} />
                        <span>Proof Submitted — Awaiting Admin Final Sign-Off</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Proof of Cleaning Modal */}
      {activeProofReport && (
        <CleaningProofModal
          report={activeProofReport}
          isOpen={!!activeProofReport}
          onClose={() => setActiveProofReport(null)}
        />
      )}

      {/* Details Modal */}
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
