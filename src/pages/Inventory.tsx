import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import Layout from '../Components/Layout';
import InventoryTable, { InventoryItem } from '../Components/InventoryTable';
import { PlusIcon, SearchIcon, FilterIcon, InventoryIcon, BoxIcon, AlertIcon } from '../Components/Icons';
import AddItemModal from '../Components/UI/AddItemModal';

interface InventoryProps {
  session: Session | null;
}

export default function Inventory({ session }: InventoryProps) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedItems: InventoryItem[] = data.map((item: any) => ({
          id: item.id,
          name: item.item_name,
          category: item.category,
          quantity: item.quantity,
          status: item.status,
          imageUrl: item.photo_url,
          brand: item.brand,
          model: item.model,
          serialNumber: item.serial_number,
          condition: item.condition,
          location: item.location,
          notes: item.notes,
          datePurchased: item.date_purchased,
          lastChecked: item.last_checked,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));
        setItems(mappedItems);
      }
    } catch (err: any) {
      console.error('Error fetching inventory:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Use the fetched items instead of mock data
  const allItems = items;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state && (location.state as any).openAddModal) {
      setIsAddModalOpen(true);
      // Clear state so it doesn't reopen on refresh (optional, but good practice)
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleAddItem = async (newItem: any) => {
    try {
      setLoading(true);
      let photoUrl = '';

      if (newItem.imageFile) {
        const fileExt = newItem.imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('inventory-photos')
          .upload(filePath, newItem.imageFile);

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            // Continue without image if upload fails
        } else {
            const { data: { publicUrl } } = supabase.storage
            .from('inventory-photos')
            .getPublicUrl(filePath);
            
            photoUrl = publicUrl;
        }
      }

      const { error: itemError } = await supabase
        .from('inventory_items')
        .insert([{
          item_name: newItem.name,
          category: newItem.category,
          brand: newItem.brand,
          model: newItem.model,
          serial_number: newItem.serialNumber,
          quantity: newItem.quantity,
          status: newItem.status,
          location: newItem.location,
          notes: newItem.notes,
          photo_url: photoUrl,
          date_purchased: newItem.datePurchased || null,
          condition: 'Good', // Default condition
          last_checked: new Date().toISOString()
        }]);

      if (itemError) throw itemError;

      // Refresh items
      fetchItems();
      setIsAddModalOpen(false);
    } catch (error: any) {
      console.error('Error adding item:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Audio', 'Video', 'Lighting', 'Instruments', 'Cables', 'Consumables'];

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Stats
  const totalQuantity = allItems.reduce((acc, item) => acc + item.quantity, 0);
  const lowStockCount = allItems.filter(item => item.quantity < 3).length;
  const categoriesCount = new Set(allItems.map(i => i.category)).size;

  return (
    <Layout onLogout={handleLogout} user={session?.user || null}>
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/10 flex items-center justify-center">
              <InventoryIcon />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Inventory Management
              </h1>
              <p className="text-sm text-gray-400 mt-1">View, track, and manage all church equipment.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-95 transform hover:-translate-y-0.5"
          >
            <PlusIcon />
            Add New Item
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1e293b]/60 border border-gray-800/50 rounded-xl p-4 backdrop-blur-sm flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
              <BoxIcon />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Items</p>
              <h3 className="text-xl font-bold text-white">{totalQuantity}</h3>
            </div>
          </div>
          <div className="bg-[#1e293b]/60 border border-gray-800/50 rounded-xl p-4 backdrop-blur-sm flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
              <FilterIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Categories</p>
              <h3 className="text-xl font-bold text-white">{categoriesCount}</h3>
            </div>
          </div>
          <div className="bg-[#1e293b]/60 border border-gray-800/50 rounded-xl p-4 backdrop-blur-sm flex items-center gap-4">
            <div className="p-3 bg-rose-500/10 rounded-lg text-rose-400">
              <AlertIcon />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Low Stock</p>
              <h3 className="text-xl font-bold text-white">{lowStockCount} Items</h3>
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
              placeholder="Search items, categories..."
              className="w-full pl-11 pr-4 py-3 bg-transparent rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:bg-gray-800/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-gray-900/30 rounded-xl p-1 border border-gray-800/30">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-gray-700 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-[#1e293b]/40 border border-gray-800/50 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
          <InventoryTable items={filteredItems} />
        </div>
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <AddItemModal 
          onClose={() => setIsAddModalOpen(false)} 
          onSave={handleAddItem} 
        />
      )}
    </Layout>
  );
}