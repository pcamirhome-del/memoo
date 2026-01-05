
import React, { useState } from 'react';
import { Printer, FileSpreadsheet, Plus, X, Package, Trash2 } from 'lucide-react';
import { getProducts, getSettings } from '../store';
import { Product } from '../types';

interface BarcodeJob {
  product: Product;
  quantity: number;
}

const BarcodePrint: React.FC = () => {
  const [jobs, setJobs] = useState<BarcodeJob[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const products = getProducts();
  const settings = getSettings();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length > 1) {
      setSearchResults(products.filter(p => p.name.includes(term) || p.barcode.includes(term)));
    } else {
      setSearchResults([]);
    }
  };

  const addJob = (product: Product) => {
    setJobs([...jobs, { product, quantity: 1 }]);
    setSearchTerm('');
    setSearchResults([]);
  };

  const removeJob = (index: number) => {
    const newJobs = [...jobs];
    newJobs.splice(index, 1);
    setJobs(newJobs);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    alert('جاري تجهيز ملف إكسيل للباركودات...');
    // Logic for generating CSV/Excel
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 no-print">
        <h2 className="text-xl font-bold mb-6 text-gray-800">تجهيز طباعة الباركود</h2>
        
        <div className="relative mb-8">
          <label className="block text-sm font-bold text-gray-700 mb-2">ابحث عن صنف لإضافته للطباعة</label>
          <input
            type="text"
            className="w-full p-3 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="أدخل اسم المنتج أو الباركود..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-64 overflow-y-auto">
              {searchResults.map(p => (
                <button 
                  key={p.id} 
                  onClick={() => addJob(p)}
                  className="w-full p-4 flex justify-between items-center hover:bg-blue-50 transition-colors border-b border-gray-50"
                >
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.barcode}</p>
                  </div>
                  <Plus size={20} className="text-blue-500" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3 mb-8">
          {jobs.map((job, idx) => (
            <div key={idx} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
               <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <Package size={20} />
               </div>
               <div className="flex-1">
                  <p className="font-bold text-gray-800">{job.product.name}</p>
                  <p className="text-xs text-gray-500 font-mono">{job.product.barcode}</p>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">الكمية:</span>
                  <input 
                    type="number" 
                    className="w-20 p-2 bg-white border border-gray-200 rounded-lg text-center font-bold"
                    value={job.quantity}
                    onChange={(e) => {
                      const n = [...jobs];
                      n[idx].quantity = Number(e.target.value);
                      setJobs(n);
                    }}
                  />
               </div>
               <button onClick={() => removeJob(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={18} />
               </button>
            </div>
          ))}
          {jobs.length === 0 && (
            <div className="py-8 text-center text-gray-400 italic">لا توجد أصناف مختارة للطباعة بعد</div>
          )}
        </div>

        <div className="flex gap-4">
          <button 
            disabled={jobs.length === 0}
            onClick={handlePrint}
            className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center"
          >
            <Printer size={20} className="ml-2" /> طباعة الملصقات
          </button>
          <button 
            disabled={jobs.length === 0}
            onClick={handleExportExcel}
            className="flex-1 py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center"
          >
            <FileSpreadsheet size={20} className="ml-2" /> تصدير إكسيل
          </button>
        </div>
      </div>

      {/* Print View Grid */}
      <div className="hidden print:block bg-white p-4">
        <div className="grid grid-cols-5 gap-4">
          {jobs.map((job) => 
            Array.from({ length: job.quantity }).map((_, i) => (
              <div key={`${job.product.id}-${i}`} className="border-2 border-gray-300 p-3 h-48 flex flex-col items-center justify-between text-center overflow-hidden break-inside-avoid">
                 <p className="text-[14px] font-black text-blue-900 border-b w-full pb-1 uppercase">{settings.appName}</p>
                 <p className="text-[12px] font-bold text-gray-800 line-clamp-2">{job.product.name}</p>
                 <p className="text-[16px] font-black text-red-600">{job.product.sellingPrice} ج.م</p>
                 <div className="bg-white p-1 border-y w-full">
                    <p className="text-[10px] font-mono leading-none tracking-tighter overflow-hidden whitespace-nowrap">{job.product.barcode}</p>
                 </div>
                 <p className="text-[8px] text-gray-400 mt-1">طباعة: {new Date().toLocaleDateString('ar-EG')}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodePrint;
