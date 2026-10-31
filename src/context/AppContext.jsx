import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext.jsx';
import api from '../services/api.js';
import { CITIZEN_LEADERBOARD, WARD_STATISTICS, CLEANUP_EVENTS } from '../services/mockData.js';

const AppContext = createContext(null);
const SETTINGS_KEY = 'fixmyarea_client_preferences';
const HOTSPOT_KEY = 'fixmyarea_hotspot_notes';

function getStoredValue(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function toUiUser(user) {
  if (!user) return null;
  return {
    ...user,
    role: user.role === 'administrator' ? 'admin' : user.role,
    avatar: user.avatarUrl || null,
    phone: user.phoneNumber || null
  };
}

const defaultSettings = {
  duplicateThresholdMeters: 100,
  slaCriticalHours: 2,
  slaHighHours: 6,
  slaMediumHours: 24,
  autoVerifyWqiOver75: false
};

export function AppProvider({ children }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [settings, setSettingsState] = useState(() => getStoredValue(SETTINGS_KEY, defaultSettings));
  const [events, setEvents] = useState(CLEANUP_EVENTS);
  const [hotspotActions, setHotspotActions] = useState(() => getStoredValue(HOTSPOT_KEY, {}));

  const reportsQuery = useQuery({
    queryKey: ['reports', user?.id, user?.role],
    queryFn: async () => (await api.get('/reports')).data.reports,
    enabled: Boolean(user),
    staleTime: 20_000
  });
  const vehiclesQuery = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => (await api.get('/vehicles')).data.vehicles,
    enabled: Boolean(user),
    staleTime: 30_000
  });
  const notificationsQuery = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => (await api.get('/notifications')).data.notifications,
    enabled: Boolean(user),
    staleTime: 15_000
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem(HOTSPOT_KEY, JSON.stringify(hotspotActions));
  }, [hotspotActions]);
  useEffect(() => {
    if (!user) return undefined;
    const origin = (import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
    const socket = io(origin, { withCredentials: true, transports: ['websocket', 'polling'] });
    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    };
    socket.on('notification:new', refresh);
    socket.on('report:changed', refresh);
    return () => socket.disconnect();
  }, [user, queryClient]);

  const refreshServerState = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['reports'] });
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
    queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    queryClient.invalidateQueries({ queryKey: ['routes'] });
  }, [queryClient]);
  const setSettings = useCallback((next) => setSettingsState((current) => typeof next === 'function' ? next(current) : next), []);

  const createReport = useMutation({
    mutationFn: async ({ file, title, category, description, location, idempotencyKey }) => {
      const form = new FormData();
      form.append('image', file);
      if (title) form.append('title', title);
      if (category) form.append('category', category);
      if (description) form.append('description', description);
      form.append('locationLabel', location.address);
      if (location.ward) form.append('ward', location.ward);
      if (Number.isFinite(location.lat)) form.append('latitude', String(location.lat));
      if (Number.isFinite(location.lng)) form.append('longitude', String(location.lng));
      form.append('idempotencyKey', idempotencyKey || crypto.randomUUID().replaceAll('-', ''));
      return (await api.post('/reports', form)).data.report;
    },
    onSuccess: refreshServerState
  });
  const updateStatus = useMutation({
    mutationFn: async ({ reportId, status, note }) => (await api.patch('/reports/' + reportId + '/status', { status, note })).data.report,
    onSuccess: refreshServerState
  });
  const verify = useMutation({
    mutationFn: async ({ reportId, action, ...details }) => (await api.patch('/admin/reports/' + reportId + '/verify', { action, ...details })).data.report,
    onSuccess: refreshServerState
  });
  const assignment = useMutation({
    mutationFn: async ({ reportId, vehicleId, note }) => (await api.patch('/reports/' + reportId + '/assign', { vehicleId, note })).data.report,
    onSuccess: refreshServerState
  });

  const markAllNotificationsRead = useCallback(async () => {
    const unread = (notificationsQuery.data || []).filter((item) => !item.read);
    await Promise.all(unread.map((item) => api.patch('/notifications/' + item.id + '/read')));
    await queryClient.invalidateQueries({ queryKey: ['notifications'] });
  }, [notificationsQuery.data, queryClient]);
  const rsvpEvent = useCallback((eventId) => {
    setEvents((current) => current.map((event) => event.id === eventId ? { ...event, volunteersCount: event.volunteersCount + 1, isJoined: true } : event));
  }, []);
  const recordHotspotAction = useCallback((hotspotId, action, note = '') => {
    setHotspotActions((current) => ({
      ...current,
      [hotspotId]: [...(current[hotspotId] || []), { id: 'ACT-' + Date.now(), action, note, createdAt: new Date().toISOString(), actor: user?.name || 'Municipal team' }]
    }));
  }, [user]);
  const optimizeRoutes = useCallback(async (payload) => {
    const result = (await api.post('/routes/optimize', payload)).data;
    refreshServerState();
    return result;
  }, [refreshServerState]);

  const value = useMemo(() => ({
    reports: reportsQuery.data || [],
    vehicles: vehiclesQuery.data || [],
    currentUser: toUiUser(user),
    notifications: notificationsQuery.data || [],
    settings,
    events,
    hotspotActions,
    isLoading: reportsQuery.isLoading || vehiclesQuery.isLoading,
    serverError: reportsQuery.error || vehiclesQuery.error || notificationsQuery.error,
    setSettings,
    submitReport: createReport.mutateAsync,
    verifyReport: (reportId, details = {}) => verify.mutateAsync({ reportId, action: 'verify', ...details }),
    rejectReport: (reportId, reason) => verify.mutateAsync({ reportId, action: 'reject', reason }),
    assignVehicleToReport: (reportId, vehicleId, note) => assignment.mutateAsync({ reportId, vehicleId, note }),
    updateDriverTaskStatus: (reportId, status, options = {}) => updateStatus.mutateAsync({ reportId, status, note: options.note }),
    resolveReport: (reportId) => updateStatus.mutateAsync({ reportId, status: 'resolved', note: 'Final municipal inspection verified the report as resolved.' }),
    markAllNotificationsRead,
    rsvpEvent,
    recordHotspotAction,
    refreshServerState,
    optimizeRoutes,
    resetToDemoData: refreshServerState,
    citizenLeaderboard: CITIZEN_LEADERBOARD,
    wardStatistics: WARD_STATISTICS
  }), [reportsQuery.data, vehiclesQuery.data, notificationsQuery.data, reportsQuery.isLoading, vehiclesQuery.isLoading, reportsQuery.error, vehiclesQuery.error, notificationsQuery.error, user, settings, events, hotspotActions, setSettings, createReport.mutateAsync, verify.mutateAsync, assignment.mutateAsync, updateStatus.mutateAsync, markAllNotificationsRead, rsvpEvent, recordHotspotAction, refreshServerState, optimizeRoutes]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
