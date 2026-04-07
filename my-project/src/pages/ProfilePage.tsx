import { useQuery } from '@tanstack/react-query';
import { getMyOrders } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { Package, User } from 'lucide-react';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function ProfilePage() {
  const { user } = useAuth();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['myOrders'],
    queryFn: getMyOrders,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* User info card */}
      <div className="bg-white rounded-xl shadow p-6 mb-8 flex items-center gap-4">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
          <User size={32} className="text-indigo-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{user?.email}</h1>
          <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full mt-1">
            {user?.role}
          </span>
        </div>
      </div>

      {/* Order history */}
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Package size={20} /> My Orders
      </h2>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-24 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && orders.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Package size={48} className="mx-auto mb-3 text-gray-300" />
          <p>No orders yet. Start shopping!</p>
        </div>
      )}

      {!isLoading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-800">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                  {order.status}
                </span>
              </div>
              <div className="border-t mt-3 pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-indigo-600">
                  {order.total != null ? `$${order.total.toFixed(2)}` : '—'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
