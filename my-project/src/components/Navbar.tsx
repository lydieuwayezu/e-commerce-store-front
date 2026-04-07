import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LayoutDashboard, LogOut, Menu, X, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/');
    setMenuOpen(false);
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600" onClick={() => setMenuOpen(false)}>
          <Store size={24} /> ShopZone
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-indigo-600 transition">Home</Link>

          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition">
              <LayoutDashboard size={18} /> Admin Dashboard
            </Link>
          )}

          {isAuthenticated && !isAdmin && (
            <>
              <Link to="/cart" className="relative flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition">
                <ShoppingCart size={18} /> My Cart
                {count > 0 && (
                  <span className="absolute -top-2 -right-4 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {count}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition">
                <User size={18} /> Profile
              </Link>
            </>
          )}

          {!isAuthenticated && (
            <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
              Login
            </Link>
          )}

          {isAuthenticated && (
            <button onClick={handleLogout} className="flex items-center gap-1 text-red-500 hover:text-red-700 transition">
              <LogOut size={18} /> Logout
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-indigo-600">Home</Link>

          {isAdmin && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-1 text-gray-700 hover:text-indigo-600">
              <LayoutDashboard size={18} /> Admin Dashboard
            </Link>
          )}

          {isAuthenticated && !isAdmin && (
            <>
              <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-1 text-gray-700 hover:text-indigo-600">
                <ShoppingCart size={18} /> My Cart {count > 0 && `(${count})`}
              </Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-1 text-gray-700 hover:text-indigo-600">
                <User size={18} /> Profile
              </Link>
            </>
          )}

          {!isAuthenticated && (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-center">
              Login
            </Link>
          )}

          {isAuthenticated && (
            <button onClick={handleLogout} className="flex items-center gap-1 text-red-500">
              <LogOut size={18} /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
