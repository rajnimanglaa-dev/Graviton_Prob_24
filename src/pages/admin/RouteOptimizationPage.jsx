import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle2, Clock, MapPin, Route, Truck, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import api, { apiErrorMessage } from '../../services/api.js';
import { getWasteVisualCategory } from '../../services/wasteCategoryTheme.js';
import RouteMap from '../../components/Map/RouteMap.jsx';

const depot = { name: 'Central Municipal Fleet Depot', lat: 28.6139, lng: 77.209, address: 'Central municipal fleet depot' };
const facility = { name: 'Regional Solid Waste Processing Facility', lat: 28.642, lng: 77.235, address: 'Regional solid waste processing facility' };
const formatDistance = (meters) => meters >= 1000 ? (meters / 1000).toFixed(1) + ' km' : Math.round(meters || 0) + ' m';
const formatDuration = (seconds) => Math.max(1, Math.round((seconds || 0) / 60)) + ' min';

function routeForMap(route) {
  if (!route) return { orderedStops: [], depot, landfill: facility, polylinePoints: [] };
  const coordinates = route.geometry?.coordinates || [];
  return {
    orderedStops: route.stops.map((stop) => ({
      id: stop.reportId, title: stop.title, category: 'mixed', priority: 'medium',
      location: stop.location, planningWeightKg: stop.plannedWeightKg,
      legDistanceFormatted: formatDistance(stop.legDistanceMeters)
    })),
    depot,
    landfill: facility,
    polylinePoints: coordinates.map(([lng, lat]) => [lat, lng])
  };
}

export default function RouteOptimizationPage() {
  const { vehicles, reports, optimizeRoutes } = useApp();
  const [selectedVehicleIds, setSelectedVehicleIds] = useState([]);
  const [selectedReportIds, setSelectedReportIds] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const routesQuery = useQuery({
    queryKey: ['routes'],
    queryFn: async () => (await api.get('/routes')).data.routes,
    staleTime: 30_000
  });

  const eligibleReports = useMemo(() => reports.filter((report) => ['verified', 'assigned'].includes(report.workflowStatus) && Number.isFinite(report.location?.lat) && Number.isFinite(report.location?.lng) && Number.isFinite(report.planningWeightKg)), [reports]);
  const availableVehicles = useMemo(() => vehicles.filter((vehicle) => ['available', 'assigned', 'on_route'].includes(vehicle.status)), [vehicles]);
  const displayedRoute = result?.routes?.[0] || routesQuery.data?.[0] || null;
  const mapData = routeForMap(displayedRoute);

  const toggle = (value, setValue) => setValue((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  const createRoute = async () => {
    setError('');
    if (!selectedVehicleIds.length || !selectedReportIds.length) {
      setError('Select at least one available vehicle and one route-ready report.');
      return;
    }
    setBusy(true);
    try {
      setResult(await optimizeRoutes({ vehicleIds: selectedVehicleIds, reportIds: selectedReportIds }));
      await routesQuery.refetch();
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-[#F5F7F5]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#16A36A] animate-pulse" /><span className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">ROAD-NETWORK VEHICLE ROUTING</span></div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 font-heading">Capacity-constrained route optimization</h1>
          <p className="text-xs sm:text-sm text-[#A5B3AA] mt-0.5">Routes are calculated on OSRM road-network costs with Google OR-Tools capacity constraints and priority-weighted service selection.</p>
        </div>
        <button onClick={createRoute} disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16A36A] px-4 py-3 text-xs font-bold text-white hover:bg-[#0f7a4e] disabled:opacity-60"><Route size={16} />{busy ? 'Optimizing route…' : 'Run optimization'}</button>
      </div>

      {error && <div role="alert" className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-4">
          <section className="p-5 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono"><Truck size={14} />Available vehicles</div>
            {availableVehicles.length === 0 ? <p className="text-xs text-[#A5B3AA]">No vehicles are currently available.</p> : <div className="space-y-2">
              {availableVehicles.map((vehicle) => <label key={vehicle.id} className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#273b33] bg-[#142820] p-3 text-xs">
                <span><strong className="text-[#F5F7F5]">{vehicle.name}</strong><span className="block mt-1 text-[#A5B3AA]">{vehicle.capacityKg - vehicle.currentLoadKg} kg free · {vehicle.status.replace('_', ' ')}</span></span>
                <input type="checkbox" checked={selectedVehicleIds.includes(vehicle.id)} onChange={() => toggle(vehicle.id, setSelectedVehicleIds)} className="h-4 w-4 accent-[#16A36A]" />
              </label>)}
            </div>}
          </section>
          <section className="p-5 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md">
            <div className="mb-2 flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono"><CheckCircle2 size={14} />Route-ready reports</div><button onClick={() => setSelectedReportIds(eligibleReports.map((report) => report.id))} className="text-[11px] font-bold text-[#8BE0B0] hover:text-white">Select all</button></div>
            <p className="mb-3 text-[11px] text-[#A5B3AA]">Only verified reports with coordinates and a municipal planning weight can be optimized.</p>
            {eligibleReports.length === 0 ? <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-200">No reports are route-ready yet. Verify a report and provide its planned collection weight during review.</div> : <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {eligibleReports.map((report) => {
                const visual = getWasteVisualCategory(report.category);
                return <label key={report.id} className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#273b33] bg-[#142820] p-3 text-xs">
                  <span className="min-w-0"><strong className="text-[#F5F7F5]">{report.id}</strong><span className="block truncate mt-1 text-[#A5B3AA]">{report.location.address}</span><span style={{ color: visual.mint }} className="block mt-1">{report.planningWeightKg} kg · {report.priority} priority</span></span>
                  <input type="checkbox" checked={selectedReportIds.includes(report.id)} onChange={() => toggle(report.id, setSelectedReportIds)} className="h-4 w-4 accent-[#16A36A]" />
                </label>;
              })}
            </div>}
          </section>
        </div>
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-3 gap-3 p-4 bg-[#1D2B25] rounded-3xl border border-[#273b33] shadow-md text-center">
            <div><span className="text-[10px] text-[#A5B3AA] uppercase font-bold block font-mono">Road distance</span><span className="text-xl font-black text-[#8BE0B0] font-stat">{displayedRoute ? formatDistance(displayedRoute.totalDistanceMeters) : '—'}</span></div>
            <div><span className="text-[10px] text-[#A5B3AA] uppercase font-bold block font-mono">Road duration</span><span className="text-xl font-black text-[#F5F7F5] font-stat">{displayedRoute ? formatDuration(displayedRoute.totalDurationSeconds) : '—'}</span></div>
            <div><span className="text-[10px] text-[#A5B3AA] uppercase font-bold block font-mono">Capacity used</span><span className="text-xl font-black text-[#16A36A] font-stat">{displayedRoute ? Math.round(displayedRoute.capacityUsedKg) + ' kg' : '—'}</span></div>
          </div>
          <RouteMap routeData={mapData} height="440px" />
          <section className="p-5 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md">
            <h2 className="flex items-center gap-2 text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono"><Zap size={14} />Optimized stop sequence</h2>
            {!displayedRoute ? <p className="mt-3 text-xs text-[#A5B3AA]">No persisted route is available. Run an optimization after selecting route-ready reports.</p> : <div className="mt-3 space-y-2 text-xs">
              {displayedRoute.stops.map((stop) => <div key={stop.reportId} className="flex items-center justify-between rounded-xl border border-[#273b33] bg-[#142820] p-3"><div><strong className="text-[#F5F7F5]">#{stop.sequence} · {stop.reportId}</strong><span className="block mt-1 text-[#A5B3AA]"><MapPin size={11} className="inline" /> {stop.location.address}</span></div><div className="text-right text-[#8BE0B0]">{stop.plannedWeightKg} kg<span className="block text-[10px] text-[#A5B3AA]">{formatDistance(stop.legDistanceMeters)}</span></div></div>)}
              {displayedRoute.summary?.unassignedReportIds?.length > 0 && <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-amber-200"><AlertTriangle size={14} className="mr-1 inline" />Unassigned due to capacity or constraints: {displayedRoute.summary.unassignedReportIds.join(', ')}</div>}
            </div>}
          </section>
          <p className="flex items-center gap-1.5 text-[11px] text-[#A5B3AA]"><Clock size={12} />No demonstration route is substituted for unavailable OSRM or OR-Tools services.</p>
        </div>
      </div>
    </div>
  );
}
