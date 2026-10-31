import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import { SAMPLE_IMAGES } from "../../services/mockData.js";
import { findNearbyDuplicates, DEFAULT_MAP_CENTER } from "../../services/geoService.js";
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
  Info
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
          // Fallback to demo city coordinates
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

    // Simulate AI scanning animation delay
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

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#174C37] uppercase tracking-wider">
            Citizen Grievance Redressal
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#202923] tracking-tight mt-1">
          Report Illegal Garbage Dumping
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Upload a clear photograph. Our computer vision engine will calculate the Waste Quantity Index (WQI) and automatically schedule municipal fleet dispatch.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Photo Upload & Preview */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
              <Camera size={18} className="text-[#174C37]" />
              <span>Step 1: Garbage Photograph</span>
            </h3>
            <span className="text-[11px] text-stone-400 font-semibold">Mandatory Evidence</span>
          </div>

          {/* Quick Preset Selector for Easy Testing */}
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
              Quick Test Presets (Click to preview different waste classes):
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPresetPhoto("plastic", SAMPLE_IMAGES.plastic, "plastic")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  photoPreview === SAMPLE_IMAGES.plastic
                    ? "bg-[#174C37] text-white border-[#174C37]"
                    : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                }`}
              >
                Plastic Waste Pile
              </button>
              <button
                type="button"
                onClick={() => setPresetPhoto("dumpster", SAMPLE_IMAGES.dumpster, "mixed")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  photoPreview === SAMPLE_IMAGES.dumpster
                    ? "bg-[#174C37] text-white border-[#174C37]"
                    : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                }`}
              >
                Overflowing Dumpster
              </button>
              <button
                type="button"
                onClick={() => setPresetPhoto("construction", SAMPLE_IMAGES.construction, "construction")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  photoPreview === SAMPLE_IMAGES.construction
                    ? "bg-[#174C37] text-white border-[#174C37]"
                    : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                }`}
              >
                Construction Debris
              </button>
              <button
                type="button"
                onClick={() => setPresetPhoto("organic", SAMPLE_IMAGES.organic, "organic")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  photoPreview === SAMPLE_IMAGES.organic
                    ? "bg-[#174C37] text-white border-[#174C37]"
                    : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                }`}
              >
                Organic Market Refuse
              </button>
            </div>
          </div>

          {/* Photo Preview Canvas */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-7">
              <div className="relative rounded-2xl overflow-hidden border-2 border-stone-200 bg-stone-100 h-64 sm:h-72">
                {photoPreview ? (
                  <>
                    <img
                      src={photoPreview}
                      alt="Garbage preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#174C37]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1.5">
                      <Sparkles size={12} className="text-emerald-300" />
                      <span>Ready for AI Neural Inference</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                    <Camera size={36} />
                    <span className="text-xs mt-2">No image selected</span>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Area */}
            <div className="sm:col-span-5 space-y-3">
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-stone-300 hover:border-[#174C37] rounded-2xl cursor-pointer bg-stone-50/50 hover:bg-emerald-50/20 transition text-center">
                <Upload size={24} className="text-stone-400 mb-2" />
                <span className="text-xs font-bold text-stone-700">Upload Camera Snapshot</span>
                <span className="text-[11px] text-stone-400 mt-0.5">PNG, JPG, or WEBP up to 10MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="text-[11px] text-stone-500 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-200">
                💡 <strong>Tip:</strong> Ensure high contrast and clear visibility of the waste pile boundary for higher AI confidence scores.
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Location & Duplicate Detection */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
              <MapPin size={18} className="text-[#174C37]" />
              <span>Step 2: Location & GPS Geocoding</span>
            </h3>
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="px-3 py-1.5 rounded-lg bg-emerald-100 text-[#174C37] hover:bg-emerald-200 text-xs font-bold transition flex items-center gap-1.5"
            >
              <MapPin size={13} />
              <span>{isLocating ? "Detecting GPS..." : "Auto-Detect My GPS"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                Street Address / Landmark
              </label>
              <input
                type="text"
                required
                value={location.address}
                onChange={(e) => setLocation({ ...location, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#174C37] text-xs text-stone-800"
                placeholder="e.g. Near Gate 3, Sector 18 Commercial Complex"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                Municipal Ward / Administrative Zone
              </label>
              <select
                value={location.ward}
                onChange={(e) => setLocation({ ...location, ward: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#174C37] text-xs text-stone-800 bg-white"
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
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-xs text-amber-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                <span>
                  Proximity Alert: Potential Duplicate Incident Found ({nearbyDuplicates[0].distanceMeters}m away)
                </span>
              </div>
              <p className="leading-relaxed text-[11px] text-amber-900/90">
                An active ticket (<strong>{nearbyDuplicates[0].report.id}</strong>) was already reported by a neighbor at this location. Submitting your photo will <strong>corroborate and upvote</strong> the incident, raising its municipal attention score (+20 EcoPoints rewarded).
              </p>
            </div>
          )}
        </div>

        {/* Step 3: Category & Optional Notes */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-stone-800">
            Step 3: Waste Category & Observations
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { id: "household", label: "Household Waste", icon: "🏠" },
              { id: "plastic", label: "Plastic Waste", icon: "🧴" },
              { id: "construction", label: "Construction Debris", icon: "🧱" },
              { id: "organic", label: "Organic / Food", icon: "🍏" },
              { id: "mixed", label: "Mixed Garbage", icon: "🗑️" },
              { id: "other", label: "Other / Unsorted", icon: "📦" }
            ].map(cat => (
              <div
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`p-3 rounded-xl border-2 transition cursor-pointer flex items-center gap-2.5 ${
                  category === cat.id
                    ? "border-[#174C37] bg-emerald-50/50 text-[#174C37] font-bold"
                    : "border-stone-200 hover:border-stone-300 text-stone-700"
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="text-xs">{cat.label}</span>
              </div>
            ))}
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
              Optional Description / Citizen Remarks
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Accumulating for 3 days, blocking market alleyway..."
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#174C37] text-xs text-stone-800"
            />
          </div>
        </div>

        {/* Submission Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigate("/citizen/dashboard")}
            className="px-5 py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 rounded-2xl bg-[#174C37] text-white hover:bg-[#0f3325] text-sm font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles size={16} />
            <span>{isSubmitting ? "Running AI WQI Inference..." : "Submit Waste Report"}</span>
          </button>
        </div>
      </form>

      {/* SUCCESS CONFIRMATION MODAL WITH WQI BREAKDOWN */}
      {submittedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200">
            {/* Modal Header */}
            <div className="bg-[#174C37] text-white p-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-300 mx-auto flex items-center justify-center border-2 border-emerald-400">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-xl font-extrabold">Report Successfully Lodged!</h3>
              <p className="text-xs text-emerald-200">
                Incident ID: <strong className="text-white font-mono">{submittedReport.id}</strong>
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* AI WQI Score Highlight */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-widest">
                  AI Waste Quantity Index (WQI)
                </span>
                <div className="text-3xl font-black text-[#174C37]">
                  {submittedReport.wqi.total} <span className="text-base font-normal text-stone-500">/ 100</span>
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-200 text-emerald-900">
                  {submittedReport.wqi.severityLevel} Severity Level
                </div>
              </div>

              {/* Breakdown chips */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="text-stone-400 text-[10px]">Estimated Volume</div>
                  <div className="font-bold text-stone-800">{submittedReport.wqi.estimatedVolumeM3 || 2.4} m³</div>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="text-stone-400 text-[10px]">Recommended Vehicle</div>
                  <div className="font-bold text-stone-800">{submittedReport.wqi.recommendedVehicle}</div>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed text-center">
                Your report has been forwarded to the <strong>Municipal Command Centre</strong> for immediate vehicle allocation.
              </p>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => navigate(`/citizen/track?id=${submittedReport.id}`)}
                  className="w-full py-3 rounded-xl bg-[#174C37] text-white text-xs font-bold hover:bg-[#0f3325] transition flex items-center justify-center gap-2"
                >
                  <span>Track Collection Status Live</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/citizen/my-reports")}
                  className="w-full py-2.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold hover:bg-stone-200 transition"
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
