import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { Recycle, MapPin, ShieldAlert, Truck, User, ArrowRight } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const { currentUser, switchRole } = useApp();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "How It Works", path: "/how-it-works" },
    { label: "Live Waste Map", path: "/live-map" }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F7F8F3]/90 backdrop-blur-md border-b border-stone-200">
      {/* Top Demo Bar for Hackathon Judges */}
      <div className="bg-[#174C37] text-white text-[11px] py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>SmartWaste Hackathon Edition • Active Role: <strong className="capitalize">{currentUser.role}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/70 hidden sm:inline">Quick Portal Switch:</span>
          <button
            onClick={() => switchRole("citizen")}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
              currentUser.role === "citizen" ? "bg-white text-[#174C37]" : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            Citizen
          </button>
          <button
            onClick={() => switchRole("admin")}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
              currentUser.role === "admin" ? "bg-white text-[#174C37]" : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => switchRole("driver")}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
              currentUser.role === "driver" ? "bg-white text-[#174C37]" : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            Driver
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#174C37] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Recycle size={22} className="text-emerald-300" />
          </div>
          <div>
            <div className="font-extrabold text-lg text-[#174C37] tracking-tight leading-none">
              Smart<span className="text-[#76A96B]">Waste</span>
            </div>
            <div className="text-[10px] text-stone-500 font-semibold tracking-wider uppercase mt-0.5">
              Cleaner Streets. Smarter Cities.
            </div>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? "text-[#174C37] bg-emerald-100/60"
                    : "text-stone-600 hover:text-[#174C37] hover:bg-stone-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action CTAs */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/citizen/report"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-[#174C37] hover:bg-emerald-100/80 text-xs font-bold border border-emerald-200 transition"
          >
            <span>Report Waste</span>
          </Link>

          {/* Jump into Active Dashboard */}
          <Link
            to={
              currentUser.role === "admin"
                ? "/admin/overview"
                : currentUser.role === "driver"
                ? "/driver/overview"
                : "/citizen/dashboard"
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#174C37] text-white hover:bg-[#0f3325] text-xs font-bold shadow-sm transition"
          >
            <span>Open {currentUser.role === "admin" ? "Admin" : currentUser.role === "driver" ? "Driver" : "Citizen"} Portal</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </header>
  );
}
