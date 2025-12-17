import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import Layout from '../Components/Layout';
import { supabase } from '../lib/supabaseClient';
import { WrenchIcon, SearchIcon, FilterIcon, PlusIcon, EditIcon, DeleteIcon } from '../Components/Icons';
import ItemDetailsModal from '../Components/UI/ItemDetailsModal';
import LogIssueModal from '../Components/UI/LogIssueModal';

interface MaintenanceItem {
  id: number;
  name: string;
  category: string;
  brand?: string;
  model?: string;
  brandModel: string;
  serialNumber?: string;
  quantity: number;
  condition: 'New' | 'Good' | 'Fair' | 'Needs Repair' | 'Broken';
  status: 'Available' | 'In Use' | 'Missing' | 'Under Repair';
  location: string;
  notes?: string;
  lastChecked: string;
  imageUrl?: string;
  datePurchased?: string;
  createdAt?: string;
  updatedAt?: string;
  maintenanceHistory?: {
    id: number;
    type: string;
    date: string;
    performedBy: string;
    description: string;
    cost?: number;
    nextScheduledDate?: string;
  }[];
}

const ITEMS_PER_PAGE = 8;

interface MaintenanceProps {
  session: Session | null;
}

export default function Maintenance({ session }: MaintenanceProps) {
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>([]);
  const [allItems, setAllItems] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    fetchMaintenanceItems();
    fetchAllItems();
  }, []);

  const fetchAllItems = async () => {
      const { data } = await supabase.from('inventory_items').select('id, item_name');
      if (data) {
          setAllItems(data.map((i: any) => ({ id: i.id, name: i.item_name })));
      }
  };

  const fetchMaintenanceItems = async () => {
    try {
      setLoading(true);
      // Fetch items that need maintenance
      const { data: itemsData, error: itemsError } = await supabase
        .from('inventory_items')
        .select('*')
        .or('status.eq.Under Repair,condition.eq.Needs Repair,condition.eq.Broken');

      if (itemsError) throw itemsError;

      if (itemsData) {
        // For each item, fetch its maintenance history
        const itemsWithHistory = await Promise.all(itemsData.map(async (item: any) => {
          const { data: historyData, error: historyError } = await supabase
            .from('inventory_item_maintenance')
            .select('*')
            .eq('item_id', item.id)
            .order('maintenance_date', { ascending: false });
          
          if (historyError) console.error('Error fetching history for item', item.id, historyError);

          return {
            id: item.id,
            name: item.item_name,
            category: item.category,
            brand: item.brand,
            model: item.model,
            brandModel: `${item.brand || ''} ${item.model || ''}`.trim(),
            serialNumber: item.serial_number,
            quantity: item.quantity,
            condition: item.condition,
            status: item.status,
            location: item.location,
            notes: item.notes,
            lastChecked: item.last_checked,
            imageUrl: item.photo_url,
            datePurchased: item.date_purchased,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            maintenanceHistory: historyData?.map((h: any) => ({
              id: h.id,
              type: h.maintenance_type,
              date: h.maintenance_date,
              performedBy: h.performed_by,
              description: h.description,
              cost: h.cost,
              nextScheduledDate: h.next_maintenance_date
            })) || []
          };
        }));
        
        setMaintenanceItems(itemsWithHistory);
      }
    } catch (error) {
      console.error('Error fetching maintenance items:', error);
    } finally {
      setLoading(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<MaintenanceItem | null>(null);
  const [isLogIssueModalOpen, setIsLogIssueModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state && (location.state as any).openLogIssueModal) {
      setIsLogIssueModalOpen(true);
      // Clear state so it doesn't reopen on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleLogIssue = async (issue: any) => {
    try {
      setLoading(true);
      
      const { error: maintenanceError } = await supabase
        .from('inventory_item_maintenance')
        .insert([{
          item_id: issue.itemId,
          maintenance_type: issue.maintenanceType,
          description: issue.description,
          performed_by: issue.performedBy,
          maintenance_date: issue.maintenanceDate,
          cost: parseFloat(issue.cost) || 0,
          next_maintenance_date: issue.nextMaintenanceDate || null
        }]);

      if (maintenanceError) throw maintenanceError;

      // Update item status if needed
      if (issue.maintenanceType === 'Broken' || issue.maintenanceType === 'Repair Needed') {
         const status = 'Under Repair';
         const condition = issue.maintenanceType === 'Broken' ? 'Broken' : 'Needs Repair';
         
         await supabase
          .from('inventory_items')
          .update({ status, condition })
          .eq('id', issue.itemId);
      }

      fetchMaintenanceItems();
      setIsLogIssueModalOpen(false);
    } catch (error) {
      console.error('Error logging issue:', error);
    } finally {
      setLoading(false);
    }
  };

  const conditions = ['All', 'New', 'Good', 'Fair', 'Needs Repair', 'Broken'];

  const filteredItems = maintenanceItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCondition = selectedCondition === 'All' || item.condition === selectedCondition;
    return matchesSearch && matchesCondition;
  });

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const emptyRows = ITEMS_PER_PAGE - currentItems.length;

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Good': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Fair': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Needs Repair': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'Broken': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'text-emerald-400';
      case 'In Use': return 'text-blue-400';
      case 'Missing': return 'text-rose-400';
      case 'Under Repair': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  // Stats
  const underRepairCount = maintenanceItems.filter(i => i.status === 'Under Repair').length;
  const needsRepairCount = maintenanceItems.filter(i => i.condition === 'Needs Repair' || i.condition === 'Broken').length;
  const totalIssues = maintenanceItems.length; // Just total items in log for now

  return (
    <Layout onLogout={handleLogout} user={session?.user || null}>
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl text-orange-400 border border-orange-500/20 shadow-lg shadow-orange-500/10 flex items-center justify-center">
              <WrenchIcon />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Maintenance Log
              </h1>
              <p className="text-sm text-gray-400 mt-1">Track item conditions, repairs, and status updates.</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsLogIssueModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-95 transform hover:-translate-y-0.5"
          >
            <PlusIcon />
            Log Issue
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1e293b]/60 border border-gray-800/50 rounded-xl p-4 backdrop-blur-sm flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400">
              <WrenchIcon />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Under Repair</p>
              <h3 className="text-xl font-bold text-white">{underRepairCount} Items</h3>
            </div>
          </div>
          <div className="bg-[#1e293b]/60 border border-gray-800/50 rounded-xl p-4 backdrop-blur-sm flex items-center gap-4">
            <div className="p-3 bg-rose-500/10 rounded-lg text-rose-400">
              <FilterIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Critical Issues</p>
              <h3 className="text-xl font-bold text-white">{needsRepairCount} Items</h3>
            </div>
          </div>
          <div className="bg-[#1e293b]/60 border border-gray-800/50 rounded-xl p-4 backdrop-blur-sm flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
              <SearchIcon />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Tracked</p>
              <h3 className="text-xl font-bold text-white">{totalIssues} Items</h3>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-[#1e293b]/40 border border-gray-800/50 rounded-2xl p-1.5 backdrop-blur-sm flex flex-col md:flex-row gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search items, notes..."
              className="w-full pl-11 pr-4 py-3 bg-transparent rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:bg-gray-800/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Condition Filter */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-gray-900/30 rounded-xl p-1 border border-gray-800/30">
            {conditions.map((cond) => (
              <button
                key={cond}
                onClick={() => setSelectedCondition(cond)}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  selectedCondition === cond
                    ? 'bg-gray-700 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {cond}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#1e293b]/40 border border-gray-800/50 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] text-gray-400">
                <thead className="bg-gray-900/50 text-gray-300 font-medium border-b border-gray-800/50">
                  <tr>
                    <th className="px-4 py-2.5 w-[25%]">Item Details</th>
                    <th className="px-4 py-2.5 w-[10%]">Condition</th>
                    <th className="px-4 py-2.5 w-[10%]">Status</th>
                    <th className="px-4 py-2.5 w-[15%]">Location</th>
                    <th className="px-4 py-2.5 w-[10%]">Last Checked</th>
                    <th className="px-4 py-2.5 w-[20%]">Notes</th>
                    <th className="px-4 py-2.5 w-[10%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {currentItems.map((item) => (
                    <tr 
                      key={item.id} 
                      className="hover:bg-gray-800/30 transition-colors group h-[52px] cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <td className="px-4 py-2 font-medium text-gray-200 group-hover:text-white transition-colors">
                        <div className="flex items-center gap-3">
                          <div 
                            className={`h-8 w-8 rounded-lg border border-gray-700/30 flex items-center justify-center text-[10px] text-gray-200 font-semibold shrink-0 overflow-hidden ${item.imageUrl ? '' : 'bg-gray-800/40'}`}
                          >
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                            ) : (
                              item.category.split(' ').map((s) => s[0]).join('').slice(0,2).toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate">{item.name}</div>
                            <div className="text-[10px] text-gray-500 truncate">{item.brandModel} • {item.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${getConditionColor(item.condition)}`}>
                          {item.condition}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Available' ? 'bg-emerald-500' : item.status === 'Under Repair' ? 'bg-orange-500' : 'bg-gray-500'}`} />
                          <span className={getStatusColor(item.status)}>{item.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {item.location}
                      </td>
                      <td className="px-4 py-2 text-gray-500 text-[10px]">
                        {item.lastChecked}
                      </td>
                      <td className="px-4 py-2">
                        <p className="truncate max-w-[150px] text-gray-400 italic">{item.notes || '-'}</p>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                          <button className="p-1 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded transition-colors">
                            <EditIcon />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors">
                            <DeleteIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* Empty rows to maintain fixed height */}
                  {Array.from({ length: emptyRows }).map((_, index) => (
                    <tr key={`empty-${index}`} className="h-[52px]">
                      <td colSpan={7} className="px-4 py-2">&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-2">
            <div className="text-[11px] text-gray-500">
              Showing <span className="font-medium text-gray-300">{filteredItems.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-medium text-gray-300">{Math.min(startIndex + ITEMS_PER_PAGE, filteredItems.length)}</span> of <span className="font-medium text-gray-300">{filteredItems.length}</span> results
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-[11px] font-medium text-gray-400 bg-[#1e293b]/40 border border-gray-800/50 rounded-lg hover:bg-gray-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 text-[11px] font-medium text-gray-400 bg-[#1e293b]/40 border border-gray-800/50 rounded-lg hover:bg-gray-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedItem && (
        <ItemDetailsModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}

      {isLogIssueModalOpen && (
        <LogIssueModal 
          onClose={() => setIsLogIssueModalOpen(false)}
          onSave={handleLogIssue}
          items={allItems}
        />
      )}
    </Layout>
  );
}
