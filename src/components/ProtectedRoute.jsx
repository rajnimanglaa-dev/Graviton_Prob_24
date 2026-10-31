import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ roles }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen bg-[#101A17] text-[#8BE0B0] grid place-items-center">Loading secure session…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}
