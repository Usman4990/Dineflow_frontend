// Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, LogOut, ShieldAlert } from 'lucide-react';
import CartDrawer from '../cart/CartDrawer';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/menu');
  };

  const handleOpenCart = () => setIsCartOpen(true);
  const handleCloseCart = () => setIsCartOpen(false);
  const handleContinueShopping = () => setIsCartOpen(false);
  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleBrowseMenu = () => {
    if (location.pathname === '/menu') {
      const section = document.getElementById('menu');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/menu');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/70 dark:bg-[#070b13]/85 border-b border-slate-200/40 dark:border-slate-900/60 shadow-lg shadow-slate-100/5 dark:shadow-black/5 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Logo & Menu links */}
            <div className="flex">
              <Link to="/menu" className="flex-shrink-0 flex items-center space-x-2">
                <span className="h-10 w-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/25">
                  DF
                </span>
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent hidden sm:inline-block">
                  DineFlow
                </span>
              </Link>
              
              <div className="hidden sm:ml-8 sm:flex sm:space-x-3 items-center">
                <button
                  type="button"
                  onClick={handleBrowseMenu}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-350 ${
                    isActive('/menu')
                      ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
                  }`}
                >
                  Browse Menu
                </button>
                {isLoggedIn && !isAdmin && (
                  <Link
                    to="/my-orders"
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-350 ${
                      isActive('/my-orders')
                        ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    My Orders
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all duration-350 ${
                      isActive('/admin') || location.pathname.startsWith('/admin')
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <ShieldAlert className="h-4.5 w-4.5 text-amber-500" />
                    <span>Admin Panel</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart trigger */}
              {!isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleOpenCart}
                  className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent transition-all"
                  aria-label="Open cart drawer"
                >
                  <ShoppingBag className="h-5.5 w-5.5" />
                  {cartCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-black text-white ring-2 ring-white dark:ring-[#070b13] shadow-md shadow-orange-500/35"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </motion.button>
              )}

              {/* User Profile */}
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <div className="hidden md:flex flex-col text-right">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">
                      {user.name}
                    </span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold capitalize mt-1">
                      {user.role}
                    </span>
                  </div>
                  
                  <div className="h-6 w-px bg-slate-200 dark:bg-slate-850 hidden md:block"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/5 hover:text-red-600 border border-transparent transition-all duration-200 cursor-pointer"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4 stroke-[2.5]" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 rounded-xl transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-md shadow-orange-500/20"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={handleCloseCart}
        onCheckout={handleCheckout}
        onContinueShopping={handleContinueShopping}
      />
    </>
  );
};

export default Navbar;
