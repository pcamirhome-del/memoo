
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Camera, 
  Package, 
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  Share2
} from 'lucide-react';
import { getProducts, saveProducts, getVendors, getSettings } from '../store';
import { Product } from '../types';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(getProducts());
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const settings = getSettings();

  const filteredProducts = products.filter(p => 
    p.name.includes(searchTerm) || 
    p.barcode.includes(searchTerm)
  );

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    barcode: '',
    name: '',
    costPrice: 0,
    sellingPrice: 0,
    stock: 0,
    category: '',
    unit: 'قطعة'
  });

  const handleAddProduct = () => {
    if (!newProduct.barcode || !newProduct.name) return;
    
    const product: Product = {
      id: Date.now().toString(),
      barcode: newProduct.barcode!,
      name: newProduct.name!,
      companyId: '0', // Default or selected company
      costPrice: Number(newProduct.costPrice),
      sellingPrice: Number(newProduct.costPrice) * (1 + settings.profitMargin / 100),
      stock: Number(newProduct.stock),
      category: newProduct.category,
      unit: newProduct.unit,
      lastUpdated: new Date().toISOString()
    };

    const updated = [...products, product];
    setProducts(updated);
    saveProducts(updated);
    setShowAddModal(false);
    setNewProduct({ barcode: '', name: '', costPrice: 0, sellingPrice: 0, stock: 0 });
  };

  const handleWhatsAppShare = (product: Product) => {
    const text = `صنف: ${product.name}\nالباركود: ${product.barcode}\nالسعر: ${product.sellingPrice} ج.م\nالمخزون الحالي: ${product.stock}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="البحث بالاسم، الباركود، أو الشركة..."
            className="w-full pr-12 pl-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsScanning(!isScanning)}
            className={`flex items-center px-4 py-3 rounded-xl font-bold transition-all ${isScanning ? 'bg-red-500 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
          >
            <Camera size={20} className="ml-2" />
            {isScanning ? 'إغلاق الكاميرا' : 'مسح باركود'}
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus size={20} className="ml-2" />
            إضافة صنف
          </button>
        </div>
      </div>

      {isScanning && (
        <div className="bg-black aspect-video rounded-2xl flex items-center justify-center text-white overflow-hidden relative">
          <div className="absolute inset-0 border-2 border-blue-500 opacity-50 m-12 pointer-events-none"></div>
          <p className="text-lg font-bold">جاري تفعيل الكاميرا...</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">الصنف</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">الباركود</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">سعر التكلفة</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">سعر البيع</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">المخزون</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 ml-3">
                        <Package size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.category || 'بدون فئة'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono font-medium text-gray-600">{product.barcode}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{product.costPrice} ج.م</td>
                  <td className="px-6 py-4 text-sm font-bold text-blue-600">{product.sellingPrice} ج.م</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${product.stock < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {product.stock} {product.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleWhatsAppShare(product)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="مشاركة واتساب">
                        <Share2 size={18} />
                      </button>
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center text-gray-500">
              <Package size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">لم يتم العثور على منتجات</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200 shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">إضافة صنف جديد</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <XIcon />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">اسم الصنف</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">الباركود</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                  value={newProduct.barcode}
                  onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">المخزون الأولي</label>
                <input 
                  type="number" 
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">سعر التكلفة</label>
                <input 
                  type="number" 
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg"
                  value={newProduct.costPrice}
                  onChange={(e) => setNewProduct({...newProduct, costPrice: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">سعر البيع (تلقائي)</label>
                <div className="w-full p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 font-bold">
                  {((newProduct.costPrice || 0) * (1 + settings.profitMargin / 100)).toFixed(2)} ج.م
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex gap-3">
              <button onClick={handleAddProduct} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">
                حفظ المنتج
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

const XIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
);

export default Inventory;
