import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Layout from '../Components/Layout';
import InventoryTable, { InventoryItem } from '../Components/InventoryTable';
import { PlusIcon, SearchIcon, FilterIcon } from '../Components/Icons';

export default function Inventory() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Mock Data - Expanded for the full inventory page
  const allItems: InventoryItem[] = [
    { 
      id: 1, 
      name: 'Shure SM58 Microphone', 
      category: 'Audio', 
      quantity: 4, 
      status: 'In Use', 
      imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=150&q=80',
      brand: 'Shure',
      model: 'SM58',
      serialNumber: 'SH-58-001',
      condition: 'Good',
      location: 'Stage Left',
      notes: 'Primary vocal mic for worship leader.',
      datePurchased: '2023-01-15',
      lastChecked: '2023-11-20',
      createdAt: '2023-01-15T10:00:00Z',
      updatedAt: '2023-11-20T14:30:00Z'
    },
    { 
      id: 2, 
      name: 'XLR Cable (20ft)', 
      category: 'Cables', 
      quantity: 12, 
      status: 'Available',
      brand: 'Generic',
      model: 'XLR-20',
      condition: 'New',
      location: 'Cable Bin A',
      notes: 'Spare cables for general use.',
      datePurchased: '2023-06-01',
      lastChecked: '2023-12-01',
      createdAt: '2023-06-01T09:00:00Z',
      updatedAt: '2023-12-01T11:15:00Z'
    },
    { 
      id: 3, 
      name: 'Yamaha Acoustic Guitar', 
      category: 'Instruments', 
      quantity: 1, 
      status: 'Maintenance', 
      imageUrl: 'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?auto=format&fit=crop&w=150&q=80',
      brand: 'Yamaha',
      model: 'F310',
      serialNumber: 'YAM-F310-998',
      condition: 'Fair',
      location: 'Instrument Storage',
      notes: 'Bridge pin loose, needs replacement.',
      datePurchased: '2020-03-10',
      lastChecked: '2023-12-05',
      createdAt: '2020-03-10T14:00:00Z',
      updatedAt: '2023-12-05T16:45:00Z'
    },
    { 
      id: 4, 
      name: 'HDMI Splitter', 
      category: 'Video', 
      quantity: 2, 
      status: 'Available',
      brand: 'Orei',
      model: '1x4 Splitter',
      condition: 'Good',
      location: 'Media Booth',
      notes: 'Used for main projection system.',
      datePurchased: '2022-11-15',
      lastChecked: '2023-10-15',
      createdAt: '2022-11-15T13:30:00Z',
      updatedAt: '2023-10-15T09:20:00Z'
    },
    { 
      id: 5, 
      name: 'Focusrite Scarlett 2i2', 
      category: 'Audio Interface', 
      quantity: 1, 
      status: 'In Use', 
      imageUrl: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=150&q=80',
      brand: 'Focusrite',
      model: 'Scarlett 2i2 3rd Gen',
      serialNumber: 'FC-2i2-776',
      condition: 'Excellent',
      location: 'Recording Desk',
      notes: 'Used for livestream audio mix.',
      datePurchased: '2021-08-20',
      lastChecked: '2023-11-25',
      createdAt: '2021-08-20T11:00:00Z',
      updatedAt: '2023-11-25T15:10:00Z'
    },
    { id: 6, name: 'DMX Controller', category: 'Lighting', quantity: 1, status: 'Available' },
    { id: 7, name: 'Stage Box 16ch', category: 'Audio', quantity: 1, status: 'In Use' },
    { id: 8, name: 'Extension Cord (10m)', category: 'Cables', quantity: 5, status: 'Available' },
    { id: 9, name: 'AA Batteries (Pack)', category: 'Consumables', quantity: 20, status: 'Available' },
    { id: 10, name: 'Projector Screen', category: 'Video', quantity: 1, status: 'In Use' },
    { id: 11, name: 'Drum Sticks (Pair)', category: 'Instruments', quantity: 3, status: 'Out of Stock', imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=150&q=80' },
    { id: 12, name: 'Microphone Stand', category: 'Audio', quantity: 6, status: 'Available' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Audio', 'Video', 'Lighting', 'Instruments', 'Cables', 'Consumables'];

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout onLogout={handleLogout}>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Inventory Management</h1>
            <p className="text-sm text-gray-400 mt-1">View, track, and manage all church equipment.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-95">
            <PlusIcon />
            Add New Item
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
                placeholder="Search items, categories..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <FilterIcon className="text-gray-500 shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      : 'bg-gray-800/30 text-gray-400 border-gray-700/30 hover:bg-gray-800/50 hover:text-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <InventoryTable items={filteredItems} />
      </div>
    </Layout>
  );
}