import React from "react";
import { Link } from "react-router-dom";
import Logo from "./UI/Logo.jsx";
import { Shield, Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0A120F] text-[#A5B3AA] pt-14 pb-8 border-t border-[#1D2B25] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <Logo size="md" />
            <p className="text-xs text-[#A5B3AA] leading-relaxed">
              Dynamic crowdsourced waste dumping detection & intelligent waste routing platform connecting citizens, municipal command centres, and garbage collection fleets.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-lg bg-[#142820] border border-[#273b33] text-[#8BE0B0] font-semibold">
                SDG 11: Sustainable Cities
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#142820] border border-[#273b33] text-[#8BE0B0] font-semibold">
                SDG 12: Circular Economy
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#F5F7F5] uppercase tracking-wider font-heading">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-[#8BE0B0] transition">Home Page</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#8BE0B0] transition">About & SDG Goals</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-[#8BE0B0] transition">How It Works</Link>
              </li>
              <li>
                <Link to="/live-map" className="hover:text-[#8BE0B0] transition">Live Public Waste Map</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#8BE0B0] transition">Login & Role Access</Link>
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#F5F7F5] uppercase tracking-wider font-heading">Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/citizen/dashboard" className="hover:text-[#8BE0B0] transition">Citizen Portal (Reporting)</Link>
              </li>
              <li>
                <Link to="/citizen/ai-analysis" className="hover:text-[#8BE0B0] transition">AI Detection & WQI Lab</Link>
              </li>
              <li>
                <Link to="/admin/overview" className="hover:text-[#8BE0B0] transition">Municipal Command Centre</Link>
              </li>
              <li>
                <Link to="/admin/route-optimization" className="hover:text-[#8BE0B0] transition">Route Optimization (TSP)</Link>
              </li>
              <li>
                <Link to="/driver/overview" className="hover:text-[#8BE0B0] transition">Driver Fleet Portal</Link>
              </li>
            </ul>
          </div>

          {/* Technology & SDG */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#F5F7F5] uppercase tracking-wider font-heading">Tech Stack</h4>
            <p className="text-xs text-[#A5B3AA] leading-relaxed">
              Built with Computer Vision classification heuristics, Waste Quantity Index (WQI), CartoDB dark geospatial mapping, and heuristic TSP vehicle routing.
            </p>
            <div className="p-3 rounded-xl bg-[#142820] border border-[#273b33] text-xs space-y-1">
              <div className="font-bold text-[#F5F7F5] flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#16A36A]" />
                <span>Deterministic AI Engine</span>
              </div>
              <p className="text-[11px] text-[#A5B3AA]">
                Ready for edge YOLOv8 model & IoT container sensors.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#1D2B25] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A5B3AA]">
          <div>
            © {new Date().getFullYear()} <strong className="text-[#F5F7F5]">Click 2 Clean</strong>. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[11px]">
              Civic Technology for a Greener Tomorrow
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
