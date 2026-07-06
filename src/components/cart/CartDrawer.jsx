// CartDrawer.jsx
import React, { useEffect } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

const CartDrawer = ({ isOpen, onClose, onCheckout, onContinueShopping }) => {
  const { cartItems } = useCart();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow || '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="relative z-10 flex h-full w-full max-w-lg flex-col bg-white/80 dark:bg-[#090d16]/90 border-l border-slate-100 dark:border-slate-850/80 shadow-2xl backdrop-blur-xl sm:w-[390px] text-slate-900 dark:text-slate-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850/65 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/20">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider">Your Basket</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide mt-0.5">
                    {cartItems.length > 0
                      ? `${cartItems.length} item${cartItems.length > 1 ? 's' : ''} added`
                      : 'Empty basket'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
                aria-label="Close cart drawer"
              >
                <X className="h-5 w-5 stroke-[2.5]" />
              </button>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto px-5 py-6">
              {cartItems.length === 0 ? (
                <div className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-250 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 px-6 py-12 text-center">
                  <div className="mb-4 rounded-full bg-orange-100 dark:bg-orange-500/10 p-4 text-orange-600 dark:text-orange-400">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Your basket is empty</h4>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Browse menu items and select something delicious.
                  </p>
                  <Button
                    variant="outline"
                    onClick={onContinueShopping}
                    className="mt-6"
                  >
                    Browse Delicious Food
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Summary Sticky Footer */}
            <div className="sticky bottom-0 bg-white/70 dark:bg-[#070b13]/80 border-t border-slate-100 dark:border-slate-850/65 px-5 py-5 backdrop-blur-md">
              <CartSummary onCheckout={onCheckout} />
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
