import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_REPORTS, INITIAL_VEHICLES, DEMO_USERS, CITIZEN_LEADERBOARD, WARD_STATISTICS, CLEANUP_EVENTS } from "../services/mockData.js";
import { analyzeWasteImage } from "../services/aiService.js";
import { findNearbyDuplicates } from "../services/geoService.js";

const AppContext = createContext(null);

const STORAGE_KEYS = {
  REPORTS: "smartwaste_v1_reports",
  VEHICLES: "smartwaste_v1_vehicles",
  USER: "smartwaste_v1_current_user",
  NOTIFICATIONS: "smartwaste_v1_notifications",
  SETTINGS: "smartwaste_v1_settings",
  EVENTS: "smartwaste_v1_events",
  HOTSPOT_ACTIONS: "smartwaste_v1_hotspot_actions"
};

const DEFAULT_SETTINGS = {
  duplicateThresholdMeters: 100,
  slaCriticalHours: 2,
  slaHighHours: 6,
  slaMediumHours: 24,
  autoVerifyWqiOver75: false
};

export function AppProvider({ children }) {
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return saved ? JSON.parse(saved) : INITIAL_REPORTS;
    } catch (e) {
      return INITIAL_REPORTS;
    }
  });

  const [vehicles, setVehicles] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VEHICLES);
      return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
    } catch (e) {
      return INITIAL_VEHICLES;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : DEMO_USERS.citizen;
    } catch (e) {
      return DEMO_USERS.citizen;
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : [
        {
          id: "NTF-1",
          title: "Driver En Route",
          message: "Fleet Heavy Compactor #01 is en route to report SW-2026-1002.",
          timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
          read: false,
          role: "all"
        },
        {
          id: "NTF-2",
          title: "New Critical Dumping Flagged",
          message: "Report SW-2026-1001 flagged as Critical (WQI 88) at Sector 18.",
          timestamp: new Date(Date.now() - 2.8 * 3600 * 1000).toISOString(),
          read: false,
          role: "admin"
        }
      ];
    } catch (e) {
      return [];
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return saved ? JSON.parse(saved) : CLEANUP_EVENTS;
    } catch (e) {
      return CLEANUP_EVENTS;
    }
  });

  const [hotspotActions, setHotspotActions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.HOTSPOT_ACTIONS)) || {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HOTSPOT_ACTIONS, JSON.stringify(hotspotActions));
  }, [hotspotActions]);

  const addNotification = (title, message, role = "all") => {
    const newNtf = {
      id: "NTF-" + Date.now(),
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      role
    };
    setNotifications(prev => [newNtf, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const switchRole = (role) => {
    if (role === "admin") {
      setCurrentUser(DEMO_USERS.admin);
    } else if (role === "driver") {
      setCurrentUser(DEMO_USERS.driver);
    } else {
      setCurrentUser(DEMO_USERS.citizen);
    }
  };

  const loginAs = (role) => {
    switchRole(role);
  };

  const submitReport = ({ title, category, description, imageUrl, location, isPublicLocation = true }) => {
    const nearby = findNearbyDuplicates(location.lat, location.lng, reports, settings.duplicateThresholdMeters);
    const hasDuplicate = nearby.length > 0;
    const parentReport = hasDuplicate ? nearby[0].report : null;

    const recurrenceCount = hasDuplicate ? (parentReport.duplicateInfo?.corroborationCount || 1) + 1 : 1;
    const aiResult = analyzeWasteImage({ category, recurrenceCount, isPublicLocation });

    const newReportId = `SW-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();

    const newReport = {
      id: newReportId,
      title: title || `${aiResult.categoryLabel} dumping reported at ${location.address || "Local Site"}`,
      category: aiResult.category,
      description: description || "Citizen reported waste accumulation requiring municipal clearance.",
      imageUrl,
      afterImageUrl: null,
      location: {
        lat: location.lat,
        lng: location.lng,
        address: location.address || "Reported Location, Ward 7",
        ward: location.ward || "Ward 7 - Civil Lines"
      },
      status: "pending",
      priority: aiResult.priority,
      priorityScore: aiResult.priorityScore,
      priorityReason: aiResult.priorityReason,
      wqi: aiResult.wqi,
      duplicateInfo: {
        isDuplicate: hasDuplicate,
        parentReportId: parentReport ? parentReport.id : null,
        corroborationCount: hasDuplicate ? parentReport.duplicateInfo.corroborationCount + 1 : 1,
        linkedReports: []
      },
      assignedVehicleId: null,
      assignedDriverName: null,
      citizenId: currentUser.id,
      citizenName: currentUser.name,
      citizenEmail: currentUser.email,
      createdAt: nowIso,
      timeline: [
        {
          status: "submitted",
          timestamp: nowIso,
          actor: `Citizen (${currentUser.name})`,
          note: hasDuplicate
            ? `Report lodged. Corroborated with active incident ${parentReport.id} (+20 EcoPoints)`
            : `Report lodged with AI WQI score ${aiResult.wqi.total}/100.`
        }
      ]
    };

    if (hasDuplicate && parentReport) {
      setReports(prev =>
        prev.map(r => {
          if (r.id === parentReport.id) {
            const updatedCorroboration = (r.duplicateInfo?.corroborationCount || 1) + 1;
            const updatedPriorityScore = Math.min(100, (r.priorityScore || 70) + 5);
            return {
              ...r,
              priorityScore: updatedPriorityScore,
              duplicateInfo: {
                ...r.duplicateInfo,
                corroborationCount: updatedCorroboration,
                linkedReports: [...(r.duplicateInfo?.linkedReports || []), newReportId]
              },
              timeline: [
                ...r.timeline,
                {
                  status: "corroborated",
                  timestamp: nowIso,
                  actor: `Citizen (${currentUser.name})`,
                  note: `Additional citizen report corroborating waste site (+5 attention score)`
                }
              ]
            };
          }
          return r;
        }).concat(newReport)
      );
    } else {
      setReports(prev => [newReport, ...prev]);
    }

    const pointsAwarded = hasDuplicate ? 20 : 50;
    setCurrentUser(prev => ({
      ...prev,
      points: (prev.points || 0) + pointsAwarded
    }));

    addNotification(
      `New ${newReport.priority.toUpperCase()} Report ${newReport.id}`,
      `Filed by ${currentUser.name} at ${newReport.location.address}. WQI: ${aiResult.wqi.total}/100.`,
      "admin"
    );

    return newReport;
  };

  const verifyReport = (reportId, overridePriority = null) => {
    const nowIso = new Date().toISOString();
    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          const newPriority = overridePriority || r.priority;
          return {
            ...r,
            status: "verified",
            priority: newPriority,
            timeline: [
              ...r.timeline,
              {
                status: "verified",
                timestamp: nowIso,
                actor: `Admin (${currentUser.name})`,
                note: `Verified and confirmed priority as ${newPriority.toUpperCase()}.`
              }
            ]
          };
        }
        return r;
      })
    );

    addNotification("Report Verified", `Report ${reportId} marked as verified by Admin. Ready for vehicle assignment.`, "citizen");
  };

  const rejectReport = (reportId, reason = "Invalid or duplicate entry") => {
    const nowIso = new Date().toISOString();
    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          return {
            ...r,
            status: "rejected",
            timeline: [
              ...r.timeline,
              {
                status: "rejected",
                timestamp: nowIso,
                actor: `Admin (${currentUser.name})`,
                note: `Report declined: ${reason}`
              }
            ]
          };
        }
        return r;
      })
    );
  };

  const assignVehicleToReport = (reportId, vehicleId) => {
    const nowIso = new Date().toISOString();
    const targetVehicle = vehicles.find(v => v.id === vehicleId);
    if (!targetVehicle) return;

    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          return {
            ...r,
            status: "assigned",
            assignedVehicleId: targetVehicle.id,
            assignedDriverName: targetVehicle.driverName,
            timeline: [
              ...r.timeline,
              {
                status: "assigned",
                timestamp: nowIso,
                actor: `Admin (${currentUser.name})`,
                note: `Assigned to ${targetVehicle.name} (Driver: ${targetVehicle.driverName})`
              }
            ]
          };
        }
        return r;
      })
    );

    setVehicles(prev =>
      prev.map(v => {
        if (v.id === vehicleId) {
          return {
            ...v,
            assignedTasks: Array.from(new Set([...v.assignedTasks, reportId]))
          };
        }
        return v;
      })
    );

    addNotification(
      "Task Assigned to You",
      `New collection task ${reportId} assigned to your vehicle (${targetVehicle.name}).`,
      "driver"
    );
    addNotification(
      "Vehicle Dispatched",
      `Vehicle ${targetVehicle.name} assigned to your report ${reportId}.`,
      "citizen"
    );
  };

  const updateDriverTaskStatus = (reportId, newStatus, { afterImageUrl = null, note = "" } = {}) => {
    const nowIso = new Date().toISOString();
    let noteText = note;

    if (!noteText) {
      if (newStatus === "on_the_way") noteText = "Driver departed depot, en route to pickup site.";
      else if (newStatus === "arrived") noteText = "Driver arrived at waste dumping site.";
      else if (newStatus === "collected") noteText = "Waste loaded. Cleaning verified with photographic proof.";
      else if (newStatus === "resolved") noteText = "Verification approved. Task completed successfully.";
    }

    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          return {
            ...r,
            status: newStatus,
            afterImageUrl: afterImageUrl || r.afterImageUrl,
            timeline: [
              ...r.timeline,
              {
                status: newStatus,
                timestamp: nowIso,
                actor: `Driver (${currentUser.name || "Rajesh Kumar"})`,
                note: noteText
              }
            ]
          };
        }
        return r;
      })
    );

    if (newStatus === "collected" || newStatus === "resolved") {
      addNotification(
        `Waste Collected (${reportId})`,
        `Cleaning proof submitted. Location cleared by Driver Rajesh Kumar.`,
        "all"
      );
    } else {
      addNotification(
        `Status Update (${reportId})`,
        `Driver marked task as: ${newStatus.replace("_", " ").toUpperCase()}`,
        "all"
      );
    }
  };

  const resolveReport = (reportId) => {
    const nowIso = new Date().toISOString();
    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          return {
            ...r,
            status: "resolved",
            timeline: [
              ...r.timeline,
              {
                status: "resolved",
                timestamp: nowIso,
                actor: `Admin (${currentUser.name})`,
                note: "Final municipal inspection verified. Ticket closed (+50 EcoPoints bonus awarded)."
              }
            ]
          };
        }
        return r;
      })
    );
    addNotification("Report Resolved", `Report ${reportId} has been successfully closed and marked Clean!`, "citizen");
  };

  const rsvpEvent = (eventId) => {
    setEvents(prev =>
      prev.map(ev => {
        if (ev.id === eventId) {
          return {
            ...ev,
            volunteersCount: ev.volunteersCount + 1,
            isJoined: true
          };
        }
        return ev;
      })
    );
    setCurrentUser(prev => ({
      ...prev,
      points: (prev.points || 0) + 50
    }));
    addNotification("RSVP Confirmed", "You registered for the clean-up event! +50 EcoPoints awarded.", "citizen");
  };

  const recordHotspotAction = (hotspotId, action, note = "") => {
    const entry = {
      id: `ACT-${Date.now()}`,
      action,
      note,
      createdAt: new Date().toISOString(),
      actor: currentUser.name || "Municipal team"
    };
    setHotspotActions(prev => ({
      ...prev,
      [hotspotId]: [...(prev[hotspotId] || []), entry]
    }));
    addNotification("Hotspot intervention recorded", `${action} logged for hotspot ${hotspotId}.`, "admin");
  };

  const resetToDemoData = () => {
    setReports(INITIAL_REPORTS);
    setVehicles(INITIAL_VEHICLES);
    setCurrentUser(DEMO_USERS.citizen);
    setSettings(DEFAULT_SETTINGS);
    setEvents(CLEANUP_EVENTS);
    setHotspotActions({});
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    addNotification("Demo Data Reset", "System successfully restored to initial demo state.", "all");
  };

  const value = {
    reports,
    vehicles,
    currentUser,
    notifications,
    settings,
    events,
    hotspotActions,
    setSettings,
    switchRole,
    loginAs,
    submitReport,
    verifyReport,
    rejectReport,
    assignVehicleToReport,
    updateDriverTaskStatus,
    resolveReport,
    rsvpEvent,
    recordHotspotAction,
    resetToDemoData,
    addNotification,
    markAllNotificationsRead,
    citizenLeaderboard: CITIZEN_LEADERBOARD,
    wardStatistics: WARD_STATISTICS
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
