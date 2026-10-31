import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { SAMPLE_IMAGES } from "../../services/mockData.js";
import { getWasteVisualCategory } from "../../services/wasteCategoryTheme.js";
import { Camera, Upload, CheckCircle2, X, AlertTriangle, Sparkles, Image as ImageIcon } from "lucide-react";

export default function CleaningProofModal({ report, isOpen, onClose }) {
  const { updateDriverTaskStatus } = useApp();
  const [cleaningPhoto, setCleaningPhoto] = useState(SAMPLE_IMAGES.cleaned);
  const [notes, setNotes] = useState("Waste fully loaded into compactor unit. Ground swept clean and sanitized.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customFileSelected, setCustomFileSelected] = useState(false);
  const [submitError, setSubmitError] = useState("");

  if (!isOpen || !report) return null;

  const visualCat = getWasteVisualCategory(report.category);

  // Handle local file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError("Photo must be 5 MB or smaller.");
        e.target.value = "";
        return;
      }
      setSubmitError("");
      const reader = new FileReader();
      reader.onload = () => {
        setCleaningPhoto(reader.result);
        setCustomFileSelected(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProof = async () => {
    if (!cleaningPhoto) return;
    setSubmitError("");
    setIsSubmitting(true);
    try {
      await updateDriverTaskStatus(report.id, "collected", {
        afterImageUrl: cleaningPhoto,
        note: notes
      });
      onClose();
    } catch (error) {
      setSubmitError(error.userMessage || error.message || "Could not save cleaning proof. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn text-[#F5F7F5]">
      <div className="bg-[#1D2B25] rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-[#273b33]">
        {/* Header */}
        <div className="bg-[#142820] text-white p-5 flex items-center justify-between border-b border-[#273b33]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#16A36A]/20 border border-[#16A36A]/40 flex items-center justify-center">
              <Camera size={22} className="text-[#8BE0B0]" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading">Upload Proof of Cleaning</h3>
              <p className="text-xs text-[#A5B3AA]">
                Mandatory verification photo for Report {report.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-[#A5B3AA] hover:bg-[#1D2B25] hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Side-by-Side Comparison: Before vs After Preview */}
          <div>
            <label className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider block mb-2 font-mono">
              Before vs After Verification
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Before Photo */}
              <div className="border border-[#273b33] rounded-2xl overflow-hidden bg-[#142820]">
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
                <div className="p-2 text-[11px] text-[#A5B3AA] font-medium flex items-center justify-between">
                  <span style={{ color: visualCat.mint }}>{visualCat.name}</span>
                  <span className="font-stat">{report.wqi?.estimatedVolumeM3 || 2.4} m³</span>
                </div>
              </div>

              {/* After Photo Preview */}
              <div className="border-2 border-[#16A36A] rounded-2xl overflow-hidden bg-[#16A36A]/10">
                <div className="relative h-36">
                  {cleaningPhoto ? (
                    <img
                      src={cleaningPhoto}
                      alt="After cleaning proof"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#A5B3AA]">
                      <Camera size={28} />
                      <span className="text-xs mt-1">No photo yet</span>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-[#16A36A] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    AFTER CLEANING
                  </span>
                </div>
                <div className="p-2 text-[11px] text-[#8BE0B0] font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  <span>Proof Attached</span>
                </div>
              </div>
            </div>
          </div>

          {submitError && <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">{submitError}</p>}

          {/* Photo Selection / Upload Controls */}
          <div>
            <label className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider block mb-2 font-mono">
              Select or Capture Photograph
            </label>

            <div className="flex flex-wrap gap-2 mb-3">
              <button
                type="button"
                onClick={() => setCleaningPhoto(SAMPLE_IMAGES.cleaned)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  cleaningPhoto === SAMPLE_IMAGES.cleaned
                    ? "bg-[#16A36A] text-white border-[#16A36A]"
                    : "bg-[#142820] border-[#273b33] text-[#A5B3AA] hover:text-white"
                }`}
              >
                Sample Clean Street Photo
              </button>
              <button
                type="button"
                onClick={() => setCleaningPhoto(SAMPLE_IMAGES.cleanedPark)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  cleaningPhoto === SAMPLE_IMAGES.cleanedPark
                    ? "bg-[#16A36A] text-white border-[#16A36A]"
                    : "bg-[#142820] border-[#273b33] text-[#A5B3AA] hover:text-white"
                }`}
              >
                Sample Clean Park Photo
              </button>
            </div>

            {/* File Upload Input */}
            <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-[#273b33] rounded-2xl cursor-pointer hover:border-[#16A36A] hover:bg-[#142820] transition text-[#A5B3AA] text-xs font-medium">
              <Upload size={16} className="text-[#8BE0B0]" />
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
            <label className="text-xs font-bold text-[#A5B3AA] uppercase tracking-wider block mb-1">
              Driver Clearance Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#142820] border border-[#273b33] focus:outline-none focus:border-[#16A36A] text-xs text-[#F5F7F5]"
              placeholder="e.g., Waste loaded completely, sidewalk sanitized..."
            />
          </div>

          {/* Verification Assurance */}
          <div className="p-3 bg-[#142820] rounded-2xl border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2.5">
            <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <p>
              Submitting proof updates the status to <strong className="text-[#8BE0B0]">COLLECTED</strong> in real time for Municipal Admin and alerts the reporting citizen.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#142820] border-t border-[#273b33] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#A5B3AA] hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmitProof}
            disabled={!cleaningPhoto || isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-[#16A36A] text-white text-xs font-bold hover:bg-[#0f7a4e] shadow-md shadow-[#16A36A]/30 transition flex items-center gap-2 disabled:opacity-50"
          >
            <CheckCircle2 size={16} />
            <span>{isSubmitting ? "Verifying..." : "Verify & Complete Collection"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
