import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, Globe, LogOut, Menu } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function AppHeader({ onToggleSidebar }) {
  const { currentUser, notifications, markAllNotificationsRead } = useApp();
  const { logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const portalTitle = currentUser.role === 'admin' ? 'Municipal Command Centre' : currentUser.role === 'driver' ? 'Driver Fleet Console' : 'Citizen Waste Portal';

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
