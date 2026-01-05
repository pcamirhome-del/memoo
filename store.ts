
import { User, Product, Vendor, Invoice, Sale, AppSettings, UserRole, OrderRequest } from './types';

const STORAGE_KEYS = {
  USERS: 'sm_users',
  PRODUCTS: 'sm_products',
  VENDORS: 'sm_vendors',
  INVOICES: 'sm_invoices',
  SALES: 'sm_sales',
  SETTINGS: 'sm_settings',
  ORDERS: 'sm_orders',
  CURRENT_USER: 'sm_current_user'
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

export const getStoredData = <T,>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

export const setStoredData = <T,>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
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
