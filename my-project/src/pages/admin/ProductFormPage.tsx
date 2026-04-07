import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProduct, getCategories, createProduct, updateProduct } from '../../api/services';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface FormData {
  name: string;
  description: string;
  brand: string;
  price: string;
  stock: string;
  categoryId: string;
  images: string[]; // list of image URLs
}

const emptyForm: FormData = {
  name: '', description: '', brand: '',
  price: '', stock: '', categoryId: '', images: [''],
};

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Fetch categories for the dropdown
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: getCategories });

  // Fetch existing product when editing
  const { data: existing } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id!),
    enabled: isEdit,
  });

  // Populate form when editing
  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name ?? '',
        description: existing.description ?? '',
        brand: existing.brand ?? '',
        price: String(existing.price ?? ''),
        stock: String(existing.stock ?? ''),
        categoryId: existing.categoryId ?? '',
        images: existing.images?.map((img) => img.url).filter(Boolean) ?? [''],
      });
    }
  }, [existing]);

  function validate() {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    else if (form.description.trim().length < 20) e.description = 'Description must be at least 20 characters';
    if (!form.brand.trim()) e.brand = 'Brand is required';
    if (!form.price) e.price = 'Price is required';
    else if (isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Price must be a positive number';
    if (form.stock === '') e.stock = 'Stock is required';
    else if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) e.stock = 'Stock must be a whole number (0 or more)';
    if (!form.categoryId) e.categoryId = 'Category is required';
    if (form.images.every((url) => !url.trim())) e.images = 'At least one image URL is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const mutation = useMutation({
    mutationFn: (payload: object) =>
      isEdit ? updateProduct(id!, payload) : createProduct(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success(isEdit ? 'Product updated!' : 'Product created!');
      navigate('/admin');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? 'Operation failed');
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      brand: form.brand.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: form.categoryId,
      // API requires images as objects: { url, format, size }
      images: form.images
        .filter((url) => url.trim())
        .map((url) => ({ url: url.trim(), format: 'JPG', size: 0 })),
    };

    mutation.mutate(payload);
  }

  function updateImage(index: number, value: string) {
    const updated = [...form.images];
    updated[index] = value;
    setForm((prev) => ({ ...prev, images: updated }));
  }

  function addImageField() {
    setForm((prev) => ({ ...prev, images: [...prev.images, ''] }));
  }

  function removeImageField(index: number) {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  }

  const inputClass = (field: keyof FormData) =>
    `w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors[field] ? 'border-red-500' : 'border-gray-300'}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition">
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-5">

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. iPhone 15 Pro" className={inputClass('name')} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description * (min 20 chars)</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            placeholder="Describe the product in detail..."
            className={`${inputClass('description')} resize-none`}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
          <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="e.g. Apple" className={inputClass('brand')} />
          {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
        </div>

        {/* Price and Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
            <input type="number" step="0.01" min="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" className={inputClass('price')} />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
            <input type="number" step="1" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="0" className={inputClass('stock')} />
            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={inputClass('categoryId')}>
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
        </div>

        {/* Images */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Image URLs * (at least one)</label>
            <button type="button" onClick={addImageField} className="flex items-center gap-1 text-indigo-600 text-sm hover:text-indigo-800 transition">
              <Plus size={14} /> Add Image
            </button>
          </div>
          {errors.images && <p className="text-red-500 text-xs mb-2">{errors.images}</p>}
          <div className="space-y-2">
            {form.images.map((url, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={url}
                  onChange={(e) => updateImage(i, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {form.images.length > 1 && (
                  <button type="button" onClick={() => removeImageField(i)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {mutation.isPending
            ? (isEdit ? 'Updating...' : 'Creating...')
            : (isEdit ? 'Update Product' : 'Create Product')}
        </button>
      </form>
    </div>
  );
}
