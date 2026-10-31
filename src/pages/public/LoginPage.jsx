import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import { DEMO_USERS } from "../../services/mockData.js";
import { User, Shield, Truck, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import Logo from "../../components/UI/Logo.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginAs } = useApp();

  const handleDemoLogin = (role) => {
    loginAs(role);
    if (role === "admin") {
      navigate("/admin/overview");
    } else if (role === "driver") {
      navigate("/driver/overview");
    } else {
      navigate("/citizen/dashboard");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10 text-[#F5F7F5]">
      {/* Page Title */}
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-2">
          <Logo size="lg" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16A36A]/20 border border-[#16A36A]/40 text-[#8BE0B0] text-xs font-bold font-mono">
          <Sparkles size={13} className="text-[#16A36A]" />
          <span>HACKATHON EVALUATION PORTAL</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#F5F7F5] tracking-tight font-heading">
          Select Your Portal Access
        </h1>
        <p className="text-xs sm:text-sm text-[#A5B3AA] max-w-lg mx-auto">
          Sign in instantly using 1-click demo profiles pre-configured for hackathon judges or inspect synchronized role workflows.
        </p>
      </div>

      {/* 3 Quick Role Cards for Hackathon Judges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Citizen Role Card */}
        <div
          onClick={() => handleDemoLogin("citizen")}
          className="p-6 rounded-3xl bg-[#1D2B25] border-2 border-[#273b33] hover:border-[#16A36A] hover:shadow-2xl transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#16A36A]/20 border border-[#16A36A]/40 text-[#8BE0B0] flex items-center justify-center group-hover:scale-110 transition-transform">
              <User size={24} />
            </div>
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#142820] text-[#8BE0B0] border border-[#273b33] mb-1 font-mono">
                Role 01
              </div>
              <h3 className="text-lg font-bold text-[#F5F7F5] font-heading">Citizen Portal</h3>
              <p className="text-xs text-[#A5B3AA] mt-1 leading-relaxed">
                Report illegal dumping with camera & GPS, test duplicate detection, inspect AI WQI score, and view community leaderboard.
              </p>
            </div>

            <div className="p-3 bg-[#142820] rounded-2xl border border-[#273b33] text-[11px] text-[#A5B3AA] space-y-1">
              <div><strong className="text-[#F5F7F5]">Demo User:</strong> {DEMO_USERS.citizen.name}</div>
              <div><strong className="text-[#F5F7F5]">Ward:</strong> {DEMO_USERS.citizen.ward}</div>
              <div className="text-[#8BE0B0] font-semibold font-stat">🌟 {DEMO_USERS.citizen.points} EcoPoints</div>
            </div>
          </div>

          <button
            type="button"
            className="mt-6 w-full py-2.5 rounded-xl bg-[#16A36A] text-white text-xs font-bold group-hover:bg-[#0f7a4e] transition flex items-center justify-center gap-1.5 shadow-md shadow-[#16A36A]/30"
          >
            <span>Launch Citizen Dashboard</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 2. Admin Role Card */}
        <div
          onClick={() => handleDemoLogin("admin")}
          className="p-6 rounded-3xl bg-[#1D2B25] border-2 border-[#273b33] hover:border-[#8BE0B0] hover:shadow-2xl transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#16A36A]/20 border border-[#16A36A]/40 text-[#8BE0B0] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield size={24} />
            </div>
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#142820] text-[#8BE0B0] border border-[#273b33] mb-1 font-mono">
                Role 02
              </div>
              <h3 className="text-lg font-bold text-[#F5F7F5] font-heading">Municipal Admin</h3>
              <p className="text-xs text-[#A5B3AA] mt-1 leading-relaxed">
                Command Centre overview, priority queue, vehicle recommendations, route TSP optimization, and analytics.
              </p>
            </div>

            <div className="p-3 bg-[#142820] rounded-2xl border border-[#273b33] text-[11px] text-[#A5B3AA] space-y-1">
              <div><strong className="text-[#F5F7F5]">Demo User:</strong> {DEMO_USERS.admin.name}</div>
              <div><strong className="text-[#F5F7F5]">Designation:</strong> Chief Controller</div>
              <div className="text-[#8BE0B0] font-semibold">Jurisdiction: All 14 Wards</div>
            </div>
          </div>

          <button
            type="button"
            className="mt-6 w-full py-2.5 rounded-xl bg-[#16A36A] text-white text-xs font-bold group-hover:bg-[#0f7a4e] transition flex items-center justify-center gap-1.5 shadow-md shadow-[#16A36A]/30"
          >
            <span>Launch Municipal Command</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 3. Driver Role Card */}
        <div
          onClick={() => handleDemoLogin("driver")}
          className="p-6 rounded-3xl bg-[#1D2B25] border-2 border-[#273b33] hover:border-[#3987F5] hover:shadow-2xl transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#3987F5]/20 border border-[#3987F5]/40 text-[#90c2ff] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Truck size={24} />
            </div>
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#142820] text-[#90c2ff] border border-[#273b33] mb-1 font-mono">
                Role 03
              </div>
              <h3 className="text-lg font-bold text-[#F5F7F5] font-heading">Fleet Driver Console</h3>
              <p className="text-xs text-[#A5B3AA] mt-1 leading-relaxed">
                Inspect assigned task sequence, turn-by-turn navigation map, change status, and submit cleaning photo proof.
              </p>
            </div>

            <div className="p-3 bg-[#142820] rounded-2xl border border-[#273b33] text-[11px] text-[#A5B3AA] space-y-1">
              <div><strong className="text-[#F5F7F5]">Driver:</strong> {DEMO_USERS.driver.name}</div>
              <div><strong className="text-[#F5F7F5]">Vehicle:</strong> Heavy Compactor #01</div>
              <div className="text-[#90c2ff] font-semibold">Active Capacity: 8,000 kg</div>
            </div>
          </div>

          <button
            type="button"
            className="mt-6 w-full py-2.5 rounded-xl bg-[#3987F5] text-white text-xs font-bold hover:bg-[#2563eb] transition flex items-center justify-center gap-1.5 shadow-md shadow-[#3987F5]/30"
          >
            <span>Launch Driver Console</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
