import React from 'react';
import { NavLink } from 'react-router-dom';
import { DashboardIcon, InventoryIcon, LogoutIcon, CloseIcon, ChartBarIcon } from './Icons';

interface SidebarProps {
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ onLogout, isOpen, onClose }: SidebarProps) {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "group flex items-center gap-3 px-3 py-2.5 text-sm font-medium bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
      : "group flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-400 hover:text-gray-100 hover:bg-gray-800/40 rounded-xl transition-all duration-200";

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-64 h-[calc(100vh-2rem)] m-4 
        bg-[#1e293b]/90 md:bg-[#1e293b]/60 
        border border-gray-800/50 backdrop-blur-xl 
        flex flex-col rounded-2xl shadow-2xl shrink-0
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-[150%] md:translate-x-0'}
      `}>
        <div className="p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white md:hidden"
          >
            <CloseIcon />
          </button>

          <h1 className="text-xl font-bold tracking-tight flex flex-col">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">WORSHIP TEAM</span>
            <span className="text-gray-400 text-sm font-medium tracking-widest">INVENTORY SYSTEM</span>
          </h1>
        </div>

        <nav className="flex-1 px-3 space-y-1.5">
          <NavLink to="/" className={linkClass} onClick={() => window.innerWidth < 768 && onClose()}>
            <DashboardIcon />
            Dashboard
          </NavLink>
          <NavLink to="/inventory" className={linkClass} onClick={() => window.innerWidth < 768 && onClose()}>
            <InventoryIcon />
            Inventory
          </NavLink>
          <NavLink to="/maintenance" className={linkClass} onClick={() => window.innerWidth < 768 && onClose()}>
            <div className="w-5 h-5 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            Maintenance
          </NavLink>
          <NavLink to="/reports" className={linkClass} onClick={() => window.innerWidth < 768 && onClose()}>
            <ChartBarIcon />
            Reports
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-800/50">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-2 rounded-xl bg-gray-800/30 border border-gray-700/30">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@lightnorth.com</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-red-400 transition-colors w-full hover:bg-red-500/5 rounded-lg"
          >
            <LogoutIcon />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
