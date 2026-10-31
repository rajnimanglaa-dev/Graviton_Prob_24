import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Depot marker icon
function createDepotIcon() {
  return L.divIcon({
    className: "depot-marker",
    html: `
      <div style="
        background: #1e3a8a;
        color: white;
        border: 2px solid white;
        border-radius: 8px;
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      ">
        🏢
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
}

// Landfill marker icon
function createLandfillIcon() {
  return L.divIcon({
    className: "landfill-marker",
    html: `
      <div style="
        background: #174C37;
        color: white;
        border: 2px solid white;
        border-radius: 8px;
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      ">
        ♻️
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
}

// Stop sequence marker icon (Numbered #1, #2, ...)
function createStopIcon(sequenceNumber, priority) {
  const bg = priority === "critical" ? "#DC2626" : priority === "high" ? "#EA580C" : "#D97706";
  return L.divIcon({
    className: "stop-marker",
    html: `
      <div style="
        background: ${bg};
        color: white;
        border: 2px solid white;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 13px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.35);
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

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "Map data (c) OpenStreetMap contributors | SmartWaste Route Planner",
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
        .bindPopup(`<strong>Start:</strong> ${depot.name}<br/><span style="font-size:11px; color:#666;">${depot.address}</span>`);
      routeLayerRef.current.addLayer(depotMarker);
    }

    // 2. Add Stop markers
    orderedStops.forEach((stop, index) => {
      const stopMarker = L.marker([stop.location.lat, stop.location.lng], {
        icon: createStopIcon(index + 1, stop.priority)
      }).bindPopup(`
        <div style="font-family: system-ui; min-width: 180px; padding: 4px;">
          <div style="font-weight: 700; color: #174C37;">Stop #${index + 1}: ${stop.id}</div>
          <div style="font-size: 12px; margin: 4px 0;"><strong>Address:</strong> ${stop.location.address}</div>
          <div style="font-size: 11px; color: #666;">Category: ${stop.category} (${stop.wqi?.estimatedVolumeM3 || 2} m³)</div>
          <div style="font-size: 11px; color: #666;">Priority: <span style="font-weight:bold; text-transform:uppercase;">${stop.priority}</span></div>
        </div>
      `);
      routeLayerRef.current.addLayer(stopMarker);
    });

    // 3. Add Landfill marker
    if (landfill) {
      const landfillMarker = L.marker([landfill.lat, landfill.lng], { icon: createLandfillIcon() })
        .bindPopup(`<strong>Final Destination:</strong> ${landfill.name}<br/><span style="font-size:11px; color:#666;">${landfill.address}</span>`);
      routeLayerRef.current.addLayer(landfillMarker);
    }

    // 4. Draw route Polyline
    if (polylinePoints && polylinePoints.length > 1) {
      const polyline = L.polyline(polylinePoints, {
        color: "#174C37",
        weight: 5,
        opacity: 0.85,
        dashArray: "1, 10",
        lineJoin: "round"
      });
      routeLayerRef.current.addLayer(polyline);

      // Fit bounds
      try {
        map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
      } catch (e) {
        // ignore
      }
    }
  }, [routeData]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-stone-200 shadow-sm bg-white">
      <div ref={mapContainerRef} style={{ height }} className="w-full relative z-0" />
      <div className="p-3 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between text-xs text-stone-600">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">🏢 Depot Start</span>
          <span className="flex items-center gap-1.5 font-medium">🔴 Assigned Stops</span>
          <span className="flex items-center gap-1.5 font-medium">♻️ Eco-Processing End</span>
        </div>
        <div className="text-stone-400">
          Intelligent Heuristic Multi-Stop TSP Routing
        </div>
      </div>
    </div>
  );
}
