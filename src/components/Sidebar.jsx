import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import {
  Recycle,
  LayoutDashboard,
  PlusCircle,
  Cpu,
  FileText,
  Clock,
  Award,
  User,
  ListOrdered,
  Layers,
  Route,
  Truck,
  Users,
  BarChart3,
  Settings,
  Navigation,
  CheckCircle2,
  RotateCcw,
  Globe,
  X
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { currentUser, reports, vehicles, resetToDemoData } = useApp();

  const role = currentUser.role || "citizen";

  // Citizen Navigation Links
  const citizenLinks = [
    { label: "Dashboard", path: "/citizen/dashboard", icon: LayoutDashboard },
    { label: "Report Garbage", path: "/citizen/report", icon: PlusCircle, badge: "New" },
    { label: "AI Waste Analysis", path: "/citizen/ai-analysis", icon: Cpu },
    { label: "My Reports", path: "/citizen/my-reports", icon: FileText, count: reports.filter(r => r.citizenId === currentUser.id).length },
    { label: "Track Collection", path: "/citizen/track", icon: Clock },
    { label: "Community Impact", path: "/citizen/community", icon: Award },
    { label: "Profile & Alerts", path: "/citizen/profile", icon: User }
  ];

  // Admin Navigation Links
  const pendingCount = reports.filter(r => r.status === "pending" || r.status === "verified").length;
  const criticalCount = reports.filter(r => r.priority === "critical" && r.status !== "resolved").length;

  const adminLinks = [
    { label: "Overview", path: "/admin/overview", icon: LayoutDashboard },
    { label: "All Reports", path: "/admin/reports", icon: FileText, count: reports.length },
    { label: "Priority Queue", path: "/admin/priority-queue", icon: ListOrdered, badge: criticalCount > 0 ? `${criticalCount} Crit` : null, badgeColor: "bg-red-500" },
    { label: "AI Detection Lab", path: "/admin/ai-lab", icon: Cpu },
    { label: "Hotspot Management", path: "/admin/hotspots", icon: Layers },
    { label: "Route Optimization", path: "/admin/route-optimization", icon: Route },
    { label: "Vehicle Fleet", path: "/admin/vehicles", icon: Truck, count: vehicles.length },
    { label: "Worker Management", path: "/admin/workers", icon: Users },
    { label: "Analytics & Reports", path: "/admin/analytics", icon: BarChart3 },
    { label: "Settings", path: "/admin/settings", icon: Settings }
  ];

  // Driver Navigation Links
  const driverAssignedTasks = reports.filter(r => r.assignedVehicleId === currentUser.assignedTruckId && r.status !== "resolved");
  const driverLinks = [
    { label: "Driver Overview", path: "/driver/overview", icon: LayoutDashboard },
    { label: "Assigned Collections", path: "/driver/tasks", icon: Truck, count: driverAssignedTasks.length, badgeColor: "bg-amber-500" },
    { label: "Route Navigation", path: "/driver/navigation", icon: Navigation },
    { label: "Collection History", path: "/driver/history", icon: CheckCircle2 },
    { label: "Driver Profile", path: "/driver/profile", icon: User }
  ];

  const currentLinks = role === "admin" ? adminLinks : role === "driver" ? driverLinks : citizenLinks;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-stone-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-stone-200 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#174C37] text-white flex items-center justify-center shadow-xs">
              <Recycle size={20} className="text-emerald-300" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-[#174C37] tracking-tight">
                Smart<span className="text-[#76A96B]">Waste</span>
              </span>
              <span className="text-[10px] text-stone-500 block font-semibold uppercase -mt-0.5">
                {role} Portal
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="lg:hidden p-1.5 rounded-lg text-stone-500 hover:bg-stone-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {currentLinks.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-[#174C37] text-white shadow-xs"
                    : "text-stone-600 hover:text-[#174C37] hover:bg-stone-100/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? "text-white" : "text-stone-400"} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${
                        item.badgeColor || "bg-emerald-600"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count !== null && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isActive ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-stone-200 bg-stone-50/60 space-y-2">
          {role === "citizen" && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#174C37]">EcoPoints Balance</span>
                <span className="font-extrabold text-emerald-800">🌟 {currentUser.points || 420}</span>
              </div>
              <p className="text-[10px] text-emerald-700">Rank #1 in Ward 7 Civil Lines</p>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
            <Link to="/" className="hover:text-[#174C37] flex items-center gap-1">
              <Globe size={13} />
              <span>Website</span>
            </Link>
            <button
              onClick={resetToDemoData}
              className="hover:text-stone-900 flex items-center gap-1 text-[11px]"
              title="Reset initial demo data"
            >
              <RotateCcw size={12} />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
