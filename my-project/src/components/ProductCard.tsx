import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isAuthenticated, isAdmin } = useAuth();

  const imageUrl = product.images?.[0]?.url ?? 'https://placehold.co/400x300?text=No+Image';

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault(); // Don't navigate to product page
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    if (isAdmin) {
      toast.error('Admins cannot add items to cart');
      return;
    }
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
    >
      {/* Product image */}
      <div className="h-48 bg-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image'; }}
        />
      </div>

      {/* Product info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-indigo-500 font-medium uppercase mb-1">{product.brand}</p>
        <h3 className="font-semibold text-gray-800 line-clamp-2 flex-1">{product.name}</h3>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-indigo-600">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-700 transition"
          >
            <ShoppingCart size={14} /> Add
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>
      </div>
    </Link>
  );
}
