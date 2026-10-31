import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { User, Bell, Shield, Award, Mail, Phone, MapPin, Check } from "lucide-react";

export default function CitizenProfilePage() {
  const { currentUser, notifications } = useApp();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePreferences = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#202923] tracking-tight">
          Citizen Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Manage your account credentials, residential municipal ward, and alert preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Profile Card */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm text-center space-y-4">
            <img
              src={currentUser.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"}
              alt={currentUser.name}
              className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-emerald-100 shadow-xs"
            />
            <div>
              <h3 className="text-lg font-bold text-stone-900">{currentUser.name}</h3>
              <p className="text-xs text-stone-500">{currentUser.email}</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-[#174C37] mt-2">
                Verified Resident Citizen
              </span>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 space-y-1">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Accumulated EcoPoints
              </span>
              <div className="text-2xl font-black text-[#174C37]">🌟 {currentUser.points || 420}</div>
              <p className="text-[11px] text-emerald-700">Top 5% Eco Reporter in Delhi NCR</p>
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Alerts */}
        <div className="md:col-span-7 space-y-6">
          {/* Account Details Box */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Residential & Contact Information
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-600 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.name}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-600 block mb-1">Registered Email Address</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-600 block mb-1">Registered Municipal Ward</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.ward || "Ward 7 - Civil Lines"}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Alert Preferences */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Complaint Notification Triggers
            </h4>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer transition">
                <div>
                  <div className="font-bold text-stone-800">Email Status Alerts</div>
                  <div className="text-[11px] text-stone-400">Receive email when truck is dispatched and when cleaning is verified</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="h-4 w-4 text-[#174C37] rounded focus:ring-[#174C37]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer transition">
                <div>
                  <div className="font-bold text-stone-800">SMS / WhatsApp Real-Time Dispatch Alerts</div>
                  <div className="text-[11px] text-stone-400">Instant ping when driver is en route with live ETA</div>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="h-4 w-4 text-[#174C37] rounded focus:ring-[#174C37]"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={handleSavePreferences}
              className="px-5 py-2.5 rounded-xl bg-[#174C37] text-white text-xs font-bold hover:bg-[#0f3325] transition flex items-center gap-1.5 shadow-xs"
            >
              {savedSuccess ? <Check size={14} /> : null}
              <span>{savedSuccess ? "Preferences Saved!" : "Save Preferences"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
