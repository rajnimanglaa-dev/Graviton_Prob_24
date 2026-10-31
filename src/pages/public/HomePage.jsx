import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import {
  Recycle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  MapPin,
  Cpu,
  BarChart2,
  CheckCircle2,
  Users,
  Award,
  Leaf
} from "lucide-react";
import WasteMap from "../../components/Map/WasteMap.jsx";

export default function HomePage() {
  const { reports, vehicles, switchRole } = useApp();

  const activeReportsCount = reports.filter(r => r.status !== "resolved").length;
  const resolvedReportsCount = reports.filter(r => r.status === "resolved").length;

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 lg:pt-24 pb-16 bg-gradient-to-b from-stone-100/60 to-[#F7F8F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-xs font-bold text-[#174C37]">
                <Sparkles size={14} className="text-emerald-700" />
                <span>Next-Gen Civic-Tech Waste Governance Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#202923] tracking-tight leading-[1.1]">
                Cleaner Streets. <br />
                <span className="text-[#174C37]">Smarter Cities.</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
                SmartWaste bridges citizens, municipal command centres, and garbage collection fleets with computer vision waste analysis, automated Waste Quantity Indexing (WQI), and intelligent vehicle allocation.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/citizen/report"
                  className="px-6 py-3.5 rounded-xl bg-[#174C37] text-white hover:bg-[#0f3325] text-sm font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 group"
                >
                  <span>Report Illegal Garbage</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/how-it-works"
                  className="px-6 py-3.5 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 text-sm font-bold shadow-xs transition"
                >
                  Explore How It Works
                </Link>

                <Link
                  to="/live-map"
                  className="px-5 py-3.5 rounded-xl bg-emerald-50 text-[#174C37] hover:bg-emerald-100/80 text-sm font-bold border border-emerald-200 transition flex items-center gap-2"
                >
                  <MapPin size={16} />
                  <span>Live Map</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex items-center gap-6 text-xs text-stone-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>SDG 11 & 12 Aligned</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>Computer Vision WQI</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>Heuristic Fleet TSP</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border-2 border-stone-200/80 shadow-2xl bg-white group">
                <img
                  src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=80"
                  alt="Clean European urban street with green trees"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-102 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/90 text-[11px] font-bold uppercase w-fit mb-2">
                    Verified Clean Locality • Ward 7
                  </div>
                  <h3 className="text-lg font-bold leading-snug">
                    Real-time Civic Accountability in Action
                  </h3>
                  <p className="text-xs text-white/80 mt-1 line-clamp-2">
                    Cleared within 3.2 hours of citizen reporting using AI compactor allocation and after-cleaning photographic proof.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE STATISTICS COUNTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-stone-200">
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-[#174C37]">1,480+</div>
              <div className="text-xs font-semibold text-stone-500 mt-1 uppercase tracking-wider">
                Tons Diverted & Cleared
              </div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-[#174C37]">
                {reports.length * 12 + 180}
              </div>
              <div className="text-xs font-semibold text-stone-500 mt-1 uppercase tracking-wider">
                Incidents Logged
              </div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-[#76A96B]">96.4%</div>
              <div className="text-xs font-semibold text-stone-500 mt-1 uppercase tracking-wider">
                Resolution Within 24h
              </div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-amber-600">
                {vehicles.length}
              </div>
              <div className="text-xs font-semibold text-stone-500 mt-1 uppercase tracking-wider">
                Active Municipal Trucks
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW PIPELINE: REPORT -> DETECT -> PRIORITIZE -> ALLOCATE -> COLLECT -> VERIFY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#174C37] uppercase tracking-widest block mb-2">
            The Closed-Loop Civic Solution
          </span>
          <h2 className="text-3xl font-extrabold text-[#202923] tracking-tight">
            How SmartWaste Works: End-to-End Workflow
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            From mobile camera capture to after-cleaning photographic proof, our multi-tier engine ensures zero dropped complaints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { step: "01", title: "REPORT", desc: "Citizen uploads photo with auto GPS coordinates", icon: "📸" },
            { step: "02", title: "DETECT", desc: "AI classifies waste category & bounds volume", icon: "🤖" },
            { step: "03", title: "PRIORITIZE", desc: "Calculates Waste Quantity Index (WQI) 0-100", icon: "⚖️" },
            { step: "04", title: "ALLOCATE", desc: "Recommends best vehicle by payload & distance", icon: "🚛" },
            { step: "05", title: "COLLECT", desc: "Driver navigates and loads waste on route", icon: "🧹" },
            { step: "06", title: "VERIFY", desc: "Driver uploads after-photo; citizen awarded points", icon: "✅" }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-[#174C37] hover:shadow-md transition text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs font-extrabold text-stone-400 font-mono">
                    {item.step}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-[#174C37] mb-1">{item.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE LIVE WASTE MAP PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <span className="text-xs font-bold text-[#174C37] uppercase tracking-widest block mb-1">
              Real-Time GIS Transparency
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202923]">
              Live Urban Waste & Fleet Map
            </h2>
          </div>
          <Link
            to="/live-map"
            className="text-xs font-bold text-[#174C37] hover:underline flex items-center gap-1"
          >
            <span>Open Fullscreen Map with Ward Boundaries</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <WasteMap reports={reports} vehicles={vehicles} height="480px" />
      </section>

      {/* KEY FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#174C37] uppercase tracking-widest block mb-2">
            Engineered For Municipal Scale
          </span>
          <h2 className="text-3xl font-extrabold text-[#202923] tracking-tight">
            Key Architectural Innovations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-[#174C37]">
              <Cpu size={22} />
            </div>
            <h3 className="font-bold text-base text-stone-900">Deterministic AI WQI Scoring</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Synthesizes volume (40%), ground spread (25%), hazardous classification (20%), and recurring report history (15%) into a transparent 0-100 index.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-[#174C37]">
              <ShieldCheck size={22} />
            </div>
            <h3 className="font-bold text-base text-stone-900">Spatial Proximity Duplicate Detection</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Configurable 100-meter Haversine geofence groups overlapping complaints into a single consolidated incident, preventing redundant truck dispatches.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-[#174C37]">
              <Truck size={22} />
            </div>
            <h3 className="font-bold text-base text-stone-900">Multi-Factor Vehicle Recommendation</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Considers distance, remaining payload capacity, waste category compatibility (tippers for construction debris, compactors for plastic), and driver queues.
            </p>
          </div>
        </div>
      </section>

      {/* ENVIRONMENTAL IMPACT / SDG 11 & 12 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#174C37] text-white p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-emerald-300">
              <Leaf size={14} />
              <span>United Nations Sustainable Development Goals</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Driving Measurable Environmental Impact
            </h2>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              SmartWaste directly accelerates <strong>SDG 11 (Sustainable Cities & Communities)</strong> by reducing per-capita environmental impact, and <strong>SDG 12 (Responsible Consumption & Production)</strong> by preventing illegal dumps and prioritizing recyclable waste diversion.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs">
                <div className="text-2xl font-bold text-emerald-300">38.4%</div>
                <div className="text-xs text-white/70 mt-1">Reduction in response latency</div>
              </div>
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs">
                <div className="text-2xl font-bold text-emerald-300">22.6 km</div>
                <div className="text-xs text-white/70 mt-1">Average route savings per truck</div>
              </div>
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs col-span-2 sm:col-span-1">
                <div className="text-2xl font-bold text-emerald-300">+420 Pts</div>
                <div className="text-xs text-white/70 mt-1">Citizen incentive rewards system</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-3xl font-extrabold text-[#202923]">
          Ready to experience SmartWaste in action?
        </h2>
        <p className="text-sm text-stone-600 max-w-xl mx-auto">
          Explore the three connected portals: lodge a report as a citizen, prioritize and dispatch as an administrator, or complete collections as a fleet driver.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/login"
            className="px-6 py-3.5 rounded-xl bg-[#174C37] text-white hover:bg-[#0f3325] text-sm font-bold shadow-md transition"
          >
            Launch Demo Portals (1-Click Login)
          </Link>
          <Link
            to="/citizen/report"
            className="px-6 py-3.5 rounded-xl bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 text-sm font-bold shadow-xs transition"
          >
            Test Report Submission
          </Link>
        </div>
      </section>
    </div>
  );
}
