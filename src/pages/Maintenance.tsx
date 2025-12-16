import React, { useState } from 'react';
import Layout from '../Components/Layout';
import { supabase } from '../lib/supabaseClient';
import { WrenchIcon, SearchIcon, FilterIcon, PlusIcon, EditIcon, DeleteIcon } from '../Components/Icons';
import ItemDetailsModal from '../Components/UI/ItemDetailsModal';

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

export default function Maintenance() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Mock Data matching the user's requested fields
  const maintenanceItems: MaintenanceItem[] = [
    {
      id: 1,
      name: 'Shure SM58 Microphone',
      category: 'Audio Gear',
      brand: 'Shure',
      model: 'SM58',
      brandModel: 'Shure SM58',
      serialNumber: 'SN12345678',
      quantity: 1,
      condition: 'Needs Repair',
      status: 'Under Repair',
      location: 'Tech Booth',
      notes: 'Grill dented, intermittent signal cut.',
      lastChecked: '2023-10-25',
      imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=150&q=80',
      datePurchased: '2022-01-15',
      createdAt: '2022-01-15T10:00:00Z',
      updatedAt: '2023-10-25T14:30:00Z',
      maintenanceHistory: [
        {
          id: 101,
          type: 'Repair',
          date: '2023-10-26',
          performedBy: 'Audio Tech Team',
          description: 'Diagnosed intermittent signal. Cable connection inside mic body is loose. Needs resoldering.',
          cost: 0,
          nextScheduledDate: '2023-11-05'
        },
        {
          id: 102,
          type: 'Routine Check',
          date: '2023-06-15',
          performedBy: 'John Doe',
          description: 'Cleaned grill and checked frequency response. All good.',
          cost: 0
        }
      ]
    },
    {
      id: 2,
      name: 'XLR Cable (20ft)',
      category: 'Cable',
      brand: 'Generic',
      model: 'XLR-20',
      brandModel: 'Generic',
      quantity: 1,
      condition: 'Broken',
      status: 'Under Repair',
      location: 'Storage Room',
      notes: 'Connector loose, needs soldering.',
      lastChecked: '2023-11-01',
      datePurchased: '2021-05-20',
      createdAt: '2021-05-20T09:00:00Z',
      updatedAt: '2023-11-01T11:15:00Z',
      maintenanceHistory: [
        {
          id: 201,
          type: 'Inspection',
          date: '2023-11-01',
          performedBy: 'Volunteer Team',
          description: 'Found connector housing cracked and pins bent. Marked for repair.',
          cost: 0
        }
      ]
    },
    {
      id: 3,
      name: 'Yamaha Acoustic Guitar',
      category: 'Instrument',
      brand: 'Yamaha',
      model: 'F310',
      brandModel: 'Yamaha F310',
      serialNumber: 'YAM998877',
      quantity: 1,
      condition: 'Fair',
      status: 'Available',
      location: 'Stage',
      notes: 'High action, needs setup.',
      lastChecked: '2023-11-10',
      imageUrl: 'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?auto=format&fit=crop&w=150&q=80',
      datePurchased: '2019-08-10',
      createdAt: '2019-08-10T14:00:00Z',
      updatedAt: '2023-11-10T16:45:00Z',
      maintenanceHistory: [
        {
          id: 301,
          type: 'Setup',
          date: '2023-01-20',
          performedBy: 'Local Music Shop',
          description: 'Full setup: truss rod adjustment, fret leveling, and new strings.',
          cost: 2500,
          nextScheduledDate: '2024-01-20'
        },
        {
          id: 302,
          type: 'String Change',
          date: '2023-08-15',
          performedBy: 'Worship Leader',
          description: 'Replaced strings with Elixir Nanoweb Light.',
          cost: 850
        }
      ]
    },
    {
      id: 4,
      name: 'DMX Controller',
      category: 'Lighting',
      brand: 'Generic',
      model: 'DMX512',
      brandModel: 'Generic DMX512',
      quantity: 1,
      condition: 'Good',
      status: 'Available',
      location: 'Tech Booth',
      notes: 'Fader 3 slightly sticky.',
      lastChecked: '2023-11-15',
      datePurchased: '2020-11-15',
      createdAt: '2020-11-15T13:30:00Z',
      updatedAt: '2023-11-15T09:20:00Z'
    },
    {
      id: 5,
      name: 'HDMI Splitter',
      category: 'Video',
      brand: 'Orei',
      model: '1x4',
      brandModel: 'Orei 1x4',
      quantity: 1,
      condition: 'Good',
      status: 'In Use',
      location: 'Media Desk',
      notes: 'Power adapter replaced.',
      lastChecked: '2023-11-20',
      datePurchased: '2022-03-01',
      createdAt: '2022-03-01T11:00:00Z',
      updatedAt: '2023-11-20T15:10:00Z'
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<MaintenanceItem | null>(null);

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

  return (
    <Layout onLogout={handleLogout}>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              Maintenance Log
            </h1>
            <p className="text-sm text-gray-400 mt-1">Track item conditions, repairs, and status updates.</p>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-95">
            <PlusIcon />
            Log Issue
          </button>
        </div>

        {/* Filters & Search */}
        <div className="bg-[#1e293b]/40 border border-gray-800/50 rounded-xl p-4 mb-6 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search items, notes..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Condition Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <FilterIcon className="text-gray-500 shrink-0" />
              {conditions.map((cond) => (
                <button
                  key={cond}
                  onClick={() => setSelectedCondition(cond)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all whitespace-nowrap ${
                    selectedCondition === cond
                      ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                      : 'bg-gray-800/30 text-gray-400 border-gray-700/30 hover:bg-gray-800/50 hover:text-gray-300'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#1e293b]/40 border border-gray-800/50 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl flex flex-col">
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
    </Layout>
  );
}
