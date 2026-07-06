// AdminOrdersPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../hooks/useOrders';
import { updateOrderStatus, cancelOrder } from '../../services/orderService';
import AdminLayout from '../../components/layout/AdminLayout';
import OrdersTable from '../../components/admin/OrdersTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { RefreshCw } from 'lucide-react';
import Button from '../../components/ui/Button';

export const AdminOrdersPage = () => {
  const { token } = useAuth();
  const { orders, loading, error, refetch } = useOrders();
  const [actionError, setActionError] = useState('');

  const handleStatusChange = async (orderId, newStatus) => {
    setActionError('');
    try {
      await updateOrderStatus(orderId, newStatus, token);
      refetch();
    } catch (err) {
      console.error('Failed to update order status:', err);
      setActionError(err.response?.data?.message || 'Error occurred while updating order status.');
    }
  };

  const handleCancelOrder = async (orderId) => {
    setActionError('');
    try {
      await cancelOrder(orderId, token);
      refetch();
    } catch (err) {
      console.error('Failed to cancel order:', err);
      setActionError(err.response?.data?.message || 'Error occurred while canceling the order.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-900/60">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Manage Orders Queue</h2>
            <p className="text-xs text-slate-400 mt-1">Review active customer requests, manage payment status, and dispatch dishes.</p>
          </div>
          <Button
            onClick={refetch}
            loading={loading}
            variant="outline"
            className="self-start sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Queue</span>
          </Button>
        </div>

        {/* Action Error Banner */}
        {actionError && (
          <div className="p-4 bg-red-500/5 border border-red-500/20 text-xs font-bold text-red-400 rounded-xl leading-relaxed">
            {actionError}
          </div>
        )}

        {/* Loaders / Errors / Table */}
        {loading && (
          <div className="py-20 flex justify-center">
            <LoadingSpinner />
          </div>
        )}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && (
          <>
            {orders.length === 0 ? (
              <EmptyState
                message="No customer orders have been placed in the system yet. Once placed, they will appear in this queue!"
              />
            ) : (
              <OrdersTable orders={orders} onStatusChange={handleStatusChange} onCancel={handleCancelOrder} />
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
