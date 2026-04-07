
// ── User ──────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SELLER';
}

// ── Category ──────────────────────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
}

// ── Product ───────────────────────────────────────────────────────────────────
export interface ProductImage {
  url: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  brand: string;
  images: ProductImage[];
  categoryId: string;
  category?: { name: string };
}

// ── Cart ──────────────────────────────────────────────────────────────────────
// Local cart item stored in localStorage (client-side only)
export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

// ── Order ─────────────────────────────────────────────────────────────────────
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  status: OrderStatus;
  createdAt: string;
  total?: number;
  items?: { quantity: number; product?: Product }[];
}
