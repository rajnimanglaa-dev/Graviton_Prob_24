import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { Settings, Save, Check, RotateCcw, AlertTriangle, ShieldCheck, Sliders, Radio } from "lucide-react";

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
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn text-[#F5F7F5]">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A36A] animate-pulse" />
          <span className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider">
            Municipal Configuration Engine
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#F5F7F5] tracking-tight mt-1">
          Municipal System Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#A5B3AA] mt-1">
          Tune algorithmic thresholds for duplicate detection geofencing, SLA escalation windows, and WQI scoring parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Duplicate Detection Geofencing */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#1D2B25] border border-[#24382F] shadow-lg space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-sm font-bold font-heading text-[#F5F7F5] flex items-center gap-2">
                <Radio size={16} className="text-[#8BE0B0]" />
                <span>Spatial Duplicate Detection Radius</span>
              </h3>
              <p className="text-xs text-[#A5B3AA]">
                Proximity perimeter in meters for clustering duplicate citizen reports into a single consolidated master ticket.
              </p>
            </div>
            <span className="font-stat text-sm font-black text-[#8BE0B0] bg-[#142820] px-3.5 py-1.5 rounded-xl border border-[#24382F] self-start sm:self-auto shadow-inner">
              {formState.duplicateThresholdMeters} meters
            </span>
          </div>

          <div className="pt-2">
            <input
              type="range"
              min="25"
              max="500"
              step="25"
              value={formState.duplicateThresholdMeters}
              onChange={(e) => setFormState({ ...formState, duplicateThresholdMeters: Number(e.target.value) })}
              className="w-full h-2.5 bg-[#142820] rounded-lg appearance-none cursor-pointer accent-[#16A36A] border border-[#24382F]"
            />
            <div className="flex justify-between text-[11px] text-[#A5B3AA]/70 mt-2">
              <span>25 m (Tightly Constrained)</span>
              <span className="text-[#8BE0B0] font-semibold">100 m (Standard Smart City Default)</span>
              <span>500 m (Broad Ward Radius)</span>
            </div>
          </div>
        </div>

        {/* Section 2: SLA Escalation Windows */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#1D2B25] border border-[#24382F] shadow-lg space-y-5">
          <div>
            <h3 className="text-sm font-bold font-heading text-[#F5F7F5] flex items-center gap-2">
              <Sliders size={16} className="text-[#8BE0B0]" />
              <span>Target Service Level Agreement (SLA) Windows</span>
            </h3>
            <p className="text-xs text-[#A5B3AA] mt-1">
              Maximum allowable collection window before automatic supervisory escalation and route reprioritization.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#142820] border border-[#24382F] space-y-2">
              <label className="font-bold text-[#FF6B6B] block">
                Critical SLA (Hours)
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={formState.slaCriticalHours}
                onChange={(e) => setFormState({ ...formState, slaCriticalHours: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#101A17] border border-[#24382F] focus:outline-none focus:border-[#FF6B6B] text-[#F5F7F5] font-stat font-bold"
              />
              <span className="text-[10px] text-[#A5B3AA]/70 block">Benchmark: 2 Hours</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#142820] border border-[#24382F] space-y-2">
              <label className="font-bold text-[#F4C542] block">
                High Priority SLA (Hours)
              </label>
              <input
                type="number"
                min="2"
                max="24"
                value={formState.slaHighHours}
                onChange={(e) => setFormState({ ...formState, slaHighHours: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#101A17] border border-[#24382F] focus:outline-none focus:border-[#F4C542] text-[#F5F7F5] font-stat font-bold"
              />
              <span className="text-[10px] text-[#A5B3AA]/70 block">Benchmark: 6 Hours</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#142820] border border-[#24382F] space-y-2">
              <label className="font-bold text-[#3987F5] block">
                Medium Priority SLA (Hours)
              </label>
              <input
                type="number"
                min="6"
                max="48"
                value={formState.slaMediumHours}
                onChange={(e) => setFormState({ ...formState, slaMediumHours: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#101A17] border border-[#24382F] focus:outline-none focus:border-[#3987F5] text-[#F5F7F5] font-stat font-bold"
              />
              <span className="text-[10px] text-[#A5B3AA]/70 block">Benchmark: 24 Hours</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={resetToDemoData}
            className="px-4 py-2.5 text-xs font-semibold text-[#A5B3AA] hover:text-[#F5F7F5] transition flex items-center gap-1.5 rounded-xl hover:bg-[#1D2B25]"
          >
            <RotateCcw size={14} />
            <span>Reset Demo State</span>
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#16A36A] hover:bg-[#8BE0B0] text-[#101A17] text-xs font-black font-heading transition flex items-center gap-2 shadow-lg shadow-[#16A36A]/20"
          >
            {savedSuccess ? <Check size={16} /> : <Save size={16} />}
            <span>{savedSuccess ? "Configuration Saved!" : "Save Configuration"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
