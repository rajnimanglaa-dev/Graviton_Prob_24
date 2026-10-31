import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  MapPin,
  Cpu,
  CheckCircle2,
  Leaf,
  Camera,
  Layers,
  Recycle,
  Apple,
  Trash2,
  Navigation,
  Activity
} from "lucide-react";
import WasteMap from "../../components/Map/WasteMap.jsx";
import AnimatedDustbin from "../../components/UI/AnimatedDustbin.jsx";
import { WASTE_COLOR_CATEGORIES } from "../../services/wasteCategoryTheme.js";

export default function HomePage() {
  const { reports, vehicles } = useApp();
  const [selectedDemoCat, setSelectedDemoCat] = useState("green");

  return (
    <div className="space-y-24 pb-24 text-[#F5F7F5]">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 lg:pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#142820] border border-[#273b33] text-xs font-bold text-[#8BE0B0] shadow-sm">
                <Sparkles size={14} className="text-[#16A36A] animate-pulse" />
                <span>Dynamic Crowdsourced Detection & Intelligent Routing</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#F5F7F5] tracking-tight leading-[1.1] font-heading">
                Cleaner Cities. <br />
                <span className="text-[#8BE0B0]">Smarter Waste Management.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#A5B3AA] max-w-2xl leading-relaxed font-normal">
                Empowering citizens to report illegal dumping through geocoded imagery. Powered by automated computer vision classification, Waste Quantity Index (WQI) scoring, and dynamic vehicle routing for high-efficiency municipal fleets.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/citizen/report"
                  className="px-6 py-3.5 rounded-xl bg-[#16A36A] text-white hover:bg-[#0f7a4e] text-sm font-bold shadow-lg shadow-[#16A36A]/30 hover:shadow-[#16A36A]/50 transition flex items-center gap-2 group"
                >
                  <Camera size={17} />
                  <span>Report Illegal Dumping</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/admin/route-optimization"
                  className="px-6 py-3.5 rounded-xl bg-[#1D2B25] border border-[#273b33] hover:border-[#16A36A]/50 text-[#F5F7F5] hover:text-[#8BE0B0] text-sm font-bold shadow-sm transition flex items-center gap-2"
                >
                  <Navigation size={16} className="text-[#8BE0B0]" />
                  <span>Explore AI Routing</span>
                </Link>

                <Link
                  to="/live-map"
                  className="px-5 py-3.5 rounded-xl bg-[#142820] text-[#8BE0B0] hover:bg-[#1D2B25] text-sm font-bold border border-[#273b33] transition flex items-center gap-2"
                >
                  <MapPin size={16} className="text-[#16A36A]" />
                  <span>Live GIS Map</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex items-center gap-6 text-xs text-[#A5B3AA] font-semibold flex-wrap">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-[#16A36A]" />
                  <span>SDG 11 & 12 Aligned</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-[#16A36A]" />
                  <span>Computer Vision WQI</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-[#16A36A]" />
                  <span>Multi-Stop TSP Fleet Dispatch</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Smart Dustbin IoT Receptacle Demo Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-[#273b33] bg-[#1D2B25]/90 backdrop-blur-md p-6 sm:p-8 shadow-2xl space-y-6">
                {/* Header inside card */}
                <div className="flex items-center justify-between border-b border-[#273b33] pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8BE0B0] font-mono">
                      IoT SENSOR SIMULATOR
                    </span>
                    <h3 className="text-base font-extrabold text-[#F5F7F5] font-heading">
                      Smart Optical Sorting Receptacle
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#16A36A]/20 border border-[#16A36A]/40 text-[#8BE0B0] text-[10px] font-bold">
                    ONLINE • ID #104
                  </span>
                </div>

                {/* 3-Category Switcher Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedDemoCat("green")}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      selectedDemoCat === "green"
                        ? "bg-[#16A36A] text-white shadow-md shadow-[#16A36A]/30"
                        : "bg-[#142820] text-[#A5B3AA] hover:text-white border border-[#273b33]"
                    }`}
                  >
                    <Recycle size={13} />
                    <span>Recyclable</span>
                  </button>

                  <button
                    onClick={() => setSelectedDemoCat("blue")}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      selectedDemoCat === "blue"
                        ? "bg-[#3987F5] text-white shadow-md shadow-[#3987F5]/30"
                        : "bg-[#142820] text-[#A5B3AA] hover:text-white border border-[#273b33]"
                    }`}
                  >
                    <Apple size={13} />
                    <span>Organic</span>
                  </button>

                  <button
                    onClick={() => setSelectedDemoCat("yellow")}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      selectedDemoCat === "yellow"
                        ? "bg-[#F4C542] text-[#101A17] shadow-md shadow-[#F4C542]/30"
                        : "bg-[#142820] text-[#A5B3AA] hover:text-white border border-[#273b33]"
                    }`}
                  >
                    <Trash2 size={13} />
                    <span>Mixed</span>
                  </button>
                </div>

                {/* Animated Dustbin SVG Component */}
                <div className="py-4 flex justify-center bg-[#101A17]/60 rounded-2xl border border-[#273b33]">
                  <AnimatedDustbin
                    size="md"
                    category={selectedDemoCat}
                    interactive={true}
                    showParticles={true}
                    fillPercentage={selectedDemoCat === "green" ? 42 : selectedDemoCat === "blue" ? 68 : 25}
                    label="Hover or Click to deposit item"
                  />
                </div>

                <div className="text-[11px] text-[#A5B3AA] text-center">
                  Tip: Hover over the bin to trigger the ultrasonic lid mechanism and watch waste stream absorption.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE STATISTICS COUNTER (Manrope Numbers) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#142820]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#273b33] shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#273b33]">
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#8BE0B0] font-stat">1,480+</div>
              <div className="text-xs font-semibold text-[#A5B3AA] mt-1 uppercase tracking-wider">
                Tons Diverted & Cleared
              </div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#F5F7F5] font-stat">
                {reports.length * 12 + 180}
              </div>
              <div className="text-xs font-semibold text-[#A5B3AA] mt-1 uppercase tracking-wider">
                Incidents Logged
              </div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#16A36A] font-stat">96.4%</div>
              <div className="text-xs font-semibold text-[#A5B3AA] mt-1 uppercase tracking-wider">
                Resolution Within 24h
              </div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#F4C542] font-stat">
                {vehicles.length} Trucks
              </div>
              <div className="text-xs font-semibold text-[#A5B3AA] mt-1 uppercase tracking-wider">
                Active Municipal Fleet
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 3-COLOR WASTE CATEGORIZATION SYSTEM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#8BE0B0] uppercase tracking-widest block mb-2 font-mono">
            STANDARDIZED SEGREGATION PROTOCOL
          </span>
          <h2 className="text-3xl font-extrabold text-[#F5F7F5] tracking-tight font-heading">
            3-Stream Waste Categorization System
          </h2>
          <p className="text-sm text-[#A5B3AA] mt-2">
            Click 2 Clean standardizes all reported debris into three distinct environmental streams to maximize material circularity and route appropriate disposal vehicles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: GREEN - Recyclable */}
          <div className="p-6 rounded-3xl bg-[#1D2B25] border-2 border-[#16A36A]/50 hover:border-[#16A36A] shadow-xl space-y-5 transition duration-300 group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#16A36A]/20 border border-[#16A36A]/40 flex items-center justify-center text-[#16A36A]">
                <Recycle size={26} className="group-hover:rotate-180 transition-transform duration-700" />
              </div>
              <span className="px-3 py-1 rounded-full bg-[#16A36A] text-white text-xs font-extrabold tracking-wider uppercase">
                GREEN STREAM
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#F5F7F5] font-heading">Recyclable Waste</h3>
              <p className="text-xs text-[#A5B3AA] mt-1.5 leading-relaxed">
                Clean materials that can be remanufactured. Routed directly to secondary material recovery facilities (MRFs).
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#273b33]">
              <div className="text-xs font-bold text-[#8BE0B0]">Target Materials:</div>
              <ul className="text-xs text-[#A5B3AA] space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A36A]" />
                  <span>Plastic bottles & polythene packaging</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A36A]" />
                  <span>Cardboard boxes & paper waste</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A36A]" />
                  <span>Aluminium cans & scrap metals</span>
                </li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-[#142820] border border-[#273b33] flex items-center justify-between text-xs">
              <span className="text-[#A5B3AA]">Assigned Fleet:</span>
              <strong className="text-[#8BE0B0]">Medium Compactor Trucks</strong>
            </div>
          </div>

          {/* Card 2: BLUE - Wet / Organic */}
          <div className="p-6 rounded-3xl bg-[#1D2B25] border-2 border-[#3987F5]/50 hover:border-[#3987F5] shadow-xl space-y-5 transition duration-300 group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#3987F5]/20 border border-[#3987F5]/40 flex items-center justify-center text-[#3987F5]">
                <Apple size={26} className="group-hover:scale-110 transition-transform" />
              </div>
              <span className="px-3 py-1 rounded-full bg-[#3987F5] text-white text-xs font-extrabold tracking-wider uppercase">
                BLUE STREAM
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#F5F7F5] font-heading">Wet / Organic Waste</h3>
              <p className="text-xs text-[#A5B3AA] mt-1.5 leading-relaxed">
                Biodegradable kitchen and horticultural matter. Diverted to municipal biomethanation and aerobic composting centers.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#273b33]">
              <div className="text-xs font-bold text-[#90c2ff]">Target Materials:</div>
              <ul className="text-xs text-[#A5B3AA] space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3987F5]" />
                  <span>Household food leftovers & kitchen scraps</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3987F5]" />
                  <span>Vegetable peels & fruit waste</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3987F5]" />
                  <span>Garden foliage & tree cuttings</span>
                </li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-[#142820] border border-[#273b33] flex items-center justify-between text-xs">
              <span className="text-[#A5B3AA]">Assigned Fleet:</span>
              <strong className="text-[#90c2ff]">Covered Tipper Bins</strong>
            </div>
          </div>

          {/* Card 3: YELLOW - Mixed / Other */}
          <div className="p-6 rounded-3xl bg-[#1D2B25] border-2 border-[#F4C542]/50 hover:border-[#F4C542] shadow-xl space-y-5 transition duration-300 group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#F4C542]/20 border border-[#F4C542]/40 flex items-center justify-center text-[#F4C542]">
                <Trash2 size={26} className="group-hover:rotate-12 transition-transform" />
              </div>
              <span className="px-3 py-1 rounded-full bg-[#F4C542] text-[#101A17] text-xs font-extrabold tracking-wider uppercase">
                YELLOW STREAM
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#F5F7F5] font-heading">Mixed / Other Waste</h3>
              <p className="text-xs text-[#A5B3AA] mt-1.5 leading-relaxed">
                Unsegregated garbage piles, building debris, and non-recyclables requiring specialized heavy handling and screening.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#273b33]">
              <div className="text-xs font-bold text-[#fce58d]">Target Materials:</div>
              <ul className="text-xs text-[#A5B3AA] space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F4C542]" />
                  <span>Mixed roadside garbage dumps</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F4C542]" />
                  <span>Construction rubble & drywall debris</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F4C542]" />
                  <span>Multi-layer non-recyclable composites</span>
                </li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-[#142820] border border-[#273b33] flex items-center justify-between text-xs">
              <span className="text-[#A5B3AA]">Assigned Fleet:</span>
              <strong className="text-[#fce58d]">Heavy Hydraulic Compactors</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WORKFLOW PIPELINE: REPORT -> DETECT -> PRIORITIZE -> ALLOCATE -> COLLECT -> VERIFY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#8BE0B0] uppercase tracking-widest block mb-2 font-mono">
            CLOSED-LOOP CIVIC PIPELINE
          </span>
          <h2 className="text-3xl font-extrabold text-[#F5F7F5] tracking-tight font-heading">
            How Click 2 Clean Operates: 6-Stage Workflow
          </h2>
          <p className="text-sm text-[#A5B3AA] mt-2">
            From smartphone camera capture to verified post-cleaning photographic proof, our multi-tier engine ensures zero dropped incidents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { step: "01", title: "REPORT", desc: "Citizen snaps photograph with auto GPS geocoding", icon: "📸" },
            { step: "02", title: "DETECT", desc: "AI maps debris to 3-Color streams & calculates WQI", icon: "🤖" },
            { step: "03", title: "PRIORITIZE", desc: "Dynamic queue orders critical sites by severity", icon: "⚖️" },
            { step: "04", title: "ALLOCATE", desc: "Automated TSP routing assigns nearest optimal vehicle", icon: "🚛" },
            { step: "05", title: "COLLECT", desc: "Driver navigates turn-by-turn and loads debris", icon: "🧹" },
            { step: "06", title: "VERIFY", desc: "Driver uploads after-photo; citizen gains EcoPoints", icon: "✅" }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#1D2B25] border border-[#273b33] shadow-md hover:border-[#16A36A] hover:bg-[#24362f] transition text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs font-extrabold text-[#8BE0B0] font-mono">
                    {item.step}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-[#F5F7F5] mb-1 font-heading">{item.title}</h4>
                <p className="text-xs text-[#A5B3AA] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE LIVE WASTE MAP PREVIEW (CartoDB Dark Matter) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <span className="text-xs font-bold text-[#8BE0B0] uppercase tracking-widest block mb-1 font-mono">
              REAL-TIME GIS OBSERVABILITY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F5] font-heading">
              Live Urban Waste & Fleet Map
            </h2>
          </div>
          <Link
            to="/live-map"
            className="text-xs font-bold text-[#8BE0B0] hover:underline flex items-center gap-1"
          >
            <span>Open Fullscreen Interactive Map</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <WasteMap reports={reports} vehicles={vehicles} height="520px" />
      </section>

      {/* 6. KEY ARCHITECTURAL INNOVATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#8BE0B0] uppercase tracking-widest block mb-2 font-mono">
            MUNICIPAL GRADE ARCHITECTURE
          </span>
          <h2 className="text-3xl font-extrabold text-[#F5F7F5] tracking-tight font-heading">
            Core Technological Innovations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#16A36A]/20 border border-[#16A36A]/30 flex items-center justify-center text-[#8BE0B0]">
              <Cpu size={22} />
            </div>
            <h3 className="font-bold text-base text-[#F5F7F5] font-heading">Deterministic AI WQI Engine</h3>
            <p className="text-xs text-[#A5B3AA] leading-relaxed">
              Synthesizes volume (40%), ground footprint (25%), hazardous classification (20%), and recurring report history (15%) into a transparent 0-100 severity index.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#16A36A]/20 border border-[#16A36A]/30 flex items-center justify-center text-[#8BE0B0]">
              <ShieldCheck size={22} />
            </div>
            <h3 className="font-bold text-base text-[#F5F7F5] font-heading">Spatial Proximity Deduplication</h3>
            <p className="text-xs text-[#A5B3AA] leading-relaxed">
              Configurable 100-meter Haversine geofence clusters overlapping citizen reports into a single consolidated incident, preventing redundant fleet dispatches.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#16A36A]/20 border border-[#16A36A]/30 flex items-center justify-center text-[#8BE0B0]">
              <Truck size={22} />
            </div>
            <h3 className="font-bold text-base text-[#F5F7F5] font-heading">Heuristic Fleet Routing (TSP)</h3>
            <p className="text-xs text-[#A5B3AA] leading-relaxed">
              Solves multi-stop Traveling Salesperson problems matching truck payloads, waste category requirements, and minimum fuel consumption.
            </p>
          </div>
        </div>
      </section>

      {/* 7. ENVIRONMENTAL IMPACT / SDG 11 & 12 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#142820] to-[#1D2B25] text-white p-8 sm:p-12 relative overflow-hidden border border-[#273b33] shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16A36A]/20 border border-[#16A36A]/40 text-xs font-semibold text-[#8BE0B0]">
              <Leaf size={14} className="text-[#16A36A]" />
              <span>United Nations Sustainable Development Goals</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
              Driving Measurable Environmental Impact
            </h2>

            <p className="text-sm sm:text-base text-[#A5B3AA] leading-relaxed">
              <strong className="text-[#F5F7F5]">Click 2 Clean</strong> directly accelerates <strong className="text-[#8BE0B0]">SDG 11 (Sustainable Cities & Communities)</strong> by eliminating untreated illegal dumpsites, and <strong className="text-[#8BE0B0]">SDG 12 (Responsible Consumption & Production)</strong> through automated 3-stream segregation and recyclable recovery.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-[#101A17]/80 border border-[#273b33]">
                <div className="text-2xl font-bold text-[#8BE0B0] font-stat">38.4%</div>
                <div className="text-xs text-[#A5B3AA] mt-1">Reduction in response latency</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#101A17]/80 border border-[#273b33]">
                <div className="text-2xl font-bold text-[#8BE0B0] font-stat">22.6 km</div>
                <div className="text-xs text-[#A5B3AA] mt-1">Avg route savings per truck</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#101A17]/80 border border-[#273b33] col-span-2 sm:col-span-1">
                <div className="text-2xl font-bold text-[#8BE0B0] font-stat">+420 Pts</div>
                <div className="text-xs text-[#A5B3AA] mt-1">Citizen EcoPoints incentives</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-3xl font-extrabold text-[#F5F7F5] font-heading">
          Ready to experience Click 2 Clean in action?
        </h2>
        <p className="text-sm text-[#A5B3AA] max-w-xl mx-auto">
          Explore the three connected portals: lodge an illegal dumping complaint as a citizen, prioritize and route fleets as an administrator, or complete collections as a driver.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/login"
            className="px-6 py-3.5 rounded-xl bg-[#16A36A] text-white hover:bg-[#0f7a4e] text-sm font-bold shadow-lg shadow-[#16A36A]/30 transition"
          >
            Launch Demo Portals (1-Click Switch)
          </Link>
          <Link
            to="/citizen/report"
            className="px-6 py-3.5 rounded-xl bg-[#1D2B25] border border-[#273b33] text-[#F5F7F5] hover:text-[#8BE0B0] text-sm font-bold shadow-xs transition"
          >
            Test Report Submission
          </Link>
        </div>
      </section>
    </div>
  );
}
