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
  const assignedTasks = reports.filter(r => (r.assignedVehicleId === myTruck.id || r.assignedDriverName === currentUser.name) && r.status !== "resolved");

  const routeResult = optimizeRoute({
    startLocation: myTruck.location || MUNICIPAL_DEPOT,
    stops: assignedTasks
  });

  return (
    <div className="space-y-6 animate-fadeIn text-[#F5F7F5]">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A36A] animate-pulse" />
            <span className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider">
              Turn-by-Turn Transit Guidance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#F5F7F5] tracking-tight mt-1">
            Driver Route Navigation
          </h1>
          <p className="text-xs sm:text-sm text-[#A5B3AA] mt-1">
            Optimized multi-stop collection itinerary for <strong className="text-[#8BE0B0]">{myTruck.name} ({myTruck.id})</strong>.
          </p>
        </div>

        <div className="text-xs font-semibold text-[#A5B3AA] bg-[#1D2B25] px-4 py-2 rounded-2xl border border-[#24382F] shadow-inner">
          Estimated Route: <strong className="font-stat text-[#8BE0B0]">{routeResult.totalDistanceFormatted}</strong> (~<span className="font-stat text-[#F5F7F5]">{routeResult.estimatedDurationMins} mins</span>)
        </div>
      </div>

      {/* Main Map */}
      <div className="rounded-3xl overflow-hidden border border-[#24382F] shadow-xl">
        <RouteMap routeData={routeResult} height="480px" />
      </div>

      {/* Sequenced Itinerary Card List */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#1D2B25] border border-[#24382F] shadow-lg space-y-4">
        <h3 className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider flex items-center gap-2">
          <Navigation size={16} className="text-[#16A36A]" />
          <span>Sequenced Driving Stops ({routeResult.orderedStops.length} Waypoints)</span>
        </h3>

        <div className="space-y-3">
          {/* Start Hub */}
          <div className="p-4 rounded-2xl bg-[#142820] border border-[#3987F5]/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-[#3987F5]/20 text-[#3987F5] border border-[#3987F5]/40 font-bold flex items-center justify-center text-sm shadow-inner">
                🏢
              </span>
              <div>
                <span className="font-bold font-heading text-[#F5F7F5] block">START: Municipal Fleet Depot</span>
                <span className="text-[#A5B3AA]">{MUNICIPAL_DEPOT.address}</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-[#3987F5]/20 text-[#3987F5] border border-[#3987F5]/30 font-bold uppercase text-[10px]">
              Origin
            </span>
          </div>

          {/* Stops */}
          {routeResult.orderedStops.map((stop, idx) => (
            <div
              key={stop.id}
              className="p-4 rounded-2xl bg-[#142820] border border-[#24382F] hover:border-[#8BE0B0]/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-8 h-8 rounded-xl bg-[#16A36A] text-[#101A17] font-black font-stat text-xs flex items-center justify-center shrink-0 shadow-md">
                  #{idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-heading text-[#F5F7F5]">{stop.title}</span>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                      stop.priority === "critical"
                        ? "bg-[#FF6B6B]/20 text-[#FF6B6B] border border-[#FF6B6B]/30"
                        : "bg-[#F4C542]/20 text-[#F4C542] border border-[#F4C542]/30"
                    }`}>
                      {stop.priority}
                    </span>
                  </div>
                  <p className="text-[#A5B3AA] truncate mt-0.5">📍 {stop.location.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right shrink-0">
                <div>
                  <span className="text-[10px] text-[#A5B3AA]/70 block font-semibold">Leg Distance</span>
                  <span className="font-bold font-stat text-[#F5F7F5]">+{stop.legDistanceFormatted}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#A5B3AA]/70 block font-semibold">Status</span>
                  <span className="capitalize font-bold text-[#8BE0B0]">{stop.status.replace("_", " ")}</span>
                </div>
              </div>
            </div>
          ))}

          {/* End Landfill */}
          <div className="p-4 rounded-2xl bg-[#142820] border border-[#16A36A]/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-[#16A36A]/20 text-[#8BE0B0] border border-[#16A36A]/40 font-bold flex items-center justify-center text-sm shadow-inner">
                ♻️
              </span>
              <div>
                <span className="font-bold font-heading text-[#F5F7F5] block">DESTINATION: Regional Solid Waste Processing Plant</span>
                <span className="text-[#A5B3AA]">{RECYCLING_LANDFILL.address}</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-[#16A36A]/20 text-[#8BE0B0] border border-[#16A36A]/30 font-bold uppercase text-[10px]">
              Final Dropoff
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
