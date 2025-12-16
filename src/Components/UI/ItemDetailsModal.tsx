import React, { useState } from 'react';
import { CloseIcon, WrenchIcon } from '../Icons';

export interface MaintenanceRecord {
  id: number;
  type: string;
  date: string;
  performedBy: string;
  description: string;
  cost?: number;
  nextScheduledDate?: string;
}

export interface ItemDetails {
  id: number | string;
  name: string;
  category: string;
  brand?: string;
  model?: string;
  brandModel?: string;
  serialNumber?: string;
  quantity: number;
  condition?: string;
  status: string;
  location?: string;
  notes?: string;
  photoUrl?: string;
  imageUrl?: string;
  datePurchased?: string;
  lastChecked?: string;
  createdAt?: string;
  updatedAt?: string;
  maintenanceHistory?: MaintenanceRecord[];
  [key: string]: any;
}

interface ItemDetailsModalProps {
  item: ItemDetails;
  onClose: () => void;
}

export default function ItemDetailsModal({ item, onClose }: ItemDetailsModalProps) {
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  if (!item) return null;

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('available')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (s.includes('use')) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    if (s.includes('maintenance') || s.includes('repair')) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    if (s.includes('missing') || s.includes('stock') || s.includes('broken')) return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  };

  const displayImage = item.photoUrl || item.imageUrl;
  const displayBrand = item.brand || (item.brandModel ? item.brandModel.split(' ')[0] : '');
  const displayModel = item.model || (item.brandModel ? item.brandModel.replace(displayBrand, '').trim() : '');
  const displayName = item.name || item.item_name;

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return 'N/A';
    return `₱${amount.toLocaleString()}`;
  };

  const latestMaintenance = item.maintenanceHistory && item.maintenanceHistory.length > 0 
    ? item.maintenanceHistory[0] 
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-3xl bg-[#1e293b] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gray-900/30">
          <div>
            <h2 className="text-xl font-bold text-white">{displayName}</h2>
            <p className="text-sm text-gray-400 mt-1">
              {displayBrand} {displayModel}
              {!displayBrand && !displayModel && item.category}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto p-6 space-y-8">
          {/* Top Section: Image & Basic Info */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image Section */}
            <div className="w-full md:w-1/3 shrink-0">
              <div 
                className="aspect-square rounded-xl overflow-hidden bg-gray-800 border border-gray-700/50 relative group cursor-pointer"
                onClick={() => displayImage && setIsImageExpanded(true)}
              >
                {displayImage ? (
                  <>
                    <img 
                      src={displayImage} 
                      alt={displayName} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded backdrop-blur-sm transition-opacity">
                        Click to enlarge
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 bg-gray-800/50">
                    <span className="text-4xl font-bold opacity-20">
                      {item.category.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <div className={`px-3 py-2 rounded-lg border text-center text-sm font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </div>
                {item.condition && (
                   <div className="px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-center text-sm text-gray-300">
                     Condition: <span className="text-white">{item.condition}</span>
                   </div>
                )}
              </div>
            </div>

            {/* Details Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 content-start">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Category</label>
                <p className="text-gray-200">{item.category}</p>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</label>
                <p className="text-gray-200">{item.quantity} Units</p>
              </div>

              {displayBrand && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</label>
                  <p className="text-gray-200">{displayBrand}</p>
                </div>
              )}

              {displayModel && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Model</label>
                  <p className="text-gray-200">{displayModel}</p>
                </div>
              )}

              {item.serialNumber && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</label>
                  <p className="text-gray-200 font-mono text-sm">{item.serialNumber}</p>
                </div>
              )}

              {item.location && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Location</label>
                  <p className="text-gray-200">{item.location}</p>
                </div>
              )}

              {item.datePurchased && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date Purchased</label>
                  <p className="text-gray-200">{formatDate(item.datePurchased)}</p>
                </div>
              )}

              {item.lastChecked && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Checked</label>
                  <p className="text-gray-200">{formatDate(item.lastChecked)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Maintenance Details (Main Focus) */}
          {latestMaintenance && (
            <div className="border-t border-gray-700/50 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-orange-500/10 rounded-lg text-orange-400">
                  <WrenchIcon />
                </div>
                <h3 className="text-lg font-semibold text-white">Maintenance Details</h3>
              </div>
              
              <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 p-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Maintenance Type</label>
                  <p className="text-white font-medium">{latestMaintenance.type}</p>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date Performed</label>
                  <p className="text-gray-200">{formatDate(latestMaintenance.date)}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Performed By</label>
                  <p className="text-gray-200">{latestMaintenance.performedBy}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</label>
                  <p className="text-gray-200 font-mono">{formatCurrency(latestMaintenance.cost)}</p>
                </div>

                <div className="col-span-1 sm:col-span-2 space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Description / Work Done</label>
                  <p className="text-gray-300 text-sm leading-relaxed">{latestMaintenance.description}</p>
                </div>

                {latestMaintenance.nextScheduledDate && (
                  <div className="col-span-1 sm:col-span-2 pt-2 border-t border-gray-700/30 mt-2">
                    <div className="flex items-center gap-2 text-orange-400 bg-orange-500/10 px-3 py-2 rounded-lg border border-orange-500/20 w-fit">
                      <span className="text-xs font-bold uppercase tracking-wider">Next Scheduled Maintenance:</span>
                      <span className="font-medium">{formatDate(latestMaintenance.nextScheduledDate)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Maintenance Timeline */}
          {item.maintenanceHistory && item.maintenanceHistory.length > 0 && (
            <div className="border-t border-gray-700/50 pt-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Maintenance History</h3>
              <div className="relative pl-4 border-l border-gray-700/50 space-y-6">
                {item.maintenanceHistory.map((record, index) => (
                  <div key={record.id} className="relative">
                    {/* Timeline Dot */}
                    <div className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 ${index === 0 ? 'bg-cyan-500 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-gray-700 border-gray-600'}`}></div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1">
                      <div>
                        <span className={`text-sm font-medium ${index === 0 ? 'text-white' : 'text-gray-300'}`}>
                          {record.type}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">by {record.performedBy}</span>
                      </div>
                      <span className="text-xs text-gray-500 font-mono">{formatDate(record.date)}</span>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-2">{record.description}</p>
                    
                    {record.cost !== undefined && (
                      <div className="text-xs text-gray-500 font-mono">
                        Cost: {formatCurrency(record.cost)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes Section (if not in maintenance details) */}
          {!latestMaintenance && (
            <div className="space-y-2 pt-2 border-t border-gray-700/50">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Notes / Remarks</label>
              <p className="text-gray-300 text-sm leading-relaxed bg-gray-800/30 p-3 rounded-lg border border-gray-700/30 min-h-[80px]">
                {item.notes || "No additional notes provided."}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="flex gap-6 pt-2 border-t border-gray-700/50 text-[10px] text-gray-500">
            {item.createdAt && (
              <span>Created: {formatDate(item.createdAt)}</span>
            )}
            {item.updatedAt && (
              <span>Updated: {formatDate(item.updatedAt)}</span>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-700/50 bg-gray-900/30 flex justify-end gap-3">
           <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
             Close
           </button>
           <button className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20 transition-colors">
             Edit Item
           </button>
        </div>
      </div>

      {/* Lightbox */}
      {isImageExpanded && displayImage && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={() => setIsImageExpanded(false)}
        >
          <img 
            src={displayImage} 
            alt={displayName} 
            className="max-h-[90vh] max-w-full rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
          <button 
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            onClick={() => setIsImageExpanded(false)}
          >
            <CloseIcon />
          </button>
        </div>
      )}
    </div>
  );
}

