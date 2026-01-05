
import { User, Product, Vendor, Invoice, Sale, AppSettings, UserRole, OrderRequest } from './types';

// إعدادات Firebase (تم دمجها برمجياً لاستخدامها في التوسعات القادمة)
const firebaseConfig = {
  apiKey: "AIzaSyAYdWvZbTTkGlfI6vv02EFUMbw5eeF4UpU",
  authDomain: "sample-firebase-adddi-app.firebaseapp.com",
  databaseURL: "https://sample-firebase-adddi-app-default-rtdb.firebaseio.com",
  projectId: "sample-firebase-adddi-app",
  storageBucket: "sample-firebase-adddi-app.firebasestorage.app",
  messagingSenderId: "1013529485030",
  appId: "1:1013529485030:web:3dd9b79cd7d7ba41b42527"
};

const STORAGE_KEYS = {
  USERS: 'sm_users',
  PRODUCTS: 'sm_products',
  VENDORS: 'sm_vendors',
  INVOICES: 'sm_invoices',
  SALES: 'sm_sales',
  SETTINGS: 'sm_settings',
  ORDERS: 'sm_orders',
  CURRENT_USER: 'sm_current_user',
  INITIALIZED: 'sm_initialized'
};

const defaultPermissions = {
  dashboard: true,
  inventory: true,
  invoices: true,
  vendors: true,
  reports: true,
  barcodePrint: true,
  settings: true
};

const initialUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin',
    role: UserRole.ADMIN,
    permissions: { ...defaultPermissions }
  }
];

const initialSettings: AppSettings = {
  appName: 'سوبر ماركت الهدى',
  profitMargin: 15
};

// بيانات تجريبية لملء النظام عند التشغيل الأول
const seedData = {
  vendors: [
    { id: 'v1', code: '100', name: 'شركة النيل للتوريدات', balance: 5400 },
    { id: 'v2', code: '101', name: 'مؤسسة الأمل التجارية', balance: 0 }
  ],
  products: [
    { id: 'p1', barcode: '6221234567890', name: 'أرز فاخر 1 كجم', companyId: 'v1', costPrice: 20, sellingPrice: 23, stock: 50, category: 'مواد غذائية', unit: 'كيس', lastUpdated: new Date().toISOString() },
    { id: 'p2', barcode: '6220987654321', name: 'زيت دوار الشمس 1 لتر', companyId: 'v1', costPrice: 45, sellingPrice: 52, stock: 8, category: 'زيوت', unit: 'زجاجة', lastUpdated: new Date().toISOString() }
  ]
};

export const getStoredData = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

export const setStoredData = <T,>(key: string, value: T): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// دالة تهيئة النظام بالبيانات لأول مرة
export const initializeSystem = () => {
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (!isInitialized) {
    saveUsers(initialUsers);
    saveSettings(initialSettings);
    saveVendors(seedData.vendors);
    saveProducts(seedData.products);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    console.log("System Initialized with seed data");
  }
};

// Data Helpers
export const getUsers = () => getStoredData<User[]>(STORAGE_KEYS.USERS, initialUsers);
export const saveUsers = (users: User[]) => setStoredData(STORAGE_KEYS.USERS, users);

export const getProducts = () => getStoredData<Product[]>(STORAGE_KEYS.PRODUCTS, []);
export const saveProducts = (products: Product[]) => setStoredData(STORAGE_KEYS.PRODUCTS, products);

export const getVendors = () => getStoredData<Vendor[]>(STORAGE_KEYS.VENDORS, []);
export const saveVendors = (vendors: Vendor[]) => setStoredData(STORAGE_KEYS.VENDORS, vendors);

export const getInvoices = () => getStoredData<Invoice[]>(STORAGE_KEYS.INVOICES, []);
export const saveInvoices = (invoices: Invoice[]) => setStoredData(STORAGE_KEYS.INVOICES, invoices);

export const getSales = () => getStoredData<Sale[]>(STORAGE_KEYS.SALES, []);
export const saveSales = (sales: Sale[]) => setStoredData(STORAGE_KEYS.SALES, sales);

export const getOrders = () => getStoredData<OrderRequest[]>(STORAGE_KEYS.ORDERS, []);
export const saveOrders = (orders: OrderRequest[]) => setStoredData(STORAGE_KEYS.ORDERS, orders);

export const getSettings = () => getStoredData<AppSettings>(STORAGE_KEYS.SETTINGS, initialSettings);
export const saveSettings = (settings: AppSettings) => setStoredData(STORAGE_KEYS.SETTINGS, settings);

export const getCurrentUser = () => getStoredData<User | null>(STORAGE_KEYS.CURRENT_USER, null);
export const setCurrentUser = (user: User | null) => setStoredData(STORAGE_KEYS.CURRENT_USER, user);
