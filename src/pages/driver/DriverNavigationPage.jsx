import React from "react";
import { useApp } from "../../context/AppContext.jsx";
import { optimizeRoute, MUNICIPAL_DEPOT, RECYCLING_LANDFILL } from "../../services/routeService.js";
import RouteMap from "../../components/Map/RouteMap.jsx";
import {
  Navigation,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function DriverNavigationPage() {
  const { currentUser, vehicles, reports } = useApp();

  const myTruck = vehicles.find(v => v.id === currentUser.assignedTruckId) || vehicles[0];
  const assignedTasks = reports.filter(r => r.assignedVehicleId === myTruck.id && r.status !== "resolved");

  const routeResult = optimizeRoute({
    startLocation: myTruck.location || MUNICIPAL_DEPOT,
    stops: assignedTasks
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-[#174C37] uppercase tracking-wider">
              Turn-by-Turn Transit Guidance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#202923] tracking-tight mt-1">
            Driver Route Navigation
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Optimized multi-stop collection itinerary for {myTruck.name} ({myTruck.id}).
          </p>
        </div>

        <div className="text-xs font-semibold text-stone-500 bg-white px-3 py-1.5 rounded-xl border border-stone-200">
          Estimated Route: <strong className="text-[#174C37]">{routeResult.totalDistanceFormatted}</strong> (~{routeResult.estimatedDurationMins} mins)
        </div>
      </div>

      {/* Main Map */}
      <RouteMap routeData={routeResult} height="480px" />

      {/* Sequenced Itinerary Card List */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">
          <Navigation size={16} className="text-[#174C37]" />
          <span>Sequenced Driving Stops ({routeResult.orderedStops.length} Waypoints)</span>
        </h3>

        <div className="space-y-3">
          {/* Start Hub */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-800 text-white font-bold flex items-center justify-center">
                🏢
              </span>
              <div>
                <span className="font-bold text-blue-950 block">START: Municipal Fleet Depot</span>
                <span className="text-blue-700">{MUNICIPAL_DEPOT.address}</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-900 font-bold uppercase text-[10px]">
              Origin
            </span>
          </div>

          {/* Stops */}
          {routeResult.orderedStops.map((stop, idx) => (
            <div
              key={stop.id}
              className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-8 h-8 rounded-full bg-[#174C37] text-white font-black text-xs flex items-center justify-center shrink-0">
                  #{idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">{stop.title}</span>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                      stop.priority === "critical" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                    }`}>
                      {stop.priority}
                    </span>
                  </div>
                  <p className="text-stone-500 truncate mt-0.5">📍 {stop.location.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right shrink-0">
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">Leg Distance</span>
                  <span className="font-bold text-stone-800">+{stop.legDistanceFormatted}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">Status</span>
                  <span className="capitalize font-bold text-[#174C37]">{stop.status.replace("_", " ")}</span>
                </div>
              </div>
            </div>
          ))}

          {/* End Landfill */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center">
                ♻️
              </span>
              <div>
                <span className="font-bold text-emerald-950 block">DESTINATION: Regional Solid Waste Processing Plant</span>
                <span className="text-emerald-700">{RECYCLING_LANDFILL.address}</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 font-bold uppercase text-[10px]">
              Final Dropoff
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
