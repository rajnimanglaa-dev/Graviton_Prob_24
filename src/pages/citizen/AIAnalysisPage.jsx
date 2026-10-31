import React, { useState } from "react";
import { SAMPLE_IMAGES } from "../../services/mockData.js";
import { analyzeWasteImage } from "../../services/aiService.js";
import { getWasteVisualCategory } from "../../services/wasteCategoryTheme.js";
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

  const visualCat = getWasteVisualCategory(analysisResult.category);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn text-[#F5F7F5]">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A36A] animate-pulse" />
          <span className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">
            COMPUTER VISION & WQI INFERENCE SANDBOX
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7F5] tracking-tight mt-1 font-heading">
          AI Waste Detection & Quantity Indexing Lab
        </h1>
        <p className="text-xs sm:text-sm text-[#A5B3AA] mt-0.5">
          Deterministic demo analysis engine synthesizing volumetric bounding, surface area, and hazard weighting into a standardized 0–100 index.
        </p>
      </div>

      {/* Preset Selector */}
      <div className="p-4 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-2">
        <span className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">
          Select Sample Dataset:
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "plastic", label: "🟢 Commercial Plastic (Green Stream)", img: SAMPLE_IMAGES.plastic },
            { id: "construction", label: "🟡 Demolition & Rubble (Yellow Stream)", img: SAMPLE_IMAGES.construction },
            { id: "mixed", label: "🟡 Roadside Overflow (Yellow Stream)", img: SAMPLE_IMAGES.dumpster },
            { id: "organic", label: "🔵 Wet Market Refuse (Blue Stream)", img: SAMPLE_IMAGES.organic }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => handleSelectPreset(item.id, item.img)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                selectedImage === item.img
                  ? "bg-[#16A36A] text-white border-[#16A36A] shadow-md shadow-[#16A36A]/30"
                  : "bg-[#142820] text-[#A5B3AA] border-[#273b33] hover:text-white"
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
          <div className="relative rounded-3xl overflow-hidden border border-[#273b33] bg-[#101A17] aspect-4/3 shadow-2xl">
            <img
              src={selectedImage}
              alt="Waste scan target"
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isScanning ? "opacity-40" : "opacity-90"
              }`}
            />

            {/* Scanning Laser Animation */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center">
                <div className="w-full h-1 bg-[#8BE0B0] shadow-[0_0_20px_#8BE0B0] animate-laser" />
                <div className="bg-[#101A17]/90 border border-[#16A36A] px-4 py-2 rounded-xl text-[#8BE0B0] font-mono text-xs font-bold mt-4 animate-pulse">
                  NEURAL OBJECT BOUNDING IN PROGRESS...
                </div>
              </div>
            )}

            {/* Bounding Box Overlay with 3-Color Mapping */}
            {!isScanning && (
              <>
                <div
                  className="absolute top-[22%] left-[16%] w-[68%] h-[58%] rounded-xl pointer-events-none transition-all duration-500"
                  style={{
                    border: `2px solid ${visualCat.color}`,
                    backgroundColor: `${visualCat.color}15`,
                    boxShadow: `0 0 15px ${visualCat.color}30`
                  }}
                >
                  <div
                    className="absolute -top-6 left-0 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow"
                    style={{ backgroundColor: visualCat.color }}
                  >
                    {visualCat.name} • {analysisResult.categoryLabel} ({analysisResult.aiConfidence}%)
                  </div>
                </div>

                <div className="absolute bottom-[10%] left-[10%] w-[80%] h-[32%] border border-dashed border-[#F4C542] bg-[#F4C542]/10 rounded-xl pointer-events-none">
                  <div className="absolute -top-5 left-0 bg-[#F4C542] text-[#101A17] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                    Surface Ground Spread: ~{analysisResult.estimatedAreaM2} m²
                  </div>
                </div>
              </>
            )}

            {/* Bottom Status bar on Image */}
            <div className="absolute bottom-2 right-2 bg-[#101A17]/85 backdrop-blur-md text-[#8BE0B0] text-[10px] font-mono px-2.5 py-1 rounded-md border border-[#273b33]">
              CV Confidence: {analysisResult.aiConfidence}%
            </div>
          </div>

          {/* Upload Custom Image Button */}
          <label className="flex items-center justify-center gap-2 p-3 bg-[#1D2B25] border border-[#273b33] rounded-2xl cursor-pointer hover:border-[#16A36A]/50 transition text-xs font-semibold text-[#F5F7F5] text-center shadow-sm">
            <Upload size={15} className="text-[#8BE0B0]" />
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
          <div className="p-6 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#A5B3AA] uppercase tracking-widest block font-mono">
                  Calculated WQI Score
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-4xl font-black text-[#8BE0B0] font-stat">
                    {analysisResult.wqi.total}
                  </span>
                  <span className="text-sm font-semibold text-[#A5B3AA]">/ 100</span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className="px-3 py-1 rounded-full text-xs font-extrabold uppercase border"
                  style={{
                    backgroundColor: `${visualCat.color}25`,
                    borderColor: visualCat.color,
                    color: visualCat.mint
                  }}
                >
                  {analysisResult.wqi.severityLevel} Severity
                </span>
                <div className="text-[11px] text-[#A5B3AA] mt-1 font-medium">
                  Priority: <strong className="uppercase text-[#F5F7F5]">{analysisResult.priority}</strong>
                </div>
              </div>
            </div>

            {/* Recommended Urgency */}
            <div className="p-3 bg-[#142820] rounded-2xl border border-[#273b33] text-xs flex items-center justify-between">
              <span className="font-semibold text-[#A5B3AA]">Dispatch Urgency:</span>
              <span className="font-bold text-[#8BE0B0]">{analysisResult.wqi.urgency}</span>
            </div>

            {/* Explanation Rationale */}
            <p className="text-xs text-[#A5B3AA] leading-relaxed bg-[#142820] p-3 rounded-2xl border border-[#273b33]">
              {analysisResult.priorityReason}
            </p>
          </div>

          {/* 4-Factor WQI Breakdown Meters */}
          <div className="p-6 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md space-y-3.5">
            <h4 className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">
              WQI Scoring Model Breakdown
            </h4>

            {/* 1. Volume 40% */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#A5B3AA]">Estimated Volume (40% Weight)</span>
                <span className="font-bold text-[#F5F7F5] font-stat">{analysisResult.wqi.volumeScore} / 40 pts ({analysisResult.estimatedVolumeM3} m³)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#101A17] overflow-hidden border border-[#273b33]">
                <div
                  className="h-full bg-[#16A36A] rounded-full transition-all duration-500"
                  style={{ width: `${(analysisResult.wqi.volumeScore / 40) * 100}%` }}
                />
              </div>
            </div>

            {/* 2. Area 25% */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#A5B3AA]">Surface Ground Area (25% Weight)</span>
                <span className="font-bold text-[#F5F7F5] font-stat">{analysisResult.wqi.areaScore} / 25 pts ({analysisResult.estimatedAreaM2} m²)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#101A17] overflow-hidden border border-[#273b33]">
                <div
                  className="h-full bg-[#8BE0B0] rounded-full transition-all duration-500"
                  style={{ width: `${(analysisResult.wqi.areaScore / 25) * 100}%` }}
                />
              </div>
            </div>

            {/* 3. Hazard 20% */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#A5B3AA]">Hazard & Toxicity (20% Weight)</span>
                <span className="font-bold text-[#F5F7F5] font-stat">{analysisResult.wqi.hazardScore} / 20 pts</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#101A17] overflow-hidden border border-[#273b33]">
                <div
                  className="h-full bg-[#F4C542] rounded-full transition-all duration-500"
                  style={{ width: `${(analysisResult.wqi.hazardScore / 20) * 100}%` }}
                />
              </div>
            </div>

            {/* 4. Recurrence 15% */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#A5B3AA]">Recurring History Frequency (15% Weight)</span>
                <span className="font-bold text-[#F5F7F5] font-stat">{analysisResult.wqi.recurrenceScore} / 15 pts</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#101A17] overflow-hidden border border-[#273b33]">
                <div
                  className="h-full bg-[#3987F5] rounded-full transition-all duration-500"
                  style={{ width: `${(analysisResult.wqi.recurrenceScore / 15) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Recommended Fleet Vehicle */}
          <div className="p-4 rounded-3xl bg-[#142820] border border-[#273b33] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#16A36A]/20 border border-[#16A36A]/40 flex items-center justify-center">
                <Truck size={20} className="text-[#8BE0B0]" />
              </div>
              <div>
                <span className="text-[10px] text-[#A5B3AA] uppercase tracking-wider block font-mono">Recommended Vehicle Class</span>
                <span className="text-sm font-bold text-[#F5F7F5]">{analysisResult.wqi.recommendedVehicle}</span>
              </div>
            </div>
            <div className="text-right text-xs text-[#8BE0B0] font-stat">
              Payload: ~{analysisResult.estimatedWeightKg} kg
            </div>
          </div>

          {/* Transparent Engineering Disclaimer */}
          <div className="p-3 bg-[#101A17] rounded-2xl border border-[#273b33] text-[11px] text-[#A5B3AA] flex items-start gap-2">
            <Info size={15} className="text-[#8BE0B0] shrink-0 mt-0.5" />
            <p>
              <strong className="text-[#F5F7F5]">Deterministic Demo Analysis Engine:</strong> This module uses a deterministic heuristic engine simulating real CV inference. Fully ready for YOLOv8 weights and edge sensor container integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
