
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface UserPermissions {
  dashboard: boolean;
  inventory: boolean;
  invoices: boolean;
  vendors: boolean;
  reports: boolean;
  barcodePrint: boolean;
  settings: boolean;
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  permissions: UserPermissions;
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  companyId: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  category?: string;
  unit?: string;
  description?: string;
  lastUpdated: string;
}

export interface Vendor {
  id: string;
  code: string; // Starts from 100
  name: string;
  balance: number;
}

export interface InvoiceItem {
  productId: string;
  barcode: string;
  name: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: number; // Starts from 1001
  vendorId: string;
  items: InvoiceItem[];
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'Paid' | 'Partial' | 'Unpaid';
  date: string;
  expiryDate: string; // Date + 7 days
}

export interface OrderRequest {
  id: string;
  vendorId: string;
  items: InvoiceItem[];
  status: 'Pending' | 'Received';
  date: string;
}

export interface Sale {
  id: string;
  items: InvoiceItem[];
  total: number;
  timestamp: string;
}

export interface AppSettings {
  appName: string;
  profitMargin: number; // Default 15%
}
