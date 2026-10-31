import React, { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import WasteMap from "../../components/Map/WasteMap.jsx";
import { AlertTriangle, Layers } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { calculateDistanceMeters } from "../../services/geoService.js";

export default function HotspotManagementPage() {
  const { reports, vehicles, wardStatistics, hotspotActions, recordHotspotAction } = useApp();
  const [selectedWard, setSelectedWard] = useState("all");
  const [actionDrafts, setActionDrafts] = useState({});

  // Group recent reports by GPS proximity and surface only sites with repeat history.
  const recurringSpots = useMemo(() => {
    const recentReports = reports.filter(report => {
      const age = Date.now() - new Date(report.createdAt || 0).getTime();
      return Number.isFinite(age) && age <= 30 * 24 * 60 * 60 * 1000 && report.location?.lat && report.location?.lng;
    });
    const clusters = [];
    recentReports.forEach(report => {
      const cluster = clusters.find(group => calculateDistanceMeters(
        group.anchor.location.lat, group.anchor.location.lng,
        report.location.lat, report.location.lng
      ) <= 150);
      if (cluster) cluster.reports.push(report);
      else clusters.push({ anchor: report, reports: [report] });
    });
    return clusters.map(({ anchor, reports: incidents }) => {
      const corroboratedCount = Math.max(1, ...incidents.map(item => item.duplicateInfo?.corroborationCount || 1));
      const occurrences30d = Math.max(corroboratedCount, incidents.length);
      const actions = hotspotActions[anchor.id] || [];
      const categories = incidents.reduce((counts, incident) => {
        counts[incident.category] = (counts[incident.category] || 0) + 1;
        return counts;
      }, {});
      const primaryWaste = Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] || anchor.category;
      return {
        id: `HSP-${anchor.id}`,
        reportId: anchor.id,
        location: anchor.location.address || anchor.title,
        ward: anchor.location.ward || "Ward not recorded",
        occurrences30d,
        primaryWaste,
        riskLevel: occurrences30d >= 6 ? "Critical" : occurrences30d >= 3 ? "High" : "Watch",
        actions,
        status: actions.at(-1)?.action || "No intervention recorded"
      };
    }).filter(spot => spot.occurrences30d > 1).sort((a, b) => b.occurrences30d - a.occurrences30d);
  }, [reports, hotspotActions]);

  const visibleHotspots = selectedWard === "all"
    ? recurringSpots
    : recurringSpots.filter(spot => spot.ward === selectedWard);

  return (
    <div className="space-y-8 animate-fadeIn text-[#F5F7F5]">
      <div>
        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#16A36A] animate-pulse" /><span className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">REPEAT-SITE PREVENTION & FOLLOW-UP</span></div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7F5] tracking-tight mt-1 font-heading">Hotspot Surveillance & Recurring Zones</h1>
        <p className="text-xs sm:text-sm text-[#A5B3AA] mt-1">Turn repeat reports into a site history, log prevention actions, and watch whether incidents return.</p>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-sm font-bold text-[#F5F7F5] flex items-center gap-2 font-heading"><Layers size={16} className="text-[#16A36A]" />Interactive incident map</h3>
          <span className="text-xs text-[#8BE0B0] font-mono">Repeat groups use report GPS within 150 m</span>
        </div>
        <WasteMap reports={reports} vehicles={vehicles} height="520px" showControls={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#1D2B25]/95 border border-[#354a40] shadow-md space-y-4 backdrop-blur-sm">
          <div className="flex items-center justify-between"><h4 className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">Ward incident and resolution counts</h4><span className="text-xs text-[#B8C6BD]">Demo dataset</span></div>
          <div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={wardStatistics}><XAxis dataKey="ward" stroke="#B8C6BD" fontSize={10} tickLine={false} /><YAxis stroke="#B8C6BD" fontSize={11} tickLine={false} /><Tooltip contentStyle={{ backgroundColor: "#142820", borderColor: "#354a40", color: "#F5F7F5", borderRadius: "12px", fontSize: "12px" }} /><Bar dataKey="totalReports" fill="#F4C542" radius={[6, 6, 0, 0]} name="Reports" /><Bar dataKey="resolved" fill="#16A36A" radius={[6, 6, 0, 0]} name="Resolved" /></BarChart></ResponsiveContainer></div>
        </div>
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#1D2B25]/95 border border-[#354a40] shadow-md space-y-3 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-2"><h4 className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">Repeat sites</h4><select value={selectedWard} onChange={event => setSelectedWard(event.target.value)} className="max-w-40 bg-[#142820] border border-[#354a40] rounded-lg px-2 py-1 text-xs text-white"><option value="all">All wards</option>{[...new Set(recurringSpots.map(spot => spot.ward))].map(ward => <option key={ward} value={ward}>{ward}</option>)}</select></div>
          <p className="text-[11px] text-[#B8C6BD]">Showing report-backed recurrence in the last 30 days. Counts include corroborations recorded on the report.</p>
          {visibleHotspots.length === 0 ? <div className="p-4 rounded-xl bg-[#142820] text-xs text-[#B8C6BD]">No repeat sites found in this ward.</div> : visibleHotspots.map(spot => (
            <article key={spot.id} className="p-3 bg-[#142820] rounded-2xl border border-[#354a40] space-y-2.5">
              <div className="flex items-start justify-between gap-2"><div><div className="text-[10px] font-mono text-[#8BE0B0]">{spot.id}</div><div className="text-xs font-bold text-white mt-1">{spot.location}</div><div className="text-[10px] text-[#B8C6BD] mt-0.5">{spot.ward} · {spot.primaryWaste}</div></div><span className={`shrink-0 px-2 py-1 rounded-full text-[9px] font-bold uppercase border ${spot.riskLevel === "Critical" ? "bg-red-500/15 text-red-200 border-red-400/40" : "bg-amber-400/15 text-amber-100 border-amber-300/40"}`}>{spot.riskLevel}</span></div>
              <div className="text-xs text-[#DCE5DF]"><strong>{spot.occurrences30d}</strong> incidents/corroborations · Latest follow-up: <span className="text-[#8BE0B0]">{spot.status}</span></div>
              <div className="flex flex-col sm:flex-row gap-2"><select value={actionDrafts[spot.id] || ""} onChange={event => setActionDrafts(prev => ({ ...prev, [spot.id]: event.target.value }))} className="flex-1 min-w-0 bg-[#1D2B25] border border-[#354a40] rounded-xl px-3 py-2 text-white text-xs"><option value="">Log a prevention action…</option><option>Adjust collection schedule</option><option>Inspect nearby bins or collection access</option><option>Request site inspection</option><option>Community awareness follow-up</option></select><button disabled={!actionDrafts[spot.id]} onClick={() => { recordHotspotAction(spot.reportId, actionDrafts[spot.id]); setActionDrafts(prev => ({ ...prev, [spot.id]: "" })); }} className="px-3 py-2 rounded-xl bg-[#138754] hover:bg-[#16A36A] text-white font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed">Record action</button></div>
              {spot.actions.length > 0 && <div className="border-t border-[#354a40] pt-2 space-y-1"><div className="text-[10px] font-bold text-[#8BE0B0]">Intervention history</div>{spot.actions.slice(-2).reverse().map(action => <div key={action.id} className="text-[10px] text-[#B8C6BD]">{new Date(action.createdAt).toLocaleDateString()} · {action.action} · {action.actor}</div>)}</div>}
            </article>
          ))}
          <p className="text-[10px] text-[#B8C6BD]">This demo saves intervention notes in this browser; a real pilot needs shared storage and confirmation from field staff.</p>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-[#16372A] border border-[#16A36A]/50 flex gap-3 items-start"><AlertTriangle size={17} className="text-[#8BE0B0] mt-0.5 shrink-0" /><p className="text-xs text-[#DCE5DF] leading-relaxed"><strong className="text-white">Why track interventions?</strong> A cleanup closes an incident; repeat-site history helps teams test whether a schedule change, bin inspection, or community follow-up reduces the next one.</p></div>
    </div>
  );
}
