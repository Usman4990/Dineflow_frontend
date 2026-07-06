// OrderCard.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { cancelOrder } from '../../services/orderService';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import OrderStatusStepper from './OrderStatusStepper';
import FeedbackForm from './FeedbackForm';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Calendar, CreditCard, DollarSign, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OrderCard = ({ order, onOrderChange }) => {
  const { token } = useAuth();
  const [cancelling, setCancelling]   = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [feedback, setFeedback]       = useState(order.feedback?.[0] || null);

  const handleCancel = async () => {
    setCancelError(null);
    setCancelling(true);
    try {
      await cancelOrder(order.id, token);
      onOrderChange?.();
    } catch (err) {
      console.error('Cancel order failed:', err);
      setCancelError(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  const canCancel       = ['Pending', 'Preparing'].includes(order.status);
  const showFeedbackForm = order.status === 'Completed' && !feedback;
  const hasFeedback      = Boolean(feedback);

  const statusVariant =
    order.status === 'Completed' ? 'success' :
    order.status === 'Preparing' ? 'info'    :
    order.status === 'Cancelled' ? 'danger'  : 'warning';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Card
        isDarkMode={true}
        className="border-slate-800/60 bg-slate-900/40 backdrop-blur-xl p-6 shadow-lg space-y-5"
      >
        {/* Order header row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-4 border-b border-slate-850/60">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">
              Order Reference
            </span>
            <h4 className="text-base font-black text-white">#DF-ORD-{order.id}</h4>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={statusVariant}>{order.status}</Badge>

            <span className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-500">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(order.created_at)}</span>
            </span>

            <span className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-500">
              {order.payment_method === 'Card' ? (
                <CreditCard className="h-3.5 w-3.5" />
              ) : (
                <DollarSign className="h-3.5 w-3.5" />
              )}
              <span>{order.payment_method}</span>
            </span>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-2">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-600">Items Ordered</h5>
          <div className="divide-y divide-slate-850/50 bg-slate-950/20 rounded-xl px-4 py-1 border border-slate-850/40">
            {order.items && order.items.map((item, idx) => (
              <div key={item.id || idx} className="flex items-center justify-between py-2.5 text-xs">
                <span className="font-bold text-slate-200">
                  {item.name || 'Menu Item'}
                  <span className="ml-1.5 text-[9px] font-black uppercase tracking-widest text-slate-600">
                    ×{item.quantity}
                  </span>
                </span>
                <span className="font-extrabold text-white">
                  {formatCurrency(parseFloat(item.unit_price) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stepper + Total */}
        <div className="pt-2 border-t border-slate-850/50 space-y-4">
          <OrderStatusStepper status={order.status} />

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
              Grand Total
            </span>
            <span className="text-lg font-black text-orange-400">
              {formatCurrency(order.total_amount)}
            </span>
          </div>
        </div>

        {/* Cancel */}
        <AnimatePresence>
          {canCancel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-3 border-t border-slate-850/50 space-y-2"
            >
              <Button
                type="button"
                onClick={handleCancel}
                disabled={cancelling}
                variant="outline"
                size="sm"
                className="border-red-500/20 text-red-400 hover:bg-red-500/5"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </Button>
              {cancelError && (
                <p className="text-xs font-bold text-red-400">{cancelError}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Existing feedback display */}
        {hasFeedback && (
          <div className="pt-4 border-t border-slate-850/50 space-y-2">
            <h6 className="text-[10px] font-black uppercase tracking-widest text-slate-600">Your Feedback</h6>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Rating:</span>
              <span className="inline-flex items-center gap-0.5">
                {Array.from({ length: feedback.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </span>
            </div>
            <p className="text-xs text-slate-400 bg-slate-950/30 rounded-xl px-4 py-3 border border-slate-850/40 italic leading-relaxed">
              "{feedback.comment || 'No comment provided.'}"
            </p>
          </div>
        )}

        {/* Feedback form */}
        {showFeedbackForm && (
          <div className="pt-4 border-t border-slate-850/50 space-y-3">
            <h6 className="text-[10px] font-black uppercase tracking-widest text-slate-600">Leave Feedback</h6>
            <FeedbackForm
              order={order}
              token={token}
              onFeedbackSubmitted={(newFeedback) => setFeedback(newFeedback)}
            />
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default OrderCard;
