import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { ArrowRight, Camera, Menu, X } from "lucide-react";
import Logo from "./UI/Logo.jsx";

export default function Navbar() {
  const location = useLocation();
  const { currentUser, switchRole } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "How It Works", path: "/how-it-works" },
    { label: "Live Waste Map", path: "/live-map" }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#101A17]/90 backdrop-blur-md border-b border-[#273b33] transition-colors">
      {/* Top Demo Bar for Hackathon Judges */}
      <div className="bg-[#142820] text-[#A5B3AA] text-[11px] py-1.5 px-4 font-medium flex items-center justify-between border-b border-[#1D2B25]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#16A36A] animate-pulse" />
          <span>
            <strong className="text-[#F5F7F5]">Click 2 Clean</strong> • Active Evaluation Role:{" "}
            <span className="text-[#8BE0B0] font-bold capitalize">{currentUser.role}</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#A5B3AA] hidden sm:inline text-[10px]">Switch Role:</span>
          {["citizen", "admin", "driver"].map((r) => (
            <button
              key={r}
              onClick={() => switchRole(r)}
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold transition capitalize ${
                currentUser.role === r
                  ? "bg-[#16A36A] text-white shadow-xs"
                  : "bg-[#1D2B25] text-[#A5B3AA] hover:text-white hover:bg-[#273b33]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo "Click 2 Clean" */}
        <Link to="/" className="flex items-center">
          <Logo size="md" />
        </Link>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition font-heading ${
                  isActive
                    ? "text-[#8BE0B0] bg-[#1D2B25] border border-[#273b33]"
                    : "text-[#A5B3AA] hover:text-[#F5F7F5] hover:bg-[#142820]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action CTAs */}
        <div className="hidden sm:flex items-center gap-2.5">
          <Link
            to="/citizen/report"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#142820] text-[#8BE0B0] hover:bg-[#1D2B25] text-xs font-bold border border-[#273b33] hover:border-[#16A36A]/50 transition"
          >
            <Camera size={14} className="text-[#16A36A]" />
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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#16A36A] text-white hover:bg-[#0f7a4e] text-xs font-bold shadow-md shadow-[#16A36A]/30 transition group"
          >
            <span>Open {currentUser.role === "admin" ? "Admin" : currentUser.role === "driver" ? "Driver" : "Citizen"} Portal</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-[#A5B3AA] hover:text-white hover:bg-[#1D2B25]"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#142820] border-b border-[#273b33] px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#A5B3AA] hover:text-white hover:bg-[#1D2B25]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-[#1D2B25] flex flex-col gap-2">
            <Link
              to="/citizen/report"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-center text-sm font-bold bg-[#1D2B25] text-[#8BE0B0] border border-[#273b33]"
            >
              Report Waste
            </Link>
            <Link
              to={currentUser.role === "admin" ? "/admin/overview" : currentUser.role === "driver" ? "/driver/overview" : "/citizen/dashboard"}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-center text-sm font-bold bg-[#16A36A] text-white"
            >
              Open {currentUser.role} Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
