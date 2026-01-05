
import React, { useState } from 'react';
import { Plus, Users, Search, Phone, Code, Edit2, Trash2 } from 'lucide-react';
import { getVendors, saveVendors } from '../store';
import { Vendor } from '../types';

const Vendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>(getVendors());
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVendorName, setNewVendorName] = useState('');

  const handleAddVendor = () => {
    if (!newVendorName) return;
    
    const lastVendor = vendors.length > 0 ? vendors[vendors.length - 1] : null;
    const nextCode = lastVendor ? parseInt(lastVendor.code) + 1 : 100;

    const vendor: Vendor = {
      id: Date.now().toString(),
      code: nextCode.toString(),
      name: newVendorName,
      balance: 0
    };

    const updated = [...vendors, vendor];
    setVendors(updated);
    saveVendors(updated);
    setNewVendorName('');
    setShowAddModal(false);
  };

  const filteredVendors = vendors.filter(v => v.name.includes(searchTerm) || v.code.includes(searchTerm));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="البحث باسم المورد أو الكود..."
            className="w-full pr-12 pl-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 whitespace-nowrap"
        >
          <Plus size={20} className="ml-2" />
          إضافة مورد جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <div key={vendor.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Users size={24} />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">كود المورد</span>
                <span className="text-lg font-black text-gray-900 font-mono">#{vendor.code}</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{vendor.name}</h3>
            <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500 font-medium">المديونية الحالية:</span>
              <span className={`text-lg font-black ${vendor.balance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {vendor.balance.toLocaleString()} ج.م
              </span>
            </div>
            <div className="flex items-center gap-2">
               <button className="flex-1 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">كشف حساب</button>
               <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={16} /></button>
               <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="text-lg font-bold">إضافة شركة موردة</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">اسم الشركة</label>
                <input 
                  type="text" 
                  autoFocus
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newVendorName}
                  onChange={(e) => setNewVendorName(e.target.value)}
                  placeholder="مثال: شركة الهدى للاستيراد"
                />
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                 <p className="text-xs text-blue-600 font-bold mb-1">الكود التلقائي للمورد الجديد</p>
                 <p className="text-xl font-black text-blue-900 font-mono">#{vendors.length > 0 ? parseInt(vendors[vendors.length - 1].code) + 1 : 100}</p>
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex gap-3">
              <button onClick={handleAddVendor} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                حفظ المورد
              </button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;
