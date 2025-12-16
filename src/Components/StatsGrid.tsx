import React from 'react';
import { BoxIcon, AlertIcon, WrenchIcon } from './Icons';

export default function StatsGrid() {
  const stats = [
    { label: 'Total Tracked', value: '124', color: 'text-cyan-400', bg: 'from-cyan-500/20 to-blue-500/5', border: 'border-cyan-500/20', icon: <BoxIcon /> },
    { label: 'Need Maintenance', value: '8', color: 'text-amber-400', bg: 'from-amber-500/20 to-orange-500/5', border: 'border-amber-500/20', icon: <WrenchIcon /> },
    { label: 'Needs Replacement', value: '5', color: 'text-rose-400', bg: 'from-rose-500/20 to-pink-500/5', border: 'border-rose-500/20', icon: <AlertIcon /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className={`relative overflow-hidden bg-gradient-to-br ${stat.bg} border ${stat.border} rounded-xl p-5 backdrop-blur-sm transition-transform hover:scale-[1.02] duration-300`}>
          <div className="absolute right-4 top-4 p-1.5 bg-white/5 rounded-lg">
            {stat.icon}
          </div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{stat.label}</p>
          <p className={`text-3xl font-bold mt-2 ${stat.color} tracking-tight`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
