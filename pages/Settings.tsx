
import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Check
} from 'lucide-react';
import { getUsers, saveUsers, getSettings, saveSettings } from '../store';
import { User, UserRole, UserPermissions } from '../types';

const AdminSettings: React.FC = () => {
  const [users, setUsers] = useState<User[]>(getUsers());
  const [appSettings, setAppSettings] = useState(getSettings());
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState<User | null>(null);

  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: UserRole.USER
  });

  const handleSaveSettings = () => {
    saveSettings(appSettings);
    alert('تم حفظ الإعدادات بنجاح');
  };

  const handleAddUser = () => {
    if (!newUser.username || !newUser.password) return;
    const user: User = {
      id: Date.now().toString(),
      username: newUser.username,
      password: newUser.password,
      role: newUser.role,
      permissions: {
        dashboard: true,
        inventory: true,
        invoices: true,
        vendors: true,
        reports: true,
        barcodePrint: true,
        settings: false
      }
    };
    const updated = [...users, user];
    setUsers(updated);
    saveUsers(updated);
    setShowAddUserModal(false);
    setNewUser({ username: '', password: '', role: UserRole.USER });
  };

  const togglePermission = (userId: string, permission: keyof UserPermissions) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, permissions: { ...u.permissions, [permission]: !u.permissions[permission] } };
      }
      return u;
    });
    setUsers(updated);
    saveUsers(updated);
    if (showPermissionsModal?.id === userId) {
        const found = updated.find(u => u.id === userId);
        if (found) setShowPermissionsModal(found);
    }
  };

  return (
    <div className="space-y-10">
      {/* Global Config Section */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-8 text-gray-800 flex items-center">
          <SettingsIcon className="ml-3 text-blue-600" /> إعدادات النظام العامة
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">اسم البرنامج / المتجر</label>
            <input 
              type="text" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={appSettings.appName}
              onChange={(e) => setAppSettings({...appSettings, appName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">نسبة الربح الافتراضية (%)</label>
            <div className="relative">
              <input 
                type="number" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={appSettings.profitMargin}
                onChange={(e) => setAppSettings({...appSettings, profitMargin: Number(e.target.value)})}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleSaveSettings}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center"
          >
            <Save size={20} className="ml-2" /> حفظ الإعدادات
          </button>
        </div>
      </section>

      {/* User Management Section */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Users className="ml-3 text-purple-600" /> إدارة المستخدمين والصلاحيات
          </h3>
          <button 
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20"
          >
            <UserPlus size={20} className="ml-2" /> إضافة مستخدم
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">اسم المستخدم</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">النوع</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                     <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold ml-3">
                           {u.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-gray-800">{u.username}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${u.role === UserRole.ADMIN ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role === UserRole.ADMIN ? 'مدير نظام' : 'مستخدم عادي'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                       <button 
                        onClick={() => setShowPermissionsModal(u)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors"
                       >
                          <ShieldCheck size={14} /> الصلاحيات
                       </button>
                       <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={16} /></button>
                       <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
              <h3 className="text-lg font-bold">إضافة مستخدم جديد</h3>
            </div>
            <div className="p-6 space-y-4">
               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-1">اسم المستخدم</label>
                 <input 
                  type="text" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                 />
               </div>
               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-1">كلمة المرور</label>
                 <input 
                  type="password" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                 />
               </div>
            </div>
            <div className="p-6 bg-gray-50 flex gap-3">
               <button onClick={handleAddUser} className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-purple-700 transition-all">إضافة</button>
               <button onClick={() => setShowAddUserModal(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
             <div className="bg-purple-900 text-white p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">صلاحيات المستخدم</h3>
                  <p className="text-xs text-purple-200">تعديل صلاحيات الوصول لـ: {showPermissionsModal.username}</p>
                </div>
                <button onClick={() => setShowPermissionsModal(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
                </button>
             </div>
             <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50">
                {Object.entries(showPermissionsModal.permissions).map(([key, value]) => (
                  <button 
                    key={key}
                    onClick={() => togglePermission(showPermissionsModal.id, key as keyof UserPermissions)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${value ? 'bg-white border-purple-200 shadow-sm' : 'bg-gray-100 border-gray-100 opacity-60'}`}
                  >
                    <span className={`text-sm font-bold ${value ? 'text-gray-800' : 'text-gray-400'}`}>
                      {permissionLabels[key as keyof UserPermissions]}
                    </span>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${value ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-500'}`}>
                      {value ? <Check size={14} /> : <X size={14} />}
                    </div>
                  </button>
                ))}
             </div>
             <div className="p-6 bg-white border-t border-gray-100 flex justify-center">
                <button onClick={() => setShowPermissionsModal(null)} className="px-10 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-purple-700 transition-all">
                  حفظ الصلاحيات
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const permissionLabels: Record<keyof UserPermissions, string> = {
  dashboard: 'لوحة التحكم الرئيسية',
  inventory: 'إدارة المخزون',
  invoices: 'إدارة الفواتير والمشتريات',
  vendors: 'إدارة الموردين',
  reports: 'التقارير والمبيعات',
  barcodePrint: 'طباعة الباركود',
  settings: 'إعدادات النظام (إدارة المستخدمين)'
};

export default AdminSettings;
