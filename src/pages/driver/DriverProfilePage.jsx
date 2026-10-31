import React from "react";
import { useApp } from "../../context/AppContext.jsx";
import { User, Truck, Phone, Mail, Award, Star, ShieldCheck, Calendar, BadgeCheck } from "lucide-react";

export default function DriverProfilePage() {
  const { currentUser, vehicles } = useApp();
  const myTruck = vehicles.find(v => v.id === currentUser.assignedTruckId) || vehicles[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn text-[#F5F7F5]">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A36A] animate-pulse" />
          <span className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider">
            Operator Credentials
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#F5F7F5] tracking-tight mt-1">
          Driver Fleet Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#A5B3AA] mt-1">
          Driver credentials, commercial license status, assigned municipal vehicle, and performance rating.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-7 rounded-3xl bg-[#1D2B25] border border-[#24382F] shadow-xl text-center space-y-4">
            <div className="relative inline-block">
              <img
                src={currentUser.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"}
                alt={currentUser.name}
                className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-[#16A36A]/40 shadow-lg shadow-[#16A36A]/10"
              />
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#16A36A] border-2 border-[#1D2B25] flex items-center justify-center text-white text-xs">
                ✓
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold font-heading text-[#F5F7F5]">{currentUser.name}</h3>
              <p className="text-xs text-[#A5B3AA]">{currentUser.email || "rajesh.driver@fleet.gov.in"}</p>
              <div className="flex items-center justify-center gap-1.5 text-[#F4C542] font-bold text-xs mt-2 bg-[#F4C542]/10 py-1 px-3 rounded-full border border-[#F4C542]/20 inline-flex">
                <Star size={14} fill="#F4C542" />
                <span className="font-stat">4.9 / 5.0 Rating</span>
              </div>
            </div>

            <div className="p-4 bg-[#142820] rounded-2xl border border-[#24382F] text-xs space-y-2.5 text-left">
              <div className="flex justify-between items-center">
                <span className="text-[#A5B3AA]">Employee ID:</span>
                <span className="font-mono font-bold text-[#F5F7F5] bg-[#101A17] px-2 py-0.5 rounded border border-[#24382F]">{currentUser.id || "DRV-104"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#A5B3AA]">Shift Hours:</span>
                <span className="font-bold text-[#F5F7F5]">06:00 – 14:00 (Day)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#A5B3AA]">Department:</span>
                <span className="font-bold text-[#8BE0B0]">Municipal Solid Waste</span>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Vehicle & License Details */}
        <div className="md:col-span-7 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-[#1D2B25] border border-[#24382F] shadow-xl space-y-4">
            <h4 className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider flex items-center gap-2">
              <Truck size={16} className="text-[#16A36A]" />
              <span>Assigned Municipal Truck</span>
            </h4>

            <div className="p-5 rounded-2xl bg-[#142820] border border-[#24382F] space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-black font-heading text-sm text-[#F5F7F5]">{myTruck.name}</span>
                <span className="font-mono font-bold px-2.5 py-1 rounded-lg bg-[#101A17] border border-[#24382F] text-[#8BE0B0]">
                  {myTruck.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-[#101A17] rounded-xl border border-[#24382F]">
                  <span className="text-[#A5B3AA]/70 text-[10px] uppercase font-bold block">Vehicle Type</span>
                  <span className="font-bold text-[#F5F7F5]">{myTruck.type}</span>
                </div>
                <div className="p-3 bg-[#101A17] rounded-xl border border-[#24382F]">
                  <span className="text-[#A5B3AA]/70 text-[10px] uppercase font-bold block">Payload Capacity</span>
                  <span className="font-bold font-stat text-[#8BE0B0]">{myTruck.capacityKg} kg</span>
                </div>
              </div>

              <div className="pt-1 text-[11px] text-[#A5B3AA]">
                Operating Zone: <strong className="text-[#F5F7F5]">{myTruck.serviceZone}</strong> • Telemetry Status: <span className="text-[#8BE0B0] font-semibold">Active Live</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-[#1D2B25] border border-[#24382F] shadow-xl space-y-4">
            <h4 className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#16A36A]" />
              <span>Commercial License & Credentials</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-4 rounded-2xl border border-[#24382F] bg-[#142820]">
                <div>
                  <div className="font-bold text-[#F5F7F5]">Commercial Heavy Vehicle Driving License</div>
                  <div className="font-mono text-[11px] text-[#A5B3AA] mt-0.5">DL-04-2018-0098231</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#16A36A]/20 text-[#8BE0B0] border border-[#16A36A]/30 font-bold text-[10px] flex items-center gap-1">
                  <BadgeCheck size={12} /> VERIFIED ACTIVE
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-[#24382F] bg-[#142820]">
                <div>
                  <div className="font-bold text-[#F5F7F5]">Hydraulic Compactor Operation Certified</div>
                  <div className="text-[11px] text-[#A5B3AA] mt-0.5">Municipal Safety Directorate Certification</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#16A36A]/20 text-[#8BE0B0] border border-[#16A36A]/30 font-bold text-[10px] flex items-center gap-1">
                  <BadgeCheck size={12} /> VALID UNTIL 2028
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
