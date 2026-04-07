import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { UserRoute, AdminRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductFormPage from './pages/admin/ProductFormPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<UserRoute><CartPage /></UserRoute>} />
                  <Route path="/checkout" element={<UserRoute><CheckoutPage /></UserRoute>} />
                  <Route path="/profile" element={<UserRoute><ProfilePage /></UserRoute>} />
                  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/admin/product/:id" element={<AdminRoute><ProductFormPage /></AdminRoute>} />
                  <Route path="*" element={
                    <div className="text-center py-20">
                      <h1 className="text-4xl font-bold text-gray-300 mb-4">404</h1>
                      <p className="text-gray-500">Page not found</p>
                    </div>
                  } />
                </Routes>
              </main>
            </div>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
