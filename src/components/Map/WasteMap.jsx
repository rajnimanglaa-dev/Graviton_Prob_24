import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DEFAULT_MAP_CENTER } from "../../services/geoService.js";
import { getWasteVisualCategory } from "../../services/wasteCategoryTheme.js";
import { Filter, Layers, Navigation, Truck, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";

// Priority accent colors
const PRIORITY_COLORS = {
  critical: "#EF4444", // Red-500
  high: "#F97316",     // Orange-500
  medium: "#F59E0B",   // Amber-500
  low: "#10B981",      // Emerald-500
  resolved: "#16A36A"  // Primary Green
};

// Custom DivIcon generator using the 3-Color Categorization System + Priority Pulse
function createReportIcon(report) {
  const isResolved = report.status === "resolved";
  const visualCat = getWasteVisualCategory(report.category);
  const color = isResolved ? "#16A36A" : visualCat.color;
  const isCritical = report.priority === "critical" && !isResolved;

  const iconHtml = `
    <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
      ${
        isCritical
          ? `<div style="
              position: absolute;
              inset: -6px;
              border-radius: 50%;
              background-color: ${color};
              opacity: 0.35;
              animation: gentlePulse 2s infinite;
            "></div>`
          : ""
      }
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background-color: ${color};
        color: white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 14px rgba(0,0,0,0.6);
        border: 2px solid #F5F7F5;
        cursor: pointer;
        transition: transform 0.2s ease;
      ">
        <div style="transform: rotate(45deg); font-size: 13px; font-weight: 800; display: flex; align-items: center; justify-content: center; font-family: sans-serif;">
          ${isResolved ? "✓" : "!"}
        </div>
      </div>
    </div>
  `;

  return L.divIcon({
    className: "custom-waste-marker",
    html: iconHtml,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -32]
  });
}

// Custom DivIcon for municipal trucks in dark theme
function createVehicleIcon(vehicle) {
  const isAvailable = vehicle.status === "available";
  const color = isAvailable ? "#16A36A" : "#3987F5";

  const iconHtml = `
    <div style="
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background-color: #101A17;
      color: ${color};
      border-radius: 50%;
      box-shadow: 0 4px 14px rgba(0,0,0,0.7);
      border: 2px solid ${color};
      cursor: pointer;
    ">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
        <path d="M15 18H9"></path>
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14v10Z"></path>
        <circle cx="17" cy="18" r="2"></circle>
        <circle cx="7" cy="18" r="2"></circle>
      </svg>
    </div>
  `;

  return L.divIcon({
    className: "custom-vehicle-marker",
    html: iconHtml,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
}

export default function WasteMap({
  reports = [],
  vehicles = [],
  height = "520px",
  onSelectReport = null,
  showControls = true,
  interactiveClick = false,
  onMapClick = null
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const vehiclesLayerRef = useRef(null);
  const heatmapLayerRef = useRef(null);

  // Filters state
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showVehicles, setShowVehicles] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize Map with CartoDB Dark Matter tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng],
      zoom: DEFAULT_MAP_CENTER.zoom,
      zoomControl: true,
      attributionControl: true
    });

    // OpenStreetMap raster tiles keep the map available without a provider API key.
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      subdomains: "abc",
      maxZoom: 19
    }).addTo(map);

    markersLayerRef.current = L.featureGroup().addTo(map);
    vehiclesLayerRef.current = L.featureGroup().addTo(map);
    heatmapLayerRef.current = L.featureGroup().addTo(map);

    if (onMapClick) {
      map.on("click", (e) => {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers when reports, vehicles, or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    vehiclesLayerRef.current.clearLayers();
    heatmapLayerRef.current.clearLayers();

    // 1. Filter reports
    const filteredReports = reports.filter(r => {
      if (filterPriority !== "all" && r.priority !== filterPriority) return false;
      if (filterStatus !== "all" && r.status !== filterStatus) return false;
      if (filterCategory !== "all") {
        const visual = getWasteVisualCategory(r.category);
        if (visual.group !== filterCategory && r.category !== filterCategory) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = (r.title || "").toLowerCase().includes(q);
        const addrMatch = (r.location?.address || "").toLowerCase().includes(q);
        const wardMatch = (r.location?.ward || "").toLowerCase().includes(q);
        if (!titleMatch && !addrMatch && !wardMatch) return false;
      }
      return true;
    });

    // 2. Add Report Markers
    filteredReports.forEach(report => {
      if (!report.location || !report.location.lat || !report.location.lng) return;

      const visualCat = getWasteVisualCategory(report.category);
      const marker = L.marker([report.location.lat, report.location.lng], {
        icon: createReportIcon(report)
      });

      const popupContent = `
        <div style="font-family: 'Inter', system-ui, sans-serif; min-width: 250px; max-width: 300px; padding: 14px; color: #F5F7F5; background: #1D2B25;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 11px; font-weight: 800; color: #8BE0B0; font-family: monospace;">${report.id}</span>
            <span style="
              font-size: 10px;
              font-weight: 800;
              padding: 2px 8px;
              border-radius: 999px;
              background-color: ${report.priority === "critical" ? "#7f1d1d" : report.priority === "high" ? "#7c2d12" : "#78350f"};
              color: ${report.priority === "critical" ? "#fca5a5" : report.priority === "high" ? "#fdba74" : "#fcd34d"};
              border: 1px solid ${report.priority === "critical" ? "#ef4444" : "#f97316"};
              text-transform: uppercase;
            ">
              ${report.priority}
            </span>
          </div>

          <h4 style="font-size: 13px; font-weight: 700; margin: 0 0 6px 0; line-height: 1.3; color: #F5F7F5;">${report.title}</h4>

          <div style="display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px; border-radius: 6px; background: rgba(0,0,0,0.3); border: 1px solid ${visualCat.color}; margin-bottom: 8px;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${visualCat.color};"></span>
            <span style="font-size: 11px; font-weight: 700; color: ${visualCat.mint};">${visualCat.badgeLabel}</span>
          </div>

          <div style="display: flex; gap: 8px; font-size: 11px; color: #A5B3AA; margin-bottom: 8px;">
            <div><strong>WQI:</strong> <span style="color: #8BE0B0; font-weight: bold;">${report.wqi?.total || 75}</span>/100</div>
            <div>•</div>
            <div><strong>Status:</strong> <span style="color: #F5F7F5; text-transform: capitalize;">${report.status}</span></div>
          </div>

          <p style="font-size: 11px; color: #A5B3AA; margin: 0 0 8px 0; line-height: 1.3;">
            📍 ${report.location?.address || "City Location"}
          </p>

          ${report.imageUrl ? `
            <img src="${report.imageUrl}" alt="${report.title}" style="width: 100%; height: 95px; object-fit: cover; border-radius: 8px; margin-bottom: 8px; border: 1px solid #273b33;" />
          ` : ""}

          ${report.duplicateInfo?.corroborationCount > 1 ? `
            <div style="font-size: 10px; color: #8BE0B0; background: #142820; border: 1px solid #273b33; padding: 4px 8px; border-radius: 6px; margin-bottom: 8px; font-weight: 600;">
              👥 Corroborated by ${report.duplicateInfo.corroborationCount} citizen reports
            </div>
          ` : ""}

          <div style="font-size: 11px; font-weight: 600; color: #8BE0B0;">
            Estimated: ${report.wqi?.estimatedVolumeM3 || 2.4} m³ (${report.category})
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on("click", () => {
        if (onSelectReport) onSelectReport(report);
      });

      markersLayerRef.current.addLayer(marker);

      // Density buffer in heatmap mode
      if (showHeatmap && report.status !== "resolved") {
        const radius = (report.wqi?.total || 50) * 4.5;
        const circle = L.circle([report.location.lat, report.location.lng], {
          radius: radius,
          fillColor: visualCat.color,
          fillOpacity: 0.25,
          stroke: true,
          color: visualCat.color,
          weight: 1.5,
          opacity: 0.6
        });
        heatmapLayerRef.current.addLayer(circle);
      }
    });

    // 3. Add Vehicles
    if (showVehicles && vehicles && vehicles.length > 0) {
      vehicles.forEach(vehicle => {
        if (!vehicle.location) return;

        const vMarker = L.marker([vehicle.location.lat, vehicle.location.lng], {
          icon: createVehicleIcon(vehicle)
        });

        const vPopup = `
          <div style="font-family: 'Inter', system-ui, sans-serif; min-width: 200px; padding: 12px; color: #F5F7F5; background: #1D2B25;">
            <div style="font-size: 10px; font-weight: 800; color: #8BE0B0; text-transform: uppercase; margin-bottom: 2px;">Municipal Fleet</div>
            <h4 style="font-size: 13px; font-weight: 700; margin: 0 0 4px 0; color: #F5F7F5;">${vehicle.name}</h4>
            <div style="font-size: 11px; color: #A5B3AA; margin-bottom: 6px;">
              Driver: <strong>${vehicle.driverName}</strong>
            </div>
            <div style="font-size: 11px; color: #A5B3AA;">
              Status: <span style="color: ${vehicle.status === "available" ? "#16A36A" : "#3987F5"}; font-weight: bold; text-transform: uppercase;">${vehicle.status.replace("_", " ")}</span>
            </div>
            <div style="font-size: 11px; color: #A5B3AA; margin-top: 4px;">
              Load: ${vehicle.currentLoadKg} / ${vehicle.capacityKg} kg
            </div>
          </div>
        `;
        vMarker.bindPopup(vPopup);
        vehiclesLayerRef.current.addLayer(vMarker);
      });
    }
  }, [reports, vehicles, filterPriority, filterStatus, filterCategory, showVehicles, showHeatmap, searchQuery]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#273b33] shadow-2xl bg-[#142820]">
      {/* Dark Filter & Control Bar */}
      {showControls && (
        <div className="p-3.5 bg-[#142820]/95 backdrop-blur-md border-b border-[#273b33] flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Search */}
          <div className="flex-1 min-w-[200px] max-w-xs">
            <input
              type="text"
              placeholder="Search ward or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-[#1D2B25] border border-[#273b33] text-[#F5F7F5] placeholder-[#A5B3AA]/60 text-xs focus:outline-none focus:border-[#16A36A]"
            />
          </div>

          {/* 3-Color Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[#A5B3AA] font-semibold text-[11px] hidden sm:inline">Waste Type:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              aria-label="Filter waste category"
              className="px-2.5 py-1.5 rounded-xl bg-[#1D2B25] border border-[#273b33] text-[#F5F7F5] text-xs font-medium focus:outline-none focus:border-[#16A36A]"
            >
              <option value="all">All Waste Streams</option>
              <option value="recyclable">🟢 Recyclable (Green)</option>
              <option value="organic">🔵 Wet / Organic (Blue)</option>
              <option value="mixed">🟡 Mixed / Other (Yellow)</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              aria-label="Filter waste priority"
              className="px-2.5 py-1.5 rounded-xl bg-[#1D2B25] border border-[#273b33] text-[#F5F7F5] text-xs font-medium focus:outline-none focus:border-[#16A36A]"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical Urgency</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {/* Toggle Layers */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVehicles(!showVehicles)}
              className={`px-2.5 py-1.5 rounded-xl border font-bold text-[11px] transition flex items-center gap-1 ${
                showVehicles
                  ? "bg-[#1D2B25] border-[#16A36A] text-[#8BE0B0]"
                  : "bg-[#1D2B25] border-[#273b33] text-[#A5B3AA]"
              }`}
            >
              <Truck size={13} />
              <span>Fleet ({vehicles.length})</span>
            </button>

            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-2.5 py-1.5 rounded-xl border font-bold text-[11px] transition flex items-center gap-1 ${
                showHeatmap
                  ? "bg-[#1D2B25] border-[#F4C542] text-[#F4C542]"
                  : "bg-[#1D2B25] border-[#273b33] text-[#A5B3AA]"
              }`}
            >
              <Layers size={13} />
              <span>Hotspot Density</span>
            </button>
          </div>
        </div>
      )}

      {/* Map Canvas */}
      <div ref={mapContainerRef} style={{ height }} className="w-full relative z-10" />

      {/* 3-Color Map Legend Footer */}
      <div className="px-4 py-2 bg-[#101A17] border-t border-[#273b33] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#A5B3AA]">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-bold text-[#F5F7F5] font-heading">Categorization System:</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A36A]" />
            <strong className="text-[#8BE0B0]">Green:</strong> Recyclable Waste
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3987F5]" />
            <strong className="text-[#90c2ff]">Blue:</strong> Wet / Organic Waste
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F4C542]" />
            <strong className="text-[#fce58d]">Yellow:</strong> Mixed / Other Waste
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Pulsing Pin: Critical Priority</span>
          </span>
        </div>
      </div>
    </div>
  );
}
