// CartItem.jsx
import React from 'react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { Plus, Minus, Trash2 } from 'lucide-react';
import Card from '../ui/Card';

export const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const subtotal = parseFloat(item.price) * item.quantity;

  return (
    <Card className="flex items-center justify-between p-4 border-slate-100 dark:border-slate-850/60 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md shadow-sm hover:shadow-md space-x-4">
      {/* Product Image & Info */}
      <div className="flex items-center space-x-4 flex-grow min-w-0">
        <div className="h-16 w-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-850 border border-slate-200/20 flex-shrink-0">
          <img
            src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-grow">
          <h4 className="text-xs font-bold text-slate-850 dark:text-white truncate">
            {item.name}
          </h4>
          <p className="text-[10px] text-orange-500 font-extrabold tracking-wide mt-1">
            {formatCurrency(item.price)} each
          </p>
        </div>
      </div>

      {/* Quantity & Subtotal */}
      <div className="flex items-center space-x-4 sm:space-x-6 flex-shrink-0">
        {/* Quantity Controls */}
        <div className="flex items-center space-x-2 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-1 rounded-xl">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="p-1 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-700 dark:hover:text-slate-200 hover:shadow-sm active:scale-95 transition-all cursor-pointer"
            title="Decrease quantity"
          >
            <Minus className="h-3 w-3 stroke-[2.5]" />
          </button>
          
          <span className="w-6 text-center text-xs font-bold text-slate-850 dark:text-white">
            {item.quantity}
          </span>

          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="p-1 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-700 dark:hover:text-slate-200 hover:shadow-sm active:scale-95 transition-all cursor-pointer"
            title="Increase quantity"
          >
            <Plus className="h-3 w-3 stroke-[2.5]" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[70px] hidden sm:block">
          <span className="text-xs font-black text-slate-850 dark:text-white">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {/* Remove button */}
        <button
          onClick={() => removeFromCart(item.id)}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition cursor-pointer"
          title="Remove item"
        >
          <Trash2 className="h-4 w-4 stroke-[2.5]" />
        </button>
      </div>
    </Card>
  );
};

export default CartItem;
