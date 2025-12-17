import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, ScanIcon, FileTextIcon, AlertIcon, WrenchIcon, InventoryIcon, ChartBarIcon } from './Icons';

const QuickActionCard = ({ icon: Icon, title, description, onClick, colorClass }: any) => (
  <button 
    onClick={onClick}
    className={`group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 text-left transition-all hover:border-slate-600 hover:bg-slate-800 hover:shadow-lg hover:shadow-${colorClass}-500/10`}
  >
    <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-${colorClass}-500/10 blur-2xl transition-all group-hover:bg-${colorClass}-500/20`} />
    
    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-${colorClass}-500/10 text-${colorClass}-400 ring-1 ring-${colorClass}-500/20 group-hover:scale-110 transition-transform`}>
      <Icon />
    </div>
    
    <h3 className="mb-1 text-lg font-semibold text-slate-100">{title}</h3>
    <p className="text-sm text-slate-400">{description}</p>
  </button>
);

const AlertItem = ({ title, message, type, className = '' }: { title: string, message: string, type: 'warning' | 'info', className?: string }) => (
  <div className={`flex items-center gap-4 rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 transition-colors hover:bg-slate-800/50 ${className}`}>
    <div className={`shrink-0 rounded-full p-2 ${type === 'warning' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'}`}>
      {type === 'warning' ? <AlertIcon /> : <WrenchIcon />}
    </div>
    <div>
      <h4 className="font-medium text-slate-200">{title}</h4>
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  </div>
);

export const DashboardWidgets = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Quick Actions Section - Spans 2 columns on large screens */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-xl font-bold text-slate-100">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <QuickActionCard 
            icon={PlusIcon}
            title="Add New Item"
            description="Register new equipment into the inventory system."
            colorClass="cyan"
            onClick={() => navigate('/inventory', { state: { openAddModal: true } })}
          />
          <QuickActionCard 
            icon={AlertIcon}
            title="Report Issue"
            description="Log a maintenance issue or broken equipment."
            colorClass="orange"
            onClick={() => navigate('/maintenance', { state: { openLogIssueModal: true } })}
          />
          <QuickActionCard 
            icon={InventoryIcon}
            title="View Inventory"
            description="Browse and manage all church equipment."
            colorClass="purple"
            onClick={() => navigate('/inventory')}
          />
          <QuickActionCard 
            icon={ChartBarIcon}
            title="View Reports"
            description="Analyze inventory status and maintenance costs."
            colorClass="emerald"
            onClick={() => navigate('/reports')}
          />
        </div>
      </div>

      {/* Alerts Section */}
      <div className="flex flex-col h-full space-y-4">
        <h2 className="text-xl font-bold text-slate-100">System Alerts</h2>
        <div className="flex-1 flex flex-col gap-4">
          <AlertItem 
            title="Low Stock Warning"
            message="XLR Cables (10ft) are running low. Only 2 units remaining."
            type="warning"
            className="flex-1"
          />
          <AlertItem 
            title="Maintenance Due"
            message="Main Speaker L requires quarterly inspection."
            type="info"
            className="flex-1"
          />
           <AlertItem 
            title="Unreturned Item"
            message="Shure SM58 Microphone was expected yesterday."
            type="warning"
            className="flex-1"
          />
        </div>
      </div>

    </div>
  );
};
