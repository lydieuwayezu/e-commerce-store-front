import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQty, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some products to get started</p>
        <Link to="/" className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 transition">
          Clear all
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="bg-white rounded-xl shadow p-4 flex gap-4">
              <img
                src={item.product.images?.[0]?.url ?? 'https://placehold.co/80x80?text=?'}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x80?text=?'; }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">{item.product.name}</h3>
                <p className="text-indigo-600 font-bold">${item.product.price.toFixed(2)}</p>
                {/* Quantity controls */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQty(item.productId, item.quantity - 1)}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.productId, item.quantity + 1)}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeItem(item.productId)} className="text-red-400 hover:text-red-600 transition">
                  <Trash2 size={18} />
                </button>
                <p className="font-bold text-gray-800">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-xl shadow p-6 h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm text-gray-600">
                <span className="truncate mr-2">{item.product.name} x{item.quantity}</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-indigo-600">${total.toFixed(2)}</span>
          </div>
          <Link
            to="/checkout"
            className="block mt-4 bg-indigo-600 text-white text-center py-3 rounded-xl hover:bg-indigo-700 transition font-semibold"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
