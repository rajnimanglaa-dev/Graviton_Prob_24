import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { Settings, Save, Check, RotateCcw, AlertTriangle, ShieldCheck } from "lucide-react";

export default function AdminSettingsPage() {
  const { settings, setSettings, resetToDemoData } = useApp();

  const [formState, setFormState] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSettings(formState);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#202923] tracking-tight">
          Municipal System Settings
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Tune algorithmic thresholds for duplicate detection geofencing, SLA escalation intervals, and WQI scoring parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Duplicate Detection Geofencing */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Spatial Duplicate Detection Threshold
              </h3>
              <p className="text-xs text-stone-500">
                GPS proximity boundary for clustering nearby citizen reports under a single master ticket.
              </p>
            </div>
            <span className="font-mono text-sm font-black text-[#174C37] bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              {formState.duplicateThresholdMeters} meters
            </span>
          </div>

          <div>
            <input
              type="range"
              min="25"
              max="500"
              step="25"
              value={formState.duplicateThresholdMeters}
              onChange={(e) => setFormState({ ...formState, duplicateThresholdMeters: Number(e.target.value) })}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#174C37]"
            />
            <div className="flex justify-between text-[11px] text-stone-400 mt-1">
              <span>25 m (Tightly Constrained)</span>
              <span>100 m (Recommended Standard)</span>
              <span>500 m (Broad Neighborhood)</span>
            </div>
          </div>
        </div>

        {/* Section 2: SLA Escalation Windows */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-stone-900">
            Target Service Level Agreement (SLA) Windows
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-red-700 block mb-1">
                Critical SLA (Hours)
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={formState.slaCriticalHours}
                onChange={(e) => setFormState({ ...formState, slaCriticalHours: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#174C37] font-bold"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">Default: 2 Hours</span>
            </div>

            <div>
              <label className="font-semibold text-orange-700 block mb-1">
                High Priority SLA (Hours)
              </label>
              <input
                type="number"
                min="2"
                max="24"
                value={formState.slaHighHours}
                onChange={(e) => setFormState({ ...formState, slaHighHours: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#174C37] font-bold"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">Default: 6 Hours</span>
            </div>

            <div>
              <label className="font-semibold text-amber-700 block mb-1">
                Medium Priority SLA (Hours)
              </label>
              <input
                type="number"
                min="6"
                max="48"
                value={formState.slaMediumHours}
                onChange={(e) => setFormState({ ...formState, slaMediumHours: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#174C37] font-bold"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">Default: 24 Hours</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={resetToDemoData}
            className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-900 transition flex items-center gap-1.5"
          >
            <RotateCcw size={14} />
            <span>Reset Demo State</span>
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#174C37] text-white hover:bg-[#0f3325] text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            {savedSuccess ? <Check size={16} /> : <Save size={16} />}
            <span>{savedSuccess ? "Configuration Saved!" : "Save Configuration"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
