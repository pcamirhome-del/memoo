
import React, { useState } from 'react';
import { PieChart, TrendingUp, Calendar, Filter, Download } from 'lucide-react';
import { getSales } from '../store';

const Reports: React.FC = () => {
  const [filter, setFilter] = useState('daily');
  const sales = getSales();

  const calculateTotal = () => sales.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">التقارير والمبيعات</h2>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
           {['daily', 'monthly', 'yearly', 'total'].map((f) => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === f ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
             >
               {f === 'daily' ? 'اليوم' : f === 'monthly' ? 'الشهر' : f === 'yearly' ? 'السنة' : 'الإجمالي'}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[400px]">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <TrendingUp className="ml-2 text-green-600" /> حركة المبيعات
              </h3>
              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                <Download size={20} />
              </button>
           </div>
           
           <div className="h-64 flex items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400 font-medium italic">سيتم عرض الرسم البياني لتوزيع المبيعات هنا</p>
           </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20">
             <p className="text-blue-100 font-medium mb-2 opacity-80">إجمالي إيرادات المبيعات</p>
             <h3 className="text-4xl font-black mb-6">{calculateTotal().toLocaleString()} <span className="text-lg">ج.م</span></h3>
             <div className="pt-6 border-t border-white/10 flex justify-between">
                <div>
                   <p className="text-[10px] text-blue-200 uppercase font-bold">عمليات اليوم</p>
                   <p className="text-xl font-bold">12</p>
                </div>
                <div className="text-left">
                   <p className="text-[10px] text-blue-200 uppercase font-bold">النمو</p>
                   <p className="text-xl font-bold">+5.4%</p>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
             <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                <Calendar className="ml-2 text-purple-600" /> ملخص مبيعات اليوم
             </h4>
             <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                   <span className="text-gray-600 text-sm font-medium">مبيعات نقدية</span>
                   <span className="font-bold text-gray-900">4,250 ج.م</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                   <span className="text-gray-600 text-sm font-medium">مبيعات بطاقة</span>
                   <span className="font-bold text-gray-900">1,120 ج.م</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                   <span className="text-gray-600 text-sm font-medium">مبيعات آجلة</span>
                   <span className="font-bold text-orange-600">650 ج.م</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
