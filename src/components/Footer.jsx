import React from "react";
import { Link } from "react-router-dom";
import { Recycle, Heart, Shield, Globe, Award, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-14 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#174C37] text-white flex items-center justify-center">
                <Recycle size={20} className="text-emerald-400" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Smart<span className="text-[#76A96B]">Waste</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              AI-assisted civic waste management platform connecting citizens, municipal authorities, and collection fleets for rapid, prioritized urban cleanup.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-stone-400">
              <span className="px-2 py-1 rounded bg-stone-800 border border-stone-700 text-emerald-400 font-semibold">
                SDG 11: Sustainable Cities
              </span>
              <span className="px-2 py-1 rounded bg-stone-800 border border-stone-700 text-emerald-400 font-semibold">
                SDG 12: Circular Economy
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition">Home Page</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">About & SDG Goals</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition">How It Works</Link>
              </li>
              <li>
                <Link to="/live-map" className="hover:text-white transition">Live Public Waste Map</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">Login & Role Access</Link>
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/citizen/dashboard" className="hover:text-white transition">Citizen Portal (Reporting)</Link>
              </li>
              <li>
                <Link to="/citizen/ai-analysis" className="hover:text-white transition">AI Detection & WQI Lab</Link>
              </li>
              <li>
                <Link to="/admin/overview" className="hover:text-white transition">Municipal Command Centre</Link>
              </li>
              <li>
                <Link to="/admin/route-optimization" className="hover:text-white transition">Smart Route Optimization</Link>
              </li>
              <li>
                <Link to="/driver/overview" className="hover:text-white transition">Driver Fleet Portal</Link>
              </li>
            </ul>
          </div>

          {/* Municipal Helpline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Municipal Helpline</h4>
            <p className="text-xs text-stone-400">
              For emergency chemical, medical, or hazardous spill reporting:
            </p>
            <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700 text-xs text-white font-mono">
              📞 1800-SMART-CLEAN (Toll-Free)
            </div>
            <div className="text-[11px] text-stone-500">
              Operating 24/7 across all municipal administrative wards.
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} SmartWaste Inc. Built for Urban Governance & Circular Sustainability.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>Deterministic AI Analysis</span>
            <span>•</span>
            <span>Leaflet GIS</span>
            <span>•</span>
            <span>Heuristic Route TSP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
