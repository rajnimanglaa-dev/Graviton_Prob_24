import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import { DEMO_USERS } from "../../services/mockData.js";
import { Recycle, User, Shield, Truck, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginAs, currentUser } = useApp();
  const [selectedRole, setSelectedRole] = useState("citizen");

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
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      {/* Page Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#174C37] text-xs font-bold">
          <Sparkles size={13} />
          <span>Hackathon Evaluation Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#202923] tracking-tight">
          SmartWaste Portal Access
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
          Sign in using demo profiles configured for hackathon judges or select your role to inspect synchronized workflows.
        </p>
      </div>

      {/* 3 Quick Role Cards for Hackathon Judges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Citizen Role Card */}
        <div
          onClick={() => handleDemoLogin("citizen")}
          className="p-6 rounded-3xl bg-white border-2 border-stone-200 hover:border-[#174C37] hover:shadow-xl transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#174C37] flex items-center justify-center group-hover:scale-110 transition-transform">
              <User size={24} />
            </div>
            <div>
              <div className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1">
                Role 01
              </div>
              <h3 className="text-lg font-bold text-stone-900">Citizen Portal</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Report waste with camera & GPS, test duplicate detection, inspect AI WQI score, and view leaderboard.
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
              <div><strong>Demo User:</strong> {DEMO_USERS.citizen.name}</div>
              <div><strong>Ward:</strong> {DEMO_USERS.citizen.ward}</div>
              <div className="text-emerald-700 font-semibold">🌟 {DEMO_USERS.citizen.points} EcoPoints</div>
            </div>
          </div>

          <button
            type="button"
            className="mt-6 w-full py-2.5 rounded-xl bg-[#174C37] text-white text-xs font-bold group-hover:bg-[#0f3325] transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Launch Citizen Dashboard</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 2. Admin Role Card */}
        <div
          onClick={() => handleDemoLogin("admin")}
          className="p-6 rounded-3xl bg-white border-2 border-stone-200 hover:border-purple-600 hover:shadow-xl transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield size={24} />
            </div>
            <div>
              <div className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-50 text-purple-800 border border-purple-200 mb-1">
                Role 02
              </div>
              <h3 className="text-lg font-bold text-stone-900">Municipal Admin</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Command Centre overview, priority queue, vehicle recommendations, route optimization, and analytics.
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
              <div><strong>Demo User:</strong> {DEMO_USERS.admin.name}</div>
              <div><strong>Designation:</strong> Chief Controller</div>
              <div className="text-purple-700 font-semibold">Full Municipal Admin Access</div>
            </div>
          </div>

          <button
            type="button"
            className="mt-6 w-full py-2.5 rounded-xl bg-purple-800 text-white text-xs font-bold group-hover:bg-purple-900 transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Launch Command Centre</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 3. Driver Role Card */}
        <div
          onClick={() => handleDemoLogin("driver")}
          className="p-6 rounded-3xl bg-white border-2 border-stone-200 hover:border-blue-600 hover:shadow-xl transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Truck size={24} />
            </div>
            <div>
              <div className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-50 text-blue-800 border border-blue-200 mb-1">
                Role 03
              </div>
              <h3 className="text-lg font-bold text-stone-900">Fleet Driver</h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                View assigned pickup tasks, update collection status, and upload mandatory cleaning proof photos.
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
              <div><strong>Demo Driver:</strong> {DEMO_USERS.driver.name}</div>
              <div><strong>Assigned Truck:</strong> {DEMO_USERS.driver.assignedTruckId}</div>
              <div className="text-blue-700 font-semibold">Rating: 4.9 ★ • Compactor Unit</div>
            </div>
          </div>

          <button
            type="button"
            className="mt-6 w-full py-2.5 rounded-xl bg-blue-700 text-white text-xs font-bold group-hover:bg-blue-800 transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Launch Driver Console</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Info notice for evaluators */}
      <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
        <CheckCircle2 size={18} className="text-[#174C37] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Cross-Portal Synchronous Architecture:</strong> Clicking any role immediately authenticates you and navigates to that portal. You can also quickly switch roles at any point from the top navigation bar to test the end-to-end lifecycle seamlessly.
        </p>
      </div>
    </div>
  );
}
