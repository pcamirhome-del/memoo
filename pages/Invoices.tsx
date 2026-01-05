
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Trash2, Printer, AlertTriangle, X, CheckCircle } from 'lucide-react';
import { getVendors, getInvoices, saveInvoices, getSettings, getProducts } from '../store';
import { Vendor, Invoice, InvoiceItem, Product } from '../types';

const Invoices: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>(getVendors());
  const [invoices, setInvoices] = useState<Invoice[]>(getInvoices());
  const [products, setProducts] = useState<Product[]>(getProducts());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAlert, setShowAlert] = useState<{show: boolean, vendor?: Vendor}>({ show: false });
  const [currentInvoice, setCurrentInvoice] = useState<Partial<Invoice>>({
    vendorId: '',
    items: [],
    paidAmount: 0,
    status: 'Unpaid'
  });
  const [isPrinting, setIsPrinting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const settings = getSettings();

  const handleVendorChange = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (vendor && vendor.balance > 0) {
      setShowAlert({ show: true, vendor });
    }
    setCurrentInvoice({ ...currentInvoice, vendorId });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      productId: '',
      barcode: '',
      name: '',
      quantity: 1,
      costPrice: 0,
      sellingPrice: 0,
      total: 0
    };
    setCurrentInvoice({
      ...currentInvoice,
      items: [...(currentInvoice.items || []), newItem]
    });
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...(currentInvoice.items || [])];
    const item = { ...newItems[index], [field]: value };
    
    if (field === 'costPrice') {
      item.sellingPrice = Number(value) * (1 + settings.profitMargin / 100);
    }
    
    if (field === 'costPrice' || field === 'quantity') {
      item.total = item.costPrice * item.quantity;
    }

    newItems[index] = item;
    setCurrentInvoice({ ...currentInvoice, items: newItems });
  };

  const calculateTotal = () => {
    return (currentInvoice.items || []).reduce((sum, item) => sum + item.total, 0);
  };

  const saveInvoice = () => {
    if (!currentInvoice.vendorId || !currentInvoice.items?.length) return;

    const total = calculateTotal();
    const invoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: invoices.length > 0 ? Math.max(...invoices.map(i => i.invoiceNumber)) + 1 : 1001,
      vendorId: currentInvoice.vendorId,
      items: currentInvoice.items || [],
      totalAmount: total,
      paidAmount: Number(currentInvoice.paidAmount) || 0,
      remainingAmount: total - (Number(currentInvoice.paidAmount) || 0),
      status: Number(currentInvoice.paidAmount) >= total ? 'Paid' : 'Partial',
      date: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    const updatedInvoices = [...invoices, invoice];
    setInvoices(updatedInvoices);
    saveInvoices(updatedInvoices);
    setShowAddModal(false);
    setCurrentInvoice({ vendorId: '', items: [], paidAmount: 0 });
  };

  const handlePrint = (invoice: Invoice) => {
    setIsPrinting(true);
    // Logic for print view...
    setTimeout(() => {
        window.print();
        setIsPrinting(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">إدارة الفواتير والمشتريات</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={20} className="ml-2" />
          إنشاء فاتورة جديدة
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">رقم الفاتورة</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">الشركة</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">التاريخ</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">الإجمالي</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">الحالة</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.map((inv) => {
              const vendor = vendors.find(v => v.id === inv.vendorId);
              return (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">#{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 text-gray-700">{vendor?.name || 'مورد مجهول'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(inv.date).toLocaleDateString('ar-EG')}</td>
                  <td className="px-6 py-4 text-sm font-bold text-blue-600">{inv.totalAmount.toLocaleString()} ج.م</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${inv.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                      {inv.status === 'Paid' ? 'خالص' : 'آجل'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handlePrint(inv)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Printer size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
              <div className="flex items-center">
                <FileTextIcon className="ml-3 text-blue-400" />
                <div>
                    <h3 className="text-xl font-bold">فاتورة مشتريات جديدة</h3>
                    <p className="text-xs text-blue-200">الرقم المتوقع: #{invoices.length > 0 ? Math.max(...invoices.map(i => i.invoiceNumber)) + 1 : 1001}</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">اختيار الشركة الموردة</label>
                  <div className="relative">
                      <select 
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                        value={currentInvoice.vendorId}
                        onChange={(e) => handleVendorChange(e.target.value)}
                      >
                        <option value="">-- اختر شركة --</option>
                        {vendors.map(v => (
                          <option key={v.id} value={v.id}>{v.name} (كود: {v.code})</option>
                        ))}
                      </select>
                      <ChevronDownIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-blue-600 font-bold mb-1">تاريخ الفاتورة</p>
                        <p className="text-sm font-bold text-blue-900">{new Date().toLocaleDateString('ar-EG')}</p>
                    </div>
                    <div className="text-left">
                        <p className="text-xs text-blue-600 font-bold mb-1">تاريخ الاستحقاق (7 أيام)</p>
                        <p className="text-sm font-bold text-blue-900">{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ar-EG')}</p>
                    </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-800">الأصناف الموردة</h4>
                  <button onClick={addItem} className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                    <Plus size={16} className="ml-1" /> إضافة صنف للفاتورة
                  </button>
                </div>
                
                <div className="space-y-3">
                  {currentInvoice.items?.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-12 md:col-span-3">
                        <label className="text-[10px] font-bold text-gray-400 block mb-1">اسم الصنف</label>
                        <input 
                          placeholder="اسم الصنف..."
                          className="w-full p-2 text-sm border-b border-gray-200 focus:border-blue-500 outline-none"
                          value={item.name}
                          onChange={(e) => updateItem(idx, 'name', e.target.value)}
                        />
                      </div>
                      <div className="col-span-6 md:col-span-2">
                        <label className="text-[10px] font-bold text-gray-400 block mb-1">الباركود</label>
                        <input 
                          placeholder="الباركود"
                          className="w-full p-2 text-sm border-b border-gray-200 focus:border-blue-500 outline-none"
                          value={item.barcode}
                          onChange={(e) => updateItem(idx, 'barcode', e.target.value)}
                        />
                      </div>
                      <div className="col-span-3 md:col-span-2">
                        <label className="text-[10px] font-bold text-gray-400 block mb-1">سعر التكلفة</label>
                        <input 
                          type="number"
                          className="w-full p-2 text-sm border-b border-gray-200 focus:border-blue-500 outline-none"
                          value={item.costPrice}
                          onChange={(e) => updateItem(idx, 'costPrice', e.target.value)}
                        />
                      </div>
                      <div className="col-span-3 md:col-span-1">
                        <label className="text-[10px] font-bold text-gray-400 block mb-1">الكمية</label>
                        <input 
                          type="number"
                          className="w-full p-2 text-sm border-b border-gray-200 focus:border-blue-500 outline-none"
                          value={item.quantity}
                          onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                        />
                      </div>
                      <div className="col-span-10 md:col-span-3 bg-gray-50 p-2 rounded-lg text-center">
                        <p className="text-[10px] text-gray-400 font-bold mb-1">سعر البيع (تلقائي)</p>
                        <p className="text-sm font-bold text-blue-600">{(item.costPrice * (1 + settings.profitMargin / 100)).toFixed(2)} ج.م</p>
                      </div>
                      <div className="col-span-2 md:col-span-1 flex justify-center">
                        <button onClick={() => {
                          const items = [...(currentInvoice.items || [])];
                          items.splice(idx, 1);
                          setCurrentInvoice({...currentInvoice, items});
                        }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-bold">إجمالي القيمة:</span>
                      <span className="text-2xl font-black text-gray-900">{calculateTotal().toLocaleString()} ج.م</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1">المبلغ المدفوع</label>
                        <input 
                          type="number"
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-green-600"
                          value={currentInvoice.paidAmount}
                          onChange={(e) => setCurrentInvoice({...currentInvoice, paidAmount: Number(e.target.value)})}
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-xs font-bold text-gray-500 mb-1">المبلغ المتبقي</p>
                        <p className={`text-xl font-black ${calculateTotal() - (Number(currentInvoice.paidAmount) || 0) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {(calculateTotal() - (Number(currentInvoice.paidAmount) || 0)).toLocaleString()} ج.م
                        </p>
                      </div>
                   </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={saveInvoice} className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center">
                    <CheckCircle size={20} className="ml-2" /> حفظ الفاتورة
                  </button>
                  <button onClick={() => handlePrint(currentInvoice as Invoice)} className="px-6 py-4 bg-gray-800 text-white font-bold rounded-2xl hover:bg-gray-700 transition-all">
                    <Printer size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAlert.show && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-bounce">
              <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <AlertTriangle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">تنبيه: مديونية سابقة!</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                شركة <span className="font-bold text-gray-900">{showAlert.vendor?.name}</span> لديها فواتير سابقة غير مدفوعة بإجمالي <span className="font-bold text-red-600">{showAlert.vendor?.balance.toLocaleString()} ج.م</span>.
              </p>
              <div className="flex gap-4">
                <button onClick={() => setShowAlert({show: false})} className="flex-1 py-3 bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-600/20">
                  عرض الفواتير السابقة
                </button>
                <button onClick={() => setShowAlert({show: false})} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl">
                  تجاهل وإكمال
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const FileTextIcon = (props: any) => (
  <svg {...props} className={`w-6 h-6 ${props.className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);

const ChevronDownIcon = (props: any) => (
  <svg {...props} className={`w-4 h-4 ${props.className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
);

export default Invoices;
