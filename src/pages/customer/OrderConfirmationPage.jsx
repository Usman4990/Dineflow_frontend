// OrderConfirmationPage.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import CustomerLayout from '../../components/layout/CustomerLayout';
import { formatCurrency } from '../../utils/formatCurrency';
import { CheckCircle2, ShoppingBag, ClipboardCheck } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';

export const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate  = useNavigate();

  const order = location.state?.order;
  const items = location.state?.items;

  useEffect(() => {
    if (!order) navigate('/menu', { replace: true });
  }, [order, navigate]);

  if (!order) return null;

  return (
    <CustomerLayout>
      <div className="relative overflow-hidden min-h-screen bg-[#070b13] text-slate-100 -mx-4 -my-8 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-16">

        {/* Ambient glows */}
        <div className="absolute top-20 left-10 w-[400px] h-[400px] rounded-full blur-[140px] bg-emerald-500/6 pointer-events-none z-0" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full blur-[120px] bg-orange-500/6 pointer-events-none z-0" />

        <div className="relative z-10 max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <Card
              isDarkMode={true}
              className="border-slate-800/60 bg-slate-900/40 backdrop-blur-xl p-8 shadow-2xl text-center space-y-6"
            >
              {/* Success icon */}
              <motion.div
                className="mx-auto inline-flex p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}
              >
                <CheckCircle2 className="h-12 w-12" />
              </motion.div>

              {/* Headline */}
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">Order Placed!</h2>
                <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto leading-relaxed">
                  Thank you for ordering with DineFlow. Your request has been registered and we're preparing your meal.
                </p>
              </div>

              {/* Ref badge */}
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-950/40 border border-slate-800 text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest">
                <span>Reference:</span>
                <span className="text-white">#DF-ORD-{order.id}</span>
              </div>

              {/* Receipt */}
              <div className="border-t border-slate-850/60 pt-6 text-left space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                  Summary Receipt
                </h4>

                <div className="divide-y divide-slate-850/50 bg-slate-950/20 rounded-xl px-4 py-1 border border-slate-850/40">
                  {items && items.map((item, idx) => (
                    <div key={item.id || idx} className="flex justify-between py-2.5 text-xs">
                      <span className="font-bold text-slate-300">
                        {item.name}
                        <span className="ml-1.5 text-[9px] font-black uppercase tracking-widest text-slate-600">
                          ×{item.quantity}
                        </span>
                      </span>
                      <span className="font-extrabold text-white">
                        {formatCurrency(parseFloat(item.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-xs font-bold text-slate-500 pt-1">
                  <span>Payment Method</span>
                  <span className="font-extrabold text-white">{order.payment_method}</span>
                </div>

                <div className="flex justify-between text-sm font-black text-white pt-3 border-t border-slate-850/60">
                  <span>Total Paid</span>
                  <span className="text-orange-400 text-base">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>

              {/* Action Links */}
              <div className="border-t border-slate-850/60 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/my-orders">
                  <Button variant="outline" className="w-full">
                    <ClipboardCheck className="h-4 w-4 mr-1.5" />
                    <span>Track My Orders</span>
                  </Button>
                </Link>

                <Link to="/menu">
                  <Button className="w-full">
                    <ShoppingBag className="h-4 w-4 mr-1.5" />
                    <span>Browse Menu Again</span>
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default OrderConfirmationPage;
