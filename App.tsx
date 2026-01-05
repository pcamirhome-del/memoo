
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Users, 
  PieChart, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Printer,
  ChevronRight,
  ShoppingCart
} from 'lucide-react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Invoices from './pages/Invoices';
import Vendors from './pages/Vendors';
import Reports from './pages/Reports';
import BarcodePrint from './pages/BarcodePrint';
import AdminSettings from './pages/Settings';
import Orders from './pages/Orders';
import { User, UserRole } from './types';
import { getCurrentUser, setCurrentUser, getSettings } from './store';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appName, setAppName] = useState(getSettings().appName);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  useEffect(() => {
    const settings = getSettings();
    setAppName(settings.appName);
  }, [activeTab]);

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
  };

  const handleLogin = (loggedUser: User) => {
    setCurrentUser(loggedUser);
    setUser(loggedUser);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <Inventory />;
      case 'invoices': return <Invoices />;
      case 'orders': return <Orders />;
      case 'vendors': return <Vendors />;
      case 'reports': return <Reports />;
      case 'barcode': return <BarcodePrint />;
      case 'settings': return <AdminSettings />;
      default: return <Dashboard />;
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: <LayoutDashboard size={20} />, permission: 'dashboard' },
    { id: 'inventory', label: 'المخزون', icon: <Package size={20} />, permission: 'inventory' },
    { id: 'invoices', label: 'الفواتير والمشتريات', icon: <FileText size={20} />, permission: 'invoices' },
    { id: 'orders', label: 'طلبات التوريد', icon: <ShoppingCart size={20} />, permission: 'invoices' },
    { id: 'vendors', label: 'الموردين', icon: <Users size={20} />, permission: 'vendors' },
    { id: 'reports', label: 'التقارير والمبيعات', icon: <PieChart size={20} />, permission: 'reports' },
    { id: 'barcode', label: 'طباعة الباركود', icon: <Printer size={20} />, permission: 'barcodePrint' },
    { id: 'settings', label: 'الإعدادات', icon: <Settings size={20} />, permission: 'settings' },
  ];

  const allowedMenuItems = menuItems.filter(item => user.permissions[item.permission as keyof typeof user.permissions]);

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans" dir="rtl">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`fixed inset-y-0 right-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-slate-800">
          <span className="text-xl font-bold tracking-wider truncate">{appName}</span>
          <button className="lg:hidden text-gray-300 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="mt-4 px-3 space-y-1">
          {allowedMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg group ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="ml-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <div className="flex items-center px-4 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold ml-3">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.username}</p>
              <p className="text-xs text-gray-400 capitalize">{user.role === UserRole.ADMIN ? 'مدير النظام' : 'مستخدم عادي'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut size={18} className="ml-3" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center">
            <button 
              className="p-2 mr-2 text-gray-500 lg:hidden hover:bg-gray-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold text-gray-800 lg:text-xl">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center space-x-4 space-x-reverse text-gray-600 text-sm hidden sm:flex">
             <LiveClock />
          </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-auto p-4 lg:p-8 bg-gray-50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const LiveClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('ar-EG', options);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-EG', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: true 
    });
  };

  return (
    <div className="flex flex-col items-end">
      <span className="font-semibold text-blue-700">{formatTime(time)}</span>
      <span className="text-xs text-gray-500">{formatDate(time)}</span>
    </div>
  );
};

export default App;
