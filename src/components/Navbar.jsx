import React, { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Camera, ChevronDown, Menu, Shield, Truck, UserRound, X } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import Logo from './UI/Logo.jsx';
import ThemeToggle from './UI/ThemeToggle.jsx';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, switchRole } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [switchingRole, setSwitchingRole] = useState('');
  const [portalError, setPortalError] = useState('');
  const portalMenuRef = useRef(null);
  const navLinks = [
    { label: 'Home', path: '/' }, { label: 'About', path: '/about' },
    { label: 'How it works', path: '/how-it-works' }, { label: 'Live map', path: '/live-map' },
    { label: 'SMS simulator', path: '/sms-simulator' }
  ];
  const portalPath = currentUser?.role === 'admin' ? '/admin/overview' : currentUser?.role === 'driver' ? '/driver/overview' : '/citizen/dashboard';
  const portalLabel = currentUser?.role === 'admin' ? 'Admin' : currentUser?.role === 'driver' ? 'Driver' : 'Citizen';
  const portals = [
    { label: 'Citizen portal', role: 'citizen', path: '/citizen/dashboard', Icon: UserRound },
    { label: 'Administrator portal', role: 'admin', path: '/admin/overview', Icon: Shield },
    { label: 'Driver portal', role: 'driver', path: '/driver/overview', Icon: Truck }
  ];

  const openDemoPortal = async (portal) => {
    setPortalError('');
    setSwitchingRole(portal.role);
    try {
      await switchRole(portal.role);
      setMobileMenuOpen(false);
      if (portalMenuRef.current) portalMenuRef.current.open = false;
      navigate(portal.path);
    } catch (error) {
      setPortalError(error.userMessage || error.message || 'Could not open this demo portal. Make sure the local API is running.');
    } finally {
      setSwitchingRole('');
    }
  };
  return (
    <header className="sticky top-0 z-40 bg-[#101A17]/90 backdrop-blur-xl border-b border-[#273b33] transition-colors">
      <div className="bg-[#142820] text-[#A5B3AA] text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-[#1D2B25]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#16A36A] shadow-[0_0_8px_#16A36A]" />
          <span className="truncate"><strong className="text-[#F5F7F5]">Click 2 Clean</strong> · {currentUser ? <>signed in as <span className="text-[#8BE0B0] font-bold capitalize">{currentUser.role}</span></> : 'secure reporting and municipal operations'}</span>
        </div>
        <Link to={currentUser ? portalPath : '/login'} className="text-[#8BE0B0] font-bold hover:text-white shrink-0">{currentUser ? 'Open portal' : 'Sign in'}</Link>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[4.5rem] flex items-center justify-between gap-6">
        <Link to="/" aria-label="Click 2 Clean home" className="shrink-0"><Logo size="md" showTagline={false} /></Link>
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => <Link key={link.path} to={link.path} aria-current={location.pathname === link.path ? 'page' : undefined} className={'px-3 py-2 rounded-xl text-[13px] font-semibold transition ' + (location.pathname === link.path ? 'text-[#8BE0B0] bg-[#1D2B25]' : 'text-[#A5B3AA] hover:text-[#F5F7F5] hover:bg-[#142820]')}>{link.label}</Link>)}
        </nav>
        <div className="hidden sm:flex items-center gap-2.5">
          <ThemeToggle />
          <details ref={portalMenuRef} className="relative">
            <summary className="list-none cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#142820] text-[#F5F7F5] hover:bg-[#1D2B25] text-xs font-bold border border-[#273b33] transition [&::-webkit-details-marker]:hidden">
              Portals <ChevronDown size={14} />
            </summary>
            <div className="absolute right-0 top-full mt-2 w-64 p-2 rounded-2xl bg-[#1D2B25] border border-[#273b33] shadow-2xl z-50">
              <p className="px-2.5 pt-1 pb-2 text-[10px] uppercase tracking-wider font-bold text-[#A5B3AA]">Open a demo portal</p>
              {portals.map(({ Icon, ...portal }) => <button key={portal.role} type="button" disabled={Boolean(switchingRole)} onClick={() => openDemoPortal(portal)} className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-left text-xs font-semibold text-[#F5F7F5] hover:bg-[#142820] disabled:opacity-50">
                <Icon size={15} className="text-[#8BE0B0]" />
                <span className="flex-1">{switchingRole === portal.role ? 'Opening…' : portal.label}</span>
                {currentUser?.role === portal.role && <span className="text-[9px] text-[#8BE0B0]">ACTIVE</span>}
              </button>)}
              {portalError && <p role="alert" className="px-2.5 py-2 text-[11px] text-red-300">{portalError}</p>}
            </div>
          </details>
          <Link to={currentUser ? '/citizen/report' : '/login'} className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#142820] text-[#8BE0B0] hover:bg-[#1D2B25] text-xs font-bold border border-[#273b33] hover:border-[#16A36A]/60 transition"><Camera size={15} /><span>Report waste</span></Link>
          <Link to={currentUser ? portalPath : '/login'} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16A36A] text-white hover:bg-[#0f7a4e] text-xs font-bold shadow-lg shadow-[#16A36A]/20 transition group"><span>{currentUser ? portalLabel + ' portal' : 'Sign in'}</span><ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></Link>
        </div>
        <div className="sm:hidden flex items-center gap-2"><ThemeToggle compact /><button type="button" onClick={() => setMobileMenuOpen((open) => !open)} aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} className="p-2 rounded-xl text-[#A5B3AA] hover:text-white hover:bg-[#1D2B25]">{mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}</button></div>
      </div>
      {mobileMenuOpen && <div className="md:hidden bg-[#142820] border-b border-[#273b33] px-4 pt-2 pb-4 space-y-1.5">
        {navLinks.map((link) => <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-[#A5B3AA] hover:text-white hover:bg-[#1D2B25]">{link.label}</Link>)}
        <div className="pt-3 mt-2 border-t border-[#273b33]">
          <p className="px-1 pb-2 text-[10px] uppercase tracking-wider font-bold text-[#A5B3AA]">Demo portals</p>
          <div className="grid grid-cols-1 gap-1">{portals.map(({ Icon, ...portal }) => <button key={portal.role} type="button" disabled={Boolean(switchingRole)} onClick={() => openDemoPortal(portal)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm font-semibold text-[#F5F7F5] hover:bg-[#1D2B25] disabled:opacity-50"><Icon size={16} className="text-[#8BE0B0]" />{switchingRole === portal.role ? 'Opening…' : portal.label}</button>)}</div>
          {portalError && <p role="alert" className="px-1 py-2 text-xs text-red-300">{portalError}</p>}
        </div>
        <div className="pt-3 mt-2 border-t border-[#273b33] grid grid-cols-2 gap-2"><Link to={currentUser ? '/citizen/report' : '/login'} onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl text-center text-sm font-bold bg-[#1D2B25] text-[#8BE0B0] border border-[#273b33]">Report waste</Link><Link to={currentUser ? portalPath : '/login'} onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl text-center text-sm font-bold bg-[#16A36A] text-white">{currentUser ? portalLabel + ' portal' : 'Sign in'}</Link></div>
      </div>}
    </header>
  );
}
