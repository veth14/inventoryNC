import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { EditIcon, DeleteIcon } from './Icons';
import ItemDetailsModal from './UI/ItemDetailsModal';

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  status: 'Available' | 'In Use' | 'Maintenance' | 'Out of Stock';
  imageUrl?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  condition?: string;
  location?: string;
  notes?: string;
  datePurchased?: string;
  lastChecked?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface InventoryTableProps {
  items: InventoryItem[];
}

const ITEMS_PER_PAGE = 8;

export default function InventoryTable({ items }: InventoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  // Calculate empty rows to maintain fixed height
  const emptyRows = ITEMS_PER_PAGE - currentItems.length;

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleItemClick = async (item: InventoryItem) => {
    try {
      const { data: history } = await supabase
        .from('inventory_item_maintenance')
        .select('*')
        .eq('item_id', item.id)
        .order('maintenance_date', { ascending: false });
      
      const itemWithHistory = {
          ...item,
          maintenanceHistory: history?.map((h: any) => ({
              id: h.id,
              type: h.maintenance_type,
              date: h.maintenance_date,
              performedBy: h.performed_by,
              description: h.description,
              cost: h.cost,
              nextScheduledDate: h.next_maintenance_date
          })) || []
      };
      setSelectedItem(itemWithHistory);
    } catch (error) {
      console.error("Error fetching history", error);
      setSelectedItem(item);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-[#1e293b]/40 border border-gray-800/50 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] text-gray-400">
            <thead className="bg-gray-900/50 text-gray-300 font-medium border-b border-gray-800/50">
              <tr>
                <th className="px-4 py-2.5 w-[40%]">Item Name</th>
                <th className="px-4 py-2.5 w-[15%]">Category</th>
                <th className="px-4 py-2.5 w-[15%]">Quantity</th>
                <th className="px-4 py-2.5 w-[15%]">Status</th>
                <th className="px-4 py-2.5 w-[15%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {currentItems.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-gray-800/30 transition-colors group h-[52px] cursor-pointer"
                  onClick={() => handleItemClick(item)}
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
                        <div className="text-[10px] text-gray-500 truncate">{item.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className="px-1.5 py-0.5 rounded bg-gray-800/50 border border-gray-700/50 text-[10px] uppercase tracking-wide">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                      item.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      item.status === 'In Use' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      item.status === 'Maintenance' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${
                        item.status === 'Available' ? 'bg-emerald-400' :
                        item.status === 'In Use' ? 'bg-blue-400' :
                        item.status === 'Maintenance' ? 'bg-amber-400' :
                        'bg-red-400'
                      }`}></span>
                      {item.status}
                    </span>
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
                  <td className="px-4 py-2">&nbsp;</td>
                  <td className="px-4 py-2">&nbsp;</td>
                  <td className="px-4 py-2">&nbsp;</td>
                  <td className="px-4 py-2">&nbsp;</td>
                  <td className="px-4 py-2">&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <p className="text-[11px] text-gray-500">
          Showing <span className="font-medium text-gray-300">{startIndex + 1}</span> to <span className="font-medium text-gray-300">{Math.min(startIndex + ITEMS_PER_PAGE, items.length)}</span> of <span className="font-medium text-gray-300">{items.length}</span> results
        </p>
        <div className="flex gap-2">
          <button 
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-[11px] font-medium text-gray-400 bg-gray-800/30 border border-gray-700/30 rounded-lg hover:bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button 
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1.5 text-[11px] font-medium text-gray-400 bg-gray-800/30 border border-gray-700/30 rounded-lg hover:bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {selectedItem && (
        <ItemDetailsModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
}
