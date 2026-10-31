import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Check, ChevronDown, Globe, LogOut, Menu, Shield, Truck, UserRound } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function AppHeader({ onToggleSidebar }) {
  const { currentUser, notifications, markAllNotificationsRead, switchRole } = useApp();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [switchingRole, setSwitchingRole] = useState('');
  const [portalError, setPortalError] = useState('');
  const portalMenuRef = useRef(null);
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const portalTitle = currentUser.role === 'admin' ? 'Municipal Command Centre' : currentUser.role === 'driver' ? 'Driver Fleet Console' : 'Citizen Waste Portal';
  const portals = [
    { label: 'Citizen', role: 'citizen', path: '/citizen/dashboard', Icon: UserRound },
    { label: 'Administrator', role: 'admin', path: '/admin/overview', Icon: Shield },
    { label: 'Driver', role: 'driver', path: '/driver/overview', Icon: Truck }
  ];
  const openPortal = async (portal) => {
    setPortalError('');
    setSwitchingRole(portal.role);
    try {
      await switchRole(portal.role);
      if (portalMenuRef.current) portalMenuRef.current.open = false;
      navigate(portal.path);
    } catch (error) {
      setPortalError(error.userMessage || error.message || 'Could not switch portal. Make sure the local API is running.');
    } finally {
      setSwitchingRole('');
    }
  };

  return (
    <header className="h-16 bg-[#142820]/90 backdrop-blur-md border-b border-[#273b33] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} aria-label="Toggle sidebar menu" className="lg:hidden p-2 rounded-lg text-[#A5B3AA] hover:bg-[#1D2B25] hover:text-white"><Menu size={20} /></button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-[#F5F7F5] font-heading">{portalTitle}</h1>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#1D2B25] border border-[#273b33] text-[#8BE0B0]">{currentUser.role}</span>
          </div>
          <p className="text-[11px] text-[#A5B3AA] hidden md:block">Click 2 Clean • authenticated municipal workflow</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <details ref={portalMenuRef} className="relative">
          <summary className="list-none cursor-pointer inline-flex items-center gap-1 px-2.5 py-2 rounded-xl border border-[#273b33] bg-[#1D2B25] text-[#F5F7F5] hover:text-[#8BE0B0] text-xs font-semibold [&::-webkit-details-marker]:hidden"><span className="hidden sm:inline">Switch portal</span><span className="sm:hidden">Portals</span><ChevronDown size={13} /></summary>
          <div className="absolute right-0 top-full mt-2 w-56 p-2 rounded-2xl bg-[#1D2B25] border border-[#273b33] shadow-2xl z-50">
            {portals.map(({ Icon, ...portal }) => <button key={portal.role} type="button" disabled={Boolean(switchingRole)} onClick={() => openPortal(portal)} className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-left text-xs font-semibold text-[#F5F7F5] hover:bg-[#142820] disabled:opacity-50"><Icon size={15} className="text-[#8BE0B0]" /><span className="flex-1">{switchingRole === portal.role ? 'Opening…' : portal.label}</span>{currentUser.role === portal.role && <span className="text-[9px] text-[#8BE0B0]">ACTIVE</span>}</button>)}
            {portalError && <p role="alert" className="px-2.5 py-2 text-[11px] text-red-300">{portalError}</p>}
          </div>
        </details>
        <Link to="/" title="Go to public website" className="p-2 rounded-xl text-[#A5B3AA] hover:bg-[#1D2B25] hover:text-[#8BE0B0] transition text-xs font-semibold hidden sm:flex items-center gap-1.5"><Globe size={16} /><span>Public Site</span></Link>
        <div className="relative">
          <button onClick={() => setShowNotifications((open) => !open)} aria-label="Toggle notifications menu" className="p-2 rounded-xl text-[#A5B3AA] hover:bg-[#1D2B25] hover:text-white relative transition">
            <Bell size={18} />
            {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>}
          </button>
          {showNotifications && <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1D2B25] rounded-2xl shadow-2xl border border-[#273b33] overflow-hidden z-50">
            <div className="p-3.5 bg-[#142820] text-white flex items-center justify-between border-b border-[#273b33]">
              <span className="text-xs font-bold text-[#F5F7F5] font-heading">Notifications ({notifications.length})</span>
              {unreadCount > 0 && <button onClick={markAllNotificationsRead} className="text-[11px] text-[#8BE0B0] hover:text-white flex items-center gap-1"><Check size={13} /><span>Mark all read</span></button>}
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-[#273b33]">
              {notifications.length === 0 ? <div className="p-6 text-center text-xs text-[#A5B3AA]">No new alerts</div> : notifications.map((notification) => (
                <div key={notification.id} className={!notification.read ? 'p-3 text-xs bg-[#16A36A]/10' : 'p-3 text-xs bg-[#1D2B25] hover:bg-[#24362f]'}>
                  <div className="flex items-center justify-between mb-1"><strong className="text-[#F5F7F5] font-bold">{notification.title}</strong><span className="text-[10px] text-[#A5B3AA] font-mono">{new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
                  <p className="text-[#A5B3AA] text-[11px] leading-relaxed">{notification.message}</p>
                </div>
              ))}
            </div>
          </div>}
        </div>
        <div className="flex items-center gap-2 pl-2 border-l border-[#273b33]">
          <img src={currentUser.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover border border-[#16A36A]" />
          <div className="hidden xl:block text-left text-xs"><div className="font-bold text-[#F5F7F5] line-clamp-1">{currentUser.name}</div><div className="text-[10px] text-[#8BE0B0] capitalize">{currentUser.role}</div></div>
          <button onClick={logout} title="Sign out" className="p-2 rounded-xl text-[#A5B3AA] hover:bg-[#1D2B25] hover:text-white transition"><LogOut size={16} /></button>
        </div>
      </div>
    </header>
  );
}
