
import React, { useState } from 'react';
import { ShoppingCart, Plus, Search, Truck, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { getVendors, getOrders, saveOrders } from '../store';
import { Vendor, OrderRequest } from '../types';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderRequest[]>(getOrders());
  const [vendors] = useState<Vendor[]>(getVendors());
  const [showDraftModal, setShowDraftModal] = useState(false);

  const toggleStatus = (orderId: string) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: o.status === 'Pending' ? 'Received' : 'Pending' } as OrderRequest;
      }
      return o;
    });
    setOrders(updated);
    saveOrders(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">طلبات التوريد</h2>
        <button 
          onClick={() => setShowDraftModal(true)}
          className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={20} className="ml-2" />
          طلب توريد جديد
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {orders.map((order) => {
          const vendor = vendors.find(v => v.id === order.vendorId);
          return (
            <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center">
                     <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center ml-4">
                        <Truck size={24} />
                     </div>
                     <div>
                        <h3 className="text-lg font-bold text-gray-800">{vendor?.name || 'مورد مجهول'}</h3>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Clock size={12} className="ml-1" /> تم الطلب في {new Date(order.date).toLocaleDateString('ar-EG')}
                        </p>
                     </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${order.status === 'Received' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {order.status === 'Received' ? 'تم الاستلام' : 'قيد الانتظار'}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-xl border border-gray-100">
                       <span className="font-medium text-gray-700">{item.name}</span>
                       <span className="font-bold text-indigo-600">الكمية: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 border-t border-gray-100 pt-6">
                 <button 
                   onClick={() => toggleStatus(order.id)}
                   className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center ${order.status === 'Received' ? 'bg-gray-100 text-gray-400' : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/20'}`}
                 >
                    {order.status === 'Received' ? <CheckCircle size={18} className="ml-2" /> : <Plus size={18} className="ml-2" />}
                    {order.status === 'Received' ? 'مستلمة بالفعل' : 'تحديد كمستلم'}
                 </button>
                 <button className="px-6 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50">
                    تفاصيل
                 </button>
              </div>
            </div>
          );
        })}
        {orders.length === 0 && (
          <div className="lg:col-span-2 py-32 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
             <ShoppingCart size={64} className="mx-auto text-gray-200 mb-4" />
             <p className="text-xl font-medium text-gray-400">لا توجد طلبات توريد حالية</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
