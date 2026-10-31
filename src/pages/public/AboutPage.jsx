import React from "react";
import { Link } from "react-router-dom";
import { Target, Globe, Shield, Sparkles, Cpu, Award, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-[#F5F7F5]">
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold text-[#8BE0B0] uppercase tracking-widest font-mono">
          ABOUT CLICK 2 CLEAN
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#F5F7F5] tracking-tight font-heading">
          Next-Generation Civic Technology for Urban Sanity
        </h1>
        <p className="text-base text-[#A5B3AA] max-w-2xl mx-auto leading-relaxed">
          Click 2 Clean was conceived to eliminate open urban dumping through closed-loop computer vision classification, automated quantity indexing, and intelligent municipal fleet dispatch.
        </p>
      </div>

      {/* Problem Statement vs Our Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* The Problem */}
        <div className="p-8 rounded-3xl bg-[#1D2B25] border border-red-500/30 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
            ⚠️
          </div>
          <h3 className="text-xl font-bold text-red-300 font-heading">The Urban Waste Crisis</h3>
          <p className="text-xs text-[#A5B3AA] leading-relaxed">
            Rapid urbanization produces thousands of tons of daily municipal solid waste. Over 30% goes uncollected or ends up in illegal roadside dumping grounds. Traditional municipal grievance systems rely on vague text complaints without visual proof, leading to mismatched truck dispatches, duplicate tickets, delayed SLAs, and citizen apathy.
          </p>
          <ul className="text-xs text-red-200/90 space-y-1.5 font-medium list-disc list-inside">
            <li>Unstructured complaints without volume estimations</li>
            <li>Multiple citizens filing redundant duplicate reports for 1 pile</li>
            <li>No vehicle capacity matching leading to overloaded trucks</li>
            <li>Lack of transparent photographic cleaning verification</li>
          </ul>
        </div>

        {/* The Solution */}
        <div className="p-8 rounded-3xl bg-[#1D2B25] border border-[#16A36A]/50 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-[#16A36A]/20 text-[#8BE0B0] flex items-center justify-center font-bold">
            🌱
          </div>
          <h3 className="text-xl font-bold text-[#8BE0B0] font-heading">The Click 2 Clean Solution</h3>
          <p className="text-xs text-[#A5B3AA] leading-relaxed">
            Click 2 Clean transforms the civic workflow into a data-driven, verified pipeline. Citizens submit geo-tagged images, which are instantly classified by computer vision models to derive a Waste Quantity Index (WQI). The system clusters nearby duplicates, prioritizes high-hazard dumping, and calculates optimal vehicle allocation in seconds.
          </p>
          <ul className="text-xs text-[#8BE0B0] space-y-1.5 font-medium list-disc list-inside">
            <li>Automated WQI (0-100) scoring volume, area, and hazard</li>
            <li>Haversine duplicate grouping prevents redundant dispatches</li>
            <li>Intelligent multi-stop TSP vehicle routing and load tracking</li>
            <li>Mandatory after-cleaning photo verification before task closing</li>
          </ul>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#142820] border border-[#273b33] shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#8BE0B0] font-bold text-base font-heading">
              <Target size={20} className="text-[#16A36A]" />
              <span>Our Mission</span>
            </div>
            <p className="text-xs text-[#A5B3AA] leading-relaxed">
              To empower citizens and municipal departments with transparent, real-time intelligence that guarantees every reported waste incident is prioritized accurately and cleared within 24 hours.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#8BE0B0] font-bold text-base font-heading">
              <Globe size={20} className="text-[#16A36A]" />
              <span>Our Vision</span>
            </div>
            <p className="text-xs text-[#A5B3AA] leading-relaxed">
              Zero untreated roadside dumping across urban centers by 2030, supported by closed-loop circular economy recycling hubs and incentivized community participation.
            </p>
          </div>
        </div>
      </div>

      {/* SDG Alignment */}
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold text-[#8BE0B0] uppercase tracking-widest block mb-1 font-mono">
            GLOBAL AGENDA
          </span>
          <h2 className="text-2xl font-bold text-[#F5F7F5] font-heading">United Nations SDG Alignment</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500 text-amber-300 font-black text-xl flex items-center justify-center shrink-0 font-stat">
              11
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-sm text-[#F5F7F5] font-heading">SDG 11: Sustainable Cities & Communities</h4>
              <p className="text-xs text-[#A5B3AA] leading-relaxed">
                Target 11.6: Reduce the adverse per capita environmental impact of cities, including by paying special attention to air quality and municipal and other waste management.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#16A36A]/20 border border-[#16A36A] text-[#8BE0B0] font-black text-xl flex items-center justify-center shrink-0 font-stat">
              12
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-sm text-[#F5F7F5] font-heading">SDG 12: Responsible Consumption & Production</h4>
              <p className="text-xs text-[#A5B3AA] leading-relaxed">
                Target 12.5: Substantially reduce waste generation through prevention, reduction, recycling, and reuse by providing clean categorized waste segregation data.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Architecture Overview */}
      <div className="p-8 rounded-3xl bg-[#142820] border border-[#273b33] text-white space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16A36A]/20 border border-[#16A36A]/40 text-xs font-semibold text-[#8BE0B0]">
            <Cpu size={14} className="text-[#16A36A]" />
            <span>Technical Architecture</span>
          </div>
          <h3 className="text-2xl font-extrabold font-heading">Built with Modern Civic-Tech Stack</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#101A17] border border-[#273b33]">
            <div className="font-bold text-[#8BE0B0] mb-1">Frontend Engineering</div>
            <div className="text-[#A5B3AA]">React 19, Vite, Tailwind CSS v4, Lucide Icons, React Router 7</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#101A17] border border-[#273b33]">
            <div className="font-bold text-[#8BE0B0] mb-1">GIS & Spatial Analytics</div>
            <div className="text-[#A5B3AA]">CartoDB Dark Matter, Leaflet GIS, Haversine Geofencing (100m)</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#101A17] border border-[#273b33]">
            <div className="font-bold text-[#8BE0B0] mb-1">AI & Scoring Engine</div>
            <div className="text-[#A5B3AA]">Deterministic CV pipeline, 4-factor WQI matrix, YOLOv8 weights ready</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#101A17] border border-[#273b33]">
            <div className="font-bold text-[#8BE0B0] mb-1">Fleet Optimization</div>
            <div className="text-[#A5B3AA]">Greedy Nearest-Neighbor TSP with priority constraint weighting</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/how-it-works"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#16A36A] text-white text-xs font-bold hover:bg-[#0f7a4e] shadow-md shadow-[#16A36A]/30 transition"
        >
          <span>See How the Workflow Operates</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
