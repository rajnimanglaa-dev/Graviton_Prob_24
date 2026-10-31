import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DEFAULT_MAP_CENTER } from "../../services/geoService.js";
import { Filter, Layers, Navigation, Truck, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

// Priority marker icon colors
const PRIORITY_COLORS = {
  critical: "#DC2626", // Red-600
  high: "#EA580C",     // Orange-600
  medium: "#D97706",   // Amber-600
  low: "#16A34A",      // Green-600
  resolved: "#174C37"  // Forest Green
};

// Custom DivIcon generator for waste reports
function createReportIcon(priority, status) {
  const isResolved = status === "resolved";
  const color = isResolved ? PRIORITY_COLORS.resolved : (PRIORITY_COLORS[priority] || "#D97706");
  
  const iconHtml = `
    <div style="
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      background-color: ${color};
      color: white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 10px rgba(0,0,0,0.35);
      border: 2px solid white;
      cursor: pointer;
    ">
      <div style="transform: rotate(45deg); font-size: 14px; font-weight: bold; display: flex; align-items: center; justify-content: center;">
        ${isResolved ? "✓" : "!"}
      </div>
    </div>
  `;

  return L.divIcon({
    className: "custom-waste-marker",
    html: iconHtml,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32]
  });
}

// Custom DivIcon for municipal trucks
function createVehicleIcon(vehicle) {
  const isAvailable = vehicle.status === "available";
  const color = isAvailable ? "#174C37" : "#0284C7"; // Forest Green or Sky Blue

  const iconHtml = `
    <div style="
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background-color: ${color};
      color: white;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      border: 2px solid white;
      cursor: pointer;
    ">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    const map = L.map(mapContainerRef.current, {
      center: [DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng],
      zoom: DEFAULT_MAP_CENTER.zoom,
      zoomControl: true,
      attributionControl: true
    });

    // Clean OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: 'Map data (c) OpenStreetMap contributors | SmartWaste GIS',
      maxZoom: 19
    }).addTo(map);

    // Initialize feature groups
    markersLayerRef.current = L.featureGroup().addTo(map);
    vehiclesLayerRef.current = L.featureGroup().addTo(map);
    heatmapLayerRef.current = L.featureGroup().addTo(map);

    // Click handler for map if enabled
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
      if (filterCategory !== "all" && r.category !== filterCategory) return false;
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

      const marker = L.marker([report.location.lat, report.location.lng], {
        icon: createReportIcon(report.priority, report.status)
      });

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; min-width: 230px; max-width: 280px; padding: 12px; color: #202923;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 700; color: #526056; text-transform: uppercase;">${report.id}</span>
            <span style="
              font-size: 10px;
              font-weight: 700;
              padding: 2px 8px;
              border-radius: 999px;
              background-color: ${report.priority === "critical" ? "#FEE2E2" : report.priority === "high" ? "#FFEDD5" : "#FEF3C7"};
              color: ${report.priority === "critical" ? "#DC2626" : report.priority === "high" ? "#EA580C" : "#D97706"};
              text-transform: uppercase;
            ">
              ${report.priority}
            </span>
          </div>

          <h4 style="font-size: 13px; font-weight: 700; margin: 0 0 6px 0; line-height: 1.3;">${report.title}</h4>

          <div style="display: flex; gap: 8px; font-size: 11px; color: #526056; margin-bottom: 8px;">
            <div><strong>WQI:</strong> ${report.wqi?.total || 75}/100</div>
            <div>•</div>
            <div><strong>Status:</strong> ${report.status}</div>
          </div>

          <p style="font-size: 11px; color: #64748b; margin: 0 0 8px 0; line-height: 1.3;">
            📍 ${report.location?.address || "City Location"}
          </p>

          ${report.imageUrl ? `
            <img src="${report.imageUrl}" alt="${report.title}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 6px; margin-bottom: 8px;" />
          ` : ""}

          ${report.duplicateInfo?.corroborationCount > 1 ? `
            <div style="font-size: 10px; color: #174C37; background: #e8f0eb; padding: 4px 6px; border-radius: 4px; margin-bottom: 8px; font-weight: 600;">
              👥 Reported by ${report.duplicateInfo.corroborationCount} citizens
            </div>
          ` : ""}

          <div style="font-size: 11px; font-weight: 600; color: #174C37;">
            Estimated: ${report.wqi?.estimatedVolumeM3 || 2.4} m³ (${report.category})
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on("click", () => {
        if (onSelectReport) onSelectReport(report);
      });

      markersLayerRef.current.addLayer(marker);

      // If Heatmap layer is active, draw density circular buffers
      if (showHeatmap && report.status !== "resolved") {
        const radius = (report.wqi?.total || 50) * 4.5;
        const color = report.priority === "critical" ? "#DC2626" : report.priority === "high" ? "#EA580C" : "#D97706";
        const circle = L.circle([report.location.lat, report.location.lng], {
          radius: radius,
          fillColor: color,
          fillOpacity: 0.28,
          stroke: true,
          color: color,
          weight: 1.5,
          opacity: 0.6
        });
        heatmapLayerRef.current.addLayer(circle);
      }
    });

    // 3. Add Vehicles if toggled on
    if (showVehicles && vehicles && vehicles.length > 0) {
      vehicles.forEach(vehicle => {
        if (!vehicle.location) return;

        const vMarker = L.marker([vehicle.location.lat, vehicle.location.lng], {
          icon: createVehicleIcon(vehicle)
        });

        const vPopupContent = `
          <div style="font-family: system-ui, sans-serif; min-width: 220px; padding: 10px; color: #202923;">
            <div style="font-size: 11px; font-weight: 700; color: #174C37; text-transform: uppercase; margin-bottom: 4px;">
              🚛 ${vehicle.id} • ${vehicle.type}
            </div>
            <h4 style="font-size: 13px; font-weight: 700; margin: 0 0 6px 0;">${vehicle.name}</h4>
            <div style="font-size: 11px; color: #526056; margin-bottom: 4px;">
              <strong>Driver:</strong> ${vehicle.driverName} (${vehicle.driverPhone})
            </div>
            <div style="font-size: 11px; color: #526056; margin-bottom: 4px;">
              <strong>Capacity:</strong> ${vehicle.capacityKg - vehicle.currentLoadKg} kg free of ${vehicle.capacityKg} kg
            </div>
            <div style="font-size: 11px; color: #526056; margin-bottom: 6px;">
              <strong>Status:</strong> <span style="font-weight: 600; text-transform: capitalize;">${vehicle.status.replace("_", " ")}</span>
            </div>
            <div style="font-size: 10px; color: #64748b;">
              📍 ${vehicle.location.address}
            </div>
          </div>
        `;

        vMarker.bindPopup(vPopupContent);
        vehiclesLayerRef.current.addLayer(vMarker);
      });
    }
  }, [reports, vehicles, filterPriority, filterStatus, filterCategory, showVehicles, showHeatmap, searchQuery]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-stone-200 shadow-sm bg-white">
      {/* Top Filter Bar */}
      {showControls && (
        <div className="p-3 bg-white/95 backdrop-blur-md border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Search box */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search reports by title, ward, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#174C37] text-stone-800"
            />
            <span className="absolute left-2.5 top-2 text-stone-400">🔍</span>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              aria-label="Filter by Priority"
              className="px-2.5 py-1.5 rounded-lg border border-stone-300 bg-stone-50 font-medium text-stone-700"
            >
              <option value="all">All Priorities</option>
              <option value="critical">🔴 Critical</option>
              <option value="high">🟠 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              aria-label="Filter by Status"
              className="px-2.5 py-1.5 rounded-lg border border-stone-300 bg-stone-50 font-medium text-stone-700"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="assigned">Assigned</option>
              <option value="on_the_way">On the Way</option>
              <option value="resolved">Resolved</option>
            </select>

            {/* Waste Category */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              aria-label="Filter by Waste Category"
              className="px-2.5 py-1.5 rounded-lg border border-stone-300 bg-stone-50 font-medium text-stone-700"
            >
              <option value="all">All Waste Categories</option>
              <option value="plastic">Plastic</option>
              <option value="construction">Construction Debris</option>
              <option value="organic">Organic</option>
              <option value="mixed">Mixed Garbage</option>
              <option value="household">Household</option>
            </select>

            {/* Toggle Vehicles */}
            <button
              onClick={() => setShowVehicles(!showVehicles)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                showVehicles ? "bg-[#174C37] text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              <Truck size={14} />
              <span>Fleet ({vehicles.length})</span>
            </button>

            {/* Toggle Heatmap */}
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                showHeatmap ? "bg-amber-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              <Layers size={14} />
              <span>Hotspot Density</span>
            </button>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapContainerRef} style={{ height }} className="w-full relative z-0" />

      {/* Map Legend Footer */}
      <div className="px-4 py-2 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between text-xs text-stone-600">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-stone-700">Map Legend:</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600 inline-block shadow-sm"></span> Critical
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500 inline-block shadow-sm"></span> High
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm"></span> Medium
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block shadow-sm"></span> Low / Resolved
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#174C37] inline-block shadow-sm"></span> Municipal Vehicle
          </span>
        </div>
        <div className="text-stone-400">
          Showing {reports.length} reports • Real-time Leaflet GIS
        </div>
      </div>
    </div>
  );
}
