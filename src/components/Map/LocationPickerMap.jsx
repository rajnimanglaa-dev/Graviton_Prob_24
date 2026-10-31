import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DEFAULT_MAP_CENTER } from "../../services/geoService.js";

const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tileOptions = {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
  subdomains: "abc",
  maxZoom: 19
};

export default function LocationPickerMap({ location, onLocationChange }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const onLocationChangeRef = useRef(onLocationChange);

  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
  }, [onLocationChange]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined;

    const initialPoint = location?.lat != null && location?.lng != null
      ? [location.lat, location.lng]
      : [DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng];
    const map = L.map(containerRef.current, { center: initialPoint, zoom: location?.lat ? 16 : DEFAULT_MAP_CENTER.zoom });
    L.tileLayer(tileUrl, tileOptions).addTo(map);
    mapRef.current = map;

    const setPin = (lat, lng, notify = true) => {
      const point = [lat, lng];
      if (!markerRef.current) {
        const pinIcon = L.divIcon({
          className: "location-picker-marker",
          html: '<span style="display:block;width:22px;height:22px;border:4px solid #fff;border-radius:50% 50% 50% 0;background:#16a36a;box-shadow:0 2px 10px #0009;transform:rotate(-45deg)"></span>',
          iconSize: [22, 22],
          iconAnchor: [11, 20]
        });
        markerRef.current = L.marker(point, { draggable: true, icon: pinIcon }).addTo(map);
        markerRef.current.on("dragend", (event) => {
          const moved = event.target.getLatLng();
          setPin(moved.lat, moved.lng);
        });
      } else {
        markerRef.current.setLatLng(point);
      }
      if (notify) {
        onLocationChangeRef.current({
          lat: Number(lat.toFixed(6)),
          lng: Number(lng.toFixed(6)),
          address: `Map pin (${lat.toFixed(5)}, ${lng.toFixed(5)})`
        });
      }
    };

    map.on("click", (event) => setPin(event.latlng.lat, event.latlng.lng));
    if (location?.lat != null && location?.lng != null) setPin(location.lat, location.lng, false);
    mapRef.current.setPin = setPin;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || location?.lat == null || location?.lng == null) return;
    const current = markerRef.current?.getLatLng();
    if (!current || Math.abs(current.lat - location.lat) > 0.000001 || Math.abs(current.lng - location.lng) > 0.000001) {
      map.setView([location.lat, location.lng], Math.max(map.getZoom(), 16));
      map.setPin?.(location.lat, location.lng, false);
    }
  }, [location?.lat, location?.lng]);

  return <div ref={containerRef} className="location-picker-map" aria-label="Map to choose the waste location" />;
}
