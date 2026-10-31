import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import {
  Bell,
  Check,
  Globe,
  Menu,
  Shield,
  Truck,
  User,
  RotateCcw
} from "lucide-react";
import ThemeToggle from "./UI/ThemeToggle.jsx";

export default function AppHeader({ onToggleSidebar }) {
  const {
    currentUser,
    switchRole,
    notifications,
    markAllNotificationsRead,
    resetToDemoData
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getPortalTitle = () => {
    if (currentUser.role === "admin") return "Municipal Command Centre";
    if (currentUser.role === "driver") return "Driver Fleet Console";
    return "Citizen Waste Portal";
  };

  return (
    <header className="h-16 bg-[#142820]/90 backdrop-blur-md border-b border-[#273b33] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left side: Hamburger + Portal Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar menu"
          className="lg:hidden p-2 rounded-lg text-[#A5B3AA] hover:bg-[#1D2B25] hover:text-white"
        >
          <Menu size={20} />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-[#F5F7F5] font-heading">{getPortalTitle()}</h1>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#1D2B25] border border-[#273b33] text-[#8BE0B0]">
              {currentUser.role}
            </span>
          </div>
          <p className="text-[11px] text-[#A5B3AA] hidden md:block">
            Click 2 Clean • Dynamic Crowdsourced Waste Routing
          </p>
        </div>
      </div>

      {/* Right side: Quick Switcher + Notifications + Profile */}
      <div className="flex items-center gap-2.5">
        <ThemeToggle compact />
        {/* Quick Role Switcher Pills */}
        <div className="hidden md:flex items-center bg-[#101A17] p-1 rounded-xl text-xs border border-[#273b33]">
          <button
            onClick={() => switchRole("citizen")}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              currentUser.role === "citizen"
                ? "bg-[#16A36A] text-white shadow-xs"
                : "text-[#A5B3AA] hover:text-white"
            }`}
          >
            <User size={13} />
            <span>Citizen</span>
          </button>
          <button
            onClick={() => switchRole("admin")}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              currentUser.role === "admin"
                ? "bg-[#16A36A] text-white shadow-xs"
                : "text-[#A5B3AA] hover:text-white"
            }`}
          >
            <Shield size={13} />
            <span>Admin</span>
          </button>
          <button
            onClick={() => switchRole("driver")}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              currentUser.role === "driver"
                ? "bg-[#16A36A] text-white shadow-xs"
                : "text-[#A5B3AA] hover:text-white"
            }`}
          >
            <Truck size={13} />
            <span>Driver</span>
          </button>
        </div>

        {/* Public Site Link */}
        <Link
          to="/"
          title="Go to Public Website"
          className="p-2 rounded-xl text-[#A5B3AA] hover:bg-[#1D2B25] hover:text-[#8BE0B0] transition text-xs font-semibold hidden sm:flex items-center gap-1.5"
        >
          <Globe size={16} />
          <span>Public Site</span>
        </Link>

        {/* Reset Demo Data Button */}
        <button
          onClick={resetToDemoData}
          title="Reset sample data"
          className="p-2 rounded-xl text-[#A5B3AA] hover:bg-[#1D2B25] hover:text-white transition"
        >
          <RotateCcw size={16} />
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Toggle notifications menu"
            className="p-2 rounded-xl text-[#A5B3AA] hover:bg-[#1D2B25] hover:text-white relative transition"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1D2B25] rounded-2xl shadow-2xl border border-[#273b33] overflow-hidden z-50 animate-fadeIn">
              <div className="p-3.5 bg-[#142820] text-white flex items-center justify-between border-b border-[#273b33]">
                <span className="text-xs font-bold text-[#F5F7F5] font-heading">Notifications ({notifications.length})</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-[#8BE0B0] hover:text-white flex items-center gap-1"
                  >
                    <Check size={13} />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#273b33]">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#A5B3AA]">
                    No new alerts
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-3 text-xs transition ${
                        !n.read ? "bg-[#16A36A]/10" : "bg-[#1D2B25] hover:bg-[#24362f]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-[#F5F7F5] font-bold">{n.title}</strong>
                        <span className="text-[10px] text-[#A5B3AA] font-mono">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-[#A5B3AA] text-[11px] leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Info */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#273b33]">
          <img
            src={currentUser.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-[#16A36A]"
          />
          <div className="hidden xl:block text-left text-xs">
            <div className="font-bold text-[#F5F7F5] line-clamp-1">{currentUser.name}</div>
            <div className="text-[10px] text-[#8BE0B0] capitalize">{currentUser.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
