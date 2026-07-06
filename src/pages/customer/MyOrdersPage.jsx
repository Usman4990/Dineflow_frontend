// MyOrdersPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import CustomerLayout from '../../components/layout/CustomerLayout';
import OrderCard from '../../components/orders/OrderCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { RefreshCw, ClipboardList } from 'lucide-react';
import Button from '../../components/ui/Button';

export const MyOrdersPage = () => {
  const { orders, loading, error, refetch } = useOrders();
  const navigate = useNavigate();

  return (
    <CustomerLayout>
      <div className="relative overflow-hidden min-h-screen bg-[#070b13] text-slate-100 -mx-4 -my-8 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-8">

        {/* Ambient glow blobs */}
        <div className="absolute top-20 left-10 w-[350px] h-[350px] rounded-full blur-[120px] bg-orange-500/8 pointer-events-none z-0" />
        <div className="absolute bottom-20 right-10 w-[300px] h-[300px] rounded-full blur-[100px] bg-amber-500/5 pointer-events-none z-0" />

        <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-900 gap-4">
            <h2 className="text-base font-black uppercase tracking-wider flex items-center space-x-2">
              <ClipboardList className="h-5 w-5 text-orange-500" />
              <span>My Orders History</span>
            </h2>

            <Button
              onClick={refetch}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>

          {/* Content */}
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
                  message="You haven't placed any orders yet. Browse our menu to discover something delicious!"
                  actionLabel="Browse Menu"
                  onAction={() => navigate('/menu')}
                />
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <OrderCard key={order.id} order={order} onOrderChange={refetch} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
};

export default MyOrdersPage;
