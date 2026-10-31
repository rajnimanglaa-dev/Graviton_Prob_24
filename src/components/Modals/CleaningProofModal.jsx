import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { SAMPLE_IMAGES } from "../../services/mockData.js";
import { Camera, Upload, CheckCircle2, X, AlertTriangle, Sparkles, Image as ImageIcon } from "lucide-react";

export default function CleaningProofModal({ report, isOpen, onClose }) {
  const { updateDriverTaskStatus } = useApp();
  const [cleaningPhoto, setCleaningPhoto] = useState(SAMPLE_IMAGES.cleaned);
  const [notes, setNotes] = useState("Waste fully loaded into compactor unit. Ground swept clean and sanitized.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customFileSelected, setCustomFileSelected] = useState(false);

  if (!isOpen || !report) return null;

  // Handle local file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCleaningPhoto(reader.result);
        setCustomFileSelected(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProof = () => {
    if (!cleaningPhoto) return;

    setIsSubmitting(true);
    setTimeout(() => {
      // Mark as collected with proof photo
      updateDriverTaskStatus(report.id, "collected", {
        afterImageUrl: cleaningPhoto,
        note: notes
      });
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="bg-[#174C37] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Camera size={22} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Upload Proof of Cleaning</h3>
              <p className="text-xs text-white/80">
                Mandatory verification photo for Report {report.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Side-by-Side Comparison: Before vs After Preview */}
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
              Before vs After Verification
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Before Photo */}
              <div className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                <div className="relative h-36">
                  <img
                    src={report.imageUrl}
                    alt="Before cleaning"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    BEFORE REPORT
                  </span>
                </div>
                <div className="p-2 text-[11px] text-stone-500 font-medium">
                  {report.category.toUpperCase()} • {report.wqi?.estimatedVolumeM3 || 2.4} m³
                </div>
              </div>

              {/* After Photo Preview */}
              <div className="border-2 border-emerald-500 rounded-xl overflow-hidden bg-emerald-50/30">
                <div className="relative h-36">
                  {cleaningPhoto ? (
                    <img
                      src={cleaningPhoto}
                      alt="After cleaning proof"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                      <Camera size={28} />
                      <span className="text-xs mt-1">No photo yet</span>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    AFTER CLEANING
                  </span>
                </div>
                <div className="p-2 text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  <span>Proof Attached</span>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Selection / Upload Controls */}
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
              Select or Capture Photograph
            </label>

            <div className="flex flex-wrap gap-2 mb-3">
              <button
                type="button"
                onClick={() => setCleaningPhoto(SAMPLE_IMAGES.cleaned)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  cleaningPhoto === SAMPLE_IMAGES.cleaned
                    ? "bg-[#174C37] text-white border-[#174C37]"
                    : "bg-white border-stone-300 text-stone-700 hover:bg-stone-50"
                }`}
              >
                Sample Clean Street Photo
              </button>
              <button
                type="button"
                onClick={() => setCleaningPhoto(SAMPLE_IMAGES.cleanedPark)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  cleaningPhoto === SAMPLE_IMAGES.cleanedPark
                    ? "bg-[#174C37] text-white border-[#174C37]"
                    : "bg-white border-stone-300 text-stone-700 hover:bg-stone-50"
                }`}
              >
                Sample Clean Park Photo
              </button>
            </div>

            {/* File Upload Input */}
            <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-stone-300 rounded-xl cursor-pointer hover:border-[#174C37] hover:bg-emerald-50/20 transition text-stone-600 text-xs font-medium">
              <Upload size={16} />
              <span>Or click to upload camera snapshot from device</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Driver Notes */}
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
              Driver Clearance Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#174C37] text-xs text-stone-800"
              placeholder="e.g., Waste loaded completely, sidewalk sanitized..."
            />
          </div>

          {/* Verification Assurance */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p>
              Submitting proof updates the status to <strong>COLLECTED</strong> in real time for Municipal Admin and alerts the reporting citizen.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmitProof}
            disabled={!cleaningPhoto || isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-[#174C37] text-white text-xs font-bold hover:bg-[#0f3325] shadow-sm transition flex items-center gap-2 disabled:opacity-50"
          >
            <CheckCircle2 size={16} />
            <span>{isSubmitting ? "Verifying..." : "Verify & Complete Collection"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
