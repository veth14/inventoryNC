import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '../Icons';

interface AddItemModalProps {
  onClose: () => void;
  onSave: (item: any) => void;
}

export default function AddItemModal({ onClose, onSave }: AddItemModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Audio',
    brand: '',
    model: '',
    serialNumber: '',
    quantity: 1,
    status: 'Available',
    location: '',
    datePurchased: '',
    notes: '',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const categories = ['Audio', 'Video', 'Lighting', 'Instruments', 'Cables', 'Consumables', 'Furniture', 'Other'];
  const statuses = ['Available', 'In Use', 'Maintenance', 'Out of Stock', 'Missing'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Include the file in the saved data
    onSave({ ...formData, imageFile });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-2xl bg-[#1e293b]/60 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gray-900/30">
          <div>
            <h2 className="text-xl font-bold text-white">Add New Item</h2>
            <p className="text-sm text-gray-400 mt-1">Enter the details of the new equipment.</p>
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
          
          {/* Basic Info Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-cyan-400 uppercase tracking-wider">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Item Name *</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="e.g. Shure SM58"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Category *</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Brand</label>
                <input 
                  type="text" 
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="e.g. Shure"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Model</label>
                <input 
                  type="text" 
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="e.g. SM58-LC"
                />
              </div>
            </div>
          </div>

          {/* Tracking Section */}
          <div className="space-y-4 pt-4 border-t border-gray-700/50">
            <h3 className="text-sm font-medium text-cyan-400 uppercase tracking-wider">Tracking Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Serial Number</label>
                <input 
                  type="text" 
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm"
                  placeholder="SN-123456"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Quantity *</label>
                <input 
                  type="number" 
                  name="quantity"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Location</label>
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="e.g. Stage Left, Tech Booth"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Date Purchased</label>
                <input 
                  type="date" 
                  name="datePurchased"
                  value={formData.datePurchased}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-4 pt-4 border-t border-gray-700/50">
            <h3 className="text-sm font-medium text-cyan-400 uppercase tracking-wider">Additional Information</h3>
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">Item Photo</label>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <input 
                    type="file" 
                    accept=".jpg,.jpeg,.png"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Accepted formats: JPG, PNG</p>
                </div>
                {imagePreview && (
                  <div className="h-16 w-16 rounded-lg border border-gray-700 overflow-hidden bg-gray-800">
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">Notes</label>
              <textarea 
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                placeholder="Any additional details..."
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg shadow-lg shadow-cyan-500/20 transition-all"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
