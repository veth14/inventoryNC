import React from 'react';
import Layout from '../Components/Layout';
import { supabase } from '../lib/supabaseClient';
import { CurrencyIcon, WrenchIcon, AlertIcon, BoxIcon } from '../Components/Icons';

export default function Reports() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Mock Data for Reports
  const reportData = {
    totalAssetValue: 450000,
    maintenanceCostYTD: 12500,
    itemsToReplace: 5,
    totalItems: 142,
    categoryBreakdown: [
      { name: 'Audio', value: 45, color: 'bg-blue-500' },
      { name: 'Lighting', value: 30, color: 'bg-purple-500' },
      { name: 'Instruments', value: 15, color: 'bg-amber-500' },
      { name: 'Cables/Misc', value: 10, color: 'bg-gray-500' },
    ],
    recentMaintenanceCosts: [
      { id: 1, item: 'Yamaha Acoustic Guitar', date: '2023-01-20', cost: 2500, type: 'Setup' },
      { id: 2, item: 'Shure SM58', date: '2023-03-15', cost: 0, type: 'Repair (In-house)' },
      { id: 3, item: 'DMX Controller', date: '2023-06-10', cost: 1500, type: 'Part Replacement' },
      { id: 4, item: 'Bass Amp', date: '2023-08-05', cost: 3500, type: 'Tube Replacement' },
      { id: 5, item: 'XLR Cables (Batch)', date: '2023-11-01', cost: 5000, type: 'New Purchase' },
    ],
    endOfLifeItems: [
      { id: 1, name: 'Behringer Mixer', reason: 'Obsolete / No Parts', replacementCost: 25000 },
      { id: 2, name: 'Projector Bulb', reason: 'Dimming', replacementCost: 8000 },
      { id: 3, name: 'Drum Heads', reason: 'Worn Out', replacementCost: 4500 },
    ]
  };

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString()}`;
  };

  return (
    <Layout onLogout={handleLogout}>
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-gray-400 mt-1">Financial overview and asset health summary.</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1e293b]/60 border border-gray-800 p-5 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                <CurrencyIcon />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Asset Value</p>
                <h3 className="text-2xl font-bold text-white mt-1">{formatCurrency(reportData.totalAssetValue)}</h3>
              </div>
            </div>
          </div>

          <div className="bg-[#1e293b]/60 border border-gray-800 p-5 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400">
                <WrenchIcon />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Maintenance (YTD)</p>
                <h3 className="text-2xl font-bold text-white mt-1">{formatCurrency(reportData.maintenanceCostYTD)}</h3>
              </div>
            </div>
          </div>

          <div className="bg-[#1e293b]/60 border border-gray-800 p-5 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-500/10 rounded-lg text-rose-400">
                <AlertIcon />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">End of Life Items</p>
                <h3 className="text-2xl font-bold text-white mt-1">{reportData.itemsToReplace} Items</h3>
              </div>
            </div>
          </div>

          <div className="bg-[#1e293b]/60 border border-gray-800 p-5 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                <BoxIcon />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Inventory</p>
                <h3 className="text-2xl font-bold text-white mt-1">{reportData.totalItems} Items</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Breakdown */}
          <div className="bg-[#1e293b]/40 border border-gray-800/50 rounded-xl p-6 backdrop-blur-sm lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-6">Asset Distribution</h3>
            <div className="space-y-4">
              {reportData.categoryBreakdown.map((cat) => (
                <div key={cat.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{cat.name}</span>
                    <span className="text-gray-400">{cat.value}%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div 
                      className={`${cat.color} h-2 rounded-full transition-all duration-500`} 
                      style={{ width: `${cat.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg">
              <p className="text-xs text-blue-300 leading-relaxed">
                <span className="font-bold">Insight:</span> Audio equipment accounts for nearly half of the total inventory value. Consider allocating more budget for maintenance in this category.
              </p>
            </div>
          </div>

          {/* Recent Maintenance Costs Table */}
          <div className="bg-[#1e293b]/40 border border-gray-800/50 rounded-xl overflow-hidden backdrop-blur-sm lg:col-span-2 flex flex-col">
            <div className="p-6 border-b border-gray-800/50 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Recent Maintenance Costs</h3>
              <button className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">View All</button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-gray-900/50 text-gray-300 font-medium border-b border-gray-800/50">
                  <tr>
                    <th className="px-6 py-3">Item</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {reportData.recentMaintenanceCosts.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-3 font-medium text-gray-200">{log.item}</td>
                      <td className="px-6 py-3">{log.type}</td>
                      <td className="px-6 py-3 font-mono text-xs">{log.date}</td>
                      <td className="px-6 py-3 text-right font-mono text-gray-200">{formatCurrency(log.cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* End of Life / Replacement Forecast */}
        <div className="bg-[#1e293b]/40 border border-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Replacement Forecast (Priority)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportData.endOfLifeItems.map((item) => (
              <div key={item.id} className="bg-gray-900/40 border border-gray-700/50 rounded-lg p-4 hover:border-rose-500/30 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-200 group-hover:text-white transition-colors">{item.name}</h4>
                  <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20">
                    Needs Replace
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-3">Reason: {item.reason}</p>
                <div className="flex justify-between items-center pt-3 border-t border-gray-700/50">
                  <span className="text-xs text-gray-500">Est. Cost</span>
                  <span className="font-mono font-medium text-gray-200">{formatCurrency(item.replacementCost)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
}
