import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon, AlertIcon } from '../Icons';

interface LogIssueModalProps {
  onClose: () => void;
  onSave: (issue: any) => void;
  items: { id: string, name: string }[];
}

export default function LogIssueModal({ onClose, onSave, items }: LogIssueModalProps) {
  const [formData, setFormData] = useState({
    itemId: '',
    maintenanceType: 'Repair Needed',
    priority: 'Medium',
    description: '',
    performedBy: '',
    maintenanceDate: new Date().toISOString().split('T')[0],
    cost: '',
    nextMaintenanceDate: ''
  });

  // Use the passed items instead of mock data
  const availableItems = items;

  const issueTypes = ['Repair Needed', 'Broken', 'Missing', 'Routine Check', 'Maintenance Due', 'Other'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-lg bg-[#1e293b]/60 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gray-900/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
              <AlertIcon />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Log New Issue</h2>
              <p className="text-sm text-gray-400 mt-1">Report a problem or maintenance request.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">Item *</label>
              <select 
                name="itemId"
                required
                value={formData.itemId}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              >
                <option value="" disabled>Select an item...</option>
                {availableItems.map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Maintenance Type</label>
                <select 
                  name="maintenanceType"
                  value={formData.maintenanceType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                >
                  {issueTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Priority</label>
                <select 
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 transition-all font-medium ${
                    formData.priority === 'Critical' ? 'text-rose-400 border-rose-500/50 focus:border-rose-500 focus:ring-rose-500' :
                    formData.priority === 'High' ? 'text-orange-400 border-orange-500/50 focus:border-orange-500 focus:ring-orange-500' :
                    'text-white focus:border-orange-500 focus:ring-orange-500'
                  }`}
                >
                  {priorities.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">Description *</label>
              <textarea 
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none"
                placeholder="Describe the issue or maintenance performed..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Performed By</label>
                <input 
                  type="text" 
                  name="performedBy"
                  value={formData.performedBy}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  placeholder="Name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Date</label>
                <input 
                  type="date" 
                  name="maintenanceDate"
                  value={formData.maintenanceDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Cost</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400">₱</span>
                  <input 
                    type="text" 
                    name="cost"
                    inputMode="decimal"
                    pattern="^\d*(\\.\d{0,2})?$"
                    value={formData.cost}
                    onChange={handleChange}
                    className="w-full pl-7 pr-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Next Maintenance</label>
                <input 
                  type="date" 
                  name="nextMaintenanceDate"
                  value={formData.nextMaintenanceDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 flex justify-end gap-3 border-t border-gray-700/50">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 rounded-lg shadow-lg shadow-orange-500/20 transition-all"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
