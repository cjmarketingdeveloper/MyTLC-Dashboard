// Enums keep your values strictly typed
export type ProductType = 'standard' | 'badge' | 'stamp' | 'flyer';
export type ContactMethod = 'Email' | 'WhatsApp' | 'Call';
export type PrintSides = 'single' | 'double';

// Core Product Interface (mirrors your Postgres table)
export interface Product {
  id: number;
  companyId: number;
  companyName?:string;
  categoryId: number;
  categoryName?:string;
  type: ProductType;  
  title: string;
  code: string;
  description?: string;
  imageUrl?: string;
  price: number;
  min_quantity: number;
  stock_count: number;
  show_stock: boolean;
  variation?: string;
  variation_value?: string;
  is_active: boolean;
}