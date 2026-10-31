import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  Cpu,
  Calculator,
  ListOrdered,
  Truck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  MapPin
} from "lucide-react";

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState(0);

  const steps = [
    {
      number: "01",
      title: "Citizen Reports Waste",
      actor: "Citizen Portal",
      icon: Camera,
      short: "Capture photo, auto-detect GPS, and select preliminary category.",
      details: [
        "Citizens take or upload a clear photo of roadside dumping via mobile or web.",
        "Automatic HTML5 browser geolocation captures precise latitude and longitude.",
        "Manual pin adjustments on an interactive map ensure exact street-level accuracy.",
        "Proximity engine checks for nearby existing reports within 100 meters to flag potential duplicates."
      ],
      tag: "Step 1 of 7"
    },
    {
      number: "02",
      title: "AI Image Analysis",
      actor: "Computer Vision Engine",
      icon: Cpu,
      short: "YOLO / CV pipeline classifies waste type, bounds clusters, and estimates volume.",
      details: [
        "Deterministic CV pipeline inspects image textures, boundaries, and visual spread.",
        "Detects predominant category: Plastic, Construction Debris, Organic, Household, or Mixed.",
        "Calculates confidence score (typically 90%–97%).",
        "Calculates approximate volumetric size in cubic meters (m³) and surface area (m²)."
      ],
      tag: "Step 2 of 7"
    },
    {
      number: "03",
      title: "System Calculates WQI",
      actor: "WQI Algorithm",
      icon: Calculator,
      short: "Waste Quantity Index synthesizes 4 weighted factors into a 0–100 score.",
      details: [
        "Estimated Waste Volume (40% weight): Scaled against standard compactor payload limits.",
        "Area Spread (25% weight): Ground footprint measurement of the litter field.",
        "Waste Type & Toxicity Hazard (20% weight): High penalty for sharp rubble, chemicals, or decomposing organic matter.",
        "Recurring History (15% weight): Historical frequency of illegal dumping at this geohash."
      ],
      tag: "Step 3 of 7"
    },
    {
      number: "04",
      title: "Multi-Factor Prioritization",
      actor: "Municipal Command Engine",
      icon: ListOrdered,
      short: "Dynamic queue ranking based on WQI, public sensitivity, and SLA aging.",
      details: [
        "Severity tiers: Low (0-25), Medium (26-50), High (51-75), Critical (76-100).",
        "Higher priority reports automatically surface to the top of the Admin Priority Queue.",
        "Duplicate corroboration boost: multiple citizens reporting the same pile elevates attention score.",
        "Generates explicit audit reason explaining why the report was prioritized."
      ],
      tag: "Step 4 of 7"
    },
    {
      number: "05",
      title: "Intelligent Fleet Allocation",
      actor: "Fleet Recommendation Engine",
      icon: Truck,
      short: "Matches closest available truck with appropriate body type and remaining payload.",
      details: [
        "Evaluates real-time GPS locations of all available municipal trucks.",
        "Checks remaining capacity vs estimated waste weight (e.g. 2.4 tons).",
        "Body suitability matching: Compactor trucks for plastic/household, Tipper trucks for construction rubble.",
        "Administrator can accept 1-click AI recommendation or manually override assignment."
      ],
      tag: "Step 5 of 7"
    },
    {
      number: "06",
      title: "Driver Collection & Navigation",
      actor: "Driver Fleet Portal",
      icon: MapPin,
      short: "Driver receives turn-by-turn route, marks status, and loads waste.",
      details: [
        "Driver receives assignment notification on mobile fleet console.",
        "Interactive route map sequences stops in optimal order (depot -> pickups -> landfill).",
        "Driver updates status live: 'On the Way' -> 'Arrived' -> 'Loading'.",
        "Changes instantly reflect across Citizen tracking timeline and Admin Command Centre."
      ],
      tag: "Step 6 of 7"
    },
    {
      number: "07",
      title: "Cleaning Verified & Ticket Closed",
      actor: "Proof Verification Engine",
      icon: CheckCircle2,
      short: "Driver uploads mandatory after-cleaning photograph; citizen earns EcoPoints.",
      details: [
        "Driver cannot complete ticket without capturing photographic proof of the cleared ground.",
        "Municipal administrator inspects before/after side-by-side verification.",
        "Report marked 'Resolved' and closed.",
        "Reporting citizen receives real-time notification and +50 EcoPoints toward community rankings."
      ],
      tag: "Step 7 of 7"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Title */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold text-[#174C37] uppercase tracking-widest">
          End-to-End Civic Architecture
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#202923] tracking-tight">
          How SmartWaste Operates
        </h1>
        <p className="text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Explore the 7 synchronized steps of the closed-loop governance workflow from initial citizen capture to final verified disposal.
        </p>
      </div>

      {/* Step Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {steps.map((st, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === i
                ? "bg-[#174C37] text-white shadow-sm"
                : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
            }`}
          >
            <span>{st.number}</span>
            <span className="hidden sm:inline">{st.title.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Active Step Feature Box */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-stone-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-[#174C37] flex items-center justify-center font-black text-2xl">
              {steps[activeTab].number}
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                {steps[activeTab].actor}
              </span>
              <h3 className="text-2xl font-black text-stone-900">{steps[activeTab].title}</h3>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-semibold w-fit">
            {steps[activeTab].tag}
          </span>
        </div>

        <p className="text-base text-stone-800 font-medium">
          {steps[activeTab].short}
        </p>

        {/* Detailed Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {steps[activeTab].details.map((point, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 leading-relaxed flex items-start gap-2.5"
            >
              <CheckCircle2 size={16} className="text-[#174C37] shrink-0 mt-0.5" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Visual All Steps Timeline Card */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-stone-900">
          Complete Lifecycle Sequence
        </h3>
        <div className="space-y-3">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                onClick={() => setActiveTab(i)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                  activeTab === i
                    ? "bg-emerald-50/70 border-[#174C37] shadow-xs"
                    : "bg-white border-stone-200 hover:border-stone-300"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    activeTab === i ? "bg-[#174C37] text-white" : "bg-stone-100 text-stone-600"
                  }`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-stone-800">{st.title}</span>
                      <span className="text-[10px] font-semibold text-stone-400">({st.actor})</span>
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-1">{st.short}</p>
                  </div>
                </div>

                <div className="text-xs font-bold text-[#174C37] hidden sm:block">
                  View Specs →
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-8 rounded-3xl bg-[#174C37] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold">Try the workflow live right now</h3>
          <p className="text-xs text-white/80 mt-1">
            Submit a test report and observe it propagate immediately to Admin and Driver portals.
          </p>
        </div>
        <Link
          to="/citizen/report"
          className="px-6 py-3 rounded-xl bg-white text-[#174C37] text-xs font-bold hover:bg-stone-100 transition whitespace-nowrap shadow-sm"
        >
          Submit Test Waste Report
        </Link>
      </div>
    </div>
  );
}
