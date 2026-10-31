import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import { SAMPLE_IMAGES } from "../../services/mockData.js";
import { findNearbyDuplicates } from "../../services/geoService.js";
import { getWasteVisualCategory } from "../../services/wasteCategoryTheme.js";
import AnimatedDustbin from "../../components/UI/AnimatedDustbin.jsx";
import {
  Camera,
  Upload,
  MapPin,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Info,
  Recycle,
  Apple,
  Trash2
} from "lucide-react";

export default function ReportWastePage() {
  const navigate = useNavigate();
  const { reports, submitReport, settings } = useApp();

  // Form State
  const [selectedPhoto, setSelectedPhoto] = useState(SAMPLE_IMAGES.plastic);
  const [photoPreview, setPhotoPreview] = useState(SAMPLE_IMAGES.plastic);
  const [category, setCategory] = useState("plastic");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState({
    lat: 28.6285,
    lng: 77.2185,
    address: "Behind Market Gate 4, Sector 18 Commercial Complex",
    ward: "Ward 7 - Civil Lines"
  });
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);

  // Real-time Duplicate Detection check
  const [nearbyDuplicates, setNearbyDuplicates] = useState([]);

  useEffect(() => {
    if (location.lat && location.lng) {
      const dupes = findNearbyDuplicates(
        location.lat,
        location.lng,
        reports,
        settings.duplicateThresholdMeters || 100
      );
      setNearbyDuplicates(dupes);
    }
  }, [location, reports, settings]);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedPhoto(reader.result);
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick preset sample photos
  const setPresetPhoto = (type, url, defaultCategory) => {
    setSelectedPhoto(url);
    setPhotoPreview(url);
    setCategory(defaultCategory);
  };

  // GPS Auto-detect
  const handleDetectLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          setLocation({
            lat: Number(position.coords.latitude.toFixed(6)),
            lng: Number(position.coords.longitude.toFixed(6)),
            address: `GPS Pin (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}), Ward 7`,
            ward: "Ward 7 - Civil Lines"
          });
        },
        (error) => {
          setIsLocating(false);
          setLocation({
            lat: 28.6210,
            lng: 77.2160,
            address: "Main Commercial Market Rd, Sector 14, Ward 7",
            ward: "Ward 7 - Civil Lines"
          });
        },
        { timeout: 6000 }
      );
    } else {
      setIsLocating(false);
      setLocation({
        lat: 28.6210,
        lng: 77.2160,
        address: "Main Commercial Market Rd, Sector 14, Ward 7",
        ward: "Ward 7 - Civil Lines"
      });
    }
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!photoPreview) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newReport = submitReport({
        title: title || `${category.toUpperCase()} dumping near ${location.address}`,
        category,
        description,
        imageUrl: photoPreview,
        location
      });

      setIsSubmitting(false);
      setSubmittedReport(newReport);
    }, 900);
  };

  const activeVisual = getWasteVisualCategory(category);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn text-[#F5F7F5]">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#16A36A] animate-pulse" />
          <span className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">
            CITIZEN GRIEVANCE REDRESSAL
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7F5] tracking-tight mt-1 font-heading">
          Report Illegal Garbage Dumping
        </h1>
        <p className="text-xs sm:text-sm text-[#A5B3AA] mt-0.5">
          Upload a clear photograph. Our computer vision engine will calculate the Waste Quantity Index (WQI) and automatically schedule municipal fleet dispatch.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Photo Upload & Interactive Dustbin Simulation */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#273b33] pb-4">
            <h3 className="text-sm font-bold text-[#F5F7F5] flex items-center gap-2 font-heading">
              <Camera size={18} className="text-[#8BE0B0]" />
              <span>Step 1: Photographic Evidence</span>
            </h3>
            <span className="text-[11px] text-[#8BE0B0] font-semibold bg-[#142820] px-2.5 py-1 rounded-full border border-[#273b33]">
              AI Neural Inference Ready
            </span>
          </div>

          {/* Quick Preset Selector for Easy Testing */}
          <div>
            <span className="text-[11px] font-bold text-[#A5B3AA] uppercase tracking-wider block mb-2 font-mono">
              Quick Test Presets (Click to preview different waste classes):
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPresetPhoto("plastic", SAMPLE_IMAGES.plastic, "plastic")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  photoPreview === SAMPLE_IMAGES.plastic
                    ? "bg-[#16A36A] text-white border-[#16A36A]"
                    : "bg-[#142820] text-[#A5B3AA] border-[#273b33] hover:text-white"
                }`}
              >
                🟢 Plastic (Green Stream)
              </button>
              <button
                type="button"
                onClick={() => setPresetPhoto("organic", SAMPLE_IMAGES.organic, "organic")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  photoPreview === SAMPLE_IMAGES.organic
                    ? "bg-[#3987F5] text-white border-[#3987F5]"
                    : "bg-[#142820] text-[#A5B3AA] border-[#273b33] hover:text-white"
                }`}
              >
                🔵 Organic / Food (Blue Stream)
              </button>
              <button
                type="button"
                onClick={() => setPresetPhoto("construction", SAMPLE_IMAGES.construction, "construction")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  photoPreview === SAMPLE_IMAGES.construction
                    ? "bg-[#F4C542] text-[#101A17] border-[#F4C542]"
                    : "bg-[#142820] text-[#A5B3AA] border-[#273b33] hover:text-white"
                }`}
              >
                🟡 Construction Debris (Yellow Stream)
              </button>
              <button
                type="button"
                onClick={() => setPresetPhoto("dumpster", SAMPLE_IMAGES.dumpster, "mixed")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  photoPreview === SAMPLE_IMAGES.dumpster
                    ? "bg-[#F4C542] text-[#101A17] border-[#F4C542]"
                    : "bg-[#142820] text-[#A5B3AA] border-[#273b33] hover:text-white"
                }`}
              >
                🟡 Mixed Roadside Pile
              </button>
            </div>
          </div>

          {/* Photo Preview Canvas + Integrated Animated Dustbin */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Image display */}
            <div className="sm:col-span-7">
              <div className="relative rounded-2xl overflow-hidden border border-[#273b33] bg-[#101A17] h-64 sm:h-72">
                {photoPreview ? (
                  <>
                    <img
                      src={photoPreview}
                      alt="Garbage preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#101A17]/90 backdrop-blur-md text-[#8BE0B0] text-[10px] font-bold px-3 py-1.5 rounded-xl border border-[#273b33] shadow-md flex items-center gap-1.5">
                      <Sparkles size={12} className="text-[#16A36A]" />
                      <span>Ready for AI Neural Inference</span>
                    </div>

                    {/* Stream Pill */}
                    <div className="absolute bottom-3 left-3 bg-[#101A17]/90 backdrop-blur-md px-3 py-1 rounded-xl border border-[#273b33] text-xs font-bold flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeVisual.color }} />
                      <span style={{ color: activeVisual.mint }}>{activeVisual.badgeLabel}</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#A5B3AA]">
                    <Camera size={36} />
                    <span className="text-xs mt-2">No image selected</span>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Area with Animated Dustbin */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center space-y-4">
              <div className="p-3 bg-[#142820] rounded-2xl border border-[#273b33] w-full flex justify-center">
                <AnimatedDustbin
                  size="sm"
                  category={activeVisual.group === "recyclable" ? "green" : activeVisual.group === "organic" ? "blue" : "yellow"}
                  interactive={true}
                  label="Receptacle Simulation"
                />
              </div>

              <label className="w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#273b33] hover:border-[#16A36A] rounded-2xl cursor-pointer bg-[#142820]/60 hover:bg-[#142820] transition text-center">
                <Upload size={20} className="text-[#8BE0B0] mb-1" />
                <span className="text-xs font-bold text-[#F5F7F5]">Upload New Photo</span>
                <span className="text-[10px] text-[#A5B3AA]">PNG, JPG, or WEBP up to 10MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Step 2: Location & Duplicate Detection */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#273b33] pb-4">
            <h3 className="text-sm font-bold text-[#F5F7F5] flex items-center gap-2 font-heading">
              <MapPin size={18} className="text-[#8BE0B0]" />
              <span>Step 2: Location & GPS Geocoding</span>
            </h3>
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="px-3 py-1.5 rounded-xl bg-[#142820] text-[#8BE0B0] hover:bg-[#1D2B25] border border-[#273b33] text-xs font-bold transition flex items-center gap-1.5"
            >
              <MapPin size={13} className="text-[#16A36A]" />
              <span>{isLocating ? "Detecting GPS..." : "Auto-Detect My GPS"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#A5B3AA] uppercase tracking-wider block mb-1">
                Street Address / Landmark
              </label>
              <input
                type="text"
                required
                value={location.address}
                onChange={(e) => setLocation({ ...location, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#142820] border border-[#273b33] text-xs text-[#F5F7F5] focus:outline-none focus:border-[#16A36A]"
                placeholder="e.g. Near Gate 3, Sector 18 Commercial Complex"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#A5B3AA] uppercase tracking-wider block mb-1">
                Municipal Ward / Administrative Zone
              </label>
              <select
                value={location.ward}
                onChange={(e) => setLocation({ ...location, ward: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#142820] border border-[#273b33] text-xs text-[#F5F7F5] focus:outline-none focus:border-[#16A36A]"
              >
                <option value="Ward 7 - Civil Lines">Ward 7 - Civil Lines</option>
                <option value="Ward 2 - Parkside">Ward 2 - Parkside</option>
                <option value="Ward 12 - South Ridge">Ward 12 - South Ridge</option>
                <option value="Ward 4 - East Extension">Ward 4 - East Extension</option>
                <option value="Ward 15 - West Hub">Ward 15 - West Hub</option>
              </select>
            </div>
          </div>

          {/* REAL-TIME DUPLICATE DETECTION WARNING */}
          {nearbyDuplicates.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-xs text-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <AlertTriangle size={16} className="text-amber-400 shrink-0" />
                <span>
                  Proximity Alert: Potential Duplicate Incident Found ({nearbyDuplicates[0].distanceMeters}m away)
                </span>
              </div>
              <p className="leading-relaxed text-[11px] text-[#A5B3AA]">
                An active ticket (<strong>{nearbyDuplicates[0].report.id}</strong>) was already reported by a neighbor at this location. Submitting your photo will <strong>corroborate and upvote</strong> the incident, raising its municipal attention score (+20 EcoPoints rewarded).
              </p>
            </div>
          )}
        </div>

        {/* Step 3: 3-Color Category System & Observations */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#273b33] pb-4">
            <h3 className="text-sm font-bold text-[#F5F7F5] font-heading">
              Step 3: 3-Stream Waste Classification
            </h3>
            <span className="text-xs font-semibold text-[#8BE0B0]">
              Standardized Sorting Protocol
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* GREEN Stream */}
            <div
              onClick={() => setCategory("plastic")}
              className={`p-4 rounded-2xl border-2 transition cursor-pointer space-y-2 ${
                activeVisual.group === "recyclable"
                  ? "border-[#16A36A] bg-[#16A36A]/15 text-[#8BE0B0] shadow-md shadow-[#16A36A]/20"
                  : "border-[#273b33] bg-[#142820] text-[#A5B3AA] hover:border-[#16A36A]/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase font-mono">GREEN STREAM</span>
                <Recycle size={18} className="text-[#16A36A]" />
              </div>
              <div className="font-bold text-sm text-[#F5F7F5]">Recyclable Waste</div>
              <p className="text-[11px] text-[#A5B3AA]">Plastic bottles, paper, cardboard & metals</p>
            </div>

            {/* BLUE Stream */}
            <div
              onClick={() => setCategory("organic")}
              className={`p-4 rounded-2xl border-2 transition cursor-pointer space-y-2 ${
                activeVisual.group === "organic"
                  ? "border-[#3987F5] bg-[#3987F5]/15 text-[#90c2ff] shadow-md shadow-[#3987F5]/20"
                  : "border-[#273b33] bg-[#142820] text-[#A5B3AA] hover:border-[#3987F5]/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase font-mono">BLUE STREAM</span>
                <Apple size={18} className="text-[#3987F5]" />
              </div>
              <div className="font-bold text-sm text-[#F5F7F5]">Wet / Organic Waste</div>
              <p className="text-[11px] text-[#A5B3AA]">Food leftovers, fruit peels & garden matter</p>
            </div>

            {/* YELLOW Stream */}
            <div
              onClick={() => setCategory("mixed")}
              className={`p-4 rounded-2xl border-2 transition cursor-pointer space-y-2 ${
                activeVisual.group === "mixed"
                  ? "border-[#F4C542] bg-[#F4C542]/15 text-[#fce58d] shadow-md shadow-[#F4C542]/20"
                  : "border-[#273b33] bg-[#142820] text-[#A5B3AA] hover:border-[#F4C542]/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase font-mono">YELLOW STREAM</span>
                <Trash2 size={18} className="text-[#F4C542]" />
              </div>
              <div className="font-bold text-sm text-[#F5F7F5]">Mixed / Other Waste</div>
              <p className="text-[11px] text-[#A5B3AA]">Roadside debris, construction & unsegregated</p>
            </div>
          </div>

          <div className="pt-2">
            <label className="text-xs font-bold text-[#A5B3AA] uppercase tracking-wider block mb-1">
              Optional Description / Citizen Remarks
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Accumulating for 3 days, blocking market alleyway..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#142820] border border-[#273b33] focus:outline-none focus:border-[#16A36A] text-xs text-[#F5F7F5]"
            />
          </div>
        </div>

        {/* Submission Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigate("/citizen/dashboard")}
            className="px-5 py-2.5 text-xs font-bold text-[#A5B3AA] hover:text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 rounded-2xl bg-[#16A36A] text-white hover:bg-[#0f7a4e] text-sm font-bold shadow-lg shadow-[#16A36A]/30 hover:shadow-[#16A36A]/50 transition flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles size={16} />
            <span>{isSubmitting ? "Running AI WQI Inference..." : "Submit Waste Report"}</span>
          </button>
        </div>
      </form>

      {/* SUCCESS CONFIRMATION MODAL WITH ANIMATED DUSTBIN */}
      {submittedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#1D2B25] rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#273b33] text-[#F5F7F5]">
            {/* Modal Header */}
            <div className="bg-[#142820] text-white p-6 text-center space-y-3 border-b border-[#273b33]">
              {/* Animated Dustbin in Success State */}
              <div className="flex justify-center">
                <AnimatedDustbin
                  size="sm"
                  category={activeVisual.group === "recyclable" ? "green" : activeVisual.group === "organic" ? "blue" : "yellow"}
                  isSuccess={true}
                  forceOpen={true}
                  label="Waste Deposited & Cleared"
                />
              </div>

              <h3 className="text-xl font-extrabold font-heading text-[#F5F7F5]">Report Successfully Lodged!</h3>
              <p className="text-xs text-[#8BE0B0] font-mono">
                Incident ID: <strong>{submittedReport.id}</strong>
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* AI WQI Score Highlight */}
              <div className="p-4 rounded-2xl bg-[#142820] border border-[#273b33] text-center space-y-1">
                <span className="text-[11px] font-bold text-[#8BE0B0] uppercase tracking-widest font-mono">
                  AI Waste Quantity Index (WQI)
                </span>
                <div className="text-3xl font-black text-[#F5F7F5] font-stat">
                  {submittedReport.wqi.total} <span className="text-base font-normal text-[#A5B3AA]">/ 100</span>
                </div>
                <div className="inline-block px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#16A36A]/20 border border-[#16A36A] text-[#8BE0B0]">
                  {submittedReport.wqi.severityLevel} Severity Level
                </div>
              </div>

              {/* Breakdown chips */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-[#142820] rounded-xl border border-[#273b33]">
                  <div className="text-[#A5B3AA] text-[10px]">Estimated Volume</div>
                  <div className="font-bold text-[#F5F7F5] font-stat">{submittedReport.wqi.estimatedVolumeM3 || 2.4} m³</div>
                </div>
                <div className="p-2.5 bg-[#142820] rounded-xl border border-[#273b33]">
                  <div className="text-[#A5B3AA] text-[10px]">Recommended Vehicle</div>
                  <div className="font-bold text-[#8BE0B0]">{submittedReport.wqi.recommendedVehicle}</div>
                </div>
              </div>

              <p className="text-xs text-[#A5B3AA] leading-relaxed text-center">
                Your report has been forwarded to the <strong className="text-[#F5F7F5]">Municipal Command Centre</strong> for immediate vehicle allocation.
              </p>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => navigate(`/citizen/track?id=${submittedReport.id}`)}
                  className="w-full py-3 rounded-xl bg-[#16A36A] text-white text-xs font-bold hover:bg-[#0f7a4e] transition flex items-center justify-center gap-2 shadow-md shadow-[#16A36A]/30"
                >
                  <span>Track Collection Status Live</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/citizen/my-reports")}
                  className="w-full py-2.5 rounded-xl bg-[#142820] text-[#A5B3AA] hover:text-white text-xs font-bold hover:bg-[#273b33] transition"
                >
                  Back to My Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
