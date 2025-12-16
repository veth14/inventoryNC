import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { MenuIcon } from './Icons';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export default function Layout({ children, onLogout }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 font-sans flex relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <Sidebar 
        onLogout={onLogout} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main area: scrollable page content */}
      <div className="flex-1 flex flex-col h-screen w-full">
        
        <main className="flex-1 overflow-auto z-10 relative"> 
          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden absolute top-4 left-4 z-50 p-2 text-gray-400 hover:text-white bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-lg shadow-lg"
          >
            <MenuIcon />
          </button>
          {children}
        </main>
      </div>
    </div>
  );
}
