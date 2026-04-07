import api from './axios';
import type { Product, Category, Order, OrderStatus } from '../types';

// ── Auth ──────────────────────────────────────────────────────────────────────
export const registerUser = (email: string, password: string) =>
  api.post('/api/auth/users/register', { email, password }).then((r) => r.data);

export const loginUser = (email: string, password: string) =>
  api.post('/api/auth/users/login', { email, password }).then((r) => r.data);

// ── Products ──────────────────────────────────────────────────────────────────
export const getProducts = (): Promise<Product[]> =>
  api.get('/api/public/products').then((r) => {
    // API returns: { data: { all: [...], grouped: {...} } }
    return r.data?.data?.all ?? [];
  });

export const getProduct = (id: string): Promise<Product> =>
  api.get(`/api/public/products/${id}`).then((r) => {
    // API returns: { data: { product: {...} } }
    return r.data?.data?.product ?? r.data?.data ?? r.data;
  });

export const createProduct = (data: object) =>
  api.post('/api/admin/products', data).then((r) => r.data);

export const updateProduct = (id: string, data: object) =>
  api.patch(`/api/admin/products/${id}`, data).then((r) => r.data);

export const deleteProduct = (id: string) =>
  api.delete(`/api/admin/products/${id}`).then((r) => r.data);

// ── Categories ────────────────────────────────────────────────────────────────
export const getCategories = (): Promise<Category[]> =>
  api.get('/api/categories').then((r) => {
    // API returns: { data: [...] }
    return r.data?.data ?? [];
  });

export const createCategory = (name: string) =>
  api.post('/api/categories', { name }).then((r) => r.data);

export const updateCategory = (id: string, name: string) =>
  api.put(`/api/categories/${id}`, { name }).then((r) => r.data);

export const deleteCategory = (id: string) =>
  api.delete(`/api/categories/${id}`).then((r) => r.data);

// ── Orders ────────────────────────────────────────────────────────────────────
// Place order from server-side cart
export const placeOrder = () =>
  api.post('/api/auth/orders').then((r) => r.data);

export const getMyOrders = (): Promise<Order[]> =>
  api.get('/api/auth/orders').then((r) => {
    return r.data?.data ?? [];
  });

export const getAllOrders = (): Promise<Order[]> =>
  api.get('/api/auth/orders/admin/all').then((r) => {
    return r.data?.data ?? [];
  });

export const updateOrderStatus = (id: string, status: OrderStatus) =>
  api.patch(`/api/auth/orders/${id}/status`, { status }).then((r) => r.data);
