// CartSummary.jsx
import React from 'react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

export const CartSummary = ({ onCheckout }) => {
  const { cartTotal, cartCount } = useCart();
  const deliveryCharges = 0; // Free delivery for demo purposes
  const finalTotal = cartTotal + deliveryCharges;

  return (
    <Card className="p-6 border-slate-100 dark:border-slate-850/60 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md shadow-sm space-y-4">
      <h3 className="text-xs font-black uppercase tracking-wider text-slate-850 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-850/60 flex items-center space-x-1.5">
        <ShoppingCart className="h-4.5 w-4.5 text-orange-500" />
        <span>Order Summary</span>
      </h3>

      <div className="space-y-2.5 text-xs font-bold text-slate-500 dark:text-slate-400">
        <div className="flex justify-between">
          <span>Total Items</span>
          <span className="text-slate-850 dark:text-white font-extrabold">{cartCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-slate-850 dark:text-white font-extrabold">{formatCurrency(cartTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Charges</span>
          <span className="text-emerald-500 font-extrabold uppercase tracking-wide">Free</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-850/60 flex items-center justify-between text-sm font-black text-slate-850 dark:text-white">
        <span>Grand Total</span>
        <span className="text-orange-500 text-base">{formatCurrency(finalTotal)}</span>
      </div>

      <Button
        onClick={onCheckout}
        disabled={cartCount === 0}
        className="w-full mt-4 py-3.5 uppercase tracking-widest font-black"
      >
        <span>Proceed to Checkout</span>
        <ArrowRight className="h-3.5 w-3.5 ml-1.5 stroke-[3]" />
      </Button>
    </Card>
  );
};

export default CartSummary;
