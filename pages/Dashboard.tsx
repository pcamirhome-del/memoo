
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { getSales, getProducts, getInvoices } from '../store';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    dailySales: 0,
    totalProducts: 0,
    lowStock: 0,
    activeInvoices: 0
  });

  useEffect(() => {
    const products = getProducts();
    const sales = getSales();
    const invoices = getInvoices();

    // Reset daily sales logic (Filter by current 24h)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySales = sales
      .filter(s => new Date(s.timestamp) >= today)
      .reduce((acc, curr) => acc + curr.total, 0);

    setStats({
      dailySales: todaySales,
      totalProducts: products.length,
      lowStock: products.filter(p => p.stock < 10).length,
      activeInvoices: invoices.filter(i => i.status !== 'Paid').length
    });
  }, []);

  const cards = [
    { 
      title: 'مبيعات اليوم', 
      value: `${stats.dailySales.toLocaleString()} ج.م`, 
      icon: <TrendingUp className="text-green-600" />, 
      color: 'bg-green-50',
      trend: '+12%',
      trendUp: true
    },
    { 
      title: 'إجمالي المنتجات', 
      value: stats.totalProducts, 
      icon: <Package className="text-blue-600" />, 
      color: 'bg-blue-50',
      trend: '6 فئات',
      trendUp: true
    },
    { 
      title: 'منتجات منخفضة المخزون', 
      value: stats.lowStock, 
      icon: <AlertCircle className="text-red-600" />, 
      color: 'bg-red-50',
      trend: 'تحتاج شراء',
      trendUp: false
    },
    { 
      title: 'فواتير قيد التحصيل', 
      value: stats.activeInvoices, 
      icon: <ShoppingCart className="text-purple-600" />, 
      color: 'bg-purple-50',
      trend: '8 غير مدفوعة',
      trendUp: false
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl shadow-blue-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">أهلاً بك في نظام إدارة السوبر ماركت</h2>
            <p className="text-blue-100 opacity-90">لديك {stats.lowStock} منتجات منخفضة المخزون حالياً. ننصح بمراجعة طلبات التوريد.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center border border-white/20">
            <Clock className="ml-3 text-blue-200" size={24} />
            <div className="text-sm font-medium">آخر تحديث للبيانات منذ دقيقة</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${card.color}`}>
                {card.icon}
              </div>
              <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${card.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {card.trendUp ? <ArrowUpRight size={14} className="ml-1" /> : <ArrowDownRight size={14} className="ml-1" />}
                {card.trend}
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1 font-medium">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-800 tracking-tight">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
            <Package className="ml-3 text-blue-600" />
            تنبيهات المخزون المنخفض
          </h3>
          <div className="space-y-4">
            {stats.lowStock > 0 ? (
              <p className="text-gray-500">سيتم عرض قائمة المنتجات المنخفضة هنا...</p>
            ) : (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package size={32} />
                </div>
                <p className="text-gray-600 font-medium">المخزون في حالة ممتازة حالياً</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
            <TrendingUp className="ml-3 text-green-600" />
            ملخص المبيعات الأخيرة
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium italic">الرسم البياني متاح في النسخة الكاملة</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
