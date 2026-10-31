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

export default function AssignedCollectionsPage() {
  const { currentUser, vehicles, reports, updateDriverTaskStatus } = useApp();

  const myTruck = vehicles.find(v => v.id === currentUser.assignedTruckId) || vehicles[0];
  const assignedTasks = reports.filter(r => r.assignedVehicleId === myTruck.id && r.status !== "resolved");

  const [activeProofReport, setActiveProofReport] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-bold text-[#174C37] uppercase tracking-wider">
              Assigned Field Work Orders
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#202923] tracking-tight mt-1">
            Assigned Waste Collections
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Execute state transitions from departure to on-site loading. Mandatory cleaning verification photo required before closing tickets.
          </p>
        </div>

        <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700">
          Queue: <strong className="text-[#174C37]">{assignedTasks.length} active stops</strong>
        </div>
      </div>

      {/* Task Cards */}
      <div className="space-y-4">
        {assignedTasks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 shadow-xs space-y-2">
            <CheckCircle2 size={36} className="text-emerald-500 mx-auto" />
            <h4 className="text-sm font-bold text-stone-800">Your task queue is clear!</h4>
            <p className="text-xs text-stone-400">Stand by for new assignments from the Municipal Command Centre.</p>
          </div>
        ) : (
          assignedTasks.map(task => {
            const isCritical = task.priority === "critical";

            return (
              <div
                key={task.id}
                className={`p-6 rounded-3xl bg-white border-2 transition shadow-xs space-y-5 ${
                  isCritical ? "border-red-300 ring-2 ring-red-500/10" : "border-stone-200 hover:border-[#174C37]"
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700">
                      {task.id}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                      isCritical ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                    }`}>
                      {task.priority} Priority
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">
                      {task.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="text-xs text-stone-500">
                    Logged: {new Date(task.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-3">
                    <img
                      src={task.imageUrl}
                      alt={task.title}
                      className="w-full h-36 rounded-2xl object-cover border border-stone-200 shadow-xs"
                    />
                  </div>

                  <div className="md:col-span-9 space-y-2">
                    <h3 className="text-base font-bold text-stone-900">{task.title}</h3>
                    <p className="text-xs text-stone-600">
                      📍 <strong>Location:</strong> {task.location.address} ({task.location.ward})
                    </p>
                    <p className="text-xs text-stone-600">
                      💬 <strong>Citizen Note:</strong> {task.description}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                      <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 uppercase block font-semibold">Category</span>
                        <span className="font-bold text-stone-800 capitalize">{task.category}</span>
                      </div>
                      <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 uppercase block font-semibold">Estimated Volume</span>
                        <span className="font-bold text-stone-800">{task.wqi?.estimatedVolumeM3 || 2.4} m³</span>
                      </div>
                      <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-stone-400 uppercase block font-semibold">WQI Severity</span>
                        <span className="font-bold text-[#174C37]">{task.wqi?.total || 75}/100</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setSelectedReport(task)}
                    className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1"
                  >
                    <Eye size={14} />
                    <span>View Full Dossier</span>
                  </button>

                  <div className="flex flex-wrap items-center gap-2">
                    {task.status === "assigned" && (
                      <button
                        type="button"
                        onClick={() => updateDriverTaskStatus(task.id, "on_the_way")}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                      >
                        <Truck size={14} />
                        <span>Step 1: Mark On the Way</span>
                      </button>
                    )}

                    {task.status === "on_the_way" && (
                      <button
                        type="button"
                        onClick={() => updateDriverTaskStatus(task.id, "arrived")}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                      >
                        <MapPin size={14} />
                        <span>Step 2: Mark Arrived at Dumping Site</span>
                      </button>
                    )}

                    {(task.status === "arrived" || task.status === "on_the_way") && (
                      <button
                        type="button"
                        onClick={() => setActiveProofReport(task)}
                        className="px-5 py-2.5 rounded-xl bg-[#174C37] hover:bg-[#0f3325] text-white text-xs font-extrabold shadow-sm transition flex items-center gap-2"
                      >
                        <Camera size={15} />
                        <span>Step 3: Upload Cleaning Proof & Complete</span>
                      </button>
                    )}

                    {task.status === "collected" && (
                      <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
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
