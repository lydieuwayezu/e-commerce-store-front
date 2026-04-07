pages

admin

adminDashboard.tsx


import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, deleteProduct, getAllOrders, updateOrderStatus, getCategories, createCategory, updateCategory, deleteCategory } from '../../api/services';
import { Plus, Pencil, Trash2, Package, ShoppingBag, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import type { OrderStatus } from '../../types';

const ORDER_STATUSES: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

type Tab = 'products' | 'orders' | 'categories';

export default function AdminDashboard() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>('products');

  // Delete product confirmation
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  // Category form state
  const [newCatName, setNewCatName] = useState('');
  const [showNewCat, setShowNewCat] = useState(false);
  const [editCat, setEditCat] = useState<{ id: string; name: string } | null>(null);
  const [deleteCatId, setDeleteCatId] = useState<string | null>(null);

  // Queries
  const { data: products = [], isLoading: loadingProducts } = useQuery({ queryKey: ['products'], queryFn: getProducts });
  const { data: orders = [], isLoading: loadingOrders } = useQuery({ queryKey: ['allOrders'], queryFn: getAllOrders });
  const { data: categories = [], isLoading: loadingCats } = useQuery({ queryKey: ['categories'], queryFn: getCategories });

  // Mutations
  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted');
      setDeleteProductId(null);
    },
    onError: () => toast.error('Failed to delete product'),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => updateOrderStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['allOrders'] });
      toast.success('Order status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const createCatMutation = useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created');
      setNewCatName('');
      setShowNewCat(false);
    },
    onError: () => toast.error('Failed to create category'),
  });

  const updateCatMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateCategory(id, name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated');
      setEditCat(null);
    },
    onError: () => toast.error('Failed to update category'),
  });

  const deleteCatMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted');
      setDeleteCatId(null);
    },
    onError: () => toast.error('Failed to delete category'),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        {tab === 'products' && (
          <Link to="/admin/product/new" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            <Plus size={18} /> Add Product
          </Link>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600"><ShoppingBag size={20} /></div>
          <div><p className="text-2xl font-bold">{products.length}</p><p className="text-sm text-gray-500">Products</p></div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-50 text-green-600"><Package size={20} /></div>
          <div><p className="text-2xl font-bold">{orders.length}</p><p className="text-sm text-gray-500">Orders</p></div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-50 text-purple-600"><Tag size={20} /></div>
          <div><p className="text-2xl font-bold">{categories.length}</p><p className="text-sm text-gray-500">Categories</p></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {(['products', 'orders', 'categories'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${tab === t ? 'bg-white shadow text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── Products tab ── */}
      {tab === 'products' && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loadingProducts ? (
            <p className="p-8 text-center text-gray-500">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="p-8 text-center text-gray-500">No products yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {['Image', 'Name', 'Brand', 'Price', 'Stock', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <img
                          src={p.images?.[0]?.url ?? 'https://placehold.co/40x40?text=?'}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded-lg"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/40x40?text=?'; }}
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">{p.name}</td>
                      <td className="px-4 py-3 text-gray-600 text-sm">{p.brand}</td>
                      <td className="px-4 py-3 text-indigo-600 font-semibold">${p.price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link to={`/admin/product/${p.id}`} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition">
                            <Pencil size={16} />
                          </Link>
                          <button onClick={() => setDeleteProductId(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Orders tab ── */}
      {tab === 'orders' && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loadingOrders ? (
            <p className="p-8 text-center text-gray-500">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="p-8 text-center text-gray-500">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {['Order ID', 'Date', 'Total', 'Status', 'Update Status'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">{o.id.slice(0, 8)}...</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-indigo-600">
                        {o.total != null ? `$${o.total.toFixed(2)}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[o.status] ?? 'bg-gray-100 text-gray-700'}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={o.status}
                          onChange={(e) => updateStatusMutation.mutate({ id: o.id, status: e.target.value as OrderStatus })}
                          className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Categories tab ── */}
      {tab === 'categories' && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Categories</h2>
            <button onClick={() => setShowNewCat(true)} className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-700 transition">
              <Plus size={16} /> Add
            </button>
          </div>

          {/* New category input */}
          {showNewCat && (
            <div className="flex gap-2 mb-4">
              <input
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Category name"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => { if (newCatName.trim()) createCatMutation.mutate(newCatName.trim()); }}
                disabled={createCatMutation.isPending}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                Save
              </button>
              <button onClick={() => setShowNewCat(false)} className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                Cancel
              </button>
            </div>
          )}

          {loadingCats ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                  {editCat?.id === cat.id ? (
                    <div className="flex gap-2 flex-1 mr-2">
                      <input
                        value={editCat.name}
                        onChange={(e) => setEditCat({ ...editCat, name: e.target.value })}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => { if (editCat.name.trim()) updateCatMutation.mutate({ id: editCat.id, name: editCat.name.trim() }); }}
                        className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700 transition"
                      >
                        Save
                      </button>
                      <button onClick={() => setEditCat(null)} className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50 transition">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-gray-800 font-medium">{cat.name}</span>
                      <div className="flex gap-2">
                        <button onClick={() => setEditCat({ id: cat.id, name: cat.name })} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleteCatId(cat.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete product confirmation modal */}
      {deleteProductId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <p className="text-gray-800 mb-6 text-center">Are you sure you want to delete this product?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteProductId(null)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition">
                Cancel
              </button>
              <button
                onClick={() => deleteProductMutation.mutate(deleteProductId)}
                disabled={deleteProductMutation.isPending}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleteProductMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete category confirmation modal */}
      {deleteCatId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <p className="text-gray-800 mb-6 text-center">Are you sure you want to delete this category?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteCatId(null)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition">
                Cancel
              </button>
              <button
                onClick={() => deleteCatMutation.mutate(deleteCatId)}
                disabled={deleteCatMutation.isPending}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleteCatMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
