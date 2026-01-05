
import React, { useState, useEffect } from 'react';
import { Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { getUsers, setCurrentUser } from '../store';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getUsers();
    const foundUser = users.find(u => u.username === username && u.password === password);

    if (foundUser) {
      setLoggedInUser(foundUser);
      setShowSuccess(true);
      setTimeout(() => {
        onLogin(foundUser);
      }, 1500);
    } else {
      setError('خطأ في اسم المستخدم أو كلمة المرور');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-EG', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-EG', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-950 flex items-center justify-center p-4" dir="rtl">
      {showSuccess && loggedInUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center transform transition-all scale-100 animate-bounce">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">مرحباً {loggedInUser.username}</h2>
            <p className="text-gray-500">جاري توجيهك إلى لوحة التحكم...</p>
          </div>
        </div>
      )}

      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20 transform rotate-12">
            <Lock className="text-white transform -rotate-12" size={36} />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">نظام إدارة السوبر ماركت</h1>
          <p className="text-blue-200 text-sm font-medium">{formatDate(time)} - {formatTime(time)}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-r-4 border-red-500 p-4 rounded-lg flex items-center text-red-700">
                  <AlertCircle size={20} className="ml-3 shrink-0" />
                  <span className="text-sm font-semibold">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">اسم المستخدم</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                    <UserIcon size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                    placeholder="أدخل اسم المستخدم"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                    placeholder="أدخل كلمة المرور"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transform transition-all active:scale-95 focus:outline-none"
              >
                تسجيل الدخول
              </button>
            </form>
          </div>
          <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
            <p className="text-xs text-gray-400">جميع الحقوق محفوظة &copy; {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
