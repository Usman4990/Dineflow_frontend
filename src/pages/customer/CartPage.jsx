// CartPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import CustomerLayout from '../../components/layout/CustomerLayout';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import EmptyState from '../../components/common/EmptyState';
import { ArrowLeft, ShoppingBag, Sun, Moon } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { motion } from 'framer-motion';

export const CartPage = () => {
  const { cartItems, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  // Default to premium dark theme
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  const handleGoToMenu = () => {
    navigate('/menu');
  };

  return (
    <CustomerLayout>
      <div className={`relative overflow-hidden min-h-screen transition-colors duration-500 ${
        isDarkMode 
          ? 'bg-[#070b13] text-slate-100 -mx-4 -my-8 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-8' 
          : 'bg-[#fafaf9] text-slate-900 -mx-4 -my-8 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-8'
      }`}>
        
        {/* Glow Spots */}
        <div className={`absolute top-1/4 left-10 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none z-0 transition-colors duration-500 ${
          isDarkMode ? 'bg-orange-500/10' : 'bg-orange-300/15'
        }`} />
        <div className={`absolute bottom-1/4 right-10 w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none z-0 transition-colors duration-500 ${
          isDarkMode ? 'bg-amber-500/5' : 'bg-amber-300/10'
        }`} />

        <div className="relative z-10 space-y-8 max-w-5xl mx-auto">
          {/* Header */}
          <div className={`flex items-center justify-between pb-4 border-b transition-colors duration-500 ${
            isDarkMode ? 'border-slate-900' : 'border-slate-200'
          }`}>
            <Button
              onClick={handleGoToMenu}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-1 stroke-[2.5]" />
              <span>Back to Menu</span>
            </Button>
            
            <div className="flex items-center space-x-4">
              <h2 className="text-base font-black uppercase tracking-wider flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5 text-orange-500" />
                <span>Your Basket</span>
              </h2>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="px-2.5 py-1.5"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Content */}
          {cartItems.length === 0 ? (
            <div className="py-10">
              <EmptyState
                message="Your shopping cart is currently empty. Explore our delicious categories to add something tasty!"
                actionLabel="Explore Menu"
                onAction={handleGoToMenu}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">
                  <span>Items Details</span>
                  <span>Actions</span>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </motion.div>

                {/* Clear Cart Button */}
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={clearCart}
                    variant="outline"
                    size="sm"
                    className="border-red-500/20 text-red-400 hover:bg-red-500/5"
                  >
                    Clear Basket
                  </Button>
                </div>
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <CartSummary onCheckout={handleCheckout} />
              </div>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CartPage;
