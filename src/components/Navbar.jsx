import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { ArrowRight, Camera, Menu, X } from "lucide-react";
import Logo from "./UI/Logo.jsx";
import ThemeToggle from "./UI/ThemeToggle.jsx";

export default function Navbar() {
  const location = useLocation();
  const { currentUser, switchRole } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "How it works", path: "/how-it-works" },
    { label: "Live map", path: "/live-map" }
  ];
  const portalPath = currentUser.role === "admin" ? "/admin/overview" : currentUser.role === "driver" ? "/driver/overview" : "/citizen/dashboard";
  const portalLabel = currentUser.role === "admin" ? "Admin" : currentUser.role === "driver" ? "Driver" : "Citizen";

  return (
    <header className="sticky top-0 z-40 bg-[#101A17]/90 backdrop-blur-xl border-b border-[#273b33] transition-colors">
      <div className="bg-[#142820] text-[#A5B3AA] text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-[#1D2B25]">
        <div className="flex items-center gap-2 min-w-0"><span className="w-1.5 h-1.5 rounded-full bg-[#16A36A] shadow-[0_0_8px_#16A36A]" /><span className="truncate"><strong className="text-[#F5F7F5]">Demo mode</strong><span className="hidden sm:inline"> · Evaluation role:</span><span className="sm:hidden"> ·</span> <span className="text-[#8BE0B0] font-bold capitalize">{currentUser.role}</span></span></div>
        <div className="flex items-center gap-1.5 shrink-0"><span className="hidden sm:inline text-[10px] mr-1">Preview role</span>{["citizen", "admin", "driver"].map(role => <button type="button" key={role} onClick={() => switchRole(role)} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition capitalize ${currentUser.role === role ? "bg-[#16A36A] text-white shadow-sm" : "bg-[#1D2B25] text-[#A5B3AA] hover:text-white hover:bg-[#273b33]"}`}>{role}</button>)}</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[4.5rem] flex items-center justify-between gap-6">
        <Link to="/" aria-label="Click 2 Clean home" className="shrink-0"><Logo size="md" showTagline={false} /></Link>

        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
          {navLinks.map(link => <Link key={link.path} to={link.path} aria-current={location.pathname === link.path ? "page" : undefined} className={`px-3 py-2 rounded-xl text-[13px] font-semibold transition ${location.pathname === link.path ? "text-[#8BE0B0] bg-[#1D2B25]" : "text-[#A5B3AA] hover:text-[#F5F7F5] hover:bg-[#142820]"}`}>{link.label}</Link>)}
        </nav>

        <div className="hidden sm:flex items-center gap-2.5">
          <ThemeToggle />
          <Link to="/citizen/report" className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#142820] text-[#8BE0B0] hover:bg-[#1D2B25] text-xs font-bold border border-[#273b33] hover:border-[#16A36A]/60 transition"><Camera size={15} /><span>Report waste</span></Link>
          <Link to={portalPath} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16A36A] text-white hover:bg-[#0f7a4e] text-xs font-bold shadow-lg shadow-[#16A36A]/20 transition group"><span>{portalLabel} portal</span><ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></Link>
        </div>

        <div className="sm:hidden flex items-center gap-2"><ThemeToggle compact /><button type="button" onClick={() => setMobileMenuOpen(open => !open)} aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"} className="p-2 rounded-xl text-[#A5B3AA] hover:text-white hover:bg-[#1D2B25]">{mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}</button></div>
      </div>

      {mobileMenuOpen && <div className="md:hidden bg-[#142820] border-b border-[#273b33] px-4 pt-2 pb-4 space-y-1.5">
        {navLinks.map(link => <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-[#A5B3AA] hover:text-white hover:bg-[#1D2B25]">{link.label}</Link>)}
        <div className="pt-3 mt-2 border-t border-[#273b33] grid grid-cols-2 gap-2"><Link to="/citizen/report" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl text-center text-sm font-bold bg-[#1D2B25] text-[#8BE0B0] border border-[#273b33]">Report waste</Link><Link to={portalPath} onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl text-center text-sm font-bold bg-[#16A36A] text-white">{portalLabel} portal</Link></div>
      </div>}
    </header>
  );
}
