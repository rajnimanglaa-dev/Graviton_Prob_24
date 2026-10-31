import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getWasteVisualCategory } from "../../services/wasteCategoryTheme.js";

// Depot marker icon
function createDepotIcon() {
  return L.divIcon({
    className: "depot-marker",
    html: `
      <div style="
        background: #1D2B25;
        color: #8BE0B0;
        border: 2px solid #16A36A;
        border-radius: 10px;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        box-shadow: 0 4px 14px rgba(0,0,0,0.7);
        font-size: 16px;
      ">
        🏢
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
}

// Landfill / Recycling Facility marker icon
function createLandfillIcon() {
  return L.divIcon({
    className: "landfill-marker",
    html: `
      <div style="
        background: #142820;
        color: #8BE0B0;
        border: 2px solid #8BE0B0;
        border-radius: 10px;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        box-shadow: 0 4px 14px rgba(0,0,0,0.7);
        font-size: 16px;
      ">
        ♻️
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
}

// Stop sequence marker icon (Numbered #1, #2, ...) using 3-color categorization
function createStopIcon(sequenceNumber, stop) {
  const visual = getWasteVisualCategory(stop.category);
  const color = visual.color;

  return L.divIcon({
    className: "stop-marker",
    html: `
      <div style="
        background: ${color};
        color: white;
        border: 2px solid #F5F7F5;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 13px;
        box-shadow: 0 4px 14px rgba(0,0,0,0.6);
        font-family: sans-serif;
      ">
        ${sequenceNumber}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
}

export default function RouteMap({ routeData, height = "480px" }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLayerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [28.618, 77.215],
      zoom: 13
    });

    // CartoDB Dark Matter tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      subdomains: "abc",
      maxZoom: 19
    }).addTo(map);

    routeLayerRef.current = L.featureGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !routeLayerRef.current || !routeData) return;

    routeLayerRef.current.clearLayers();

    const { orderedStops = [], depot, landfill, polylinePoints = [] } = routeData;

    // 1. Add Depot marker
    if (depot) {
      const depotMarker = L.marker([depot.lat, depot.lng], { icon: createDepotIcon() })
        .bindPopup(`
          <div style="font-family: 'Inter', sans-serif; padding: 10px; background: #1D2B25; color: #F5F7F5; border-radius: 8px;">
            <strong style="color: #8BE0B0;">Start Depot:</strong> ${depot.name}<br/>
            <span style="font-size:11px; color:#A5B3AA;">${depot.address}</span>
          </div>
        `);
      routeLayerRef.current.addLayer(depotMarker);
    }

    // 2. Add Stop markers
    orderedStops.forEach((stop, index) => {
      const visual = getWasteVisualCategory(stop.category);
      const stopMarker = L.marker([stop.location.lat, stop.location.lng], {
        icon: createStopIcon(index + 1, stop)
      }).bindPopup(`
        <div style="font-family: 'Inter', sans-serif; min-width: 200px; padding: 10px; background: #1D2B25; color: #F5F7F5; border-radius: 8px;">
          <div style="font-weight: 800; color: #8BE0B0; font-family: monospace;">Stop #${index + 1}: ${stop.id}</div>
          <div style="font-size: 12px; margin: 4px 0; color: #F5F7F5;">${stop.location.address}</div>
          <div style="font-size: 11px; color: ${visual.mint}; font-weight: bold; margin-bottom: 2px;">
            ● ${visual.name} (${stop.wqi?.estimatedVolumeM3 || 2} m³)
          </div>
          <div style="font-size: 11px; color: #A5B3AA;">
            Priority: <span style="font-weight:bold; color: #F5F7F5; text-transform:uppercase;">${stop.priority}</span>
          </div>
        </div>
      `);
      routeLayerRef.current.addLayer(stopMarker);
    });

    // 3. Add Landfill marker
    if (landfill) {
      const landfillMarker = L.marker([landfill.lat, landfill.lng], { icon: createLandfillIcon() })
        .bindPopup(`
          <div style="font-family: 'Inter', sans-serif; padding: 10px; background: #1D2B25; color: #F5F7F5; border-radius: 8px;">
            <strong style="color: #8BE0B0;">Destination:</strong> ${landfill.name}<br/>
            <span style="font-size:11px; color:#A5B3AA;">${landfill.address}</span>
          </div>
        `);
      routeLayerRef.current.addLayer(landfillMarker);
    }

    // 4. Draw route Polyline
    if (polylinePoints && polylinePoints.length > 1) {
      // Glow underlay line
      const glowLine = L.polyline(polylinePoints, {
        color: "#16A36A",
        weight: 8,
        opacity: 0.35,
        lineJoin: "round"
      });
      routeLayerRef.current.addLayer(glowLine);

      // Core line
      const polyline = L.polyline(polylinePoints, {
        color: "#8BE0B0",
        weight: 4,
        opacity: 0.95,
        dashArray: "4, 8",
        lineJoin: "round"
      });
      routeLayerRef.current.addLayer(polyline);

      try {
        map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
      } catch (e) {
        // ignore
      }
    }
  }, [routeData]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#273b33] shadow-2xl bg-[#142820]">
      <div ref={mapContainerRef} style={{ height }} className="w-full relative z-0" />
      <div className="p-3 bg-[#101A17] border-t border-[#273b33] flex flex-wrap items-center justify-between text-xs text-[#A5B3AA]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium text-[#F5F7F5]">🏢 Depot Start</span>
          <span className="flex items-center gap-1.5 font-medium text-[#8BE0B0]">🟢 Assigned Stops</span>
          <span className="flex items-center gap-1.5 font-medium text-[#F5F7F5]">♻️ Eco-Processing End</span>
        </div>
        <div className="text-[#8BE0B0] font-mono text-[11px]">
          Intelligent Heuristic Multi-Stop TSP Routing
        </div>
      </div>
    </div>
  );
}
