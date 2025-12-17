import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import Layout from '../Components/Layout';
import { supabase } from '../lib/supabaseClient';
import { CurrencyIcon, WrenchIcon, AlertIcon, BoxIcon, ChartBarIcon } from '../Components/Icons';

interface ReportsProps {
  session: Session | null;
}

export default function Reports({ session }: ReportsProps) {
  const [reportData, setReportData] = useState({
    totalAssetValue: 0,
    maintenanceCostYTD: 0,
    itemsToReplace: 0,
    totalItems: 0,
    categoryBreakdown: [] as { name: string, value: number, color: string }[],
    recentMaintenanceCosts: [] as any[],
    endOfLifeItems: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      // 1. Total Asset Value (Sum of price from acquisitions)
      const { data: acquisitions, error: acqError } = await supabase
        .from('inventory_item_acquisitions')
        .select('price');
      
      const totalAssetValue = acquisitions?.reduce((sum, item) => sum + (item.price || 0), 0) || 0;

      // 2. Maintenance Cost YTD
      const currentYear = new Date().getFullYear();
      const startOfYear = `${currentYear}-01-01`;
      const { data: maintenance, error: maintError } = await supabase
        .from('inventory_item_maintenance')
        .select('cost, maintenance_date, item_id, maintenance_type, inventory_items(item_name)')
        .gte('maintenance_date', startOfYear)
        .order('maintenance_date', { ascending: false });
      
      const maintenanceCostYTD = maintenance?.reduce((sum, item) => sum + (item.cost || 0), 0) || 0;

      // 3. Items to Replace (Condition = Broken or Needs Repair)
      const { data: items, error: itemsError } = await supabase
        .from('inventory_items')
        .select('id, item_name, condition, category');
      
      const itemsToReplace = items?.filter(i => i.condition === 'Broken' || i.condition === 'Needs Repair').length || 0;
      const totalItems = items?.length || 0;

      // 4. Category Breakdown
      const categories: Record<string, number> = {};
      items?.forEach(item => {
        categories[item.category] = (categories[item.category] || 0) + 1;
      });
      
      const categoryBreakdown = Object.entries(categories).map(([name, value], index) => ({
        name,
        value,
        color: ['bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-gray-500', 'bg-emerald-500', 'bg-rose-500'][index % 6]
      }));

      // 5. Recent Maintenance Costs
      const recentMaintenanceCosts = maintenance?.slice(0, 5).map((m: any, index: number) => ({
        id: index,
        item: m.inventory_items?.item_name || 'Unknown Item',
        date: m.maintenance_date,
        cost: m.cost,
        type: m.maintenance_type
      })) || [];

      // 6. End of Life Items (Broken)
      const endOfLifeItems = items?.filter(i => i.condition === 'Broken').map((i: any) => ({
        id: i.id,
        name: i.item_name,
        reason: 'Broken / End of Life',
        replacementCost: 0 
      })) || [];

      setReportData({
        totalAssetValue,
        maintenanceCostYTD,
        itemsToReplace,
        totalItems,
        categoryBreakdown,
        recentMaintenanceCosts,
        endOfLifeItems
      });

    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString()}`;
  };

  return (
    <Layout onLogout={handleLogout} user={session?.user || null}>
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl text-purple-400 border border-purple-500/20 shadow-lg shadow-purple-500/10 flex items-center justify-center">
            <ChartBarIcon />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Reports & Analytics
            </h1>
            <p className="text-sm text-gray-400 mt-1">Financial overview and asset health summary.</p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="group bg-[#1e293b]/60 border border-gray-800 hover:border-emerald-500/30 p-5 rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                <CurrencyIcon />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Asset Value</p>
                <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-emerald-400 transition-colors">{formatCurrency(reportData.totalAssetValue)}</h3>
              </div>
            </div>
          </div>

          <div className="group bg-[#1e293b]/60 border border-gray-800 hover:border-orange-500/30 p-5 rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400 group-hover:scale-110 transition-transform duration-300">
                <WrenchIcon />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Maintenance (YTD)</p>
                <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-orange-400 transition-colors">{formatCurrency(reportData.maintenanceCostYTD)}</h3>
              </div>
            </div>
          </div>

          <div className="group bg-[#1e293b]/60 border border-gray-800 hover:border-rose-500/30 p-5 rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(244,63,94,0.1)]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-500/10 rounded-lg text-rose-400 group-hover:scale-110 transition-transform duration-300">
                <AlertIcon />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">End of Life Items</p>
                <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-rose-400 transition-colors">{reportData.itemsToReplace} Items</h3>
              </div>
            </div>
          </div>

          <div className="group bg-[#1e293b]/60 border border-gray-800 hover:border-blue-500/30 p-5 rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:scale-110 transition-transform duration-300">
                <BoxIcon />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Inventory</p>
                <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-blue-400 transition-colors">{reportData.totalItems} Items</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Breakdown */}
          <div className="bg-[#1e293b]/40 border border-gray-800/50 rounded-xl p-6 backdrop-blur-sm lg:col-span-1 flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"></span>
              Asset Distribution
            </h3>
            <div className="space-y-6 flex-1">
              {reportData.categoryBreakdown.map((cat) => (
                <div key={cat.name} className="group">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300 font-medium group-hover:text-white transition-colors">{cat.name}</span>
                    <span className="text-gray-400 font-mono">{cat.value}%</span>
                  </div>
                  <div className="w-full bg-gray-800/50 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`${cat.color} h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110 relative overflow-hidden`} 
                      style={{ width: `${cat.value}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/10 rounded-xl">
              <p className="text-xs text-blue-200/80 leading-relaxed">
                <span className="font-bold text-blue-400">Insight:</span> Audio equipment accounts for nearly half of the total inventory value. Consider allocating more budget for maintenance in this category.
              </p>
            </div>
          </div>

          {/* Recent Maintenance Costs Table */}
          <div className="bg-[#1e293b]/40 border border-gray-800/50 rounded-xl overflow-hidden backdrop-blur-sm lg:col-span-2 flex flex-col">
            <div className="p-6 border-b border-gray-800/50 flex justify-between items-center bg-gray-900/20">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-orange-400 to-red-600 rounded-full"></span>
                Recent Maintenance Costs
              </h3>
              <button className="text-xs text-cyan-400 hover:text-cyan-300 font-medium px-3 py-1.5 bg-cyan-500/10 rounded-lg hover:bg-cyan-500/20 transition-colors">View All</button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-gray-900/50 text-gray-300 font-medium border-b border-gray-800/50">
                  <tr>
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {reportData.recentMaintenanceCosts.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-800/30 transition-colors group">
                      <td className="px-6 py-4 font-medium text-gray-200 group-hover:text-white transition-colors">{log.item}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-md bg-gray-800 text-xs border border-gray-700 group-hover:border-gray-600 transition-colors">
                          {log.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{log.date}</td>
                      <td className="px-6 py-4 text-right font-mono text-gray-200 font-medium">{formatCurrency(log.cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* End of Life / Replacement Forecast */}
        <div className="bg-[#1e293b]/40 border border-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-rose-400 to-pink-600 rounded-full"></span>
            Replacement Forecast (Priority)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportData.endOfLifeItems.map((item) => (
              <div key={item.id} className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-xl p-5 hover:border-rose-500/30 transition-all duration-300 group hover:shadow-lg hover:shadow-rose-500/5">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-200 group-hover:text-white transition-colors text-lg">{item.name}</h4>
                  <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-1 rounded-full border border-rose-500/20 uppercase tracking-wide">
                    Needs Replace
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  {item.reason}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Est. Cost</span>
                  <span className="font-mono font-bold text-white text-lg">{formatCurrency(item.replacementCost)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
    </Layout>
  );
}
