import React from "react";
import { Link } from "react-router-dom";
import { Recycle, Target, Globe, Shield, Sparkles, Cpu, Award, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold text-[#174C37] uppercase tracking-widest">
          About SmartWaste
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#202923] tracking-tight">
          Next-Generation Civic Technology for Urban Sanity
        </h1>
        <p className="text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
          SmartWaste was conceived to eliminate open urban dumping through closed-loop AI accountability, automated quantity indexing, and data-driven municipal dispatch.
        </p>
      </div>

      {/* Problem Statement vs Our Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* The Problem */}
        <div className="p-8 rounded-3xl bg-red-50/60 border border-red-200/80 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 font-bold">
            ⚠️
          </div>
          <h3 className="text-xl font-bold text-red-950">The Urban Waste Crisis</h3>
          <p className="text-xs text-red-900/80 leading-relaxed">
            Rapid urbanization produces thousands of tons of daily municipal solid waste. Over 30% goes uncollected or ends up in illegal roadside dumping grounds. Traditional municipal grievance systems rely on vague text complaints without visual proof, leading to mismatched truck dispatches, duplicate tickets, delayed SLAs, and citizen apathy.
          </p>
          <ul className="text-xs text-red-900/90 space-y-1.5 font-medium list-disc list-inside">
            <li>Unstructured complaints without volume estimations</li>
            <li>Multiple citizens filing redundant duplicate reports for 1 pile</li>
            <li>No vehicle capacity matching leading to overloaded trucks</li>
            <li>Lack of transparent photographic cleaning verification</li>
          </ul>
        </div>

        {/* The Solution */}
        <div className="p-8 rounded-3xl bg-emerald-50/60 border border-emerald-200/80 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-[#174C37] font-bold">
            🌱
          </div>
          <h3 className="text-xl font-bold text-[#174C37]">The SmartWaste Solution</h3>
          <p className="text-xs text-emerald-950 leading-relaxed">
            SmartWaste transforms the civic workflow into a data-driven, verified pipeline. Citizens submit geo-tagged images, which are instantly classified by computer vision models to derive a Waste Quantity Index (WQI). The system clusters nearby duplicates, prioritizes high-hazard dumping, and calculates optimal vehicle allocation in seconds.
          </p>
          <ul className="text-xs text-emerald-950 space-y-1.5 font-medium list-disc list-inside">
            <li>Automated WQI (0-100) scoring volume, area, and hazard</li>
            <li>Haversine duplicate grouping prevents redundant dispatches</li>
            <li>Intelligent multi-stop TSP vehicle routing and load tracking</li>
            <li>Mandatory after-cleaning photo verification before task closing</li>
          </ul>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#174C37] font-bold text-base">
              <Target size={20} />
              <span>Our Mission</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              To empower citizens and municipal departments with transparent, real-time intelligence that guarantees every reported waste incident is prioritized accurately and cleared within 24 hours.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#174C37] font-bold text-base">
              <Globe size={20} />
              <span>Our Vision</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Zero untreated roadside dumping across urban centers by 2030, supported by closed-loop circular economy recycling hubs and incentivized community participation.
            </p>
          </div>
        </div>
      </div>

      {/* SDG Alignment */}
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold text-[#174C37] uppercase tracking-widest block mb-1">
            Global Agenda
          </span>
          <h2 className="text-2xl font-bold text-stone-900">United Nations SDG Alignment</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white font-black text-xl flex items-center justify-center shrink-0">
              11
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-sm text-stone-900">SDG 11: Sustainable Cities & Communities</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Target 11.6: Reduce the adverse per capita environmental impact of cities, including by paying special attention to air quality and municipal and other waste management.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white font-black text-xl flex items-center justify-center shrink-0">
              12
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-sm text-stone-900">SDG 12: Responsible Consumption & Production</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Target 12.5: Substantially reduce waste generation through prevention, reduction, recycling, and reuse by providing clean categorized waste segregation data.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Architecture Overview */}
      <div className="p-8 rounded-3xl bg-[#174C37] text-white space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-emerald-300">
            <Cpu size={14} />
            <span>Technical Architecture</span>
          </div>
          <h3 className="text-2xl font-extrabold">Built with Modern Civic-Tech Stack</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white/10">
            <div className="font-bold text-emerald-300 mb-1">Frontend Engineering</div>
            <div className="text-white/80">React 19, Vite, Tailwind CSS v4, Lucide Icons, React Router 7</div>
          </div>
          <div className="p-4 rounded-xl bg-white/10">
            <div className="font-bold text-emerald-300 mb-1">GIS & Spatial Analytics</div>
            <div className="text-white/80">Leaflet, OpenStreetMap tiles, Haversine Geofencing (100m)</div>
          </div>
          <div className="p-4 rounded-xl bg-white/10">
            <div className="font-bold text-emerald-300 mb-1">AI & Scoring Engine</div>
            <div className="text-white/80">Deterministic CV pipeline, 4-factor WQI matrix, YOLOv8 weights ready</div>
          </div>
          <div className="p-4 rounded-xl bg-white/10">
            <div className="font-bold text-emerald-300 mb-1">Fleet Optimization</div>
            <div className="text-white/80">Greedy Nearest-Neighbor TSP with priority constraint weighting</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/how-it-works"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#174C37] text-white text-xs font-bold hover:bg-[#0f3325] shadow-sm transition"
        >
          <span>See How the Workflow Operates</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
