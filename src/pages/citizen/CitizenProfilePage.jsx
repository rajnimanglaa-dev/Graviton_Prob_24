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
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn text-[#F5F7F5]">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7F5] tracking-tight font-heading">
          Citizen Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#A5B3AA] mt-0.5">
          Manage your account credentials, residential municipal ward, and alert preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Profile Card */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md text-center space-y-4">
            <img
              src={currentUser.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"}
              alt={currentUser.name}
              className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-[#16A36A] shadow-md"
            />
            <div>
              <h3 className="text-lg font-bold text-[#F5F7F5] font-heading">{currentUser.name}</h3>
              <p className="text-xs text-[#A5B3AA]">{currentUser.email}</p>
              <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#16A36A]/20 border border-[#16A36A]/40 text-[#8BE0B0] mt-2 font-mono">
                Verified Resident Citizen
              </span>
            </div>

            <div className="p-4 bg-[#142820] rounded-2xl border border-[#273b33] space-y-1">
              <span className="text-[10px] font-bold text-[#8BE0B0] uppercase tracking-wider block font-mono">
                Accumulated EcoPoints
              </span>
              <div className="text-2xl font-black text-[#F4C542] font-stat">🌟 {currentUser.points || 420}</div>
              <p className="text-[11px] text-[#A5B3AA]">Top 5% Eco Reporter in Delhi NCR</p>
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Alerts */}
        <div className="md:col-span-7 space-y-6">
          {/* Account Details Box */}
          <div className="p-6 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-4">
            <h4 className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">
              Residential & Contact Information
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#A5B3AA] block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.name}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#273b33] bg-[#142820] text-[#F5F7F5] font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-[#A5B3AA] block mb-1">Registered Email Address</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#273b33] bg-[#142820] text-[#F5F7F5] font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-[#A5B3AA] block mb-1">Registered Municipal Ward</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.ward || "Ward 7 - Civil Lines"}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#273b33] bg-[#142820] text-[#F5F7F5] font-medium"
                />
              </div>
            </div>
          </div>

          {/* Alert Preferences */}
          <div className="p-6 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-4">
            <h4 className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">
              Complaint Notification Triggers
            </h4>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#142820] border border-[#273b33] cursor-pointer">
                <div>
                  <div className="font-bold text-[#F5F7F5]">Email Notifications</div>
                  <div className="text-[11px] text-[#A5B3AA]">Receive instant photo proof when ticket is closed</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#16A36A]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#142820] border border-[#273b33] cursor-pointer">
                <div>
                  <div className="font-bold text-[#F5F7F5]">SMS / WhatsApp Live Alerts</div>
                  <div className="text-[11px] text-[#A5B3AA]">Receive driver arrival notifications within 15 minutes</div>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#16A36A]"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={handleSavePreferences}
              className="px-5 py-2.5 rounded-xl bg-[#16A36A] text-white hover:bg-[#0f7a4e] text-xs font-bold transition shadow-md shadow-[#16A36A]/30 flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check size={14} />
                  <span>Preferences Saved!</span>
                </>
              ) : (
                <span>Save Notification Settings</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
