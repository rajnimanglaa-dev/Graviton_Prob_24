import React from "react";
import { useApp } from "../../context/AppContext.jsx";
import { User, Truck, Phone, Mail, Award, Star, ShieldCheck, Calendar } from "lucide-react";

export default function DriverProfilePage() {
  const { currentUser, vehicles } = useApp();
  const myTruck = vehicles.find(v => v.id === currentUser.assignedTruckId) || vehicles[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#202923] tracking-tight">
          Driver Fleet Profile
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Driver credentials, commercial license status, assigned municipal vehicle, and performance rating.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm text-center space-y-4">
            <img
              src={currentUser.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"}
              alt={currentUser.name}
              className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-emerald-100 shadow-xs"
            />
            <div>
              <h3 className="text-lg font-bold text-stone-900">{currentUser.name}</h3>
              <p className="text-xs text-stone-500">{currentUser.email || "rajesh.driver@fleet.gov.in"}</p>
              <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-xs mt-2">
                <Star size={14} fill="#f59e0b" />
                <span>4.9 / 5.0 Rating</span>
              </div>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-stone-500">Employee ID:</span>
                <span className="font-mono font-bold text-stone-900">{currentUser.id || "DRV-104"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Shift Hours:</span>
                <span className="font-bold text-stone-900">06:00 – 14:00 (Day)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Department:</span>
                <span className="font-bold text-stone-900">Municipal Solid Waste</span>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Vehicle & License Details */}
        <div className="md:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">
              <Truck size={16} className="text-[#174C37]" />
              <span>Assigned Municipal Truck</span>
            </h4>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-stone-900">{myTruck.name}</span>
                <span className="font-mono font-bold px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700">
                  {myTruck.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Vehicle Type</span>
                  <span className="font-bold text-stone-800">{myTruck.type}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Capacity</span>
                  <span className="font-bold text-stone-800">{myTruck.capacityKg} kg</span>
                </div>
              </div>

              <div className="pt-1 text-[11px] text-stone-500">
                Operating Zone: <strong>{myTruck.serviceZone}</strong> • Telemetry Live
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#174C37]" />
              <span>Commercial License & Credentials</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50">
                <div>
                  <div className="font-bold text-stone-800">Commercial Heavy Vehicle Driving License</div>
                  <div className="font-mono text-[11px] text-stone-500">DL-04-2018-0098231</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  VERIFIED ACTIVE
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50">
                <div>
                  <div className="font-bold text-stone-800">Hydraulic Compactor Operation Certified</div>
                  <div className="text-[11px] text-stone-500">Municipal Safety Directorate Certification</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  VALID UNTIL 2028
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
