import React from 'react';
import { supabase } from '../lib/supabaseClient';

// Icons
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const InventoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default function Dashboard() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-[#111827] text-gray-100 font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1f2937]/50 border-r border-gray-700 backdrop-blur-sm flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-cyan-400">LIGHT</span>
            <span className="text-gray-300"> NORTH</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm font-medium bg-gray-800/50 text-cyan-400 rounded-lg border border-gray-700">
            <DashboardIcon />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-gray-100 hover:bg-gray-800/30 rounded-lg transition-colors">
            <InventoryIcon />
            Inventory
          </a>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-400 hover:text-red-400 transition-colors w-full"
          >
            <LogoutIcon />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 border-b border-gray-700 bg-[#1f2937]/30 backdrop-blur-sm flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold text-gray-100">Inventory Overview</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search items..."
                className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 w-64"
              />
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center text-xs font-bold text-white">
              AD
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Total Items', value: '124', color: 'text-cyan-400' },
              { label: 'Low Stock', value: '8', color: 'text-yellow-400' },
              { label: 'Total Value', value: '₱45,200', color: 'text-emerald-400' },
            ].map((stat, index) => (
              <div key={index} className="bg-[#1f2937]/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
                <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
                <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-200">All Items</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-cyan-500/20">
              <PlusIcon />
              Add New Item
            </button>
          </div>

          {/* Table */}
          <div className="bg-[#1f2937]/50 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-gray-800/50 text-gray-200 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Item Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {[
                  { name: 'Shure SM58 Microphone', category: 'Audio', qty: 4, status: 'In Use' },
                  { name: 'XLR Cable (20ft)', category: 'Cables', qty: 12, status: 'Available' },
                  { name: 'Yamaha Acoustic Guitar', category: 'Instruments', qty: 1, status: 'Maintenance' },
                  { name: 'HDMI Splitter', category: 'Video', qty: 2, status: 'Available' },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-200">{item.name}</td>
                    <td className="px-6 py-4">{item.category}</td>
                    <td className="px-6 py-4">{item.qty}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'Available' ? 'bg-green-900/30 text-green-400 border border-green-900' :
                        item.status === 'In Use' ? 'bg-blue-900/30 text-blue-400 border border-blue-900' :
                        'bg-yellow-900/30 text-yellow-400 border border-yellow-900'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-cyan-400 hover:text-cyan-300 font-medium">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
