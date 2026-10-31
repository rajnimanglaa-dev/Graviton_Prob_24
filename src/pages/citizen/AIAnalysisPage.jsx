import React, { useState } from "react";
import { SAMPLE_IMAGES } from "../../services/mockData.js";
import { analyzeWasteImage } from "../../services/aiService.js";
import {
  Cpu,
  Sparkles,
  Camera,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Truck,
  ShieldAlert,
  Info
} from "lucide-react";

export default function AIAnalysisPage() {
  const [selectedImage, setSelectedImage] = useState(SAMPLE_IMAGES.plastic);
  const [activeCategory, setActiveCategory] = useState("plastic");
  const [isScanning, setIsScanning] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(() =>
    analyzeWasteImage({ category: "plastic", recurrenceCount: 3, isPublicLocation: true })
  );

  const handleSelectPreset = (cat, url) => {
    setSelectedImage(url);
    setActiveCategory(cat);
    setIsScanning(true);

    setTimeout(() => {
      const res = analyzeWasteImage({ category: cat, recurrenceCount: 2, isPublicLocation: true });
      setAnalysisResult(res);
      setIsScanning(false);
    }, 700);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        setIsScanning(true);
        setTimeout(() => {
          const res = analyzeWasteImage({ category: activeCategory, recurrenceCount: 1, isPublicLocation: true });
          setAnalysisResult(res);
          setIsScanning(false);
        }, 800);
      };
      reader.readAsDataURL(file);
    }
  };

  const getSeverityBadgeClass = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical": return "bg-red-100 text-red-700 border-red-300";
      case "high": return "bg-orange-100 text-orange-700 border-orange-300";
      case "medium": return "bg-amber-100 text-amber-700 border-amber-300";
      default: return "bg-emerald-100 text-emerald-700 border-emerald-300";
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-[#174C37] uppercase tracking-wider">
            Computer Vision & WQI Inference Sandbox
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#202923] tracking-tight mt-1">
          AI Waste Detection & Quantity Indexing Lab
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Deterministic demo analysis engine synthesizing volumetric bounding, surface area, and hazard weighting into a standardized 0–100 index.
        </p>
      </div>

      {/* Preset Selector */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
        <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
          Select Sample Dataset:
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "plastic", label: "Commercial Plastic Clutter", img: SAMPLE_IMAGES.plastic },
            { id: "construction", label: "Demolition & Rubble", img: SAMPLE_IMAGES.construction },
            { id: "mixed", label: "Roadside Dumpster Overflow", img: SAMPLE_IMAGES.dumpster },
            { id: "organic", label: "Perishable Wet Market Waste", img: SAMPLE_IMAGES.organic }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => handleSelectPreset(item.id, item.img)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                selectedImage === item.img
                  ? "bg-[#174C37] text-white border-[#174C37] shadow-xs"
                  : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Inference Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 6 Cols: Image Scanning Canvas */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden border-2 border-stone-300 bg-black aspect-4/3 shadow-md">
            <img
              src={selectedImage}
              alt="Waste scan target"
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isScanning ? "opacity-60" : "opacity-100"
              }`}
            />

            {/* Scanning Laser Animation */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center">
                <div className="w-full h-1 bg-emerald-400 shadow-[0_0_15px_#34d399] animate-bounce" />
                <div className="bg-black/80 px-4 py-2 rounded-xl text-emerald-400 font-mono text-xs font-bold mt-4 animate-pulse">
                  NEURAL OBJECT BOUNDING IN PROGRESS...
                </div>
              </div>
            )}

            {/* Bounding Box Overlay */}
            {!isScanning && (
              <>
                <div className="absolute top-[22%] left-[16%] w-[68%] h-[58%] border-2 border-emerald-400 bg-emerald-400/10 rounded-lg pointer-events-none">
                  <div className="absolute -top-6 left-0 bg-[#174C37] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow">
                    {analysisResult.categoryLabel} ({analysisResult.aiConfidence}%)
                  </div>
                </div>

                <div className="absolute bottom-[10%] left-[10%] w-[80%] h-[32%] border border-dashed border-amber-400 bg-amber-400/5 rounded pointer-events-none">
                  <div className="absolute -top-5 left-0 bg-amber-600 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                    Surface Ground Spread: ~{analysisResult.estimatedAreaM2} m²
                  </div>
                </div>
              </>
            )}

            {/* Bottom Status bar on Image */}
            <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1 rounded-md">
              CV Confidence: {analysisResult.aiConfidence}%
            </div>
          </div>

          {/* Upload Custom Image Button */}
          <label className="flex items-center justify-center gap-2 p-3 bg-white border border-stone-300 rounded-xl cursor-pointer hover:bg-stone-50 transition text-xs font-semibold text-stone-700 text-center shadow-xs">
            <Upload size={15} />
            <span>Upload Custom Photo for Instant CV Analysis</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Right 6 Cols: AI Inference Metrics & WQI */}
        <div className="lg:col-span-6 space-y-5">
          {/* Main WQI Header Card */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest block">
                  Calculated WQI Score
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-4xl font-black text-[#174C37]">
                    {analysisResult.wqi.total}
                  </span>
                  <span className="text-sm font-semibold text-stone-400">/ 100</span>
                </div>
              </div>

              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${getSeverityBadgeClass(analysisResult.wqi.severityLevel)}`}>
                  {analysisResult.wqi.severityLevel} Severity
                </span>
                <div className="text-[11px] text-stone-500 mt-1 font-medium">
                  Priority: <strong className="uppercase">{analysisResult.priority}</strong>
                </div>
              </div>
            </div>

            {/* Recommended Urgency */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs flex items-center justify-between">
              <span className="font-semibold text-stone-700">Dispatch Urgency:</span>
              <span className="font-bold text-[#174C37]">{analysisResult.wqi.urgency}</span>
            </div>

            {/* Explanation Rationale */}
            <p className="text-xs text-stone-600 leading-relaxed bg-emerald-50/50 p-3 rounded-xl border border-emerald-200">
              {analysisResult.priorityReason}
            </p>
          </div>

          {/* 4-Factor WQI Breakdown Meters */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3.5">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              WQI Scoring Model Breakdown
            </h4>

            {/* 1. Volume 40% */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-stone-600">Estimated Volume (40% Weight)</span>
                <span className="font-bold text-stone-900">{analysisResult.wqi.volumeScore} / 40 pts ({analysisResult.estimatedVolumeM3} m³)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full bg-[#174C37] rounded-full transition-all duration-500"
                  style={{ width: `${(analysisResult.wqi.volumeScore / 40) * 100}%` }}
                />
              </div>
            </div>

            {/* 2. Area 25% */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-stone-600">Surface Ground Area (25% Weight)</span>
                <span className="font-bold text-stone-900">{analysisResult.wqi.areaScore} / 25 pts ({analysisResult.estimatedAreaM2} m²)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${(analysisResult.wqi.areaScore / 25) * 100}%` }}
                />
              </div>
            </div>

            {/* 3. Hazard 20% */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-stone-600">Hazard & Toxicity (20% Weight)</span>
                <span className="font-bold text-stone-900">{analysisResult.wqi.hazardScore} / 20 pts</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${(analysisResult.wqi.hazardScore / 20) * 100}%` }}
                />
              </div>
            </div>

            {/* 4. Recurrence 15% */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-stone-600">Recurring Dumping Frequency (15% Weight)</span>
                <span className="font-bold text-stone-900">{analysisResult.wqi.recurrenceScore} / 15 pts</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${(analysisResult.wqi.recurrenceScore / 15) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Recommended Fleet Vehicle */}
          <div className="p-4 rounded-2xl bg-[#174C37] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Truck size={20} className="text-emerald-300" />
              </div>
              <div>
                <span className="text-[10px] text-white/70 uppercase tracking-wider block">Recommended Vehicle Class</span>
                <span className="text-sm font-bold text-white">{analysisResult.wqi.recommendedVehicle}</span>
              </div>
            </div>
            <div className="text-right text-xs text-emerald-200">
              Payload: ~{analysisResult.estimatedWeightKg} kg
            </div>
          </div>

          {/* Transparent Engineering Disclaimer */}
          <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 text-[11px] text-stone-500 flex items-start gap-2">
            <Info size={15} className="text-stone-400 shrink-0 mt-0.5" />
            <p>
              <strong>Deterministic Demo Analysis Engine:</strong> This module uses a deterministic heuristic engine simulating real CV inference. Fully ready for YOLOv8 or Roboflow computer vision endpoint weights integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
